import { createFileRoute } from '@tanstack/react-router'
import ExportComponent from '@/components/export-component'
import UrlExportComponent from '@/components/url-export-component'

export const Route = createFileRoute('/_app/export')({
  component: ExportPage,
})

function ExportPage() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExportComponent />
        <UrlExportComponent />
      </div>
    </div>
  )
}
