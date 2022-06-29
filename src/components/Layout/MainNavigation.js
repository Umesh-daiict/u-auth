import { useContext } from 'react';
import { Link } from 'react-router-dom';
import authContext from '../../store/auth-context';

import classes from './MainNavigation.module.css';

const MainNavigation = () => {
	const authCtx = useContext(authContext);
	const isLogedIn = authCtx.isLogedIn;
	const logoutHandler = () => {
		authCtx.logout();
	};
	return (
		<header className={classes.header}>
			<Link to='/'>
				<div className={classes.logo}>React Auth</div>
			</Link>
			<nav>
				<ul>
					{!isLogedIn && (
						<li>
							<Link to='/auth'>Login</Link>
						</li>
					)}
					{isLogedIn && (
						<li>
							<Link to='/profile'>Profile</Link>
						</li>
					)}
					{isLogedIn && (
						<li>
							<button onClick={logoutHandler}>Logout</button>
						</li>
					)}
				</ul>
			</nav>
		</header>
	);
};

export default MainNavigation;
