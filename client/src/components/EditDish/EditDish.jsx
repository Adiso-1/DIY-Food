import { useState, useEffect, useContext } from 'react';
import api from '../../api/api';
import Button from '../Button/Button';
import config from '../../utils/authConfig';
import './EditDish.css';

const EditDishImage = (props) => {
	const [nameToEdit, setNameToEdit] = useState('');
	const [descriptionToEdit, setDescriptionToEdit] = useState('');
	const [priceToEdit, setPriceToEdit] = useState('');
	const [categoryToEdit, setCategoryToEdit] = useState('');
	const [idToEdit, setIdToEdit] = useState('');
	const [successMsg, setSuccessMsg] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	useEffect(() => {
		setIdToEdit(props.dish._id);
		setNameToEdit(props.dish.dish);
		setDescriptionToEdit(props.dish.description);
		setPriceToEdit(props.dish.price);
		setCategoryToEdit(props.dish.category);
	}, []);

	const onEditSubmit = async (e) => {
		e.preventDefault();
		try {
			const { data } = await api.patch(
				`/menu/edit-dish/${idToEdit}`,
				{
					dish: nameToEdit,
					description: descriptionToEdit,
					price: priceToEdit,
					category: categoryToEdit,
				},
				config('authTokenRestaurants')
			);
			props.updateMenu(data);
			props.setIsEdit(false);
		} catch (error) {
			setTimeout(() => {
				setErrorMsg('');
			}, 2000);
			setErrorMsg(error.response.data.error);
		}
	};

	const deleteImageHandler = async (e, id) => {
		e.preventDefault();
		try {
			const { data } = await api.delete(
				`/menu/delete-dish-image/${id}`,
				config('authTokenRestaurants')
			);
			setTimeout(() => {
				setSuccessMsg('');
				props.setIsEdit(false);
			}, 2000);
			props.updateMenu(data);
			setSuccessMsg('Image Deleted Succesfully');
		} catch (error) {
			setTimeout(() => {
				setErrorMsg('');
			}, 2000);
			setErrorMsg(error.response.data.error);
		}
	};
	return (
		<div onSubmit={onEditSubmit} className="edit-dish-container">
			<form className="login-screen__form">
				<span className="close-edit" onClick={(e) => props.setIsEdit(false)}>
					<i className="fas fa-times"></i>
				</span>

				<div className="form-group">
					<label htmlFor="dish">Dish Name:</label>
					<input
						type="text"
						required
						id="dish"
						placeholder="Dish Name"
						onChange={(e) => setNameToEdit(e.target.value)}
						value={nameToEdit}
						tabIndex={1}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="description">Description:</label>
					<input
						type="text"
						required
						id="description"
						placeholder="Write description"
						onChange={(e) => setDescriptionToEdit(e.target.value)}
						value={descriptionToEdit}
						tabIndex={2}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="category">Category:</label>
					<input
						type="text"
						required
						id="category"
						placeholder="Enter category"
						onChange={(e) => setCategoryToEdit(e.target.value)}
						value={categoryToEdit}
						tabIndex={3}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="price">Price:</label>
					<input
						type="text"
						required
						id="price"
						placeholder="Enter price"
						onChange={(e) =>
							e.target.value.match(/^[0-9]*$/) && setPriceToEdit(e.target.value)
						}
						value={priceToEdit}
						tabIndex={4}
					/>
				</div>

				{props.successMsg && (
					<div className="success-feedback">
						<h3>{props.successMsg}</h3>
					</div>
				)}
				{props.errorMsg && (
					<div className="error-feedback">
						<h3>{props.errorMsg}</h3>
					</div>
				)}
				<div className="delete-image">
					<Button
						onClick={(e) => deleteImageHandler(e, props.dish._id)}
						text="Delete Image"
					/>
				</div>
				<div className="restaurant-menu-button-container">
					<Button type="submit" text="Save" />
				</div>
				<h2>{successMsg}</h2>
				<h2>{errorMsg}</h2>
			</form>
		</div>
	);
};
export default EditDishImage;
