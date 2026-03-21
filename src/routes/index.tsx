import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/header'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="flex flex-col">
      <Header />
    </div>
  )
}
