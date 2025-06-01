"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { toast } from "sonner"

export function LanguageToggle() {
  const t = useTranslations("LanguageToggle");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  // Use the updateLocale mutation
  const { mutate: updateLocale } = api.user.updateLocale.useMutation({
    onSuccess: () => {
      toast.success("Locale updated successfully")
      // Reload the page to apply the new locale
      router.refresh();
    },
  });

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === locale) return;
    
    startTransition(() => {
      // Update the locale using the API
      updateLocale({ locale: newLocale });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t("label")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => handleLocaleChange(l)}
            className={locale === l ? "bg-muted font-medium" : ""}
          >
            {t(l)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
