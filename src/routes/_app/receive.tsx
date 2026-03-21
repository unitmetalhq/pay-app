import { createFileRoute } from '@tanstack/react-router'
import DepositComponent from '@/components/deposit-component'

export const Route = createFileRoute('/_app/receive')({
  component: ReceivePage,
})

function ReceivePage() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DepositComponent />
      </div>
    </div>
  )
}
