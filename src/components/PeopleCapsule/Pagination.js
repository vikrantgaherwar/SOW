import React, { useEffect, useState } from "react";
// import Pagination from "react-bootstrap/Pagination";
import Pagination from "react-js-pagination";

const PaginationComponent = ({
  total = 0,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
}) => {
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (total > 0 && itemsPerPage > 0)
      setTotalPages(Math.ceil(total / itemsPerPage));
  }, [total, itemsPerPage]);

  if (totalPages === 0) return null;

  return (
    <Pagination
      prevPageText="<"
      nextPageText=">"
      firstPageText="<<"
      lastPageText=">>"
      pageRangeDisplayed={5}
      activePage={currentPage}
      itemsCountPerPage={10}
      totalItemsCount={total}
      onChange={onPageChange}
    />
  );
};

export default PaginationComponent;
