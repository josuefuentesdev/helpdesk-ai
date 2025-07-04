import { type AppRouter } from "@/server/api/root";
import { type inferRouterOutputs } from "@trpc/server";
import type { RouterInputs } from "./trpc/react";

type RouterOutput = inferRouterOutputs<AppRouter>;

// Asset
type AssetGetAll = RouterOutput['asset']['getAll']
export type AssetGetAllItem = AssetGetAll[number];

export type AssetGetOne = NonNullable<RouterOutput['asset']['getOne']>;
export type CreateAsset = NonNullable<RouterInputs['asset']['create']>;

// User
type UserGetAll = RouterOutput['user']['getAll']
export type UserGetAllItem = UserGetAll[number];

export type UserGetOne = NonNullable<RouterOutput['user']['getOne']>;