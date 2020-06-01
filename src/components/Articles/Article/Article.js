import React from "react";
import classes from "./Article.module.css";
import { Card, Button } from "react-bootstrap";
// import Pic from "../../../assets/download.jpeg";

const Article = (props) => {
  const readMoreLink = "/" + props.title.split(" ").join("-").toLowerCase();
  return (
    <div className={classes.ArticleStyle}>
      <Card
        style={{
          width: "15rem",
          boxShadow: "3px 3px 3px 3px grey",
          height: "20rem",
        }}
      >
        <Card.Img
          variant="top"
          src={props.imageName}
          height="150"
          width="120"
        />
        <Card.Body className={classes.Article}>
          <Card.Title>
            <a href={readMoreLink} onClick={props.readMore}>
              {props.title}
            </a>
          </Card.Title>
          <Card.Text>{props.author}</Card.Text>
          <Button
            variant="primary"
            href={readMoreLink}
            onClick={props.readMore}
          >
            Read More >>
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Article;
