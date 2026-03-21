import { useAtomValue, useSetAtom } from "jotai"
import { User, Check } from "lucide-react"
import { walletsAtom } from "@/atoms/walletsAtom"
import { activeWalletAtom } from "@/atoms/activeWalletAtom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AccountSelector() {
  const wallets = useAtomValue(walletsAtom)
  const activeWallet = useAtomValue(activeWalletAtom)
  const setActiveWallet = useSetAtom(activeWalletAtom)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="default" size="icon" className="hover:cursor-pointer" />}>
        <User />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {wallets.map((wallet) => (
          <DropdownMenuItem
            key={wallet.address}
            onClick={() => setActiveWallet(wallet)}
            className="flex items-center justify-between gap-4"
          >
            <span>{wallet.name}</span>
            {activeWallet?.address === wallet.address && (
              <Check className="h-4 w-4 text-green-500" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
