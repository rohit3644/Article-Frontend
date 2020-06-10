import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import Article from "../../Articles/Article/Article";
import classes from "./UserDashboard.module.css";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import Pagination from "react-js-pagination";

class UserDashboard extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.location.pathname);
    this.state = {
      modalFlag: false,
      articleId: 0,
      userArticles: [],
      activePage: 1,
      itemsCountPerPage: 1,
      totalItemsCount: 1,
      isrender: false,
    };
  }

  componentDidMount() {
    this.getUserData();
  }

  getUserData = (pageNumber = 1) => {
    axios
      .post(`http://127.0.0.1:8000/api/user-article?page=${pageNumber}`, {
        isAdmin:
          localStorage.getItem("api_token").slice(0, 5) === "78357"
            ? "Yes"
            : "No",
        id: parseInt(localStorage.getItem("api_token").slice(65)),
      })
      .then((response) => {
        console.log(response.data);
        this.setState({
          userArticles: [...response.data.articles.data],
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
    if (!this.state.isrender) {
      return <div className="loader">Loading...</div>;
    }

    if (localStorage.getItem("api_token") === null) {
      return <Redirect to="/login" />;
    } else if (
      localStorage.getItem("api_token") !== null &&
      localStorage.getItem("api_token").slice(0, 5) === "78357"
    ) {
      return <Redirect to="/admin-dashboard" />;
    }
    console.log(this.props.articles);
    const articles = this.state.userArticles.map((article) => {
      if (
        article.user_id ===
        parseInt(localStorage.getItem("api_token").slice(65))
      ) {
        return article;
      }
      return null;
    });
    const filteredArticle = articles.filter((el) => {
      return el != null;
    });

    console.log(filteredArticle);

    const userArticles = filteredArticle.map((article, id) => {
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
          <h2 className={classes.Empty}>No articles to display</h2>
        )}
      </div>
    );
  }
}

export default withRouter(UserDashboard);
