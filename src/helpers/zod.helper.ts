import { z } from 'zod';
import { isValidMobileNo, isValidIfscCode } from '@utils/string.utils';

export const zValidateMobileNo = z
  .string()
  .refine(mobile => isValidMobileNo(mobile), { message: 'Invalid mobile number' });
