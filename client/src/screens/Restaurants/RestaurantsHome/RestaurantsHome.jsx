import api from '../../../api/api';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Button from '../../../components/Button/Button';
import Navbar from '../../../components/NavbarRestaurant/NavbarRestaurant';
import './RestaurantsHome.css';

const RestaurantsHome = ({ history }) => {
	const [restaurantData, setRestaurantData] = useState(null);
	const [isMenuEmpty, setIsMenuEmpty] = useState(false);
	const [menu, setMenu] = useState([]);
	const [dishImage, setDishImage] = useState(null);
	const [isEdit, setIsEdit] = useState(false);
	const [idToEdit, setIdToEdit] = useState('');
	const [nameToEdit, setNameToEdit] = useState('');
	const [descriptionToEdit, setDescriptionToEdit] = useState('');
	const [priceToEdit, setPriceToEdit] = useState('');
	const [successMsg, setSuccessMsg] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	const fileInput = useRef();
	const path = window.location.pathname.match(/^\/([^/]*)/)[0];
	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('authToken')}`,
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
			setMenu(data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (!localStorage.getItem('authToken')) {
			return history.push(`${path}/login`);
		}
		const fetchUser = async () => {
			try {
				const { data } = await api.get(`${path}/profile`, config);
				setRestaurantData(data);
			} catch (error) {
				console.log(error);
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
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
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
			console.log(error.response);
			setErrorMsg(error.response.data.error);
		}
	};

	const deleteImageHandler = async (e, id) => {
		const config = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		try {
			await api.delete(`/menu/delete-dish-image/${id}`, config);
			setTimeout(() => {
				setSuccessMsg('');
			}, 2000);
			renderMenu();
			setSuccessMsg('Image Deleted Succesfully');
		} catch (error) {
			setTimeout(() => {
				setErrorMsg('');
			}, 2000);
			setErrorMsg(error.response.data.error);
		}
	};

	const editDishHandler = (e, dish) => {
		setIsEdit(true);
		setIdToEdit(dish._id);
		setNameToEdit(dish.dish);
		setDescriptionToEdit(dish.description);
		setPriceToEdit(dish.price);
	};

	const onEditSubmit = async (e) => {
		e.preventDefault();
		try {
			await api.patch(
				`/menu/edit-dish/${idToEdit}`,
				{
					dish: nameToEdit,
					description: descriptionToEdit,
					price: priceToEdit,
				},
				config
			);
			setIsEdit(false);
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
		return menu.map((dish) => {
			return (
				<div className="dish-details" key={dish._id}>
					<div
						className="delete-dish-button"
						onClick={(e) => deleteDish(e, dish)}
					>
						<i className="far fa-trash-alt"></i>
					</div>
					<div className="dish-image-description">
						<div className="dish-image">
							{dish.image ? (
								<>
									<img
										src={`/api/menu/get-dish-image/${dish._id}`}
										alt="dish-image"
									/>
									<div className="dish-button-container">
										<Button
											onClick={(e) => editDishHandler(e, dish)}
											text="Edit Dish"
										/>
										<Button
											onClick={(e) => deleteImageHandler(e, dish._id)}
											text="Delete Image"
										/>
									</div>
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
						<div className="dish-description">
							<h3 className="dish-title">{dish.dish}</h3>
							<p className="dish-description">{dish.description}</p>
						</div>
					</div>
					<div className="dish-price">
						<p>{dish.price}&#8362;</p>
					</div>
				</div>
			);
		});
	};
	return (
		<div>
			<Navbar />
			<div className="menu-container">
				{isMenuEmpty ? (
					<div className="menu-empty">
						<h2>Your restaurant has no dishes in menu</h2>
						<h3>Click here to add your first dish</h3>
						<Button onClick={handleAddDish} text="Add Dish" />
					</div>
				) : (
					<div className="dishes-container">
						{restaurantData && (
							<h1 className="menu-title">{restaurantData.name}'s Menu</h1>
						)}
						{getMenu()}
						{isEdit && (
							<div onSubmit={onEditSubmit} className="edit-dish-container">
								<form className="login-screen__form">
									<span
										className="close-edit"
										onClick={(e) => setIsEdit(false)}
									>
										<i className="fas fa-times"></i>
									</span>
									<div className="form-group">
										<label htmlFor="dish">Dish Name:</label>
										<input
											type="text"
											required
											id="dish"
											placeholder="Dish Name"
											onChange={(e) => setNameToEdit(e.target.value)}
											value={nameToEdit}
											tabIndex={1}
										/>
									</div>

									<div className="form-group">
										<label htmlFor="description">Description:</label>
										<input
											type="text"
											required
											id="description"
											placeholder="Write description"
											onChange={(e) => setDescriptionToEdit(e.target.value)}
											value={descriptionToEdit}
											tabIndex={2}
										/>
									</div>

									<div className="form-group">
										<label htmlFor="price">Price:</label>
										<input
											type="number"
											required
											id="price"
											placeholder="Enter price"
											onChange={(e) => setPriceToEdit(e.target.value)}
											value={priceToEdit}
											tabIndex={3}
										/>
									</div>
									{successMsg && (
										<div className="success-feedback">
											<h3>{successMsg}</h3>
										</div>
									)}
									{errorMsg && (
										<div className="error-feedback">
											<h3>{errorMsg}</h3>
										</div>
									)}
									<div className="restaurant-menu-button-container">
										<Button type="submit" text="Submit" />
									</div>
								</form>
							</div>
						)}
						<h2>{successMsg}</h2>
						<h2>{errorMsg}</h2>
						<div className="add-dish-button">
							<Link to="/restaurants/menu">
								<Button text="Add a New Dish" />
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
export default RestaurantsHome;
