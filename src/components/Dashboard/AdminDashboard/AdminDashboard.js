import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import Listing from "./Listing/Listing";
import classes from "./AdminDashboard.module.css";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

class AdminDashboard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalFlag: false,
      articleId: 0,
    };
  }

  handleClose = () => {
    this.setState({
      modalFlag: false,
    });
  };
  handleShow = (articleId) => {
    this.setState({
      modalFlag: true,
      articleId: articleId,
    });
  };

  deleteArticleHandler = (event) => {
    event.preventDefault();
    const data = {
      id: this.state.articleId,
    };
    axios
      .post("http://127.0.0.1:8000/api/delete-article", data)
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
    const articles = this.props.articles.map((article, id) => {
      let categories = [];
      article.category.map((categoryArray) => {
        return categories.push(categoryArray.category);
      });

      return (
        <Listing
          key={id}
          name={article.title}
          categories={categories.join(", ")}
          isApproved={article.is_approved}
          articleId={article.id}
          handleShow={this.handleShow}
        />
      );
    });

    return (
      <div>
        <>
          <Modal show={this.state.modalFlag} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Delete article</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this article?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="danger" onClick={this.deleteArticleHandler}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </>
        <h2 style={{ textAlign: "center" }}>Articles</h2>
        <hr />
        <div className={classes.Article}>{articles}</div>
      </div>
    );
  }
}

export default withRouter(AdminDashboard);
