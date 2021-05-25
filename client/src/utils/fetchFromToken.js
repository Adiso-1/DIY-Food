import config from './authConfig';
import api from '../api/api';

const fetchFromToken = async (setProfile) => {
	const path = window.location.pathname.match(/^\/([^/]*)/)[0];
	const tokenType =
		path === '/users' ? 'authTokenUsers' : 'authTokenRestaurants';
	try {
		const { data } = await api.get(`${path}/profile`, config(tokenType));
		setProfile(() =>
			tokenType === 'authTokenUsers'
				? { user: data, token: localStorage.getItem(tokenType) }
				: { restaurant: data, token: localStorage.getItem(tokenType) }
		);
	} catch (error) {
		console.log(error);
	}
};
export default fetchFromToken;
