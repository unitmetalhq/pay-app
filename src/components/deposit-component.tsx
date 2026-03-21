import { useState } from "react";
import { Cuer } from "cuer";
import { useAtomValue } from "jotai";
import { activeWalletAtom } from "@/atoms/activeWalletAtom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button"
import ColorizedAddress from "@/components/colorized-address";


export default function DepositComponent() {
  const activeWallet = useAtomValue(activeWalletAtom);
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    if (!activeWallet?.address) return
    navigator.clipboard.writeText(activeWallet.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4 bg-secondary rounded-none p-6">
      <h2 className="font-medium">Deposit</h2>
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          You can deposit USDT or USDC into this wallet on Ethereum.
        </AlertDescription>
      </Alert>
      <div className="flex items-center justify-center">
        <div className="w-[200px] h-[200px]">
          {activeWallet?.address ? (
            <Cuer
              arena="/icon.svg"
              value={activeWallet?.address || ""}
            />
          ) : (
            <div className="w-full h-full bg-primary/50 text-primary-foreground justify-center items-center flex text-center">
              QR code
            </div>
          )}
        </div>
      </div>
      {activeWallet?.address && (
        <Button
          variant="outline"
          className="rounded-none gap-2 h-auto py-3"
          onClick={handleCopy}
        >
          <ColorizedAddress address={activeWallet.address} />
          {copied ? (
            <Check className="text-green-500" />
          ) : (
            <Copy />
          )}
        </Button>
      )}
    </div>
  )
}