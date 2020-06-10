import React from "react";
import { Container, Button, Form } from "react-bootstrap";
import classes from "./Contact.module.css";
import axios from "axios";

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      message: "",
      feedbackMsg: "",
      submitted: false,
      error: false,
    };
  }

  changeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  submitHandler = (event) => {
    event.preventDefault();

    let data = {
      ...this.state,
    };
    if (localStorage.getItem("api_token") !== null) {
      data["isAdmin"] =
        localStorage.getItem("api_token").slice(0, 5) === "78357"
          ? "Yes"
          : "No";
    }
    axios
      .post("http://127.0.0.1:8000/api/contact", data)
      .then((response) => {
        console.log(response.data);
        if (response.data.code === 200) {
          this.setState({
            feedbackMsg: response.data.message,
            submitted: true,
          });
        } else {
          this.setState({
            feedbackMsg: response.data.message,
            submitted: true,
            error: true,
          });
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  render() {
    return (
      <div>
        {/* if the form is submitted  */}
        {this.state.submitted ? (
          this.state.error ? (
            <div className={classes.error}>{this.state.feedbackMsg}</div>
          ) : (
            <div className={classes.success}>{this.state.feedbackMsg}</div>
          )
        ) : null}
        <Container className={classes.Contact}>
          <h3>Contact Us</h3>
          <hr />
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                onChange={this.changeHandler}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicFullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Full Name"
                name="name"
                onChange={this.changeHandler}
              />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                name="message"
                onChange={this.changeHandler}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              onClick={this.submitHandler}
            >
              Submit
            </Button>
          </Form>
        </Container>
      </div>
    );
  }
}

export default Contact;
