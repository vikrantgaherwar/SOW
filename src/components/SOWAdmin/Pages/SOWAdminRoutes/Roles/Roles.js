import React, { useEffect, useState } from "react";
import {
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
import moment from "moment";
import RolesModalPopUp from "./RoleModal";
import RoleAddEditForm from "./RoleForm";
import LoadingPlaceHolder from "../../../Components/LoadingPlaceHolder";

export const Roles = (props) => {
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [showModalAddEditRole, setshowModalAddEditRole] = useState(false);
  const [roleDetails, setRoleDetails] = useState({ isActive: true });
  const [EditMode, setEditMode] = useState(false);
  const [DeleteMode, setDeleteMode] = useState(false);
  const [LoadingGlobalText, SetLoadingGlobalText] = useState("noloading");
  useEffect(() => {
    getRoleData(true);
  }, []);

  const getRoleData = async (LoaderOnMountOnly = false) => {
    if (LoaderOnMountOnly) {
      setLoadingRoles(true);
      await agent.RolesManagement.list("api/SOWAdminUser/GetSowRoles")
        .then((res) => setRoles(res))
        .finally(() => setLoadingRoles(false));
    } else {
      await agent.RolesManagement.list("api/SOWAdminUser/GetSowRoles").then(
        (res) => setRoles(res)
      );
    }
  };

  const handleAddEditRoleClick = (mode, roleId) => {
    setEditMode(mode);
    if (mode === true) {
      const role = roles.filter((x) => x.id === roleId);
      setRoleDetails(...role);
    } else {
      setRoleDetails({ isActive: true });
    }
    setshowModalAddEditRole(true);
  };

  const handleModalCloseClick = () => {
    setDeleteMode(false);
    setshowModalAddEditRole(false);
    setRoleDetails({ isActive: true });
    SetLoadingGlobalText("noloading");
  };

  const handleAddEditRoleSaveClick = async (data, e) => {
    setRoleDetails(data);
    try {
      SetLoadingGlobalText("handleAddEditRoleSaveClickLoading");
      if (DeleteMode) {
        await agent.RolesManagement.delete(
          "api/SOWAdminUser/DeleteSowRole/" + data.id
        ).then((res) => {
          setDeleteMode(false);
          SetLoadingGlobalText("noloading");
          getRoleData();
        });
      } else if (EditMode) {
        data.modifiedBy = props.UserLoginInfo?.employeeName;
        data.modifiedUserId = props.UserLoginInfo?.id;
        await agent.RolesManagement.update(data).then((res) => {
          SetLoadingGlobalText("noloading");
          setshowModalAddEditRole(false);
          getRoleData();
        });
      } else {
        data.createdBy = props.UserLoginInfo?.employeeName;
        data.createdUserId = props.UserLoginInfo?.id;
        data.modifiedBy = props.UserLoginInfo?.employeeName;
        data.modifiedUserId = props.UserLoginInfo?.id;
        await agent.RolesManagement.create(data).then((res) => {
          SetLoadingGlobalText("noloading");
          setshowModalAddEditRole(false);
          getRoleData();
        });
      }
      setRoleDetails({ isActive: true });
    } catch (error) {
      SetLoadingGlobalText("noloading");
    }
  };
  const handleDeleteRoleClick = (mode, roleId) => {
    setDeleteMode(true);
    if (mode === true) {
      const role = roles.filter((x) => x.id === roleId);
      setRoleDetails(...role);
    }
  };

  const searchRole = async (e) => {
    try {
      var searchText = e.target.value;
      if (searchText.length < 1) await getRoleData();
      else
        await agent.RolesManagement.list(
          "api/SOWAdminUser/SearchRole/" + searchText
        ).then((res) => {
          setRoles(res);
        });
    } catch (error) {}
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
                Search is based on Role Name,Created and Modified By
              </Tooltip>
            }
          >
            <InputGroup>
              <FormControl placeholder="Search" onChange={searchRole} />
            </InputGroup>
          </OverlayTrigger>
          ,
        </Col>
        <Col>
          <Button
            className="float-right"
            variant="secondary"
            onClick={() => handleAddEditRoleClick(false, "")}
          >
            <i style={{ color: "white" }} className="fa fa-user-plus"></i>{" "}
            &nbsp;Add Role
          </Button>
        </Col>
      </Row>
      <div className="sow-table-container">
        <Table hover>
          <thead>
            <tr className="sow-admin-tr">
              <th>Role Id</th>
              <th>Role Name</th>
              <th>Is Active</th>
              <th>Created By</th>
              <th>Created On</th>
              <th>Modified By</th>
              <th>Modified On</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingRoles && <LoadingPlaceHolder rows={3} columns={9} />}
            {roles &&
              roles.map((role) => (
                <tr key={role.id}>
                  <td>{role.id}</td>
                  <td>{role.roleName}</td>
                  <td>
                    {" "}
                    &nbsp;{" "}
                    {role.isActive ? (
                      <i style={{ color: "green" }} className="fa fa-check"></i>
                    ) : (
                      <i style={{ color: "red" }} className="fa fa-times"></i>
                    )}
                  </td>
                  <td>{role.createdBy}</td>
                  <td>
                    {moment(role.createdDate, moment.ISO_8601)
                      .format("YYYY-MM-DD#HH:mm")
                      .replace("#", " at ")}
                  </td>
                  <td>{role.modifiedBy}</td>
                  <td>
                    {/* {role.modifiedDate} */}
                    {moment(role.modifiedDate, moment.ISO_8601)
                      .format("YYYY-MM-DD#HH:mm")
                      .replace("#", " at ")}
                  </td>
                  <td>{role.comments}</td>
                  <td>
                    <InputGroup>
                      <Button
                        style={{ borderColor: "white" }}
                        variant="outline-secondary"
                        className="btn btn-sm"
                        onClick={() => handleAddEditRoleClick(true, role.id)}
                      >
                        <i
                          style={{ color: "#0d5265" }}
                          className="fas fa-edit pr-2"
                        ></i>
                      </Button>
                      <Button
                        style={{ borderColor: "white" }}
                        variant="outline-secondary"
                        className="btn btn-sm"
                        onClick={() => handleDeleteRoleClick(true, role.id)}
                      >
                        <i
                          style={{ color: "#ff8300" }}
                          className="fa fa-trash pr-2"
                        ></i>
                      </Button>
                    </InputGroup>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      <RolesModalPopUp
        EditMode={EditMode}
        showModal={showModalAddEditRole}
        handleCloseClick={handleModalCloseClick}
        DeleteMode={DeleteMode}
      >
        <RoleAddEditForm
          Loading={LoadingGlobalText}
          RoleDetails={roleDetails}
          handleCloseClick={handleModalCloseClick}
          handleSaveClick={handleAddEditRoleSaveClick}
          DeleteMode={DeleteMode}
        />
      </RolesModalPopUp>
    </>
  );
};
export default Roles;
