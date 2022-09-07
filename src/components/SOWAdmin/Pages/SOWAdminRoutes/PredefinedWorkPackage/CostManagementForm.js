import React, { useEffect, useState } from 'react'
import { Badge, Button, Col, Form, Row, Table, ProgressBar, InputGroup, ButtonGroup, ToggleButton, ToggleButtonGroup, ButtonToolbar, Modal, FormCheck } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import agent from '../../../API/agent';
import LoadingPlaceHolder from '../../../Components/LoadingPlaceHolder';
import loader_logo from '../../../Images/loading-icon-animated.gif';
import '../../../CSS/cost-management-admin.css';
import _, { groupBy, map } from 'lodash';
const CostManagementForm = (props) => {
  const { register, handleSubmit, formState: { errors, isDirty, isValid }, reset, getValues, watch, setValue } =
    useForm({
      mode: 'onSubmit',
      reValidateMode: 'onChange'
    });
  const [CostManagementData, SetCostManagementData] = useState(undefined);
  const [CostManagementDataCollapse, SetCostManagementDataCollapse] = useState({});
  const [LoadingCostManagementData, SetLoadingCostManagementData] = useState(false);
  const [TshirtSizeSelected, SetTshirtSizeSelected] = useState(undefined);

  useEffect(() => {
    if (TshirtSizeSelected !== undefined) GetCostingEstimationData();
  }, [TshirtSizeSelected]);

  const GetCostingEstimationData = async () => {
    try {
      SetLoadingCostManagementData(true);
      await agent.CostManagement.list
        (`api/SOWAdminWorkPackage/GetCostingEstimationData/${props.CostManagementData.id}/${TshirtSizeSelected}`)
        .then((response) => {
          let CostManagementData = { CostManagementDataGroupedByPackageName: groupCostManagementData(response.sowCostingEstimationData, 'workPackageName'), ResourceTypes: response.sowE3TResourceTypesMasters }
          let DeliveryDependency = CostManagementData?.CostManagementDataGroupedByPackageName[0]?.groupedWorkPackageData[0]?.deliveryDependency?.fieldDefaultValue
          CostManagementData.DeliveryDependency = parseInt(DeliveryDependency);

          SetCostManagementData(CostManagementData);
          CostManagementData?.CostManagementDataGroupedByPackageName.map((data, index) => {
            SetCostManagementDataCollapse((prev) => ({ ...prev, [index]: false }))
          });
          reset({ ...getValues(), ...CostManagementData });
          SetLoadingCostManagementData(false);
        });
    } catch (error) {
      SetLoadingCostManagementData(false);
    }
  }
  const groupCostManagementData = (inputData, groupByField) => _(inputData).groupBy(groupByField).map((groupedWorkPackageData, workPackageName) => {
    return ({ workPackageName, groupedWorkPackageData })
  }).value();

  const handleCostManagementDataCollapse = (costIndex) => {
    SetCostManagementDataCollapse((prevState) => ({ ...prevState, [costIndex]: !prevState[costIndex] }));
  }

  const handleRiskLevelDropDownChange = (event, costIndex) => {
    event.preventDefault();
    let CostManagementDataSpread = { ...CostManagementData }
    CostManagementDataSpread.CostManagementDataGroupedByPackageName[costIndex].groupedWorkPackageData.map(riskPackage => {
      riskPackage.riskRating = event.target.value;
    })
    reset({ ...getValues(), ...CostManagementDataSpread });
    SetCostManagementData(CostManagementDataSpread)
  }

  const handleDeliveryDependencyChange = (event) => {
    event.preventDefault();
    let CostManagementDataSpread = { ...CostManagementData }
    CostManagementDataSpread.DeliveryDependency = event.target.value;
    reset({ ...getValues(), ...CostManagementDataSpread });
    SetCostManagementData(CostManagementDataSpread)
  }

  const deGroupCostManagementData = (workPackageData) => {
    return workPackageData.groupedWorkPackageData;
  }

  const handleCostManagementSaveClick = (data) => {
    let CostManagementSavedData = _.flatMap(data.CostManagementDataGroupedByPackageName, deGroupCostManagementData);
    props.handleCostManagementSaveClick(CostManagementSavedData, data.DeliveryDependency);
  }

  const handleCostManagementAddNewRowClick = (costIndex, packageIndex, typeOfClick, event) => {
    event.preventDefault();
    let CostManagementDataSpread = { ...CostManagementData }
    if (typeOfClick === "inHeaderAddWorkPackage") {
      let defaultValues = { ...CostManagementDataSpread.CostManagementDataGroupedByPackageName[costIndex].groupedWorkPackageData[packageIndex] }
      defaultValues.id = null; defaultValues.isRemote = true; defaultValues.isActive = true; defaultValues.resourceId = ""; defaultValues.roleHours = 0;
      CostManagementDataSpread.CostManagementDataGroupedByPackageName[costIndex].groupedWorkPackageData.splice(0, 0, defaultValues);
    }
    else {
      CostManagementDataSpread.CostManagementDataGroupedByPackageName[costIndex].groupedWorkPackageData.splice(packageIndex + 1, 0,
        { ...CostManagementDataSpread.CostManagementDataGroupedByPackageName[costIndex].groupedWorkPackageData[packageIndex], id: null }
      );
    }
    SetCostManagementData(CostManagementDataSpread)
    reset({ ...getValues(), ...CostManagementDataSpread });
  };

  const handleCostManagementRowChange = (costIndex, packageIndex, name, event) => {
    let CostManagementDataSpread = { ...CostManagementData }
    if (name !== undefined && event !== undefined) {
      if (name === 'isActive') {
        CostManagementDataSpread.CostManagementDataGroupedByPackageName[costIndex].groupedWorkPackageData[packageIndex] =
          { ...CostManagementDataSpread.CostManagementDataGroupedByPackageName[costIndex].groupedWorkPackageData[packageIndex], [name]: event.target.checked }
      }
      else {
        CostManagementDataSpread.CostManagementDataGroupedByPackageName[costIndex].groupedWorkPackageData[packageIndex] =
          { ...CostManagementDataSpread.CostManagementDataGroupedByPackageName[costIndex].groupedWorkPackageData[packageIndex], [name]: event.target.value }
      }
    }
    else {
      CostManagementDataSpread.CostManagementDataGroupedByPackageName[costIndex].groupedWorkPackageData.splice(packageIndex, 1);
    }
    SetCostManagementData(CostManagementDataSpread)
    reset({ ...getValues(), ...CostManagementDataSpread });
  }
  const handleTShirtSizeChange = (tShirtId) => SetTshirtSizeSelected(parseInt(tShirtId))
  return (
    <>
      <Form onSubmit={handleSubmit(handleCostManagementSaveClick)}>
        <Modal.Body style={{ overflowY: 'auto', maxHeight: '500px' }}>
          {LoadingCostManagementData ? (
            <div className="text-center">
              <img className="loading-img" src={loader_logo} alt="loading"></img>
            </div>
          ) :
            <>
              <div key={'CostManagementFormHeader'} style={{ padding: '5px', border: '1px solid rgba(52, 73, 94, 0.94)' }}>
                <Row style={{ margin: '0px', display: 'flex', alignItems: 'center' }}>
                  <Table bordered hover>
                    <tbody>
                      <tr style={{ background: '#606A74', color: 'white' }}>
                        <td key={'typeOfWork'} style={{ padding: '10px', width: '33%' }}><b>{props.CostManagementData?.typeOfWork}</b></td>
                        <td key={'DeliveryDependency'} style={{ padding: '10px', width: '33%' }}>
                          <Row>
                            {CostManagementData?.CostManagementDataGroupedByPackageName[0]?.groupedWorkPackageData[0]?.deliveryDependency &&
                              <>
                                <Col sm={4}> <b>{CostManagementData?.CostManagementDataGroupedByPackageName[0]?.groupedWorkPackageData[0]?.deliveryDependency?.fieldName}: </b></Col>
                                <Col sm={8}>  <input type="number" min="0" step="1" className="form-control form-control-sm col-md-6"
                                  {...register(`DeliveryDependency`, { required: true, maxLength: 10, valueAsNumber: true })}
                                  onChange={(e) => handleDeliveryDependencyChange(e)} /></Col>
                              </>
                            }
                          </Row>
                        </td>
                        <td key={'sizingEstimate'} style={{ padding: '10px', width: '33%' }}>
                          <Row>
                            <Col sm={4}><b>Sizing Estimate:</b></Col>
                            <Col sm={8}>
                              <Form.Group className='form-check'>
                                {props.CostManagementData.sowEffortTshirtSizes.map((tShirt, i) => (
                                  <Form.Check
                                    key={`CostManagementData_TshirtSizes_${i}_${tShirt.id}`}
                                    checked={tShirt.id === TshirtSizeSelected}
                                    type={"radio"}
                                    inline
                                    label={tShirt.tshirtSize}
                                    value={tShirt.id}
                                    title={tShirt.value}
                                    onChange={() => handleTShirtSizeChange(tShirt.id)}
                                  />
                                ))}
                              </Form.Group>
                            </Col>
                          </Row>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Row>
                {CostManagementData?.CostManagementDataGroupedByPackageName.map((costData, costIndex) =>
                  <div key={'CostManagementForm_MainDiv' + costIndex}>
                    <div key={'CostManagementForm_' + costIndex} className="ac-sub" style={{ marginTop: '15px', border: '1px solid rgba(52,73,94,0.94)' }}>

                      <label className={`ac-label ac-label-${CostManagementDataCollapse[costIndex]}`} onClick={() => handleCostManagementDataCollapse(costIndex)}>
                        <span>
                          {CostManagementDataCollapse[costIndex] ? (
                            <i className="fas fa-chevron-down pr-5" />
                          ) : (
                            <i className="fas fa-chevron-right pr-5" />
                          )}
                        </span>
                        {costData.workPackageName}
                      </label>

                      {CostManagementDataCollapse[costIndex] ?
                        (
                          <>
                            <Row key={costIndex} style={{ marginTop: '5px' }}>
                              <Col md={{ span: 1, offset: 7 }}>
                                <h6>
                                  <Badge pill style={{ color: "white", background: "dimgrey" }}>Risk Level</Badge>
                                </h6>
                              </Col>
                              <Col md={2}>
                                <select className="form-control form-control-sm"
                                  {...register(`CostManagementDataGroupedByPackageName.${costIndex}.groupedWorkPackageData.0.riskRating`)}
                                  onChange={(e) => handleRiskLevelDropDownChange(e, costIndex)}>
                                  <option value="Low">Low</option>
                                  <option value="Medium">Medium</option>
                                  <option value="High">High</option>
                                </select>
                              </Col>
                              <Col md={2}>
                                {costData.groupedWorkPackageData[0].riskRating === "Low" && (
                                  <ProgressBar variant="success" now={33} />
                                )}
                                {costData.groupedWorkPackageData[0].riskRating === "Medium" && (
                                  <ProgressBar variant="warning" now={66} />
                                )}
                                {costData.groupedWorkPackageData[0].riskRating === "High" && (
                                  <ProgressBar variant="danger" now={99} />
                                )}
                              </Col>
                            </Row>
                            <div style={{ margin: '4px' }}>
                              <Table className="table table-bordered table-sm" hover>
                                <thead>
                                  <tr>
                                    <th>Remote</th>
                                    <th>Resource Type</th>
                                    <th>Resources</th>
                                    <th>Duration (Hours)</th>
                                    <th>Active</th>
                                    <th width='10px'>
                                      <Button onClick={(e) => handleCostManagementAddNewRowClick(costIndex, 0, 'inHeaderAddWorkPackage', e)} className="btn btn-success btn-sm sow-table-header-button mr-1">+</Button>
                                    </th>
                                    <th colSpan={1} style={{ width: '36px' }}>
                                      <span>&nbsp;</span>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {costData.groupedWorkPackageData.map((packageData, packageIndex) =>
                                    <tr key={packageData.id + packageIndex + costIndex}>
                                      <td>
                                        <select className="form-control form-control-sm"
                                          disabled={!packageData.isActive}
                                          {...register(`CostManagementDataGroupedByPackageName.${costIndex}.groupedWorkPackageData.${packageIndex}.isRemote`, {
                                            // required: packageData.isActive
                                          })}
                                          onChange={(e) => handleCostManagementRowChange(costIndex, packageIndex, 'isRemote', e)}>
                                          <option value={true}>Yes</option>
                                          <option value={false}>No</option>
                                        </select>
                                        {/* {errors.CostManagementDataGroupedByPackageName !== undefined ? errors?.CostManagementDataGroupedByPackageName[costIndex]?.groupedWorkPackageData[packageIndex]?.isRemote && <p style={{ color: 'red' }}>this is required</p> : ''} */}
                                      </td>
                                      <td>
                                        <select className="form-control form-control-sm"
                                          disabled={!packageData.isActive}
                                          {...register(`CostManagementDataGroupedByPackageName.${costIndex}.groupedWorkPackageData.${packageIndex}.resourceId`,
                                            {
                                              required: packageData.isActive,
                                              valueAsNumber: true
                                            })}
                                          onChange={(e) => handleCostManagementRowChange(costIndex, packageIndex, 'resourceId', e)}>
                                          {CostManagementData?.ResourceTypes.map((optionData, index) =>
                                            <option key={optionData.id} value={optionData.id}>{optionData.resourceType}</option>
                                          )}
                                        </select>
                                        {errors.CostManagementDataGroupedByPackageName !== undefined ? errors?.CostManagementDataGroupedByPackageName[costIndex]?.groupedWorkPackageData[packageIndex]?.resourceId && <p style={{ color: 'red' }}>this is required</p> : ''}
                                      </td>
                                      <td><input type="text" className="form-control form-control-sm" disabled={true} value={1} />
                                      </td>
                                      <td> <input type="number" min="0" step="0.10" className="form-control form-control-sm" disabled={!watch(`CostManagementDataGroupedByPackageName.${costIndex}.groupedWorkPackageData.${packageIndex}.isActive`)}
                                        {...register(`CostManagementDataGroupedByPackageName.${costIndex}.groupedWorkPackageData.${packageIndex}.roleHours`,
                                          { required: packageData.isActive, maxLength: 10, valueAsNumber: true })}
                                        onChange={(e) => handleCostManagementRowChange(costIndex, packageIndex, 'roleHours', e)}
                                      />
                                        {errors.CostManagementDataGroupedByPackageName !== undefined ? errors?.CostManagementDataGroupedByPackageName[costIndex]?.groupedWorkPackageData[packageIndex]?.roleHours && <p style={{ color: 'red' }}>this is required</p> : ''}
                                      </td>
                                      <td>
                                        {/* onChange={() => handleCostManagementRowChange(costIndex, packageIndex, 'isActive', undefined)} */}
                                        <Form.Check id={`iSActivePackageRow_${costIndex}_${packageIndex}`} type="switch" {...register(`CostManagementDataGroupedByPackageName.${costIndex}.groupedWorkPackageData.${packageIndex}.isActive`)}
                                          onChange={(e) => handleCostManagementRowChange(costIndex, packageIndex, 'isActive', e)}
                                        />
                                      </td>
                                      <td>
                                        {/* onChange={() => handleCostManagementRowChange(costIndex, packageIndex, 'isActive', undefined)} */}
                                        <Button onClick={(e) => handleCostManagementAddNewRowClick(costIndex, packageIndex, 'inRowAddWorkPackage', e)} className="btn btn-sm sow-table-header-button mr-1">+</Button>
                                      </td>
                                      <td>
                                        {CostManagementData.CostManagementDataGroupedByPackageName[costIndex].groupedWorkPackageData[packageIndex].id === null &&
                                          <Button onClick={() => handleCostManagementRowChange(costIndex, packageIndex, undefined, undefined)} className="btn btn-success new-btn-success btn-sm">-</Button>}
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </Table>
                            </div>
                          </>
                        ) :
                        (<></>)}

                    </div>
                  </div>
                )}
              </div>
            </>
          }
        </Modal.Body>
        <Modal.Footer className='cost-Modal'>
          <Row className="float-right" style={{ bottom: 0, position: 'sticky', paddingTop: '5px' }}>
            <Form.Group as={Col} controlId="footer" className='cost-form-group'>
              <Button onClick={props.handleCostManagementCloseClick} className="mr-2" variant="secondary">Close</Button>
              <Button className="mr-2"
                type='submit' variant="primary"
                disabled={props.LoadingGlobalText === `handleSaveCostManagementClickLoading` || TshirtSizeSelected === undefined}
              >
                {props.LoadingGlobalText === "handleSaveCostManagementClickLoading" ?
                  (<><i className="fa fa-spinner fa-spin" /> <span pt-r={3}>Saving</span></>) : "Save"}
              </Button>
            </Form.Group>
          </Row>
        </Modal.Footer>
      </Form >
    </>
  )
}
export default CostManagementForm;

export const defaultJsonCostManagementData = {
  "id": null,
  "typeOfWorkId": -1,
  "workPackageId": -1,
  "riskRating": "",
  "isRemote": undefined,
  "roleHours": 0,
  "deliveryId": -1,
  "createdBy": null,
  "createdDate": "",
  "modifiedBy": null,
  "modifiedDate": "",
  "isActive": true,
  "tshirtId": -1,
  "workPackageName": "",
  "resourceId": -1,
  "workPackage": {
    "id": null,
    "workPackage": "",
    "typeOfWorkId": -1,
    "moduleName": "RSM0a- Project Initiation",
    "domain": "Project",
    "createdBy": "SRCDec0921Ex",
    "createdDate": "2021-12-10T19:20:54.07",
    "modifiedBy": "SumanRCDec0921",
    "modifiedDate": "2021-12-10T19:20:54.07",
    "isActive": true,
    "displayOrder": 1,
    "priorityOrder": 2,
    "typeOfWork": null,
    "sowSolutionHubData": []
  },
  "deliveryDependency": {
    "id": null,
    "fieldName": "",
    "fieldType": "",
    "fieldDefaultValue": "0",
    "createdBy": "",
    "createdDate": "",
    "modifiedBy": "",
    "modifiedDate": "",
    "isActive": true
  }
}