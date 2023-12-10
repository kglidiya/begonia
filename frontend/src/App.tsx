import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';

import { useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import AppRouter from './components/appRouter/AppRouter';
import NavBar from './components/navbar/NavBar';
import Footer from './components/footer/Footer';
import HelmetSeo from './components/helmetSeo/HelmetSeo';

function App() {
	const [isMenuOpen, setMenuOpen] = useState(false);

	const closeMenu = () => {
		setMenuOpen(false);
	};

	return (
		<HelmetProvider>
			<HelmetSeo
				title="Begonia world"
				description="Магазин бегоний"
				type="website"
			/>
			<Router>
				<NavBar
					isMenuOpen={isMenuOpen}
					setMenuOpen={setMenuOpen}
					closeMenu={closeMenu}
				/>
				<AppRouter closeMenu={closeMenu} />
				<Footer />
			</Router>
		</HelmetProvider>
	);
}

export default App;
