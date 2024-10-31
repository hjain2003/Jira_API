import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [emailFrmJira,setEmail] = useState('');
  const [name, setName] = useState('');

  const onLogoutSuccess = () => {
    localStorage.clear();
    googleLogout(); // Call the googleLogout function
    console.log('Logged out successfully');
    navigate('/'); 
  };



  useEffect(() => {
    // Retrieve name and email from local storage
    const storedName = localStorage.getItem('displayName');
    const emailjira = localStorage.getItem('email');
    if (storedName) {
      setName(storedName);
    }
    if (emailjira) {
      setEmail(emailjira);
    }
  }, []);

  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (button) => {
    // Toggle selection: deselect if the button is already selected, otherwise select it
    setSelectedButton(prevButton => (prevButton === button ? null : button));
  };
 

  return (
    <div>
      <nav>
        <span>
          <h1>DigitalXForce Ticket Raising Platform</h1>
        </span>
        <div id="rightspan">
          {emailFrmJira} &nbsp;&nbsp;&nbsp; 
          <button onClick={onLogoutSuccess}>Logout</button> 
        </div>
      </nav>

      <div className='greeting'>
        <h2>Hello, {name}</h2>
      </div>
      <br/>
      <input type='text' id="search_issue" placeholder='Search an issue'/> &nbsp;&nbsp;&nbsp; <button id="open_ticket">Open a ticket</button>
      <br/>
      <div id="multiple_btns">
      <button 
        className={`active_btns ${selectedButton === 'button1' ? 'selected' : ''}`}
        onClick={() => handleButtonClick('button1')}
      >
        Assigned to You
      </button>
      &nbsp;&nbsp;&nbsp;
      {/* Button 2 */}
      <button 
        className={`active_btns ${selectedButton === 'button2' ? 'selected' : ''}`}
        onClick={() => handleButtonClick('button2')}
      >
        Created by You
      </button>
      </div>
    </div>
  );
};

export default Dashboard;
