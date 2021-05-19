import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../../api/api';
import './NavbarRestaurant.css';

const Navbar = (props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [restaurantOrders, setRestaurantOrders] = useState(null);
	const history = useHistory();
	const path = window.location.pathname.match(/^\/([^/]*)/)[0];

	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('authTokenRestaurants')}`,
		},
	};
	useEffect(() => {
		if (!localStorage.getItem('authTokenRestaurants')) {
			return history.push(`restaurants/login`);
		}
		const getOrders = async () => {
			try {
				const { data } = await api.get(`/orders/restaurantInfo`, config);
				setRestaurantOrders(data);
			} catch (error) {}
		};
		getOrders();
	}, []);

	const handleSelect = async (e) => {
		switch (e.target.textContent) {
			case 'Home':
				history.push(`${path}`);
				break;
			case 'Add New Dish':
				history.push(`${path}/menu`);
				break;
			case 'Logout':
				try {
					await api.post(`${path}/logout`, {}, config);
					localStorage.removeItem('authTokenRestaurants');
					history.push(`/`);
				} catch (error) {
					console.log(error);
				}
				break;
			case 'Logout All Devices':
				try {
					await api.post(`${path}/logoutAll`, {}, config);
					localStorage.removeItem('authTokenRestaurants');
					history.push(`/`);
				} catch (error) {
					console.log(error);
				}
				break;
			case 'Personal Information':
				history.push(`${path}/RestaurantProfileDetails`);
				break;
		}
	};

	const checkForUncompleted = () => {
		let counter = 0;
		{
			restaurantOrders &&
				restaurantOrders.forEach((el) =>
					el.isCompleted === 'false' ? (counter += 1) : null
				);
		}
		return counter;
	};
	return (
		<div>
			{isOpen && (
				<div
					onClick={() => {
						setIsOpen(false);
					}}
					className="menu-open"
				>
					<div onClick={handleSelect} className="left-side">
						<div>
							<div className="inner-text">Home</div>
						</div>
						<div>
							<div className="inner-text">Personal Information</div>
						</div>
						<div>
							<div
								onClick={() => history.push(`${path}/Orders`)}
								className="inner-text"
							>
								Orders{' '}
								{checkForUncompleted() > 0 && (
									<span className="incomplete-orders">
										{checkForUncompleted()}
									</span>
								)}
							</div>
						</div>
						<div>
							<div className="inner-text">Add New Dish</div>
						</div>
						<div>
							<div className="inner-text">Logout</div>
						</div>
						<div>
							<div className="inner-text">Logout All Devices</div>
						</div>
					</div>
					<div className="right-side"></div>
				</div>
			)}
			<div className="navbar-container-small">
				<div
					onClick={() => setIsOpen(!isOpen)}
					className={`menu-btn ${isOpen ? 'open ' : ''}`}
				>
					<div className="menu-btn__burger"></div>
				</div>
				{props.personalDetails && (
					<div className="welcome-container">
						<Link to={`${path}/RestaurantProfileDetails`}>
							<img
								src={
									props.personalDetails.logo
										? `/api${path}/profile/${props.personalDetails._id}`
										: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROff7WS6bXhnE-oyKXPuAzdg1Q1DxbfebuXCEHucqt7kHlCx8ogUokNMFF51gWeHDptS8&usqp=CAU'
								}
								alt="restaurant-logo"
							/>
						</Link>
						<span>Hello, {props.personalDetails.name}</span>
					</div>
				)}
				<Link to="/">
					<img src="/images/delicious-logo-small.PNG" alt="delicious-logo" />
				</Link>
			</div>
		</div>
	);
};
export default Navbar;
