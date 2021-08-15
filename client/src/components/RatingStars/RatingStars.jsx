const RatingStars = (props) => {
	return (
		<>
			<span>
				{props.ratingData.length
					? (
							props.ratingData.reduce((acc, curr) => {
								return acc + Number(curr.rate);
							}, 0) / props.ratingData.length
					  ).toFixed(1) + '/5'
					: 'No Rating'}
			</span>
			<i className="fas fa-star star-full"></i>
			<span className="rating-out-of-span">
				({props.ratingData.length} reviews)
			</span>
		</>
	);
};
export default RatingStars;
