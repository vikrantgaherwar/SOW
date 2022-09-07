import { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { actionDynamicDataFieldsPageLoadUpdate } from "../../Redux/Actions/DynamicDataFields";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import LoadingComponent from "../LoadingComponent";
import SowRoutePageWrapper from "../RoutePageWrapper";
import { useDispatch } from "react-redux";

const DynamicDataLoadedPath = ({ children, shouldLoad, ...rest }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const {
    solutionHubDDFetchStatus,
    dynamicFieldsFetchStatus,
    pageUpdate,
    stateLoaded,
  } = useSelector(
    (state) => ({
      solutionHubDDFetchStatus: state.solutionHubDropDown.dropDownFetchState,
      dynamicFieldsFetchStatus: state.dynamicFields.fetchStatus,
      pageUpdate: state.dynamicData.pageUpdate,
      stateLoaded: state.dynamicData.stateLoaded,
    }),
    shallowEqual
  );

  useEffect(() => {
    // if (pageUpdate === APIFetchStatus.BOOTED) {
    //   dispatch(actionDynamicDataFieldsPageLoadUpdate());
    // }
    if (
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

export default DynamicDataLoadedPath;
