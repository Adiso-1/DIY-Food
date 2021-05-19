import './OrderToShow.css';

const OrderToShow = (props) => {
	return (
		<div className="pop-up-order">
			<div className="exit-button">
				<i onClick={() => props.closePopUp(null)} className="fas fa-times"></i>
			</div>
			<div className="pop-order-details">
				<table>
					<thead>
						<tr>
							<th>Dish</th>
							<th>Amount</th>
						</tr>
					</thead>
					{props.data.cart.map((dish) => {
						return (
							<tbody key={dish._id}>
								<tr>
									<td>{dish.dishName}</td>
									<td>{dish.amount}</td>
								</tr>
							</tbody>
						);
					})}
				</table>
			</div>
		</div>
	);
};
export default OrderToShow;
