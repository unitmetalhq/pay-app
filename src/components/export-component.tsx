import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { Cuer } from 'cuer'
import { Copy, Check, Info } from 'lucide-react'
import { activeWalletAtom } from '@/atoms/activeWalletAtom'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export default function ExportComponent() {
  const activeWallet = useAtomValue(activeWalletAtom)
  const [copied, setCopied] = useState(false)

  const keystoreJson = activeWallet ? JSON.stringify(activeWallet) : ''

  function handleCopy() {
    if (!keystoreJson) return
    navigator.clipboard.writeText(keystoreJson)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4 bg-secondary rounded-none p-6">
      <h2 className="font-medium">Export</h2>
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This QR code contains your encrypted keystore. It is safe to share but keep it private — anyone with your passkey can use it.
        </AlertDescription>
      </Alert>
      <div className="flex items-center justify-center">
        <div className="w-[200px] h-[200px]">
          {activeWallet ? (
            <Cuer arena="/icon.svg" value={keystoreJson} />
          ) : (
            <div className="w-full h-full bg-primary/50 text-primary-foreground justify-center items-center flex text-center">
              No active wallet
            </div>
          )}
        </div>
      </div>
      {activeWallet && (
        <Button variant="outline" className="rounded-none gap-2" onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy keystore JSON
            </>
          )}
        </Button>
      )}
    </div>
  )
}
