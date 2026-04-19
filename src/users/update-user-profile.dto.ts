import { z } from 'zod';

const usernamePattern = /^[a-zA-Z0-9_]+$/;
const trimmedRequiredString = z.string().trim().min(1);

export const updateUserProfileSchema = z.object({
  name: trimmedRequiredString.max(100),
  username: z.string().trim().min(3).max(32).regex(usernamePattern).optional(),
  displayUsername: trimmedRequiredString.max(50).optional(),
});

export type UpdateUserProfileDto = z.infer<typeof updateUserProfileSchema>;
