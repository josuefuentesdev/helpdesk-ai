import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { locales } from "@/i18n/config";
import { UserRole, UserType } from "@prisma/client";
import { type User } from "next-auth"


const getHiddenUserTypes = (user: User): UserType[] => {
  const hiddenTypes: UserType[] = [UserType.SYSTEM];
  if (user.role !== UserRole.ADMIN) {
    hiddenTypes.push(UserType.USER);
  }
  return hiddenTypes;
};

export const userRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const isSelf = input.id === ctx.session.user.id;
      return ctx.db.user.findFirst({
        where: {
          id: input.id,
          ...(isSelf ? {} : {
            type: {
              notIn: getHiddenUserTypes(ctx.session.user),
            },
          }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          locale: true,
          departmentId: true,
        },
      });
    }),

  getOneAvatar: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
        select: {
          image: true,
          name: true,
        },
      })
    }),

  getAll: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          type: {
            notIn: getHiddenUserTypes(ctx.session.user),
          },
        },
      });
    }),

  getAllIdentifiers: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
        where: {
          type: {
            notIn: getHiddenUserTypes(ctx.session.user),
          }
        },
      })
    }),

  updateOne: protectedProcedure
    .input(z.object({
      id: z.string(),
      locale: z.enum(locales),
      departmentId: z.string().optional(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          locale: input.locale,
          departmentId: input.departmentId,
        },
      })
    }),

  getLocale: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          locale: true,
        },
      })
    }),

  updateLocale: protectedProcedure
    .input(z.object({ locale: z.enum(locales) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          locale: input.locale,
        },
      })
    }),
});
