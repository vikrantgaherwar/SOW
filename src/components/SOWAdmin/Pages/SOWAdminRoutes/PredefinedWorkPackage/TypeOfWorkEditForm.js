import React, { useEffect } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from "react-hook-form";

const TypeOfWorkEditForm = (props) => {
  const { register, handleSubmit, formState: { errors}, reset, getValues } = useForm({ mode: "all", defaultValues: {} });
  useEffect(() => {
    reset({ ...getValues(), ...props.typeOfWorkData});
  }, [props]);
  return (
    <>
      <Form onSubmit={handleSubmit(props.handleTypeOfWorkEditSaveClick)}>
            <Form.Group as={Col} controlId="moduleName" className="mb-3">
              <Form.Label>Module Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Module Name" {...register("typeOfWork", { required: true, maxLength: 50 })} />
              {errors.moduleName && <p style={{ color: 'red' }}>This is required</p>}
            </Form.Group>

            <Row className="float-right">
            <Form.Group as={Col} controlId="footer">
                <Button type='reset'  className="mr-2" variant="secondary" onClick={props.handleTypeOfWorkEditClickClose}>Close</Button>
                <Button disabled={(props.Loading === "handlTypeOfWorkEditClickLoading")}
                type='submit' variant="primary"
                >
                    {props.Loading === "handlTypeOfWorkEditClickLoading" ?
                    (<><i className="fa fa-spinner fa-spin" /> <span pt-r={3}>In Progress</span></>) : 'Save'
                    }
                </Button>
            </Form.Group>
            </Row>
      </Form>
    </>
  )
}

export default TypeOfWorkEditForm;