import { useState } from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { User } from '@/domain/User/usertypes';

interface RegisterVisitCellProps {
	user: User;
	onRegisterVisit: (id: string) => Promise<void>;
}

export function RegisterVisitCell({
	user,
	onRegisterVisit
}: RegisterVisitCellProps) {
	const [open, setOpen] = useState(false);

	const handleConfirm = async () => {
		await onRegisterVisit(user.id);
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button>Registrar visita</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Confirmar registro de visita</AlertDialogTitle>
					<AlertDialogDescription>
						Deseja registrar a visita para <strong>{user.name}</strong>?
						<br />A data e hora atual serão registradas como a última
						verificação.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction onClick={handleConfirm}>
						Confirmar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
