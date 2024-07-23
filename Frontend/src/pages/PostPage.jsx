import React, { useContext, useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Comments from '../components/Comments/Comments';
import { UserContext } from '../Context/UserContext';
import sanitizeHtml from '../utils/sanitizeHtml';

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo, likedStatus, setLikedStatus} = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/post/${id}`, {
          method: 'GET',
          credentials: 'include'
        });
        if (response.status === 200) {
          const info = await response.json();
          setPostInfo(info);
          setLikedStatus((prevState) => ({
            ...prevState,
            [id]: info?.isLiked || false
          }));
          console.log(likedStatus)
          {console.log(userInfo.id)}
        } else {
          // Handle non-successful response (e.g., show an error message)
          console.error('Failed to fetch post data');
        }
      } catch (error) {
        // Handle any network or other errors
        console.error('An error occurred while fetching post data', error);
      }
    };

    fetchData();
  }, [id]); // Include id as a dependency to trigger the effect when id changes

  const toggleLike = async(id) => {
    const postId = id;
    const isPostLiked = likedStatus[postId];
    const likeAction = isPostLiked ? 'unlike' : 'like';

    try{
      const response = await fetch(`http://localhost:4000/posts/${postId}/${likeAction}`, {
        method: 'POST',
        body: JSON.stringify({ userId: userInfo.id }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });   

      if(response.status === 200){
        const data = await response.json();
        setLikedStatus((prevState) => ({
          ...prevState,
          [postId]: likeAction === 'like'
        }));
      }
    }catch(err){
      console.log(err);
    }
  }
  
  const handleDeletePost = async(postId) => {
    try{
      if(window.confirm('Do you delete this post?')){
        const response = await fetch(`http://localhost:4000/post/${postId}`, {
          method: 'DELETE'
        });
  
        if(response.ok){
          setRedirect(true);
        }
      } 
      

    }catch(err){
      console.log(err);
    }
  }

  if(redirect){
    return <Navigate to='/' />
  }

  return (
    <div className="main-post" style={{ flexDirection: 'column', padding: 'var(--common-padding)', boxShadow: 'none' }}>
      <div className="topHeader">
        <div>
          {postInfo?.author?._id === userInfo?.id && <Link to={`/edit/${id}`} className="btn btn-primary">Edit Post</Link>} &nbsp;&nbsp;
          {postInfo?.author?._id === userInfo?.id && <Link onClick={() => handleDeletePost(id)} className="btn btn-primary">Delete Post</Link>}
        </div>
        <div className="likeBx" style={{cursor: 'pointer', fontSize: '2.3rem'}}>
          <i className={`fa-solid fa-heart${likedStatus[id] ? ' active' : ''}`} onClick={() => toggleLike(id)}></i>
        </div>
      </div>

      <div className="leftBx" style={{flex: '0 0 50rem'}}>
        <div className="imgBx" >
          <img src={`http://localhost:4000/${postInfo?.cover}`} style={{objectFit: 'cover'}} alt="" />
        </div>
       
      </div>
      <div className="rightBx">
        <a href="" className="category">{postInfo?.category}</a>
        <h3 className="title-text">
          {postInfo?.title}
        </h3>
        <p className="desc-text" dangerouslySetInnerHTML={sanitizeHtml(postInfo?.content)}></p>
        <p>{postInfo?.summary}</p>
        <div className="userBx">
          <div className="avatarBx">
            P
          </div>
          <div className="userInfo">
            <h4>{postInfo?.author?.username}</h4>
            <span>Jan 25, 2023</span>
          </div>
        </div>
      </div>

      <Comments postId={id} />
    </div>
  )
}

export default PostPage;