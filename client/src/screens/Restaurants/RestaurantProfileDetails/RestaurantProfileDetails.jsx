import { useState, useEffect, useRef, useContext } from 'react';
import api from '../../../api/api';
import Navbar from '../../../components/NavbarRestaurant/NavbarRestaurant';
import Button from '../../../components/Button/Button';
import Spinner from '../../../components/Spinner/Spinner';
import EditRestaurant from '../../../components/EditRestaurant/EditRestaurant';
import config from '../../../utils/authConfig';
import AppContext from '../../../context/AppContext';
import fetchFromToken from '../../../utils/fetchFromToken';
import './RestaurantProfileDetails.css';

const RestaurantProfileDetails = ({ history }) => {
	const [logo, setLogo] = useState(null);
	const [cover, setCover] = useState(null);
	const [success, setSuccess] = useState(false);
	const [isUpdateProfile, setIsUpdateProfile] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const profileInput = useRef();
	const coverInput = useRef();

	const { profile, setProfile } = useContext(AppContext);

	useEffect(() => {
		if (!profile?.restaurant || !profile?.token) {
			if (localStorage.getItem('authTokenRestaurants')) {
				fetchFromToken(setProfile);
			} else {
				history.push(`/restaurants/login`);
				return;
			}
		}
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
		const fd = new FormData();
		fd.append('logo', logo, logo.name);
		try {
			const { data } = await api.post(
				'/restaurants/profile/upload',
				fd,
				config('authTokenRestaurants')
			);
			setProfile({ ...profile, restaurant: data });
			setTimeout(() => {
				setSuccess(false);
			}, 2000);
			setSuccessMessage('');
			setSuccess(true);
		} catch (error) {
			console.log(error);
		}
	};

	const uploadCoverHandler = async (e) => {
		if (!cover) {
			return;
		}
		const fd = new FormData();
		fd.append('coverPhoto', cover, cover.name);
		try {
			const { data } = await api.post(
				'/restaurants/profile/uploadCoverPhoto',
				fd,
				config('authTokenRestaurants')
			);
			setTimeout(() => {
				setSuccess(false);
			}, 2000);
			setSuccessMessage('');
			setSuccess(true);
			setProfile({ ...profile, restaurant: data });
		} catch (error) {
			console.log(error);
		}
	};

	const deleteImageHandler = async () => {
		if (!profile.restaurant.logo) {
			setTimeout(() => {
				setSuccessMessage('');
			}, 2000);
			setSuccessMessage('No logo to delete');
		} else {
			try {
				const { data } = await api.delete(
					'/restaurants/profile/upload',
					config('authTokenRestaurants')
				);
				setProfile({ ...profile, restaurant: data });
				setTimeout(() => {
					setSuccessMessage('');
				}, 2000);
				setSuccessMessage('Logo image deleted');
			} catch (error) {
				console.log(error);
			}
		}
	};

	const deleteCoverHandler = async () => {
		if (!profile.restaurant.coverPhoto) {
			setTimeout(() => {
				setSuccessMessage('');
			}, 2000);
			setSuccessMessage('No cover to delete');
		} else {
			try {
				const { data } = await api.delete(
					'/restaurants/profile/deleteCoverPhoto',
					config('authTokenRestaurants')
				);
				setTimeout(() => {
					setSuccessMessage('');
				}, 2000);
				setSuccessMessage('cover photo deleted');
				setProfile({ ...profile, restaurant: data });
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<div className="user-details restaurant-profile-details">
			<Navbar personalDetails={profile?.restaurant && profile.restaurant} />

			{!profile?.restaurant ? (
				<Spinner />
			) : (
				<div className="update-details">
					<h2>Update Restaurants details</h2>
					<div className="name">
						<span>Name: </span>
						{profile.restaurant.name}
					</div>
					<div className="email">
						<span>Email: </span>
						{profile.restaurant.email}
					</div>
					<div className="phone">
						<span>Phone: </span>
						{profile.restaurant.phone}
					</div>
					<div className="address">
						<span>Address: </span>
						{profile.restaurant.address.city},{' '}
						{profile.restaurant.address.street},{' '}
						{profile.restaurant.address.number}
					</div>

					<div className="tags-section">
						{profile.restaurant.tags.map((tag) => {
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
						<span>&#177; {profile.restaurant.deliveryTime} Minutes</span>
						<span>Min delivery {profile.restaurant.minPayment}&#8362;</span>
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
								{profile.restaurant.logo && (
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
								{profile.restaurant.coverPhoto && (
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
					<div className="update-profile-container">
						<h3>
							Click{' '}
							<span
								onClick={() => setIsUpdateProfile(!isUpdateProfile)}
								className="update-profile-button"
							>
								here
							</span>{' '}
							To update your profile
						</h3>
					</div>
					{isUpdateProfile && (
						<EditRestaurant
							closeUpdateProfile={setIsUpdateProfile}
							restaurantData={profile.restaurant}
							profile={profile}
							setProfile={setProfile}
						/>
					)}
				</div>
			)}
		</div>
	);
};
export default RestaurantProfileDetails;
