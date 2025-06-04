import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

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
});
