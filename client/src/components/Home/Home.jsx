import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import Navbar from '../NavbarBig/NavbarBig';
import './Home.css';
const Home = () => {
	return (
		<div className="home-container">
			<Navbar />
			<div className="home-main">
				<div className="home-main-image"></div>
				<div className="home-main-about">
					<h2>About Us</h2>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
						minima quos doloribus, provident beatae praesentium consectetur
						ullam quae iusto id labore, fugit porro quia eaque, corporis libero
						modi laborum. Eos eveniet esse ullam, voluptas optio harum incidunt
						impedit iste. Quod est perspiciatis aliquid voluptatibus recusandae,
						consequuntur officiis culpa maiores? Voluptatum officiis voluptate
						exercitationem est ab rerum velit distinctio ut accusantium atque
						eveniet ratione, aspernatur, labore, esse quasi ipsum illum officia
						perspiciatis quae similique sunt corrupti! Vitae ex nulla libero
						similique enim, minima doloremque culpa magni doloribus dignissimos!
						Dolorum a, voluptatem voluptas officia molestiae amet culpa, id,
						ratione soluta vel illo.
					</p>
					<div className="home-main-button-container">
						<Link to="/users/login">
							<Button text="Make An Order" />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Home;
