import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const modal = (modalFlag, handleClose, otpSendHandler, mobileOnChange, mobileValue) => {
  const modal = (
    <>
      <Modal show={modalFlag} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please enter your mobile number to send OTP</Modal.Body>
        <Form.Control
          type="text"
          placeholder="Enter mobile number"
          value={mobileValue}
          onChange={mobileOnChange}
        />
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={otpSendHandler}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
  return modal;
};

export default modal;
