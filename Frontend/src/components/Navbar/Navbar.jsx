import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './Navbar.css';
import { UserContext } from '../../Context/UserContext';

const Navbar = () => {
    const { userInfo, setUserInfo, logoutAndRemoveUser } = useContext(UserContext);
    
    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include'
        }).then(res => {
            if(res.status === 200){
                // if user is authenticated
                return res.json();
            }else{
                // if user is not authenticated
                return null;
            }
        }).then((info) => {
            setUserInfo(info);
        })
        .catch(err => {
            console.log(err);
        })
    }, []);

    const logoutUser = async() => {
        const response = await fetch('http://localhost:4000/logout', {
            method: 'POST',
            credentials: 'include'
        });
        console.log(response)
        if(response.status === 200){
            logoutAndRemoveUser();
        }
    }
  
    return (
        <div className="header">
            <div className="logoBx">
                <Link to='/'>
                    <h1>MyBlog</h1>
                </Link>
            </div>
            <div className="navigation">
                <ul>
                    <li>
                        <a href="">Services</a>
                    </li>
                    {userInfo && 
                        <li>
                            <Link to={`posts/${userInfo.id}/favorite-posts`}>Favorite Posts</Link>
                        </li>
                    }
                    <li>
                        <a href="">About Us</a>
                    </li>
                </ul>
            </div>
            <div className="btnBx">
               {!userInfo?.email ? (
                    <>
                        <Link to='/register'>
                            <button className="btn btn-primary">Register</button>
                        </Link>
                        <Link to='/login'>
                            <button className="btn btn-primary">Login</button>
                        </Link>
                    </>

                ) : (
                    <>
                        <Link to='/create'>
                            <button className="btn btn-primary">Create Post</button>
                        </Link>
                        <button className="btn btn-primary" onClick={logoutUser}>
                            Logout
                        </button>
                    </>
                )}

            </div>
        </div>
    )
}

export default Navbar;