import { useState, useEffect } from 'react';
import api from '../../api/api';
import { Link } from 'react-router-dom';
import './LoginScreen.css';
import Navbar from '../../components/NavbarMedium/NavbarMedium';
import Spinner from '../../components/Spinner/Spinner';

const LoginScreen = ({ history }) => {
	const path = window.location.pathname.match(/^\/([^/]*)/)[0];

	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		const path = window.location.pathname.match(/^\/([^/]*)/)[0];
		if (localStorage.getItem('authToken')) {
			return history.push(path);
		}
	}, [history]);

	const loginHandler = async (e) => {
		e.preventDefault();
		try {
			const { data } = await api.post(`${path}/login`, { email, password });
			localStorage.setItem('authToken', data.token);
			setIsLoading(true);
			history.push(path);
		} catch (error) {
			setTimeout(() => {
				setError('');
			}, 2000);
			setError(error.response.data.error);
		}
	};
	return (
		<div className="login-screen">
			<Navbar />
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<form onSubmit={loginHandler} className="login-screen__form">
						<h3 className="login-screen__title">Login</h3>
						{error && <span className="error-message">{error}</span>}
						<div className="form-group">
							<label htmlFor="email">Email:</label>
							<input
								type="email"
								required
								id="email"
								placeholder="Email address"
								onChange={(e) => setEmail(e.target.value.toLowerCase())}
								value={email}
								tabIndex={1}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="password">
								Password:{' '}
								<Link
									to={`${path}/forgotpassword`}
									className="login-screen__forgotpassword"
								>
									Forgot Password?
								</Link>
							</label>
							<input
								type="password"
								required
								id="password"
								autoComplete="true"
								placeholder="Enter password"
								onChange={(e) => setPassword(e.target.value)}
								value={password}
								tabIndex={2}
							/>
						</div>
						<button
							disabled={isLoading}
							type="submit"
							className="btn btn-primary"
						>
							Login
						</button>

						<span className="login-screen__subtext">
							Don't have an account?{' '}
							<Link to={`${path}/register`}>Register</Link>
						</span>
					</form>
				</>
			)}
		</div>
	);
};
export default LoginScreen;
