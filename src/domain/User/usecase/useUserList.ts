import { useEffect, useState } from 'react';
import type { UserAPI } from '../usertypes';
import { getList } from '../useApi';

export function useUserList() {
	const [usersData, setUsersData] = useState<UserAPI[]>([]);

	useEffect(() => {
		const fetchUsers = async () => {
			const data = await getList();
			setUsersData(data);
		};

		fetchUsers();
	}, []);

	return {
		usersData
	};
}
