import { useEffect, useState } from 'react';
import Address from '../Address/Address';
import Button from '../Button/Button';
import api from '../../api/api';
import './EditRestaurant.css';

const EditRestaurant = (props) => {
	const [name, setName] = useState('');
	const [city, setCity] = useState('');
	const [street, setstreet] = useState('');
	const [number, setNumber] = useState('');
	const [apartment, setApartment] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [deliveryTime, setDeliveryTime] = useState('');
	const [minPayment, setMinPayment] = useState('');
	const [errorMsg, setErrorMsg] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem(
						'authTokenRestaurants'
					)}`,
				},
			};
			const changeObj = {
				name,
				address: {
					city,
					street,
					number,
					apartment,
				},
				email,
				phone,
				deliveryTime,
				minPayment,
			};
			await api.patch('/restaurants/updateRestaurant', changeObj, config);
			props.closeUpdateProfile(false);
			props.renderRestaurant();
		} catch (error) {
			setErrorMsg(error.response.data.error);
		}
	};

	useEffect(() => {
		setName(props.restaurantData.name);
		setCity(props.restaurantData.address.city);
		setstreet(props.restaurantData.address.street);
		setNumber(props.restaurantData.address.number);
		setApartment(props.restaurantData.address.apartment);
		setEmail(props.restaurantData.email);
		setPhone(props.restaurantData.phone);
		setDeliveryTime(props.restaurantData.deliveryTime);
		setMinPayment(props.restaurantData.minPayment);
	}, []);
	return (
		<div className="edit-user-container form-group">
			<form onSubmit={handleSubmit}>
				<div className="name">
					<label htmlFor="name">Name</label>
					<input
						onChange={(e) => setName(e.target.value)}
						required
						value={name}
						type="text"
						name="name"
						id="name"
					/>
				</div>
				<Address
					city={city}
					setCity={setCity}
					street={street}
					setstreet={setstreet}
					number={number}
					setNumber={setNumber}
					apartment={apartment}
					setApartment={setApartment}
				/>
				<div className="email">
					<label htmlFor="email">Email</label>
					<input
						onChange={(e) => setEmail(e.target.value)}
						required
						value={email}
						type="email"
						name="email"
						id="email"
					/>
				</div>

				<div className="phone">
					<label htmlFor="phone">Phone</label>
					<input
						onChange={(e) => setPhone(e.target.value)}
						required
						value={phone}
						type="text"
						name="phone"
						id="phone"
					/>
				</div>

				<div className="delivery-time">
					<label htmlFor="delivery-time">Delivery time</label>
					<input
						onChange={(e) => {
							e.target.value.match(/[0-9]%/) && setDeliveryTime(e.target.value);
						}}
						required
						value={deliveryTime}
						type="text"
						name="delivery-time"
						id="delivery-time"
					/>
				</div>

				<div className="min-payment">
					<label htmlFor="min-payment">Min payment</label>
					<input
						onChange={(e) => {
							e.target.value.match(/[0-9]%/) && setMinPayment(e.target.value);
						}}
						required
						value={minPayment}
						type="text"
						name="min-payment"
						id="min-payment"
					/>
				</div>
				<div className="button-container">
					<Button text="save changes" />
				</div>
				{errorMsg && <h3>{errorMsg}</h3>}
			</form>
		</div>
	);
};
export default EditRestaurant;
