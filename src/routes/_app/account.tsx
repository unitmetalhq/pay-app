import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { Copy, Check } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import BalancesComponent from '@/components/balances-component'
import { activeWalletAtom } from '@/atoms/activeWalletAtom'
import { stablecoinTotalAtom } from '@/atoms/stablecoinTotalAtom'
import { useIsMobile } from '@/hooks/use-mobile'

export const Route = createFileRoute('/_app/account')({
  component: AccountPage,
})

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function AccountPage() {
  const activeWallet = useAtomValue(activeWalletAtom)
  const stablecoinTotal = useAtomValue(stablecoinTotalAtom)
  const [copied, setCopied] = useState(false)
  const isMobile = useIsMobile()

  function handleCopy() {
    if (!activeWallet?.address) return
    navigator.clipboard.writeText(activeWallet.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Upper row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="text-4xl font-bold">
          ${stablecoinTotal.toFixed(2)}
        </div>
        <div className={`flex items-center ${isMobile ? "justify-start" : "justify-end"} gap-2`}>
          {activeWallet?.address && (
            <Button
              variant="outline"
              className="rounded-none gap-2"
              onClick={handleCopy}
            >
              {shortenAddress(activeWallet.address)}
              {copied ? (
                <Check className="text-green-500" />
              ) : (
                <Copy />
              )}
            </Button>
          )}
          <Link to="/receive" className={buttonVariants({ variant: "default" }) + " rounded-none"}>
            Add funds
          </Link>
        </div>
      </div>

      {/* Lower row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BalancesComponent />
        <div className="bg-secondary rounded-none min-h-64" />
      </div>
    </div>
  )
}
