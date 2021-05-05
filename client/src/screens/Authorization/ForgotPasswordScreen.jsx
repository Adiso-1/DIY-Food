import { useState, useRef } from 'react';
import axios from 'axios';
import './ForgotPasswordScreen.css';

const ForgotPasswordScreen = ({ history }) => {
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const buttonRef = useRef(null);

	const path = window.location.pathname.match(/^\/([^/]*)/)[0];

	const forgotPasswordHandler = async (e) => {
		e.preventDefault();
		buttonRef.current.disabled = true;
		try {
			const response = await axios.post(`${path}/forgotpassword`, { email });
			setSuccess(response.data);
			setTimeout(() => {
				buttonRef.current.disabled = false;
				history.push(`${path}/login`);
			}, 2000);
		} catch (error) {
			setError('Email could not be sent');
			setTimeout(() => {
				buttonRef.current.disabled = false;
				setError('');
			}, 2000);
		}
	};

	return (
		<div className="forgotpassword-screen">
			<form
				onSubmit={forgotPasswordHandler}
				className="forgotpassword-screen__form"
			>
				<h3 className="forgotpassword-screen__title">Forgot Password</h3>
				{error && <span className="error-message">{error}</span>}
				{success && <span className="success-message">{success}</span>}
				<div className="form-group">
					<p className="forgotpassword-screen__subtext">
						Please enter the email address you register your account with. We
						will send you reset password confirmation to this email
					</p>
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						required
						id="email"
						placeholder="Email address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<button ref={buttonRef} type="submit" className="btn btn-primary">
					Send Email
				</button>
			</form>
		</div>
	);
};
export default ForgotPasswordScreen;
