import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
	type UniqueIdentifier
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
	IconCircleCheckFilled,
	IconLoader
} from '@tabler/icons-react';
import type {
	ColumnDef,
	ColumnFiltersState,
	Row,
	SortingState,
	VisibilityState
} from '@tanstack/react-table';
import {
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table';
import { Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getVisitInfo } from '@/lib/dateUtils';

import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useId, useMemo, useState } from 'react';
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';

import type { User } from '@/domain/User/usertypes';

const columns: ColumnDef<User>[] = [
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

function DraggableRow({ row }: { row: Row<User> }) {
	const { transform, transition, setNodeRef, isDragging } = useSortable({
		id: row.original.id
	});

	return (
		<TableRow
			data-state={row.getIsSelected() && 'selected'}
			data-dragging={isDragging}
			ref={setNodeRef}
			className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
			style={{
				transform: CSS.Transform.toString(transform),
				transition: transition
			}}
		>
			{row.getVisibleCells().map((cell) => (
				<TableCell key={cell.id}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
		</TableRow>
	);
}

export function DataTable({ data }: { data: User[] }) {
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [activeTab, setActiveTab] = useState('all');
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const sortableId = useId();
	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {})
	);

	const filteredData = useMemo(() => {
		if (activeTab === 'pending') {
			return data.filter((row) => {
				if (!row.active) return false;
				const { isPending } = getVisitInfo(row);
				return isPending;
			});
		}
		if (activeTab === 'soon') {
			return data.filter((row) => {
				if (!row.active) return false;
				const { isSoon } = getVisitInfo(row);
				return isSoon;
			});
		}

		return data;
	}, [data, activeTab]);

	const dataIds = useMemo<UniqueIdentifier[]>(
		() => filteredData?.map(({ id }) => id) || [],
		[filteredData]
	);

	const filterUsers = [
		{
			id: 'all',
			name: 'Todos',
			number: data.length
		},
		{
			id: 'soon',
			name: 'Próximas',
			number: data.filter((row) => {
				if (!row.active) return false;
				const { isSoon } = getVisitInfo(row);
				return isSoon;
			}).length
		},
		{
			id: 'pending',
			name: 'Pendentes',
			number: data.filter((row) => {
				if (!row.active) return false;
				const { isPending } = getVisitInfo(row);
				return isPending;
			}).length
		}
	];

	const table = useReactTable({
		data: filteredData,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination
		},
		getRowId: (row) => row.id,
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues()
	});

	return (
		<Tabs
			defaultValue="all"
			value={activeTab}
			onValueChange={setActiveTab}
			className="w-full flex-col justify-start gap-6"
		>
			<div className="grid w-full max-w-4xl gap-6 self-center mb-5 mt-5">
				<InputGroup>
					<InputGroupInput placeholder="Search..." />
					<InputGroupAddon>
						<Search />
					</InputGroupAddon>
					<InputGroupAddon align="inline-end">12 results</InputGroupAddon>
				</InputGroup>
			</div>
			<div className="flex flex-col gap-4 px-4 lg:px-6">
				<div className="flex items-center justify-between">
					<TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
						{filterUsers.map((filter) => (
							<TabsTrigger
								key={filter.id}
								value={filter.id}
								className="cursor-pointer"
							>
								{filter.name}
								<Badge
									variant="secondary"
									className="ml-2 bg-muted-foreground/30 text-muted-foreground size-5 rounded-full px-1"
								>
									{filter.number}
								</Badge>
							</TabsTrigger>
						))}
					</TabsList>
				</div>
				<div className="flex items-center gap-6 text-sm">
					<div className="flex items-center gap-2">
						<div className="size-3 rounded-full bg-yellow-600 dark:bg-yellow-400" />
						<span className="text-muted-foreground">
							Visita programada nos próximos 1-2 dias
						</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="size-3 rounded-full bg-red-600 dark:bg-red-400" />
						<span className="text-muted-foreground">
							Visita em atraso - requer atenção imediata
						</span>
					</div>
				</div>
			</div>
			<TabsContent
				value="all"
				className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
			>
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
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center"
										>
											No results.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</DndContext>
				</div>
				<div className="flex items-center px-4">
					<div className="flex w-full items-center gap-8 lg:w-fit">
						<div className="hidden items-center gap-2 lg:flex">
							<Label htmlFor="rows-per-page" className="text-sm font-medium">
								Linhas por página
							</Label>
							<Select
								value={`${table.getState().pagination.pageSize}`}
								onValueChange={(value) => {
									table.setPageSize(Number(value));
								}}
							>
								<SelectTrigger size="sm" className="w-20" id="rows-per-page">
									<SelectValue
										placeholder={table.getState().pagination.pageSize}
									/>
								</SelectTrigger>
								<SelectContent side="top">
									{[10, 20, 30, 40, 50].map((pageSize) => (
										<SelectItem key={pageSize} value={`${pageSize}`}>
											{pageSize}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex w-fit items-center justify-center text-sm font-medium">
							Page {table.getState().pagination.pageIndex + 1} of{' '}
							{table.getPageCount()}
						</div>
						<div className="ml-auto flex items-center gap-2 lg:ml-0">
							<Button
								variant="outline"
								className="hidden h-8 w-8 p-0 lg:flex"
								onClick={() => table.setPageIndex(0)}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Ir para a primeira página</span>
								<IconChevronsLeft />
							</Button>
							<Button
								variant="outline"
								className="size-8"
								size="icon"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Ir para a página anterior</span>
								<IconChevronLeft />
							</Button>
							<Button
								variant="outline"
								className="size-8"
								size="icon"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Ir para a próxima página</span>
								<IconChevronRight />
							</Button>
							<Button
								variant="outline"
								className="hidden size-8 lg:flex"
								size="icon"
								onClick={() => table.setPageIndex(table.getPageCount() - 1)}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Ir para a última página</span>
								<IconChevronsRight />
							</Button>
						</div>
					</div>
				</div>
			</TabsContent>
			<TabsContent
				value="pending"
				className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
			>
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
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center"
										>
											Nenhum usuário pendente.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</DndContext>
				</div>
				<div className="flex items-center px-4">
					<div className="flex w-full items-center gap-8 lg:w-fit">
						<div className="hidden items-center gap-2 lg:flex">
							<Label htmlFor="rows-per-page" className="text-sm font-medium">
								Linhas por página
							</Label>
							<Select
								value={`${table.getState().pagination.pageSize}`}
								onValueChange={(value) => {
									table.setPageSize(Number(value));
								}}
							>
								<SelectTrigger size="sm" className="w-20" id="rows-per-page">
									<SelectValue
										placeholder={table.getState().pagination.pageSize}
									/>
								</SelectTrigger>
								<SelectContent side="top">
									{[10, 20, 30, 40, 50].map((pageSize) => (
										<SelectItem key={pageSize} value={`${pageSize}`}>
											{pageSize}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex w-fit items-center justify-center text-sm font-medium">
							Page {table.getState().pagination.pageIndex + 1} of{' '}
							{table.getPageCount()}
						</div>
						<div className="ml-auto flex items-center gap-2 lg:ml-0">
							<Button
								variant="outline"
								className="hidden h-8 w-8 p-0 lg:flex"
								onClick={() => table.setPageIndex(0)}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Ir para a primeira página</span>
								<IconChevronsLeft />
							</Button>
							<Button
								variant="outline"
								className="size-8"
								size="icon"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Ir para a página anterior</span>
								<IconChevronLeft />
							</Button>
							<Button
								variant="outline"
								className="size-8"
								size="icon"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Ir para a próxima página</span>
								<IconChevronRight />
							</Button>
							<Button
								variant="outline"
								className="hidden size-8 lg:flex"
								size="icon"
								onClick={() => table.setPageIndex(table.getPageCount() - 1)}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Ir para a última página</span>
								<IconChevronsRight />
							</Button>
						</div>
					</div>
				</div>
			</TabsContent>
			<TabsContent
				value="soon"
				className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
			>
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
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center"
										>
											Nenhuma visita próxima.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</DndContext>
				</div>
				<div className="flex items-center px-4">
					<div className="flex w-full items-center gap-8 lg:w-fit">
						<div className="hidden items-center gap-2 lg:flex">
							<Label htmlFor="rows-per-page" className="text-sm font-medium">
								Linhas por página
							</Label>
							<Select
								value={`${table.getState().pagination.pageSize}`}
								onValueChange={(value) => {
									table.setPageSize(Number(value));
								}}
							>
								<SelectTrigger size="sm" className="w-20" id="rows-per-page">
									<SelectValue
										placeholder={table.getState().pagination.pageSize}
									/>
								</SelectTrigger>
								<SelectContent side="top">
									{[10, 20, 30, 40, 50].map((pageSize) => (
										<SelectItem key={pageSize} value={`${pageSize}`}>
											{pageSize}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex w-fit items-center justify-center text-sm font-medium">
							Page {table.getState().pagination.pageIndex + 1} of{' '}
							{table.getPageCount()}
						</div>
						<div className="ml-auto flex items-center gap-2 lg:ml-0">
							<Button
								variant="outline"
								className="hidden h-8 w-8 p-0 lg:flex"
								onClick={() => table.setPageIndex(0)}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Ir para a primeira página</span>
								<IconChevronsLeft />
							</Button>
							<Button
								variant="outline"
								className="size-8"
								size="icon"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Ir para a página anterior</span>
								<IconChevronLeft />
							</Button>
							<Button
								variant="outline"
								className="size-8"
								size="icon"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Ir para a próxima página</span>
								<IconChevronRight />
							</Button>
							<Button
								variant="outline"
								className="hidden size-8 lg:flex"
								size="icon"
								onClick={() => table.setPageIndex(table.getPageCount() - 1)}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Ir para a última página</span>
								<IconChevronsRight />
							</Button>
						</div>
					</div>
				</div>
			</TabsContent>
		</Tabs>
	);
}
