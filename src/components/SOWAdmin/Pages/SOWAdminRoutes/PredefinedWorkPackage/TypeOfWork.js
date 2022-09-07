import React, { useEffect, useState, Fragment } from "react";
import agent from "../../../API/agent";
import "../../../CSS/work-package-admin.css";
import TypeOfWorkData from "./TypeOfWorkData";
import WorkPackage from "./WorkPackage";
import {
  Table,
  Col,
  FormControl,
  InputGroup,
  Row,
  OverlayTrigger,
  Tooltip,
  Button,
} from "react-bootstrap";
import axios from "axios";
import Pagination from "react-js-pagination";
import LoadingPlaceHolder from "../../../Components/LoadingPlaceHolder";
import WorkPackageModal from "./WorkPackageModal";
import TypeOfWorkForm from "./TypeOfWorkForm";
import CostManagementModal from "./CostManagementModal";
import CostManagementForm from "./CostManagementForm";
import TypeOfWorkEditModal from "./TypeOfWorkEditModal";
import TypeOfWorkEditForm from "./TypeOfWorkEditForm";
import AddNewSolutionItemModal from "./AddNewSolutionItemModal";
let cancelUsersSearchToken = undefined;
const TypeOfWork = (props) => {
  const [WorkPackagesData, SetWorkPackagesData] = useState([]);
  const [LoadingWorkPackages, SetLoadingWorkPackages] = useState(false);
  const [Collapse, SetCollapse] = useState({});
  const [WorkPackageModalShow, SetWorkPackageModalShow] = useState(false);
  const [AddSolutionItemShow, SetAddSolutionItemlShow] = useState(false);
  const [WorkPackageData, SetWorkPackageData] = useState({});
  const [PaginationActivePage, setPaginationActivePage] = useState(1);
  const [searchTypeOfWork, setSearchTypeOfWork] = useState("");
  const [LoadingGlobalText, SetLoadingGlobalText] = useState("noloading");
  const [CostManagementModalShow, SetCostManagementModalShow] = useState(false);
  const [CostManagementData, SetCostManagementData] = useState(undefined);
  const [TypeOfWorkEditModalShow, SetTypeOfWorkEditModalShow] = useState(false);
  const [TypeOfWorkEditData, SetTypeOfWorkEditData] = useState({});
  const [practiceDomainDropDownData, SetpracticeDomainDropDownData] = useState({});
  const [WorkItemNameList, SetWorkItemNameList] = useState({});
  const [TemplateList, setTemplateList] = useState([]);
  const [EditMode, setEditMode] = useState(false);

  useEffect(() => {
    getTypeOfWorkData(1, true);
    getPractiseDomainDropdown();
    getAllWorkItems();
    getTemplateIDListDropDown();
    return () => cancelUsersSearchToken?.cancel("users search token cancelled");
  }, []);
  const getTemplateIDListDropDown = () =>{
    agent.TemplateIDList.list(`api/SOWAdminWorkPackage/GetAllTemplateIdList`).then((response) => {
      // debugger;
      setTemplateList(
        response
      );
    });
  };
  const getAllWorkItems = () =>{
    agent.WorkItemNameList.list(`api/SOWAdminPreDefinedModule/GetAllWorkItems`).then((response) => {
      // debugger;
      SetWorkItemNameList(response);
    });
  };
  const getPractiseDomainDropdown = () =>{
    agent.DropDownData.list(`api/SOW/GetPracticeDomainDropdown`).then((response) => {
      // debugger;
      SetpracticeDomainDropDownData(response);
    });
  };
  const getTypeOfWorkData = (pageNumber, LoaderOnMountOnly = false) => {
    SetLoadingWorkPackages(true);
    if (LoaderOnMountOnly) {
      agent.TypeOfWorkManagement.list(
        `api/SOWAdminWorkPackage/GetTypeOfWorkData/${pageNumber}`
      ).then((response) => {
        SetWorkPackagesData(response);
        response.sowSolutionHubTypeOfWorks.map((typeOfWork) => {
          SetCollapse((prevstate) => ({
            ...prevstate,
            [typeOfWork.id]: false,
          }));
        });
        SetLoadingWorkPackages(false);
      });
    } else {
      agent.TypeOfWorkManagement.list(
        `api/SOWAdminWorkPackage/GetTypeOfWorkData/${pageNumber}`
      ).then((response) => {
        SetWorkPackagesData(response);
        SetLoadingWorkPackages(false);
      });
    }
  };
  const handleWorkPackageModalCloseClick = async () => {
    SetWorkPackageModalShow(false);
    SetLoadingGlobalText("noloading");
  };
  const handleWorkPackageEditClick = async (typeOfWork, packageData) => {
    SetLoadingGlobalText(
      `handleWorkPackageEditClickLoading_${packageData.id}_${typeOfWork.id}`
    );
    try {
      agent.TypeOfWorkManagement.list(
        `api/SOWAdminWorkPackage/GetTemplateIdList/${packageData.typeOfWorkId}/${packageData.id}`
      ).then((response) => {
        SetWorkPackageData({
          typeOfWorkId: typeOfWork.id,
          typeOfWork: typeOfWork.typeOfWork,
          packageId: packageData.id,
          workPackage: packageData.workPackage,
          WorkPackagesTemplatesList: response,
          modifiedBy: props.UserLoginInfo?.employeeName,
        });
        setEditMode(true);
        SetWorkPackageModalShow(true);
      });
    } catch (error) {
      setEditMode(false);
      SetLoadingGlobalText("noloading");
      SetWorkPackageModalShow(false);
    }
  };
  const handleAddPackage = (typeOfWork) =>{
    SetLoadingGlobalText(
      `handleWorkPackageEditClickLoading_${typeOfWork.id}`
    );
    try {
        SetWorkPackageData({
          typeOfWorkId: typeOfWork.id,
          typeOfWork: typeOfWork.typeOfWork,
          packageId: -1,
          workPackage: "",
          WorkPackagesTemplatesList: TemplateList,
          modifiedBy: props.UserLoginInfo?.employeeName,
        });
        setEditMode(false);
        SetWorkPackageModalShow(true);

    } catch (error) {
      SetLoadingGlobalText("noloading");
      SetWorkPackageModalShow(false);
    }

  }
  const handlePaginationPageChange = (pageNumber) => {
    setPaginationActivePage(pageNumber);
    getTypeOfWorkData(pageNumber, true);
  };
  const handleSearchChange = async (e) => {
    try {
      let searchText = e.target.value;
      setSearchTypeOfWork(searchText);
      if (cancelUsersSearchToken !== undefined) {
        cancelUsersSearchToken.cancel("api call cancelled due to new request");
      }
      cancelUsersSearchToken = axios.CancelToken.source();
      if (searchText.length < 1) {
        await getTypeOfWorkData(PaginationActivePage, true);
      } else {
        SetLoadingWorkPackages(true);
        await agent.TypeOfWorkManagement.listWithCancelToken(
          "api/SOWAdminWorkPackage/TypeOfWorkSearch/" + searchText,
          cancelUsersSearchToken.token
        ).then((response) => {
          SetWorkPackagesData(response);
          SetLoadingWorkPackages(false);
        });
      }
    } catch (error) {
      SetLoadingWorkPackages(false);
    }
  };
  const handleToggleCollapseClick = (e, typeOfWorkId) => {
    e.preventDefault();
    SetCollapse((prevState) => ({
      ...prevState,
      [typeOfWorkId]: !prevState[typeOfWorkId],
    }));
  };
  const handleAddSolutionHubData = (data) => {
    try {
      SetLoadingGlobalText("handleSaveSolutionHubDataLoading");
      agent.TypeOfWorkManagement.Add(
        "api/SOWAdminWorkPackage",
        data
      ).then((response) => {
        getTypeOfWorkData(PaginationActivePage);
        SetLoadingGlobalText("noloading");
        SetWorkPackageModalShow(false);
      });
      // axios.post("https://localhost:44322/api/SOWAdminWorkPackage",
      // data
      // ).then((response)=>{
      //   debugger;
      //   var res = response;
      // })
    } catch {
      SetLoadingGlobalText("noloading");
    }
  };
  const handleSaveSolutionHubData = (data) => {
    try {
      SetLoadingGlobalText("handleSaveSolutionHubDataLoading");
      agent.TypeOfWorkManagement.update(
        "api/SOWAdminWorkPackage/SowSolutionHubDataEdit/",
        data
      ).then((response) => {
        getTypeOfWorkData(PaginationActivePage);
        SetLoadingGlobalText("noloading");
        SetWorkPackageModalShow(false);
      });
    } catch {
      SetLoadingGlobalText("noloading");
    }
  };
  const handleDeleteWorkPackage = async (workPackage, typeOfWork) => {
    try {
      SetLoadingGlobalText(`handleDeleteWorkPackageClick_${workPackage.id}`);
      agent.TypeOfWorkManagement.delete(
        typeOfWork.id,
        workPackage.id,
        props.UserLoginInfo?.employeeName
      ).then((response) => {
        getTypeOfWorkData(PaginationActivePage);
        SetLoadingGlobalText("noloading");
      });
    } catch (error) {
      SetLoadingGlobalText("noloading");
    }
  };
  const handleCostManagementCloseClick = () => {
    SetCostManagementModalShow(false);
    SetLoadingGlobalText("noloading");
  };
  const handleCostManagementEditClick = async (typeOfWorkInfo) => {
    SetCostManagementData(typeOfWorkInfo);
    SetCostManagementModalShow(true);
  };
  const handleAddNewPredefinedSolution = () => {
    SetAddSolutionItemlShow(true);
  };
  const handleAddSolutionClickClose = () => {
    SetAddSolutionItemlShow(false);
  };
  const handleCostManagementSaveClick = (
    costManagementData,
    deliveryDependency
  ) => {
    SetLoadingGlobalText("handleSaveCostManagementClickLoading");
    try {
      var costManagementDataToUpdate = {
        sowCostingEstimationData: costManagementData,
        modifiedBy: props.UserLoginInfo?.employeeName,
        deliveryDependency,
      };
      agent.CostManagement.update(costManagementDataToUpdate).then(
        (response) => {
          SetCostManagementModalShow(false);
          SetLoadingGlobalText("noloading");
        }
      );
    } catch (error) {
      SetLoadingGlobalText("noloading");
    }
  };
  const handleTypeOfWorkEditClick = (e, typeOfWork) => {
    e.preventDefault();
    SetTypeOfWorkEditData(typeOfWork);
    SetTypeOfWorkEditModalShow(true);
  };
  const handleTypeOfWorkEditClickClose = () => {
    SetTypeOfWorkEditModalShow(false);
  };
  const handleTypeOfWorkEditSaveClick = (data) => {
    var typeOfWorkEditData = {
      typeOfWorkId: data.id,
      typeOfWork: data.typeOfWork,
      modifiedBy: props.UserLoginInfo?.employeeName,
    };
    SetLoadingGlobalText("handlTypeOfWorkEditClickLoading");
    try {
      agent.TypeOfWorkManagement.update(
        "api/SOWAdminWorkPackage/EditSowTypeOfWorkName/",
        typeOfWorkEditData
      ).then((response) => {
        SetLoadingGlobalText("noloading");
        SetTypeOfWorkEditModalShow(false);
        getTypeOfWorkData(PaginationActivePage, true);
      });
    } catch {
      SetLoadingGlobalText("noloading");
    }
  };
  return (
    <>
      <>
        <Row className="mb-3">
          <Col md={4}>
            <OverlayTrigger
              trigger={["hover", "focus"]}
              placement="right"
              overlay={<Tooltip>Search is based on Module Name</Tooltip>}
            >
              <InputGroup>
                <FormControl
                  placeholder="Search"
                  value={searchTypeOfWork}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </OverlayTrigger>
            ,
          </Col>
          <Col>
            <Button
              onClick={handleAddNewPredefinedSolution}
              className="float-right"
              variant="secondary"
            >
              <i
                style={{ color: "white" }}
                className="far fa-file-alt  history-panel-icon-size"
              ></i>{" "}
              &nbsp;New
            </Button>
          </Col>
        </Row>
        <div className="sow-table-container">
          <Table style={{ border: "1px solid grey" }} hover>
            <thead>
              <tr
                className="sow-admin-tr"
                style={{ top: 0, position: "sticky", zIndex: "1" }}
              >
                <th></th>
                <th>Solution Name</th>
                <th>Is Active</th>
                <th>Created By</th>
                <th>Created On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {LoadingWorkPackages ? (
                <LoadingPlaceHolder rows={10} columns={6} />
              ) : (
                <>
                  {WorkPackagesData?.sowSolutionHubTypeOfWorks?.map(
                    (typeOfWork, index) => (
                      <Fragment key={`TypeOfWorkPackage_${typeOfWork.id}`}>
                        <TypeOfWorkData
                          key={`TypeOfWorkData_${typeOfWork.id}`}
                          typeOfWork={typeOfWork}
                          show={Collapse[typeOfWork.id]}
                          handleToggleCollapseClick={handleToggleCollapseClick}
                          handleCostManagementEditClick={
                            handleCostManagementEditClick
                          }
                          handleTypeOfWorkEditClick={handleTypeOfWorkEditClick}
                        ></TypeOfWorkData>
                        {Collapse[typeOfWork.id] ? (
                          <WorkPackage
                            key={`WorkPackage_${typeOfWork.id}`}
                            packagelist={typeOfWork.sowSolutionHubWorkPackages}
                            typeOfWork={typeOfWork}
                            handleWorkPackageEditClick={
                              handleWorkPackageEditClick
                            }
                            handleDeleteWorkPackage={handleDeleteWorkPackage}
                            LoadingGlobalText={LoadingGlobalText}
                            handleAddPackage={handleAddPackage}
                          ></WorkPackage>
                        ) : (
                          <></>
                        )}
                      </Fragment>
                    )
                  )}
                </>
              )}
            </tbody>
          </Table>
        </div>
      </>
      {WorkPackagesData?.tyepOfWorkCount > 10 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row-reverse",
          }}
        >
          <Pagination
            aria-label="Page"
            prevPageText="Prev"
            nextPageText="Next"
            activePage={PaginationActivePage}
            itemsCountPerPage={10}
            totalItemsCount={WorkPackagesData?.tyepOfWorkCount}
            pageRangeDisplayed={3}
            onChange={handlePaginationPageChange}
          />
        </div>
      )}
      <WorkPackageModal
        WorkPackageModalShow={WorkPackageModalShow}
        handleWorkPackageModalCloseClick={handleWorkPackageModalCloseClick}
        EditMode={EditMode}
      >
        <TypeOfWorkForm
          handleWorkPackageModalCloseClick={handleWorkPackageModalCloseClick}
          WorkPackageData={WorkPackageData}
          handleSaveSolutionHubData={handleSaveSolutionHubData}
          Loading={LoadingGlobalText}
          EditMode={EditMode}
          handleAddSolutionHubData={handleAddSolutionHubData}
        ></TypeOfWorkForm>
      </WorkPackageModal>
      <CostManagementModal
        costManagementModalShow={CostManagementModalShow}
        handleCostManagementCloseClick={handleCostManagementCloseClick}
      >
        <CostManagementForm
          CostManagementData={CostManagementData}
          handleCostManagementCloseClick={handleCostManagementCloseClick}
          handleCostManagementSaveClick={handleCostManagementSaveClick}
          LoadingGlobalText={LoadingGlobalText}
        ></CostManagementForm>
      </CostManagementModal>
      <TypeOfWorkEditModal
        editShow={TypeOfWorkEditModalShow}
        handleTypeOfWorkEditClickClose={handleTypeOfWorkEditClickClose}
      >
        <TypeOfWorkEditForm
          typeOfWorkData={TypeOfWorkEditData}
          handleTypeOfWorkEditClickClose={handleTypeOfWorkEditClickClose}
          handleTypeOfWorkEditSaveClick={handleTypeOfWorkEditSaveClick}
          Loading={LoadingGlobalText}
        ></TypeOfWorkEditForm>
      </TypeOfWorkEditModal>
      <AddNewSolutionItemModal
       addModalShow={AddSolutionItemShow}
       handleAddSolutionClickClose={handleAddSolutionClickClose}
       practiceDomainDropDownData={practiceDomainDropDownData}
       WorkPackageData={WorkPackageData}
       WorkItemNameList={WorkItemNameList}
       >
       

      </AddNewSolutionItemModal>
    </>
  );
};

export default TypeOfWork;
