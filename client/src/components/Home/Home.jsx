import { Link } from 'react-router-dom';
import Navbar from '../NavbarBig/NavbarBig';
import './Home.css';
const Home = () => {
	return (
		<div className="home-container">
			<Navbar />
			<div className="navigation">
				<Link to="/users">I want to make an order</Link>
				<Link to="/restaurants">I have a restaurant</Link>
			</div>
		</div>
	);
};
export default Home;
