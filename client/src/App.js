import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import RestaurantsHome from './screens/Restaurants/RestaurantsHome/RestaurantsHome';
import UsersHome from './screens/Users/UsersHome/UsersHome';
import LoginScreen from './screens/Authorization/LoginScreen';
import ForgotPasswordScreen from './screens/Authorization/ForgotPasswordScreen';
import RegisterScreen from './screens/Authorization/RegisterScreen';
import RestaurantRegisterScreen from './screens/Authorization/RestaurantRegisterScreen';
import ResetPasswordScreen from './screens/Authorization/ResetPasswordScreen';
import Page404 from './screens/Page404/Page404';
import UserProfileDetails from './screens/Users/UserProfileDetails/UserProfileDetails';
import RestaurantProfileDetails from './screens/Restaurants/RestaurantProfileDetails/RestaurantProfileDetails';
import RestaurantMenu from './screens/Restaurants/RestaurantMenu/RestaurantMenu';

const App = () => {
	return (
		<Router>
			<Switch>
				//! Restaurant Routes
				<Route exact path="/restaurants" component={RestaurantsHome} />
				<Route exact path="/restaurants/menu" component={RestaurantMenu} />
				//* Restaurant Authorization
				<Route exact path="/restaurants/login" component={LoginScreen} />
				<Route
					exact
					path="/restaurants/forgotpassword"
					component={ForgotPasswordScreen}
				/>
				<Route
					exact
					path="/restaurants/RestaurantProfileDetails"
					component={RestaurantProfileDetails}
				/>
				<Route
					exact
					path="/restaurants/register"
					component={RestaurantRegisterScreen}
				/>
				<Route
					exact
					path="/restaurants/resetpassword/:resetToken"
					component={ResetPasswordScreen}
				/>
				//! Users Routes
				<Route exact path="/users" component={UsersHome} />
				<Route
					exact
					path="/users/UserProfileDetails"
					component={UserProfileDetails}
				/>
				//* Users Authorization
				<Route exact path="/users/login" component={LoginScreen} />
				<Route
					exact
					path="/users/forgotpassword"
					component={ForgotPasswordScreen}
				/>
				<Route exact path="/users/register" component={RegisterScreen} />
				<Route
					exact
					path="/users/resetpassword/:resetToken"
					component={ResetPasswordScreen}
				/>
				//! General
				<Route exact path="/" component={Home} />
				<Route path="*" component={Page404} />
			</Switch>
		</Router>
	);
};

export default App;
