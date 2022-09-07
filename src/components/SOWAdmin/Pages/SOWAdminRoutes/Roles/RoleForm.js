import React, { useEffect } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from "react-hook-form";

const RoleAddEditForm = (props) => {
  const { register, handleSubmit, formState: { errors, isDirty, isValid }, reset, getValues } = useForm({ mode: "all", defaultValues: {} });
  useEffect(() => {
    reset({ ...getValues(), ...props.RoleDetails });
  }, [props]);
  return (
    <>
      <Form onSubmit={handleSubmit(props.handleSaveClick)}>
        {!props.DeleteMode && (
          <>
            <Form.Group as={Col} controlId="roleName" className="mb-3">
              <Form.Label>Role Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Role Name" {...register("roleName", { required: true, maxLength: 20 })} />
              {errors.roleName && <p style={{ color: 'red' }}>This is required</p>}
            </Form.Group>
            <Form.Group as={Col} controlId="comments" className="mb-3">
              <Form.Label>Comments</Form.Label>
              <Form.Control as="textarea" placeholder="Enter Comments" {...register("comments")} />
              {/* {errors.comments && <p style={{ color: 'red' }}>This is required</p>} */}
            </Form.Group>
            <Form.Group as={Col} controlId="isActive" className="mb-3">
              <Form.Label>Active</Form.Label>
              <Form.Check type="switch" {...register("isActive")} />
              {/* {errors.isActive && <p style={{ color: 'red' }}>This is required</p>} */}
            </Form.Group>
            <Form.Group as={Col} controlId="empty">
            </Form.Group>
          </>
        )}
        {props.DeleteMode && (
          <>
            <Form.Group as={Col} controlId="roleName" className="mb-3" hidden>
              <Form.Control type="text" {...register("id")} />
            </Form.Group>
            <Form.Group as={Col} controlId="roleName" className="mb-3">
              <Form.Label>Role Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Role Name" {...register("roleName")} disabled />
            </Form.Group>
          </>
        )}
        <Row className="float-right">
          <Form.Group as={Col} controlId="footer">
            <Button type='reset' onClick={props.handleCloseClick} className="mr-2" variant="secondary">Close</Button>
            <Button disabled={(props.Loading === "handleAddEditRoleSaveClickLoading" || !isDirty || !isValid) && !props.DeleteMode}
              type='submit' variant="primary">{props.Loading === "handleAddEditRoleSaveClickLoading" ?
                (<><i className="fa fa-spinner fa-spin" /> <span pt-r={3}>In Progress</span></>) : props.DeleteMode ? 'Delete' : 'Save'}
            </Button>

          </Form.Group>
        </Row>
      </Form>
    </>
  )
}

export default RoleAddEditForm;