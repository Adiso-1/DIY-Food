import { Link, useHistory } from 'react-router-dom';
import Button from '../Button/Button';
import './NavbarBig.css';

const Navbar = () => {
	const history = useHistory();
	const onClick = () => {
		history.push('/restaurants/login');
	};
	return (
		<div className="navbar-big-container">
			<div className="button-container">
				<Button text="Restaurants Login" onClick={onClick} />
			</div>
			<Link to="/">
				<img src="/images/delicious-logo.PNG" alt="delicious-logo" />
			</Link>
		</div>
	);
};
export default Navbar;
