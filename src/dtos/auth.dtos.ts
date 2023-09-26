import { z } from 'zod';
import { zValidateMobileNo } from '@helpers/zod.helper';

export const userSignInSchemaZ = z.object({
  email: z.string(),
  password: z.string(),
});

export const userSignUpSchemaZ = z.object({
  name: z.string(),
  phone: zValidateMobileNo.optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type UserSignIn = z.infer<typeof userSignInSchemaZ>;
export type UserSignUp = z.infer<typeof userSignUpSchemaZ>;
