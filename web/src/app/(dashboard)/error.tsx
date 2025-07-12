'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { PreviousPageButton } from "@/components/previous-page-button";

type CustomError = Error & {
  digest?: string;
  code?: string;
  data?: {
    code?: string;
    message?: string;
  };
};

type ErrorPageProps = {
  error: CustomError;
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const [isResetting, setIsResetting] = useState(false);
  
  const t = useTranslations('error');

  const isForbidden = [
    error.message.includes('FORBIDDEN'),
    error.code === 'FORBIDDEN',
    error.data?.code === 'FORBIDDEN',
  ].some(Boolean);

  const handleReset = () => {
    setIsResetting(true);
    try {
      reset();
    } catch (resetError) {
      console.error(resetError);
    } finally {
      setIsResetting(false);
    }
  };

  const title = isForbidden ? t('accessDenied') : t('somethingWentWrong');
  const message = isForbidden
    ? t('noPermission')
    : error.message ?? t('unexpectedError');

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="container flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
              {title}
            </h1>
            <p className="text-muted-foreground">{message}</p>
          </div>

          {error.digest && (
            <div className="rounded-md bg-destructive/15 p-4 text-left text-sm text-destructive">
              <div className="font-medium">{t('errorDetails')}</div>
              <div className="mt-1 break-all font-mono text-xs">
                {error.digest}
              </div>
            </div>
          )}

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <PreviousPageButton />

            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/">{t('goToHome')}</Link>
            </Button>

            {!isForbidden && (
              <Button
                onClick={handleReset}
                disabled={isResetting}
                className="w-full sm:w-auto"
              >
                {isResetting ? t('retrying') : t('tryAgain')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
