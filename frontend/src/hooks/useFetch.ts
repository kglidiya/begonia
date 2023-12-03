import { useEffect, useState } from 'react';
import { handleRequest } from '../utils/utils';
import { IStatus } from '../utils/types';

const useFetch = (url: string, path: string) => {
	const [status, setStatus] = useState<IStatus<any>>({
		isloading: false,
		data: [],
		error: '',
	});
	// console.log(status.data)

	useEffect(() => {
		if (url) {
			handleRequest(status, setStatus, url, 'GET');
		} else {
			setStatus({
				...status,
				isloading: false,
				error: 'Ошибка: Не удалось получить токен',
			});
		}
	}, [url, path]);

	return { ...status };
};

export default useFetch;
