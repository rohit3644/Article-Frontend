import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import Listing from "./Listing/Listing";
import classes from "./AdminDashboard.module.css";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import Pagination from "react-js-pagination";
import AuthAxios from "../../Auth/Auth";
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
    };
  }

  componentDidMount() {
    this.getUserData();
  }

  getUserData = (pageNumber = 1) => {
    axios
      .get(`http://127.0.0.1:8000/api/article?page=${pageNumber}`)
      .then((response) => {
        console.log(response.data);
        this.setState({
          articles: [...response.data.articles.data],
          activePage: response.data.articles.current_page,
          itemsCountPerPage: response.data.articles.per_page,
          totalItemsCount: response.data.articles.total,
        });
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

  deleteArticleHandler = (event) => {
    event.preventDefault();
    const data = {
      id: this.state.articleId,
    };
    AuthAxios.post("/delete-article", data)
      .then((response) => {
        console.log(response.data);
        if (response.data.code === 401) {
          window.alert("You are not allowed to delete this");
        }
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
    // restricting access
    if (localStorage.getItem("api_token") === null) {
      return <Redirect to="/login" />;
    } else if (
      localStorage.getItem("api_token") !== null &&
      localStorage.getItem("api_token").slice(0, 5) === "14219"
    ) {
      return <Redirect to="/user-dashboard" />;
    }
    console.log(this.state.articles);

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
      </div>
    );
  }
}

export default withRouter(AdminDashboard);
