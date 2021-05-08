import axios from 'axios';

let url;
if (process.env.NODE_ENV === 'development') {
	url = 'http://localhost:5000/';
}
if (process.env.NODE_ENV === 'production') {
	url = '/';
}
const api = axios.create({
	baseURL: url,
});

export default api;
