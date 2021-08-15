import { useEffect, useContext } from 'react';
import api from '../../api/api';
import AppContext from '../../context/AppContext';
import RestaurantCard from '../RestaurantCard/RestaurantCard';
import './RestaurantsGrid.css';

const RestaurantsGrid = () => {
	const { allRestaurants, setAllRestaurants } = useContext(AppContext);

	useEffect(() => {
		if (allRestaurants) {
			return;
		}
		const getAllRestaurants = async () => {
			try {
				const { data } = await api.get(`/users/getAllRestaurants`);
				setAllRestaurants(data);
			} catch (error) {
				console.log(error);
			}
		};
		getAllRestaurants();
	}, []);

	const renderRestaurants = () =>
		allRestaurants?.map((rest) => (
			<RestaurantCard key={rest._id} data={rest} />
		));
	return (
		<div className="restaurants-grid-container">{renderRestaurants()}</div>
	);
};
export default RestaurantsGrid;
