import {
  Redirect,
  Route,
  useLocation,
  useParams,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import LoadingComponent from "../LoadingComponent";
import SowRoutePageWrapper from "../RoutePageWrapper";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useEffect, useState } from "react";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import {
  actionFetchLatestSow,
  actionLogDataFetch,
} from "../../Redux/Actions/LogData";
import { useRef } from "react";
import { actionMasterDropDownFetchAll } from "../../Redux/Actions/MasterDropDown";
import { actionMasterDataLoadEditData } from "../../Redux/Actions/MasterData";
import { actionCustomerDataLoadEdit } from "../../Redux/Actions/CustomerData";
import EditMatchDataLoadedPath from "../EditMatchDataLoadedPath";
import ModeProvider, { ModeContext } from "../ModeProvider";
import { useContext } from "react";

const EditDataLoadedPath = ({ children, checkState, ...rest }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [checkURL, setCheckURL] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const idRef = useRef(-1);
  const oppIdRef = useRef("");
  const history = useHistory();

  const { isEdit, isClone } = useContext(ModeContext);

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
    draftLogsFetchState,
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
      e3tRegionalDataFetchState: state.e3tData.e3tRegionalDataFetchState,
      generatedId: state.logData.customerLog[0]?.sowGeneratedId,
      e3tFxRatesFetchState: state.e3tData.e3tFxRatesFetchState,
      e3tTshirtSizesFetchState: state.e3tData.e3tTshirtSizesFetchState,
      e3tRemoteSTDsFetchState: state.e3tData.e3tRemoteSTDsFetchState,
      isLatest:
        state.logData.customerLog.length > 0
          ? state.logData.customerLog[0].sowGeneratedId ===
            state.logData.latestData.id
          : false,

      draftLogsFetchState: state.draft.draftLogsFetchState,
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
          // dispatch(actionLogDataFetch(state.id));
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
        e3tRegionalDataFetchState === APIFetchStatus.FETCHING ||
        draftLogsFetchState === APIFetchStatus.FETCHING ||
        e3tFxRatesFetchState === APIFetchStatus.FETCHING ||
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
          oppIdRef.current = val;
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
      !checkURL
    ) {
      // dispatch(actionCustomerDataLoadEdit());
    } else if (
      (fetchStatus === APIFetchStatus.FETCHED ||
        draftLogsFetchState === APIFetchStatus.FETCHED) &&
      dropDownFetchStatus === APIFetchStatus.FETCHED &&
      customerDataFetchState === APIFetchStatus.FETCHED &&
      sectionDataFetchStatus === APIFetchStatus.FETCHED &&
      dynamicDataStateLoaded === APIFetchStatus.FETCHED &&
      e3tRegionalDataFetchState === APIFetchStatus.FETCHED &&
      e3tFxRatesFetchState === APIFetchStatus.FETCHED &&
      // e3tTshirtSizesFetchState === APIFetchStatus.FETCHED &&
      e3tRemoteSTDsFetchState === APIFetchStatus.FETCHED &&
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
          <EditMatchDataLoadedPath>{children}</EditMatchDataLoadedPath>
        ) : checkState ? (
          <Redirect
            to={
              isClone
                ? "/sow/clone/" + generatedId
                : `/sow/${isEdit ? "edit" : "view"}/${generatedId}`
            }
          />
        ) : (
          // <Redirect
          //   to={`/sow/${
          //     location.pathname.indexOf("edit") > -1 ? "edit" : "view"
          //   }/${oppIdRef.current}/${generatedId}`}
          // />
          children
        )
      }
    />
  );
};

export default EditDataLoadedPath;
