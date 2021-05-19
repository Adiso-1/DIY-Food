import { useEffect, useState } from 'react';
import api from '../../../api/api';
import Navbar from '../../../components/NavbarRestaurant/NavbarRestaurant';
import OrderToShow from '../../../components/OrderToShow/OrderToShow';
import Spinner from '../../../components/Spinner/Spinner';
import dateFormat from 'dateformat';
import './RestaurantOrders.css';

const RestaurantOrders = () => {
	const [orders, setOrders] = useState([]);
	const [personalDetails, setPersonalDetails] = useState(null);
	const [orderToShow, setOrderToShow] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('authTokenRestaurants')}`,
		},
	};

	const getOrders = async () => {
		setIsLoading(true);
		const { data } = await api.get(`/orders/restaurantInfo`, config);
		setOrders(data);
		const response = await api.get(`/restaurants/profile`, config);
		setPersonalDetails(response.data);
		setIsLoading(false);
	};

	useEffect(() => {
		getOrders();
	}, []);

	const markAsCompleted = async (e, el) => {
		await api.patch(`/orders/markAsCompleted/${el._id}`, {}, config);
		getOrders();
	};

	return (
		<div>
			<Navbar personalDetails={personalDetails} restaurantOrders={orders} />
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<div className="uncompleted-orders">
						<h2>Awaiting to delivered</h2>
						<div className="table">
							<table className="uncompleted-table">
								<thead>
									<tr>
										<th>Name</th>
										<th>Phone</th>
										<th>Delivered To</th>
										<th>Date</th>
										<th>Price</th>
										<th>Mark As Completed</th>
										<th></th>
									</tr>
								</thead>
								{orders.map((el) =>
									el.isCompleted === 'false' ? (
										<tbody key={el._id}>
											<tr>
												<td>{el.owner}</td>
												<td>{el.userPhone}</td>
												<td>
													{el.deliveryAddress.city}, {el.deliveryAddress.street}
													, {el.deliveryAddress.number}/
													{el.deliveryAddress.apartment}
												</td>
												<td>{dateFormat(el.dateAdded, 'dd/mm/yy HH:MM:ss')}</td>
												<td>{el.price}&#8362;</td>
												<td className="mark-as-completed">
													<i
														onClick={(e) => markAsCompleted(e, el)}
														className="fas fa-check"
													></i>
												</td>
												<td onClick={(e) => setOrderToShow(el)}>
													<span className="show-details-span">
														Show details
													</span>
												</td>
											</tr>
										</tbody>
									) : null
								)}
							</table>
						</div>
					</div>

					<div className="completed-orders">
						<h2>Delivered Orders</h2>
						<div className="table">
							<table className="uncompleted-table">
								<thead>
									<tr>
										<th>Name</th>
										<th>Phone</th>
										<th>Delivered To</th>
										<th>Date</th>
										<th>Price</th>
										<th>Rating</th>
										<th></th>
									</tr>
								</thead>
								{orders.map((el) =>
									el.isCompleted === 'true' ? (
										<tbody key={el._id}>
											<tr>
												<td>{el.owner}</td>
												<td>{el.userPhone}</td>
												<td>
													{el.deliveryAddress.city}, {el.deliveryAddress.street}
													, {el.deliveryAddress.number}/
													{el.deliveryAddress.apartment}
												</td>
												<td>{dateFormat(el.dateAdded, 'dd/mm/yy HH:MM:ss')}</td>
												<td>{el.price}&#8362;</td>
												{el.rating ? (
													<td>
														{[...Array(Number(el.rating))].map((e, i) => (
															<i key={i} className="fas fa-star star-full"></i>
														))}
														{[...Array(Number(5 - el.rating))].map((e, i) => (
															<i key={i} className="fas fa-star star-empty"></i>
														))}
													</td>
												) : (
													<td>
														{[...Array(Number(5))].map((e, i) => (
															<i key={i} className="fas fa-star star-empty"></i>
														))}
													</td>
												)}
												<td onClick={(e) => setOrderToShow(el)}>
													<span className="show-details-span">
														Show details
													</span>
												</td>
											</tr>
										</tbody>
									) : null
								)}
							</table>
						</div>
					</div>
					{orderToShow && (
						<OrderToShow data={orderToShow} closePopUp={setOrderToShow} />
					)}
				</>
			)}
		</div>
	);
};
export default RestaurantOrders;
