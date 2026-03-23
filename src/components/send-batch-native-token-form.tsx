import { useEffect } from "react";
import { useBalance } from "wagmi";
import { useAtomValue } from "jotai";
import { activeWalletAtom } from "@/atoms/activeWalletAtom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BatchSimpleEditor } from "@/components/send-batch-simple-editor";
import { BatchTextEditor } from "@/components/send-batch-text-editor";
import { BatchFileUpload } from "@/components/send-batch-file-upload";

export default function SendBatchNativeTokenForm({
  selectedChain,
}: {
  selectedChain: number | null;
}) {
  const activeWallet = useAtomValue(activeWalletAtom);

  const isBalanceQueryEnabled = !!selectedChain && !!activeWallet?.address;

  const {
    data: nativeBalance,
    isLoading: isLoadingNativeBalance,
    refetch: refetchNativeBalance,
  } = useBalance({
    query: { enabled: isBalanceQueryEnabled },
    address: activeWallet?.address as `0x${string}` | undefined,
    chainId: selectedChain || undefined,
  });

  useEffect(() => {
    refetchNativeBalance();
  }, [selectedChain, refetchNativeBalance]);

  return (
    <div className="flex flex-col gap-2 mt-2">
      <h2 className="text-md font-bold">Input mode</h2>
      <Tabs defaultValue="simple-editor" className="w-full">
        <TabsList className="border-primary border rounded-none">
          <TabsTrigger className="rounded-none" value="simple-editor">
            Simple
          </TabsTrigger>
          <TabsTrigger className="rounded-none" value="text-editor">
            Text
          </TabsTrigger>
          <TabsTrigger className="rounded-none" value="file-upload">
            File
          </TabsTrigger>
        </TabsList>
        <TabsContent value="simple-editor">
          <BatchSimpleEditor
            nativeBalance={nativeBalance}
            isLoadingNativeBalance={isLoadingNativeBalance}
            selectedChain={selectedChain}
          />
        </TabsContent>
        <TabsContent value="text-editor">
          <BatchTextEditor
            nativeBalance={nativeBalance}
            isLoadingNativeBalance={isLoadingNativeBalance}
            selectedChain={selectedChain}
          />
        </TabsContent>
        <TabsContent value="file-upload">
          <BatchFileUpload
            nativeBalance={nativeBalance}
            isLoadingNativeBalance={isLoadingNativeBalance}
            selectedChain={selectedChain}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
