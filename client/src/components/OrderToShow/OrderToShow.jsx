import { useEffect } from 'react';
import './OrderToShow.css';

const OrderToShow = (props) => {
	useEffect(() => {
		console.log(props.data);
	}, []);
	return (
		<div className="pop-up-order">
			<div className="exit-button">
				<i onClick={() => props.closePopUp(null)} className="fas fa-times"></i>
			</div>
			<div className="pop-order-details">
				<table>
					<thead>
						<th>Dish</th>
						<th>Amount</th>
					</thead>
					{props.data.cart.map((dish) => {
						return (
							<tbody>
								<td>{dish.dishName}</td>
								<td>{dish.amount}</td>
							</tbody>
						);
					})}
				</table>
			</div>
		</div>
	);
};
export default OrderToShow;
