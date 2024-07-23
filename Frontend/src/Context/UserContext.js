import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});
 
export const UserContextProvider = ({children}) => {
    const [userInfo, setUserInfo] = useState(null);
    const [likedStatus, setLikedStatus] = useState([]);  

    useEffect(() => {
        // Set the data initially
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || null);    
        if(storedUserInfo){
            setUserInfo(storedUserInfo);
            // console.log(localStorage.getItem('likedStatus') === 'undefined' ? 'fdfsdf' : '')
            const storedLikedStatus = localStorage.getItem('likedStatus') !== 'undefined'
            ? JSON.parse(localStorage.getItem('likedStatus'))
            : {};
            if(storedLikedStatus){
                setLikedStatus(storedLikedStatus);
            }else{
                setLikedStatus({});
            }
        }
    }, []);
    
    const logoutAndRemoveUser = () => {
        setUserInfo(null);
        setLikedStatus({});
        localStorage.removeItem('userInfo');
        localStorage.removeItem('likedStatus');
    } 

    const loginAndSaveUser = (userData) => {
        setUserInfo(userData);
        setLikedStatus({});
        localStorage.setItem('userInfo', JSON.stringify(userData));
    }

    const updateUserLikedStatus = (newLikedStatus) => {
        setLikedStatus(newLikedStatus);
        localStorage.setItem('likedStatus', JSON.stringify(newLikedStatus));
    }

    return(
        <UserContext.Provider value={{
                userInfo,
                setUserInfo,
                loginAndSaveUser,
                logoutAndRemoveUser,
                likedStatus,
                setLikedStatus: updateUserLikedStatus
            }}>
            {children}
        </UserContext.Provider>
    )
}   
