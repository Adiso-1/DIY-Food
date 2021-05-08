import api from '../../../api/api';
import { useState, useEffect } from 'react';
import Button from '../../../components/Button/Button';
import Navbar from '../../../components/NavbarRestaurant/NavbarRestaurant';
import './RestaurantsHome.css';

const RestaurantsHome = ({ history }) => {
	const [restaurantData, setRestaurantData] = useState(null);
	const [menu, setMenu] = useState([]);

	const path = window.location.pathname.match(/^\/([^/]*)/)[0];

	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('authToken')}`,
		},
	};

	useEffect(() => {
		if (!localStorage.getItem('authToken')) {
			history.push(`${path}/login`);
		}
		const fetchUser = async () => {
			try {
				const { data } = await api.get(`${path}/profile`, config);
				setRestaurantData(data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchUser();
	}, []);

	useEffect(() => {
		const getMenu = async () => {
			try {
				const { data } = await api.get('/restaurants/profile/menu', config);
				setMenu(data);
			} catch (error) {
				console.log(error);
			}
		};
		getMenu();
	}, []);

	const handleAddDish = () => {
		history.push(`${path}/menu`);
	};
	return (
		<div>
			<Navbar />
			<div className="menu">
				{menu.length === 0 ? (
					<div className="menu-empty">
						<h2>Your restaurant has no dishes in menu</h2>
						<h3>Click here to add your first dish</h3>
						<Button onClick={handleAddDish} text="Add Dish" />
					</div>
				) : null}
			</div>
		</div>
	);
};
export default RestaurantsHome;
