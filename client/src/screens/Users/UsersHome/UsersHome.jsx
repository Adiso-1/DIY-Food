import { Link } from 'react-router-dom';
import api from '../../../api/api';
import { useState, useEffect, Fragment } from 'react';
import './UsersHome.css';
import Navbar from '../../../components/NavbarUser/NavbarUser';
import Button from '../../../components/Button/Button';

const UsersHome = ({ history }) => {
	const [userData, setUserData] = useState(null);
	const [restaurantsData, setRestaurantsData] = useState([]);

	const path = window.location.pathname.match(/^\/([^/]*)/)[0];

	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('authToken')}`,
		},
	};

	useEffect(() => {
		if (!localStorage.getItem('authToken')) {
			return history.push(`${path}/login`);
		}
		const getAllRestaurants = async () => {
			try {
				const { data } = await api.get(`${path}/getAllRestaurants`);
				setRestaurantsData(data);
			} catch (error) {
				console.log(error);
			}
		};
		getAllRestaurants();
	}, []);

	const renderRestaurants = () => {
		if (restaurantsData.length === 0) {
			return;
		}
		return restaurantsData.map((el) => {
			return (
				// TODO - Find a path name to make an order
				<div key={el._id} className="restaurant-profile">
					<div className="logo-container">
						<img
							src={`/api/restaurants/profile/${el._id}`}
							alt="Restaurant-Logo"
						/>
					</div>
					<div className="restaurant-details">
						<p className="restaurant-name">{el.name}</p>
						<p className="restaurant-category">{el.category}</p>
						<p className="restaurant-email">Email: {el.email}</p>
						<p className="restaurant-phone">{el.phone}</p>
						<p className="restaurant-address">Address: {el.address}</p>
					</div>
					<Link to={`users/order/${el._id}`}>
						<Button text="Order Now" />
					</Link>
				</div>
			);
		});
	};
	return (
		<div className="user-home">
			<Navbar />

			<div className="restaurants-grid">{renderRestaurants()}</div>
		</div>
	);
};
export default UsersHome;
