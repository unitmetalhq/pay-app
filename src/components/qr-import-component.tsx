import { useEffect, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'
import { Info } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface QrImportComponentProps {
  onResult: (data: string) => void
}

export default function QrImportComponent({ onResult }: QrImportComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const scannerRef = useRef<QrScanner | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState('')

  function handleScan(result: QrScanner.ScanResult) {
    setScanned(result.data)
    stopScanner()
  }

  function startScanner() {
    if (!videoRef.current) return
    const scanner = new QrScanner(videoRef.current, handleScan, {
      returnDetailedScanResult: true,
      highlightScanRegion: true,
    })
    scannerRef.current = scanner
    scanner.start().then(() => setScanning(true))
  }

  function stopScanner() {
    scannerRef.current?.stop()
    scannerRef.current?.destroy()
    scannerRef.current = null
    setScanning(false)
  }

  useEffect(() => {
    return () => {
      scannerRef.current?.stop()
      scannerRef.current?.destroy()
    }
  }, [])

  return (
    <div className="flex flex-col gap-4 bg-secondary rounded-none p-6">
      <h2 className="font-medium">Import via QR</h2>
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Scan the QR code from your export page to import a wallet. Allow camera access when prompted.
        </AlertDescription>
      </Alert>

      <video
        ref={videoRef}
        className={scanning ? 'w-full aspect-square object-cover' : 'hidden'}
      />

      {!scanning && (
        <Button variant="outline" className="rounded-none" onClick={startScanner}>
          Launch camera
        </Button>
      )}

      {scanning && (
        <Button variant="outline" className="rounded-none" onClick={stopScanner}>
          Stop camera
        </Button>
      )}

      <Textarea
        readOnly
        value={scanned}
        placeholder="Scanned result will appear here..."
        className="rounded-none font-mono text-xs resize-none h-16"
      />

      <Button
        className="rounded-none"
        disabled={!scanned}
        onClick={() => onResult(scanned)}
      >
        Import
      </Button>
    </div>
  )
}
