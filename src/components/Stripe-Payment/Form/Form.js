import React from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import { Container, Form, Button } from "react-bootstrap";
import classes from "./Form.module.css";
import axios from "axios";

// Stripe payment form and from handler

class FormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      responseMsg: "",
      error: false,
      submitted: false,
      line: "",
      city: "",
      state: "",
      country: "",
    };
    this.myRef = React.createRef();
  }

  onChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  submitHandler = (event) => {
    event.preventDefault();
    console.log("Payment done");
    try {
      this.props.stripe
        .createToken({ name: this.state.name })
        .then((response) => {
          console.log(response.token);
          let data = {
            tokenId: response.token.id,
            postalCode: response.token.card.address_zip,
            ...this.state,
          };
          axios
            .post("/payment", data)
            .then((response) => {
              console.log(response.data);
              if (response.data.code === 200) {
                window.scrollTo(0, this.myRef);
                this.setState({
                  responseMsg: "Congrats! You are now a member",
                  submitted: true,
                  error: false,
                });
              } else {
                window.scrollTo(0, this.myRef);
                this.setState({
                  responseMsg: response.data.message,
                  error: true,
                  submitted: true,
                });
              }
            })
            .catch((error) => {
              window.scrollTo(0, this.myRef);
              console.log(error.response);
              this.setState({
                responseMsg: error.response.data.message,
                error: true,
                submitted: true,
              });
            });
        })
        .catch((error) => {
          window.scrollTo(0, this.myRef);
          console.log(error.response);
          this.setState({
            responseMsg: "Invalid request",
            error: true,
            submitted: true,
          });
        });
    } catch (e) {
      throw e;
    }
  };

  render() {
    return (
      <div>
        {/* if the form is submitted  */}
        {this.state.submitted ? (
          this.state.error ? (
            <div className={classes.error} ref={this.myRef}>
              {this.state.responseMsg}
            </div>
          ) : (
            <div className={classes.success} ref={this.myRef}>
              {this.state.responseMsg}
            </div>
          )
        ) : null}
        <Container className={classes.Form}>
          <h2>Monthly Membership</h2>
          <hr />
          <strong>What our members get?</strong>
          <ul>
            <li>Access to the our daily NewsLetter</li>
            <li>Exclusive discount in offline article download</li>
            <li>24*7 instant support from our team</li>
          </ul>
          <Form>
            <Form.Group controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                onChange={this.onChangeHandler}
              />
            </Form.Group>

            <Form.Group controlId="formBasicAmount">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Line 1"
                name="line"
                onChange={this.onChangeHandler}
                style={{ marginBottom: "15px" }}
              />
              <Form.Control
                type="text"
                placeholder="City"
                name="city"
                onChange={this.onChangeHandler}
                style={{ marginBottom: "15px" }}
              />
              <Form.Control
                type="text"
                placeholder="State"
                name="state"
                onChange={this.onChangeHandler}
                style={{ marginBottom: "15px" }}
              />
              <Form.Control
                type="text"
                placeholder="Country"
                name="country"
                onChange={this.onChangeHandler}
                style={{ marginBottom: "15px" }}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Card Details</Form.Label>
              <CardElement className={classes.Card} />
            </Form.Group>
            <Button
              variant="success"
              onClick={this.submitHandler}
              className={classes.Button}
            >
              <strong>Pay $6</strong>
            </Button>
          </Form>
        </Container>
      </div>
    );
  }
}

export default injectStripe(FormComponent);
