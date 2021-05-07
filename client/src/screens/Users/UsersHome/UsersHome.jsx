import { Link } from 'react-router-dom';
import api from '../../../api/api';
import { useState, useEffect, Fragment } from 'react';
import './UsersHome.css';
import Navbar from '../../../components/NavbarSmall/NavbarSmall';

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
				console.log(data);
			} catch (error) {
				console.log(error);
			}
		};
		getAllRestaurants();
	}, []);

	const renderRestaurants = () => {
		return restaurantsData.map((el) => {
			return (
				// TODO - Find a path name to make an order
				<Fragment key={el._id}>
					<Link to={`/${el._id}`}>
						<div className="restaurant-profile">
							<p>Name: {el.name}</p>
							<p>Email: {el.email}</p>
							<p>Phone: {el.phone}</p>
						</div>
					</Link>
				</Fragment>
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
