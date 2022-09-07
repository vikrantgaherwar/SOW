import { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Button, Row, Spinner, Form, Col, CloseButton, Table, InputGroup } from "react-bootstrap";
import SOWFormFieldComponent from "../../../../SOW/Components/SOWFormFieldComponent";
import MyRow from "../../../../SOW/Components/MyRow";
import agent from "../../../API/agent";
import axios from 'axios'
import TextAreaFormField from '../../../Components/TextAreaFormField';
import Cookies from "js-cookie";
import bootbox from "bootbox";
const AddNewSolutionItemModal = ({
    addModalShow,
    handleAddSolutionClickClose,
    practiceDomainDropDownData,
    WorkItemNameList
}) => {
    const [SolutionName, setSolutionName] = useState("");
    const [domain, setDomain] = useState("");
    const [domainList, setDomainList] = useState([]);
    const [templateList, setTemplateList] = useState([]);
    const [editedSolutionNameError, setEditedSolutionNameError] = useState(false);
    const [editedSolutionNameErrorMessage, setEditedSolutionNameErrorMessage] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isPublished, setIsPublished] = useState(true);
    const [WorkPackageName, setWorkPackageName] = useState("");
    const [ModuleName, setModuleName] = useState("");
    const [editedWorkPackageNameError, setEditedWorkPackageNameError] = useState(false);
    const [editedWorkPackageNameMessage, setEditedWorkPackageNameMessage] = useState("");
    const [editedModuleNameError, setModuleNameError] = useState(false);
    const [editedModuleNameMessage, seteditedModuleNameMessage] = useState("");
    const [WorkPackageSectionsData, setWorkPackageSectionsData] = useState([]);
    const [SelectedTemplate, setSelectedTemplate] = useState([]);
    const [AddedWorkPackages, setAddedWorkPackage] = useState([]);
    const [showAddEditPackage, setShowAddEditPackage] = useState([]);
    const [isEditWorkPackageItem, setIsEditWorkPackageItem] = useState(false);
    const [editIndex, setEditIndex]= useState(-1);
    useEffect(() => {
      getTemplateIDListDropDown();
    }, []);

    useEffect(() => {
      // debugger;
      if (WorkItemNameList.length > 0 && WorkItemNameList?.indexOf(SolutionName) > -1 ){
        setEditedSolutionNameError(true);
        setEditedSolutionNameErrorMessage("Solution already exists!");
      }
      else if (SolutionName.trim().length === 0) {
        setEditedSolutionNameError(true);
        setEditedSolutionNameErrorMessage("Please assign a valid Solution name!");
      } else {
        setEditedSolutionNameError(false);
        setEditedSolutionNameErrorMessage("");
      }
    }, [SolutionName]);
    useEffect(() => {
      // debugger;
      if(!isEditWorkPackageItem && AddedWorkPackages.filter(x=>x.workPackage == WorkPackageName)?.length > 0){
        setEditedWorkPackageNameError(true);
        setEditedWorkPackageNameMessage("WorkPackage already exists!!");
      }
      else if (WorkPackageName.trim().length === 0) {
        setEditedWorkPackageNameError(true);
        setEditedWorkPackageNameMessage("Please assign a valid WorkPackage name!");
      } else {
        setEditedWorkPackageNameError(false);
        setEditedWorkPackageNameMessage("");
      }
    }, [WorkPackageName]);
    useEffect(()=>{
      if(ModuleName.trim().length === 0){
        setModuleNameError(true);
        seteditedModuleNameMessage("Please assign a valid Module name!");
      }
      else{
        setModuleNameError(false);
        seteditedModuleNameMessage("");
      }
    },[ModuleName])

    const getTemplateIDListDropDown = () =>{
      // debugger;
      agent.TemplateIDList.list(`api/SOWAdminWorkPackage/GetAllTemplateIdList`).then((response) => {
        // debugger;
        setTemplateList(
          response.map((el) => ({
            id: el.id,
            name: el.templateInputName,
          }))
        );
      });
    };
    const GetWorkPackageSectionsData = (TemplateID) =>{
      agent.GetWorkPackageSections.list(`api/Sow/GetWorkPackageSectionData?TemplateId=${TemplateID}`).then((response) => {
        // debugger;
        setWorkPackageSectionsData(response);
      });
    }


    useEffect(() => {
      if (practiceDomainDropDownData && practiceDomainDropDownData.length) {
        setDomainList(
          practiceDomainDropDownData.map((el) => ({
            id: el.domain,
            name: el.domain,
          }))
        );
      }
    }, [practiceDomainDropDownData]);

    const RemoveWorkPackage = (index) =>{
      if(AddedWorkPackages?.length == 1){
          setShowAddEditPackage(true);
      }
      setAddedWorkPackage(AddedWorkPackages.filter(item => item.id !== index))

    }

    const AddWorkPackageData = () =>{
       // debugger;
       var data = { id : AddedWorkPackages?.length + 1, 
        workPackage: WorkPackageName, 
        domain:domain,template: SelectedTemplate, 
        sowSolutionHubWorkPackages : WorkPackageSectionsData,
        moduleName : ModuleName
      };
      setAddedWorkPackage((prev)=> [...prev, data]);    
      setShowAddEditPackage(false);
      setSelectedTemplate("");
      setWorkPackageName("");
      setDomain("");
      setModuleName("");
      setWorkPackageSectionsData([]);
    }
    const SaveEditedWorkPackageItem = () =>{
      // debugger;
      var i = editIndex;
      let newArr = [...AddedWorkPackages]; 
      var data = { id : AddedWorkPackages?.length + 1, workPackage: WorkPackageName, domain:domain,template: SelectedTemplate, sowSolutionHubWorkPackages : WorkPackageSectionsData};
      newArr[editIndex] = data;
      setAddedWorkPackage(newArr);
      setEditIndex(-1);
      setShowAddEditPackage(false);
      setSelectedTemplate("");
      setWorkPackageName("");
      setDomain("");
      setModuleName("");
      setWorkPackageSectionsData([]);

    }
    const SubmitPredefinedSolution = ()=>{
        var data = {"TypeOfWork": SolutionName,
                     "IsActive" : isPublished, 
                     "WorkPackageVMs" : AddedWorkPackages, 
                     "CreatedBy": Cookies.get("name") }

        agent.AdminPredifinedModules.create(data).then((res) => {
          // debugger;
          if (res) {
            clearDataAndClose();
          }
        });
    }
    const clearDataAndClose = ()=>{


      var box = bootbox.confirm({
        size: "small",
        // title: "Duplicate!!",
        buttons: {
          
          confirm: {
            label: "Ok",
            // className: "btn btn-default custombutton",
            className: "btn btn-success btn-sm",
          },
          cancel: {
            label: "Cancel",
            // className: "btn btn-default custombutton",
            className: "btn btn-dark btn-sm",
          },
        },
        message:
          "<div>Unsaved data will be lost</div>",
        callback: (result) => {
          if (result) {
            setSolutionName("");
      setIsPublished(true);
      setShowAddEditPackage(true);
      setSelectedTemplate("");
      setWorkPackageName("");
      setDomain("");
      setModuleName("");
      setWorkPackageSectionsData([]);
      setAddedWorkPackage([]);
      handleAddSolutionClickClose();
          }
        },
      });
      box.find(".modal-content").css({
        "font-size": "13px",
        "padding-top": "10px",
        right: "50px",
        top: "150px",
        "max-width": "115%",
      });

      

    }
    const EditWorkPackage = (WorkPackageItem, index)=>{
      // debugger;
      setWorkPackageName(WorkPackageItem.workPackage);
      setDomain(WorkPackageItem.domain);
      setModuleName(WorkPackageItem.moduleName);
      setIsEditWorkPackageItem(true);
      setShowAddEditPackage(true);
      setSelectedTemplate(WorkPackageItem.template);
      setWorkPackageSectionsData(WorkPackageItem.sowSolutionHubWorkPackages);
      setEditIndex(index);
      // debugger;
    }
    const CancelAddWorkPackageData = () =>{
      setWorkPackageName("");
      setDomain("");
      setModuleName("");
      setIsEditWorkPackageItem(false);
      setShowAddEditPackage(false);
      setSelectedTemplate("");
      setWorkPackageSectionsData([]);
    }

    return (
        <>
        <Modal 
        id="adminAddSolutionItemModal" 
        size="lg" 
        centered 
        show={addModalShow} 
        dialogClassName="modal-dialog-scrollable custom-modal"
        aria-labelledby="contained-modal-title-vcenter"
        
        >
                <Modal.Header md={4}>
                    <Modal.Title>
                      Add Predefined Solution
                    </Modal.Title>
                    <CloseButton style={{float:'right'}} onClick={clearDataAndClose} />
                </Modal.Header>
          <Modal.Body>
                <MyRow>
                {editedSolutionNameError ? (
                <MyRow>
                  <Col xs={2}></Col>
                  <Col xs={8}>
                    <div className="text-danger md-3">
                      {editedSolutionNameErrorMessage}
                    </div>
                  </Col>
                </MyRow>
              ) : (
                <></>
              )}
                <SOWFormFieldComponent
                value={SolutionName}
                name="txtSolutionName"
                col={[2, 10]}
                title={
                  "Solution Name"
                }
                className={editedSolutionNameError ? "is-invalid" : ""}
                type="text"
                onChange={(e) => {
                    setSolutionName(e.target.value);
                  }}
                // disabled={isEditWorkPackage}
              />
            </MyRow>
            <MyRow>
            <SOWFormFieldComponent
              value={isPublished}
              type="checkbox"
              title="Publish"
              name="isPublished"
              onChange={() => setIsPublished((state) => !state)}
            />
          </MyRow>
          {AddedWorkPackages.length > 0 &&
           <Table id="table_workPackages" className="table table-sm tbl_solutions">
             <thead>
             <tr>
              <th>Package Name</th>
              <th>Actions</th>
             </tr>
             </thead>
             <tbody>
               
                 <>
                   {AddedWorkPackages?.map(
                     (item, index) => (
                      <tr key={index}>
                      <td style={{ width: '300px' }}>
                          {item.workPackage}
                      </td>
                      
                      <td style={{ width: '100px' }}>
                          <InputGroup>
                          <Button
                            onClick={() => EditWorkPackage(item,index)}
                            style={{ borderColor: "white" }}
                            className="btn btn-sm"
                            variant="outline-secondary"
                            title="Edit Package"
                          >
                            <i
                              style={{ color: "#0d5265" }}
                              className="fas fa-edit pr-2"
                            ></i>
                          </Button>

                          <Button
                            onClick={() => RemoveWorkPackage(item.id)}
                            style={{ borderColor: "white" }}
                            variant="outline-secondary"
                            title="Delete Package"
                          >
                              <i
                                style={{ color: "#ff8300" }}
                                className="fa fa-trash pr-2"
                              ></i>
                              
                          </Button>
                          </InputGroup>

                      </td>
                  </tr>
                     )
                   )}
                 </>
              
             </tbody>
           </Table>
          }
           {AddedWorkPackages.length > 0 && !showAddEditPackage &&
              <button data-testid="AddTableRow" type="button" title="Add Package"
              class="new-btn-success btn-sm  mr-2 btn btn-success float-right mr-2-primary"
              onClick={()=>{
                setShowAddEditPackage(!showAddEditPackage)
              }}
              >
              <i class="fas fa-plus fa-xs"></i>
              </button>
           }
                   
          {showAddEditPackage &&
          <>
          <MyRow>
          <div class="col">
            <div class="row">
              <div class="col-sm-2">
                <label class="form-label" for="form_txtWorkPackageName">
                  <b>{isEditWorkPackageItem == true ? "Edit WorkPackage" : "Add WorkPackage"}</b>
                </label>
              </div>
          </div>
          </div>
           </MyRow>
           <hr class="sow-titleline new-sow-titleline"></hr>
           {editedWorkPackageNameError ? (
                <MyRow>
                  <Col xs={2}></Col>
                  <Col xs={8}>
                    <div className="text-danger md-3">
                      {editedWorkPackageNameMessage}
                    </div>
                  </Col>
                </MyRow>
              ) : (
                <></>
              )}
           <SOWFormFieldComponent
                value={WorkPackageName}
                name="txtWorkPackageName"
                col={[2, 10]}
                title={
                  "WorkPackage Name"
                }
                disabled={
                  SolutionName.trim().length === 0 || editedSolutionNameError
                }
                className={editedWorkPackageNameError ? "is-invalid" : ""}
                type="text"
                onChange={(e) => {
                    setWorkPackageName(e.target.value);
            }}
                // disabled={isEditWorkPackage}
              />
             <MyRow>
              <SOWFormFieldComponent
                title="Practice Domain"
                type="select"
                name="domain"
                value={domain}
                list={domainList}
                onChange={(e) => {
                  if (!showError) {
                    setShowError(true);
                  }
                  setDomain(e.target.value)}}
                col={[2, 10]}
                // disabled={isEdit && ((workPackage?.value.length || editedWorkPackage.length) || customModulesDataFetchState === APIFetchStatus.FETCHING)}
              />
            </MyRow>
            {editedModuleNameError ? (
                <MyRow>
                  <Col xs={2}></Col>
                  <Col xs={8}>
                    <div className="text-danger md-3">
                      {editedModuleNameMessage}
                    </div>
                  </Col>
                </MyRow>
              ) : (
                <></>
              )}
            <MyRow>
              <SOWFormFieldComponent
                title="Module Name"
                type="text"
                name="ModuleName"
                value={ModuleName}
                onChange={(e) => {
                  setModuleName(e.target.value)}}
                col={[2, 10]}
                // disabled={isEdit && ((workPackage?.value.length || editedWorkPackage.length) || customModulesDataFetchState === APIFetchStatus.FETCHING)}
              />
            </MyRow>
           <MyRow>
              <SOWFormFieldComponent
                title="Template"
                type="select"
                name="Template"
                value={SelectedTemplate}
                list={templateList}
                onChange={(e) => {
                  if (!showError) {
                    setShowError(true);
                  }
                  setSelectedTemplate(e.target.value);
                  GetWorkPackageSectionsData(e.target.value);
                }}
                col={[2, 10]}
                // disabled={isEdit && ((workPackage?.value.length || editedWorkPackage.length) || customModulesDataFetchState === APIFetchStatus.FETCHING)}
              />
            </MyRow>
              {WorkPackageSectionsData && WorkPackageSectionsData.length > 0 && WorkPackageSectionsData?.map((item, index) => (
                <MyRow key={`${item.fieldName}${index}`}>
                  <Form.Group controlId={item.fieldName} className="col-md-12">
                    <TextAreaFormField
                      key={`dynamic${item.id}${index}`}
                      name={item.fieldName}
                      onChange={(val, name) => {
                        setWorkPackageSectionsData((prev) =>
                          prev.map((e) =>
                            e.fieldName === name ? { ...e, fieldDefaultValue: val } : { ...e }
                          )
                        );
                      }}
                      value={item.fieldDefaultValue !=null ? item.fieldDefaultValue : ""}
                      isPopup
                    />
                  </Form.Group>
                </MyRow>
              ))}
              {WorkPackageSectionsData && WorkPackageSectionsData.length > 0 && 
              <Row className="float-right" style={{margin:"auto", width:"50%"}}>
              {AddWorkPackageData.length > 0 &&
              <Button onClick={()=>{
                  CancelAddWorkPackageData()
                }} className="mr-2" variant="secondary">Cancel
              </Button>
              }
                <Button onClick={()=>{isEditWorkPackageItem ? SaveEditedWorkPackageItem() :
                  AddWorkPackageData()
                }}
                disabled={!WorkPackageSectionsData.some((e) =>
                  e.fieldDefaultValue?.trim()?.length > 0 &&
                  e.fieldDefaultValue?.trim() !== "<p><br/></p>" &&
                  e.fieldDefaultValue?.trim() !== "<p><br></p>"
                  ) || editedWorkPackageNameError || editedModuleNameError}
                className="mr-2" variant="primary">Add
              </Button>
              </Row>
              }
          </>
          }
          </Modal.Body>
          <Modal.Footer>
          <Row className="float-right">
            <Form.Group as={Col} controlId="footer" className='workpackage-modal-inputgroup'>
              <Button onClick={clearDataAndClose} className="mr-2" variant="secondary">Close</Button>
              <Button className="mr-2" onClick={()=>{SubmitPredefinedSolution()}}
                variant="primary" disabled={!editedWorkPackageNameError || AddedWorkPackages.length == 0 }>Save
              </Button>
            </Form.Group>
          </Row>
        </Modal.Footer>
        </Modal>
        </>
    );
}
export default AddNewSolutionItemModal;