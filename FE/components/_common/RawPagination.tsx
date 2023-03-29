import React, { memo } from 'react';
import ReactPaginate from 'react-paginate';

interface Props {
    forcePage: number;
    pageCount: number;
    onPageChange: (selectedItem: { selected: number }) => void;
}

// eslint-disable-next-line react/display-name
const RawPagination: React.FC<Props> = memo(({ forcePage, pageCount, onPageChange }) => {
    return (
        <ReactPaginate
            forcePage={forcePage}
            previousLabel={''}
            nextLabel={''}
            breakLabel="..."
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={onPageChange}
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item-prev"
            previousLinkClassName="page-link-prev"
            nextClassName="page-item-next"
            nextLinkClassName="page-link-next"
            activeClassName="active"
        />
    );
});

export default RawPagination;
