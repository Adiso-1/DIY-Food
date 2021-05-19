import api from '../../../api/api';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef, Fragment } from 'react';
import Button from '../../../components/Button/Button';
import Navbar from '../../../components/NavbarRestaurant/NavbarRestaurant';
import Spinner from '../../../components/Spinner/Spinner';
import './RestaurantsHome.css';
import EditDishImage from '../../../components/EditDishImage/EditDishImage';

const RestaurantsHome = ({ history }) => {
	const [restaurantData, setRestaurantData] = useState(null);
	const [menu, setMenu] = useState([]);
	const [isMenuEmpty, setIsMenuEmpty] = useState(false);
	const [dishImage, setDishImage] = useState(null);
	const [isEdit, setIsEdit] = useState(false);
	const [dishToEdit, setDishToEdit] = useState(null);
	const [idToEdit, setIdToEdit] = useState('');
	const [successMsg, setSuccessMsg] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	const fileInput = useRef();
	const path = window.location.pathname.match(/^\/([^/]*)/)[0];

	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('authTokenRestaurants')}`,
		},
	};
	const renderMenu = async () => {
		if (!restaurantData) {
			return;
		}
		try {
			const { data } = await api.get(
				`/restaurants/profile/menu/${restaurantData._id}`
			);
			if (data.length === 0) {
				return setIsMenuEmpty(true);
			}
			data.sort(
				(a, b) =>
					(a.category.toLowerCase() > b.category.toLowerCase() && -1) || 1
			);
			setMenu(data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (!localStorage.getItem('authTokenRestaurants')) {
			return history.push(`${path}/login`);
		}
		const fetchUser = async () => {
			try {
				const { data } = await api.get(`${path}/profile`, config);
				setRestaurantData(data);
			} catch (error) {
				localStorage.removeItem('authTokenRestaurants');
				history.push(`${path}/login`);
			}
		};
		fetchUser();
	}, []);

	useEffect(() => {
		renderMenu();
	}, [restaurantData]);

	const handleAddDish = () => {
		history.push(`${path}/menu`);
	};

	const handleImage = (e) => {
		setSuccessMsg('You selected 1 file');
		setDishImage(e.target.files[0]);
	};

	const uploadHandler = async (e, id) => {
		const config = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authTokenRestaurants')}`,
			},
		};
		const fd = new FormData();
		fd.append('dish-image', dishImage, dishImage.name);
		try {
			await api.post(`/menu/add-dish-image/${id}`, fd, config);
			setTimeout(() => {
				setSuccessMsg('');
			}, 2000);
			setSuccessMsg('Image Uploaded Succesfully');
			renderMenu();
		} catch (error) {
			setTimeout(() => {
				setErrorMsg('');
			}, 2000);
			setErrorMsg(error.response.data.error);
		}
	};

	const deleteDish = async (e, dish) => {
		try {
			await api.delete(`/menu/delete-dish/${dish._id}`, config);
			renderMenu();
		} catch (error) {
			setTimeout(() => {
				setErrorMsg('');
			}, 2000);
			setErrorMsg(error.response.data.error);
		}
	};
	const getMenu = () => {
		if (menu.length === 0) {
			return;
		}
		const categories = [];
		return menu.map((dish, i) => {
			return (
				<Fragment key={dish._id}>
					<h3 className="category">
						{categories.includes(dish.category)
							? null
							: categories.push(dish.category) && dish.category}
					</h3>
					<div className="dish-details">
						<div
							className="delete-dish-button"
							onClick={(e) => deleteDish(e, dish)}
						>
							<i className="far fa-trash-alt"></i>
						</div>
						<div className="edit-dish-button">
							<i
								onClick={(e) => {
									setDishToEdit(dish);
									setIsEdit(true);
								}}
								className="far fa-edit "
							></i>
						</div>
						<div className="dish-image-description">
							<div className="dish-image">
								{dish.image ? (
									<>
										<img
											src={`/api/menu/get-dish-image/${dish._id}`}
											alt="dish"
										/>
									</>
								) : (
									<div className="add-dish-image-container">
										<div>Upload a dish picture </div>
										<div>
											<input
												onChange={handleImage}
												type="file"
												name="dish-picture"
												id="dish-picture"
												ref={fileInput}
											/>
											<Button
												onClick={() => fileInput.current.click()}
												text="Select Image"
											/>
											<Button
												onClick={(e, dish_id) => uploadHandler(e, dish._id)}
												text="Upload"
											/>
										</div>
									</div>
								)}
							</div>
							<div className="dish-description-container">
								<h3 className="dish-title">{dish.dish}</h3>
								<p className="dish-description-restaurant">
									{dish.description}
								</p>
							</div>
						</div>
						<div className="dish-price">
							<p
								style={{
									marginTop: `${dish.image ? '0px' : '25px'}`,
									marginBottom: `${dish.image ? '0px' : '25px'}`,
								}}
							>
								{dish.price}&#8362;
							</p>
						</div>
					</div>
				</Fragment>
			);
		});
	};
	return (
		<>
			<Navbar personalDetails={restaurantData} />
			{menu.length === 0 || !restaurantData ? (
				<Spinner />
			) : (
				<div className="menu-container">
					{isMenuEmpty ? (
						<div className="menu-empty">
							<h2>Your restaurant has no dishes in menu</h2>
							<h3>Click here to add your first dish now</h3>
							<Button onClick={handleAddDish} text="Add Dish" />
						</div>
					) : (
						<div className="dishes-container">
							{restaurantData &&
								(restaurantData.coverPhoto ? (
									<div
										className="cover-container"
										style={{
											background: `url(/api/restaurants/profile/coverPhoto/${restaurantData._id}) no-repeat center center/cover`,
										}}
									></div>
								) : (
									<div className="cover-image-container">
										<h3>We highly recommand to add a cover photo</h3>
										<Button
											onClick={() =>
												history.push('/restaurants/RestaurantProfileDetails')
											}
											text="Move to personal details"
										/>
									</div>
								))}
							{getMenu()}
							{isEdit && (
								<EditDishImage
									setErrorMsg={setErrorMsg}
									setSuccessMsg={setSuccessMsg}
									renderMenu={renderMenu}
									setIsEdit={setIsEdit}
									dish={dishToEdit}
								/>
							)}
							<h2 className="suceess-message-h2">{successMsg}</h2>
							<h2 className="error-message-h2">{errorMsg}</h2>
							<div className="add-dish-button">
								<Link to="/restaurants/menu">
									<Button text="Add a New Dish" />
								</Link>
							</div>
						</div>
					)}
				</div>
			)}
		</>
	);
};
export default RestaurantsHome;
