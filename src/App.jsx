import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from './actions/authActions';
import HomePage from './components/homePage/HomePage';
import Register from './components/register/Register';
import Login from './components/login/Login';
import AdminDashboard from './components/adminDashboard/AdminDashboard';
import FileStorage from './components/fileStorage/FileStorage';
import Navigation from './components/navigation/Navigation';
import FileDetails from './components/FileDetails/FileDetails';

function App() {

    const dispatch = useDispatch();

    useEffect(() => {
	console.log("App loaded");
        dispatch(checkAuth());
    }, [dispatch]);

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
                <Route path="/files/info/:share_token" element={<FileDetails />} />
            </Routes>
        </div>
    </Router>
);
}

export default App;
