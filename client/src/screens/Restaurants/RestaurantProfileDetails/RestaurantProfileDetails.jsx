import { useState, useEffect, useRef } from 'react';
import api from '../../../api/api';
import Navbar from '../../../components/NavbarRestaurant/NavbarRestaurant';
import Button from '../../../components/Button/Button';
import './RestaurantProfileDetails.css';

const RestaurantProfileDetails = ({ history }) => {
	const [personalDetails, setPersonalDetails] = useState(null);
	const [logo, setLogo] = useState(null);
	const [success, setSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	console.log(logo);
	const fileInput = useRef();
	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('authToken')}`,
		},
	};
	useEffect(() => {
		if (!localStorage.getItem('authToken')) {
			return history.push(`/restaurants/login`);
		}
		const fetchRestaurants = async () => {
			try {
				const { data } = await api.get(`restaurants/profile`, config);
				setPersonalDetails(data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchRestaurants();
	}, [logo]);
	useEffect(() => {
		if (personalDetails && personalDetails.logo) {
			const getImage = async () => {
				await api.get(`restaurants/profile/${personalDetails._id}`);
			};
			getImage();
		}
	}, [personalDetails]);

	const handleImage = (e) => {
		setSuccessMessage('You selected 1 file');
		setLogo(e.target.files[0]);
	};

	const uploadHandler = async (e) => {
		if (!logo) {
			return;
		}
		const config = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		const fd = new FormData();
		fd.append('logo', logo, logo.name);
		try {
			await api.post('/restaurants/profile/upload', fd, config);
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
		if (!personalDetails.logo) {
			setTimeout(() => {
				setSuccessMessage('');
			}, 2000);
			setSuccessMessage('No Logo To Delete');
		} else {
			try {
				await api.delete('/restaurants/profile/upload', config);
				setTimeout(() => {
					setSuccessMessage('');
				}, 2000);
				setSuccessMessage('Logo image deleted');
			} catch (error) {
				console.log(error);
			}
		}
	};
	return (
		<div className="user-details">
			<Navbar />
			{personalDetails && (
				<div className="update-details">
					<h2>Update Restaurants details</h2>
					<div className="name">
						<span>Name: </span>
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
						<div>Upload a Logo Image </div>
						<div>
							<input
								onChange={handleImage}
								type="file"
								name="logo-image"
								id="logo-image"
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
export default RestaurantProfileDetails;
