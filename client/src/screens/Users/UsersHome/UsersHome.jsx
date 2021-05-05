import axios from 'axios';
import { useState, useEffect } from 'react';
import './UsersHome.css';

const UsersHome = ({ history }) => {
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
		const fetchUser = async () => {
			try {
				const { data } = await axios.get('/users/profile', config);
				console.log(data);
				setData(data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchUser();
	}, []);

	return (
		<div>
			{data && (
				<img
					className="user-avatar"
					src={`data:image/png;base64,${data.avatar}`}
				/>
			)}
		</div>
	);
};
export default UsersHome;
