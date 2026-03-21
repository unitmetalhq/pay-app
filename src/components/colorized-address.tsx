import { colorizeAddress } from "@/lib/utils"
import type { Address } from "viem"

export default function ColorizedAddress({ address }: { address: string }) {
  return (
    <span className="font-mono text-xs flex flex-col md:flex-row">
      {colorizeAddress(address as Address).map((segment, i) => (
        <span key={i} className={segment.colorClass}>{segment.text}</span>
      ))}
    </span>
  )
}
