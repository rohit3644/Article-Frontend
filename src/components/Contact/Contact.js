import React from "react";
import classes from "./Contact.module.css";
import axios from "axios";
import contactForm from "./ContactForm/ContactForm";

// this class is used to create contact us form and
// communicate with the backend

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

  // on change update the state elements
  changeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  // on submit of contact us form
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
    // axios call
    axios
      .post("/contact", data)
      .then((response) => {
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
      // catch error
      .catch((error) => {
        this.setState({
          feedbackMsg: error.response.data.message,
          submitted: true,
          error: true,
        });
      });
  };

  render() {
    const data = {
      containerClass: classes.Contact,
      onChange: this.changeHandler,
      onClick: this.submitHandler,
    };
    const contactFormComponent = contactForm(data);
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
        {contactFormComponent}
      </div>
    );
  }
}

export default Contact;
