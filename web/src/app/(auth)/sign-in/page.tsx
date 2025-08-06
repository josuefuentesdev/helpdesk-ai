/* eslint-disable @next/next/no-img-element */
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';
import { SignInForm } from './sign-in-form';
import { AuthHeader } from '../auth-header';

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
        <AuthHeader />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignInForm callbackUrl={resolvedSearchParams.callbackUrl} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/banner.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover object-right"
        />
      </div>
    </div>
  )
}