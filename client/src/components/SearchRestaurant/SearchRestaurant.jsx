import { useState, useEffect } from 'react';
import './SearchRestaurant.css';

const SearchRestaurant = (props) => {
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		if (searchTerm) {
			const timerId = setTimeout(() => {
				const filteredData = [...props.data].filter((el) => {
					return el.name.toLowerCase().startsWith(searchTerm.toLowerCase());
				});
				props.setRestaurantsData(filteredData);
			}, 200);
			return () => {
				clearTimeout(timerId);
			};
		} else {
			props.setRestaurantsData(props.originalData);
		}
	}, [searchTerm]);

	return (
		<div className="filter-navbar">
			<label htmlFor="search">Search restaurant</label>
			<input
				type="search"
				name="search"
				id="search"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
		</div>
	);
};
export default SearchRestaurant;
