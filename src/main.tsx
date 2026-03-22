import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"

// --- Web3 ---
import { mainnet, sepolia } from "wagmi/chains"
import { WagmiProvider, createConfig, http } from "wagmi"

// --- Router ---
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { routeTree } from "./routeTree.gen"

// --- State ---
import { Provider as JotaiProvider } from "jotai"

// --- App ---
// import App from "./App.tsx"

// --- Theme ---
import { ThemeProvider } from "@/components/theme-provider.tsx"

// Web3 config
const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(import.meta.env.VITE_MAINNET_RPC_URL),
    [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_RPC_URL),
  },
});

// Router config
const queryClient = new QueryClient()
const router = createRouter({ routeTree, context: { queryClient } })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
  interface RouterContext {
    queryClient: QueryClient
  }
}

// Render
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </JotaiProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
