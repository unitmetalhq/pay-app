import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/activity')({
  component: ActivityPage,
})

function ActivityPage() {
  return <div>Hello "/_app/activity"!</div>
}
