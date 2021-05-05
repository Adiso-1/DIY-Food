import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import RestaurantsHome from './screens/Restaurants/RestaurantsHome/RestaurantsHome';
import UsersHome from './screens/Users/UsersHome/UsersHome';
import LoginScreen from './screens/Authorization/LoginScreen';

const App = () => {
	return (
		<Router>
			<Switch>
				<Route exact path="/restaurants" component={RestaurantsHome} />
				<Route exact path="/users" component={UsersHome} />
				<Route exact path="/users/login" component={LoginScreen} />
				<Route path="/" component={Home} />
			</Switch>
		</Router>
	);
};

export default App;
