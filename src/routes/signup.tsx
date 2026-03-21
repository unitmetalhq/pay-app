import { createFileRoute } from '@tanstack/react-router'
import SignupComponent from '@/components/signup-component'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

function SignupPage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <SignupComponent />
    </div>
  )
}
