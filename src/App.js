import { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import authContext from './store/auth-context';

function App() {
	const authCtx = useContext(authContext);
	return (
		<Layout>
			<Switch>
				<Route path='/' exact>
					<HomePage />
				</Route>

				{!authCtx.isLogedIn && (
					<Route path='/auth'>
						<AuthPage />
					</Route>
				)}
				<Route path='/profile'>
					{authCtx.isLogedIn && <UserProfile />}
					{!authCtx.isLogedIn && <Redirect to='/auth' />}
				</Route>

				<Route path='*'>
					<Redirect to='/' />
				</Route>
			</Switch>
		</Layout>
	);
}

export default App;
