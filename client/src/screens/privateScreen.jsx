import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrivateScreen = ({ history }) => {
	const [error, setError] = useState('');
	const [data, setData] = useState(null);

	const path = window.location.pathname.match(/^\/([^/]*)/)[0];
	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('authToken')}`,
		},
	};

	useEffect(() => {
		if (!localStorage.getItem('authToken')) {
			history.push(`${path}/login`);
		}
		const fetchPrivateDate = async () => {
			try {
				const { data } = await axios.get(`${path}/profile`, config);
				setData(data);
			} catch (error) {
				localStorage.removeItem('authToken');
				setError('You are not authorized, please login');
			}
		};
		fetchPrivateDate();
	}, []);

	const logoutHandler = async () => {
		try {
			await axios.post(`${path}/logout`, {}, config);
			localStorage.removeItem('authToken');
		} catch (error) {
			console.log(error);
		}
		history.push(`${path}/login`);
	};
	return (
		<div>
			{error ? <span className="error-message">{error}</span> : null}
			<button onClick={logoutHandler}>Logout</button>
			{data && (
				<div>
					<h1>UserName: {data.username}</h1>
					<h1>Email: {data.email}</h1>
					<h1>Phone: {data.phone}</h1>
					<img
						src={`http://localhost:5000/users/profile/avatar/${data._id}`}
						alt="profile image"
					/>
				</div>
			)}
		</div>
	);
};
export default PrivateScreen;
