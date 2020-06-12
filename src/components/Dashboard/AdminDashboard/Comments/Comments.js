import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import Listing from "../Listing/Listing";
import classes from "./Comments.module.css";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import Pagination from "react-js-pagination";

class Comments extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalFlag: false,
      commentId: 0,
      activePage: 1,
      itemsCountPerPage: 1,
      totalItemsCount: 1,
      articles: [],
      isrender: false,
    };
  }

  componentDidMount() {
    this.getUserData();
  }

  getUserData = (pageNumber = 1) => {
    axios
      .get(`/article?page=${pageNumber}`)
      .then((response) => {
        this.setState({
          articles: [...response.data.articles.data],
          activePage: response.data.articles.current_page,
          itemsCountPerPage: response.data.articles.per_page,
          totalItemsCount: response.data.articles.total,
          isrender: true,
        });
      });
  };

  handleClose = () => {
    this.setState({
      modalFlag: false,
    });
  };
  handleShow = (commentId) => {
    this.setState({
      modalFlag: true,
      commentId: commentId,
    });
  };

  deleteCommentHandler = (event) => {
    event.preventDefault();
    const data = {
      id: this.state.commentId,
      isAdmin:
        localStorage.getItem("api_token").slice(0, 5) === "78357"
          ? "Yes"
          : "No",
    };
    axios
      .post("/delete-comment", data, {
        headers: { Authorization: `${localStorage.getItem("api_token")}` },
      })
      .then((response) => {
        if (response.data.code === 401 || response.data.code === 201) {
          localStorage.clear();
          this.props.history.push("/login");
        } else {
          this.setState({
            modalFlag: false,
          });
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  paginate = (pageNumber) => {
    this.setState({
      currentPage: pageNumber,
    });
  };

  render() {
    if (localStorage.getItem("api_token") === null) {
      return <Redirect to="/login" />;
    } else if (
      localStorage.getItem("api_token") !== null &&
      localStorage.getItem("api_token").slice(0, 5) === "14219"
    ) {
      return <Redirect to="/user-dashboard" />;
    }

    if (!this.state.isrender) {
      return <div className="loader">Loading...</div>;
    }

    let commentCount = 0;
    const comments = this.state.articles.map((article) => {
      return article.comments.map((commentsArray, id) => {
        commentCount += 1;
        return (
          <Listing
            key={id}
            name={article.title}
            comments={commentsArray.comments}
            isApproved={commentsArray.is_approved}
            commentId={commentsArray.id}
            handleShow={this.handleShow}
            commentFlag
          />
        );
      });
    });
    console.log(commentCount);

    return (
      <div>
        <>
          <Modal show={this.state.modalFlag} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Comment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this comment?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="danger" onClick={this.deleteCommentHandler}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </>
        <h2 style={{ textAlign: "center" }}>Comments</h2>
        <hr />
        {commentCount > 0 ? (
          <React.Fragment>
            <div className={classes.Comments}>{comments}</div>
            <br />
            <div className={classes.Pagination}>
              <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={this.state.itemsCountPerPage}
                totalItemsCount={this.state.totalItemsCount}
                pageRangeDisplayed={2}
                onChange={(pageNumber) => this.getUserData(pageNumber)}
                itemClass="page-item"
                linkClass="page-link"
                firstPageText="First"
                lastPageText="Last"
              />
            </div>
          </React.Fragment>
        ) : (
          <h2 className={classes.Empty}>No comments to display</h2>
        )}
      </div>
    );
  }
}

export default withRouter(Comments);
