import { z } from 'zod';

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	cpf: z.string(),
	active: z.boolean(),
	last_verified_date: z.string(),
	verify_frequency_in_days: z.number()
});

export type User = z.infer<typeof userSchema>;
