import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';

import { useEffect, useState } from 'react';
import AppRouter from './components/appRouter/AppRouter';
import NavBar from './components/navbar/NavBar';
import { deleteCookie, getCookie } from './utils/cookies';
import { handleRequest } from './utils/utils';
import { REFRESH_TOKEN } from './utils/api';
import Footer from './components/footer/Footer';
import { IStatus } from './utils/types';

function App() {
	const [status, setStatus] = useState<IStatus<any>>({
		isloading: false,
		data: [],
		error: '',
	});

	const accessToken: string | undefined = getCookie('token');
	const refreshToken: string | undefined = localStorage.token;
	console.log('render');
	
	useEffect(() => {
		if (!accessToken && refreshToken) {
			handleRequest(status, setStatus, REFRESH_TOKEN, 'GET', '', refreshToken);
		}
		// deleteCookie('token');
	}, [accessToken, refreshToken]);
	
	// console.log(accessToken)
	// console.log(refreshToken)
	return (
		<Router>
			<NavBar />
			<AppRouter />
			<Footer />
		</Router>
	);
}

export default App;
