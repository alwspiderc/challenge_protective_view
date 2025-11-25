import { useEffect, useState, useCallback } from 'react';
import type { UserAPI } from '../usertypes';
import { getList } from '../useApi';

export function useUserList() {
	const [usersData, setUsersData] = useState<UserAPI[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isError, setIsError] = useState<boolean>(false);

	const fetchUsers = useCallback(async () => {
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
	}, []);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	const updateUserInList = useCallback((updatedUser: UserAPI) => {
		setUsersData((prevUsers) =>
			prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
		);
	}, []);

	return {
		usersData,
		isLoading,
		isError,
		refetch: fetchUsers,
		updateUserInList
	};
}
