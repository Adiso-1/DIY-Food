import api from '../../../api/api';
import { useState, useEffect } from 'react';
import Navbar from '../../../components/NavbarRestaurant/NavbarRestaurant';
import './RestaurantsHome.css';

const RestaurantsHome = ({ history }) => {
	const [restaurantData, setRestaurantData] = useState(null);

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

	const handleSelect = async (e) => {
		if (e.target.value === 'Logout') {
			try {
				await api.post(`${path}/logout`, {}, config);
				localStorage.removeItem('authToken');
				history.push(`${path}/login`);
			} catch (error) {
				console.log(error);
			}
		}

		if (e.target.value === 'Logout All Devices') {
			try {
				await api.post(`${path}/logoutAll`, {}, config);
				localStorage.removeItem('authToken');
				history.push(`${path}/login`);
			} catch (error) {
				console.log(error);
			}
		}
	};
	return (
		<div>
			<Navbar />
		</div>
	);
};
export default RestaurantsHome;
