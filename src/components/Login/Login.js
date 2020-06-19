import React from "react";
import { Container, Button, Form, Alert } from "react-bootstrap";
import classes from "./Login.module.css";
import axios from "axios";
import { withRouter, Redirect } from "react-router-dom";

// this class is used for login functionality

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.errorRef = React.createRef();
    this.state = {
      email: "",
      password: "",
      error: false,
      errorMsg: "",
      alertDismiss: true,
      emailError: false,
      passwordError: false,
    };
  }

  // validate email
  validateEmail = (email) => {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email) && email !== "";
  };
  // validate password
  validatePassword = (password) => {
    return password.length < 8 || password === "" ? false : true;
  };
  // on change
  onChangeHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  // on submit
  onSubmitHandler = (event) => {
    event.preventDefault();

    if (this.state.emailError || this.state.passwordError) {
      return;
    }

    const data = {
      ...this.state,
      go: 1,
    };

    axios
      .post("/login", data)
      .then((response) => {
        if (response.data.code === 200) {
          // setting api token and username in localStorage
          localStorage.setItem("api_token", response.data.info.api_key);
          localStorage.setItem("username", response.data.info.user.name);
          // redirect to admin dashboard
          if (response.data.info.user.is_admin === "Yes") {
            this.props.history.push("/admin-dashboard");
          }
          // redirect to user dashboard
          else {
            this.props.history.push("/user-dashboard");
          }
        } else {
          window.scrollTo(0, this.errorRef);
          this.setState({
            error: true,
            errorMsg: response.data.message,
            alertDismiss: true,
          });
        }
      })
      .catch((error) => {
        console.log(error.response);
        // scroll to the message
        window.scrollTo(0, this.errorRef);
        this.setState({
          error: true,
          errorMsg: error.response.data.message,
          alertDismiss: true,
        });
      });
  };

  // on blur validations
  onBlurValidationHandler = (event) => {
    if (event.target.name === "email") {
      const isEmailValid = this.validateEmail(this.state.email);
      if (!isEmailValid) {
        this.setState({ emailError: true });
      } else {
        this.setState({ emailError: false });
      }
    } else {
      const isPasswordValid = this.validatePassword(this.state.password);
      if (!isPasswordValid) {
        this.setState({ passwordError: true });
      } else {
        this.setState({ passwordError: false });
      }
    }
  };

  render() {
    // restricting access
    if (
      localStorage.getItem("api_token") !== null &&
      localStorage.getItem("api_token").slice(0, 5) === "78357"
    ) {
      return <Redirect to="/admin-dashboard" />;
    }

    return (
      <div>
        {this.state.error && this.state.alertDismiss ? (
          <Alert
            variant="danger"
            onClose={() => this.setState({ alertDismiss: false })}
            dismissible
            className={classes.LoginStyle}
            ref={this.errorRef}
          >
            {this.state.errorMsg}
          </Alert>
        ) : null}
        <Container className={classes.Login}>
          <h3>Login</h3>
          <hr />
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="Enter email"
                onChange={this.onChangeHandler}
                onBlur={this.onBlurValidationHandler}
              />
              {this.state.emailError ? (
                <Form.Text style={{ color: "red", fontSize: "15px" }}>
                  Invalid email format
                </Form.Text>
              ) : null}
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                onChange={this.onChangeHandler}
                onBlur={this.onBlurValidationHandler}
              />
              {this.state.passwordError ? (
                <Form.Text style={{ color: "red", fontSize: "15px" }}>
                  Password should be atleast 8 digit
                </Form.Text>
              ) : null}
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              onClick={this.onSubmitHandler}
            >
              Submit
            </Button>
            <hr />
            <div className={classes.LoginStyle}>
              <a href="/register">Not a member yet? Create an account</a>
            </div>
          </Form>
        </Container>
      </div>
    );
  }
}

export default withRouter(Login);
