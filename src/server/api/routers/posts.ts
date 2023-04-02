import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { addUserDataToPosts } from "~/server/helpers/addUserDataToPosts";
import {
  createSchema,
  deleteSchema,
  getByPostIdSchema,
  getByUserIdSchema,
  updateSchema,
} from "~/shared/schemas/posts.schema";

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const postsRouter = createTRPCRouter({
  getByPostId: publicProcedure
    .input(getByPostIdSchema)
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      return (await addUserDataToPosts([post]))[0];
    }),

  getByUserId: publicProcedure
    .input(getByUserIdSchema)
    .query(({ ctx, input }) =>
      ctx.prisma.post
        .findMany({
          where: { authorId: input.userId },
          take: 100,
          orderBy: [{ createdAt: "desc" }],
        })
        .then(addUserDataToPosts)
    ),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    return await addUserDataToPosts(posts);
  }),

  create: privateProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { success } = await ratelimit.limit(authorId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
        },
      });

      return post;
    }),

  update: privateProcedure
    .input(updateSchema)
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
        select: { authorId: true },
      });
      if (ctx.userId !== post?.authorId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return await ctx.prisma.post.update({
        where: { id: input.postId },
        data: { content: input.content },
      });
    }),

  delete: privateProcedure
    .input(deleteSchema)
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
        select: { authorId: true },
      });
      if (ctx.userId !== post?.authorId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return await ctx.prisma.post.delete({ where: { id: input.postId } });
    }),
});
