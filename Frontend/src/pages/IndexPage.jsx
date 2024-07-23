import React, { useEffect, useState } from 'react';
import Post from '../components/Post/Post';
import Pagination from '../components/Pagination/Pagination';

const categoriesList = ["science", "technology", "history", "trending", "Health", "Fitness"];

const IndexPage = () => {
    const [posts, setPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [postPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    
    useEffect(() => {
        const fetchTotalPageCount = async() => {
            const response = await fetch(`http://localhost:4000/posts/totalCount`)
            const data = await response.json();
            const { totalPosts } = data;
            setTotalPosts(totalPosts);
            setTotalPages(Math.ceil(totalPosts / postPerPage));
        }   
        fetchTotalPageCount();
    }, [postPerPage]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 200);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery])

    useEffect(() => {
        if(totalPages !== 0){
            const fetchPosts = async () => {
                let url = '';
                if(searchQuery){
                    url = `http://localhost:4000/posts/search?search=${searchQuery}`;
                }else{
                    url =
                    selectedCategory === 'All' ?
                        `http://localhost:4000/posts?page=${currentPage}&limit=${postPerPage}`
                        : `http://localhost:4000/posts?category=${selectedCategory}&page=${currentPage}&limit=${totalPosts}`;
        
                }
                const response = await fetch(url);  
                const data = await response.json();
                setPosts(data);
            }

            if(selectedCategory !== 'All'){
                setCurrentPage(1);
            }

            fetchPosts();
        }
    }, [selectedCategory, currentPage, postPerPage, totalPages, debouncedSearch]);

    const paginate = (pageNum) => {
        setCurrentPage(pageNum);
    }

    const handlePostSearch = (e) => {
        setSearchQuery(e.target.value); 
        console.log(searchQuery)
    }

    const handleSelectCategory = (category) => {
        if(selectedCategory){
            setSearchQuery('');
        }
        setSelectedCategory(category);
    }

    return (
        <div className='main-container'>
            <div className="searchBx">
                <div className='search'>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder='Search...' value={searchQuery} onChange={(e) => handlePostSearch(e)} />
                </div>

            </div>

            <div className="categoryBx">
                <ul>
                    <li>
                        <a onClick={() => handleSelectCategory('All')}>All</a>
                    </li>
                    {categoriesList.map((category, ind) => (
                        <li key={ind}>
                            <a onClick={() => handleSelectCategory(category)}>{category}</a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Post */}
            {/* <Post direction={'row'} {...posts[0]} /> */}

            {/* Posts */}
            <div className="post-container">
                {/* <Post direction={'column'} />
                <Post direction={'column'} />
                <Post direction={'column'} />
                <Post direction={'column'} />
                <Post direction={'column'} />
                <Post direction={'column'} />
                <Post direction={'column'} />
                <Post direction={'column'} /> */}
                {posts.map((post, ind) => (
                    <Post key={ind} direction={'column'} {...post} />
                ))}
            </div>

            {/* Pagination  */}
            {selectedCategory === 'All' && (
                <Pagination 
                    totalPages={totalPages}
                    currentPage={currentPage}
                    postPerPage={postPerPage}
                    paginate={paginate}
                />
            )}  
            
        </div>
    )
}

export default IndexPage;