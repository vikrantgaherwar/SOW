import React from 'react'
import {Modal, CloseButton } from 'react-bootstrap';
import '../../../CSS/cost-management-admin.css';

const CostManagementModal = (props) => {
    return (
        <>
            <Modal size="lg" centered show={props.costManagementModalShow} backdrop="static" keyboard={false}>
                <div className='modal-content'>
                    <Modal.Header className='cost-modal-header'>
                        <h5><i style={{ color: "#0d5265" }} className="fa fa-money-check-alt pr-3"></i>Cost Management</h5>
                        <CloseButton style={{ float: 'right' }} onClick={props.handleCostManagementCloseClick} />
                    </Modal.Header>
                    {props.children}
                </div>
            </Modal>
        </>
    );
}


export default CostManagementModal;