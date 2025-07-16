import { type AppRouter } from "@/server/api/root";
import { type inferRouterOutputs } from "@trpc/server";
import type { RouterInputs } from "./trpc/react";

type RouterOutput = inferRouterOutputs<AppRouter>;

// Dashboard
export type DashboardStats = RouterOutput['dashboard']['getStats']

type DashboardRecentTickets = RouterOutput['dashboard']['getRecentTickets']
export type DashboardRecentTicketsItem = DashboardRecentTickets[number];

// Asset
type AssetGetAll = RouterOutput['asset']['getAll']
export type AssetGetAllItem = AssetGetAll[number];

export type AssetGetOne = NonNullable<RouterOutput['asset']['getOne']>;
export type CreateAsset = NonNullable<RouterInputs['asset']['create']>;

// Ticket
type TicketGetAll = RouterOutput['ticket']['getAll']
export type TicketGetAllItem = TicketGetAll[number];

export type TicketGetOne = NonNullable<RouterOutput['ticket']['getOne']>;
export type CreateTicket = NonNullable<RouterInputs['ticket']['create']>;

type TicketGetComments = RouterOutput['ticket']['getComments']
export type TicketGetCommentsItem = TicketGetComments[number];

// User
type UserGetAll = RouterOutput['user']['getAll']
export type UserGetAllItem = UserGetAll[number];

export type UserGetOne = NonNullable<RouterOutput['user']['getOne']>;