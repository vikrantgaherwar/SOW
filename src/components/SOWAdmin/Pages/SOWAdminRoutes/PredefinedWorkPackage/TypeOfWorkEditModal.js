import React from 'react'
import { Modal, CloseButton } from 'react-bootstrap';
const TypeOfWorkEditModal = (props) => {
    return (
        <>
            <Modal size="md" centered show={props.editShow} backdrop="static" keyboard={false}>
                <Modal.Header md={4}>
                    <Modal.Title>
                        <i className="fa fa-pencil-alt pr-2"/>Edit Module Name
                    </Modal.Title>
                    <CloseButton style={{float:'right'}} onClick={props.handleTypeOfWorkEditClickClose} />
                </Modal.Header>
                <Modal.Body>
                    {props.children}
                </Modal.Body>
            </Modal>
        </>
    );
}
export default TypeOfWorkEditModal;