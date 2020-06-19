import React from "react";
import classes from "./Article.module.css";
import { Card, Button, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";

// this class is used to create a card with article details,
// like article name, author name, number of comments

class Article extends React.Component {
  // when edit option is clicked
  editHandler = () => {
    localStorage.setItem("update", 1);
    localStorage.setItem("articleId", this.props.articleId);
    // redirect to write article functionality
    this.props.history.push("/write-article");
  };

  render() {
    // make a link from article titles
    const readMoreLink =
      "/" + this.props.title.split(" ").join("-").toLowerCase();
    return (
      <div className={classes.ArticleStyle}>
        <Card className={classes.Card}>
          {/* if editdelete flag prop is passed render edit and delete options also */}
          {this.props.editDelete ? (
            <div className={classes.EditDelete}>
              <i
                className="fa fa-edit"
                style={{ fontSize: "24px", color: "black" }}
                onClick={this.editHandler}
              ></i>
              <i
                className="fa fa-trash-o"
                style={{ fontSize: "24px", color: "red" }}
                onClick={() => this.props.handleShow(this.props.articleId)}
              ></i>
            </div>
          ) : null}
          <Card.Img
            variant="top"
            src={this.props.imageName}
            height="150"
            width="120"
          />
          <Card.Body className={classes.Article}>
            <Card.Title>
              <a href={readMoreLink} onClick={this.props.readMore}>
                {this.props.title}
              </a>
            </Card.Title>
            <div className={classes.Style}>
              <Col>
                <Card.Text>
                  <i
                    className="fa fa-comments-o"
                    style={{ marginRight: "5px", color: "red" }}
                  ></i>
                  {this.props.commentsCount}
                </Card.Text>
              </Col>
              <Card.Text>
                <i
                  className="fa fa-user-circle-o"
                  style={{ marginRight: "5px", color: "red" }}
                ></i>
                {this.props.author}
              </Card.Text>
            </div>
            <hr />
            <Button
              variant="primary"
              href={readMoreLink}
              onClick={this.props.readMore}
            >
              Read More
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default withRouter(Article);
