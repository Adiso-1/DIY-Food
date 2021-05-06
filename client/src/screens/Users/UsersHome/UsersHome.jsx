import { Link } from 'react-router-dom';
import api from '../../../api/api';
import { useState, useEffect, Fragment } from 'react';
import './UsersHome.css';

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
			history.push(`${path}/login`);
		}
		const fetchUser = async () => {
			try {
				const { data } = await api.get(`${path}/profile`, config);
				setUserData(data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchUser();
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
		<div className="user-home">
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
				{userData && (
					<img
						className="user-avatar"
						src={
							userData.avatar
								? `data:image/png;base64,${userData.avatar}`
								: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROff7WS6bXhnE-oyKXPuAzdg1Q1DxbfebuXCEHucqt7kHlCx8ogUokNMFF51gWeHDptS8&usqp=CAU'
						}
						alt="user-profile-image"
					/>
				)}
			</div>
			<div className="restaurants-grid">{renderRestaurants()}</div>
		</div>
	);
};
export default UsersHome;
