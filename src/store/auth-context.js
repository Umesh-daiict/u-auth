import react, { useCallback, useEffect, useState } from 'react';
let logoutTimer;
const authContext = react.createContext({
	token: '',
	isLogedIn: false,
	login: (token) => {},
	logout: () => {},
});

const getRemainingTime = (experationTime) => {
	const currentTime = new Date().getTime();
	const adjExpirationTime = new Date(experationTime).getTime();
	const remainingDuration = adjExpirationTime - currentTime;
	return remainingDuration;
};

const retrieveStoredToken = () => {
	const storedToken = localStorage.getItem('token');
	const storedExpirationDate = localStorage.getItem('expireTime');
	const remainingTime = getRemainingTime(storedExpirationDate);
	if (remainingTime <= 6000) {
		localStorage.removeItem('token');
		localStorage.removeItem('expireTime');
		return null;
	}
	return { token: storedToken, duration: remainingTime };
};

export const AuthContextProvider = (props) => {
	const tokenData = retrieveStoredToken();
	let initToken;
	if (tokenData) {
		initToken = tokenData.token;
	}
	const [token, setToken] = useState(initToken);
	const userIsLogenIn = !!token;

	const loginHandler = (token, experationTime) => {
		setToken(token);
		localStorage.setItem('token', token);
		localStorage.setItem('expireTime', experationTime);
		const remainingTime = getRemainingTime(experationTime);
		console.log(remainingTime);

		logoutTimer = setTimeout(logoutHandler, remainingTime);
	};

	const logoutHandler = useCallback(() => {
		setToken(null);
		localStorage.removeItem('token');
		localStorage.removeItem('expireTime');
		if (logoutTimer) {
			clearTimeout(logoutTimer);
		}
	}, []);
	useEffect(() => {
		if (tokenData) {
			console.log(tokenData.duration);
			logoutTimer = setTimeout(logoutHandler, tokenData.duration);
		}
	}, [tokenData, logoutHandler]);

	const contextValue = {
		token,
		isLogedIn: userIsLogenIn,
		login: loginHandler,
		logout: logoutHandler,
	};
	return (
		<authContext.Provider value={contextValue}>
			{props.children}{' '}
		</authContext.Provider>
	);
};

export default authContext;
