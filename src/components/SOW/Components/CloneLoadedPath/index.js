import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Redirect, Route, useLocation } from "react-router";
import { actionFetchLatestSow } from "../../Redux/Actions/LogData";
import { actionMasterDataLoadEditData } from "../../Redux/Actions/MasterData";
import { actionMasterDropDownFetchAll } from "../../Redux/Actions/MasterDropDown";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import CloneMatchPath from "../CloneMatchPath";
import EditMatchDataLoadedPath from "../EditMatchDataLoadedPath";
import LoadingComponent from "../LoadingComponent";
import SowRoutePageWrapper from "../RoutePageWrapper";

const CloneLoadedPath = ({ children, checkState, ...rest }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [checkURL, setCheckURL] = useState(false);
  const dispatch = useDispatch();
  const idRef = useRef(-1);
  const location = useLocation();

  const {
    fetchStatus,
    customerLog,
    customerDataFetchState,
    dropDownFetchStatus,
    sectionDataFetchStatus,
    solutionHubDropDownFetchState,
    dynamicDataStateLoaded,
    e3tRegionalDataFetchState,
    generatedId,
    isLatest,
    e3tFxRatesFetchState,
    e3tTshirtSizesFetchState,
    e3tRemoteSTDsFetchState,
  } = useSelector(
    (state) => ({
      fetchStatus: state.logData.fetchStatus,
      customerLog: state.logData.customerLog,
      dropDownFetchStatus:
        state.masterDropDown.preloadFieldsDataFetchDataStatus,
      customerDataFetchState: state.customerData.customerDataFetchState,
      sectionDataFetchStatus:
        state.masterDropDown.workPackageSectionDataFetchStatus,
      solutionHubDropDownFetchState:
        state.solutionHubDropDown.dropDownFetchState,
      dynamicDataStateLoaded: state.dynamicData.stateLoaded,
      e3tRegionalDataFetchState: state.e3tData.e3tRegionalDataFetchStateV2,
      generatedId: state.logData.customerLog[0]?.sowGeneratedId,
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

  useEffect(() => {
    if (
      fetchStatus === APIFetchStatus.BOOTED &&
      dropDownFetchStatus === APIFetchStatus.BOOTED &&
      customerDataFetchState === APIFetchStatus.BOOTED &&
      sectionDataFetchStatus === APIFetchStatus.BOOTED &&
      e3tRegionalDataFetchState === APIFetchStatus.BOOTED
    ) {
      if (checkState) {
        const { state } = location;

        if (state && state.id) {
          idRef.current = state.id;
          dispatch(actionFetchLatestSow(idRef.current));
        } else {
          setError(true);
        }
      } else {
        setCheckURL(true);
        setLoading(false);
      }
      // else if (match.params && match.params.id) {
      // }
    } else if (
      (fetchStatus === APIFetchStatus.FETCHING ||
        dropDownFetchStatus === APIFetchStatus.FETCHING ||
        customerDataFetchState === APIFetchStatus.FETCHING ||
        sectionDataFetchStatus === APIFetchStatus.FETCHING ||
        // solutionHubDropDownFetchState === APIFetchStatus.FETCHING ||
        (e3tRegionalDataFetchState === APIFetchStatus.FETCHING &&
          e3tFxRatesFetchState === APIFetchStatus.FETCHING) ||
        // e3tTshirtSizesFetchState === APIFetchStatus.FETCHING ||
        e3tRemoteSTDsFetchState === APIFetchStatus.FETCHING) &&
      !checkURL
    ) {
      setLoading(true);
    } else if (
      fetchStatus === APIFetchStatus.FETCHED &&
      dropDownFetchStatus === APIFetchStatus.BOOTED &&
      customerDataFetchState === APIFetchStatus.BOOTED &&
      sectionDataFetchStatus === APIFetchStatus.BOOTED &&
      e3tRegionalDataFetchState === APIFetchStatus.BOOTED &&
      !checkURL
    ) {
      if (checkState) {
        const f = customerLog.find(
          (e) => e.standardField.fieldName === "oppId"
        );

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
          //   oppIdRef.current = val;
          // setLoading(false);
        } else {
          setError(true);
        }
      }

      // setLoading(true);
    } else if (
      (fetchStatus === APIFetchStatus.FAILED ||
        dropDownFetchStatus === APIFetchStatus.FAILED ||
        customerDataFetchState === APIFetchStatus.FAILED ||
        sectionDataFetchStatus === APIFetchStatus.FAILED ||
        e3tRegionalDataFetchState === APIFetchStatus.FAILED ||
        e3tFxRatesFetchState === APIFetchStatus.FAILED ||
        // e3tTshirtSizesFetchState === APIFetchStatus.FAILED ||
        e3tRemoteSTDsFetchState === APIFetchStatus.FAILED) &&
      !checkURL
    ) {
      setError(true);
    } else if (
      fetchStatus === APIFetchStatus.FETCHED &&
      dropDownFetchStatus === APIFetchStatus.FETCHED &&
      customerDataFetchState === APIFetchStatus.BOOTED &&
      sectionDataFetchStatus === APIFetchStatus.BOOTED &&
      e3tRegionalDataFetchState === APIFetchStatus.BOOTED &&
      !checkURL
    ) {
      dispatch(actionMasterDataLoadEditData());
    } else if (
      fetchStatus === APIFetchStatus.FETCHED &&
      dropDownFetchStatus === APIFetchStatus.FETCHED &&
      customerDataFetchState === APIFetchStatus.FETCHED &&
      sectionDataFetchStatus === APIFetchStatus.FETCHED &&
      dynamicDataStateLoaded === APIFetchStatus.FETCHED &&
      e3tRegionalDataFetchState === APIFetchStatus.BOOTED &&
      e3tFxRatesFetchState === APIFetchStatus.FETCHED &&
      // e3tTshirtSizesFetchState === APIFetchStatus.FETCHED &&
      e3tRemoteSTDsFetchState === APIFetchStatus.FETCHED &&
      !checkURL
    ) {
      // dispatch(actionCustomerDataLoadEdit());
    } else if (
      fetchStatus === APIFetchStatus.FETCHED &&
      dropDownFetchStatus === APIFetchStatus.FETCHED &&
      customerDataFetchState === APIFetchStatus.FETCHED &&
      sectionDataFetchStatus === APIFetchStatus.FETCHED &&
      dynamicDataStateLoaded === APIFetchStatus.FETCHED &&
      e3tRegionalDataFetchState === APIFetchStatus.FETCHED &&
      !checkURL
    ) {
      setLoading(false);
    }
  }, [
    fetchStatus,
    customerDataFetchState,
    dropDownFetchStatus,
    sectionDataFetchStatus,
    dynamicDataStateLoaded,
    e3tRegionalDataFetchState,
    e3tFxRatesFetchState,
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
        ) : checkURL ? (
          <CloneMatchPath>{children}</CloneMatchPath>
        ) : checkState ? (
          <Redirect to={`/sow/clone/${idRef.current}`} />
        ) : (
          children
        )
      }
    />
  );
};

export default CloneLoadedPath;
