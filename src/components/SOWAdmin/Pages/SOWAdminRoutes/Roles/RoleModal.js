import React from 'react'
import { Modal, CloseButton } from 'react-bootstrap';
const RolesModalPopUp = (props) => {
    return (
        <>
            <Modal size="md" centered show={props.DeleteMode ? props.DeleteMode : props.showModal} backdrop="static" keyboard={false}>
                <Modal.Header md={4}>
                    <Modal.Title>
                        <i className="fa fa-id-badge pr-2"></i>{props.DeleteMode ? 'Delete Role' : props.EditMode ? 'Edit Role' : 'Add Role'}
                    </Modal.Title>
                    <CloseButton style={{float:'right'}} onClick={props.handleCloseClick}/>
                </Modal.Header>
                <Modal.Body>
                    {props.children}
                </Modal.Body>
            </Modal>
        </>
    );
}
export default RolesModalPopUp;