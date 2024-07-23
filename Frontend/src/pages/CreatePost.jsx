import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const categoriesList = ["science", "technology", "history", "trending", "Health", "Fitness"];

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [category, setCategory] = useState(categoriesList[0]);
    const [redirect, setRedirect] = useState(false);

    const handleFormSubmit = async(e) => {
        e.preventDefault();

        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('category', category);
        data.set('file', files[0]);
        console.log(data)

        const response = await fetch('http://localhost:4000/create', {
            method: 'POST',
            body: data,
            credentials: 'include',
        });

        if(response.status === 200){
            setRedirect(true);
        }
    }

    if(redirect){
        return <Navigate to='/' />
    }

    return (
        <div className="create-post-container" >
            <form onSubmit={handleFormSubmit}>
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
                <button className='btn btn-primary'>Create Post</button>
            </form>
        </div>
    )
}

export default CreatePost;