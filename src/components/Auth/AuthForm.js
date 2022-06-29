import { useState, useRef, useContext } from 'react';
import authContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom';
import classes from './AuthForm.module.css';

const AuthForm = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const emailRef = useRef();
	const passwordRef = useRef();

	const history = useHistory();
	const authCtx = useContext(authContext);
	const switchAuthModeHandler = () => {
		setIsLogin((prevState) => !prevState);
	};

	const submitHandler = (event) => {
		event.preventDefault();
		const inEmail = emailRef.current.value;
		const inPassword = passwordRef.current.value;
		//optional valied
		setIsLoading(true);
		let url;
		if (isLogin) {
			url =
				'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAFwK7SWVtY96Pl2FjY3_4UjZHCCmV_pOU';
		} else {
			url =
				'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAFwK7SWVtY96Pl2FjY3_4UjZHCCmV_pOU';
		}
		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				email: inEmail,
				password: inPassword,
				returnSecureToken: true,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => {
				setIsLoading(false);
				if (res.ok) {
					return res.json();
				} else {
					return res.json().then((data) => {
						let errorMessage = 'Authentication failed!';
						// if (data && data.error && data.error.message) {
						// 	errorMessage = data.error.message;
						// }

						throw new Error(errorMessage);
					});
				}
			})
			.then((data) => {
				const experationTime = new Date(
					new Date().getTime() + +data.expiresIn * 1000
				);
				authCtx.login(data.idToken, experationTime);
				history.replace('/');
			})
			.catch((err) => {
				alert(err.message);
			});
	};
	return (
		<section className={classes.auth}>
			<h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
			<form onSubmit={submitHandler}>
				<div className={classes.control}>
					<label htmlFor='email'>Your Email</label>
					<input ref={emailRef} type='email' id='email' required />
				</div>
				<div className={classes.control}>
					<label htmlFor='password'>Your Password</label>
					<input ref={passwordRef} type='password' id='password' required />
				</div>
				<div className={classes.actions}>
					{!isLoading && (
						<button>{isLogin ? 'Login' : 'Create Account'}</button>
					)}
					{isLoading && <p>sending...</p>}
					<button
						type='button'
						className={classes.toggle}
						onClick={switchAuthModeHandler}>
						{isLogin ? 'Create new account' : 'Login with existing account'}
					</button>
				</div>
			</form>
		</section>
	);
};

export default AuthForm;
