import { AppSidebar } from '@/components/app-sidebar';
import { DataTable } from '@/pages/components/data-table';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { useUserList } from '@/domain/User/usecase/useUserList';
import { Spinner } from '@/components/ui/spinner';
import { useUserUpdateVisit } from '@/domain/User/usecase/useUserUpdateVisit';
import { toast } from 'sonner';

export default function Dashboard() {
	const { usersData, isLoading, isError, updateUserInList } = useUserList();
	const { handleRegisterVisit } = useUserUpdateVisit(
		(updatedUser) => {
			updateUserInList(updatedUser);
			toast.success('Visita registrada com sucesso!', {
				description: `A visita foi registrada para ${updatedUser.name}`
			});
		},
		(error) => {
			toast.error('Erro ao registrar visita', {
				description: error.message
			});
		}
	);

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
						) : isError ? (
							<div className="flex flex-1 items-center justify-center py-20">
								<p>Erro ao carregar dados dos usuários.</p>
							</div>
						) : (
							<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
								<DataTable
									data={usersData}
									handleRegisterVisit={handleRegisterVisit}
								/>
							</div>
						)}
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
