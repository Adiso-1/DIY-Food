import { Link, useHistory } from 'react-router-dom';
import './NavbarMedium.css';

const Navbar = () => {
	const history = useHistory();
	const onClick = () => {
		history.push('/restaurants/login');
	};
	return (
		<div className="navbar-container">
			<Link to="/">
				<img src="/images/delicious-logo.PNG" alt="delicious-logo" />
			</Link>
		</div>
	);
};
export default Navbar;
