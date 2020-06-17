import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const otpVerifyModal = (
  modalFlag,
  handleClose,
  otpVerifyHandler,
  otpOnChange,
  otpValue
) => {
  const modal = (
    <>
      <Modal show={modalFlag} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please enter the OTP</Modal.Body>
        <Form.Control
          type="text"
          placeholder="Enter OTP"
          value={otpValue}
          onChange={otpOnChange}
        />
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={otpVerifyHandler}>
            Verify
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
  return modal;
};

export default otpVerifyModal;
