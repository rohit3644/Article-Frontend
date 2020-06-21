import React from "react";
import Pagination from "react-js-pagination";

const pagination = (data) => {
  const pagination = (
    <Pagination
      activePage={data.activePage}
      itemsCountPerPage={data.itemsCountPerPage}
      totalItemsCount={data.totalItemsCount}
      pageRangeDisplayed={2}
      onChange={data.onChange}
      itemClass="page-item"
      linkClass="page-link"
      firstPageText="First"
      lastPageText="Last"
    />
  );
  return pagination;
};

export default pagination;
