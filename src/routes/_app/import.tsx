import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import QrImportComponent from '@/components/qr-import-component'
import UrlImportComponent from '@/components/url-import-component'

const searchSchema = z.object({
  keystore: z.string().optional(),
})

export const Route = createFileRoute('/_app/import')({
  validateSearch: searchSchema,
  component: ImportPage,
})

function ImportPage() {
  const { keystore: urlKeystore } = Route.useSearch()
  const [qrKeystore, setQrKeystore] = useState<string | undefined>(undefined)

  const activeKeystore = qrKeystore ?? urlKeystore

  function handleQrResult(data: string) {
    try {
      // Could be a full URL: extract ?keystore= param
      const url = new URL(data)
      const param = url.searchParams.get('keystore')
      if (param) {
        setQrKeystore(param)
        return
      }
    } catch {
      // Not a URL — assume raw keystore JSON, re-encode as base64
    }
    setQrKeystore(btoa(data))
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QrImportComponent onResult={handleQrResult} />
        <UrlImportComponent keystore={activeKeystore} />
      </div>
    </div>
  )
}
