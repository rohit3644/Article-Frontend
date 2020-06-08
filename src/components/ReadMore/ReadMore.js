import React from "react";
import { Container, Button, Form } from "react-bootstrap";
import classes from "./ReadMore.module.css";
import axios from "axios";
import Comments from "./Comments/Comments";

class ReadMore extends React.Component {
  constructor(props) {
    super(props);
    console.log("this is constructor");
    const filteredArray = this.props.article.filter((el) => {
      return el != null;
    });
    console.log(filteredArray);
    if (filteredArray.length > 0) {
      this.state = {
        selectedId: filteredArray[0].id,
        isrender: false,
        title: filteredArray[0].title,
        content: filteredArray[0].content,
        author: filteredArray[0].author_name,
        categories: "",
        imageName: filteredArray[0].image_name,
        addComment: false,
        comment: "",
        commentMsg: "",
        commentUpdate: false,
        commentSuccess: false,
        commentsArray: filteredArray[0].comments,
        newCommentUser: "",
        array: filteredArray,
        articleUser:
          filteredArray[0].articleUser === null
            ? ""
            : filteredArray[0].articleUser.name,
        articleMail:
          filteredArray[0].articleUser === null
            ? ""
            : filteredArray[0].articleUser.email,
      };
    } else {
      this.state = {
        isrender: true,
        array: [],
      };
    }
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
      user_id = localStorage.getItem("user_id");
    }
    const data = {
      comment: this.state.comment,
      articleId: this.state.selectedId,
      isApproved: is_approved,
      userId: user_id,
      articleUser: this.state.articleUser,
      articleMail: this.state.articleMail,
      articleName: this.state.title,
    };

    axios
      .post("http://127.0.0.1:8000/api/add-comment", data)
      .then((response) => {
        if (response.data.code === 200) {
          console.log(response.data.info);
          this.setState({
            commentsArray: [...response.data.info.comments],
            commentMsg: "Successfully added the comment",
            commentSuccess: true,
            commentUpdate: true,
            newCommentUser: response.data.info.user,
          });
        } else {
          console.log(response.data);
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

  componentDidMount() {
    if (this.state.array.length > 0) {
      console.log("this is componentDidMount");
      const data = {
        selectedId: this.state.selectedId,
      };
      axios
        .post("http://127.0.0.1:8000/api/read-more", data)
        .then((response) => {
          let category = [];
          console.log(response.data);
          response.data.map((ele) => {
            return category.push(ele.category);
          });
          let str = category.join(", ");
          this.setState({ isrender: true, category: str });
        });
    }
  }

  render() {
    if (!this.state.isrender) {
      return <div className="loader">Loading...</div>;
    }

    let comments = null;

    if (this.state.array.length > 0) {
      console.log("this is render");

      comments =
        this.state.commentsArray.length > 0
          ? this.state.commentsArray.map((comments, id) => {
              if (comments.is_approved === "Yes") {
                return (
                  <Comments
                    key={id}
                    text={comments.comments}
                    newUser={comments.user}
                  />
                );
              }
              return null;
            })
          : "Be the first one to comment";
    }

    return (
      <div>
        {this.state.array.length > 0 ? (
          <Container className={classes.ReadMore}>
            <img
              src={this.state.imageName}
              alt="pic"
              width="250"
              height="250"
            />
            <hr />
            <h3>{this.state.title}</h3>
            <hr />
            <strong>
              Category: <a href="/article-list">{this.state.category}</a>
            </strong>
            <hr />
            <p>{this.state.content}</p>
            <hr />
            <p>Author: {this.state.author}</p>
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
