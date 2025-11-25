import { updateVisit } from '../useApi';

export async function useUserUpdateVisit(id: string) {
	await updateVisit(id);
}
