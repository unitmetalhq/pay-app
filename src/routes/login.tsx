import { createFileRoute } from '@tanstack/react-router'
import LoginComponent from '@/components/login-component'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <LoginComponent />
    </div>
  )
}
