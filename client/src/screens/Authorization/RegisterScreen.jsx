import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import api from '../../api/api';
import { Link } from 'react-router-dom';
import Navbar from '../../components/NavbarMedium/NavbarMedium';
import './RegisterScreen.css';

const RegisterScreen = ({ history }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [phone, setPhone] = useState('');
	const [allCities, setAllcities] = useState({});
	const [city, setCity] = useState('');
	const [street, setStreet] = useState('');
	const [number, setNumber] = useState('');
	const [apartment, setApartment] = useState('');
	const [addressesToShow, setAddressesToShow] = useState([]);
	const [confirmpassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const buttonRef = useRef(null);

	const path = window.location.pathname.match(/^\/([^/]*)/)[0];

	useEffect(() => {
		const getCities = async () => {
			try {
				const { data } = await axios.get(
					'https://raw.githubusercontent.com/Adiso-1/Delicious/main/server/citiesDB/cities.json'
				);
				setAllcities(data);
			} catch (error) {
				console.log(error);
			}
		};
		getCities();
	}, []);

	const registerHandler = async (e) => {
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
			await api.post(`${path}/signup`, {
				name,
				email,
				phone,
				address: {
					city,
					street,
					number,
					apartment,
				},
				password,
			});
			setSuccess(`${name} registered successfully`);
			buttonRef.current.disabled = true;
			setTimeout(() => {
				history.push(`${path}/login`);
			}, 5000);
		} catch (error) {
			setError(error.response.data.error);
			setTimeout(() => {
				setError('');
			}, 3000);
		}
	};

	const handleAddress = (word, type) => {
		if (type === 'city') {
			if (word.length > 0) {
				const filteredCities = Object.keys(allCities).filter((city) =>
					city.startsWith(word)
				);
				setAddressesToShow(filteredCities.slice(0, 5));
			} else {
				setAddressesToShow([]);
			}
		}
		if (type === 'street') {
			if (word.length > 0) {
				try {
					const filteredStreets = allCities[city].filter((street) =>
						street.startsWith(word)
					);
					setAddressesToShow(filteredStreets.slice(0, 5));
				} catch (error) {
					setAddressesToShow([]);
				}
			} else {
			}
		}
	};

	return (
		<div className="register-screen">
			<Navbar />
			<form onSubmit={registerHandler} className="register-screen__form">
				<h3 className="register-screen__title">Register</h3>
				{error && <span className="error-message">{error}</span>}
				{success && (
					<span className="success-message">
						{success} <Link to={`${path}/login`}>Login</Link>
					</span>
				)}
				<div className="form-group">
					<label htmlFor="name">name:</label>
					<input
						type="text"
						required
						id="name"
						placeholder="Enter name"
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
						onChange={(e) => setEmail(e.target.value.toLowerCase())}
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

				<div className="form-group user-address">
					<h5>Address:</h5>
					<div className="user-address-container">
						<div className="city">
							<label htmlFor="city">City:</label>
							<input
								type="city"
								required
								id="city"
								autoComplete="new-password"
								value={city}
								onChange={(e) => {
									setCity(e.target.value);
									handleAddress(e.target.value, 'city');
								}}
							/>
						</div>
						<div className="street">
							<label htmlFor="street">Street:</label>
							<input
								type="street"
								disabled={city.length > 0 ? false : true}
								required
								id="street"
								autoComplete="new-password"
								placeholder={city ? '' : 'fill city'}
								value={street}
								onChange={(e) => {
									setStreet(e.target.value);
									handleAddress(e.target.value, 'street');
								}}
							/>
						</div>
						<div className="number">
							<label htmlFor="number">Number:</label>
							<input
								type="text"
								required
								id="number"
								autoComplete="new-password"
								disabled={street.length > 0 ? false : true}
								value={number}
								onChange={(e) => {
									setNumber(
										e.target.value.match(/[0-9]$/) ? e.target.value : ''
									);
									handleAddress(e.target.value);
								}}
							/>
						</div>
						<div className="apartment">
							<label htmlFor="apartment">Apartment:</label>
							<input
								type="text"
								required
								id="apartment"
								autoComplete="new-password"
								disabled={street.length > 0 ? false : true}
								value={apartment}
								onChange={(e) => {
									setApartment(
										e.target.value.match(/[0-9]$/) ? e.target.value : ''
									);
									handleAddress(e.target.value);
								}}
							/>
						</div>
					</div>
					{addressesToShow.length > 0 && (
						<div className="search-results">
							{addressesToShow.map((city) => (
								<div key={city} className="city-container">
									<span
										onClick={(e) => {
											if (street.length === 0) {
												setCity(e.target.textContent);
												setAddressesToShow([]);
												return;
											}
											if (number.length === 0) {
												setStreet(e.target.textContent);
												setAddressesToShow([]);
												return;
											} else {
												setNumber(e.target.textContent);
												setAddressesToShow([]);
												return;
											}
										}}
									>
										{city}
									</span>
								</div>
							))}
						</div>
					)}
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
