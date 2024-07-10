import './App.css'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/homePage/HomePage';
import Register from './components/register/Register';
import Login from './components/login/Login';
import AdminDashboard from './components/adminDashboard/AdminDashboard';
import FileStorage from './components/fileStorage/FileStorage';
import Navigation from './components/navigation/Navigation';

function App() {
return (
    <Router>
     <Navigation />
        <div className="main-content">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/storage" element={<FileStorage />} />
            </Routes>
        </div>
    </Router>
);
}

export default App;