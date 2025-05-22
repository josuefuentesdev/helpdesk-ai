import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { AssetStatus, AssetType } from "@prisma/client";

export const assetRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.asset.findUnique({
        where: { id: input.id },
      })
    }),

  getAll: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.asset.findMany()
    }),

  updateOne: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
      type: z.nativeEnum(AssetType).nullish(),
      status: z.nativeEnum(AssetStatus).nullish(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.db.asset.update({
        where: { id: input.id },
        data: {
          name: input.name,
          type: input.type ?? undefined,
          status: input.status ?? undefined,
        },
      })
    }
    ),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      type: z.nativeEnum(AssetType),
      status: z.nativeEnum(AssetStatus),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.db.asset.create({
        data: {
          name: input.name,
          type: input.type,
          status: input.status,
        },
      })
    }),
});
