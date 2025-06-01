// Potentially imported from a shared config

import type { locales } from "@/i18n/config";

 
declare module 'next-intl' {
  interface AppConfig {
    // ...
    Locale: (typeof locales)[number];
  }
}