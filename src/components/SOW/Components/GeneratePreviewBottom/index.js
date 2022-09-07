import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { Col, Button, ProgressBar } from "react-bootstrap";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import {
  actionCustomerDataReset,
  actionFetchCustomerData,
} from "../../Redux/Actions/CustomerData";
import { actionResetDynamicFields } from "../../Redux/Actions/DynamicFields";
import { actionE3TDataReset } from "../../Redux/Actions/E3T";
import {
  actionGeneratePreviewDownloadPDF,
  actionGeneratePreviewDownloadPDFV2,
  actionGeneratePreviewReset,
} from "../../Redux/Actions/GeneratePreview";
import { actionLogDataReset } from "../../Redux/Actions/LogData";
import {
  actionMasterDropDownDataReset,
  actionMasterDropDownFetchAll,
} from "../../Redux/Actions/MasterDropDown";
import { resetAll } from "../../Redux/Actions/ResetAll";
import { actionSolutionHubDropDownReset } from "../../Redux/Actions/SolutionHubDropDown";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import { ModeContext } from "../ModeProvider";
import { showE3T } from "../../Redux/utils/showE3T";
import TrackingService from "../../../TrackingService";
import Cookies from "js-cookie";

const GeneratePreviewBottom = () => {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);

  const { isView } = useContext(ModeContext);

  const handleModalClose = () => {
    setShow(false);
  };

  const {
    state,
    percent,
    generatedId,
    oppId,
    showE3t,
    templateOutputPath,
    generatePreviewResponse,
  } = useSelector(
    (state) => ({
      state: state.generatePreview.downloadState,
      percent: state.generatePreview.percent,
      generatedId: state.logData.latestData.id,
      oppId: state.masterData.oppId,
      showE3t: showE3T(state),
      templateOutputPath: state.generatePreview.res.templateOutputPath,
      generatePreviewResponse: state.generatePreview.res,
    }),
    shallowEqual
  );

  const history = useHistory();
  const match = useRouteMatch();

  const handlePrevious = (e) => {
    e.preventDefault();
    if (match.url.indexOf(oppId) === -1) {
      const sp = match.url.split("/");
      sp[sp.length - 1] = showE3t ? "summary" : "dynamic-data";
      history.push(sp.join("/"));
    } else if (match.url.indexOf(oppId) > -1) {
      const url = match.url.replace(oppId, "edit").split("/");
      url[3] = generatedId;
      url[4] = showE3t ? "summary" : "dynamic-data";
      history.push(url.join("/"));
    }
    // history.replace("/sow/edit", { id: generatedId }, "/dynamic-data");

    dispatch(actionGeneratePreviewReset());
  };

  useEffect(() => {
    setShow(false);
  }, []);

  const handleNew = () => {
    dispatch(resetAll());

    history.replace("/sow");
  };

  const handleEdit = () => {
    if (generatedId) {
      dispatch(actionLogDataReset());
      dispatch(actionCustomerDataReset());
      dispatch(actionE3TDataReset());
      dispatch(actionSolutionHubDropDownReset());
      dispatch(actionResetDynamicFields());
      dispatch(actionGeneratePreviewReset());
      dispatch(actionFetchCustomerData(oppId, actionMasterDropDownFetchAll));
      history.push(`/sow/edit`, {
        generatedId,
      });
    }
  };

  return (
    <>
      <Col className="d-flex align-items-center flex-row-reverse">
        <Button
          bsPrefix="prev-next-btn-size btn btn-success btn-sm float-right action-button"
          onClick={(e) => {
            e.preventDefault();
            // if (isView) {
            dispatch(actionGeneratePreviewDownloadPDFV2());
            // } else {
            // dispatch(actionGeneratePreviewDownloadPDF());
            // }
            new TrackingService().LogSOWDownload(
              Cookies.get("empnumber"),
              generatedId,
              templateOutputPath.substr(19)
            );
          }}
          disabled={
            state === APIFetchStatus.FETCHING ||
            generatePreviewResponse === "" ||
            generatePreviewResponse === undefined ||
            generatePreviewResponse?.templateOutputPath === undefined
          }
        >
          <i className="far fa-file-pdf pr-2" />
          {state === APIFetchStatus.FETCHING ? `Dowloading...` : `Download SOW`}
        </Button>
        <Button
          bsPrefix="prev-next-btn-size btn btn-success btn-sm float-right mr-2 yellow-button btn-warning"
          onClick={handlePrevious}
          disabled={state === APIFetchStatus.FETCHING}
        >
          Previous
        </Button>
        {state === APIFetchStatus.FETCHING && (
          <ProgressBar
            className="w-100"
            animated
            now={percent}
            label={`${percent}%`}
          />
        )}
      </Col>
    </>
  );
};

export default GeneratePreviewBottom;
