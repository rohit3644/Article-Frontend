import React from "react";
import { Container, Button, Form } from "react-bootstrap";
import classes from "./ReadMore.module.css";
import axios from "axios";
import Comments from "./Comments/Comments";
import parse from "html-react-parser";

class ReadMore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      article: null,
      isrender: false,
      category: null,
      categories: "",
      addComment: false,
      comment: "",
      commentMsg: "",
      commentUpdate: false,
      commentSuccess: false,
      commentsArray: [],
      newCommentUser: "",
    };
  }

  componentDidMount() {
    const data = {
      article: this.props.article,
    };
    axios.post("/read-more", data).then((response) => {
      if (response.data === -1) {
        this.setState({ isrender: true, article: {} });
      } else if (response.data.code === 500) {
        window.alert(response.data.message);
      } else {
        let category = [];
        response.data.info.category.map((ele) => {
          return category.push(ele.category);
        });

        let str = category.join(", ");
        this.setState({
          isrender: true,
          category: str,
          article: response.data.info,
          commentsArray: response.data.info.comments,
        });
      }
    });
  }

  commentHandler = () => {
    this.setState({
      addComment: true,
    });
  };

  commentSubmitHandler = (event) => {
    event.preventDefault();
    if (this.state.comment.length === 0) {
      this.setState({
        commentMsg: "Comment cannot be empty",
        commentSuccess: false,
        commentUpdate: true,
      });
      return;
    }
    let is_approved = "";
    let user_id = -100;
    if (localStorage.getItem("api_token") === null) {
      is_approved = "No";
    } else {
      is_approved = "Yes";
      user_id = parseInt(localStorage.getItem("api_token").slice(65));
    }
    const data = {
      comment: this.state.comment,
      articleId: this.state.article.id,
      isApproved: is_approved,
      userId: user_id,
      articleUser:
        this.state.article.articleUser === null
          ? ""
          : this.state.article.articleUser.name,
      articleMail:
        this.state.article.articleUser === null
          ? ""
          : this.state.article.articleUser.email,
      articleName: this.state.article.title,
    };
    if (localStorage.getItem("api_token") !== null) {
      data["isAdmin"] =
        localStorage.getItem("api_token").slice(0, 5) === "78357"
          ? "Yes"
          : "No";
    }

    axios
      .post("/add-comment", data)
      .then((response) => {
        if (response.data.code === 200) {
          this.setState({
            commentsArray: [
              this.state.article.comments,
              ...response.data.info.comments,
            ],
            commentMsg:
              localStorage.getItem("api_token") !== null
                ? "Successfully added the comment"
                : "Comment added successfully and will be displayed once reviewed by our team",
            commentSuccess: true,
            commentUpdate: true,
            newCommentUser: response.data.info.user,
          });
        } else {
          this.setState({
            commentMsg: response.data.message,
            commentSuccess: false,
            commentUpdate: true,
          });
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  commentInputHandler = (event) => {
    this.setState({
      comment: event.target.value,
    });
  };

  render() {
    if (!this.state.isrender) {
      return <div className="loader">Loading...</div>;
    }

    let comments = null;

    if (Object.keys(this.state.article).length > 0) {
      let filteredCommentArray = this.state.commentsArray.filter((comment) => {
        return comment.is_approved === "Yes";
      });

      comments =
        filteredCommentArray.length > 0
          ? filteredCommentArray.map((comments, id) => {
              return (
                <Comments
                  key={id}
                  text={comments.comments}
                  newUser={comments.user}
                />
              );
            })
          : "Be the first one to comment";
    }

    return (
      <div>
        {Object.keys(this.state.article).length > 0 ? (
          <Container className={classes.ReadMore}>
            <img
              src={this.state.article.image_name}
              alt="pic"
              width="250"
              height="250"
            />
            <hr />
            <h3>{this.state.article.title}</h3>
            <hr />
            <strong>
              Category: <a href="/article-list">{this.state.category}</a>
            </strong>
            <hr />
            {parse(parse(this.state.article.content))}
            <hr />
            <p>Author: {this.state.article.author_name}</p>
            <hr />
            {this.state.addComment ? (
              <div>
                <strong>Comments</strong>
                <br />
                {comments}
              </div>
            ) : null}
            <hr />
            {this.state.addComment ? (
              <React.Fragment>
                <Form.Group controlId="formBasicComment">
                  <Form.Control
                    type="text"
                    placeholder="Write a comment"
                    onChange={this.commentInputHandler}
                  />
                </Form.Group>
                {this.state.commentUpdate ? (
                  this.state.commentSuccess ? (
                    <div style={{ color: "green", fontWeight: "bold" }}>
                      {this.state.commentMsg}
                    </div>
                  ) : (
                    <div style={{ color: "red", fontWeight: "bold" }}>
                      {this.state.commentMsg}
                    </div>
                  )
                ) : null}
                <hr />
                <Button variant="primary" onClick={this.commentSubmitHandler}>
                  Add Comments
                </Button>
              </React.Fragment>
            ) : (
              <Button variant="primary" onClick={this.commentHandler}>
                Comments
              </Button>
            )}
          </Container>
        ) : (
          <div style={{ color: "gray", textAlign: "center" }}>
            <h1>Error 404: Page Not Found</h1>
            <svg
              className={classes.checkmark1}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                className={classes.checkmark__circle1}
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className={classes.checkmark__check1}
                fill="none"
                d="M16 16 36 36 M36 16 16 36"
              />
            </svg>
          </div>
        )}
      </div>
    );
  }
}

export default ReadMore;
