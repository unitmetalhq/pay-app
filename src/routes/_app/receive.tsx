import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/receive')({
  component: ReceivePage,
})

function ReceivePage() {
  return <div>Hello "/_app/receive"!</div>
}
