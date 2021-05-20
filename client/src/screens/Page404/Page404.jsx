import { Link } from 'react-router-dom';
import Navbar from '../../components/NavbarMedium/NavbarMedium';
import './Page404.css';

const Page404 = () => {
	return (
		<div className="container-404">
			<Navbar />
			<div className="page-404">Page 404</div>
			<Link to="/">
				<div className="page-404-go-home">
					<span>Go Home</span>
				</div>
			</Link>
		</div>
	);
};
export default Page404;
