import type { Table as TanstackTable } from '@tanstack/react-table';
import type {
	UniqueIdentifier,
	SensorDescriptor,
	SensorOptions
} from '@dnd-kit/core';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
	SortableContext,
	verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { flexRender } from '@tanstack/react-table';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { DraggableRow } from './data-table-draggable-row';
import type { User } from '@/domain/User/usertypes';

interface DataTableContentProps {
	table: TanstackTable<User>;
	dataIds: UniqueIdentifier[];
	sortableId: string;
	sensors: SensorDescriptor<SensorOptions>[];
	emptyMessage?: string;
}

export function DataTableContent({
	table,
	dataIds,
	sortableId,
	sensors,
	emptyMessage = 'Nenhum resultado encontrado.'
}: DataTableContentProps) {
	const columnsCount = table.getAllColumns().length;

	return (
		<div className="overflow-hidden rounded-lg border">
			<DndContext
				collisionDetection={closestCenter}
				modifiers={[restrictToVerticalAxis]}
				sensors={sensors}
				id={sortableId}
			>
				<Table>
					<TableHeader className="bg-muted sticky top-0 z-10">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody className="**:data-[slot=table-cell]:first:w-8">
						{table.getRowModel().rows?.length ? (
							<SortableContext
								items={dataIds}
								strategy={verticalListSortingStrategy}
							>
								{table.getRowModel().rows.map((row) => (
									<DraggableRow key={row.id} row={row} />
								))}
							</SortableContext>
						) : (
							<TableRow>
								<TableCell colSpan={columnsCount} className="h-24 text-center">
									{emptyMessage}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</DndContext>
		</div>
	);
}
