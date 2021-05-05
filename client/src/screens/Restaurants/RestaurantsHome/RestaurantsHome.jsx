import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, Fragment } from 'react';
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
				const { data } = await axios.get(`${path}/profile`, config);
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
				await axios.post(`${path}/logout`, {}, config);
				localStorage.removeItem('authToken');
				history.push(`${path}/login`);
			} catch (error) {
				console.log(error);
			}
		}

		if (e.target.value === 'Logout All Devices') {
			try {
				await axios.post(`${path}/logoutAll`, {}, config);
				localStorage.removeItem('authToken');
				history.push(`${path}/login`);
			} catch (error) {
				console.log(error);
			}
		}
	};
	return (
		<div className="restaurant-home">
			<div>
				<select
					onChange={handleSelect}
					name="profile-select"
					id="profile-select"
				>
					<option>Menu</option>
					<option onChange={handleSelect}>Logout</option>
					<option onChange={handleSelect}>Logout All Devices</option>
				</select>
			</div>
			<div className="profile-container">
				{restaurantData && (
					<img
						className="restaurant-avatar"
						src={
							restaurantData.avatar
								? `data:image/png;base64,${restaurantData.avatar}`
								: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROff7WS6bXhnE-oyKXPuAzdg1Q1DxbfebuXCEHucqt7kHlCx8ogUokNMFF51gWeHDptS8&usqp=CAU'
						}
						alt="user-profile-image"
					/>
				)}
			</div>
		</div>
	);
};
export default RestaurantsHome;
