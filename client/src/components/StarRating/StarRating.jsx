import { useState } from 'react';
import api from '../../api/api';
import Button from '../Button/Button';
import './StarRating.css';
const StarRating = (props) => {
	const [rating, setRating] = useState(null);
	const [hover, setHover] = useState(null);
	const [feedbackMsg, setFeedbackMsg] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);

	const saveFeedback = async () => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authTokenUsers')}`,
			},
		};
		try {
			await api.post(
				`/users/addRating/${props.data._id}?rating=${rating}`,
				{},
				config
			);
			setTimeout(() => {
				setFeedbackMsg(null);
				props.closePopUp(null);
				props.getUserInfo();
			}, 2000);
			setFeedbackMsg('Thank you for your feedback');
		} catch (error) {
			setTimeout(() => {
				setErrorMsg(null);
			}, 2000);
			setErrorMsg(error.response.data.error);
		}
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
							<label key={i}>
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
				<div className="on-feedback-submit">
					{feedbackMsg && <h3>{feedbackMsg}</h3>}
					{errorMsg && <h3>{errorMsg}</h3>}
				</div>
				<Button onClick={saveFeedback} text="Save Feedback" />
			</div>
		</div>
	);
};
export default StarRating;
