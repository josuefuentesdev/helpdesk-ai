import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      })
    }),
  getAll: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      })
    }),
});
