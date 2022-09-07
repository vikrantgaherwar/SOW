import React, { useEffect, useState } from 'react'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import Select from "react-select";

const UserAddEditForm = (props) => {

  const { register, handleSubmit, formState: { errors }, reset, setValue, getValues } = useForm({ mode: "all" });

  const [rolesSelected, setRolesSelected] = useState([]);

  useEffect(() => {
    modifyRolesSelected(props.EmployeeDetails.roles, true)
    reset({ ...getValues(), ...props.EmployeeDetails })
  }, [props])

  const handleRolesSelectOnChange = (options) => {
    const setRolesOnSubmit = props.rolesOptions.filter(role => {
      return options.find(o => o.value === role.id)
    });
    setValue('roles', setRolesOnSubmit)
    setRolesSelected(options)
  }

  const modifyRolesSelected = (rolesSelected, stateSet) => {
    const roles = []
    rolesSelected?.map(role => roles.push({ label: role.roleName, value: role.id }))
    if (stateSet) setRolesSelected(roles)
    return roles;
  }
  return (
    <>
      <Form onSubmit={handleSubmit(props.handleSaveClick)} className="mb-3" >
        <Row className="mb-3">
          <Form.Group as={Col} controlId="employeeNumber">
            <Form.Label>Employee Number</Form.Label>
            <Form.Control type="text" disabled={true} placeholder="Enter Employee Number" {...register("employeeNumber", { required: true, maxLength: 10 })} />
            {errors.employeeNumber && <p style={{ color: 'red' }}>this is required</p>}
          </Form.Group>
          <Form.Group as={Col} controlId="emailId">
            <Form.Label>Mail ID</Form.Label>
            <Form.Control disabled={true} type="email" placeholder="Enter Mail ID" {...register("emailId", {
              required: true, pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "invalid email address"
              }
            })} />
            {errors.emailId && <p style={{ color: 'red' }}>this is required</p>}
          </Form.Group>
          <Form.Group as={Col} controlId="Role">
            <Form.Label>Role</Form.Label>
            <Select placeholder='Enter Role' value={rolesSelected}
              {...register("roles", { required: true })} onChange={(option) => handleRolesSelectOnChange(option)}
              options={modifyRolesSelected(props.rolesOptions, false)}
              isMulti={true} />
            {errors.roles && <p style={{ color: 'red' }}>this is required</p>}
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="employeeName">
            <Form.Label>Name</Form.Label>
            <Form.Control disabled={true} type="text" placeholder="Enter Name" {...register("employeeName", { required: true })} />
            {errors.employeeName && <p style={{ color: 'red' }}>this is required</p>}
          </Form.Group>
          <Form.Group as={Col} controlId="isActive">
            <Form.Label>Active</Form.Label>
            <Form.Check type="switch" {...register("isActive")} />
          </Form.Group>
          <Form.Group as={Col} controlId="empty">
            {props.EmployeeDetails.employeeNumber && !props.EditMode && !props.EmployeeDetails.isLdapUser &&
              <Alert key={'LDapUser'} variant="warning">
                user already exists in SOW
              </Alert>}
          </Form.Group>
        </Row>
        <Row className="float-right">
          <Form.Group as={Col} controlId="footer">
            <Button type='reset' onClick={props.handleCloseClick} className="mr-2" variant="secondary">Close</Button>
            <Button disabled={props.Loading === "handleAddEditUserSaveClickLoading" || (!props.EmployeeDetails.isLdapUser && !props.EditMode)}
              type='submit' variant="primary">{props.Loading === "handleAddEditUserSaveClickLoading" ?
                (<><i className="fa fa-spinner fa-spin" /> <span pt-r={3}>Saving</span></>) : "Save"}
            </Button>
          </Form.Group>
        </Row>
      </Form>
    </>
  )
}

export default UserAddEditForm;
