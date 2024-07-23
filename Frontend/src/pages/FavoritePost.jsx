import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../components/Post/Post';

const FavoritePost = () => {
    const { userId } = useParams();
    const [favPosts, setFavPosts] = useState([]);

    useEffect(() => {
        const response = fetch(`http://localhost:4000/posts/${userId}/favorite-posts`, {
            method: 'GET',
        }).then((res) => {
            if(res.status === 200){
                return res.json();
            }else{
                return null;    
            }
        }).then((info) => {
            setFavPosts(info);
        }).catch(err => {
            console.log(err);
        });
    }, []);
  return (
    <div className='favorite-container'>
        {favPosts.map((post, ind) => {
            return <Post key={ind} direction={'row'} {...post} />
        })}
    </div>
  )
}

export default FavoritePost;