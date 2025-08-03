/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from "next-intl/server"
import { LanguageToggle } from "@/components/language-toggle"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

export default async function VerifyRequestPage() {
  const session = await auth();
  const t = await getTranslations('VerifyRequestPage');

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <Image
              src="/helpdesk-ai.webp"
              alt="helpdesk-ai logo"
              width={32}
              height={32}
            />
            Helpdesk AI
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">{t('title')}</h1>
                <p className="text-balance text-sm text-muted-foreground">
                  {t('subtitle')}
                </p>
              </div>
              <div className="text-center">
                <Button asChild variant="outline" className="w-full">
                  <a href="/sign-in">
                    {t('backToSignIn')}
                  </a>
                </Button>
              </div>
              <div className="flex justify-center">
                <LanguageToggle />
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/helpdesk-ai-singin.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  )
}
