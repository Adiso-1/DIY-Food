import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const Home = () => {
	return (
		<div>
			<Link to="/users">Users</Link>
			<Link to="/restaurants">Restaurants</Link>
		</div>
	);
};
export default Home;
