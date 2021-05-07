import { useState, useEffect } from 'react';
import api from '../../api/api';
import Navbar from '../NavbarMedium/NavbarMedium';
import './UserProfileDetails.css';

const UserProfileDetails = ({ history }) => {
	const [personalDetails, setPersonalDetails] = useState(null);
	console.log(personalDetails);
	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('authToken')}`,
		},
	};
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
			}
		};
		fetchUser();
	}, []);
	useEffect(() => {
		if (personalDetails) {
			const getImage = async () => {
				await api.get(`users/avatar/${personalDetails._id}`);
			};
			getImage();
		}
	}, [personalDetails]);

	const handleImage = (e) => {
		console.log(e);
	};
	return (
		<div className="user-details">
			<Navbar />
			{personalDetails && (
				<div className="update-details">
					<h2>Update your details</h2>
					<div className="username">
						<span>Username: </span>
						{personalDetails.username}
					</div>
					<div className="email">
						<span>Email: </span>
						{personalDetails.email}
					</div>
					<div className="phone">
						<span>Phone: </span>
						{personalDetails.phone}
					</div>
					<div className="address">
						<span>Address: </span>
						{personalDetails.address}
					</div>
					<div className="profile-picture-container">
						<div>Upload a profile picture </div>
						<div>
							<input
								onChange={handleImage}
								type="file"
								name="profile-picture"
								id="profile-picture"
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
export default UserProfileDetails;
