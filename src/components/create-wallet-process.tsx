import { useEffect, useState } from "react"
import { Loader2, Check, CircleDashed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSetAtom } from "jotai"
import { useNavigate } from "@tanstack/react-router"
import { createUmPasskeyWallet } from "@/lib/um-passkey-wallet"
import { walletsAtom } from "@/atoms/walletsAtom"
import { activeWalletAtom } from "@/atoms/activeWalletAtom"

type Status = "idle" | "loading" | "completed" | "cancelled"

type Steps = {
  entropy: Status
  encrypting: Status
  confirm: Status
  completing: Status
  redirecting: Status
}

function StepIcon({ status }: { status: Status }) {
  if (status === "loading") return <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
  if (status === "completed") return <Check className="h-4 w-4 shrink-0 text-green-500" />
  if (status === "cancelled") return <span className="text-destructive">✕</span>
  return <CircleDashed className="h-4 w-4 shrink-0 opacity-30" />
}

export default function CreateWalletProcess({
  username,
  onCancel,
}: {
  username: string
  onCancel?: () => void
}) {
  const [steps, setSteps] = useState<Steps>({
    entropy: "loading",
    encrypting: "idle",
    confirm: "idle",
    completing: "idle",
    redirecting: "idle",
  })

  const setWallets = useSetAtom(walletsAtom)
  const setActiveWallet = useSetAtom(activeWalletAtom)
  const navigate = useNavigate()

  useEffect(() => {
    const t1 = setTimeout(() => setSteps(s => ({ ...s, entropy: "completed", encrypting: "loading" })), 1000)
    const t2 = setTimeout(() => setSteps(s => ({ ...s, encrypting: "completed", confirm: "loading" })), 2000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [username])

  async function handleConfirm() {
    setSteps(s => ({ ...s, confirm: "completed", completing: "loading" }))

    const result = await createUmPasskeyWallet(username)

    if (result?.success) {
      setSteps(s => ({ ...s, completing: "completed", redirecting: "loading" }))
      setWallets(prev => [...prev, result.wallet])
      setActiveWallet(result.wallet)
      navigate({ to: "/account" })
    } else {
      setSteps(s => ({ ...s, completing: "cancelled" }))
    }
  }

  function handleCancel() {
    setSteps(s => ({ ...s, confirm: "completed", completing: "cancelled" }))
    onCancel?.()
  }

  return (
    <div className="flex flex-col gap-1 text-xs">
      <p className="font-medium text-muted-foreground">Creating account for <span className="text-wrap text-foreground">{username}</span></p>

      <div className={`flex items-center gap-2 ${steps.entropy === "idle" ? "opacity-30" : ""}`}>
        <StepIcon status={steps.entropy} />
        <span>Generating secret...</span>
      </div>

      <div className={`flex items-center gap-2 ${steps.encrypting === "idle" ? "opacity-30" : ""}`}>
        <StepIcon status={steps.encrypting} />
        <span>Encrypting secret...</span>
      </div>

      <div className={`flex items-center gap-2 ${steps.confirm === "idle" ? "opacity-30" : ""}`}>
        <StepIcon status={steps.confirm} />
        <span>Storing secret...</span>
      </div>

      {steps.confirm === "loading" && (
        <div className="flex gap-2 mt-1">
          <Button size="sm" variant="outline" className="rounded-none" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" className="rounded-none" onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      )}

      {steps.completing !== "idle" && (
        <div className="flex items-center gap-2">
          <StepIcon status={steps.completing} />
          <span className={steps.completing === "cancelled" ? "text-destructive" : ""}>
            {steps.completing === "completed" ? "Completed!" : steps.completing === "cancelled" ? "Cancelled" : "Completing..."}
          </span>
        </div>
      )}

      {steps.redirecting === "loading" && (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          <span>Taking you to account...</span>
        </div>
      )}
    </div>
  )
}
