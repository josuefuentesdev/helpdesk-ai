'use server';

import { type Locale, defaultLocale, locales } from '@/i18n/config';
import { api } from '@/trpc/server';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale() {
  try {
    return (await api.user.getLocale())?.locale ?? defaultLocale;
  } catch {
    // If the user is not logged in use the next-intl cookie
    const cookieLocale = (await cookies()).get(COOKIE_NAME)?.value;
    // validate cookieLocale
    if (!cookieLocale || !locales.includes(cookieLocale as Locale)) {
      return defaultLocale;
    }
    return cookieLocale as Locale;
  }
}

export async function setUserLocale(locale: Locale) {
  try {
    await api.user.updateLocale({ locale });
  } catch {
    // If the user is not logged in use the next-intl cookie
    (await cookies()).set(COOKIE_NAME, locale);
  }
}