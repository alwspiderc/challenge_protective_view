import { useState } from 'react';
import { updateVisit } from '../useApi';
import type { UserAPI } from '../usertypes';

export function useUserUpdateVisit(
	onSuccess?: (updatedUser: UserAPI) => void,
	onError?: (error: Error) => void
) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	async function handleRegisterVisit(id: string): Promise<void> {
		try {
			setLoading(true);
			setError(null);
			const updatedUser = await updateVisit(id);

			if (onSuccess) {
				onSuccess(updatedUser);
			}
		} catch (error) {
			console.error('Failed to update visit:', error);
			setError(error as Error);
			if (onError) {
				onError(error as Error);
			}
			throw error;
		} finally {
			setLoading(false);
		}
	}

	return { handleRegisterVisit, loading, error };
}
