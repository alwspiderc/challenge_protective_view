import { useEffect, useState } from 'react';
import type { UserAPI } from '../usertypes';
import { getList } from '../useApi';

export function useUserList() {
	const [usersData, setUsersData] = useState<UserAPI[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isError, setIsError] = useState<boolean>(false);

	useEffect(() => {
		async function fetchUsers() {
			try {
				setIsLoading(true);
				setIsError(false);
				const data = await getList();
				setUsersData(data);
			} catch (error) {
				console.error('Error fetching users:', error);
				setIsError(true);
			} finally {
				setIsLoading(false);
			}
		}

		fetchUsers();
	}, []);

	return {
		usersData,
		isLoading,
		isError
	};
}
