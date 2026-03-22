import { useSyncExternalStore } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import Header from '@/components/header'
import PhoneMockup from '@/components/phone-mockup'
import { Button, buttonVariants } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function getWalletsFromStorage() {
  return JSON.parse(localStorage.getItem('wallets') ?? '[]').length > 0
}

function GetStartedButton() {
  const hasWallets = useSyncExternalStore(
    () => () => {},
    getWalletsFromStorage,
    () => null,
  )

  if (hasWallets === null) {
    return (
      <Button disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    )
  }

  return (
    <Link to={hasWallets ? '/login' : '/signup'} className={buttonVariants({ variant: 'default' })}>
      Get started →
    </Link>
  )
}

function LandingPage() {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col md:grid md:grid-cols-3 px-8 md:px-16 lg:px-24 py-8 md:py-16 gap-8">
        {/* left */}
        <div className="flex flex-col justify-center gap-4 md:-translate-y-[100px]">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            The way payment should work
          </h1>
        </div>

        {/* right — shown second on mobile, hidden on desktop (rendered third in DOM) */}
        <div className="flex flex-col justify-center gap-6 md:hidden">
          <p className="text-muted-foreground text-lg leading-relaxed">
            Pay in stablecoins with next generation experience
          </p>
          <div>
            <GetStartedButton />
          </div>
        </div>

        {/* center — phone, bottom-aligned on desktop, padded on mobile */}
        <div className="flex justify-center items-end">
          <div className="md:translate-y-[5%] w-full md:w-auto">
            <PhoneMockup />
          </div>
        </div>

        {/* right — hidden on mobile, shown on desktop */}
        <div className="hidden md:flex flex-col justify-center gap-6 -translate-y-[100px]">
          <p className="text-muted-foreground text-lg leading-relaxed">
            Pay in stablecoins with next generation experience
          </p>
          <div>
            <GetStartedButton />
          </div>
        </div>
      </div>
    </div>
  )
}
