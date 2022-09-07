import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Col,
  FormControl,
  InputGroup,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import agent from "../../../API/agent";
import Pagination from "react-js-pagination";
import UserModalPopUp from "./UserModal";
import UserAddEditForm from "./UsersForm";
import LoadingPlaceHolder from "../../../Components/LoadingPlaceHolder";
import axios from "axios";
let cancelUsersSearchToken = undefined;
export const Users = (props) => {
  const [UsersInformation, SetUsersInformation] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState();
  const [PaginationActivePage, setPaginationActivePage] = useState(1);
  const [showModalAddEditUser, setshowModalAddEditUser] = useState(false);
  const [EmployeeDetails, setEmployeeDetails] = useState({});
  const [EditMode, setEditMode] = useState(false);
  const [searchEmployee, setSearchEmployee] = useState("");
  const [LoadingGlobalText, SetLoadingGlobalText] = useState("noloading");
  useEffect(() => {
    getUserData(1, true);
    return () => cancelUsersSearchToken?.cancel("users search token cancelled");
  }, []);

  const getUserData = async (pageNumber, LoaderOnMountOnly = false) => {
    if (LoaderOnMountOnly) {
      setLoadingUsers(true);
      await agent.UserManagement.list(
        "api/SOWAdminUser/GetSowUsersInformation/" + pageNumber
      )
        .then((userInfo) => SetUsersInformation(userInfo))
        .finally(() => setLoadingUsers(false));
    } else {
      await agent.UserManagement.list(
        "api/SOWAdminUser/GetSowUsersInformation/" + pageNumber
      ).then((userInfo) => SetUsersInformation(userInfo));
    }
  };
  const handlePaginationPageChange = (pageNumber) => {
    setPaginationActivePage(pageNumber);
    getUserData(pageNumber, true);
  };
  const handleAddEditUserClick = (mode, empID) => {
    setEditMode(mode);
    if (mode === true) {
      const sowUserInfo = UsersInformation.sowUsers.filter(
        (u) => u.id === empID
      );
      setEmployeeDetails(...sowUserInfo);
    } else {
      setEmployeeDetails({});
    }
    setshowModalAddEditUser(true);
  };

  const handleDeleteUserClick = (empID) => {
    SetLoadingGlobalText(`handleDeleteUserClickLoading_${empID}`);
    agent.UserManagement.delete(`${empID}`)
      .then((response) => {
        getUserData(PaginationActivePage);
        SetLoadingGlobalText("noloading");
      })
      .catch(() => SetLoadingGlobalText("noloading"));
  };

  const handleModalCloseClick = () => {
    setshowModalAddEditUser(false);
    setEmployeeDetails({});
    SetLoadingGlobalText("noloading");
  };

  const handleAddEditUserSaveClick = async (data, e) => {
    setEmployeeDetails(data);
    SetLoadingGlobalText("handleAddEditUserSaveClickLoading");
    try {
      if (EditMode === true) {
        data.modifiedBy = props.UserLoginInfo?.employeeName;
        data.createdBy = props.UserLoginInfo?.employeeName;
        await agent.UserManagement.update(data).then(async (response) => {
          if (searchEmployee === "") {
            getUserData(PaginationActivePage);
            SetLoadingGlobalText("noloading");
          } else {
            await agent.UserManagement.list(
              "api/SOWAdminUser/SearchUsers/" + searchEmployee
            ).then((response) => {
              SetUsersInformation(response);
              SetLoadingGlobalText("noloading");
            });
          }
          setshowModalAddEditUser(false);
        });
      } else {
        data.createdBy = props.UserLoginInfo?.employeeName;
        data.modifiedBy = props.UserLoginInfo?.employeeName;
        await agent.UserManagement.create(data).then((response) => {
          if (searchEmployee === "") {
            getUserData(PaginationActivePage);
            SetLoadingGlobalText("noloading");
          } else {
            agent.UserManagement.list(
              "api/SOWAdminUser/SearchUsers/" + searchEmployee
            ).then((response) => {
              SetUsersInformation(response);
              SetLoadingGlobalText("noloading");
            });
          }
          setshowModalAddEditUser(false);
        });
      }
    } catch (error) {
      SetLoadingGlobalText("noloading");
    }
  };
  const handleModalEmployeeSearchClick = async (emp) => {
    SetLoadingGlobalText("handleModalEmployeeSearchClickLoading");
    try {
      await agent.UserManagement.details(
        `api/SOWAdminUser/AddSowUserSearchLdap?empNumber=${emp.empNumber}`
      ).then((data) => {
        setEmployeeDetails(data);
        SetLoadingGlobalText("noloading");
      });
    } catch (error) {
      SetLoadingGlobalText("noloading");
    }
  };
  const handleSearchChange = async (e) => {
    try {
      let searchText = e.target.value;
      setSearchEmployee(searchText);
      if (cancelUsersSearchToken !== undefined) {
        cancelUsersSearchToken.cancel("api call cancelled due to new request");
      }
      cancelUsersSearchToken = axios.CancelToken.source();
      if (searchText.length < 1) {
        await getUserData(PaginationActivePage, true);
      } else {
        setLoadingUsers(true);
        await agent.UserManagement.listWithCancelToken(
          "api/SOWAdminUser/SearchUsers/" + searchText,
          cancelUsersSearchToken.token
        ).then((response) => {
          SetUsersInformation(response);
          setLoadingUsers(false);
        });
      }
    } catch (error) {
      setLoadingUsers(false);
    }
  };
  return (
    <>
      <Row className="mb-3">
        <Col md={4}>
          <OverlayTrigger
            trigger={["hover", "focus"]}
            placement="right"
            overlay={
              <Tooltip>
                Search is based on Employee Number,Name and Mail
              </Tooltip>
            }
          >
            <InputGroup>
              <FormControl
                placeholder="Search"
                value={searchEmployee}
                onChange={handleSearchChange}
              />
            </InputGroup>
          </OverlayTrigger>
          ,
        </Col>
        <Col>
          <Button
            onClick={() => handleAddEditUserClick(false, "")}
            className="float-right"
            variant="secondary"
          >
            <i style={{ color: "white" }} className="fa fa-user-plus"></i>{" "}
            &nbsp;Add User
          </Button>
        </Col>
      </Row>
      <div className="sow-table-container">
        <Table hover>
          <thead>
            <tr
              className="sow-admin-tr"
              style={{
                top: 0,
                position: "sticky",
                zIndex: "1",
              }}
            >
              <th>Employee Number</th>
              <th>Employee Name</th>
              <th>Mail</th>
              <th>Active</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingUsers ? (
              <LoadingPlaceHolder />
            ) : (
              <>
                {UsersInformation.sowUsers &&
                  UsersInformation.sowUsers.map((emp) => (
                    <tr key={emp.employeeNumber + emp.id}>
                      <td>{emp.employeeNumber}</td>
                      <td>{emp.employeeName}</td>
                      <td>{emp.emailId}</td>
                      <td>
                        {" "}
                        &nbsp;{" "}
                        {emp.isActive ? (
                          <i
                            style={{ color: "green" }}
                            className="fa fa-check"
                          ></i>
                        ) : (
                          <i
                            style={{ color: "red" }}
                            className="fa fa-times"
                          ></i>
                        )}
                      </td>
                      <td style={{ width: "78px" }}>
                        {emp.roles &&
                          emp.roles.map((role, idx) => (
                            <Badge
                              key={`${role.id}_${idx}`}
                              mr={7}
                              pill
                              style={{
                                color: "white",
                                background: "gray",
                                padding: "",
                              }}
                            >
                              {role.roleName}
                            </Badge>
                          ))}
                      </td>
                      <td style={{ padding: "5px" }}>
                        <InputGroup>
                          <Button
                            onClick={() => handleAddEditUserClick(true, emp.id)}
                            style={{ borderColor: "white" }}
                            className="btn btn-sm"
                            variant="outline-secondary"
                          >
                            <i
                              style={{ color: "#0d5265" }}
                              className="fas fa-edit pr-2"
                            ></i>
                          </Button>

                          <Button
                            disabled={
                              !emp.isActive ||
                              LoadingGlobalText ===
                                `handleDeleteUserClickLoading_${emp.id}`
                            }
                            onClick={() => handleDeleteUserClick(emp.id)}
                            style={{ borderColor: "white" }}
                            variant="outline-secondary"
                          >
                            {LoadingGlobalText ===
                            `handleDeleteUserClickLoading_${emp.id}` ? (
                              <i
                                style={{ color: "dodgerblue" }}
                                className="fa fa-spinner fa-spin"
                              />
                            ) : (
                              <i
                                style={{ color: "#ff8300" }}
                                className="fa fa-trash pr-2"
                              ></i>
                            )}
                          </Button>
                        </InputGroup>
                      </td>
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        </Table>
      </div>

      <UserModalPopUp
        Loading={LoadingGlobalText}
        EditMode={EditMode}
        handleModalSearchClick={handleModalEmployeeSearchClick}
        handleCloseClick={handleModalCloseClick}
        showModal={showModalAddEditUser}
      >
        <UserAddEditForm
          Loading={LoadingGlobalText}
          rolesOptions={UsersInformation.sowRoles}
          EditMode={EditMode}
          EmployeeDetails={EmployeeDetails}
          handleCloseClick={handleModalCloseClick}
          handleSaveClick={handleAddEditUserSaveClick}
        />
      </UserModalPopUp>

      {UsersInformation.sowUsersCount > 5 && (
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
            totalItemsCount={UsersInformation.sowUsersCount}
            pageRangeDisplayed={3}
            onChange={handlePaginationPageChange}
          />
        </div>
      )}
    </>
  );
};
export default Users;
