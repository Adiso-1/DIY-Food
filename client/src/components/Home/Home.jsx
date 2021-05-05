import { Link } from 'react-router-dom';
import './Home.css';
const Home = () => {
	return (
		<div>
			<h1>Hello, Welcome to deliciuos, please login or register</h1>
			<div className="navigation">
				<Link to="/users">I want to make an order</Link>
				<Link to="/restaurants">I have a restaurant</Link>
			</div>
		</div>
	);
};
export default Home;
