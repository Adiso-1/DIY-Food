import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
	const path = window.location.pathname.match(/^\/([^/]*)/)[0];
	return (
		<Route
			{...rest}
			render={(props) =>
				localStorage.getItem('authToken') ? (
					<Component {...props} />
				) : (
					<Redirect to={`${path}/login`} />
				)
			}
		/>
	);
};
export default PrivateRoute;
