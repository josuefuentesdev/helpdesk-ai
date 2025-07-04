import { redirect } from "next/navigation"
import { AuthError } from "next-auth"
import { signIn, } from "@/server/auth"
import { providerMap } from "@/server/auth/config"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getTranslations } from "next-intl/server"
import { LanguageToggle } from "@/components/language-toggle"

const ERROR_URL = "/error"

// ! Is almost the same as SignInForm but with different copy
export async function SignUpForm({
  className,
  callbackUrl = "/",
}: {
  className?: string;
  callbackUrl?: string;
}) {
  const t = await getTranslations('SignUpForm');

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <form className="flex flex-col gap-6"
        action={async (formData) => {
          "use server"
          console.log("signInCallbackUrl", callbackUrl)
          await signIn("resend", formData, {
            redirectTo: callbackUrl,
          })
        }}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-balance text-sm text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">{t('emailLabel')}</Label>
            <Input id="email" name="email" type="email" placeholder={t('emailPlaceholder')} required />
          </div>
          <Button type="submit" className="w-full cursor-pointer">
            {t('loginButton')}
          </Button>
        </div>
      </form>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          {t('orContinueWith')}
        </span>
      </div>
      <div className="grid gap-2">
        {Object.values(providerMap).map((provider) => (
          <form
            key={provider.id}
            action={async () => {
              "use server"
              try {
                await signIn(provider.id, {
                  redirectTo: callbackUrl,
                })
              } catch (error) {
                if (error instanceof AuthError) {
                  return redirect(`${ERROR_URL}?error=${error.type}`)
                }
                throw error
              }
            }}
          >
            <button type="submit" className="w-full border rounded px-4 py-2 flex items-center justify-center gap-2 cursor-pointer">
              <span>{t('signUpWith') + ' ' + provider.name}</span>
            </button>
          </form>
        ))}
      </div>
      <div className="text-center text-sm">
        {t('haveAccount')}{" "}
        <a href="/sign-in" className="underline underline-offset-4">
          {t('signInLink')}
        </a>
      </div>
      <div className="flex justify-center">
        <LanguageToggle />
      </div>
    </div>
  )
}
