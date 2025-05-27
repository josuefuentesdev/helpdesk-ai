import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
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
