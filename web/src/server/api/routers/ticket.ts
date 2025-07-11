import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { TicketPriority, TicketStatus } from "@prisma/client";

export const ticketRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.ticket.findUnique({
        select: {
          id: true,
          title: true,
          description: true,
          priority: true,
          status: true,
          closedAt: true,
          dueAt: true,
          agentId: true,
          teamId: true,
          createdAt: true,
          createdById: true,
          updatedAt: true,
          updatedById: true,
        },
        where: {
          id: input.id,
          deletedAt: null,
        },
      });
    }),

  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.ticket.findMany({
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          title: true,
          description: true,
          priority: true,
          status: true,
          closedAt: true,
          dueAt: true,
          agentId: true,
          teamId: true,
          createdAt: true,
          createdById: true,
          updatedAt: true,
          updatedById: true,
          team: {
            select: {
              name: true,
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1, 'Title is required'),
      description: z.string().min(1, 'Description is required'),
      priority: z.nativeEnum(TicketPriority),
      status: z.nativeEnum(TicketStatus).optional(),
      assigneeUserId: z.string().optional(),
      assigneeTeamId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.ticket.create({
        data: {
          ...input,
          createdById: ctx.session?.user.id,
        },
      });
    }),

  updateOne: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1, 'Title is required'),
      description: z.string().min(1, 'Description is required'),
      priority: z.nativeEnum(TicketPriority),
      status: z.nativeEnum(TicketStatus),
      assigneeUserId: z.string().optional(),
      assigneeTeamId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.ticket.update({
        where: { id, deletedAt: null },
        data: {
          ...data,
          updatedById: ctx.session?.user.id,
        },
      });
    }),

});
