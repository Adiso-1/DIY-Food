import api from '../../../api/api';
import { useState, useEffect, useRef } from 'react';
import Button from '../../../components/Button/Button';
import Navbar from '../../../components/NavbarRestaurant/NavbarRestaurant';
import './RestaurantsHome.css';

const RestaurantsHome = ({ history }) => {
	const [restaurantData, setRestaurantData] = useState(null);
	const [isMenuEmpty, setIsMenuEmpty] = useState(false);
	const [menu, setMenu] = useState([]);
	const [dishImage, setDishImage] = useState(null);
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
		try {
			const { data } = await api.get('/restaurants/profile/menu', config);
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
			history.push(`${path}/login`);
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
	}, []);

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

	const getMenu = () => {
		return menu.map((dish) => {
			return (
				<div className="dish-details" key={dish._id}>
					<div className="dish-image-description">
						<div className="dish-image">
							{dish.image ? (
								<>
									<img
										src={
											process.env.NODE_ENV === 'development'
												? `http://localhost:5000/menu/get-dish-image/${dish._id}`
												: `https://delicious-by-adi.herokuapp.com/menu/get-dish-image/${dish._id}`
										}
										alt="dish-image"
									/>
									<Button
										onClick={(e) => deleteImageHandler(e, dish._id)}
										text="Delete Image"
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
						<div className="dish-description">
							<h3 className="dish-title">{dish.dish}</h3>
							<p className="dish-description">{dish.description}</p>
						</div>
					</div>
					<div className="dish-price">
						<p>{dish.price}</p>
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
						{getMenu()}
						<h2>{successMsg}</h2>
						<h2>{errorMsg}</h2>
					</div>
				)}
			</div>
		</div>
	);
};
export default RestaurantsHome;
