import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import Listing from "../Listing/Listing";
import classes from "./Comments.module.css";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import PaginationComponent from "../../../Pagination/Pagination";

class Comments extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalFlag: false,
      commentId: 0,
      currentPage: 1,
      articlePerPage: 3,
    };
  }

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
    };
    axios
      .post("http://127.0.0.1:8000/api/delete-comment", data)
      .then((response) => {
        console.log(response.data);
        this.setState({
          modalFlag: false,
        });
        window.location.reload();
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
      localStorage.getItem("is_admin") === "No"
    ) {
      return <Redirect to="/user-dashboard" />;
    }
    console.log(this.props.articles);

    const indexOfLastArticle =
      this.state.currentPage * this.state.articlePerPage;
    const indexOfFirstArticle = indexOfLastArticle - this.state.articlePerPage;
    const currentArticles = this.props.articles.slice(
      indexOfFirstArticle,
      indexOfLastArticle
    );

    const comments = currentArticles.map((article) => {
      return article.comments.map((commentsArray, id) => {
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
        <div className={classes.Comments}>{comments}</div>
        <br />
        <div className={classes.Pagination}>
          <PaginationComponent
            totalArticles={this.props.articles.length}
            articlePerPage={this.state.articlePerPage}
            paginate={this.paginate}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(Comments);
