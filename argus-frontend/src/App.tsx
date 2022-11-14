import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { 
  NavigateFunction, 
  useNavigate, 
  Routes, 
  Route, 
  Link, 
  Navigate 
} from 'react-router-dom';
import * as AuthService from './services/auth.service';

import Login from './components/Login';
import { User } from './models/user.model';
import Register from './components/Register';
import Vehicles from './components/Vehicles';
import VehicleDetails from './components/VehicleDetails';

const PrivateRoute = ({ children }: { children: JSX.Element } ) => {
  const user = AuthService.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }: { children: JSX.Element } ) => {
  const user = AuthService.getCurrentUser();

  if (user) {
    return <Navigate to="/vehicles" replace />;
  }

  return children;
};

const App = () => {
  const navigate: NavigateFunction = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    navigate('/login');
    window.location.reload()
  };

  return (
    <div className="App">
      <nav className="navbar navbar-expand navbar-dark bg-dark justify-content-between">
        <img
            src='/ArgusNewWhiteFix3.webp'
            alt='profile-img'
            className='nav-image ml-1'
        />
        {currentUser && (
        <ul className="navbar-nav mr-auto ">
          <li className="nav-item text-light d-flex align-items-center">
            <span className="">Hi, {currentUser.email}!</span>
            <i onClick={logOut} className="bi bi-box-arrow-right m-3 logout"></i>
          </li>
        </ul>
        )}

      </nav>
      <div className="container mt-3">
        <Routes>
          <Route path="/vehicles" element={
            <PrivateRoute>
              <Vehicles />
            </PrivateRoute>
          } />
          <Route path="/vehicles/*" element={
            <PrivateRoute>
              <VehicleDetails />
            </PrivateRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="*" element={
              currentUser ? <Navigate to="/vehicles" /> : <Navigate to="/login" />
            } 
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
