import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSetAtom } from 'jotai'
import { walletsAtom } from '@/atoms/walletsAtom'
import { activeWalletAtom } from '@/atoms/activeWalletAtom'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_app/delete')({
  component: RouteComponent,
})

function RouteComponent() {
  const setWallets = useSetAtom(walletsAtom)
  const setActiveWallet = useSetAtom(activeWalletAtom)
  const navigate = useNavigate()

  function handleClear() {
    setWallets([])
    setActiveWallet(null)
    navigate({ to: '/' })
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-bold">Clear wallet data</h1>
      <p className="text-sm text-muted-foreground">
        Removes all wallets and active wallet from local storage. This cannot be undone.
      </p>
      <Button
        variant="destructive"
        className="rounded-none w-fit hover:cursor-pointer"
        onClick={handleClear}
      >
        Clear all wallets
      </Button>
    </div>
  )
}
