import { useEffect, useState } from 'react';
import { handleRequest } from '../utils/api';
import { IStatus } from '../utils/types';

const useFetch = (url: string, path: string) => {
	const [status, setStatus] = useState<IStatus<any>>({
		isLoading: false,
		data: [],
		error: '',
	});
	useEffect(() => {
		if (url) {
			handleRequest(status, setStatus, url, 'GET');
		}
		if (status.error) {
			setStatus({
				...status,
				error: status.error,
			});
		}
	}, [url, path]);

	return { ...status };
};

export default useFetch;
