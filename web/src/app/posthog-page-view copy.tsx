import { Suspense } from "react";
import PostHogPageView from "./posthog-page-view";
import type { Session } from "next-auth";

export function SuspendedPostHogPageView({ session }: { session: Session | null }) {
  return (
    <Suspense fallback={null}>
      <PostHogPageView session={session} />
    </Suspense>
  );
}