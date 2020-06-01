import React from "react";
import { Container } from "react-bootstrap";
import classes from "./About.module.css";

const About = (props) => {
  return (
    <Container className={classes.About}>
      <h3>About Me</h3>
      <hr />
      <p>
        I am a full-stack web-developer, having great interest in designing
        systems that common people use and like.
         <strong>@rticle.io</strong> is one such platform where people can read
        popular article and also contribute great articles so that our knowledge
        is mutually-benefitted.
      </p>
    </Container>
  );
};

export default About;
