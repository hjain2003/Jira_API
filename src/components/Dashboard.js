import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {}; // Destructure email from state

  const onLogoutSuccess = () => {
    googleLogout(); // Call the googleLogout function
    console.log('Logged out successfully');
    navigate('/'); // Redirect to login page after logout
  };

  const onLogoutError = (error) => {
    console.error('Logout failed:', error);
  };

  return (
    <div>
      <nav>
        <span>
          <h1>DigitalXForce Ticket Raising Platform</h1>
        </span>
        <div id="rightspan">
          {email && <p>{email}</p>} &nbsp;&nbsp;&nbsp; 
          <button onClick={onLogoutSuccess}>Logout</button> 
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
