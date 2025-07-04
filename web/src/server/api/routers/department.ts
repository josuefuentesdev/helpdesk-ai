import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";

export const departmentRouter = createTRPCRouter({
  getAll: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.department.findMany({
        select: {
          id: true,
          name: true,
        },
      })
    }),

  updateOne: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1, 'Name is required'),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.department.update({
          where: { id: input.id },
          data: { name: input.name },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          // TODO: handle trpc translations, getTranslations doesn't work straight away
          throw new TRPCError({ code: "CONFLICT", message: "Department name already exists" });
        }
        throw error;
      }
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1, 'Name is required'),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.department.create({
          data: { name: input.name },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          throw new TRPCError({ code: "CONFLICT", message: "Department name already exists" });
        }
        throw error;
      }
    }),

  deleteOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.department.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
