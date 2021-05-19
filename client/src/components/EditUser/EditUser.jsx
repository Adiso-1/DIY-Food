import { useEffect, useState } from 'react';
import Address from '../Address/Address';
import Button from '../Button/Button';
import api from '../../api/api';
import './EditUser.css';

const EditUser = (props) => {
	const [name, setName] = useState('');
	const [city, setCity] = useState('');
	const [street, setstreet] = useState('');
	const [number, setNumber] = useState('');
	const [apartment, setApartment] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [errorMsg, setErrorMsg] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authTokenUsers')}`,
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
			};
			await api.patch('/users/updateUser', changeObj, config);
			props.closeUpdateProfile(false);
			props.fetchUser();
		} catch (error) {
			setErrorMsg(error.response.data.error);
		}
	};

	useEffect(() => {
		setName(props.userData.name);
		setCity(props.userData.address.city);
		setstreet(props.userData.address.street);
		setNumber(props.userData.address.number);
		setApartment(props.userData.address.apartment);
		setEmail(props.userData.email);
		setPhone(props.userData.phone);
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
				<div className="button-container">
					<Button text="save changes" />
				</div>
				{errorMsg && <h3>{errorMsg}</h3>}
			</form>
		</div>
	);
};
export default EditUser;
