import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../../api/api';
import './NavbarRestaurant.css';

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [personalDetails, setPersonalDetails] = useState(null);
	const history = useHistory();
	const path = window.location.pathname.match(/^\/([^/]*)/)[0];

	useEffect(() => {
		if (!localStorage.getItem('authToken')) {
			return history.push(`restaurants/login`);
		}
		const fetchUser = async () => {
			try {
				const { data } = await api.get(`restaurants/profile`, config);
				setPersonalDetails(data);
			} catch (error) {
				console.log(error);
				localStorage.removeItem('authToken');
				history.push('/restaurants/login');
			}
		};
		fetchUser();
	}, []);
	useEffect(() => {
		if (personalDetails && personalDetails.logo) {
			const getImage = async () => {
				await api.get(`/restaurants/profile/${personalDetails._id}`);
			};
			getImage();
		}
	}, [personalDetails]);
	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('authToken')}`,
		},
	};
	const handleSelect = async (e) => {
		switch (e.target.textContent) {
			case 'Logout':
				try {
					await api.post(`${path}/logout`, {}, config);
					localStorage.removeItem('authToken');
					history.push(`/`);
				} catch (error) {
					console.log(error);
				}
				break;
			case 'Logout All Devices':
				try {
					await api.post(`${path}/logoutAll`, {}, config);
					localStorage.removeItem('authToken');
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
							<div className="inner-text">Personal Information</div>
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
				{personalDetails && (
					<div className="welcome-container">
						<Link to={`${path}/RestaurantProfileDetails`}>
							<img
								src={
									personalDetails.logo
										? process.env.NODE_ENV === 'development'
											? `http://localhost:5000${path}/profile/${personalDetails._id}`
											: `https://delicious-by-adi.herokuapp.com${path}/profile/${personalDetails._id}`
										: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROff7WS6bXhnE-oyKXPuAzdg1Q1DxbfebuXCEHucqt7kHlCx8ogUokNMFF51gWeHDptS8&usqp=CAU'
								}
								alt="restaurant-logo"
							/>
						</Link>
						<span>Hello {personalDetails.name}</span>
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
