const Address = (props) => {
	return (
		<div className="address-component">
			<h4 className="delivery-address-header" htmlFor="delivery-address">
				Delivery Address:
			</h4>

			<div className="address-input">
				<label htmlFor="delivery-city">City</label>
				<input
					value={props.city}
					onChange={(e) => props.setCity(e.target.value)}
					type="text"
					id="delivery-city"
					required={props.isChecked}
					disabled={props.isChecked}
				/>
				<label htmlFor="delivery-street">Street</label>
				<input
					value={props.street}
					onChange={(e) => props.setStreet(e.target.value)}
					type="text"
					id="delivery-street"
					required={props.isChecked}
					disabled={props.isChecked}
				/>
				<label htmlFor="delivery-number">Number</label>
				<input
					value={props.number}
					onChange={(e) => {
						props.setNumber(
							e.target.value.match(/[0-9]$/) ? e.target.value : ''
						);
					}}
					type="text"
					id="delivery-number"
					required={props.isChecked}
					disabled={props.isChecked}
				/>
				<div className="apartment-input-container">
					<label htmlFor="delivery-apartment">Apartment</label>
					<input
						value={props.apartment}
						onChange={(e) =>
							props.setApartment(
								e.target.value.match(/[0-9]$/) ? e.target.value : ''
							)
						}
						type="text"
						id="delivery-apartment"
						required={props.isChecked}
						disabled={props.isChecked}
					/>
				</div>
			</div>
		</div>
	);
};
export default Address;
