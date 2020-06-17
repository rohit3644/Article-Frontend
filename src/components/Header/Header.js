import React from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Row,
  Col,
  Dropdown,
} from "react-bootstrap";
import { withRouter } from "react-router-dom";
import Logo from "../../assets/logo192.png";
import classes from "./Header.module.css";

class Header extends React.Component {
  logOutHandler = () => {
    localStorage.clear();
    this.props.history.push("/login");
  };

  editHandler = () => {
    localStorage.setItem("update", -1);
    this.props.history.push("/write-article");
  };

  render() {
    const display = this.props.display;
    const style = {
      boxShadow: "1px 1px 1px 1px grey",
      borderRadius: "10px",
      display: display,
      maxWidth: "10rem",
    };

    return (
      <div>
        <Row className={classes.HeaderStyle}>
          <Navbar
            collapseOnSelect
            expand="lg"
            bg="dark"
            variant="dark"
            className={classes.HeaderNav}
          >
            <Col>
              <Navbar.Brand href="/">
                <img
                  alt="Logo"
                  src={Logo}
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                />{" "}
                <div className={classes.LogoName}> @rticle.io </div>
              </Navbar.Brand>
            </Col>
            {localStorage.getItem("api_token") !== null ? (
              localStorage.getItem("api_token").slice(0, 5) === "14219" ? (
                <Col>
                  <Nav className="mr-auto" style={{ width: "max-content" }}>
                    <Button className={classes.Header} href="/user-dashboard">
                      My Articles
                    </Button>
                    <Button className={classes.Header} href="/">
                      Home
                    </Button>
                    <Button
                      className={classes.Header}
                      href="/write-article"
                      onClick={this.editHandler}
                    >
                      Write Article
                    </Button>
                  </Nav>
                </Col>
              ) : (
                <Col>
                  <Nav className="mr-auto" style={{ width: "max-content" }}>
                    <Button className={classes.Header} href="/admin-dashboard">
                      Articles
                    </Button>
                    <Button className={classes.Header} href="/comments">
                      Comments
                    </Button>
                  </Nav>
                </Col>
              )
            ) : (
              <Col>
                <Nav className="mr-auto" style={{ width: "max-content" }}>
                  <Button className={classes.Header} href="/">
                    Home
                  </Button>
                  <Button className={classes.Header} href="/write-article">
                    Write Article
                  </Button>
                </Nav>
              </Col>
            )}
            <Col>
              <Form inline>
                <FormControl
                  type="text"
                  placeholder="Search By Title"
                  className="mr-sm-2"
                  style={style}
                  onChange={this.props.blurred}
                />
              </Form>
            </Col>

            {localStorage.getItem("api_token") === null ? (
              <Col>
                <Nav className="mr-auto" style={{ width: "max-content" }}>
                  <Button className={classes.Header} href="/login">
                    Login
                  </Button>
                  <Button className={classes.Header} href="/register">
                    Register
                  </Button>
                </Nav>
              </Col>
            ) : (
              <Col>
                <Dropdown>
                  <Dropdown.Toggle variant="success">
                    Hi, {localStorage.getItem("username")}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={this.logOutHandler}>
                      Log Out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            )}
          </Navbar>
        </Row>
      </div>
    );
  }
}

export default withRouter(Header);
