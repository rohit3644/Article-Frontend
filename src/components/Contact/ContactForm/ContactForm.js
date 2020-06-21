import React from "react";
import { Container, Button, Form } from "react-bootstrap";

const contactForm = (data) => {
  const contactForm = (
    <Container className={data.containerClass}>
      <h3>Contact Us</h3>
      <hr />
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            onChange={data.onChange}
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
            onChange={data.onChange}
          />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows="3"
            name="message"
            onChange={data.onChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={data.onClick}>
          Submit
        </Button>
      </Form>
    </Container>
  );
  return contactForm;
};

export default contactForm;
