import { useRef, useState } from "react";
import { useEffect } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { actionMasterDropDownFetchAll } from "../../Redux/Actions/MasterDropDown";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import ErrorComponent from "../ErrorComponent";
import LoadingComponent from "../LoadingComponent";
import ModeProvider from "../ModeProvider";
import RoutePageWrapper from "../RoutePageWrapper";
const DropDownLoadedPath = ({ children, shouldLoad, edit, ...rest }) => {
  const dispatch = useDispatch();
  const [error, showError] = useState(false);
  const [loading, showLoading] = useState(shouldLoad ?? false);
  const {
    dropDownFetchStatus,
    customerDataFetchState,
    sectionDataFetchStatus,
    // skuFetchStatus,
  } = useSelector(
    (state) => ({
      dropDownFetchStatus:
        state.masterDropDown.preloadFieldsDataFetchDataStatus,
      customerDataFetchState: state.customerData.customerDataFetchState,
      sectionDataFetchStatus:
        state.masterDropDown.workPackageSectionDataFetchStatus,
      country: state.masterData.country,
      // solutionHubDropDownFetchState:
      //   state.solutionHubDropDown.dropDownFetchState,
      productLine: state.customerData.productLine,
      // skuFetchStatus: state.masterDropDown.skuFetchStatus,
      business: state.masterData.business,
    }),
    shallowEqual
  );
  const loaded = useRef(true);

  useEffect(() => {
    if (
      dropDownFetchStatus === APIFetchStatus.BOOTED &&
      customerDataFetchState === APIFetchStatus.BOOTED &&
      sectionDataFetchStatus === APIFetchStatus.BOOTED
      // solutionHubDropDownFetchState === APIFetchStatus.BOOTED &&
      // skuFetchStatus === APIFetchStatus.BOOTED
    ) {
      dispatch(actionMasterDropDownFetchAll());
      showError(false);
      showLoading(false);
    } else if (
      dropDownFetchStatus === APIFetchStatus.FAILED ||
      customerDataFetchState === APIFetchStatus.FAILED ||
      sectionDataFetchStatus === APIFetchStatus.FAILED
      // solutionHubDropDownFetchState === APIFetchStatus.FAILED ||
      // skuFetchStatus === APIFetchStatus.FAILED
    ) {
      showError(true);
    } else if (
      (dropDownFetchStatus === APIFetchStatus.FETCHING ||
        customerDataFetchState === APIFetchStatus.FETCHING ||
        sectionDataFetchStatus === APIFetchStatus.FETCHING) &&
      !loading
    ) {
      console.log("going to loading");
      console.log({
        dropDownFetchStatus,
        customerDataFetchState,
        sectionDataFetchStatus,
      });
      showLoading(true);
    } else if (
      dropDownFetchStatus === APIFetchStatus.FETCHED &&
      customerDataFetchState === APIFetchStatus.FETCHED &&
      sectionDataFetchStatus === APIFetchStatus.FETCHED
    ) {
      showError(false);
      showLoading(false);
      loaded.current = false;
    } else if (
      dropDownFetchStatus === APIFetchStatus.FETCHED &&
      customerDataFetchState === APIFetchStatus.BOOTED &&
      sectionDataFetchStatus === APIFetchStatus.BOOTED
    ) {
      showError(false);
      showLoading(false);
    } else if (shouldLoad && dropDownFetchStatus === APIFetchStatus.BOOTED) {
      dispatch(actionMasterDropDownFetchAll());
    } else {
      if (shouldLoad) {
        showError(false);
        showLoading(false);
      }

      // if (shouldLoad) {
      //   showError(false);
      //   showLoading(false);
      // }
    }
  }, [
    dropDownFetchStatus,
    customerDataFetchState,
    sectionDataFetchStatus,
    // solutionHubDropDownFetchState,
    // skuFetchStatus,
  ]);

  return (
    <Route
      {...rest}
      render={() =>
        error ? (
          <RoutePageWrapper>
            <ErrorComponent />
          </RoutePageWrapper>
        ) : loading ? (
          <RoutePageWrapper>
            <LoadingComponent />
          </RoutePageWrapper>
        ) : (
          children
        )
      }
    />
  );
};

export default DropDownLoadedPath;
