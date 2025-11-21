import { api } from './apiConfig';
import axios from 'axios';

export interface ResponseUser {
	id: string;
	name: string;
	cpf: string;
	active: boolean; // Indica se o usuário está ativo no monitoramento
	last_verified_date: string; // Data e hora da última visita realizada
	verify_frequency_in_days: number; // Frequência em dias para a próxima visita
}

export async function users(): Promise<ResponseUser[]> {
	const response = await axios.get<ResponseUser[]>(`${api.defaults.baseURL}`);
	return response.data;
}
