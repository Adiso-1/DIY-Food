import { useState, useRef } from 'react';
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
	const [address, setAddress] = useState('');
	const [confirmpassword, setConfirmPassword] = useState('');
	const [tagInput, setTagInput] = useState('');
	const [deliveryTime, setDeliveryTime] = useState('');
	const [minPayment, setMinPayment] = useState('');
	const [tags, setTags] = useState([]);
	const [isQuestion, setIsQuestion] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const buttonRef = useRef(null);
	const path = window.location.pathname.match(/^\/([^/]*)/)[0];

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
				address,
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
							{tags.map((tag) => {
								return (
									<span className="tag">
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
							<label htmlFor="">Average delivey minutes:</label>
							<input
								type="number"
								required
								id="delivery-time"
								autoComplete="true"
								value={deliveryTime}
								max={180}
								min={0}
								onChange={(e) => setDeliveryTime(e.target.value)}
							/>
						</div>
						<div className="min-delivery-time">
							<label htmlFor="">Minimum delivery payment:</label>
							<input
								type="number"
								required
								id="min-payment"
								autoComplete="true"
								max={1000}
								min={0}
								value={minPayment}
								onChange={(e) => setMinPayment(e.target.value)}
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
