import { Button, Modal } from "react-bootstrap";

const ConfirmationModal = ({ show, handleClose, handleConfirm, message }) => {
  const handleMakeChanges = (e) => {
    e.preventDefault();
    handleConfirm();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    handleClose();
  };
  return (
    <Modal show={show} centered>
      <Modal.Header>
        <Modal.Title>Cloned dynamic data will be reset!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message.split("\n").map((e) => (
          <p key={e}>{e}</p>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button bsPrefix="btn btn-danger btn-sm" onClick={handleMakeChanges}>
          Yes
        </Button>
        <Button
          bsPrefix="btn btn-success new-btn-success1 btn-sm"
          onClick={handleCancel}
        >
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
