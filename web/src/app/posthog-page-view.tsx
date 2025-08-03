"use client"

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { type Session } from "next-auth";
import { usePostHog } from "posthog-js/react";

export default function PostHogPageView({ session }: { session: Session | null }): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    // Track pageviews
    if (pathname) {
      const params = searchParams.toString();
      const url = `${window.origin}${pathname}${params ? `?${params}` : ""}`;
      posthog.capture("$pageview", { "$current_url": url });
    }

    // Identify or reset user
    const userEmail = session?.user?.email;
    if (userEmail && !posthog._isIdentified()) {
      posthog.identify(userEmail, {
        email: userEmail,
        name: session.user.name,
        role: session.user.role,
      });
    } else if (!userEmail && posthog._isIdentified()) {
      posthog.reset();
    }
  }, [pathname, searchParams, posthog, session]);

  return null;
}