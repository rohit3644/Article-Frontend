import React from "react";
import { Link } from "react-router-dom";
import classes from "./FooterLinks.module.css";
// this component contains all links in the footer
const FooterLinks = (props) => {
  return (
    <div className={classes.FooterLinks}>
      <h5>
        <Link to="/about" className={classes.About}>
          About Us
        </Link>
      </h5>
      <h5>
        <Link to="/contact" className={classes.Contact}>
          Contact Us
        </Link>
      </h5>
    </div>
  );
};

export default FooterLinks;
