import Navbar from '../../../components/NavbarSmall/NavbarSmall';
import api from '../../../api/api';
import './RecentOrders.css';
import { useState, useEffect } from 'react';
const RecentOrders = () => {
	const [orders, setOrders] = useState([]);
	console.log(orders);
	useEffect(async () => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		const { data } = await api.get('/orders/userInfo', config);
		setOrders(data);
	}, []);
	return (
		<div className="recent-orders-container">
			<Navbar />
			<div className="uncompleted-orders">
				<h1>Uncompleted Orders</h1>
				<div>
					{orders.map((el) =>
						el.isCompleted === 'false' ? (
							<div>
								<span></span>
							</div>
						) : (
							<h3>No Orders To Deliver</h3>
						)
					)}
				</div>
			</div>
			<div className="completed-orders">
				<h1>Completed Orders</h1>
				<div>{orders.filter((el) => el.isCompleted === 'true')}</div>
			</div>
		</div>
	);
};
export default RecentOrders;
