import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { locales } from "@/i18n/config";

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
          locale: true,
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
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
    }),

  getLocale: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          locale: true,
        },
      })
    }),

  updateLocale: protectedProcedure
    .input(z.object({ locale: z.enum(locales) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          locale: input.locale,
        },
      })
    }),
});
