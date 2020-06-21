import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import Listing from "../Listing/Listing";
import classes from "./Comments.module.css";
import axios from "axios";
import pagination from "../../../Pagination/Pagination";
import modal from "../../../Modal/Modal";

// this class is used to display all the article comments
// and approve, delete and edit the comments
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

  // get all the articles
  componentDidMount() {
    this.getUserData();
  }

  // paginated data
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

  // modal close
  handleClose = () => {
    this.setState({
      modalFlag: false,
    });
  };
  // modal open
  handleShow = (commentId) => {
    this.setState({
      modalFlag: true,
      commentId: commentId,
    });
  };

  // delete comment handler
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
        if (response.data.code === 401) {
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

    // css loader
    if (!this.state.isrender) {
      return <div className="loader">Loading...</div>;
    }

    let commentCount = 0;
    // passing comment props to listing component
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
      delete: this.deleteCommentHandler,
    };
    let modalComponent = modal(modalData);

    return (
      <div>
        {modalComponent}
        <h2 style={{ textAlign: "center" }}>Comments</h2>
        <hr />
        {commentCount > 0 ? (
          <React.Fragment>
            <div className={classes.Comments}>{comments}</div>
            <br />
            <div className={classes.Pagination}>{paginationComponent}</div>
          </React.Fragment>
        ) : (
          <h2 className={classes.Empty}>No comments to display</h2>
        )}
      </div>
    );
  }
}

export default withRouter(Comments);
