import { Fragment, useEffect, useState } from "react";
import moment from "moment";
import Cookies from "js-cookie";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  actionSelectRights,
  actionSelectUser,
  actionShareSow,
  actionSharingModalClose,
} from "../../Redux/Actions/SharingModal";
import SOWFormFieldComponent from "../SOWFormFieldComponent";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import LoadingComponent from "../LoadingComponent";

const SharingModal = () => {
  const dispatch = useDispatch();
  const {
    showModal,
    selectedUser,
    userList,
    rightsList,
    sowUserRoles,
    sowGeneratedId,
    shareSowFetchState,
    rightsFetchState,
  } = useSelector(
    (state) => ({
      showModal: state.sharingModal.showModal,
      selectedUser: state.sharingModal.selectedUser,
      userList: state.sharingModal.userList,
      rightsList: state.sharingModal.rights,
      sowUserRoles: state.showHistory?.sowUserDetails?.sowUserRoles,
      sowGeneratedId: state.sharingModal.sharingSelectedId,
      shareSowFetchState: state.sharingModal.shareSowFetchState,
      rightsFetchState: state.sharingModal.rightsFetchState,
    }),
    shallowEqual
  );

  const handleClose = () => {
    dispatch(actionSharingModalClose());
  };

  const saveChanges = () => {
    const rights = rightsList.filter((r) => r.checked).map((right) => right.id);
    const sharedByUserId = sowUserRoles[0].userId;
    const sharedToUserIdList = selectedUser.map((s) => s.id);
    const ob = {
      sharedByUserId,
      rights,
      sharedToUserIdList,
      sowGeneratedId,
      createdBy: Cookies.get("name"),
      createdDate: moment().toISOString(),
    };
    dispatch(actionShareSow(ob));
  };

  const onRightsChanged = (e) => {
    const { value, checked } = e.target;
    dispatch(actionSelectRights(value, checked));
  };

  return (
    <Modal
      className="parentZIndex"
      show={showModal}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Share SOW</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {rightsFetchState === 0 || rightsFetchState === 1 ? (
          <LoadingComponent />
        ) : (
          <>
            <SOWFormFieldComponent
              col={[3, 9]}
              type="single-select"
              isMulti
              title="Select user"
              name="user"
              value={selectedUser}
              list={userList.map((e) => ({
                ...e,
                value: e.employeeName,
                label: e.employeeName,
              }))}
              onChange={(e) => dispatch(actionSelectUser(e))}
            />
            <Col>
              <Form.Group as={Row}>
                <Col sm={3}>
                  <Form.Label>
                    <b>{"User Rights"}</b>
                  </Form.Label>
                </Col>
                <Col sm={8}>
                  {rightsList.map((right, i) => (
                    <Fragment key={`${right.id}_${i}`}>
                      <input
                        //   disabled={isView}
                        id={`form_${i}_${right.id}`}
                        checked={right.checked ?? false}
                        type={"checkbox"}
                        value={right.id}
                        name={"rights"}
                        className=""
                        onChange={onRightsChanged}
                      />
                      <label className="m-1 p-1">{right.rightsName}</label>
                    </Fragment>
                  ))}
                </Col>
              </Form.Group>
            </Col>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="d-flex flex-row justify-content-center align-items-center">
        <Button
          bsPrefix="prev-next-btn-size btn btn-success btn-sm float-right mr-2 yellow-button btn-warning"
          onClick={handleClose}
        >
          Close
        </Button>
        <Button
          disabled={
            !rightsList.find((r) => r.checked)?.checked ||
            !selectedUser?.length > 0
          }
          bsPrefix="prev-next-btn-size btn btn-success btn-sm float-right action-button"
          onClick={saveChanges}
        >
          {shareSowFetchState === APIFetchStatus.FETCHING ? (
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

export default SharingModal;
