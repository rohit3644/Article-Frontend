import React from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Row,
  Col,
  Dropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const headerComponent = (data) => {
  const headerComponent = (
    <Row className={data.HeaderStyle}>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        className={data.HeaderNav}
      >
        <Col>
          <Navbar.Brand href="/">
            <img
              alt="Logo"
              src={data.Logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            <div className={data.LogoName}> @rticle.io </div>
          </Navbar.Brand>
        </Col>
        {/* conditionally rendering the header options */}
        {localStorage.getItem("api_token") !== null ? (
          localStorage.getItem("api_token").slice(0, 5) === "14219" ? (
            <Col>
              <Nav className="mr-auto" style={{ width: "max-content" }}>
                <Link className={data.Header} to="/user-dashboard">
                  My Articles
                </Link>
                <Link className={data.Header} to="/">
                  Home
                </Link>
                <Link
                  className={data.Header}
                  to="/write-article"
                  onClick={data.editHandler}
                >
                  Write Article
                </Link>
              </Nav>
            </Col>
          ) : (
            <Col>
              <Nav className="mr-auto" style={{ width: "max-content" }}>
                <Link className={data.Header} to="/admin-dashboard">
                  Articles
                </Link>
                <Link className={data.Header} to="/comments">
                  Comments
                </Link>
              </Nav>
            </Col>
          )
        ) : (
          <Col>
            <Nav className="mr-auto" style={{ width: "max-content" }}>
              <Link className={data.Header} to="/">
                Home
              </Link>
              <Link className={data.Header} to="/write-article">
                Write Article
              </Link>
              <Link className={data.Header} to="/payment">
                Membership
              </Link>
            </Nav>
          </Col>
        )}
        <Col>
          <Form inline>
            <FormControl
              type="text"
              placeholder="Search By Title"
              className="mr-sm-2"
              style={data.style}
              onChange={data.blurred}
            />
          </Form>
        </Col>

        {localStorage.getItem("api_token") === null ? (
          <Col>
            <Nav className="mr-auto" style={{ width: "max-content" }}>
              <Link className={data.Header} to="/login">
                Login
              </Link>
              <Link className={data.Header} to="/register">
                Register
              </Link>
            </Nav>
          </Col>
        ) : (
          <Col>
            <Dropdown>
              <Dropdown.Toggle variant="success">
                Hi, {localStorage.getItem("username")}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={data.logOutHandler}>
                  Log Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        )}
      </Navbar>
    </Row>
  );
  return headerComponent;
};

export default headerComponent;
