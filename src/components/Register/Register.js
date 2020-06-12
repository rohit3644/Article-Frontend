import React from "react";
import { Container, Button, Form } from "react-bootstrap";
import classes from "./Register.module.css";
import classeserror from "./RegisterError.module.css";
import axios from "axios";
import { Redirect } from "react-router-dom";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      name: "",
      mobile: "",
      isRegistered: false,
      emailError: false,
      passwordError: false,
      passwordStrength: 0,
      passwordLength: 100,
      nameError: false,
      mobileError: false,
      backendError: "",
      alertDismiss: true,
    };
  }

  validateEmail = (email) => {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  validatePassword = (password) => {
    if (password.length === 0) {
      return 0;
    }
    // Create an array and push all possible values that you want in password
    let matchedCase = [];
    matchedCase.push("[$@$!%*#?&]"); // Special Charector
    matchedCase.push("[A-Z]"); // Uppercase Alpabates
    matchedCase.push("[0-9]"); // Numbers
    matchedCase.push("[a-z]"); // Lowercase Alphabates

    // Check the conditions
    let ctr = 0;
    for (let i = 0; i < matchedCase.length; i++) {
      if (new RegExp(matchedCase[i]).test(password)) {
        ctr++;
      }
    }

    let strength = "";
    // eslint-disable-next-line
    switch (ctr) {
      case 0:
      case 1:
      case 2:
        strength = 2;
        break;
      case 3:
        strength = 4;
        break;
      case 4:
        strength = 6;
        break;
    }

    return strength;
  };

  phoneNumberValidation = (inputtxt) => {
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (inputtxt.match(phoneno)) {
      return true;
    } else {
      return false;
    }
  };

  onChangeHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onBlurValidationHandler = (event) => {
    if (event.target.name === "email") {
      const isEmailValid = this.validateEmail(this.state.email);
      if (!isEmailValid) {
        this.setState({ emailError: true });
      } else {
        this.setState({ emailError: false });
      }
    } else if (event.target.name === "password") {
      if (this.validatePassword(event.target.value) === 0) {
        this.setState({ passwordError: true });
      } else if (this.validatePassword(event.target.value) > 0) {
        this.setState({
          passwordStrength: this.validatePassword(event.target.value),
          passwordError: false,
          passwordLength: event.target.value.length,
        });
      }
    } else if (event.target.name === "name") {
      if (event.target.value === "") {
        this.setState({ nameError: true });
      } else {
        this.setState({ nameError: false });
      }
    } else if (event.target.name === "mobile") {
      if (!this.phoneNumberValidation(event.target.value)) {
        this.setState({ mobileError: true });
      } else {
        this.setState({ mobileError: false });
      }
    }
  };

  onSubmitHandler = (event) => {
    event.preventDefault();

    if (
      this.state.emailError ||
      this.state.passwordError ||
      this.state.nameError ||
      this.state.mobileError ||
      this.state.passwordLength < 8
    ) {
      return;
    }
    const data = {
      ...this.state,
    };

    axios
      .post("/register", data)
      .then((response) => {
        if (response.data === 1) {
          this.setState({ isRegistered: true });
        } else if (response.data === -1) {
          this.setState({ backendError: "Registration Failed" });
        } else {
          this.setState({ backendError: response.data.message });
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  render() {
    if (
      localStorage.getItem("api_token") !== null &&
      localStorage.getItem("api_token").slice(0, 5) === "78357"
    ) {
      return <Redirect to="/admin-dashboard" />;
    }

    return (
      <div>
        {!this.state.isRegistered ? (
          this.state.backendError === "" ? (
            <Container className={classes.Register}>
              <h3>Register</h3>
              <hr />
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    onChange={this.onChangeHandler}
                    onBlur={this.onBlurValidationHandler}
                  />
                  {!this.state.emailError ? (
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                  ) : (
                    <Form.Text style={{ color: "red", fontSize: "15px" }}>
                      Invalid email format
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={this.onChangeHandler}
                    onBlur={this.onBlurValidationHandler}
                  />
                  {!this.state.passwordError ? (
                    this.state.passwordLength >= 8 ? (
                      this.state.passwordStrength > 0 ? (
                        this.state.passwordStrength > 2 ? (
                          this.state.passwordStrength > 4 ? (
                            <Form.Text
                              style={{
                                color: "green",
                                fontSize: "15px",
                                fontWeight: "bold",
                              }}
                            >
                              Password Strength: Strong
                            </Form.Text>
                          ) : (
                            <Form.Text
                              style={{
                                color: "orange",
                                fontSize: "15px",
                                fontWeight: "bold",
                              }}
                            >
                              Password Strength: Medium
                            </Form.Text>
                          )
                        ) : (
                          <Form.Text
                            style={{
                              color: "red",
                              fontSize: "15px",
                              fontWeight: "bold",
                            }}
                          >
                            Password Strength: Weak
                          </Form.Text>
                        )
                      ) : null
                    ) : (
                      <Form.Text
                        style={{
                          color: "red",
                          fontSize: "15px",
                        }}
                      >
                        Password length should be atleast 8 character's
                      </Form.Text>
                    )
                  ) : (
                    <Form.Text
                      style={{
                        color: "red",
                        fontSize: "15px",
                      }}
                    >
                      Please enter the password
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group controlId="formBasicName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    name="name"
                    onChange={this.onChangeHandler}
                    onBlur={this.onBlurValidationHandler}
                  />
                  {this.state.nameError ? (
                    <Form.Text
                      style={{
                        color: "red",
                        fontSize: "15px",
                      }}
                    >
                      Name cannot be null
                    </Form.Text>
                  ) : null}
                </Form.Group>
                <Form.Group controlId="formBasicMobileNumber">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Mobile Number"
                    name="mobile"
                    onChange={this.onChangeHandler}
                    onBlur={this.onBlurValidationHandler}
                  />
                  {this.state.mobileError ? (
                    <Form.Text
                      style={{
                        color: "red",
                        fontSize: "15px",
                      }}
                    >
                      Invalid mobile number. Only digit's [0-9] allowed (don't
                      include 0 at the beginning)
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
                <div className={classes.RegisterStyle}>
                  <a href="/login">Already have an account? Sign In</a>
                </div>
              </Form>
            </Container>
          ) : (
            <div>
              <h2 className={classes.Error}>
                Error: {this.state.backendError}
              </h2>
              <svg
                className={classeserror.checkmark_error}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                <circle
                  className={classeserror.checkmark__circle_error}
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className={classeserror.checkmark__check_error}
                  fill="none"
                  d="M16 16 36 36 M36 16 16 36"
                />
              </svg>
            </div>
          )
        ) : (
          <Container className={classes.RegisterSuccess}>
            <h3>Registration Successful</h3>
            <svg
              className={classes.checkmark_register}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                className={classes.checkmark__circle_register}
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className={classes.checkmark__check_register}
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>

            <a href="/login">Proceed to login</a>
          </Container>
        )}
      </div>
    );
  }
}

export default Register;
