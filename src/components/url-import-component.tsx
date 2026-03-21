import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useSetAtom } from 'jotai'
import { Check, TriangleAlert } from 'lucide-react'
import { activeWalletAtom } from '@/atoms/activeWalletAtom'
import { walletsAtom } from '@/atoms/walletsAtom'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import type { UmKeystore } from '@/types/wallet'

interface UrlImportComponentProps {
  keystore?: string
}

export default function UrlImportComponent({ keystore }: UrlImportComponentProps) {
  const navigate = useNavigate()
  const setActiveWallet = useSetAtom(activeWalletAtom)
  const setWallets = useSetAtom(walletsAtom)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!keystore) {
      setStatus('error')
      setErrorMessage('No keystore found in URL.')
      return
    }

    try {
      const parsed: UmKeystore = JSON.parse(atob(keystore))

      if (!parsed.address || !parsed.crypto) {
        throw new Error('Invalid keystore format.')
      }

      setWallets((prev) => {
        const exists = prev.some((w) => w.address === parsed.address)
        return exists ? prev : [...prev, parsed]
      })
      setActiveWallet(parsed)
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage('Failed to parse keystore. The URL may be malformed or corrupted.')
    }
  }, [keystore])

  return (
    <div className="flex flex-col gap-4 bg-secondary rounded-none p-6">
      <h2 className="font-medium">Import via URL</h2>

      {status === 'idle' && (
        <p className="text-sm text-muted-foreground">Importing wallet...</p>
      )}

      {status === 'success' && (
        <>
          <Alert>
            <Check className="h-4 w-4" />
            <AlertTitle>Wallet imported</AlertTitle>
            <AlertDescription>
              Your wallet has been imported and set as active.
            </AlertDescription>
          </Alert>
          <Button className="rounded-none" onClick={() => navigate({ to: '/account' })}>
            Go to account
          </Button>
        </>
      )}

      {status === 'error' && (
        <Alert className="border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Import failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
