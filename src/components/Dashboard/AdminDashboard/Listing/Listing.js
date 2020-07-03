import React from "react";
import classes from "./Listing.module.css";
import { Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import { withRouter, Link } from "react-router-dom";
import logout from "../../../LogOut/LogOut";
// this class is used for all the functionalities like approve, delete, edit
// comments and articles on the admin screen
class Listing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editComment: false,
      newComment: "",
    };
  }

  // on submit of new comments edit comment
  submitHandler = (event) => {
    event.preventDefault();
    if (this.state.newComment.lenght <= 0) {
      return;
    }
    const data = {
      newComment: this.state.newComment,
      id: this.props.commentId,
      isAdmin:
        localStorage.getItem("api_token").slice(0, 5) === "78357"
          ? "Yes"
          : "No",
    };
    axios
      .post("/edit-comment", data, {
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
          window.location.reload();
        }
      })
      .catch((error) => {
        window.alert(error.response.data.message);
      });
  };

  // on change handler
  changeHandler = (event) => {
    this.setState({
      newComment: event.target.value,
    });
  };

  // display the edit option
  editCommentHandler = () => {
    this.setState({
      editComment: true,
    });
  };

  // redirect to the write article page with all the data pre-fetched
  editArticleHandler = () => {
    localStorage.setItem("update", 1);
    localStorage.setItem("articleId", this.props.articleId);
    this.props.history.push("/write-article");
  };

  // approve article
  approveArticleHandler = () => {
    const data = {
      id: this.props.articleId,
      isAdmin:
        localStorage.getItem("api_token").slice(0, 5) === "78357"
          ? "Yes"
          : "No",
    };
    axios
      .post("/approve-article", data, {
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
          window.location.reload();
        }
      })
      .catch((error) => {
        window.alert(error.response.data.message);
      });
  };

  // approve comments
  approveCommentHandler = () => {
    const data = {
      id: this.props.commentId,
      isAdmin:
        localStorage.getItem("api_token").slice(0, 5) === "78357"
          ? "Yes"
          : "No",
    };
    axios
      .post("/approve-comment", data, {
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
          window.location.reload();
        }
      })
      .catch((error) => {
        window.alert(error.response.data.message);
      });
  };
  render() {
    // making a link from article name
    const readMoreLink =
      "/" + this.props.name.split(" ").join("-").toLowerCase();

    let cardText = this.props.commentFlag
      ? this.props.comments
      : this.props.categories;
    return (
      <Card className={classes.Style}>
        <Card.Body>
          <Card.Title>
            <Link to={readMoreLink}>{this.props.name}</Link>
          </Card.Title>
          <Card.Text>{cardText}</Card.Text>
          {this.state.editComment ? (
            <React.Fragment>
              <Form.Group controlId="formBasicComment">
                <Form.Control
                  type="text"
                  placeholder="New Comment"
                  onChange={this.changeHandler}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                onClick={this.submitHandler}
              >
                Submit
              </Button>
              <br />
              <br />
            </React.Fragment>
          ) : null}
          <Card.Text>
            {this.props.isApproved === "Yes" ? (
              <Button variant="success" disabled>
                Approved
              </Button>
            ) : (
              <Button
                variant="info"
                onClick={
                  this.props.commentFlag
                    ? this.approveCommentHandler
                    : this.approveArticleHandler
                }
              >
                Approve
              </Button>
            )}
          </Card.Text>
          <div className={classes.EditDelete}>
            <Button
              variant="warning"
              onClick={
                this.props.commentFlag
                  ? this.editCommentHandler
                  : this.editArticleHandler
              }
            >
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                this.props.handleShow(
                  this.props.commentFlag
                    ? this.props.commentId
                    : this.props.articleId
                )
              }
            >
              Delete
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }
}
export default withRouter(Listing);
