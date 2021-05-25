import api from '../../../api/api';
import { Fragment, useEffect, useState } from 'react';
import Navbar from '../../../components/NavbarUser/NavbarUser';
import Spinner from '../../../components/Spinner/Spinner';
import Payment from '../Payment/Payment';
import config from '../../../utils/authConfig';
import './Order.css';

const Order = ({ history }) => {
	const [user, setUser] = useState(null);
	const [menu, setMenu] = useState([]);
	const [cart, setCart] = useState([]);
	const [restaurantDetails, setRestaurantDetails] = useState({});
	const [isZoom, setIsZoom] = useState(false);
	const [isDish, setIsDish] = useState(false);
	const [dishIdZoom, setDishIdZoom] = useState('');
	const [dishToDisplay, setDishToDisplay] = useState({});
	const [errorMsg, setErrorMsg] = useState('');
	const [isOpenPayment, setIsOpenPayment] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const id = history.location.pathname.split('/')[3];

	const renderUser = async () => {
		setIsLoading(true);
		try {
			const { data } = await api.get(
				'/users/profile',
				config('authTokenUsers')
			);
			setUser(data);
			setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

	const getRestaurantDetails = async () => {
		const [restaurantMenu, restaurantDetails] = await Promise.allSettled([
			api.get(`/restaurants/profile/menu/${id}`),
			api.get(`/users/getRestaurants/${id}`),
		]);
		restaurantMenu.value.data.sort(
			(a, b) => (a.category.toLowerCase() > b.category.toLowerCase() && -1) || 1
		);
		setRestaurantDetails(restaurantDetails.value.data);
		setMenu(restaurantMenu.value.data);
	};

	useEffect(() => {
		renderUser();
		getRestaurantDetails();
	}, []);

	const zoomInImage = (e, id) => {
		setIsZoom(true);
		setDishIdZoom(id);
	};

	const addToCart = (e, dish) => {
		setIsDish(false);
		const isDuplicate = cart.find((el) => el._id === dish._id);
		if (!isDuplicate) {
			dish.amount = 1;
			setCart([...cart, dish]);
		} else {
			isDuplicate.amount += 1;
			setCart([...cart]);
		}
	};

	const removeFromCart = (e, dish) => {
		const findDish = cart.find((el) => el._id === dish._id);
		if (findDish.amount === 1) {
			return;
		}
		findDish.amount -= 1;
		setCart([...cart]);
	};

	const handleRemove = (e, id) => {
		const filteredArr = cart.filter((el) => el._id !== id);
		setCart(filteredArr);
	};

	const getTotalOrder = () => {
		return cart.map((dish) => {
			return (
				<div key={dish._id} className="dishes-in-cart">
					<div className="amount-counter">
						<button
							className="minus-button"
							disabled={dish.amount === 1 ? true : false}
						>
							<i
								onClick={(e) => removeFromCart(e, dish)}
								className="fas fa-minus"
							></i>
						</button>
						<span>{dish.amount}</span>
						<i onClick={(e) => addToCart(e, dish)} className="fas fa-plus"></i>
					</div>
					<span>{dish.dish}</span>
					<div className="dish-price">
						<span>{dish.price}&#8362;</span>
						<span onClick={(e) => handleRemove(e, dish._id)} className="remove">
							remove
						</span>
					</div>
				</div>
			);
		});
	};

	const getTotalPrice = () => {
		let sum = 0;
		cart.forEach((dish) => (sum += dish.price * dish.amount));
		return sum;
	};

	const showAllDish = async (e, dish) => {
		setIsDish(true);
		setDishToDisplay(dish);
	};

	const renderMenu = () => {
		const categories = [];
		return menu.map((dish) => {
			return (
				<Fragment key={`${dish._id}1`}>
					<h3 className="category">
						{categories.includes(dish.category)
							? null
							: categories.push(dish.category) && dish.category}
					</h3>
					<div className="dish-container">
						<div className="dish-image-container">
							<img
								onClick={(e) => zoomInImage(e, dish._id)}
								onMouseEnter={(e) => zoomInImage(e, dish._id)}
								onMouseLeave={(e) => setIsZoom(false)}
								src={`/api/menu/get-dish-image/${dish._id}`}
								alt="dish-image"
							/>
						</div>
						<div
							onClick={(e) => showAllDish(e, dish)}
							className="dish-details-text"
						>
							<span className="dish-name">{dish.dish}</span>
							<span className="dish-description">{dish.description}</span>
							<span className="dish-price">{dish.price}&#8362;</span>
						</div>
						<div className="add-to-cart">
							<i
								onClick={(e) => addToCart(e, dish)}
								className="fas fa-plus"
							></i>
						</div>
					</div>
				</Fragment>
			);
		});
	};

	const clearCart = () => {
		setCart([]);
	};
	return (
		<div className="menu-container">
			<Navbar personalDetails={user} />
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<div className="restaurant-display">
						<div className="restaurant-details"></div>
						<div
							className="cover-container"
							style={{
								background: `url(/api/restaurants/profile/coverPhoto/${id}) no-repeat top center/cover`,
							}}
						>
							<div className="image-logo">
								<img src={`/api/restaurants/profile/${id}`} alt="logo" />
							</div>
						</div>
					</div>
					<main className="main-container">
						<div className="main-container-dishes">{renderMenu()}</div>
						<div className="cart">
							<div className="cart-button-container">
								<button
									onClick={() => setIsOpenPayment(true)}
									className="cart-button"
									disabled={cart.length === 0 ? true : false}
									style={{
										background: cart.length === 0 ? '#999' : '',
										cursor: cart.length === 0 ? 'no-drop' : 'pointer',
									}}
								>
									Proceed To Payment
								</button>
							</div>
							{cart.length === 0 ? (
								<div className="cart-empty-message">Your cart is empty</div>
							) : (
								<>
									<div className="order-summary">{getTotalOrder()}</div>
									<div className="total-sum">
										<span>Total:</span>
										<span className="total-sum-text">
											{getTotalPrice()}&#8362;
										</span>
									</div>
								</>
							)}
						</div>
					</main>
					{isZoom && (
						<div className="zoomed-image">
							<img
								src={`/api/menu/get-dish-image/${dishIdZoom}`}
								alt="Zoomed-Image"
							/>
						</div>
					)}
					{isDish && (
						<div className="zoomed-dish">
							<i onClick={() => setIsDish(false)} className="fas fa-times"></i>
							<div className="zoomed-dish-description">
								<h1>{dishToDisplay.dish}</h1>
								<h3>{dishToDisplay.description}</h3>
							</div>
							<div className="zoomed-dish-cart">
								<button onClick={(e) => addToCart(e, dishToDisplay)}>
									Add {dishToDisplay.price}&#8362;
								</button>
							</div>
						</div>
					)}
					{errorMsg && (
						<div className="error-message">
							<span>{errorMsg}</span>
						</div>
					)}
					{isOpenPayment && (
						<Payment
							restaurant={restaurantDetails._id}
							user={user}
							price={getTotalPrice()}
							closePayment={setIsOpenPayment}
							cart={cart}
							clearCart={clearCart}
							renderUser={renderUser}
						/>
					)}
				</>
			)}
		</div>
	);
};
export default Order;
