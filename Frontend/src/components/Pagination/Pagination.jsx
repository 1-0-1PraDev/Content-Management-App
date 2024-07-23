import React, { useEffect, useState } from 'react';
import './Pagination.css';

const Pagination = ({totalPages, currentPage, postPerPage, paginate}) => {
    const pageNumbers = [];
    for(let i = 1; i <= totalPages; i++){
        pageNumbers.push(i);
    }

    return (
        <>
            <ul className="pagination">
                <li>
                    <a href="#" className='btn btn-outline' onClick={() => paginate(currentPage > 1 ? currentPage - 1 : currentPage)}>Prev</a>
                </li>
                {pageNumbers.map((pageNum, ind) => (
                    <li key={ind}>
                        <a href="#" className='btn btn-primary' onClick={() => paginate(pageNum)} style={{border: currentPage === ind + 1 ? '4px solid #000' : ''}}>{pageNum}</a>
                    </li>
                ))}
                  <li>
                    <a href="#" className='btn btn-outline' onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : currentPage)}>Next</a>
                </li>
            </ul>
        </>
    )
}

export default Pagination;