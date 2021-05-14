import { useState } from 'react';
import api from '../../../api/api';
import Button from '../../../components/Button/Button';
import Navbar from '../../../components/NavbarRestaurant/NavbarRestaurant';
import './RestaurantMenu.css';

const RestaurantMenu = () => {
	const [dish, setDish] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');

	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('authToken')}`,
		},
	};

	const addHandler = async (e) => {
		e.preventDefault();
		try {
			await api.post('/menu/add-dish', { dish, description, price }, config);
			setTimeout(() => {
				setSuccessMsg('');
			}, 2000);
			setDish('');
			setDescription('');
			setPrice('');
			setSuccessMsg('Dish Added successfully');
		} catch (error) {
			setTimeout(() => {
				setErrorMsg('');
			}, 2000);
			setErrorMsg(error.resonse.data.error);
		}
	};
	return (
		<div className="restaurant-menu-container">
			<Navbar />
			<div onSubmit={addHandler} className="add-dish-container">
				<form className="login-screen__form">
					<h2>Add Your New Dish</h2>
					<div className="form-group">
						<label htmlFor="dish">Dish Name:</label>
						<input
							type="text"
							required
							id="dish"
							placeholder="Dish Name"
							onChange={(e) => setDish(e.target.value)}
							value={dish}
							tabIndex={1}
						/>
					</div>

					<div className="form-group new-dish-description">
						<label htmlFor="description">Description:</label>
						<textarea
							type="text"
							required
							id="description"
							placeholder="Write description"
							onChange={(e) => setDescription(e.target.value)}
							value={description}
							maxLength="200"
							size="100"
							tabIndex={2}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="price">Price:</label>
						<input
							type="number"
							required
							id="price"
							placeholder="Enter price"
							onChange={(e) => setPrice(e.target.value)}
							value={price}
							tabIndex={3}
						/>
					</div>

					{successMsg && (
						<div className="success-feedback">
							<h3>{successMsg}</h3>
						</div>
					)}
					{errorMsg && (
						<div className="error-feedback">
							<h3>{errorMsg}</h3>
						</div>
					)}
					<div className="restaurant-menu-button-container">
						<Button type="submit" text="Add Dish" />
					</div>
				</form>
			</div>
		</div>
	);
};
export default RestaurantMenu;
