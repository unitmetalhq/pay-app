import { useEffect } from "react"
import { useReadContracts } from "wagmi"
import { useAtomValue, useSetAtom } from "jotai"
import { Skeleton } from "@/components/ui/skeleton"
import { formatUnits, erc20Abi } from "viem"
import type { Address } from "viem"
import { RefreshCw, TriangleAlert } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { activeWalletAtom } from "@/atoms/activeWalletAtom"
import { stablecoinTotalAtom } from "@/atoms/stablecoinTotalAtom"
import { TOKENS } from "@/lib/um-token-list"
import { Button } from "@/components/ui/button"

const ETHEREUM_CHAIN_ID = 1
const ETHEREUM_TOKENS = TOKENS[ETHEREUM_CHAIN_ID].filter((t) =>
  ["USDC", "USDT"].includes(t.symbol)
)

export default function BalancesComponent() {
  const activeWallet = useAtomValue(activeWalletAtom)
  const setStablecoinTotal = useSetAtom(stablecoinTotalAtom)

  const address = activeWallet?.address as Address | undefined
  const isQueryEnabled = !!address

  const { data: tokenBalances, isLoading, isError, refetch } = useReadContracts({
    contracts: ETHEREUM_TOKENS.map((token) => ({
      address: token.address as Address,
      abi: erc20Abi,
      functionName: "balanceOf" as const,
      args: [address!] as [Address],
      chainId: ETHEREUM_CHAIN_ID,
    })),
    query: { enabled: isQueryEnabled, refetchOnMount: false },
  })

  useEffect(() => {
    if (!tokenBalances) return
    const total = tokenBalances.reduce((acc, raw, i) => {
      const token = ETHEREUM_TOKENS[i]
      const rawBalance = raw?.status === "success" ? (raw.result as bigint) : BigInt(0)
      return acc + parseFloat(formatUnits(rawBalance, token.decimals))
    }, 0)
    setStablecoinTotal(total)
  }, [tokenBalances, setStablecoinTotal])

  return (
    <div className="bg-secondary rounded-none p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Balances</h2>
        <Button className="hover:cursor-pointer" variant="ghost" size="icon" onClick={() => refetch()}>
          <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
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
        {ETHEREUM_TOKENS.map((token, i) => {
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
}: {
  symbol: string
  value: string
  isLoading: boolean
  isError: boolean
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
          <span>${parseFloat(value).toFixed(2)}</span>
        )}
      </div>
    </div>
  )
}
