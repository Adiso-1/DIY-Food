import Navbar from '../../../components/NavbarUser/NavbarUser';
import api from '../../../api/api';
import { useState, useEffect } from 'react';
import OrderToShow from '../../../components/OrderToShow/OrderToShow';
import dateFormat from 'dateformat';
import './RecentOrders.css';

const RecentOrders = () => {
	const [orders, setOrders] = useState([]);
	const [orderToShow, setOrderToShow] = useState(null);

	const getUserInfo = async () => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		const { data } = await api.get('/orders/userInfo', config);
		setOrders(data);
	};
	useEffect(() => {
		getUserInfo();
	}, []);
	return (
		<div className="recent-orders-container">
			<Navbar />
			<div className="uncompleted-orders">
				<h2>Orders On Delivery</h2>
				<div className="table">
					<table className="uncompleted-table">
						<thead>
							<tr>
								<th>Restaurant</th>
								<th>Date</th>
								<th>Delivered To</th>
								<th>Price</th>
								<th></th>
							</tr>
						</thead>

						{orders.map((el) =>
							el.isCompleted === 'false' ? (
								<tbody key={el._id}>
									<tr>
										<td>{el.restaurant}</td>
										<td>{dateFormat(el.dateAdded, 'dd/mm/yy HH:MM:ss')}</td>
										<td>
											<span>{el.deliveryAddress.city}</span>,{' '}
											<span>{el.deliveryAddress.street}</span>,{' '}
											<span>{el.deliveryAddress.number}</span>/
											<span>{el.deliveryAddress.apartment}</span>
										</td>
										<td>{el.price}&#8362;</td>
										<td onClick={(e) => setOrderToShow(el)}>
											<span className="show-details-span">Show details</span>
										</td>
									</tr>
								</tbody>
							) : null
						)}
					</table>
				</div>
			</div>

			<div className="completed-orders">
				<h2>Recent Orders</h2>
				<div className="table">
					<table className="uncompleted-table">
						<thead>
							<tr>
								<th>Restaurant</th>
								<th>Date</th>
								<th>Delivered To</th>
								<th>Price</th>
								<th></th>
							</tr>
						</thead>
						{orders.map((el) =>
							el.isCompleted === 'true' ? (
								<tbody key={el._id}>
									<tr>
										<td>{el.restaurant}</td>
										<td>{dateFormat(el.dateAdded, 'dd/mm/yy HH:MM:ss')}</td>
										<td>
											<span>{el.deliveryAddress.city}</span>,{' '}
											<span>{el.deliveryAddress.street}</span>,{' '}
											<span>{el.deliveryAddress.number}</span>/
											<span>{el.deliveryAddress.apartment}</span>
										</td>
										<td>{el.price}&#8362;</td>
										<td onClick={(e) => setOrderToShow(el)}>
											<span className="show-details-span">Show details</span>
										</td>
									</tr>
								</tbody>
							) : null
						)}
					</table>
				</div>
				{orderToShow && (
					<OrderToShow data={orderToShow} closePopUp={setOrderToShow} />
				)}
			</div>
		</div>
	);
};
export default RecentOrders;
