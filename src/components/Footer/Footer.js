import React from "react";
import { Navbar } from "react-bootstrap";
import classes from "./Footer.module.css";
import FooterLinks from "./FooterLinks/FooterLinks";

const Footer = (props) => {
  return (
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        className={classes.Footer}
      >
        © Copyright 2020
        <FooterLinks />
      </Navbar>
  );
};

export default Footer;
