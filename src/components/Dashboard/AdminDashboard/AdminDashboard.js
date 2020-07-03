import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import Listing from "./Listing/Listing";
import classes from "./AdminDashboard.module.css";
import axios from "axios";
import pagination from "../../Pagination/Pagination";
import modal from "../../Modal/Modal";
import logout from '../../LogOut/LogOut';
// this class is used to display all the articles on the admin
// screen and also implements the features to approve, delete and
// edit articles

class AdminDashboard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalFlag: false,
      articleId: 0,
      activePage: 1,
      itemsCountPerPage: 1,
      totalItemsCount: 1,
      articles: [],
      isrender: false,
    };
  }

  // get all the data from backend
  componentDidMount() {
    this.getUserData();
  }

  // pagination from the backend
  getUserData = (pageNumber = 1) => {
    axios.get(`/article?page=${pageNumber}`).then((response) => {
      if (response.data.code === 200) {
        this.setState({
          articles: [...response.data.info.articles.data],
          activePage: response.data.info.articles.current_page,
          itemsCountPerPage: response.data.info.articles.per_page,
          totalItemsCount: response.data.info.articles.total,
          isrender: true,
        });
      } else {
        window.alert(response.data.message);
      }
    });
  };

  //modal close
  handleClose = () => {
    this.setState({
      modalFlag: false,
    });
  };
  //modal show
  handleShow = (articleId) => {
    this.setState({
      modalFlag: true,
      articleId: articleId,
    });
  };

  // when delete button in clicked
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
          window.alert(response.data.message);
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
    // restricting access
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

    const articles = this.state.articles.map((article, id) => {
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
        {/* modal component  */}
        {modalComponent}
        <h2 style={{ textAlign: "center" }}>Articles</h2>
        <hr />
        {articles.length > 0 ? (
          <React.Fragment>
            <div className={classes.Article}>{articles}</div>
            <br />
            <div className={classes.Pagination}>
              {/* pagination  */}
              {paginationComponent}
            </div>
          </React.Fragment>
        ) : (
          <h2 className={classes.Empty}>No articles to display</h2>
        )}
      </div>
    );
  }
}

export default withRouter(AdminDashboard);
