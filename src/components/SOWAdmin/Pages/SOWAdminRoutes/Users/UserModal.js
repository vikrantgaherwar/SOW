import React from 'react'
import { Button, Col, Form, FormControl, InputGroup, Modal, Row, CloseButton } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

const UserModalPopUp = (props) => {
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: "all" });
    return (
        <>
            <Modal size="lg" centered show={props.showModal} backdrop="static" keyboard={false}>
                <Modal.Header md={4}>
                    <Modal.Title className='col-md-6'>
                        <i className="fa fa-user pr-2"></i> {props.EditMode ? 'Edit User' : 'Add User'}
                    </Modal.Title>
                    {props.EditMode &&
                        <CloseButton style={{float:'right'}} onClick={props.handleCloseClick}/>
                    }
                    {!props.EditMode && <Form className='col-md-4' onSubmit={handleSubmit(props.handleModalSearchClick)}>
                        <Row>
                            <Col>
                                <InputGroup>
                                    <FormControl type="text" placeholder="Search Employee Number" {...register("empNumber", { required: true, shouldUnregister: true })} />
                                    <Button disabled={props.Loading === "handleModalEmployeeSearchClickLoading"} type='submit' variant="secondary">
                                        {props.Loading === "handleModalEmployeeSearchClickLoading" ?
                                            (<i className="fa fa-spinner fa-spin" />) :
                                            (<i style={{ color: 'white' }} className="fa fa-search"></i>)
                                        }
                                    </Button>
                                    <CloseButton style={{float:'right'}} onClick={props.handleCloseClick}/>
                                </InputGroup>
                                {errors.empNumber && <span style={{ color: 'red' }}>This is required</span>}
                            </Col>
                        </Row>
                    </Form>}  
                </Modal.Header>
                <Modal.Body>
                    {props.children}
                </Modal.Body>
            </Modal>
        </>
    );
}


export default UserModalPopUp;