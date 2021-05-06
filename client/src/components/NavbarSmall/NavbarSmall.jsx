import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../../api/api';
import Button from '../Button/Button';
import './NavbarSmall.css';

const Navbar = () => {
	const history = useHistory();
	const path = window.location.pathname.match(/^\/([^/]*)/)[0];
	const [isOpen, setIsOpen] = useState(false);

	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('authToken')}`,
		},
	};
	const handleSelect = async (e) => {
		if (e.target.textContent === 'Logout') {
			try {
				await api.post(`${path}/logout`, {}, config);
				localStorage.removeItem('authToken');
				history.push(`${path}/login`);
			} catch (error) {
				console.log(error);
			}
		}
		if (e.target.textContent === 'Logout All Devices') {
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
				<Link to="/">
					<img src="/images/delicious-logo.PNG" alt="delicious-logo" />
				</Link>
			</div>
		</div>
	);
};
export default Navbar;
