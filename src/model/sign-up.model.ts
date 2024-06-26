import { z } from 'zod';

export class SignUpRequest {
  name: string;
  email: string;
}

export const signUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});
