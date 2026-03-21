import { useConfig } from "wagmi"
import { mainnet } from "wagmi/chains"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from "@/components/ui/select"

interface ChainSelectorProps {
  value?: number
  onValueChange: (chainId: number) => void
}

export default function ChainSelector({ value = mainnet.id, onValueChange }: ChainSelectorProps) {
  const config = useConfig()
  const selectedChainName = config.chains.find((c) => c.id === value)?.name ?? "Select a chain"

  return (
    <Select
      value={value.toString()}
      defaultValue={mainnet.id.toString()}
      onValueChange={(val) => onValueChange(Number(val))}
    >
      <SelectTrigger className="rounded-none">
        <span>{selectedChainName}</span>
      </SelectTrigger>
      <SelectContent>
        {config.chains.map((chain) => (
          <SelectItem key={chain.id} value={chain.id.toString()}>
            {chain.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
