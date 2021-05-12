import { useRef, useState, useEffect } from 'react';
import Button from '../../../components/Button/Button';
import api from '../../../api/api';
import './Payment.css';

const Payment = (props) => {
	const [cardOwner, setCardOwner] = useState('');
	const [cardNumber, setCardNumber] = useState('');
	const [CVV, setCVV] = useState('');
	const [deliveryAddress, setDeliveryAddress] = useState('');
	const [isSuccessMsg, SetIsSuccessMsg] = useState(false);
	const inputRef = useRef();

	const onsubmit = async (e) => {
		e.preventDefault();
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		const cart = [];
		props.cart.map((el) => {
			const obj = {
				dish_id: el._id,
				amount: el.amount,
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
			props.renderUser();
		}, 2000);
		SetIsSuccessMsg(true);
	};

	useEffect(() => {
		inputRef.current.focus();
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
						<label htmlFor="name">Card Name:</label>
						<input
							ref={inputRef}
							value={cardOwner}
							onChange={(e) => setCardOwner(e.target.value)}
							type="text"
							id="name"
							required
						/>
					</div>

					<div className="delivery-address">
						<label htmlFor="delivery-address">Delivery Address:</label>
						<input
							value={deliveryAddress}
							onChange={(e) => setDeliveryAddress(e.target.value)}
							type="text"
							id="delivery-address"
							required
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
