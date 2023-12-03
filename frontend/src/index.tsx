import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import UserStore from './store/UserStore';
import OrderStore from './store/OrderStore';
import CartStore from './store/CartStore';


export const Context = createContext<any>(null);

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
	<React.StrictMode>
		<Context.Provider
			value={{
				user: new UserStore(),
				order: new OrderStore(),
				cart: new CartStore(),
			}}
		>
			<App />
		</Context.Provider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
