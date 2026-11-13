import { z } from 'zod';
export const registerSchema = z.object({
  name: z.string().trim().min(3, 'Name must be at least 3 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
export const profileSchema = z.object({
  name: z.string().trim().min(3, 'Name must be at least 3 characters'),
  bio: z.string().max(300).optional().default(''),
  profilePicture: z.union([z.string().url(), z.literal('')]).optional().default('')
});
export const postSchema = z.object({
  text: z.string().trim().max(2000).optional().default(''),
  image: z.union([z.string().url(), z.literal('')]).optional().default('')
}).refine(data => data.text || data.image, { message: 'Write something or add an image' });
