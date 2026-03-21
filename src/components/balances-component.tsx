import { useEffect } from "react"
import { useReadContracts, useBalance } from "wagmi"
import { useAtomValue, useSetAtom } from "jotai"
import { Skeleton } from "@/components/ui/skeleton"
import { formatUnits, erc20Abi } from "viem"
import type { Address } from "viem"
import { RefreshCw, TriangleAlert } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { activeWalletAtom } from "@/atoms/activeWalletAtom"
import { stablecoinTotalAtom } from "@/atoms/stablecoinTotalAtom"
import { selectedChainAtom } from "@/atoms/selectedChainAtom"
import { TOKENS } from "@/lib/um-token-list"
import { Button } from "@/components/ui/button"

const STABLECOIN_SYMBOLS = ["USDC", "USDT", "USDbC", "DAI"]

export default function BalancesComponent() {
  const activeWallet = useAtomValue(activeWalletAtom)
  const setStablecoinTotal = useSetAtom(stablecoinTotalAtom)
  const selectedChain = useAtomValue(selectedChainAtom)

  const address = activeWallet?.address as Address | undefined
  const isQueryEnabled = !!address
  const tokens = (TOKENS[selectedChain] ?? []).filter((t) =>
    STABLECOIN_SYMBOLS.includes(t.symbol)
  )

  const { data: nativeBalance, isLoading: isLoadingNative, isError: isErrorNative, refetch: refetchNative } = useBalance({
    address,
    chainId: selectedChain,
    query: { enabled: isQueryEnabled, refetchOnMount: false },
  })

  const { data: tokenBalances, isLoading, isError, refetch: refetchTokens } = useReadContracts({
    contracts: tokens.map((token) => ({
      address: token.address as Address,
      abi: erc20Abi,
      functionName: "balanceOf" as const,
      args: [address!] as [Address],
      chainId: selectedChain,
    })),
    query: { enabled: isQueryEnabled && tokens.length > 0, refetchOnMount: false },
  })

  useEffect(() => {
    if (!tokenBalances) return
    const total = tokenBalances.reduce((acc, raw, i) => {
      const token = tokens[i]
      const rawBalance = raw?.status === "success" ? (raw.result as bigint) : BigInt(0)
      return acc + parseFloat(formatUnits(rawBalance, token.decimals))
    }, 0)
    setStablecoinTotal(total)
  }, [tokenBalances, setStablecoinTotal])

  return (
    <div className="bg-secondary rounded-none p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Balances</h2>
        <Button className="hover:cursor-pointer" variant="ghost" size="icon" onClick={() => { refetchNative(); refetchTokens() }}>
          <RefreshCw className={`w-3 h-3 ${isLoading || isLoadingNative ? "animate-spin" : ""}`} />
        </Button>
      </div>
      {isError && (
        <Alert className="border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Failed</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>Account creation failed or was cancelled.</span>
          <Button
            variant="outline"
            size="sm"
            className="ml-4 rounded-none"
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </AlertDescription>
      </Alert>
      )}
      <div className="flex flex-col gap-3">
        <BalanceRow
          symbol="ETH"
          value={formatUnits(nativeBalance?.value ?? BigInt(0), 18)}
          isLoading={isQueryEnabled && isLoadingNative}
          isError={isErrorNative}
          isFiat={false}
        />
        {tokens.map((token, i) => {
          const raw = tokenBalances?.[i]
          const rawBalance = raw?.status === "success" ? (raw.result as bigint) : BigInt(0)
          const value = formatUnits(rawBalance, token.decimals)
          return (
            <BalanceRow
              key={token.address}
              symbol={token.symbol}
              value={value}
              isLoading={isQueryEnabled && isLoading}
              isError={raw?.status === "failure"}
            />
          )
        })}
      </div>
    </div>
  )
}

function BalanceRow({
  symbol,
  value,
  isLoading,
  isError,
  isFiat = true,
}: {
  symbol: string
  value: string
  isLoading: boolean
  isError: boolean
  isFiat?: boolean
}) {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-col gap-0.5">
        <span className="font-medium">{symbol}</span>
      </div>
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Skeleton className="w-16 h-4" />
        ) : isError ? (
          <span className="text-xs text-destructive">error</span>
        ) : (
          <span>{isFiat ? `$${parseFloat(value).toFixed(2)}` : parseFloat(value).toFixed(6)}</span>
        )}
      </div>
    </div>
  )
}
