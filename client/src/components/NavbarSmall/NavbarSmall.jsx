import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../../api/api';
import './NavbarSmall.css';

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [personalDetails, setPersonalDetails] = useState(null);
	const history = useHistory();
	const path = window.location.pathname.match(/^\/([^/]*)/)[0];

	useEffect(() => {
		if (!localStorage.getItem('authToken')) {
			return history.push(`users/login`);
		}
		const fetchUser = async () => {
			try {
				const { data } = await api.get(`users/profile`, config);
				console.log(data);
				setPersonalDetails(data);
			} catch (error) {
				console.log(error);
				localStorage.removeItem('authToken');
				history.push('users/login');
			}
		};
		fetchUser();
	}, []);
	useEffect(() => {
		if (personalDetails) {
			const getImage = async () => {
				await api.get(`users/profile/${personalDetails._id}`);
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
			case 'Personal Information':
				history.push(`${path}/UserProfileDetails`);
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
						<Link to={`${path}/UserProfileDetails`}>
							<img
								src={
									process.env.NODE_ENV === 'development'
										? `http://localhost:5000${path}/profile/${personalDetails._id}`
										: `https://delicious-by-adi.herokuapp.com${path}/profile/${personalDetails._id}`
								}
								alt="user-avatar"
							/>
						</Link>
						<span>Hello {personalDetails.username}</span>
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
