import type { User } from '@/domain/User/usertypes';

/**
 * Converte data de diferentes formatos para objeto Date
 * Suporta:
 * - "24/11/2025 15:38:45" (DD/MM/YYYY HH:mm:ss)
 * - "24/11/2025" (DD/MM/YYYY)
 * - "2025/11/25" (YYYY/MM/DD)
 */
function parseBRDate(dateString: string): Date {
	const cleanDate = dateString.trim();

	const [datePart, timePart] = cleanDate.split(' ');

	let day: number, month: number, year: number;

	const parts = datePart.split('/');

	if (parts[0].length === 4) {
		[year, month, day] = parts.map(Number);
	} else {
		[day, month, year] = parts.map(Number);
	}

	if (timePart) {
		const [hours, minutes, seconds] = timePart.split(':').map(Number);
		return new Date(year, month - 1, day, hours, minutes, seconds);
	}

	return new Date(year, month - 1, day);
}

/**
 * Calcula a data da próxima visita baseado na última verificação e frequência
 */
export function calculateNextVisitDate(
	lastVerifiedDate: string,
	verifyFrequencyInDays: number
): Date {
	const lastDate = parseBRDate(lastVerifiedDate);
	const nextDate = new Date(lastDate);
	nextDate.setDate(nextDate.getDate() + verifyFrequencyInDays);
	return nextDate;
}

/**
 * Verifica se a visita está pendente
 * Uma visita é considerada pendente se a data atual ultrapassou a data limite
 */
export function isVisitPending(
	lastVerifiedDate: string,
	verifyFrequencyInDays: number
): boolean {
	const nextVisitDate = calculateNextVisitDate(
		lastVerifiedDate,
		verifyFrequencyInDays
	);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	nextVisitDate.setHours(0, 0, 0, 0);
	return today > nextVisitDate;
}

/**
 * Calcula quantos dias faltam para a próxima visita
 * Retorna número negativo se a visita está atrasada
 */
export function getDaysUntilVisit(
	lastVerifiedDate: string,
	verifyFrequencyInDays: number
): number {
	const nextVisitDate = calculateNextVisitDate(
		lastVerifiedDate,
		verifyFrequencyInDays
	);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	nextVisitDate.setHours(0, 0, 0, 0);

	const diffTime = nextVisitDate.getTime() - today.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
}

/**
 * Verifica se a visita está próxima (1 ou 2 dias)
 */
export function isVisitSoon(
	lastVerifiedDate: string,
	verifyFrequencyInDays: number
): boolean {
	const daysUntilVisit = getDaysUntilVisit(
		lastVerifiedDate,
		verifyFrequencyInDays
	);
	return daysUntilVisit > 0 && daysUntilVisit <= 2;
}

/**
 * Formata uma data para o formato brasileiro (dd/mm/aaaa)
 */
export function formatDateToBR(date: Date): string {
	return date.toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	});
}

/**
 * Formata uma string de data para o formato brasileiro (DD/MM/YYYY)
 * Suporta múltiplos formatos de entrada
 */
export function formatLastVerifiedDate(dateString: string): string {
	const date = parseBRDate(dateString);
	return formatDateToBR(date);
}

/**
 * Calcula informações completas sobre a próxima visita
 */
export function getVisitInfo(user: User) {
	const nextVisitDate = calculateNextVisitDate(
		user.last_verified_date,
		user.verify_frequency_in_days
	);
	const isPending = isVisitPending(
		user.last_verified_date,
		user.verify_frequency_in_days
	);
	const isSoon = isVisitSoon(
		user.last_verified_date,
		user.verify_frequency_in_days
	);
	const daysUntilVisit = getDaysUntilVisit(
		user.last_verified_date,
		user.verify_frequency_in_days
	);

	return {
		nextVisitDate,
		isPending,
		isSoon,
		daysUntilVisit,
		formattedNextVisitDate: formatDateToBR(nextVisitDate),
		formattedLastVerifiedDate: formatLastVerifiedDate(user.last_verified_date)
	};
}
