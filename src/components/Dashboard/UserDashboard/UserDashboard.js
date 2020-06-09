import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import Article from "../../Articles/Article/Article";
import classes from "./UserDashboard.module.css";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import PaginationComponent from "../../Pagination/Pagination";

class UserDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalFlag: false,
      articleId: 0,
      currentPage: 1,
      articlePerPage: 6,
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
      localStorage.getItem("is_admin") === "Yes"
    ) {
      return <Redirect to="/admin-dashboard" />;
    }
    console.log(this.props.articles);
    const articles = this.props.articles.map((article) => {
      if (article.user_id === parseInt(localStorage.getItem("user_id"))) {
        return article;
      }
      return null;
    });
    const filteredArticle = articles.filter((el) => {
      return el != null;
    });

    const indexOfLastArticle =
      this.state.currentPage * this.state.articlePerPage;
    const indexOfFirstArticle = indexOfLastArticle - this.state.articlePerPage;
    const currentArticles = filteredArticle.slice(
      indexOfFirstArticle,
      indexOfLastArticle
    );

    const userArticles = currentArticles.map((article, id) => {
      let commentCount = 0;
      article.comments.map((comments) => {
        if (comments.is_approved === "Yes") {
          return (commentCount += 1);
        }
        return null;
      });
      return (
        <Article
          key={id}
          title={article.title}
          imageName={article.image_name}
          author={article.author_name}
          readMore={this.props.readMore}
          commentsCount={commentCount}
          editDelete
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
        <h3 className={classes.ArticleStyle}>My Articles</h3>
        <hr />
        {filteredArticle.length > 0 ? (
          <React.Fragment>
            <div className={classes.Articles}>{userArticles}</div>
            <br />
            <div className={classes.Pagination}>
              <PaginationComponent
                totalArticles={filteredArticle.length}
                articlePerPage={this.state.articlePerPage}
                paginate={this.paginate}
              />
            </div>
          </React.Fragment>
        ) : (
          <h2 className={classes.Empty}>No articles to display</h2>
        )}
      </div>
    );
  }
}

export default withRouter(UserDashboard);
