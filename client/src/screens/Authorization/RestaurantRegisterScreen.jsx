import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import api from '../../api/api';
import { Link } from 'react-router-dom';
import Navbar from '../../components/NavbarMedium/NavbarMedium';
import './RestaurantRegisterScreen.css';

const RegisterScreen = ({ history }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [phone, setPhone] = useState('');
	const [category, setCategory] = useState('');
	//! address
	const [allCities, setAllcities] = useState({});
	const [city, setCity] = useState('');
	const [street, setStreet] = useState('');
	const [apartmentNumber, setApartmentNumber] = useState('');
	const [addressesToShow, setAddressesToShow] = useState([]);
	const [confirmpassword, setConfirmPassword] = useState('');
	const [tagInput, setTagInput] = useState('');
	const [deliveryTime, setDeliveryTime] = useState('');
	const [minPayment, setMinPayment] = useState('');
	const [tags, setTags] = useState([]);
	const [isQuestion, setIsQuestion] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [current, setCurrent] = useState(null);

	const cityRef = useRef(null);
	const buttonRef = useRef(null);
	const streetRef = useRef(null);

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
				category,
				address: {
					city,
					street,
					apartmentNumber,
				},
				password,
				tags,
				deliveryTime,
				minPayment,
			});
			setSuccess(`${name} registered successfully`);
			buttonRef.current.disabled = true;
			setTimeout(() => {
				history.push(`${path}/login`);
			}, 10000);
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
				{error && <span className="register-error-message">{error}</span>}
				{success && (
					<span className="success-message">
						{success} <Link to={`${path}/login`}>Login</Link>
					</span>
				)}
				<div className="form-group">
					<label htmlFor="name">Restaurant name:</label>
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

				<div className="form-group address">
					<h5>Address:</h5>
					<div className="address-container">
						<div className="city">
							<label htmlFor="city">City:</label>
							<input
								type="text"
								required
								id="city"
								autoComplete="new-password"
								value={city}
								onChange={(e) => {
									setCity(e.target.value);
									handleAddress(e.target.value, 'city');
								}}
								ref={cityRef}
								onClick={() => {
									setCurrent('city');
								}}
							/>
						</div>
						<div className="street">
							<label htmlFor="street">Street:</label>
							<input
								type="text"
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
								ref={streetRef}
								onClick={() => setCurrent('street')}
							/>
						</div>
						<div className="apartment-number">
							<label htmlFor="apartment-number">Number:</label>
							<input
								type="text"
								required
								id="apartment-number"
								autoComplete="new-password"
								placeholder={street ? '' : 'fill street'}
								disabled={street.length > 0 ? false : true}
								value={apartmentNumber}
								onChange={(e) => {
									setApartmentNumber(
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
											if (current === 'city') {
												setCity(e.target.textContent);
												setAddressesToShow([]);
												return;
											}
											if (current === 'street') {
												setStreet(e.target.textContent);
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

				<div className="form-group tags-input">
					<label htmlFor="tags">
						Tags:{' '}
						<i
							onMouseEnter={() => setIsQuestion(true)}
							onMouseLeave={() => setIsQuestion(false)}
							className="far fa-question-circle"
						></i>
						{isQuestion && (
							<div className="tags-description">
								<h4>Here you can add some tags like</h4>
								<ul>
									<li>Kosher</li>
									<li>Free Delivery</li>
									<li>Vegeterian</li>
									<li>etc...</li>
								</ul>
							</div>
						)}
					</label>
					<div className="restaurant-tags-container">
						<input
							type="tags"
							id="tags"
							placeholder={
								tags.length === 3 ? 'Max limit' : 'Enter up to 3 tags'
							}
							value={tagInput}
							disabled={tags.length === 3 ? true : false}
							onChange={(e) => setTagInput(e.target.value)}
						/>
						{tagInput.length > 0 && (
							<i
								onClick={() => {
									tags.push(tagInput);
									setTagInput('');
								}}
								className="fas fa-plus"
							></i>
						)}
						<div className="tags-chosen">
							{tags.map((tag, i) => {
								return (
									<span key={i} className="tag">
										{tag}
										<i
											onClick={() => setTags(tags.filter((el) => tag !== el))}
											className="fas fa-times"
										></i>
									</span>
								);
							})}
						</div>
					</div>
				</div>

				<div className="form-group more-details">
					<h5>Delivery details</h5>
					<div className="more-details-container">
						<div className="delivery-time">
							<label htmlFor="">Average delivey time:</label>
							<input
								type="text"
								required
								id="delivery-time"
								autoComplete="true"
								value={deliveryTime}
								max={180}
								min={0}
								onChange={(e) =>
									setDeliveryTime(
										e.target.value.match(/[0-9]$/) ? e.target.value : ''
									)
								}
							/>
						</div>
						<div className="min-delivery-time">
							<label htmlFor="">Minimum per order:</label>
							<input
								type="text"
								required
								id="min-payment"
								autoComplete="true"
								max={1000}
								min={0}
								value={minPayment}
								onChange={(e) =>
									setMinPayment(
										e.target.value.match(/[0-9]$/) ? e.target.value : ''
									)
								}
							/>
						</div>
					</div>
				</div>

				<div className="form-group">
					<label htmlFor="category">Select restaurant category:</label>
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
						<option value="gelato">Gelato</option>
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
					<label htmlFor="confirmpassword">Confirm password:</label>
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
				<a href="#root">
					<button ref={buttonRef} type="submit" className="btn btn-primary">
						Register
					</button>
				</a>

				<span className="register-screen__subtext">
					Already have an account? <Link to={`${path}/login`}>Login</Link>
				</span>
			</form>
		</div>
	);
};
export default RegisterScreen;
