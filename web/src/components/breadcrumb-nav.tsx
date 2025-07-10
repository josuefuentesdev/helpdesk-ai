"use client"

import { Fragment } from "react";
import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import { api } from "@/trpc/react"
import { Skeleton } from "@/components/ui/skeleton"

export function BreadcrumbNav() {
  const pathname = usePathname();
  const { data: breadcrumbs, isPending, error } = api.breadcrumb.parseBreadcrumb.useQuery({ path: pathname });

  const t = useTranslations('BreadcrumbNav');

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {isPending ? (
          <Skeleton className="inline-block h-4 w-32 align-middle" />
        ) : error ? (
          <BreadcrumbItem>
            <BreadcrumbPage className="text-red-500">Error loading breadcrumbs</BreadcrumbPage>
          </BreadcrumbItem>
        ) : breadcrumbs ? (
          breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            // Translate only the first segment
            const displayLabel = idx === 0 ? t(crumb.label) : crumb.label;
            return (
              <Fragment key={crumb.href}>
                {idx > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{displayLabel}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href}>{displayLabel}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  );
}