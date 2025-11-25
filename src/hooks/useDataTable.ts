import { useId, useMemo, useState } from 'react';
import {
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
	type SensorDescriptor,
	type SensorOptions
} from '@dnd-kit/core';
import type {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState
} from '@tanstack/react-table';
import {
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table';
import { getVisitInfo } from '@/lib/dateUtils';
import type { User } from '@/domain/User/usertypes';

interface UseDataTableProps {
	data: User[];
	columns: ColumnDef<User>[];
}

export function useDataTable({ data, columns }: UseDataTableProps) {
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

	const dataIds = useMemo(
		() => filteredData?.map(({ id }) => id) || [],
		[filteredData]
	);

	const filterUsers = useMemo(
		() => [
			{
				id: 'all',
				name: 'Todos',
				number: data.length
			},
			{
				id: 'soon',
				name: 'Próximas Visitas',
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
		],
		[data]
	);

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

	return {
		table,
		activeTab,
		setActiveTab,
		filterUsers,
		dataIds,
		sortableId,
		sensors: sensors as SensorDescriptor<SensorOptions>[]
	};
}
