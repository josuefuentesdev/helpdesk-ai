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
        where: {
          id: input.id,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          type: true,
          subtype: true,
          vendor: true,
          identifier: true,
          model: true,
          serialNumber: true,
          purchaseAt: true,
          warrantyExpiresAt: true,
          status: true,
          assignedToId: true,
          createdAt: true,
          createdById: true,
          updatedAt: true,
          updatedById: true,
        },
      })
    }),

  getAll: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.asset.findMany({
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          type: true,
          subtype: true,
          vendor: true,
          identifier: true,
          model: true,
          serialNumber: true,
          purchaseAt: true,
          warrantyExpiresAt: true,
          status: true,
          assignedToId: true,
          createdAt: true,
          createdById: true,
          updatedAt: true,
          updatedById: true,
        },
      })
    }),

  updateOne: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1, 'Name is required'),
      type: z.nativeEnum(AssetType),
      subtype: z.string().optional(),
      vendor: z.string().optional(),
      identifier: z.string().optional(),
      model: z.string().optional(),
      serialNumber: z.string().optional(),
      purchaseAt: z.date().optional(),
      warrantyExpiresAt: z.date().optional(),
      status: z.nativeEnum(AssetStatus),
      assignedToId: z.string().optional(),
    }))
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.asset.update({
        where: {
          id,
          deletedAt: null,
        },
        data: {
          ...data,
          updatedById: ctx.session?.user.id,
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1, 'Name is required'),
      type: z.nativeEnum(AssetType),
      subtype: z.string().optional(),
      vendor: z.string().optional(),
      identifier: z.string().optional(),
      model: z.string().optional(),
      serialNumber: z.string().optional(),
      purchaseAt: z.date().optional(),
      warrantyExpiresAt: z.date().optional(),
      status: z.nativeEnum(AssetStatus),
      assignedToId: z.string().optional(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.db.asset.create({
        data: {
          ...input,
          createdById: ctx.session?.user.id,
        },
      });
    }),
});
