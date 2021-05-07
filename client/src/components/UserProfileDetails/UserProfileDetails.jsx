import { useState, useEffect } from 'react';
import api from '../../api/api';
import Navbar from '../NavbarMedium/NavbarMedium';
import Button from '../Button/Button';
import './UserProfileDetails.css';

const UserProfileDetails = ({ history }) => {
	const [personalDetails, setPersonalDetails] = useState(null);
	const [avatar, setAvatar] = useState(null);
	const [success, setSuccess] = useState(false);
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
				setPersonalDetails(data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchUser();
	}, []);
	useEffect(() => {
		if (personalDetails && personalDetails.avatar) {
			const getImage = async () => {
				await api.get(`users/profile/${personalDetails._id}`);
			};
			getImage();
		}
	}, [personalDetails]);

	const handleImage = (e) => {
		console.log(e.target.files[0]);
		setAvatar(e.target.files[0]);
	};
	const uploadHandler = async (e) => {
		const config = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		const fd = new FormData();
		fd.append('avatar', avatar, avatar.name);
		try {
			await api.post('/users/profile/upload', fd, config);
			setTimeout(() => {
				setSuccess(false);
			}, 2000);
			setSuccess(true);
		} catch (error) {
			console.log(error);
		}
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
						<Button onClick={uploadHandler} text="Upload" />
					</div>
					{success && (
						<h2 className="image-uload-success">Image uploaded successfully</h2>
					)}
				</div>
			)}
		</div>
	);
};
export default UserProfileDetails;
