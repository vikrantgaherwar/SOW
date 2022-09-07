import { Modal, Accordion, Button, Card } from "react-bootstrap";
import ContextAwareToggle from "../../ContextAwareToggle";
import {
  actionDynamicDataFieldsWorkPackageRemove,
  actionDynamicDataFieldChangeWorkPackageName,
  actionDynamicDataWorkPackageMoved,
  actionDynamicDataWorkPackageMoveEnd,
} from "../../Redux/Actions/DynamicDataFields";
import { useDispatch } from "react-redux";
import { useCallback, useRef, useState } from "react";

import SOWFormFieldRowComponent from "../SOWFormFieldRowComponent";
import { useEffect } from "react";

const style = {
  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move",
};

const WorkPackageAccordian = ({
  title,
  name,
  ddId,
  showRemove,
  showEdit,
  idx,
  children,
  isPredefined,
  id,
  isView,
}) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [val, setVal] = useState(title);

  useEffect(() => {
    setVal(title);
  }, [title]);

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
    }
    setShow(false);
  };

  const saveVal = (e) => {
    e.preventDefault();
    dispatch(actionDynamicDataFieldChangeWorkPackageName(id, name, val));
    setShow(false);
  };
  return (
    <>
      <Accordion style={{ ...style }} key={title + "_" + idx} className="pr-2">
        <Card>
          <ContextAwareToggle
            as="h6"
            style={{ userSelect: "none" }}
            eventKey={`${idx}`}
          >
            <>
              {title}
              &nbsp;&nbsp;&nbsp;
              {showEdit && (
                <i
                  style={{ cursor: "pointer" }}
                  className="fas fa-pen fa-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShow(true);
                  }}
                  title="Edit Section Title"
                />
              )}
              {showRemove && (
                <Button
                  disabled={isView}
                  bsPrefix="btn btn-success new-btn-success1 btn-sm float-right pr-2"
                  title=""
                  data-testid="AddTableRow"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    // console.log("button CLicked");

                    dispatch(
                      actionDynamicDataFieldsWorkPackageRemove(id, name)
                    );
                  }}
                  //   disabled={!isTableStateFilled(values[values.length - 1])}
                >
                  <i className="fas fa-minus fa-xs" />
                </Button>
              )}
            </>
          </ContextAwareToggle>
          {/* <hr className="sow-titleline" /> */}
          <Accordion.Collapse eventKey={`${idx}`} style={{ borderBottom: 0 }}>
            {children}
          </Accordion.Collapse>
        </Card>
      </Accordion>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change Section Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SOWFormFieldRowComponent
            fullWidth
            type="text"
            title="Section Name"
            idx={`${id}_${idx}`}
            name="sectionName"
            value={val}
            onChange={(e) => setVal(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer className="d-flex flex-row justify-content-center align-items-center">
          <Button
            bsPrefix="prev-next-btn-size btn btn-success btn-sm float-right mr-2 yellow-button btn-warning"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            bsPrefix="prev-next-btn-size btn btn-success btn-sm float-right action-button"
            onClick={saveVal}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default WorkPackageAccordian;
