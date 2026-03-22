import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useConfig } from "wagmi";
import { useAtomValue } from "jotai";
import { selectedChainAtom } from "@/atoms/selectedChainAtom";
import SendNativeTokenForm from "@/components/send-native-token-form";
import SendErc20TokenForm from "@/components/send-erc20-token-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import SendBatchNativeTokenForm from "./send-batch-native-token-form";
import { TOKENS } from "@/lib/um-token-list";


export default function SendComponent() {
  // get Wagmi config
  const config = useConfig();

  // get selected chain from atom
  const selectedChainId = useAtomValue(selectedChainAtom);

  // selected asset type (empty string = no selection)
  const [selectedSingleAsset, setSelectedSingleAsset] = useState("");

  // selected asset type for batch (empty string = no selection)
  const [selectedBatchAsset, setSelectedBatchAsset] = useState("");

  // function to handle select different asset type
  function handleSelectedSingleAssetChange(value: string | null) {
    setSelectedSingleAsset(value ?? "");
  }

  // function to handle select different asset type
  function handleSelectedBatchAssetChange(value: string | null) {
    setSelectedBatchAsset(value ?? "");
  }

  // get native currency symbol for selected chain
  const nativeSymbol = config.chains.find((c) => c.id === selectedChainId)?.nativeCurrency.symbol ?? "Native";

  // get token list for selected chain (only USDC and USDT)
  const chainTokens = (TOKENS[selectedChainId] ?? []).filter((t) =>
    ["USDC", "USDT"].includes(t.symbol)
  );

  // define select options: native + USDC/USDT
  const forms = [
    { label: "Select an asset", value: "" },
    { label: nativeSymbol, value: "native" },
    ...chainTokens.map((t) => ({ label: t.symbol, value: t.address })),
  ]

  return (
    <div className="bg-secondary rounded-none p-6 flex flex-col gap-4">
      <h2 className="font-medium">Send</h2>
      <div className="flex flex-col gap-4">
        <Tabs defaultValue="native" className="w-full">
          <TabsList className="border-primary border rounded-none">
            <TabsTrigger className="rounded-none" value="single">
              Single
            </TabsTrigger>
            <TabsTrigger className="rounded-none" value="batch">
              Batch
            </TabsTrigger>
          </TabsList>
          <TabsContent value="single">
            <div className="flex flex-col gap-1 mt-2">
              <Select value={selectedSingleAsset} onValueChange={handleSelectedSingleAssetChange}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select asset type">
                    {(value: string | null) => forms.find((f) => f.value === value)?.label ?? "Select asset type"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectGroup>
                    {forms.map((form) => (
                      <SelectItem key={form.value} value={form.value}>
                        {form.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {selectedSingleAsset === "native" && (
                <SendNativeTokenForm selectedChain={selectedChainId} />
              )}
              {selectedSingleAsset !== "" && selectedSingleAsset !== "native" && (
                <SendErc20TokenForm
                  selectedChain={selectedChainId}
                  tokenAddress={selectedSingleAsset}
                  decimals={chainTokens.find((t) => t.address === selectedSingleAsset)?.decimals}
                  symbol={chainTokens.find((t) => t.address === selectedSingleAsset)?.symbol}
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value="batch" className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 mt-2">
              <Select value={selectedBatchAsset} onValueChange={handleSelectedBatchAssetChange}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select asset type">
                    {(value: string | null) => forms.find((f) => f.value === value)?.label ?? "Select asset type"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectGroup>
                    {forms.map((form) => (
                      <SelectItem key={form.value} value={form.value}>
                        {form.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {selectedBatchAsset === "native" && (
                <SendBatchNativeTokenForm selectedChain={selectedChainId} />
              )}
              {selectedBatchAsset !== "" && selectedBatchAsset !== "native" && (
                <div>WIP</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}