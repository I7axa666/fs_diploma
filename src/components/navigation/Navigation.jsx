import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from '../../actions/authActions';
import './Style.css';

function Navigation() {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
    };
return (
    <nav className="navigation">
    <ul className="nav-list">
       <li className="nav-item"><Link to="/">Главная</Link></li>
       <li className="nav-item"><Link to="/storage">Облако</Link></li>
       {isAuthenticated ? (
        <>
           {user.is_staff && (
               <li className="nav-item"><Link to="/admin">Панель администратора</Link></li>
            )}
           <li className="nav-item"><Link to="/login" onClick={handleLogout}>Выйти</Link></li>
           <li className="nav-item">Привет, {user.username}</li>
        </>
       ) : (
        <>
           <li className="nav-item"><Link to="/login">Войти</Link></li>
           <li className="nav-item"><Link to="/register">Зарегистрироваться</Link></li>
        </>
       )}
    </ul>
   </nav>
);
}

export default Navigation;