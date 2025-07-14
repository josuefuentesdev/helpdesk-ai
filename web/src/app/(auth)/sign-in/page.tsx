/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';
import { SignInForm } from './sign-in-form';


export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const resolvedSearchParams = await searchParams

  const session = await auth();

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
            <SignInForm callbackUrl={resolvedSearchParams.callbackUrl} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/helpdesk-ai-singin.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  )
}