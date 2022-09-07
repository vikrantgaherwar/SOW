import { useEffect, useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Redirect, Route, useParams } from "react-router-dom";
import { actionCustomerDataLoadEdit } from "../../Redux/Actions/CustomerData";
import { actionE3TFetchRegionalData } from "../../Redux/Actions/E3TData";
import {
  actionFetchLatestSow,
  actionLogDataFetch,
} from "../../Redux/Actions/LogData";
import { actionMasterDataLoadEditData } from "../../Redux/Actions/MasterData";
import { actionMasterDropDownFetchAll } from "../../Redux/Actions/MasterDropDown";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import LoadingComponent from "../LoadingComponent";
import SowRoutePageWrapper from "../RoutePageWrapper";

const CloneMatchPath = ({ children, ...rest }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const idRef = useRef(-1);

  const params = useParams();

  const {
    fetchStatus,
    customerLog,
    customerDataFetchState,
    dropDownFetchStatus,
    sectionDataFetchStatus,
    solutionHubDropDownFetchState,
    dynamicDataStateLoaded,
    e3tRegionalDataFetchState,
    country,
    productLine,
    isLatest,
    e3tFxRatesFetchState,
    e3tTshirtSizesFetchState,
    customDropDownFetchState,
    e3tRemoteSTDsFetchState,
  } = useSelector(
    (state) => ({
      fetchStatus: state.logData.fetchStatus,
      customerLog: state.logData.customerLog,
      dropDownFetchStatus:
        state.masterDropDown.preloadFieldsDataFetchDataStatus,
      customerDataFetchState: state.customerData.customerDataFetchState,
      country: state.masterData.country,
      productLine: state.customerData.productLine,
      sectionDataFetchStatus:
        state.masterDropDown.workPackageSectionDataFetchStatus,
      solutionHubDropDownFetchState:
        state.solutionHubDropDown.dropDownFetchState,
      dynamicDataStateLoaded: state.dynamicData.stateLoaded,
      e3tRegionalDataFetchState: state.e3tData.e3tRegionalDataFetchStateV2,
      customDropDownFetchState:
        state.customModuleSidePanel.customDropDownFetchState,
      e3tFxRatesFetchState: state.e3tData.e3tFxRatesFetchState,
      e3tTshirtSizesFetchState: state.e3tData.e3tTshirtSizesFetchState,
      e3tRemoteSTDsFetchState: state.e3tData.e3tRemoteSTDsFetchState,
      isLatest:
        state.logData.customerLog.length > 0
          ? state.logData.customerLog[0].sowGeneratedId ===
            state.logData.latestData.id
          : false,
    }),
    shallowEqual
  );

  const loaded = useRef(true);

  useEffect(() => {
    if (params.oppId && params.id) {
    } else {
      setError(true);
    }
  }, []);

  useEffect(() => {
    if (
      fetchStatus === APIFetchStatus.BOOTED &&
      dropDownFetchStatus === APIFetchStatus.BOOTED &&
      customerDataFetchState === APIFetchStatus.BOOTED &&
      sectionDataFetchStatus === APIFetchStatus.BOOTED &&
      e3tRegionalDataFetchState === APIFetchStatus.BOOTED
    ) {
      const { id, oppId } = params;
      if (id && oppId) {
        idRef.current = id;
        dispatch(actionFetchLatestSow(idRef.current, true));
      } else {
        setError(true);
      }
    } else if (
      fetchStatus === APIFetchStatus.FETCHING ||
      dropDownFetchStatus === APIFetchStatus.FETCHING ||
      customerDataFetchState === APIFetchStatus.FETCHING ||
      sectionDataFetchStatus === APIFetchStatus.FETCHING ||
      // solutionHubDropDownFetchState === APIFetchStatus.FETCHING ||
      e3tRegionalDataFetchState === APIFetchStatus.FETCHING ||
      e3tFxRatesFetchState === APIFetchStatus.FETCHING ||
      // e3tTshirtSizesFetchState === APIFetchStatus.FETCHING ||
      e3tRemoteSTDsFetchState === APIFetchStatus.FETCHING
    ) {
      setLoading(true);
    } else if (
      fetchStatus === APIFetchStatus.FETCHED &&
      dropDownFetchStatus === APIFetchStatus.BOOTED &&
      customerDataFetchState === APIFetchStatus.BOOTED &&
      sectionDataFetchStatus === APIFetchStatus.BOOTED &&
      e3tRegionalDataFetchState === APIFetchStatus.BOOTED &&
      (e3tRegionalDataFetchState === APIFetchStatus.BOOTED ||
        e3tRegionalDataFetchState === APIFetchStatus.FETCHED)
    ) {
      const f = customerLog.find((e) => e.standardField.fieldName === "oppId");

      const countryRec = customerLog.find(
        (e) => e.standardField.fieldName === "country"
      );

      const templateRec = customerLog.find(
        (e) => e.standardField.fieldName === "sowTemplate"
      );
      if (countryRec && templateRec) {
        dispatch(
          actionMasterDropDownFetchAll(
            countryRec.fieldDefaultValue,
            templateRec.fieldDefaultValue,
            true
          )
        );
      }
      if (f && f.fieldDefaultValue) {
        const val = f.fieldDefaultValue;

        // setLoading(false);
      } else {
        setError(true);
      }

      // setLoading(true);
    } else if (
      fetchStatus === APIFetchStatus.FAILED ||
      dropDownFetchStatus === APIFetchStatus.FAILED ||
      customerDataFetchState === APIFetchStatus.FAILED ||
      sectionDataFetchStatus === APIFetchStatus.FAILED ||
      e3tRegionalDataFetchState === APIFetchStatus.FAILED ||
      e3tFxRatesFetchState === APIFetchStatus.FAILED ||
      // e3tTshirtSizesFetchState === APIFetchStatus.FAILED ||
      e3tRemoteSTDsFetchState === APIFetchStatus.FAILED ||
      customDropDownFetchState === APIFetchStatus.FAILED
    ) {
      setError(true);
    } else if (
      fetchStatus === APIFetchStatus.FETCHED &&
      dropDownFetchStatus === APIFetchStatus.FETCHED &&
      customerDataFetchState === APIFetchStatus.BOOTED &&
      sectionDataFetchStatus === APIFetchStatus.BOOTED &&
      (e3tRegionalDataFetchState === APIFetchStatus.BOOTED ||
        e3tRegionalDataFetchState === APIFetchStatus.FETCHED)
    ) {
      dispatch(actionMasterDataLoadEditData());
    } else if (
      fetchStatus === APIFetchStatus.FETCHED &&
      dropDownFetchStatus === APIFetchStatus.FETCHED &&
      customerDataFetchState === APIFetchStatus.FETCHED &&
      sectionDataFetchStatus === APIFetchStatus.FETCHED &&
      dynamicDataStateLoaded === APIFetchStatus.FETCHED &&
      e3tRegionalDataFetchState === APIFetchStatus.BOOTED &&
      customDropDownFetchState === APIFetchStatus.FETCHED
    ) {
      dispatch(actionCustomerDataLoadEdit());
    } else if (
      fetchStatus === APIFetchStatus.FETCHED &&
      dropDownFetchStatus === APIFetchStatus.FETCHED &&
      customerDataFetchState === APIFetchStatus.FETCHED &&
      sectionDataFetchStatus === APIFetchStatus.FETCHED &&
      dynamicDataStateLoaded === APIFetchStatus.FETCHED &&
      e3tRegionalDataFetchState === APIFetchStatus.FETCHED &&
      e3tFxRatesFetchState === APIFetchStatus.FETCHED &&
      // e3tTshirtSizesFetchState === APIFetchStatus.FETCHED &&
      e3tRemoteSTDsFetchState === APIFetchStatus.FETCHED &&
      customDropDownFetchState === APIFetchStatus.FETCHED
    ) {
      setLoading(false);
      loaded.current = false;
    }

    console.log({
      fetchStatus,
      customerDataFetchState,
      dropDownFetchStatus,
      dynamicDataStateLoaded,
      sectionDataFetchStatus,
      e3tRegionalDataFetchState,
    });
  }, [
    fetchStatus,
    customerDataFetchState,
    dropDownFetchStatus,
    sectionDataFetchStatus,
    dynamicDataStateLoaded,
    e3tRegionalDataFetchState,
    e3tFxRatesFetchState,
    customDropDownFetchState,
    // e3tTshirtSizesFetchState,
    e3tRemoteSTDsFetchState,
  ]);

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

export default CloneMatchPath;
