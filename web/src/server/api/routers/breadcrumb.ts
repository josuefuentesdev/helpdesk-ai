import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { z } from "zod";


export const breadcrumbRouter = createTRPCRouter({
  parseBreadcrumb: protectedProcedure
    .input(z.object({ path: z.string() }))
    .query(async ({ ctx, input }) => {
      const segments: string[] = input.path.split("/").filter(Boolean);
      const breadcrumbs: { href: string; label: string }[] = [];
      const hrefParts: string[] = [];

      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        if (!segment) continue;
        hrefParts.push(segment);
        let label = segment;
        // Check if this is an ID after a known type
        const prev = segments[i - 1];
        if (prev === "users") {
          const user = await ctx.db.user.findUnique({ where: { id: segment } });
          label = user ? `${user.name} (${user.email})` : segment;
        } else if (prev === "tickets") {
          // Uncomment if you have a tickets table
          // const ticket = await ctx.db.ticket.findUnique({ where: { id: segment } });
          // label = ticket?.title ?? segment;
          label = segment;
        } else if (prev === "assets") {
          const asset = await ctx.db.asset.findUnique({ where: { id: segment } });
          label = asset?.name ?? segment;

        } else {
          try {
            label = decodeURIComponent(segment.replace(/-/g, ' '));
          } catch {
            label = segment;
          }
        }
        breadcrumbs.push({ href: '/' + hrefParts.join('/'), label });
      }
      return breadcrumbs;
    }),
});
