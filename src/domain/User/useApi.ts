import axios from 'axios';
import { api } from '../../infra/apiConfig';

import type { UserAPI } from './usertypes';

export async function getList(): Promise<UserAPI[]> {
	const response = await axios.get<UserAPI[]>(`${api.defaults.baseURL}`);
	return response.data;
}

export async function updateVisit(id: string) {
	await axios.patch(`${api.defaults.baseURL}/${id}`, {});
}
