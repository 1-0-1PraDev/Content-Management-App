import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { loginAndSaveUser, setLikedStatus } = useContext(UserContext);

  const fetchLikedStatus = async(userId) => {
    await fetch(`http://localhost:4000/likedStatus/${userId}`, {
      method: 'GET',
      credentials: 'include'
    })
    .then((res) => res.json())
    .then((likedStatus) => {
      console.log('liked status ' , likedStatus); 
      setLikedStatus(likedStatus);
      setRedirect(true);
    })
    .catch(err => {
      console.log(err);
    });
  }

  const handleFormSubmit = async(e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    const userInfo = await response.json();
    fetchLikedStatus(userInfo.id);
    loginAndSaveUser(userInfo);
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <div className="container">
      <form onSubmit={handleFormSubmit}>
        <div className="inputBx">
          <label htmlFor="email">
            Email
          </label>
          <input
            type="text"
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
          <button className='btn btn-outline'>Login</button>
        </div>
      </form>
    </div>

  )
}

export default LoginPage;