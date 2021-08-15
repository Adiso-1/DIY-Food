import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import RatingStars from '../RatingStars/RatingStars';
import './RestaurantCard.css';

const RestaurantCard = ({ data }) => {
	return (
		<div key={data._id} className="restaurant-profile">
			<div
				style={{
					background: `url(/api/restaurants/profile/coverPhoto/${data._id}) no-repeat top center/cover`,
				}}
				className="logo-container"
			>
				<img
					src={`/api/restaurants/profile/${data._id}`}
					alt="Restaurant-Logo"
				/>
			</div>
			<div className="restaurant-details">
				<p className="restaurant-name">{data.name}</p>
				<p className="restaurant-category">{data.category}</p>
				<p className="restaurant-email">
					Email: {data.email}
					<a href={`mailto:${data.email}`}>
						<i className="far fa-envdataope"></i>
					</a>
				</p>
				<p className="restaurant-phone">
					Phone: {data.phone}
					<a href={`tdata:+${data.phone}`}>
						<i className="fas fa-phone"></i>
					</a>
				</p>
				<p className="restaurant-address">
					Address: {data.address.city}, {data.address.street},{' '}
					{data.address.number}
				</p>
				<div className="tags-section">
					{data.tags.map((tag) => {
						return (
							<span
								key={tag}
								className={`restaurant-tag ${tag
									.replace(' ', '')
									.toLowerCase()}`}
							>
								{tag}
							</span>
						);
					})}
				</div>

				<div className="delivery-section">
					<span>&#177; {data.ddataiveryTime} Minutes</span>
					<span>Min delivery {data.minPayment}&#8362;</span>
				</div>
				<div className="rating-section">
					<RatingStars ratingData={data.rating} />
				</div>
			</div>
			<Link to={`users/order/${data._id}`}>
				<Button text="Order Now" />
			</Link>
		</div>
	);
};
export default RestaurantCard;
