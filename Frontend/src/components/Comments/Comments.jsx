import React, { useEffect, useState } from 'react';
import './Comments.css';

const Comments = ({postId}) => {
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);

    const fetchComments = () => {
        const response = fetch(`http://localhost:4000/posts/${postId}/comments`)
        .then((res) => res.json())
        .then((info) => {
            setComments(info);
        }).catch((err) => console.log(err));
    }

    // fetching comments
    useEffect(() => {
        fetchComments();    
    }, [postId]);
    
    const addComment = (e) => {
        e.preventDefault();

        const response = fetch('http://localhost:4000/add-comment', {
            method: 'POST',
            body: JSON.stringify({ commentText, postId }),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res.json())
        .then((info) => {
            fetchComments();
        });
    }
    
    return (
        <div className="comments">
            <form action="" onSubmit={addComment} style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="comment-text" style={{fontSize: '1.9rem'}}>Comment</label>
                <textarea 
                    name="comment-text"
                    id=""
                    cols="30"
                    rows="10"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                ></textarea>
                &nbsp;
                <button className="btn btn-primary">Comment</button>
            </form>

            <h2>Comments :</h2>
            <ul>
                {comments.map((comment) => {
                    return(
                        <li>
                            <h3>{comment.author.username}</h3>
                            <p>{comment.text}</p>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Comments;
