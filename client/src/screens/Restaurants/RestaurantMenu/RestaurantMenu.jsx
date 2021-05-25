import { useState, useEffect, useContext } from 'react';
import api from '../../../api/api';
import AddDishImage from '../../../components/AddDishImage/AddDishImage';
import Button from '../../../components/Button/Button';
import Navbar from '../../../components/NavbarRestaurant/NavbarRestaurant';
import config from '../../../utils/authConfig';
import fetchFromToken from '../../../utils/fetchFromToken';
import AppContext from '../../../context/AppContext';
import './RestaurantMenu.css';

const RestaurantMenu = ({ history }) => {
	const [dishAdded, setDishAdded] = useState(null);
	const [dish, setDish] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [category, setCategory] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');

	const { profile, setProfile, menu, setMenu } = useContext(AppContext);

	useEffect(() => {
		if (!profile?.restaurant || !profile?.token) {
			if (localStorage.getItem('authTokenRestaurants')) {
				fetchFromToken(setProfile);
			} else {
				history.push(`/restaurants/login`);
				return;
			}
		}
	}, []);

	const addHandler = async (e) => {
		e.preventDefault();
		try {
			const { data } = await api.post(
				'/menu/add-dish',
				{ dish, description, price, category },
				config('authTokenRestaurants')
			);
			if (menu) {
				setMenu((prevState) => [...prevState, data]);
			}
			setDishAdded(data);
			setTimeout(() => {
				setSuccessMsg('');
			}, 2000);
			setDish('');
			setDescription('');
			setPrice('');
			setCategory('');
			setSuccessMsg('Dish Added successfully');
		} catch (error) {
			setTimeout(() => {
				setErrorMsg('');
			}, 2000);
			setErrorMsg(error.response.data.error);
		}
	};
	return (
		<div className="restaurant-menu-container">
			<Navbar personalDetails={profile?.restaurant && profile.restaurant} />
			<div onSubmit={addHandler} className="add-dish-container">
				<form className="login-screen__form">
					<h2>Add new dish</h2>
					<div className="form-group">
						<label htmlFor="dish">Dish Name:</label>
						<input
							disabled={dishAdded && true}
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
							disabled={dishAdded && true}
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
						<label htmlFor="category">Category:</label>
						<input
							disabled={dishAdded && true}
							type="text"
							required
							id="category"
							placeholder="Enter category"
							onChange={(e) => setCategory(e.target.value)}
							value={category}
							tabIndex={3}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="price">Price:</label>
						<input
							disabled={dishAdded && true}
							type="text"
							required
							id="price"
							placeholder="Enter price"
							onChange={(e) =>
								e.target.value.match(/^[0-9]*$/) && setPrice(e.target.value)
							}
							value={price}
							tabIndex={4}
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
					{!dishAdded && (
						<div className="restaurant-menu-button-container">
							<Button type="submit" text="Add Dish" />
						</div>
					)}
				</form>
				{dishAdded && (
					<AddDishImage
						setErrorMsg={setErrorMsg}
						setSuccessMsg={setSuccessMsg}
						dish={dishAdded}
						setDishAdded={setDishAdded}
					/>
				)}
			</div>
		</div>
	);
};
export default RestaurantMenu;
