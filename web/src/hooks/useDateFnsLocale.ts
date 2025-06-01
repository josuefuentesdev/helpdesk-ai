"use client"

import { useLocale } from "next-intl"
import type { Locale as DateFnsLocale } from "date-fns"

// Import all supported date-fns locales
import { enUS, es } from "date-fns/locale"
import { type Locale as AppLocale } from "@/i18n/config"

// Map app locales to date-fns locales
const localeMap: Record<AppLocale, DateFnsLocale> = {
  en: enUS,
  es: es,
}

/**
 * Custom hook that returns the current locale as a date-fns locale object
 * for use with components like DayPicker
 */
export function useDateFnsLocale(): DateFnsLocale {
  const appLocale = useLocale()
  return localeMap[appLocale]
}
