import { useState } from 'react'
import { useForm, type AnyFieldApi } from '@tanstack/react-form'
import { useAtomValue, useSetAtom } from 'jotai'
import { useNavigate } from '@tanstack/react-router'
import { walletsAtom } from '@/atoms/walletsAtom'
import { activeWalletAtom } from '@/atoms/activeWalletAtom'
import { Button } from '@/components/ui/button'
import { Loader2, TriangleAlert, Check } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function LoginComponent() {
  const wallets = useAtomValue(walletsAtom)
  const setActiveWallet = useSetAtom(activeWalletAtom)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      username: '',
    },
    onSubmit: async ({ value }) => {
      const wallet = wallets.find((w) => w.name === value.username)
      if (!wallet) {
        setSubmitError(true)
        return
      }
      setActiveWallet(wallet)
      setSuccess(true)
      setTimeout(() => navigate({ to: '/account' }), 1000)
    },
  })

  return (
    <div className="flex flex-col gap-4 bg-secondary rounded-none max-w-2xl p-8">
      <h2 className="text-2xl font-bold">Welcome back</h2>
      <p className="text-md text-muted-foreground">Select your account to continue</p>
      {submitError && (
        <Alert className="border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Failed</AlertTitle>
          <AlertDescription>Account not found. Please try again.</AlertDescription>
        </Alert>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="flex flex-col gap-2"
      >
        <form.Field
          name="username"
          validators={{
            onMount: ({ value }) => {
              if (!value) return { message: 'Please select an account' }
              return undefined
            },
            onChange: ({ value }) => {
              if (!value) return { message: 'Please select an account' }
              return undefined
            },
          }}
        >
          {(field) => (
            <div className="flex flex-col gap-2">
              <Select
                value={field.state.value}
                onValueChange={(val) => field.handleChange(val)}
              >
                <SelectTrigger className="rounded-none">
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.address} value={wallet.name}>
                      {wallet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              className="w-full rounded-none"
              disabled={!canSubmit || isSubmitting || success}
            >
              {success ? (
                <Check className="text-green-400" />
              ) : isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                'Continue'
              )}
            </Button>
          )}
        </form.Subscribe>
      </form>
      <p className="text-muted-foreground text-xs">By clicking "Continue" you agree to our Terms of Service and Privacy Policy.</p>
    </div>
  )
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {!field.state.meta.isTouched ? (
        <em className="text-xs invisible">_</em>
      ) : !field.state.meta.isValid ? (
        <em className="text-xs text-destructive">
          {field.state.meta.errors[0]?.message}
        </em>
      ) : (
        <em className="text-xs text-green-500">Looks good!</em>
      )}
      {field.state.meta.isValidating ? (
        <em className="text-xs text-muted-foreground">Validating...</em>
      ) : null}
    </>
  )
}
