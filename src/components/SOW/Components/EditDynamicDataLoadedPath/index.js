import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import SowRoutePageWrapper from "../RoutePageWrapper";
import LoadingComponent from "../LoadingComponent";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import {
  actionDynamicDataFieldsPageLoadUpdate,
  actionDynamicDataLoadEditData,
} from "../../Redux/Actions/DynamicDataFields";

const EditDynamicDataLoadedPath = ({ children, checkState, ...rest }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const {
    customerLog,
    sowTemplate,
    solutionHubDDFetchStatus,
    dynamicFieldsFetchStatus,
    pageUpdate,
    stateLoaded,
  } = useSelector(
    (state) => ({
      customerLog: state.logData.customerLog,
      sowTemplate: state.masterDropDown.templateFieldDropDownData.find(
        (e) => e.templateInputName === state.masterData.sowTemplate
      ),
      solutionHubDDFetchStatus: state.solutionHubDropDown.dropDownFetchState,
      dynamicFieldsFetchStatus: state.dynamicFields.fetchStatus,
      pageUpdate: state.dynamicData.pageUpdate,
      stateLoaded: state.dynamicData.stateLoaded,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (pageUpdate === APIFetchStatus.BOOTED) {
      // const f = customerLog.find(
      //   (e) => e.standardField.fieldName === "sowTemplate"
      // );
      // if (f.templateId === sowTemplate.id) {
      //   dispatch(actionDynamicDataLoadEditData());
      // }
      // else {
      //   dispatch(actionDynamicDataFieldsPageLoadUpdate());
      // }
    }
    if (
      solutionHubDDFetchStatus === APIFetchStatus.FETCHING &&
      dynamicFieldsFetchStatus === APIFetchStatus.FETCHING
    ) {
      setLoading(true);
    } else if (
      solutionHubDDFetchStatus === APIFetchStatus.FETCHED &&
      dynamicFieldsFetchStatus === APIFetchStatus.FETCHED &&
      stateLoaded === APIFetchStatus.FETCHED
    ) {
      setLoading(false);
    } else if (
      solutionHubDDFetchStatus === APIFetchStatus.FAILED ||
      dynamicFieldsFetchStatus === APIFetchStatus.FAILED ||
      stateLoaded === APIFetchStatus.FAILED
    ) {
      setError(true);
    }
    console.log({
      type: "dd",
      solutionHubDDFetchStatus,
      dynamicFieldsFetchStatus,
      stateLoaded,
    });
  }, [solutionHubDDFetchStatus, dynamicFieldsFetchStatus, stateLoaded]);

  return (
    <Route
      {...rest}
      render={() =>
        error ? (
          <Redirect to="/sow" />
        ) : loading ? (
          <SowRoutePageWrapper>
            <LoadingComponent />
          </SowRoutePageWrapper>
        ) : (
          children
        )
      }
    />
  );
};

export default EditDynamicDataLoadedPath;
