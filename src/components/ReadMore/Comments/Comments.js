import React from "react";
import classes from "./Comments.module.css";
import { Container } from "react-bootstrap";

// this class is used to display commments

const Comments = (props) => {
  const style = [classes.tip];
  style.push(classes.tipLeft);
  return (
    <div>
      <Container>
        <div className={classes.dialogbox} style={{ display: "inline-block" }}>
          <div
            className={classes.body}
            style={{ width: "auto", maxWidth: "300px", minWidth: "10rem" }}
          >
            <strong>{props.newUser}</strong>
            <span className={style.join(" ")}></span>
            <div className={classes.message}>
              <span>{props.text}</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Comments;
