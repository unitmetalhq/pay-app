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

  // ── Base ────────────────────────────────────────────────────────────────────
  8453: [
    // Stablecoins
    {
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    },
    {
      symbol: "USDbC",
      name: "USD Base Coin",
      decimals: 6,
      address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
    },
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      decimals: 18,
      address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    },
    // Wrapped assets
    {
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
      address: "0x4200000000000000000000000000000000000006",
    },
    {
      symbol: "cbBTC",
      name: "Coinbase Wrapped BTC",
      decimals: 8,
      address: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
    },
    // Liquid staking
    {
      symbol: "cbETH",
      name: "Coinbase Wrapped ETH",
      decimals: 18,
      address: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
    },
    {
      symbol: "wstETH",
      name: "Wrapped stETH",
      decimals: 18,
      address: "0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452",
    },
    {
      symbol: "rETH",
      name: "Rocket Pool ETH",
      decimals: 18,
      address: "0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c",
    },
    // Base-native
    {
      symbol: "AERO",
      name: "Aerodrome Finance",
      decimals: 18,
      address: "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
    },
    {
      symbol: "DEGEN",
      name: "Degen",
      decimals: 18,
      address: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
    },
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
    // Wrapped assets
    {
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    },
    {
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      decimals: 8,
      address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    },
    // Liquid staking
    {
      symbol: "wstETH",
      name: "Wrapped stETH",
      decimals: 18,
      address: "0x5979D7b546E38E414F7E9822514be443A4800529",
    },
    {
      symbol: "rETH",
      name: "Rocket Pool ETH",
      decimals: 18,
      address: "0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8",
    },
    // DeFi / Arbitrum-native
    {
      symbol: "ARB",
      name: "Arbitrum",
      decimals: 18,
      address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
    },
    {
      symbol: "GMX",
      name: "GMX",
      decimals: 18,
      address: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
    },
    {
      symbol: "LINK",
      name: "Chainlink",
      decimals: 18,
      address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
    },
    {
      symbol: "UNI",
      name: "Uniswap",
      decimals: 18,
      address: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
    },
    {
      symbol: "GRT",
      name: "The Graph",
      decimals: 18,
      address: "0x9623063377AD1B27544C965cCd7342f7EA7e88C7",
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
