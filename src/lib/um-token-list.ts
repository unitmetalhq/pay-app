import type { Token } from "@/types/token"

export type { Token }

export const TOKENS: Record<number, Token[]> = {
  // ── Ethereum Mainnet ────────────────────────────────────────────────────────
  1: [
    // Stablecoins
    {
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
  ],
  11155111: [
    // Stablecoins
    {
      symbol: "USDC",
      name: "USD Coin",
      decimals: 18,
      address: "0xd27Cf55A4AeCaF43dA2A7Ca939dAD5a013A7d6fA",
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      decimals: 18,
      address: "0x645Ea79423f31b5740EAE00D86A455d376A89F0d",
    },
  ],

  // ── Base ────────────────────────────────────────────────────────────────────
  8453: [
    // Stablecoins
    {
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    }
  ],

  // ── Arbitrum One ────────────────────────────────────────────────────────────
  42161: [
    // Stablecoins
    {
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    },
    {
      symbol: "USDC.e",
      name: "USD Coin (Bridged)",
      decimals: 6,
      address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
      address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    },
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      decimals: 18,
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    },
  ],

  // ── Unichain ────────────────────────────────────────────────────────────────
  // TODO: verify addresses against https://app.uniswap.org or the official bridge
  130: [
    {
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
      address: "0x4200000000000000000000000000000000000006",
    },
  ],
}
