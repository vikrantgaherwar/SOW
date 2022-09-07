import { Button, Modal, Spinner } from "react-bootstrap";
import SOWFormFieldRowComponent from "../SOWFormFieldRowComponent";

const WorkPackageNameEditModal = ({
  show,
  name,
  setName,
  submitChange,
  showLoading,
  zIndex,
  handleClose,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Change Solution Name</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SOWFormFieldRowComponent
          fullWidth
          type="text"
          title="Solution Name"
          idx="sectionName_12345452"
          name="sectionName"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer className="d-flex flex-row justify-content-center align-items-center">
        <Button
          disabled={showLoading}
          bsPrefix="prev-next-btn-size btn btn-success btn-sm float-right mr-2 yellow-button btn-warning"
          onClick={handleClose}
        >
          Close
        </Button>
        <Button
          disabled={showLoading}
          bsPrefix="prev-next-btn-size btn btn-success btn-sm float-right action-button"
          onClick={submitChange}
        >
          {showLoading ? (
            <Spinner size="sm" animation="border" role="status">
              <span className="sr-only">Submitting...</span>
            </Spinner>
          ) : (
            "Save Changes"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WorkPackageNameEditModal;
