import { useState } from 'react'
import { useForm, type AnyFieldApi } from '@tanstack/react-form'
import { useAtomValue, useSetAtom } from 'jotai'
import { useNavigate } from '@tanstack/react-router'
import { walletsAtom } from '@/atoms/walletsAtom'
import { activeWalletAtom } from '@/atoms/activeWalletAtom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, TriangleAlert, Check } from 'lucide-react'
import { createUmPasskeyWallet, checkBrowserWebAuthnSupport } from '@/lib/um-passkey-wallet'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

export default function SignupComponent() {
  const wallets = useAtomValue(walletsAtom)
  const setActiveWallet = useSetAtom(activeWalletAtom)
  const isWebAuthnSupported = checkBrowserWebAuthnSupport()
  const [submitError, setSubmitError] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      username: '',
    },
    onSubmit: async ({ value }) => {
      const result = await createUmPasskeyWallet(value.username)
      if (result) {
        setActiveWallet(result.activeWallet)
        setSuccess(true)
        setTimeout(() => navigate({ to: '/account' }), 1000)
      } else {
        setSubmitError(true)
      }
    },
  })

  return (
    <div className="flex flex-col gap-4 bg-secondary rounded-none max-w-2xl p-8">
      <h2 className="text-2xl font-bold">Get started with UnitMetal Pay</h2>
      <p className="text-md text-muted-foreground">Enter a username to continue</p>
      {!isWebAuthnSupported && (
        <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
          <TriangleAlert className="h-4 w-4" />
          <AlertDescription>
            Your browser does not support WebAuthn. Please use a modern browser to continue.
          </AlertDescription>
        </Alert>
      )}
      {submitError && (
        <Alert className="border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Failed</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Account creation failed or was cancelled.</span>
            <Button
              variant="outline"
              size="sm"
              className="ml-4 rounded-none"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </AlertDescription>
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
              if (!value) return { message: 'Username is required' }
              return undefined
            },
            onChange: ({ value }) => {
              if (!value) return { message: 'Username is required' }
              if (wallets.some((w) => w.name === value))
                return { message: 'Username already taken' }
              return undefined
            },
          }}
        >
          {(field) => (
            <div className="flex flex-col gap-2">
              <Input
                type="text"
                placeholder="example"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="p-6 text-lg md:text-lg lg:text-lg"
              />
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
