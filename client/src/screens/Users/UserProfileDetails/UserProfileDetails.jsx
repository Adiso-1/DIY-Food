import { useState, useEffect, useRef } from 'react';
import api from '../../../api/api';
import Navbar from '../../../components/NavbarSmall/NavbarSmall';
import Button from '../../../components/Button/Button';
import './UserProfileDetails.css';

const UserProfileDetails = ({ history }) => {
	const [personalDetails, setPersonalDetails] = useState(null);
	const [avatar, setAvatar] = useState(null);
	const [success, setSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const fileInput = useRef();
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
		setSuccessMessage('You selected 1 file');
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
			setSuccessMessage('');
			setSuccess(true);
		} catch (error) {
			console.log(error);
		}
	};

	const deleteImageHandler = async () => {
		const config = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		try {
			await api.delete('/users/profile/upload', config);
			setTimeout(() => {
				setSuccessMessage('');
			}, 2000);
			setSuccessMessage('Profile image deleted');
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
						{personalDetails.name}
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
								ref={fileInput}
							/>
							<Button onClick={deleteImageHandler} text="Delete Image" />
							<Button
								onClick={() => fileInput.current.click()}
								text="Select Image"
							/>
							<Button onClick={uploadHandler} text="Upload" />
							<h2>{successMessage}</h2>
						</div>
					</div>
					{success && (
						<h2 className="image-upload-success">
							Image uploaded successfully
						</h2>
					)}
				</div>
			)}
		</div>
	);
};
export default UserProfileDetails;
