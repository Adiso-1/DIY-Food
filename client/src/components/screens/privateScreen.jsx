import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrivateScreen = ({ history }) => {
	const [error, setError] = useState('');
	const [privateData, setPrivateData] = useState('');

	useEffect(() => {
		if (!localStorage.getItem('authToken')) {
			history.push('/');
		}
		const fetchPrivateDate = async () => {
			const config = {
				header: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			};
			try {
				const { data } = await axios.get('/private', config);
				setPrivateData(data.data);
			} catch (error) {
				localStorage.removeItem('authToken');
				setError('You are not authorized, please login');
			}
		};
	}, []);

	const logoutHandler = () => {
		localStorage.removeItem('authToken');
		history.push('/login');
	};
	return (
		<div>
			{error ? <span className="error-message">{error}</span> : null}
			<div style={{ background: 'green', color: '#fff' }}>{privateData}</div>
			<button onClick={logoutHandler}>Logout</button>
		</div>
	);
};
export default PrivateScreen;
