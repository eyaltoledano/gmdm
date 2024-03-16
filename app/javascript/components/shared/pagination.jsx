import React from 'react'

// Pagination props come in looking like:
// {
// "total_count": 10000,
// "total_pages": 400,
// "current_page": 2,
// "next_page": 3,
// "prev_page": 1,
// "first_page": false,
// "last_page": false,
// "out_of_range": false,
// "prev_page_url": "http://localhost:3000/api/v1/collections/doodles-official?page=1",
// "next_page_url": "http://localhost:3000/api/v1/collections/doodles-official?page=3"
// }

function Pagination({ pagination, collectionSlug, onPageChange }) {
    const { total_pages, current_page, next_page, prev_page } = pagination;

    const urlForPage = (page) => `/collections/${collectionSlug}?page=${page}`;

    const pageButton = (page, text) => (
        <a href={urlForPage(page)} className="join-item btn">{text}</a>
    );

    // Calculate pages to display
    const surroundingPages = (() => {
        const pages = [];
        const startPage = Math.max(current_page - 2, 1);
        const endPage = Math.min(current_page + 2, total_pages);
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    })();

    return (
        <div className="join">
            {current_page > 1 && pageButton(1, '« First')}
            {prev_page && pageButton(prev_page, '‹ Prev')}

            {surroundingPages.map(page => (
                <a 
                  href={urlForPage(page)} 
                  className={`join-item btn ${page === current_page ? 'btn-active' : ''}`} 
                  key={page}
                >
                    {page}
                </a>
            ))}

            {next_page && pageButton(next_page, 'Next ›')}
            {current_page < total_pages && pageButton(total_pages, 'Last »')}
        </div>
    );
}

export default Pagination;
