import Cookies from "js-cookie";
import { useContext, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { actionDraftGetAllDrafts } from "../../Redux/Actions/Draft";
import { resetAll } from "../../Redux/Actions/ResetAll";
import {
  actionSharingModalSelectedId,
  actionSharingModalToggle,
} from "../../Redux/Actions/SharingModal";
import { ModeContext } from "../ModeProvider";

const PageTitle = ({ title, small }) => {
  const { isView, isEdit } = useContext(ModeContext);
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    isLatest,
    latestDataId,
    sharingData,
    userId,
    isAdmin,
    wpSectionDataLoad,
    customModulesDataFetchState,
    costingEstimationFetchState,
    e3tTshirtSizesV2FetchState,
    isEditble,
  } = useSelector((state) => ({
    isLatest:
      state.logData?.customerLog?.length > 0
        ? state.logData?.customerLog[0]?.sowGeneratedId ===
          state.logData?.latestData?.id
        : false,
    latestDataId: state.logData?.latestData?.originalId,
    sharingData: state.sharingModal.sharingSidePanelData,
    userId: state.logData?.latestData?.userId,
    isAdmin: state.showHistory?.isAdmin,
    wpSectionDataLoad: state.dynamicData?.wpSectionDataLoad,
    customModulesDataFetchState:
      state.customModuleSidePanel?.customModulesDataFetchState,
    costingEstimationFetchState: state.e3tData.e3tCostingEstimationV2FetchState,
    e3tTshirtSizesV2FetchState: state.e3tData.e3tTshirtSizesV2FetchState,
    isEditble: state.logData?.latestData?.isEditPossible,
  }));

  //Edit:1,View:3,Clone:5
  const handleEditOption = useMemo(() => {
    if (parseInt(Cookies.get("empnumber")) === userId && isEditble) {
      return true;
    } else if (sharingData.length > 0 && latestDataId) {
      const rightsId = sharingData.find((s) => s.id === latestDataId)
        ?.sowUserRights[0].rightsId;
      return rightsId === 1; //EDIT
    }
    return false;
  }, [sharingData, latestDataId]);

  const handleViewEditClicked = (edit) => (e) => {
    e.preventDefault();
    const path = history.location.pathname;
    const sp = path.split("/");
    if (edit) {
      history.replace(
        sp.map((e) => (e.startsWith("view") ? "edit" : e)).join("/")
      );
    } else {
      history.replace(
        sp.map((e) => (e.startsWith("edit") ? "view" : e)).join("/")
      );
    }
  };

  const handleCloneClicked = (e) => {
    e.preventDefault();
    const path = history.location.pathname;
    const sp = path.split("/");
    history.replace(
      sp
        .map((e) =>
          e.startsWith("edit") || e.startsWith("view") ? "clone" : e
        )
        .join("/")
    );
  };

  const handleShareClicked = () => {
    dispatch(actionSharingModalSelectedId(latestDataId));
    dispatch(actionSharingModalToggle());
  };

  const handleNewDocument = (e) => {
    e.preventDefault();
    dispatch(resetAll());
    dispatch(actionDraftGetAllDrafts());
    history.replace("/sow");
  };

  // const IsSOWUserAdmin = useMemo(() => {
  //   if (loggedInUserInfo !== undefined) {
  //     let UserRoles = [];
  //     loggedInUserInfo?.forEach(userRole => {
  //       UserRoles.push(userRole.role.roleName)
  //     });
  //     return UserRoles.indexOf('Admin') !== -1 ? true : false
  //   }
  // }, [loggedInUserInfo])

  return (
    <div className="sow-my-page-header mt-4">
      <div className="d-flex flex-row justify-content-between">
        <div>
          {small ? (
            <h5 className="font-weight-normal">{title}</h5>
          ) : (
            <h4>
              {title}
              {isAdmin && (
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => history.push("/sow-admin/users")}
                >
                  <i className="fa-xs pl-2 fa fa-cog" />
                </span>
              )}
            </h4>
          )}
        </div>
        {!small && (
          <div>
            <Button
              disabled={
                wpSectionDataLoad === 1 ||
                customModulesDataFetchState === 1 ||
                costingEstimationFetchState === 1 ||
                e3tTshirtSizesV2FetchState === 1
              }
              className="mr-2 btn-size-color"
              variant="none"
              title="New"
              onClick={handleNewDocument}
            >
              {/* <i className="far fa-file-alt  history-panel-icon-size"></i> */}
              <i className="far fa-file-alt  history-panel-icon-size mr-2" />
              <span className="sow-page-button">New</span>
            </Button>
            {!history.location.pathname.endsWith("e3t") &&
              !history.location.pathname.endsWith("data") &&
              !history.location.pathname.endsWith("preview") &&
              !history.location.pathname.endsWith("summary") && (
                <>
                  {isEdit && (
                    <Button
                      className="mr-2 btn-size-color"
                      variant="none"
                      title="View"
                      onClick={handleViewEditClicked(false)}
                    >
                      <i className="far fa-eye history-panel-icon-size mr-2" />
                      <span className="sow-page-button">View</span>
                    </Button>
                  )}
                  {isView && isLatest && handleEditOption && (
                    <Button
                      className="mr-2 btn-size-color"
                      variant="none"
                      title="Edit"
                      onClick={handleViewEditClicked(true)}
                    >
                      <i className="far history-panel-icon-size fa-edit mr-2"></i>
                      <span className="sow-page-button">Edit</span>
                    </Button>
                  )}
                  {(isView || isEdit) && (
                    <Button
                      className="mr-2 btn-size-color"
                      variant="none"
                      title="Clone"
                      onClick={handleCloneClicked}
                    >
                      <i className="far history-panel-icon-size fa-clone mr-2"></i>
                      <span className="sow-page-button">Clone</span>
                    </Button>
                  )}
                  {(isView || isEdit) && isLatest && (
                    <Button
                      className="mr-2 btn-size-color"
                      variant="none"
                      title="Share"
                      onClick={handleShareClicked}
                    >
                      <i className="fas fa-share-alt history-panel-icon-size mr-2"></i>
                      <span className="sow-page-button">Share</span>
                    </Button>
                  )}
                </>
              )}
          </div>
        )}
      </div>

      <hr
        className={small ? "sow-titleline" : "sow-titleline new-sow-titleline"}
      />
    </div>
  );
};

export default PageTitle;
