import { Injectable } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ValidationService {
  validate<T>(value: T, schema: z.ZodSchema<T>): T {
    return schema.parse(value);
  }
}
