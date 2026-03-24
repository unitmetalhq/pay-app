import { useRef, useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import type { TransactionSerializable } from "viem";
import { useNavigate } from "@tanstack/react-router";
import { activeWalletAtom } from "@/atoms/activeWalletAtom";
import { walletsAtom } from "@/atoms/walletsAtom";
import { useTheme } from "@/components/theme-provider";
import type { UmKeystore } from "@/types/wallet";

type PasskeyFrameProps =
  | { mode?: "idle" }
  | {
      mode: "create";
      username: string;
    }
  | {
      mode: "sign";
      tx: TransactionSerializable;
      onSigned: (signedTx: `0x${string}`) => void;
      onError?: (error: string) => void;
    };

export default function PasskeyFrame(props: PasskeyFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isFrameLoaded = useRef(false);
  const activeWallet = useAtomValue(activeWalletAtom);
  const setActiveWallet = useSetAtom(activeWalletAtom);
  const setWallets = useSetAtom(walletsAtom);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const PASSKEY_FRAME_HOST = import.meta.env.VITE_PASSKEY_FRAME_HOST
  const resolvedTheme = theme === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    : theme;

  // Keep latest sign callbacks in a ref to avoid stale closures in the message listener
  const onSignedRef = useRef<((signedTx: `0x${string}`) => void) | undefined>(undefined);
  const onSignErrorRef = useRef<((error: string) => void) | undefined>(undefined);
  if (props.mode === "sign") {
    onSignedRef.current = props.onSigned;
    onSignErrorRef.current = props.onError;
  }

  // Track when the iframe has actually loaded from PASSKEY_FRAME_HOST
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    function onLoad() {
      isFrameLoaded.current = true;
    }

    iframe.addEventListener("load", onLoad);
    return () => {
      iframe.removeEventListener("load", onLoad);
      isFrameLoaded.current = false;
    };
  }, []);

  // Send resolved theme to frame whenever it changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    function sendTheme() {
      iframe!.contentWindow?.postMessage({ action: "set-theme", theme: resolvedTheme }, PASSKEY_FRAME_HOST);
    }

    if (isFrameLoaded.current) {
      sendTheme();
    } else {
      iframe.addEventListener("load", sendTheme, { once: true });
    }

    return () => {
      iframe.removeEventListener("load", sendTheme);
    };
  }, [resolvedTheme, PASSKEY_FRAME_HOST]);

  // Handle messages back from the frame
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== PASSKEY_FRAME_HOST) return;
      const { action, wallet, signedTx, error } = event.data;

      if (action === "create-result" && wallet) {
        const w = wallet as UmKeystore;
        setWallets((prev) => [...prev, w]);
        setActiveWallet(w);
        navigate({ to: "/account" });
      }

      if (action === "sign-result" && signedTx) {
        onSignedRef.current?.(signedTx as `0x${string}`);
      }

      if (action === "sign-error") {
        onSignErrorRef.current?.(error as string);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [PASSKEY_FRAME_HOST, setWallets, setActiveWallet, navigate]);

  // Send create/sign payload to iframe when mode/data changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    if (props.mode === "create") {
      const { username } = props;
      function sendCreate() {
        iframe!.contentWindow?.postMessage({ action: "create", username }, PASSKEY_FRAME_HOST);
      }
      if (isFrameLoaded.current) {
        sendCreate();
      } else {
        iframe.addEventListener("load", sendCreate, { once: true });
        return () => iframe.removeEventListener("load", sendCreate);
      }
    }

    if (props.mode === "sign") {
      const { tx } = props;
      function sendSign() {
        iframe!.contentWindow?.postMessage({ action: "sign", tx, wallet: activeWallet }, PASSKEY_FRAME_HOST);
      }
      if (isFrameLoaded.current) {
        sendSign();
      } else {
        iframe.addEventListener("load", sendSign, { once: true });
        return () => iframe.removeEventListener("load", sendSign);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mode, props.mode === "create" ? props.username : props.mode === "sign" ? props.tx : null]);

  return (
    <div className="w-full">
      <iframe
        ref={iframeRef}
        src={PASSKEY_FRAME_HOST}
        title="passkey"
        allow="publickey-credentials-create *; publickey-credentials-get *"
        className="w-full"
      />
    </div>
  );
}
