import './Button.css';

const Button = (props) => {
	return (
		<button className="navbar-button" onClick={props.onClick}>
			{props.text}
		</button>
	);
};
export default Button;
