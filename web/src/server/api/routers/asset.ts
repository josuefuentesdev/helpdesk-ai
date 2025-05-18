import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const assetRouter = createTRPCRouter({
  getAll: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.asset.findMany()
    }),
});
