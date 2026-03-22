import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/activity')({
  component: ActivityPage,
})

function ActivityPage() {
  return <div className="flex flex-col p-4">Coming soon!</div>
}
