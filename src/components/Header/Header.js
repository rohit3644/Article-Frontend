import React from "react";
import headerComponent from "./HeaderComponent/HeaderComponent";
import { withRouter } from "react-router-dom";
import Logo from "../../assets/logo192.png";
import classes from "./Header.module.css";

// this class displays the conditionals options in the header
class Header extends React.Component {
  // logout
  logOutHandler = () => {
    localStorage.clear();
    this.props.history.push("/login");
  };

  // edit
  editHandler = () => {
    localStorage.setItem("update", -1);
    this.props.history.push("/write-article");
  };

  render() {
    // stylings
    const display = this.props.display;
    const style = {
      boxShadow: "1px 1px 1px 1px grey",
      borderRadius: "10px",
      display: display,
      maxWidth: "10rem",
    };

    const data = {
      HeaderStyle: classes.HeaderStyle,
      HeaderNav: classes.HeaderNav,
      Logo: Logo,
      LogoName: classes.LogoName,
      Header: classes.Header,
      editHandler: this.editHandler,
      style: style,
      blurred: this.props.blurred,
      logOutHandler: this.logOutHandler,
    };

    let header = headerComponent(data);

  return <div>{header}</div>;
  }
}

export default withRouter(Header);
