import { useAtom } from "jotai"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import ChainSelector from "@/components/chain-selector"
import AccountSelector from "@/components/account-selector"
import { selectedChainAtom } from "@/atoms/selectedChainAtom"

export default function AppHeader() {
  const [selectedChain, setSelectedChain] = useAtom(selectedChainAtom)

  return (
    <div className="flex flex-row gap-2 items-center justify-between w-full px-4 py-2 border-b border-muted-foreground/20">
      <SidebarTrigger
        className="rounded-none hover:cursor-pointer"
        variant="ghost"
        size="icon"
      >
      </SidebarTrigger>
      <div className="flex flex-row gap-2 items-center">
        <ThemeToggle />
        <ChainSelector value={selectedChain} onValueChange={setSelectedChain} />
        <AccountSelector />
      </div>
    </div>
  )
}