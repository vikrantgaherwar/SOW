import React, { useEffect, useState } from 'react'
import { Badge, Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import agent from '../../../API/agent';
import LoadingPlaceHolder from '../../../Components/LoadingPlaceHolder';
import TextAreaFormField from '../../../Components/TextAreaFormField';
import loader_logo from '../../../Images/loading-icon-animated.gif';
import '../../../CSS/work-package-admin.css';

const TypeOfWorkForm = (props) => {
  const { register, handleSubmit, formState: { errors, isDirty, isValid }, reset, getValues } = useForm({ mode: "all", defaultValues: {} });
  const [TemplateWorkPackageData, SetTemplateWorkPackageData] = useState(undefined);
  const [Loader_TemplateIDChange, SetLoader_TemplateIDChange] = useState(false);
  const [HandlePackageSaveClicked, SetHandlePackageSaveClicked] = useState(false);
  useEffect(() => {
    if (!HandlePackageSaveClicked) {
      if(props.EditMode){
      getListPackageData(props.WorkPackageData?.WorkPackagesTemplatesList[0]?.id)
      }
      else{
      getDefaultPackageData(props.WorkPackageData?.WorkPackagesTemplatesList[0]?.id)  
      }
      reset({ ...getValues(), ...props.WorkPackageData });
    }
  }, [props]);

  const getListPackageData = (templateId) => {
    debugger;
    SetLoader_TemplateIDChange(true);
    try {
      agent.TypeOfWorkManagement.listPackageData(props.WorkPackageData.typeOfWorkId, props.WorkPackageData.packageId, templateId)
        .then((response) => {
          SetTemplateWorkPackageData(response);
          SetLoader_TemplateIDChange(false);
        });
    } catch (error) {
      SetLoader_TemplateIDChange(false);
    }
  }
  const getDefaultPackageData = (templateId) =>{
    try {
    agent.GetWorkPackageSections.list(`api/Sow/GetWorkPackageSectionData?TemplateId=${templateId}`).then((response) => {
      // debugger;
      SetTemplateWorkPackageData(response);
      SetLoader_TemplateIDChange(false);
    });
    }
    catch (error) {
      SetLoader_TemplateIDChange(false);
    }
  }
  const handleTemplateIDChange = (e) => {
    debugger;
    if (e.target.value > 0) {
      getListPackageData(e.target.value);
    }
    else {
      SetTemplateWorkPackageData(undefined);
    }
  }
  const handlePackageSaveClick = (data) => {
    SetHandlePackageSaveClicked(true);
    const saveWorkPackagesData = { ...data, solutionHubData: TemplateWorkPackageData }
    if(props.EditMode == true)
    props.handleSaveSolutionHubData(saveWorkPackagesData);
    else
    props.handleAddSolutionHubData(saveWorkPackagesData);
  }
  return (
    <>
      <Form onSubmit={handleSubmit(handlePackageSaveClick)}>
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
              <Form.Control style={{ fontSize: '12px' }} as="select" {...register("templateId", { required: true })} defaultValue={props.WorkPackageData?.WorkPackagesTemplatesList[0]?.id} onChange={handleTemplateIDChange} >
                {errors.templateId && <p style={{ color: 'red' }}>this field is required</p>}
                {/* <option key={0} value="">--- Select ---</option> */}
                {props.WorkPackageData.WorkPackagesTemplatesList?.map((item) =>
                  <option key={item.id} value={item.id}>{item.templateInputName}</option>
                )}
              </Form.Control>
              {/* {TemplateWorkPackageData === undefined && <div>please select the template</div>} */}
            </Form.Group>
          </Row>
          <Row>

          </Row>
          {Loader_TemplateIDChange ? (
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
                      value={item.fieldDefaultValue !=null ? item.fieldDefaultValue : ""}
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
              <Button className="mr-2"
                type='submit' variant="primary" disabled={props.Loading === "handleSaveSolutionHubDataLoading"}>{props.Loading === "handleSaveSolutionHubDataLoading" ?
                  (<><i className="fa fa-spinner fa-spin" /> <span pt-r={3}>In Progress</span></>) : 'Save'}
              </Button>
            </Form.Group>
          </Row>
        </Modal.Footer>
      </Form>
    </>
  )
}

export default TypeOfWorkForm;