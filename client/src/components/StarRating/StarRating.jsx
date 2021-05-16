import { useState } from 'react';
import Button from '../Button/Button';
import './StarRating.css';
const StarRating = (props) => {
	const [rating, setRating] = useState(null);
	const [hover, setHover] = useState(null);
	console.log(props);

	const saveFeedback = () => {
		props.closePopUp(null);
	};

	return (
		<div className="order-to-feedback">
			<div className="exit-button">
				<i onClick={() => props.closePopUp(null)} className="fas fa-times"></i>
			</div>
			<div className="leave-feedback">
				<h3>How was your order from 1-5?</h3>
				<div className="stars-container">
					{[...Array(5)].map((star, i) => {
						const ratingValue = i + 1;
						return (
							<label>
								<input
									type="radio"
									name="rating"
									value={ratingValue}
									onClick={() => setRating(ratingValue)}
								/>
								<i
									className="fas fa-star star fa-2x"
									style={{
										color:
											ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9',
									}}
									onMouseEnter={() => setHover(ratingValue)}
									onMouseLeave={() => setHover(null)}
								></i>
							</label>
						);
					})}
				</div>
				<Button onClick={saveFeedback} text="Save Feedback" />
			</div>
		</div>
	);
};
export default StarRating;
