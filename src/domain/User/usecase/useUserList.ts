import { useEffect, useState } from 'react';
import type { UserAPI } from '../usertypes';
import { getList } from '../useApi';

export function useUserList() {
	const [usersData, setUsersData] = useState<UserAPI[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		async function fetchUsers() {
			try {
				setIsLoading(true);
				const data = await getList();
				setUsersData(data);
			} catch (error) {
				console.error('Error fetching users:', error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchUsers();
	}, []);

	return {
		usersData,
		isLoading
	};
}
