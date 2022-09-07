import React, { useEffect, useState } from 'react'
import { Badge, Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import agent from '../../../API/agent';
import loader_logo from '../../../Images/loading-icon-animated.gif';
import TextAreaFormField from '../../../Components/TextAreaFormField';
const CustomModulesWorkPackageFrom=(props)=>{
    const { register, handleSubmit, formState: { errors, isDirty, isValid }, reset, getValues } = useForm({ mode: "all", defaultValues: {} });
    const [TemplateWorkPackageData, SetTemplateWorkPackageData] = useState(undefined);
    const [loader, SetLoader] = useState(false);
    useEffect(() => {
        console.log(props.WorkPackageData);
        getListPackageData(props.WorkPackageData?.templatesList[0]?.id)
        reset({ ...getValues(), ...props.WorkPackageData });
      }, [props]);
    
    const getListPackageData = (templateId) => {
        SetLoader(true);
        try {
          agent.CustomModulesApproval.list(`api/SOWAdminCustomModules/GetCustomModulesData/${props.WorkPackageData.typeOfWorkId}/${props.WorkPackageData.packageId}/${templateId}`)
            .then((response) => {
              SetTemplateWorkPackageData(response);
              SetLoader(false);
            });
        } catch (error) {
            SetLoader(false);
        }
    }
    const handleTemplateIDChange = (e) => {
        if (e.target.value > 0) {
          getListPackageData(e.target.value);
        }
        else {
          SetTemplateWorkPackageData(undefined);
        }
      }
    return (
        <>
          <Form onSubmit={handleSubmit()}>
            <Modal.Body style={{ overflowY: 'auto', maxHeight: '500px' }}>
              <Row key="TemplateSelectionForm">
                <Form.Group controlId="typeOfWork" className="col-md-4">
                  <Form.Label>
                    <Badge pill style={{ color: "white", background: "gray", padding: "", }}>Type Of Work</Badge>
                  </Form.Label>
                  <Form.Control type="text" style={{ fontSize: '12px' }} {...register("typeOfWork", { disabled: true })} />
                </Form.Group>
                <Form.Group controlId="packageName" className="col-md-4">
                  <Form.Label><Badge pill style={{ color: "white", background: "gray", padding: "", }}>Package Name</Badge></Form.Label>
                  <Form.Control type="text" style={{ fontSize: '12px' }} {...register("workPackage", { required: true })} />
                  {errors.workPackage && <p style={{ color: 'red' }}>this field is required</p>}
                </Form.Group>
                <Form.Group controlId="templateId" className="col-md-4">
                  <Form.Label><Badge pill style={{ color: "white", background: "gray", padding: "", }}>Template</Badge></Form.Label>
                  <Form.Control style={{ fontSize: '12px' }} as="select" {...register("templateId", { required: true })} defaultValue={props.WorkPackageData?.templatesList[0]?.id} onChange={handleTemplateIDChange} >
                    {errors.templateId && <p style={{ color: 'red' }}>this field is required</p>}
                    {props.WorkPackageData.templatesList?.map((item) =>
                      <option key={item.id} value={item.id}>{item.templateInputName}</option>
                    )}
                  </Form.Control>
                </Form.Group>
              </Row>
              <Row>
    
              </Row>
              {loader ? (
                <div className="text-center">
                  <img className="loading-img" src={loader_logo} alt="loading"></img>
                </div>
              ) :
                <>
                  {TemplateWorkPackageData?.map((item, index) => (
                    <Row key={`${item.fieldName}${index}`}>
                      <Form.Group controlId={item.fieldName} className="col-md-12">
                        <TextAreaFormField
                          key={`dynamic${item.id}${index}`}
                          name={item.fieldName}
                          onChange={(val, name) => {
                            SetTemplateWorkPackageData((prev) =>
                              prev.map((e) =>
                                e.fieldName === name ? { ...e, fieldDefaultValue: val } : { ...e }
                              )
                            );
                          }}
                          value={item.fieldDefaultValue}
                          isPopup
                        />
                      </Form.Group>
                    </Row>
                  ))}
                </>
              }
            </Modal.Body>
            <Modal.Footer className='workpackge-modal-footer'>
              <Row className="float-right" style={{ bottom: 0, position: 'sticky' }}>
                <Form.Group as={Col} controlId="footer" className='workpackage-modal-inputgroup'>
                  <Button onClick={props.handleWorkPackageModalCloseClick} className="mr-2" variant="secondary">Close</Button>
                  {/* <Button className="mr-2"
                    type='submit' variant="primary" disabled={props.Loading === "handleSaveSolutionHubDataLoading"}>{props.Loading === "handleSaveSolutionHubDataLoading" ?
                      (<><i className="fa fa-spinner fa-spin" /> <span pt-r={3}>In Progress</span></>) : 'Save'}
                  </Button> */}
                </Form.Group>
              </Row>
            </Modal.Footer>
          </Form>
        </>
      )
}

export default CustomModulesWorkPackageFrom;