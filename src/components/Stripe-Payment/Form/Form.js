import React from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import { Container, Form, Button } from "react-bootstrap";
import classes from "./Form.module.css";
import axios from "axios";

class FormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      amount: "",
      responseMsg: "",
      error: false,
      submitted: false,
    };
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
          };
          axios
            .post("/payment", data)
            .then((response) => {
              console.log(response.data);
              if (response.data.code === 200) {
                this.setState({
                  responseMsg: response.data.message,
                  submitted: true,
                  error: false,
                });
              } else {
                this.setState({
                  responseMsg: response.data.message,
                  error: true,
                  submitted: true,
                });
              }
            })
            .catch((error) => {
              console.log(error.response);
              this.setState({
                responseMsg: error.response.data.message,
                error: true,
                submitted: true,
              });
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
            <div className={classes.error}>{this.state.responseMsg}</div>
          ) : (
            <div className={classes.success}>{this.state.responseMsg}</div>
          )
        ) : null}
        <Container className={classes.Form}>
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
              <Form.Label>Amount ($)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Amount"
                name="amount"
                onChange={this.onChangeHandler}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Card Details</Form.Label>
              <CardElement className={classes.Card} />
            </Form.Group>
            <Button variant="success" onClick={this.submitHandler}>
              Pay
            </Button>
          </Form>
        </Container>
      </div>
    );
  }
}

export default injectStripe(FormComponent);
