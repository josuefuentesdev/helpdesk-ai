'use server';

import { type Locale, defaultLocale } from '@/i18n/config';
import { api } from '@/trpc/server';

export async function getUserLocale() {
  try {
    return (await api.user.getLocale())?.locale ?? defaultLocale;
  } catch (error) {
    // If the user is not logged in, return the default locale
    return defaultLocale;
  }
}

export async function setUserLocale(locale: Locale) {
  await api.user.updateLocale({ locale });
}