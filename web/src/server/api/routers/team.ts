import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const teamRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.team.findUnique({
        where: { id: input.id },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1, 'Name is required'),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.team.create({
          data: { name: input.name },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          throw new TRPCError({ code: "CONFLICT", message: "Team name already exists" });
        }
        throw error;
      }
    }),

  updateOne: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1, 'Name is required'),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.team.update({
          where: { id: input.id },
          data: { name: input.name },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          throw new TRPCError({ code: "CONFLICT", message: "Team name already exists" });
        }
        throw error;
      }
    }),

  deleteOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.team.delete({
        where: {
          id: input.id,
        },
      });
    }),

  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.team.findMany();
    }),

});
