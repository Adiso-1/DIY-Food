import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/NavbarMedium/NavbarMedium';
import api from '../../api/api';

import './ResetPasswordScreen.css';

const ResetPasswordScreen = ({ history, match }) => {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const buttonRef = useRef(null);

	const path = window.location.pathname.match(/^\/([^/]*)/)[0];

	const resetPasswordHandler = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setPassword('');
			setConfirmPassword('');
			setTimeout(() => {
				setError('');
			}, 2000);
			return setError("Passwords don't match");
		}
		try {
			const { data } = await api.put(
				`${path}/resetpassword/${match.params.resetToken}`,
				{
					password,
				}
			);
			setSuccess(data);
			buttonRef.current.disabled = true;
			setTimeout(() => {
				history.push(`${path}/login`);
			}, 10000);
		} catch (error) {
			setError(error);
			setTimeout(() => {
				setError('');
			}, 2000);
		}
	};

	return (
		<div className="resetpassword-screen">
			<Navbar />
			<form
				onSubmit={resetPasswordHandler}
				className="resetpassword-screen__form"
			>
				<h3 className="resetpassword-screen__title">Forgot Password</h3>
				{error && <span className="error-message">{error} </span>}
				{success && (
					<span className="success-message">
						{success} <Link to={`${path}/login`}>Login</Link>
					</span>
				)}
				<div className="form-group">
					<label htmlFor="password">New Password:</label>
					<input
						type="password"
						required
						id="password"
						placeholder="Enter new password"
						autoComplete="true"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="confirmpassword">Confirm New Password:</label>
					<input
						type="password"
						required
						id="confirmpassword"
						placeholder="Confirm new password"
						autoComplete="true"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</div>
				<button ref={buttonRef} type="submit" className="btn btn-primary">
					Reset Password
				</button>
			</form>
		</div>
	);
};

export default ResetPasswordScreen;
