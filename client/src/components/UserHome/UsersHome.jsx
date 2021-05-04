import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useEffect } from 'react';

// Routing
import PrivateRoute from '../../routing/PrivateRoute';

// Screens
import privateScreen from '../../screens/privateScreen';
import LoginScreen from '../../screens/LoginScreen';
import RegisterScreen from '../../screens/RegisterScreen';
import ForgotPasswordScreen from '../../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../../screens/ResetPasswordScreen';

import './UsersHome.css';

const UsersHome = () => {
	console.log('hello');
	return (
		<Router>
			<div className="app">
				<Switch>
					<PrivateRoute exact path="/users" component={privateScreen} />

					<Route exact path="/users/login" component={LoginScreen} />
					<Route exact path="/users/register" component={RegisterScreen} />
					<Route
						exact
						path="/users/forgotpassword"
						component={ForgotPasswordScreen}
					/>
					<Route
						exact
						path="/users/passwordreset/:resetToken"
						component={ResetPasswordScreen}
					/>
				</Switch>
			</div>
		</Router>
	);
};
export default UsersHome;
