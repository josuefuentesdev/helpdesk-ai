import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { assetRouter } from "./routers/asset";
import { userRouter } from "./routers/user";
import { departmentRouter } from "./routers/department";
import { breadcrumbRouter } from "./routers/breadcrumb";
import { ticketRouter } from "./routers/ticket";
import { teamRouter } from "./routers/team";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  asset: assetRouter,
  user: userRouter,
  department: departmentRouter,
  breadcrumb: breadcrumbRouter,
  ticket: ticketRouter,
  team: teamRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
