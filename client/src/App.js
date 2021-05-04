import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './components/Home/Home';
import UserHome from './components/UserHome/UsersHome';
import RestaurantsHome from './components/RestaurantsHome/RestaurantsHome';

const App = () => {
	return (
		<Router>
			<Switch>
				<Route path="/restaurant">
					<RestaurantsHome />
				</Route>
				<Route path="/users">
					<UserHome />
				</Route>
				<Route path="/">
					<Home />
				</Route>
			</Switch>
		</Router>
	);
};

export default App;
