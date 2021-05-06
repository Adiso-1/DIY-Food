import { useState, useRef } from 'react';
import api from '../../api/api';
import { Link } from 'react-router-dom';
import './RestaurantRegisterScreen.css';

const RegisterScreen = ({ history }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [phone, setPhone] = useState('');
	const [category, setCategory] = useState('');
	const [address, setAddress] = useState('');
	const [confirmpassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const buttonRef = useRef(null);
	const path = window.location.pathname.match(/^\/([^/]*)/)[0];

	const registerHandler = (e) => {
		e.preventDefault();
		if (password !== confirmpassword) {
			setPassword('');
			setConfirmPassword('');
			setTimeout(() => {
				setError('');
			}, 2000);
			return setError('Passwords do not match');
		}
		try {
			api.post(`${path}/signup`, {
				name,
				email,
				phone,
				category,
				address,
				password,
			});
			setSuccess(`${name} registered successfully`);
			buttonRef.current.disabled = true;
			setTimeout(() => {
				history.push(`${path}/login`);
			}, 10000);
		} catch (error) {
			setError(error.response.date);
			setTimeout(() => {
				setError('');
			}, 5000);
		}
	};

	return (
		<div className="register-screen">
			<form onSubmit={registerHandler} className="register-screen__form">
				<h3 className="register-screen__title">Register</h3>
				{error && <span className="error-message">{error}</span>}
				{success && (
					<span className="success-message">
						{success} <Link to={`${path}/login`}>Login</Link>
					</span>
				)}
				<div className="form-group">
					<label htmlFor="name">Restaurant Name:</label>
					<input
						type="text"
						required
						id="name"
						placeholder="Enter Restaurant Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div className="form-group">
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

				<div className="form-group">
					<label htmlFor="phone">Phone:</label>
					<input
						type="phone"
						required
						id="phone"
						placeholder="Enter phone"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="address">Address:</label>
					<input
						type="address"
						required
						id="address"
						placeholder="Enter address"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="category">Select Restaurant Category:</label>
					<select
						onChange={(e) => setCategory(e.target.value)}
						name="category"
						id="category"
						defaultValue="Select Category"
					>
						<option disabled>Select Category</option>
						<option value="burger">Burger</option>
						<option value="sushi">Sushi</option>
						<option value="pizza">Pizza</option>
						<option value="mexican">Mexican</option>
						<option value="asian">Asian</option>
						<option value="italian">Italian</option>
						<option value="cafe">Cafe</option>
					</select>
				</div>

				<div className="form-group">
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						required
						id="password"
						autoComplete="true"
						placeholder="Enter password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="confirmpassword">Confirm Password:</label>
					<input
						type="password"
						required
						id="confirmpassword"
						autoComplete="true"
						placeholder="Confirm password"
						value={confirmpassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</div>
				<button ref={buttonRef} type="submit" className="btn btn-primary">
					Register
				</button>

				<span className="register-screen__subtext">
					Already have an account? <Link to={`${path}/login`}>Login</Link>
				</span>
			</form>
		</div>
	);
};
export default RegisterScreen;
