import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../../api/api';
import config from '../../utils/authConfig';
import './NavbarUser.css';

const Navbar = (props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [userOrders, setUserOrders] = useState([]);

	const history = useHistory();
	const path = window.location.pathname.match(/^\/([^/]*)/)[0];

	useEffect(() => {
		if (!localStorage.getItem('authTokenUsers')) {
			return history.push(`/users/login`);
		}
		const getOrders = async () => {
			const { data } = await api.get(
				'/orders/userInfo',
				config('authTokenUsers')
			);
			setUserOrders(data);
		};
		getOrders();
	}, []);
	const handleSelect = async (e) => {
		switch (e.target.textContent) {
			case 'Home':
				history.push(`${path}`);
				break;
			case 'Logout':
				try {
					await api.post(`${path}/logout`, {}, config('authTokenUsers'));
					localStorage.removeItem('authTokenUsers');
					history.push(`/`);
				} catch (error) {
					console.log(error);
				}
				break;
			case 'Logout All Devices':
				try {
					await api.post(`${path}/logoutAll`, {}, config);
					localStorage.removeItem('authTokenUsers');
					history.push(`/`);
				} catch (error) {
					console.log(error);
				}
				break;
			case 'Personal Information':
				history.push(`${path}/UserProfileDetails`);
				break;
			case /My Orders/.test(e.target.textContent) && e.target.textContent:
				history.push(`${path}/MyOrders`);
				break;
		}
	};

	const checkForUncompleted = () => {
		let counter = 0;
		{
			userOrders &&
				userOrders.forEach((el) =>
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
								My Orders
								{checkForUncompleted() > 0 && (
									<span className="incomplete-orders">
										{checkForUncompleted()}
									</span>
								)}
							</div>
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
						<Link to={`${path}/UserProfileDetails`}>
							<img
								src={
									props.personalDetails.avatar
										? `/api${path}/profile/${props.personalDetails._id}`
										: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROff7WS6bXhnE-oyKXPuAzdg1Q1DxbfebuXCEHucqt7kHlCx8ogUokNMFF51gWeHDptS8&usqp=CAU'
								}
								alt="user-avatar"
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
