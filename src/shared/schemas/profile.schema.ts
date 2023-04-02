import { z } from "zod";

export const getUserByUsernameSchema = z.object({ username: z.string() });
