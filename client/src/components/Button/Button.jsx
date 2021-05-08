import './Button.css';

const Button = (props) => {
	return (
		<button
			type={props.type || ''}
			className="navbar-button"
			onClick={props.onClick}
		>
			{props.text}
		</button>
	);
};
export default Button;
