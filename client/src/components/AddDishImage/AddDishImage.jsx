import api from '../../api/api';
import Button from '../Button/Button';
import { useState, useRef } from 'react';
import './AddDishImage.css';

const AddDishImage = (props) => {
	const [dishImage, setDishImage] = useState(null);
	const fileInput = useRef();

	const handleImage = (e) => {
		e.preventDefault();
		props.setSuccessMsg('You selected 1 file');
		setDishImage(e.target.files[0]);
	};

	const uploadHandler = async (e, id) => {
		e.preventDefault();
		const config = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		const fd = new FormData();
		fd.append('dish-image', dishImage, dishImage.name);
		try {
			await api.post(`/menu/add-dish-image/${id}`, fd, config);
			setTimeout(() => {
				props.setSuccessMsg('');
			}, 2000);
			props.setSuccessMsg('Image Uploaded Succesfully');
		} catch (error) {
			setTimeout(() => {
				props.setErrorMsg('');
			}, 2000);
			props.setErrorMsg(error.response.data.error);
		}
	};
	return (
		<div className="add-dish-image-container">
			<h3>Upload a dish picture </h3>
			<div className="add-dish-image-buttons">
				<input
					className="invisible-input"
					onChange={handleImage}
					type="file"
					name="dish-picture"
					id="dish-picture"
					ref={fileInput}
				/>
				<Button
					onClick={(e) => fileInput.current.click(e)}
					text="Select Image"
				/>
				<Button
					onClick={(e) => uploadHandler(e, props.dish._id)}
					text="Upload"
				/>
			</div>
		</div>
	);
};
export default AddDishImage;
