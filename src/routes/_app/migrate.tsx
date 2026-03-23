import { createFileRoute } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { walletsAtom } from '@/atoms/walletsAtom'
import { activeWalletAtom } from '@/atoms/activeWalletAtom'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_app/migrate')({
  component: RouteComponent,
})

const UM_VERSION = "0.1.0";

function RouteComponent() {
  const [wallets, setWallets] = useAtom(walletsAtom)
  const [activeWallet, setActiveWallet] = useAtom(activeWalletAtom)

  const walletsNeedingMigration = wallets.filter(
    (w) => w.meta.umVersion !== UM_VERSION
  )
  const activeNeedsMigration = activeWallet && activeWallet.meta.umVersion !== UM_VERSION

  function handleMigrate() {
    const updatedWallets = wallets.map((w) => ({
      ...w,
      meta: { ...w.meta, umVersion: UM_VERSION },
    }))
    setWallets(updatedWallets)

    if (activeWallet) {
      const updated = updatedWallets.find((w) => w.name === activeWallet.name)
      if (updated) setActiveWallet(updated)
    }
  }

  const alreadyMigrated = walletsNeedingMigration.length === 0 && !activeNeedsMigration

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-bold">Migrate wallets</h1>
      <p className="text-sm text-muted-foreground">
        Sets <code>meta.umVersion</code> to <code>{UM_VERSION}</code> on all stored wallets.
      </p>
      <div className="flex flex-col gap-1 text-sm">
        <p>Total wallets: {wallets.length}</p>
        <p>Needing migration: {walletsNeedingMigration.length}</p>
        {activeWallet && (
          <p>
            Active wallet ({activeWallet.name}):{" "}
            {activeNeedsMigration ? "needs migration" : "up to date"}
          </p>
        )}
      </div>
      <Button
        className="rounded-none w-fit hover:cursor-pointer"
        onClick={handleMigrate}
        disabled={alreadyMigrated}
      >
        {alreadyMigrated ? "Already migrated" : `Migrate to ${UM_VERSION}`}
      </Button>
    </div>
  )
}
