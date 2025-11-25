import { Tabs, TabsContent } from '@/components/ui/tabs';
import type { User } from '@/domain/User/usertypes';
import { columns } from './data-table-columns';
import { DataTableContent } from './data-table-content';
import { DataTableFilters } from './data-table-filters';
import { DataTablePagination } from './data-table-pagination';
import { useDataTable } from '@/hooks/useDataTable';

export function DataTable({ data }: { data: User[] }) {
	const {
		table,
		activeTab,
		setActiveTab,
		filterUsers,
		dataIds,
		sortableId,
		sensors
	} = useDataTable({ data, columns });

	return (
		<Tabs
			defaultValue="all"
			value={activeTab}
			onValueChange={setActiveTab}
			className="w-full flex-col justify-start gap-6"
		>
			<DataTableFilters filters={filterUsers} />

			<TabsContent
				value="all"
				className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
			>
				<DataTableContent
					table={table}
					dataIds={dataIds}
					sortableId={sortableId}
					sensors={sensors}
					emptyMessage="Nenhum resultado encontrado."
				/>
				<DataTablePagination table={table} />
			</TabsContent>

			<TabsContent
				value="pending"
				className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
			>
				<DataTableContent
					table={table}
					dataIds={dataIds}
					sortableId={sortableId}
					sensors={sensors}
					emptyMessage="Nenhum usuário pendente."
				/>
				<DataTablePagination table={table} />
			</TabsContent>

			<TabsContent
				value="soon"
				className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
			>
				<DataTableContent
					table={table}
					dataIds={dataIds}
					sortableId={sortableId}
					sensors={sensors}
					emptyMessage="Nenhuma visita próxima."
				/>
				<DataTablePagination table={table} />
			</TabsContent>
		</Tabs>
	);
}
