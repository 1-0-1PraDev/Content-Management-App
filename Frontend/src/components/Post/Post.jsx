import React from 'react';
import { Link } from 'react-router-dom';
import sanitizeHtml from '../../utils/sanitizeHtml';
import { truncateText } from '../../utils/truncateText';
import './Post.css';

const Post = ({_id, direction, title, category, content, author , cover, summary}) => {
    return (
        <div className="main-post" style={{ flexDirection: direction }}>
            <div className="leftBx">
                <div className="imgBx">
                    <Link to={`post/${_id}`}>
                        <img src={`http://localhost:4000/${cover}`} alt="" />
                    </Link>
                </div>
            </div>
            <div className="rightBx">
                <a href="" className="category">{category}</a>
                <Link to={`/post/${_id}`}>
                    <h3 className="title-text">
                        {truncateText(title, 50, "")}
                    </h3>
                </Link>
                <p className="desc-text" dangerouslySetInnerHTML={sanitizeHtml(truncateText(content, 200, "..."))}></p>
                <p>{summary}</p>
                <div className="userBx">
                    <div className="avatarBx">
                        P
                    </div>
                    <div className="userInfo">
                        <h4>{author?.username}</h4>
                        <span>Jan 25, 2023</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post;