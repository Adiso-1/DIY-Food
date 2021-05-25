import { Link } from 'react-router-dom';
import api from '../../../api/api';
import { useState, useEffect } from 'react';
import './UsersHome.css';
import Navbar from '../../../components/NavbarUser/NavbarUser';
import Button from '../../../components/Button/Button';
import Spinner from '../../../components/Spinner/Spinner';
import SearchRestaurant from '../../../components/SearchRestaurant/SearchRestaurant';
import config from '../../../utils/authConfig';

const UsersHome = ({ history }) => {
	const [restaurantsData, setRestaurantsData] = useState(null);
	const [originalData, setOriginalData] = useState(null);
	const [personalDetails, setPersonalDetails] = useState(null);

	const path = window.location.pathname.match(/^\/([^/]*)/)[0];

	useEffect(() => {
		if (!localStorage.getItem('authTokenUsers')) {
			return history.push(`users/login`);
		}
		const fetchUser = async () => {
			try {
				const { data } = await api.get(
					`users/profile`,
					config('authTokenUsers')
				);
				setPersonalDetails(data);
			} catch (error) {
				localStorage.removeItem('authTokenUsers');
				history.push(`${path}/login`);
			}
		};
		fetchUser();
	}, []);

	const getAllRestaurants = async () => {
		try {
			const { data } = await api.get(`${path}/getAllRestaurants`);
			setRestaurantsData(data);
			setOriginalData(data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (!localStorage.getItem('authTokenUsers')) {
			return history.push(`${path}/login`);
		} else {
			getAllRestaurants();
		}
	}, []);

	const renderRestaurants = () => {
		if (!restaurantsData) {
			return;
		}
		return restaurantsData.map((el) => {
			return (
				<div key={el._id} className="restaurant-profile">
					<div
						style={{
							background: `url(/api/restaurants/profile/coverPhoto/${el._id}) no-repeat top center/cover`,
						}}
						className="logo-container"
					>
						<img
							src={`/api/restaurants/profile/${el._id}`}
							alt="Restaurant-Logo"
						/>
					</div>
					<div className="restaurant-details">
						<p className="restaurant-name">{el.name}</p>
						<p className="restaurant-category">{el.category}</p>
						<p className="restaurant-email">
							Email: {el.email}
							<a href={`mailto:${el.email}`}>
								<i className="far fa-envelope"></i>
							</a>
						</p>
						<p className="restaurant-phone">
							Phone: {el.phone}
							<a href={`tel:+${el.phone}`}>
								<i className="fas fa-phone"></i>
							</a>
						</p>
						<p className="restaurant-address">
							Address: {el.address.city}, {el.address.street},{' '}
							{el.address.number}
						</p>
						<div className="tags-section">
							{el.tags.map((tag) => {
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
							<span>&#177; {el.deliveryTime} Minutes</span>
							<span>Min delivery {el.minPayment}&#8362;</span>
						</div>
						<div className="rating-section">
							<span>
								{el.rating.length
									? (
											el.rating.reduce((acc, curr) => {
												return acc + Number(curr.rate);
											}, 0) / el.rating.length
									  ).toFixed(1) + '/5'
									: 'No Rating'}
							</span>
							<i className="fas fa-star star-full"></i>
							<span className="rating-out-of-span">
								({el.rating.length} reviews)
							</span>
						</div>
					</div>
					<Link to={`users/order/${el._id}`}>
						<Button text="Order Now" />
					</Link>
				</div>
			);
		});
	};
	return (
		<div className="user-home">
			<Navbar personalDetails={personalDetails} />
			<SearchRestaurant
				originalData={originalData}
				setRestaurantsData={setRestaurantsData}
				data={restaurantsData}
			/>
			{!restaurantsData || !personalDetails ? (
				<Spinner />
			) : (
				<>
					<div className="delivery-cover">
						<img src="/images/food-cover.png" alt="food-delivery" />
					</div>
					<div className="restaurants-grid">{renderRestaurants()}</div>
				</>
			)}
		</div>
	);
};
export default UsersHome;
