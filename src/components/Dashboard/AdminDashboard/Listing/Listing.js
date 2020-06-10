import React from "react";
import classes from "./Listing.module.css";
import { Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import { withRouter } from "react-router-dom";
class Listing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editComment: false,
      newComment: "",
    };
  }

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
      .post("http://127.0.0.1:8000/api/edit-comment", data)
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  changeHandler = (event) => {
    this.setState({
      newComment: event.target.value,
    });
  };

  editCommentHandler = () => {
    this.setState({
      editComment: true,
    });
  };

  editArticleHandler = () => {
    localStorage.setItem("update", 1);
    localStorage.setItem("articleId", this.props.articleId);
    this.props.history.push("/write-article");
  };

  approveArticleHandler = () => {
    const data = {
      id: this.props.articleId,
      isAdmin:
        localStorage.getItem("api_token").slice(0, 5) === "78357"
          ? "Yes"
          : "No",
    };
    axios
      .post("http://127.0.0.1:8000/api/approve-article", data)
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
  approveCommentHandler = () => {
    const data = {
      id: this.props.commentId,
      isAdmin:
        localStorage.getItem("api_token").slice(0, 5) === "78357"
          ? "Yes"
          : "No",
    };
    axios
      .post("http://127.0.0.1:8000/api/approve-comment", data)
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
  render() {
    const readMoreLink =
      "/" + this.props.name.split(" ").join("-").toLowerCase();

    let cardText = this.props.commentFlag
      ? this.props.comments
      : this.props.categories;
    return (
      <Card className={classes.Style}>
        <Card.Body>
          <Card.Title>
            <a href={readMoreLink}>{this.props.name}</a>
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
