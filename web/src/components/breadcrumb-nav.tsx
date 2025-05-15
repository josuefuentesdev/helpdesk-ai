"use client"

import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

export default function BreadcrumbNav() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, idx) => {
          const href = '/' + segments.slice(0, idx + 1).join('/');
          const isLast = idx === segments.length - 1;
          return (
            <Fragment key={href}>
              {idx > 0 && <BreadcrumbSeparator className="hidden md:block" />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{decodeURIComponent(segment.replace(/-/g, ' '))}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{decodeURIComponent(segment.replace(/-/g, ' '))}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}