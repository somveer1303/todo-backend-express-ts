import { ZodError } from 'zod';

import { RequestContentLocation } from '@interfaces/zod.interface';

export class RequestValidationError extends Error {
  requestContentLocation: RequestContentLocation;
  zodError: ZodError;

  constructor(requestContentLocation: RequestContentLocation, zodError: ZodError) {
    super('Request validation error');

    this.requestContentLocation = requestContentLocation;
    this.zodError = zodError;
  }
}
