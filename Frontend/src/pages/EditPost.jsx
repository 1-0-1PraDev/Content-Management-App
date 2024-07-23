import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const categoriesList = ["science", "technology", "history", "trending", "Health", "Fitness"];

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

  // fetch the post data through id
  useEffect(() => {
    const response = fetch(`http://localhost:4000/edit/${id}`, {
      method: 'POST'
    }).then((res) => res.json())
    .then(info => { 
      console.log(info)
      setTitle(info.title);
      setSummary(info.summary);
      setCategory(info.category);
      setContent(info.content);
    });
  }, []);

  const handleUpdatePost = async(e) => {
    e.preventDefault();

    const data = new FormData();
    data.set('id', id);
    data.set('title', title);
    data.set('summary', summary);
    data.set('category', category);
    data.set('content', content);
    data.set('file', files[0]);

    const response = await fetch(`http://localhost:4000/post`,{
      method: 'PUT',
      body: data,
      credentials: 'include'
    });

    if(response.status === 200){
      setRedirect(true);
    }
  }

  if(redirect){
    return <Navigate to={`/post/${id}`} />
  }

  return (
        <div className="edit-post-container">
            <form onSubmit={handleUpdatePost}>
                <div className="inputBx">
                    <label htmlFor="Title">Title</label>
                    <input 
                        type="text"
                        placeholder="Enter Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="inputBx">
                    <label htmlFor="summary">Summary</label>
                    <input 
                        type="text"
                        placeholder="Enter Summary"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}    
                    />
                </div>
                <div className="inputBx">
                    <select 
                        onChange={(e) => setCategory(e.target.value)}
                        value={category}
                        name="category" 
                        id="category"
                    >
                        {categoriesList.map((category, ind) => (
                            <option 
                                key={ind}
                                value={category}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                        ))}                        
                    </select>
                </div>
                <div className="inputBx">
                    <label htmlFor="image">Upload Image</label>
                    <input 
                        type="file"
                        onChange={(e) => setFiles(e.target.files)}
                        name='coverImg'
                     />
                </div>
                <ReactQuill value={content} onChange={setContent} />
                <button className='btn btn-primary'>Update Post</button>
            </form>
        </div>
  )
}

export default EditPost;