import { useRef, useState, useEffect } from 'react';
import Button from '../../../components/Button/Button';
import api from '../../../api/api';
import './Payment.css';
import Address from '../../../components/Address/Address';

const Payment = (props) => {
	const [cardOwner, setCardOwner] = useState('');
	const [cardNumber, setCardNumber] = useState('');
	const [CVV, setCVV] = useState('');
	const [isSuccessMsg, SetIsSuccessMsg] = useState(false);
	const [city, setCity] = useState('');
	const [street, setStreet] = useState('');
	const [number, setNumber] = useState('');
	const [apartment, setApartment] = useState('');
	const inputRef = useRef(null);
	const addressRef = useRef(null);
	const [isChecked, setIsChecked] = useState(true);

	const onsubmit = async (e) => {
		e.preventDefault();
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		const cart = [];
		let deliveryAddress;
		if (!isChecked) {
			deliveryAddress = {
				city,
				street,
				number,
				apartment,
			};
		} else {
			deliveryAddress = props.user.address;
		}
		props.cart.map((el) => {
			const obj = {
				dish_id: el._id,
				amount: el.amount,
				dishName: el.dish,
			};
			cart.push(obj);
		});
		await api.post(
			'/orders/add',
			{
				restaurant: props.restaurant,
				cart,
				payment: {
					cardOwner,
					cardNumber,
					CVV,
				},
				price: Number(props.price),
				deliveryAddress,
			},
			config
		);
		setTimeout(() => {
			SetIsSuccessMsg(false);
			props.clearCart();
			props.closePayment(false);
			window.location.reload();
		}, 2000);
		SetIsSuccessMsg(true);
	};

	useEffect(() => {
		// addressRef.current.checked;
		inputRef.current.focus();
		console.log(props);
	}, []);

	return (
		<div className="payment-container">
			<div className="exit-button">
				<i
					onClick={() => props.closePayment(false)}
					className="fas exit-button fa-times"
				></i>
			</div>
			<div className="payment-details">
				<form className="form-container">
					<h2>Complete Your Order</h2>
					<div className="card-holder-name">
						<label htmlFor="name">Card Owner:</label>
						<input
							ref={inputRef}
							value={cardOwner}
							onChange={(e) => setCardOwner(e.target.value)}
							type="text"
							id="name"
							required
						/>
					</div>

					<div className="delivery-address-cotainer">
						<div className="is-same-address">
							<input
								ref={addressRef}
								type="checkbox"
								id="same-address"
								name="same-address"
								onChange={(e) => setIsChecked(!e.target.checked)}
							/>
							<label htmlFor="same-address">
								Do you want to change the delivery address?
							</label>
						</div>

						<Address
							city={city}
							setCity={setCity}
							street={street}
							setStreet={setStreet}
							number={number}
							setNumber={setNumber}
							apartment={apartment}
							setApartment={setApartment}
							isChecked={isChecked}
							setCity={setCity}
						/>
					</div>

					<div className="card-number">
						<label htmlFor="card-number">Card Number:</label>
						<input
							value={cardNumber}
							onChange={(e) => setCardNumber(e.target.value)}
							type="text"
							id="card-number"
							required
						/>
					</div>

					<div className="cvv">
						<label htmlFor="cvv">CVV:</label>
						<input
							value={CVV}
							onChange={(e) => setCVV(e.target.value)}
							type="text"
							id="cvv"
							required
							maxLength={3}
							minLength={3}
						/>
					</div>
					<div className="total">
						<span>Total Payment</span>
						<span>{props.price}&#8362;</span>
					</div>
					{isSuccessMsg && <h2 className="success-message">Payment Succeed</h2>}
					<Button onClick={onsubmit} text="Pay" />
				</form>
			</div>
		</div>
	);
};
export default Payment;
