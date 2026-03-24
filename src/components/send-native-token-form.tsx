import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useForm, useStore } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { Loader2, Check, ExternalLink, Search, Eraser } from "lucide-react";
import { parseEther, formatEther, type Address } from "viem";
import {
  useConfig,
  useBalance,
  usePrepareTransactionRequest,
  useWaitForTransactionReceipt,
  useEnsAddress,
  usePublicClient,
} from "wagmi";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { activeWalletAtom } from "@/atoms/activeWalletAtom";
import { normalize } from "viem/ens";
import PasskeyFrame from "@/components/passkey-frame";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { RefreshCcw } from "lucide-react";
import { truncateHash } from "@/lib/utils";
import type { TransactionSerializable } from "viem";


export default function SendNativeTokenForm({
  selectedChain,
}: {
  selectedChain: number | null;
}) {
  // get Wagmi config
  const config = useConfig();

  // check if desktop
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // get active wallet from atom
  const activeWallet = useAtomValue(activeWalletAtom);

  // pending tx params — set on form submit to trigger preparation
  const [pendingTxParams, setPendingTxParams] = useState<{
    to: Address;
    value: bigint;
  } | null>(null);

  // send form
  const form = useForm({
    defaultValues: {
      receivingAddress: "",
      amount: "",
      type: "native",
    },
    onSubmit: async ({ value }) => {
      if (value.type === "native") {
        let recipientAddress: Address;
        if (value.receivingAddress.endsWith(".eth")) {
          if (!ensAddress) return;
          recipientAddress = ensAddress as Address;
        } else {
          recipientAddress = value.receivingAddress as Address;
        }
        setPendingTxParams({ to: recipientAddress, value: parseEther(value.amount) });
      }
    },
  });

  // get form values reactively
  const receivingAddress = useStore(
    form.store,
    (state) => state.values.receivingAddress || ""
  );

  // get ENS address
  const {
    data: ensAddress,
    isLoading: isLoadingEnsAddress,
    isError: isErrorEnsAddress,
    refetch: refetchEnsAddress,
  } = useEnsAddress({
    chainId: 1,
    name: receivingAddress && receivingAddress.endsWith(".eth") && (receivingAddress.split(".")[0] !== "" || receivingAddress.split(".")[1] !== "")
      ? normalize(receivingAddress)
      : undefined,
    query: {
      enabled: false,
    },
  });

  // check if balance query should be enabled
  const isBalanceQueryEnabled = !!selectedChain && !!activeWallet?.address;

  // get native balance
  const {
    data: nativeBalance,
    isLoading: isLoadingNativeBalance,
    refetch: refetchNativeBalance,
  } = useBalance({
    query: {
      enabled: isBalanceQueryEnabled,
    },
    address: activeWallet?.address as `0x${string}` | undefined,
    chainId: selectedChain || undefined,
  });

  // prepare transaction request when pendingTxParams is set
  const { data: preparedTx } = usePrepareTransactionRequest({
    account: activeWallet?.address as Address | undefined,
    to: pendingTxParams?.to,
    value: pendingTxParams?.value,
    chainId: selectedChain || undefined,
    query: { enabled: !!pendingTxParams && !!activeWallet?.address },
  });

  // broadcast signed raw transaction
  const publicClient = usePublicClient({ chainId: selectedChain || undefined });
  const sendRawTx = useMutation({
    mutationFn: (serializedTransaction: `0x${string}`) =>
      publicClient!.sendRawTransaction({ serializedTransaction }),
  });

  // hook to wait for transaction receipt
  const {
    isLoading: isConfirmingSendNativeTransaction,
    isSuccess: isConfirmedSendNativeTransaction,
  } = useWaitForTransactionReceipt({
    hash: sendRawTx.data,
    chainId: selectedChain || undefined,
  });

  function handleSigned(signedTx: `0x${string}`) {
    sendRawTx.mutate(signedTx);
    setPendingTxParams(null);
  }

  const selectedChainBlockExplorer = config.chains.find(
    (chain) => chain.id.toString() === selectedChain?.toString()
  )?.blockExplorers?.default.url;

  // When user clicks resets form
  function handleReset() {
    sendRawTx.reset();
    setPendingTxParams(null);
    form.reset();
    refetchNativeBalance();
  }

  // When user switches chain, refetch native balance and reset forms
  useEffect(() => {
    sendRawTx.reset();
    setPendingTxParams(null);
    form.reset();

    // refetch the native balance
    refetchNativeBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChain]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="flex flex-col gap-4">
        {/* send native form*/}
        <div>
          <form.Field
            name="amount"
            validators={{
              onChange: ({ value }) => {
                // Check if empty
                if (!value) {
                  return "Please enter an amount to send";
                }

                // Convert to number and check if it's valid
                const numValue = parseFloat(value);
                if (isNaN(numValue)) {
                  return "Please enter a valid number";
                }

                // Check if negative
                if (numValue <= 0) {
                  return "Amount must be greater than 0";
                }

                // Try to parse ether and check balance
                try {
                  const valueInWei = parseEther(value);
                  if (
                    nativeBalance?.value &&
                    valueInWei > nativeBalance.value
                  ) {
                    return "Insufficient balance";
                  }
                } catch {
                  // Handle parseEther errors for invalid decimal places
                  return "Invalid amount format";
                }

                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="flex flex-col gap-0">
                <div className="flex flex-row gap-2 items-center justify-between">
                  <p className="text-muted-foreground">Amount</p>
                  <div className="flex flex-row gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        field.handleChange(
                          formatEther(
                            (nativeBalance?.value || BigInt(0)) / BigInt(4)
                          )
                        )
                      }
                      className="hover:cursor-pointer underline underline-offset-4"
                    >
                      25%
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        field.handleChange(
                          formatEther(
                            (nativeBalance?.value || BigInt(0)) / BigInt(2)
                          )
                        )
                      }
                      className="hover:cursor-pointer underline underline-offset-4"
                    >
                      50%
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        field.handleChange(
                          formatEther(
                            ((nativeBalance?.value || BigInt(0)) * BigInt(3)) /
                            BigInt(4)
                          )
                        )
                      }
                      className="hover:cursor-pointer underline underline-offset-4"
                    >
                      75%
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        field.handleChange(
                          formatEther(
                            nativeBalance?.value || BigInt(0)
                          ) as string
                        )
                      }
                      className="hover:cursor-pointer underline underline-offset-4"
                    >
                      Max
                    </button>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between my-2">
                  {isDesktop ? (
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="bg-transparent text-2xl outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      type="number"
                      placeholder="0"
                      required
                    />
                  ) : (
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="bg-transparent text-2xl outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      type="number"
                      inputMode="decimal"
                      pattern="[0-9]*"
                      placeholder="0"
                      required
                    />
                  )}
                </div>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row gap-2">
                    <div className="text-muted-foreground">
                      {isBalanceQueryEnabled && isLoadingNativeBalance ? (
                        <Skeleton className="w-10 h-4" />
                      ) : (
                        formatEther(nativeBalance?.value || BigInt(0))
                      )}
                    </div>
                    {selectedChain ? (
                      <p className="text-muted-foreground">
                        {config.chains.find(
                          (c) => c.id.toString() === selectedChain?.toString()
                        )?.nativeCurrency.symbol || "Native"}
                      </p>
                    ) : (
                      <p className="text-muted-foreground">Native</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-none hover:cursor-pointer"
                    type="button"
                    onClick={() => refetchNativeBalance()}
                  >
                    {isBalanceQueryEnabled && isLoadingNativeBalance ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCcw />
                    )}
                  </Button>
                </div>
                <AmountFieldInfo field={field} />
              </div>
            )}
          </form.Field>
        </div>
        <div>
          <form.Field
            name="receivingAddress"
            validators={{
              onChange: ({ value }) => {
                if (!value) {
                  return "Please enter an address or ENS";
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-center">
                  <p className="text-muted-foreground">Recipient</p>
                </div>
                <InputGroup>
                  <InputGroupInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="rounded-none"
                    type="text"
                    placeholder="Address (0x...) or ENS (.eth)"
                    required
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      aria-label="ENS lookup"
                      title="Copy"
                      size="icon-xs"
                      onClick={() => refetchEnsAddress()}
                      className="hover:cursor-pointer"
                    >
                      {isLoadingEnsAddress ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <ReceivingAddressFieldInfo
                  field={field}
                  ensAddress={ensAddress}
                  isLoadingEnsAddress={isLoadingEnsAddress}
                  isErrorEnsAddress={isErrorEnsAddress}
                />
              </div>
            )}
          </form.Field>
        </div>
        <div className="flex flex-col gap-2">
          <form.Subscribe
            selector={(state) => state.canSubmit}
          >
            {(canSubmit) => (
              <div className="grid grid-cols-5 gap-2">
                <Button
                  className="hover:cursor-pointer rounded-none col-span-1"
                  variant="outline"
                  size="icon"
                  type="reset"
                  disabled={
                    !canSubmit ||
                    sendRawTx.isPending ||
                    isConfirmingSendNativeTransaction
                  }
                  onClick={handleReset}
                >
                  <Eraser className="w-4 h-4" />
                </Button>
                <Button
                  className="hover:cursor-pointer rounded-none col-span-4"
                  type="submit"
                  disabled={
                    !canSubmit ||
                    sendRawTx.isPending ||
                    isConfirmingSendNativeTransaction
                  }
                >
                  {sendRawTx.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                  ) : isConfirmingSendNativeTransaction ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                  ) : isConfirmedSendNativeTransaction ? (
                    <>
                      <Check className="w-4 h-4" />
                    </>
                  ) : (
                    <>Send</>
                  )}
                </Button>
              </div>
            )}
          </form.Subscribe>
          {pendingTxParams && preparedTx && (
            <PasskeyFrame
              mode="sign"
              tx={preparedTx as TransactionSerializable}
              onSigned={handleSigned}
              onError={() => setPendingTxParams(null)}
            />
          )}
          <div className="border-t-2 border-primary pt-4 mt-4">
            <div className="flex flex-col gap-1">
              <div className="flex flex-row gap-2 items-center">
                {sendRawTx.isPending ? (
                  <div className="flex flex-row gap-2 items-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <p>Signing transaction...</p>
                  </div>
                ) : isConfirmingSendNativeTransaction ? (
                  <div className="flex flex-row gap-2 items-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <p>Confirming transaction...</p>
                  </div>
                ) : isConfirmedSendNativeTransaction ? (
                  <div className="flex flex-row gap-2 items-center">
                    <Check className="w-4 h-4" />
                    <p>Transaction confirmed</p>
                  </div>
                ) : (
                  <div className="flex flex-row gap-2 items-center">
                    <p className="text-muted-foreground">&gt;</p>
                    <p>No pending transaction</p>
                  </div>
                )}
              </div>
              {sendRawTx.data ? (
                <div className="flex flex-row gap-2 items-center">
                  <p className="text-muted-foreground">&gt;</p>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:cursor-pointer"
                    href={`${selectedChainBlockExplorer}/tx/${sendRawTx.data}`}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      {truncateHash(sendRawTx.data)}
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </a>
                </div>
              ) : (
                <div className="flex flex-row gap-2 items-center">
                  <p className="text-muted-foreground">&gt;</p>
                  <p>No transaction hash</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function AmountFieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {!field.state.meta.isTouched ? (
        <em>Please enter an amount to send</em>
      ) : field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em
          className={`${field.state.meta.errors.join(",") ===
            "Please enter an amount to send"
            ? ""
            : "text-red-400"
            }`}
        >
          {field.state.meta.errors.join(",")}
        </em>
      ) : (
        <em className="text-green-500">ok!</em>
      )}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

function ReceivingAddressFieldInfo({
  field,
  ensAddress,
  isLoadingEnsAddress,
  isErrorEnsAddress,
}: {
  field: AnyFieldApi;
  ensAddress?: Address | null;
  isLoadingEnsAddress?: boolean;
  isErrorEnsAddress?: boolean;
}) {
  return (
    <>
      {!field.state.meta.isTouched ? (
        <em>Please enter an address or ENS</em>
      ) : field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em
          className={`${field.state.meta.errors.join(",") ===
            "Please enter an address or ENS"
            ? ""
            : "text-red-400"
            }`}
        >
          {field.state.meta.errors.join(",")}
        </em>
      ) : isLoadingEnsAddress ? (
        <Skeleton className="w-10 h-4" />
      ) : isErrorEnsAddress ? (
        <div className="text-red-400 text-xs">Failed to resolve ENS</div>
      ) : ensAddress ? (
        <em className="text-green-500 text-xs">{ensAddress}</em>
      ) : ensAddress === null ? (
        <div className="text-red-400 text-xs">Invalid ENS</div>
      ) : (
        <em className="text-green-500">ok! Click icon to look up ENS</em>
      )}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}