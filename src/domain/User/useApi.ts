import axios from 'axios';
import { api } from '../../infra/apiConfig';

import type { UserAPI } from './usertypes';

export async function getList(): Promise<UserAPI[]> {
	const response = await axios.get<UserAPI[]>(`${api.defaults.baseURL}`);
	return response.data;
}

export async function updateVisit(id: string): Promise<UserAPI> {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');

	const currentDateTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;

	const response = await axios.patch<UserAPI>(`${api.defaults.baseURL}/${id}`, {
		last_verified_date: currentDateTime
	});
	return response.data;
}
