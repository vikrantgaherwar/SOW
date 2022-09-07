import { useState, useEffect, Fragment, useQuery } from "react";
import agent from "../../../API/agent";
import "../../../CSS/custom-modules-admin.css";
import loader_logo from "../../../Images/loading-icon-animated.gif";
import moment from "moment";
import {
  InputGroup,
  Button,
  Table,
  Tooltip,
  Row,
  Col,
  OverlayTrigger,
  FormControl,
} from "react-bootstrap";
import axios from "axios";
import Pagination from "react-js-pagination";
import CustomModulesData from "./CustomModulesData";
import CustomModulesWorkPackages from "./CustomModulesWorkPackages";
import CustomModulesWorkPackageModal from "./CustomModulesWorkPackageModal";
import CustomModulesWorkPackageFrom from "./CustomModulesWorkPackageForm";
import LoadingPlaceHolder from "../../../Components/LoadingPlaceHolder";
import { toast } from "react-toastify";
let cancelUsersSearchToken = undefined;
const CustomModulesAdmin = (props) => {
  const [customModulesData, setCustomModulesData] = useState(undefined);
  const [modulesDataToApprove, SetModulesDataToApprove] = useState(undefined);
  const [loader, SetLoader] = useState(false);
  const [searchTypeOfWork, setSearchTypeOfWork] = useState("");
  const [collapse, SetCollapse] = useState({});
  const [workPackagesData, SetWorkPackageData] = useState(undefined);
  const [workPackageModalShow, SetWorkPackageModalShow] = useState(false);
  const [loadingGlobalText, SetLoadingGlobalText] = useState("noLoading");
  const [paginationActivePage, SetPaginationActivePage] = useState(1);
  useEffect(() => {
    var customModuleName = new URLSearchParams(window.location.search).get(
      "searchValue"
    );
    console.log(customModuleName);
    GetCustomModulesTypeOfWorkData(
      customModuleName != null ? customModuleName : "",
      customModuleName != null ? 0 : 1,
      true
    );
  }, []);

  const GetCustomModulesTypeOfWorkData = (
    moduleName,
    pageNumber,
    LoaderOnMountOnly = false
  ) => {
    SetLoader(true);
    setSearchTypeOfWork(moduleName);
    if (LoaderOnMountOnly) {
      agent.CustomModulesApproval.list(
        `api/SOWAdminCustomModules/GetCustomModulesTypeOfWork?moduleName=${moduleName}&pageNumber=${pageNumber}`
      ).then((response) => {
        SetLoader(false);
        setCustomModulesData(response);
        response.customModules.map((typeOfWork) => {
          SetCollapse((prevstate) => ({
            ...prevstate,
            [typeOfWork.id]: false,
          }));
        });
        if (pageNumber === 0 && response.customModules.length === 0) {
          toast.success(moduleName + " is already Approved");
        }
      });
    } else {
      agent.CustomModulesApproval.list(
        `api/SOWAdminCustomModules/GetCustomModulesTypeOfWork?moduleName=${moduleName}&pageNumber=${pageNumber}`
      ).then((response) => {
        // console.log(response);
        SetLoader(false);
        setCustomModulesData(response);
      });
    }
    GetModuleDataToApprove();
  };
  const GetModuleDataToApprove = () => {
    agent.CustomModulesApproval.list(
      "api/SOWAdminCustomModules/GetCustomModulesTypeOfWorkToApprove"
    ).then((response) => {
      SetModulesDataToApprove(response);
    });
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
        await GetCustomModulesTypeOfWorkData("", paginationActivePage, true);
      } else {
        SetLoader(true);
        await agent.CustomModulesApproval.listWithCancelToken(
          `api/SOWAdminCustomModules/GetCustomModulesTypeOfWork?moduleName=${searchText}&pageNumber=${paginationActivePage}`,
          cancelUsersSearchToken.token
        ).then((response) => {
          console.log(response);
          setCustomModulesData(response);
          SetLoader(false);
        });
      }
    } catch (error) {
      SetLoader(false);
    }
  };
  const handlePaginationPageChange = (pageNumber) => {
    console.log(pageNumber);
    SetPaginationActivePage(pageNumber);
    GetCustomModulesTypeOfWorkData(searchTypeOfWork, pageNumber, true);
  };
  const handleToggleCollapseClick = (e, moduledId) => {
    e.preventDefault();
    SetCollapse((prevState) => ({
      ...prevState,
      [moduledId]: !prevState[moduledId],
    }));
  };
  const handleWorkPackageShowClick = (typeOfWork, workPackage) => {
    SetLoadingGlobalText(
      `handleWorkPackageEditClickLoading_${workPackage.id}_${typeOfWork.id}`
    );
    try {
      agent.CustomModulesApproval.list(
        `api/SOWAdminCustomModules/GetTemplateIdList/${typeOfWork.id}/${workPackage.id}`
      ).then((response) => {
        SetWorkPackageData({
          typeOfWorkId: typeOfWork.id,
          typeOfWork: typeOfWork.typeOfWork,
          packageId: workPackage.id,
          workPackage: workPackage.workPackage,
          templatesList: response,
          modifiedBy: props.UserLoginInfo?.employeeName,
        });
        console.log(workPackagesData);
        SetWorkPackageModalShow(true);
      });
    } catch (error) {
      SetLoadingGlobalText("noloading");
      SetWorkPackageModalShow(false);
    }
  };
  const handleWorkPackageModalCloseClick = () => {
    SetLoadingGlobalText("noLoading");
    SetWorkPackageModalShow(false);
  };
  const handleToApproveCustomModule = (typeOfWork, actionType) => {
    SetLoadingGlobalText(`handleCustomModuleToApproveClick_${typeOfWork.id}`);
    console.log(typeOfWork, actionType);
    agent.CustomModulesApproval.update(
      "api/SOWAdminCustomModules/ApproveCustomModule/",
      typeOfWork
    ).then((response) => {
      console.log(response);
      SetLoadingGlobalText("noLoading");
      GetCustomModulesTypeOfWorkData("", paginationActivePage);
    });
  };
  return (
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
              <th>Modified On</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loader ? (
              <LoadingPlaceHolder rows={10} columns={7} />
            ) : (
              <>
                {customModulesData?.customModules?.map(
                  (customModule, index) => (
                    <Fragment key={index}>
                      <CustomModulesData
                        customModule={customModule}
                        show={collapse[customModule.id]}
                        modulesDataToApprove={modulesDataToApprove}
                        handleToggleCollapseClick={handleToggleCollapseClick}
                        handleToApproveCustomModule={
                          handleToApproveCustomModule
                        }
                        loadingModuleToApprove={loadingGlobalText}
                      ></CustomModulesData>
                      {collapse[customModule.id] ? (
                        <CustomModulesWorkPackages
                          key={`WorkPackage_${customModule.id}`}
                          packagelist={
                            customModule.sowCustomModulesWorkPackages
                          }
                          customModule={customModule}
                          handleWorkPackageShowClick={
                            handleWorkPackageShowClick
                          }
                          // handleDeleteWorkPackage={handleDeleteWorkPackage}
                          LoadingGlobalText={loadingGlobalText}
                        ></CustomModulesWorkPackages>
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
      {customModulesData?.totalCount > 10 && (
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
            activePage={paginationActivePage}
            itemsCountPerPage={10}
            totalItemsCount={customModulesData?.totalCount}
            pageRangeDisplayed={3}
            onChange={handlePaginationPageChange}
          />
        </div>
      )}
      <CustomModulesWorkPackageModal
        WorkPackageModalShow={workPackageModalShow}
        handleWorkPackageModalCloseClick={handleWorkPackageModalCloseClick}
      >
        <CustomModulesWorkPackageFrom
          handleWorkPackageModalCloseClick={handleWorkPackageModalCloseClick}
          WorkPackageData={workPackagesData}
          // handleSaveSolutionHubData={handleSaveSolutionHubData}
          // Loading={LoadingGlobalText}
        ></CustomModulesWorkPackageFrom>
      </CustomModulesWorkPackageModal>
    </>
  );
};

export default CustomModulesAdmin;
