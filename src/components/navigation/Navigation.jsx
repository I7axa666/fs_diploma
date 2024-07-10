import './Style.css'
import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
return (
    <nav className="navigation">
        <ul className="nav-list">
            <li className="nav-item"><Link to="/">Главная</Link></li>
            <li className="nav-item"><Link to="/storage">Облако</Link></li>
            <li className="nav-item"><Link to="/login">Войти</Link></li>
            <li className="nav-item"><Link to="/register">Зарегистрироваться</Link></li>
            <li className="nav-item"><Link to="/admin">Панель администратора</Link></li>
        </ul>
    </nav>
);
}

export default Navigation;