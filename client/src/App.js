import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import RestaurantsHome from './screens/Restaurants/RestaurantsHome/RestaurantsHome';
import UsersHome from './screens/Users/UsersHome/UsersHome';
import LoginScreen from './screens/Authorization/LoginScreen';
import ForgotPasswordScreen from './screens/Authorization/ForgotPasswordScreen';
import RegisterScreen from './screens/Authorization/RegisterScreen';

const App = () => {
	return (
		<Router>
			<Switch>
				<Route exact path="/restaurants" component={RestaurantsHome} />
				<Route exact path="/users" component={UsersHome} />
				<Route exact path="/users/login" component={LoginScreen} />
				<Route
					exact
					path="/users/forgotpassword"
					component={ForgotPasswordScreen}
				/>
				<Route exact path="/users/register" component={RegisterScreen} />
				<Route path="/" component={Home} />
			</Switch>
		</Router>
	);
};

export default App;
