import { z } from "zod";

// These are taken out of the routers so you can run input validation on the client before it hits the server if you chose to
export const getByPostIdSchema = z.object({ postId: z.string() });
export const getByUserIdSchema = z.object({ userId: z.string() });
export const createSchema = z.object({
  content: z.string().emoji("Only emojis are allowed").min(1).max(280),
});
export const updateSchema = z.object({
  postId: z.string(),
  content: z.string().emoji("Only emojis are allowed").min(1).max(280),
});
export const deleteSchema = z.object({ postId: z.string() });
