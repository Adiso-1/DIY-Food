const makeConfig = (tokenType) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem(tokenType)}`,
		},
	};
	return config;
};
export default makeConfig;
