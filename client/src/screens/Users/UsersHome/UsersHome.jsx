import { useEffect, useContext } from 'react';
import './UsersHome.css';
import Navbar from '../../../components/NavbarUser/NavbarUser';
import Spinner from '../../../components/Spinner/Spinner';
import SearchRestaurant from '../../../components/SearchRestaurant/SearchRestaurant';
import RestaurantsGrid from '../../../components/RestaurantsGrid/RestaurantsGrid';
import AppContext from '../../../context/AppContext';
import fetchFromToken from '../../../utils/fetchFromToken';

const UsersHome = ({ history }) => {
	const { profile, setProfile } = useContext(AppContext);

	useEffect(() => {
		const fetchUser = async () => {
			if (!profile?.user || !profile?.token) {
				if (localStorage.getItem('authTokenUsers')) {
					await fetchFromToken(setProfile);
				} else {
					history.push(`/users/login`);
				}
			}
		};
		fetchUser();
	}, [profile?.user]);

	return (
		<div className="user-home">
			<Navbar personalDetails={profile} />
			<RestaurantsGrid />
		</div>
	);
};
export default UsersHome;
