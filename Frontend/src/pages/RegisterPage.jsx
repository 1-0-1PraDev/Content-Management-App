import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);

  const handleFormSubmit = async(e) => {
    e.preventDefault();

    // Fetch request to server to register the user
    const response = await fetch('http://localhost:4000/register', {
      method: 'POST',
      body: JSON.stringify({username, email, password}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
      
    if(response.status === 200){
      setRedirect(true);
    }
    
  }

  if(redirect){
    return <Navigate to='/login' />
  }

  return (
    <div className="container">
      <form onSubmit={handleFormSubmit}>
          <div className="inputBx">
            <label htmlFor="username">
              Username
            </label>
            <input 
              type="text"
              placeholder='Enter Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="inputBx">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              required 
              placeholder='Enter Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}  
            />
          </div>
          <div className="inputBx">
            <label htmlFor="password">
              Password
            </label>
            <input 
              type="password" 
              placeholder='Enter Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}  
            />
          </div>
          <div>
            <button className='btn btn-outline'>Register</button>

          </div>
      </form>
    </div>
  )
}

export default RegisterPage;