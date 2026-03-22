import { createFileRoute, Link } from '@tanstack/react-router'
import LoginComponent from '@/components/login-component'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Link to="/"><img src="/unitmetal-symbol.svg" alt="UnitMetal" className="absolute top-8 left-8 md:left-16 lg:left-16 h-8 w-8 dark:invert" /></Link>
      <LoginComponent />
    </div>
  )
}
