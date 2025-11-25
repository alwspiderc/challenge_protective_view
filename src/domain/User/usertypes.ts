import { z } from 'zod';

export interface UserAPI {
	id: string;
	name: string;
	cpf: string;
	active: boolean;
	last_verified_date: string;
	verify_frequency_in_days: number;
}

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	cpf: z.string(),
	active: z.boolean(),
	last_verified_date: z.string(),
	verify_frequency_in_days: z.number()
});

export type User = z.infer<typeof userSchema>;
