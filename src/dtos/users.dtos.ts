import { z } from 'zod';
import { zValidateMobileNo } from '@helpers/zod.helper';
import { userSignUpSchemaZ } from './auth.dtos';

export const UserUpdateSchemaZ = z.object({
  name: z.string().optional(),
  phone: zValidateMobileNo.optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
});

export const UserIdSchemaZ = z.object({
  userId: z.string(),
});

export type UserUpdate = z.infer<typeof userSignUpSchemaZ>;
