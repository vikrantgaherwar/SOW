import React from 'react'
import { Modal, CloseButton } from 'react-bootstrap';
const CustomModulesWorkPackageModal=(props)=>{
    return (
        <>
            <Modal size="lg" centered show={props.WorkPackageModalShow} backdrop="static" keyboard={false}>
                <div className='modal-content'>
                    <Modal.Header>
                        <Modal.Title>
                            <i className="fa fa-briefcase pr-2"></i> Work Package
                        </Modal.Title>
                        <CloseButton style={{float:'right'}} onClick={props.handleWorkPackageModalCloseClick}/>
                    </Modal.Header>
                    {props.children}
                </div>
            </Modal>
        </>
    );
}

export default CustomModulesWorkPackageModal;