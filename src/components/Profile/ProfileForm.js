import { useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import authContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
	const newPass = useRef();
	const { token } = useContext(authContext);
	const history = useHistory();
	const submitHandler = (e) => {
		e.preventDefault();
		const NewPassValue = newPass.current.value;
		//add validate
		fetch(
			'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAFwK7SWVtY96Pl2FjY3_4UjZHCCmV_pOU',
			{
				method: 'POST',
				body: JSON.stringify({
					idToken: token,
					password: NewPassValue,
					returnSecureToken: false,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					return res.json().then((data) => {
						let errorMessage = 'Authentication failed!';
						throw new Error(errorMessage);
					});
				}
			})
			.then((data) => {
				//   authCtx.login(data.idToken);
				console.log(data);
				history.replace('/');
			})
			.catch((err) => {
				alert(err.message);
			});
	};

	return (
		<form onSubmit={submitHandler} className={classes.form}>
			<div className={classes.control}>
				<label htmlFor='new-password'>New Password</label>
				<input minLength='6' type='password' id='new-password' ref={newPass} />
			</div>
			<div className={classes.action}>
				<button>Change Password</button>
			</div>
		</form>
	);
};

export default ProfileForm;
