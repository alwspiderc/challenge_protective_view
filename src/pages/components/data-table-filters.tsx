import { Badge } from '@/components/ui/badge';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Filter {
	id: string;
	name: string;
	number: number;
}

interface DataTableFiltersProps {
	filters: Filter[];
}

export function DataTableFilters({ filters }: DataTableFiltersProps) {
	return (
		<div className="flex flex-col gap-4 px-4 lg:px-6">
			<div className="flex items-center justify-between">
				<TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
					{filters.map((filter) => (
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
	);
}
