import type { ColumnDef } from '@tanstack/react-table';
import { IconCircleCheckFilled, IconLoader } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getVisitInfo } from '@/lib/dateUtils';
import type { User } from '@/domain/User/usertypes';

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: 'name',
		header: 'Nome'
	},
	{
		accessorKey: 'cpf',
		header: 'CPF',
		cell: ({ row }) => <div className="w-40">{row.original.cpf}</div>
	},
	{
		accessorKey: 'verify_frequency_in_days',
		header: () => <div className="w-40 ">Frequência (dias)</div>,
		cell: ({ row }) => (
			<div className="w-20 text-center">
				{row.original.verify_frequency_in_days}
			</div>
		)
	},
	{
		accessorKey: 'last_verified_date',
		header: 'Última Verificação',
		cell: ({ row }) => {
			const { formattedLastVerifiedDate } = getVisitInfo(row.original);
			return (
				<div className="w-40 text-center">{formattedLastVerifiedDate}</div>
			);
		}
	},
	{
		accessorKey: 'next_visit',
		header: 'Próxima Visita',
		cell: ({ row }) => {
			const { formattedNextVisitDate, isPending, isSoon, daysUntilVisit } =
				getVisitInfo(row.original);
			return (
				<div className="w-40 text-center">
					<div
						className={
							isPending
								? 'text-red-600 dark:text-red-400 font-semibold'
								: isSoon
								? 'text-yellow-600 dark:text-yellow-400 font-semibold'
								: ''
						}
					>
						{formattedNextVisitDate}
					</div>
					{isPending && (
						<Badge variant="destructive" className="mt-1">
							Pendente
						</Badge>
					)}
					{isSoon && !isPending && (
						<Badge
							variant="outline"
							className="mt-1 border-yellow-600 text-yellow-600 dark:border-yellow-400 dark:text-yellow-400"
						>
							{daysUntilVisit === 1 ? 'Amanhã' : `${daysUntilVisit} dias`}
						</Badge>
					)}
				</div>
			);
		}
	},
	{
		accessorKey: 'active',
		header: 'Status',
		cell: ({ row }) => (
			<Badge variant="outline" className="text-muted-foreground px-1.5">
				{row.original.active ? (
					<IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
				) : (
					<IconLoader />
				)}
				{row.original.active ? 'Ativo' : 'Inativo'}
			</Badge>
		)
	},
	{
		accessorKey: 'register_visitation',
		header: 'Visitação',
		cell: ({ row }) => (
			<div className="w-40">
				<Button
					onClick={() => {
						console.log('Registrar visitação para', row.original.name);
					}}
				>
					Registrar visita
				</Button>
			</div>
		)
	}
];
