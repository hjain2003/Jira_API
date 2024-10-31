import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from './logo.png' 

const Login = () => {
  const navigate = useNavigate();

  const handleError = (error) => {
    console.log(error);
  };

  const handleSuccess = (credentialResponse) => {
    console.log('success', credentialResponse);

    // Decode the JWT to extract user info
    const userInfo = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
    
    // Pass user info to dashboard
    navigate('/dashboard', { state: { email: userInfo.email, picture: userInfo.picture } });
  };

  const [user, setUser] = useState({
    email: '',
    tokenid: '',
  });

  const [btntext,setbtntxt] = useState('Login');

  const callLoading=()=>{
    setbtntxt('Loading...');
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const loginHandler = async () => {
    try {
      setbtntxt('Loading...');
      
      // Fetch user data from Jira through the proxy server
      const response = await fetch(`http://localhost:5000/api/myself?email=${user.email}&token=${user.tokenid}`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Store necessary user details
        localStorage.setItem('email', data.emailAddress);
        localStorage.setItem('displayName', data.displayName);
        localStorage.setItem('tokenid', user.tokenid); // Storing token for later use
        
        // Navigate to dashboard and pass user data as needed
        navigate('/dashboard', { state: { email: data.emailAddress, picture: data.avatarUrls['48x48'] } });
      } else {
        // If response is not OK, alert user
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setbtntxt('Login');
    }
  };
  

  return (
    <>
    <div id="com">
      DigitalXForce Ticket System
      <br/>
      <h1 id="subline" align="center">Powered by Jira</h1>
    </div>
    
    <img src={logo}/>
    <div id="login_box">
        <b>Login</b>
        <br/>
        <label>Email</label>
        <input type="email" placeholder='Enter company email' name='email' onChange={handleChange} required/>
        <br/>
        <label>Token id</label>
        <input type="password" placeholder='Enter password' name='tokenid' onChange={handleChange} required />
        <br/>
        <button id="login_btn" onClick={loginHandler}>{btntext}</button>
        <i>Forgot Token id?</i>
        <br/>
        <i>Don't have an account? <a><u>Sign Up</u></a></i>
        <br/><br/>
        <hr/>
      <GoogleOAuthProvider clientId='53931439564-qs1v7j1funrv95dh6ujghr59smt13a56.apps.googleusercontent.com'>
        <div id="gauth"><GoogleLogin onSuccess={handleSuccess} onError={handleError} /></div>
      </GoogleOAuthProvider>
    </div>
    </>
  );
};

export default Login;
