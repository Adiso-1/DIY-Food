import { useEffect, useState } from 'react';
import api from '../../../api/api';
import Navbar from '../../../components/NavbarRestaurant/NavbarRestaurant';
import OrderToShow from '../../../components/OrderToShow/OrderToShow';
import dateFormat from 'dateformat';
import './RestaurantOrders.css';

const RestaurantOrders = () => {
	const [orders, setOrders] = useState([]);
	const [orderToShow, setOrderToShow] = useState(null);

	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('authToken')}`,
		},
	};

	const getOrders = async () => {
		const { data } = await api.get(`/orders/restaurantInfo`, config);
		setOrders(data);
	};

	useEffect(() => {
		getOrders();
	}, []);

	const markAsCompleted = (e, el) => {
		api.patch(`/orders/markAsCompleted/${el._id}`, {}, config);
		getOrders();
	};

	return (
		<div>
			<Navbar />
			<div className="uncompleted-orders">
				<h2>Uncompleted Orders</h2>
				<table className="uncompleted-table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Phone</th>
							<th>Date</th>
							<th>Delivered To</th>
							<th>Price</th>
							<th>Mark As Completed</th>
							<th></th>
						</tr>
					</thead>
					{orders.map((el) =>
						el.isCompleted === 'false' ? (
							<tbody>
								<tr key={el._id}>
									<td>{el.owner}</td>
									<td>{el.userPhone}</td>
									<td>{el.deliveryAddress}</td>
									<td>{dateFormat(el.dateAdded, 'dd/mm/yy HH:MM:ss')}</td>
									<td>{el.price}&#8362;</td>
									<td className="mark-as-completed">
										<i
											onClick={(e) => markAsCompleted(e, el)}
											className="fas fa-check"
										></i>
									</td>
									<td onClick={(e) => setOrderToShow(el)}>
										<span className="show-details-span">Show details</span>
									</td>
								</tr>
							</tbody>
						) : null
					)}
				</table>
			</div>

			<div className="completed-orders">
				<h2>Completed Orders</h2>
				<table className="uncompleted-table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Delivered To</th>
							<th>Date</th>
							<th>Price</th>
						</tr>
					</thead>
					{orders.map((el) =>
						el.isCompleted === 'true' ? (
							<tbody key={el._id}>
								<tr>
									<td>{el.owner}</td>
									<td>{el.deliveryAddress}</td>
									<td>{dateFormat(el.dateAdded, 'dd/mm/yy')}</td>
									<td>{el.price}&#8362;</td>
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
	);
};
export default RestaurantOrders;
