"use client"

import { useRouter } from 'next/navigation'
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button"


export function PreviousPageButton() {
  const t = useTranslations("PreviousPageButton");
  const router = useRouter();

  return (
    <Button onClick={() => router.back()}>
      {t("label")}
    </Button>
  );
};