import axios from 'axios';

export const BASE_URL = 'https://tatico.spocws.icu/teste/followups_f38d';
export const api = axios.create({
	baseURL: BASE_URL
});
