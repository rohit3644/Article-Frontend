import React from "react";
import { Modal, Button } from "react-bootstrap";

const modal = (modalData) => {
  const modal = (
    <>
      <Modal show={modalData.modalFlag} onHide={modalData.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={modalData.handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={modalData.delete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
  return modal;
};

export default modal;
