import { useContext } from "react";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Redirect, Route, useParams, useHistory } from "react-router-dom";
import { actionCustomerDataLoadEdit } from "../../Redux/Actions/CustomerData";
import { actionDraftFetchPageData } from "../../Redux/Actions/Draft";
import { actionE3TFetchRegionalData } from "../../Redux/Actions/E3TData";
import {
  actionFetchLatestSow,
  actionLogDataFetch,
} from "../../Redux/Actions/LogData";
import {
  actionMasterDataLoadDraftData,
  actionMasterDataLoadEditData,
} from "../../Redux/Actions/MasterData";
import { actionMasterDropDownFetchAll } from "../../Redux/Actions/MasterDropDown";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import LoadingComponent from "../LoadingComponent";
import { ModeContext } from "../ModeProvider";
import SowRoutePageWrapper from "../RoutePageWrapper";

const EditMatchDataLoadedPath = ({ children, ...rest }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const idRef = useRef(-1);
  const oppIdRef = useRef("");

  const params = useParams();

  const history = useHistory();

  const { isClone, isEdit, isView, isDraft } = useContext(ModeContext);
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
    e3tRemoteSTDsFetchState,
    customDropDownFetchState,
    customerDraftLog,
    trasactionalDraftLog,
    predefinedModulesDraftLog,
    solutionHubDraftLog,
    customModulesDraftLog,
    customModulesDataDraftLog,
    e3tPricingDraftLog,
    draftLogsFetchState,
  } = useSelector(
    (state) => ({
      fetchStatus: state.logData.fetchStatus,
      customerLog: state.logData.customerLog,

      customerDraftLog: state.draft.customerDraftLog,
      trasactionalDraftLog: state.draft.transactionalDraftLog,
      predefinedModulesDraftLog: state.draft.predefinedModulesDraftLog,
      solutionHubDraftLog: state.draft.solutionHubDraftLog,
      customModulesDraftLog: state.draft.customModulesDraftLog,
      customModulesDataDraftLog: state.draft.customModulesDataDraftLog,
      e3tPricingDraftLog: state.draft.e3tPricingDraftLog,
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
      e3tRegionalDataFetchState: state.e3tData.e3tRegionalDataFetchState,
      e3tFxRatesFetchState: state.e3tData.e3tFxRatesFetchState,
      e3tTshirtSizesFetchState: state.e3tData.e3tTshirtSizesFetchState,
      e3tRemoteSTDsFetchState: state.e3tData.e3tRemoteSTDsFetchState,
      customDropDownFetchState:
        state.customModuleSidePanel.customDropDownFetchState,
      draftLogsFetchState: state.draft.draftLogsFetchState,
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
    if (isClone) {
      if (params.id) {
        console.log("params.id exists");
      } else {
        console.log("setting error");
        setError(true);
      }
    } else if (params.id) {
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
      e3tRegionalDataFetchState === APIFetchStatus.BOOTED &&
      draftLogsFetchState === APIFetchStatus.BOOTED
    ) {
      const { id } = params;

      if (id) {
        idRef.current = id;
        console.log({ id, isDraft });
        if (isDraft) {
          dispatch(actionDraftFetchPageData(idRef.current));
        } else {
          dispatch(actionFetchLatestSow(idRef.current, true));
        }
      } else {
        console.log("setting error fetchLatest");
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
      e3tRemoteSTDsFetchState === APIFetchStatus.FETCHING ||
      draftLogsFetchState === APIFetchStatus.FETCHING
    ) {
      setLoading(true);
    } else if (
      fetchStatus === APIFetchStatus.BOOTED &&
      draftLogsFetchState === APIFetchStatus.FETCHED &&
      dropDownFetchStatus === APIFetchStatus.BOOTED &&
      customerDataFetchState === APIFetchStatus.BOOTED &&
      sectionDataFetchStatus === APIFetchStatus.BOOTED &&
      (e3tRegionalDataFetchState === APIFetchStatus.BOOTED ||
        e3tRegionalDataFetchState === APIFetchStatus.FETCHED)
    ) {
      console.log("here");
      const f = customerDraftLog.find(
        (e) => e.standardField.fieldName === "oppId"
      );

      const countryRec = customerDraftLog.find(
        (e) => e.standardField.fieldName === "country"
      );

      const templateRec = customerDraftLog.find(
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
    } else if (
      fetchStatus === APIFetchStatus.FETCHED &&
      dropDownFetchStatus === APIFetchStatus.BOOTED &&
      customerDataFetchState === APIFetchStatus.BOOTED &&
      sectionDataFetchStatus === APIFetchStatus.BOOTED &&
      (e3tRegionalDataFetchState === APIFetchStatus.BOOTED ||
        e3tRegionalDataFetchState === APIFetchStatus.FETCHED) &&
      draftLogsFetchState === APIFetchStatus.BOOTED
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
      if (isEdit && !isLatest) {
        history.replace(history.location.pathname.replace("edit", "view"));
      }

      // if (f && f.fieldDefaultValue) {
      //   const val = f.fieldDefaultValue;
      //   oppIdRef.current = val;
      //   // setLoading(false);
      // } else {
      //   setError(true);
      // }

      // setLoading(true);
    } else if (
      fetchStatus === APIFetchStatus.FAILED ||
      dropDownFetchStatus === APIFetchStatus.FAILED ||
      customerDataFetchState === APIFetchStatus.FAILED ||
      sectionDataFetchStatus === APIFetchStatus.FAILED ||
      e3tRegionalDataFetchState === APIFetchStatus.FAILED ||
      e3tFxRatesFetchState === APIFetchStatus.FAILED ||
      draftLogsFetchState === APIFetchStatus.FAILED ||
      // e3tTshirtSizesFetchState === APIFetchStatus.FAILED ||
      e3tRemoteSTDsFetchState === APIFetchStatus.FAILED
    ) {
      console.log("setting error somefetch failed");
      console.log({
        fetchStatus,
        customerDataFetchState,
        dropDownFetchStatus,
        dynamicDataStateLoaded,
        sectionDataFetchStatus,
        e3tRegionalDataFetchState,
      });
      setError(true);
    } else if (
      fetchStatus === APIFetchStatus.BOOTED &&
      draftLogsFetchState === APIFetchStatus.FETCHED &&
      dropDownFetchStatus === APIFetchStatus.FETCHED &&
      customerDataFetchState === APIFetchStatus.BOOTED &&
      sectionDataFetchStatus === APIFetchStatus.BOOTED &&
      (e3tRegionalDataFetchState === APIFetchStatus.BOOTED ||
        e3tRegionalDataFetchState === APIFetchStatus.FETCHED)
    ) {
      dispatch(actionMasterDataLoadDraftData());
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
      (fetchStatus === APIFetchStatus.FETCHED || draftLogsFetchState === APIFetchStatus.FETCHED) &&
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
      sectionDataFetchStatus,
      dynamicDataStateLoaded,
      e3tRegionalDataFetchState,
      e3tFxRatesFetchState,
      customDropDownFetchState,
      draftLogsFetchState,
      e3tRemoteSTDsFetchState,
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
    draftLogsFetchState,
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

export default EditMatchDataLoadedPath;
