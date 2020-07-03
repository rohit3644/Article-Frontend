import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import Article from "../../Articles/Article/Article";
import classes from "./UserDashboard.module.css";
import axios from "axios";
import pagination from "../../Pagination/Pagination";
import modal from "../../Modal/Modal";
import logout from "../../LogOut/LogOut";
// this class is used to display all the user articles
// and also provides the functionality to edit, delete and read the article

class UserDashboard extends React.Component {
  constructor(props) {
    super(props);
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

  // get the data from backend
  componentDidMount() {
    // restricting access
    if (localStorage.getItem("api_token") === null) {
      return <Redirect to="/login" />;
    } else if (
      localStorage.getItem("api_token") !== null &&
      localStorage.getItem("api_token").slice(0, 5) === "78357"
    ) {
      return <Redirect to="/admin-dashboard" />;
    }
    this.getUserData();
  }

  // paginated data
  getUserData = (pageNumber = 1) => {
    let data = {
      isAdmin:
        localStorage.getItem("api_token").slice(0, 5) === "78357"
          ? "Yes"
          : "No",
      id: parseInt(localStorage.getItem("api_token").slice(65)),
    };
    axios
      .post(`/user-article?page=${pageNumber}`, data, {
        headers: { Authorization: `${localStorage.getItem("api_token")}` },
      })
      .then((response) => {
        if (response.data.code === 401) {
          logout();
          localStorage.clear();
          this.props.history.push("/login");
        } else if (response.data.code === 500) {
          window.alert(response.data.message);
        } else {
          this.setState({
            userArticles: [...response.data.info.data],
            activePage: response.data.info.current_page,
            itemsCountPerPage: response.data.info.per_page,
            totalItemsCount: response.data.info.total,
            isrender: true,
          });
        }
      })
      .catch((error) => {
        window.alert(error.response.data.message);
      });
  };

  // modal close
  handleClose = () => {
    this.setState({
      modalFlag: false,
    });
  };
  // modal show
  handleShow = (articleId) => {
    this.setState({
      modalFlag: true,
      articleId: articleId,
    });
  };
  // delete article function
  deleteArticleHandler = (event) => {
    event.preventDefault();
    const data = {
      id: this.state.articleId,
    };
    axios
      .post("/delete-article", data, {
        headers: { Authorization: `${localStorage.getItem("api_token")}` },
      })
      .then((response) => {
        if (response.data.code === 401) {
          logout();
          localStorage.clear();
          this.props.history.push("/login");
        } else if (response.data.code === 500) {
          window.alert("Internal Server Error");
        } else {
          this.setState({
            modalFlag: false,
          });
          window.location.reload();
        }
      })
      .catch((error) => {
        window.alert(error.response.data.message);
      });
  };

  render() {
    // css loader
    if (!this.state.isrender) {
      return <div className="loader">Loading...</div>;
    }

    // filtering the user articles
    const articles = this.state.userArticles.map((article) => {
      if (
        article.user_id ===
        parseInt(localStorage.getItem("api_token").slice(65))
      ) {
        return article;
      }
      return null;
    });

    // removing null values
    const filteredArticle = articles.filter((el) => {
      return el != null;
    });

    // getting comments count of approved articles
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

    const data = {
      activePage: this.state.activePage,
      itemsCountPerPage: this.state.itemsCountPerPage,
      totalItemsCount: this.state.totalItemsCount,
      onChange: (pageNumber) => this.getUserData(pageNumber),
    };
    let paginationComponent = pagination(data);

    const modalData = {
      modalFlag: this.state.modalFlag,
      handleClose: this.handleClose,
      delete: this.deleteArticleHandler,
    };
    let modalComponent = modal(modalData);

    return (
      <div>
        {modalComponent}
        <h3 className={classes.ArticleStyle}>My Articles</h3>
        <hr />
        {filteredArticle.length > 0 ? (
          <React.Fragment>
            <div className={classes.Articles}>{userArticles}</div>
            <br />
            <div className={classes.Pagination}>{paginationComponent}</div>
          </React.Fragment>
        ) : (
          <h2 className={classes.Empty}>No articles to display</h2>
        )}
      </div>
    );
  }
}

export default withRouter(UserDashboard);
