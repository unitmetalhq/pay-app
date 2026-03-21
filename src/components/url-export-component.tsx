import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { Cuer } from 'cuer'
import { Copy, Check, Info } from 'lucide-react'
import { activeWalletAtom } from '@/atoms/activeWalletAtom'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function UrlExportComponent() {
  const activeWallet = useAtomValue(activeWalletAtom)
  const [copied, setCopied] = useState(false)

  const exportUrl = activeWallet
    ? `${window.location.origin}/import?keystore=${btoa(JSON.stringify(activeWallet))}`
    : ''

  function handleCopy() {
    if (!exportUrl) return
    navigator.clipboard.writeText(exportUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4 bg-secondary rounded-none p-6">
      <h2 className="font-medium">Export via URL</h2>
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Scan this QR on your desktop to import your wallet. The keystore is encrypted — your passkey is still required to access it.
        </AlertDescription>
      </Alert>
      <div className="flex items-center justify-center">
        <div className="w-[200px] h-[200px]">
          {activeWallet ? (
            <Cuer arena="/icon.svg" value={exportUrl} />
          ) : (
            <div className="w-full h-full bg-primary/50 text-primary-foreground justify-center items-center flex text-center">
              No active wallet
            </div>
          )}
        </div>
      </div>
      {activeWallet && (
        <>
          <Textarea
            readOnly
            value={exportUrl}
            className="rounded-none font-mono text-xs resize-none h-16"
          />
          <Button variant="outline" className="rounded-none gap-2" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy URL
              </>
            )}
          </Button>
        </>
      )}
    </div>
  )
}
