import { AppSidebar } from '@/components/app-sidebar';
import { DataTable } from '@/pages/components/data-table';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { useUserList } from '@/domain/User/usecase/useUserList';
import { Spinner } from '@/components/ui/spinner';

export default function Dashboard() {
	const { usersData, isLoading } = useUserList();

	return (
		<SidebarProvider
			style={
				{
					'--sidebar-width': 'calc(var(--spacing) * 72)',
					'--header-height': 'calc(var(--spacing) * 12)'
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<SiteHeader />
				<div className="flex flex-1 flex-col">
					<div className="@container/main flex flex-1 flex-col gap-2">
						{isLoading ? (
							<div className="flex flex-1 items-center justify-center py-20">
								<Spinner className="size-lg" />
							</div>
						) : (
							<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
								<DataTable data={usersData} />
							</div>
						)}
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
