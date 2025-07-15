import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const commentRouter = createTRPCRouter({
  getByTicket: protectedProcedure
    .input(z.object({ ticketId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.comment.findMany({
        where: { ticketId: input.ticketId },
        orderBy: { createdAt: "asc" },
        include: { author: { select: { id: true, name: true, image: true } } },
      });
    }),
  add: protectedProcedure
    .input(z.object({ ticketId: z.string(), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
          ticketId: input.ticketId,
          content: input.content,
          authorId: ctx.session.user.id,
        },
        include: { author: { select: { id: true, name: true, image: true } } },
      });
    }),
});