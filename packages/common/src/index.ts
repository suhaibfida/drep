import { z } from "zod";
export const signupschema = z.object({
  username: z.string,
  email: z.string,
  password: z.string,
});
export const loginschema = z.object({
  username: z.string,
  password: z.string,
});
