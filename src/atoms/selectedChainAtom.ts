import { atomWithStorage } from "jotai/utils"
import { mainnet } from "wagmi/chains"

export const selectedChainAtom = atomWithStorage<number>("selectedChain", mainnet.id)
