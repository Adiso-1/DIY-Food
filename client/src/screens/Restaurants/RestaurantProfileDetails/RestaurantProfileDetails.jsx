import { useState, useEffect, useRef } from 'react';
import api from '../../../api/api';
import Navbar from '../../../components/NavbarRestaurant/NavbarRestaurant';
import Button from '../../../components/Button/Button';
import './RestaurantProfileDetails.css';

const RestaurantProfileDetails = ({ history }) => {
	const [personalDetails, setPersonalDetails] = useState(null);
	const [logo, setLogo] = useState(null);
	const [cover, setCover] = useState(null);
	const [success, setSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const profileInput = useRef();
	const coverInput = useRef();
	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('authToken')}`,
		},
	};
	const renderRestaurant = async () => {
		try {
			const { data } = await api.get(`/restaurants/profile`, config);
			setPersonalDetails(data);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		if (!localStorage.getItem('authToken')) {
			return history.push(`/restaurants/login`);
		}
		renderRestaurant();
	}, []);

	const handleImage = (e) => {
		setSuccessMessage('You selected 1 file');
		setLogo(e.target.files[0]);
	};

	const handleCoverImage = (e) => {
		setSuccessMessage('You selected 1 file');
		setCover(e.target.files[0]);
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
			renderRestaurant();
		} catch (error) {
			console.log(error);
		}
	};

	const uploadCoverHandler = async (e) => {
		if (!cover) {
			return;
		}
		const config = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		const fd = new FormData();
		fd.append('coverPhoto', cover, cover.name);
		try {
			await api.post('/restaurants/profile/uploadCoverPhoto', fd, config);
			setTimeout(() => {
				setSuccess(false);
			}, 2000);
			setSuccessMessage('');
			setSuccess(true);
			renderRestaurant();
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
			setSuccessMessage('No logo to delete');
		} else {
			try {
				await api.delete('/restaurants/profile/upload', config);
				setTimeout(() => {
					setSuccessMessage('');
				}, 2000);
				setSuccessMessage('Logo image deleted');
				renderRestaurant();
			} catch (error) {
				console.log(error);
			}
		}
	};

	const deleteCoverHandler = async () => {
		const config = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		if (!personalDetails.coverPhoto) {
			setTimeout(() => {
				setSuccessMessage('');
			}, 2000);
			setSuccessMessage('No cover to delete');
		} else {
			try {
				await api.delete('/restaurants/profile/deleteCoverPhoto', config);
				setTimeout(() => {
					setSuccessMessage('');
				}, 2000);
				setSuccessMessage('cover photo deleted');
				renderRestaurant();
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

					<div className="tags-section">
						{personalDetails.tags.map((tag) => {
							return (
								<span
									key={tag}
									className={`restaurant-tag ${tag
										.replace(' ', '')
										.toLowerCase()}`}
								>
									{tag}
								</span>
							);
						})}
					</div>
					<div className="delivery-section">
						<span>&#177; {personalDetails.deliveryTime} Minutes</span>
						<span>Min delivery {personalDetails.minPayment}&#8362;</span>
					</div>
					<section className="images-section">
						<div className="profile-picture-container">
							<h3>Upload a logo image </h3>
							<div className="profile-buttons-container">
								<input
									onChange={handleImage}
									type="file"
									name="logo-image"
									id="logo-image"
									ref={profileInput}
								/>
								{personalDetails.logo && (
									<Button
										onClick={deleteImageHandler}
										text="Delete profile image"
									/>
								)}
								<Button
									onClick={() => profileInput.current.click()}
									text="Select profile image"
								/>
								<Button onClick={uploadHandler} text="Upload profile image" />
							</div>
						</div>
						<div className="cover-picture-container">
							<h3>Upload a cover photo </h3>
							<div className="cover-buttons-container">
								<input
									onChange={handleCoverImage}
									type="file"
									name="cover-image"
									id="cover-image"
									ref={coverInput}
								/>
								{personalDetails.coverPhoto && (
									<Button
										onClick={deleteCoverHandler}
										text="Delete cover photo"
									/>
								)}

								<Button
									onClick={() => coverInput.current.click()}
									text="Select cover photo"
								/>
								<Button
									onClick={uploadCoverHandler}
									text="Upload cover photo"
								/>
							</div>
							<h2 className="success-message-images">{successMessage}</h2>
						</div>
					</section>
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
