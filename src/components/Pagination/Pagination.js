import React from "react";
import { Pagination } from "react-bootstrap";

const PaginationComponent = (props) => {
  let items = [];
  for (
    let number = 1;
    number <= Math.ceil(props.totalArticles / props.articlePerPage);
    number++
  ) {
    items.push(
      <Pagination.Item key={number} onClick={() => props.paginate(number)}>
        <strong>{number}</strong>
      </Pagination.Item>
    );
  }

  const paginationBasic = (
    <div>
      <Pagination>{items}</Pagination>
      <br />
    </div>
  );
  return <div>{paginationBasic}</div>;
};

export default PaginationComponent;
