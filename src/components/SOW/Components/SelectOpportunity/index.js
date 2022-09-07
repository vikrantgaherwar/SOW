import { useRef, useEffect, useMemo, useState, useLayoutEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import Cookies from "js-cookie";
import { isNumber, trim } from "lodash";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import SOWFormFieldRowComponent from "../SOWFormFieldRowComponent";
import {
  actionCustomerDataReset,
  actionFetchCustomerData,
} from "../../Redux/Actions/CustomerData";
import {
  actionMasterDataOppIdReset,
  actionMasterDataResetData,
  actionMasterDataValueChanged,
  actionMasterDataValueReset,
  // actionSetDefaultFetchedValues,
} from "../../Redux/Actions/MasterData";
import {
  actionMasterDropDownDataReset,
  actionMasterDropDownFetchAll,
} from "../../Redux/Actions/MasterDropDown";
import { actionE3TDataReset } from "../../Redux/Actions/E3T";
import { actionSolutionHubDropDownReset } from "../../Redux/Actions/SolutionHubDropDown";
import { actionResetDynamicFields } from "../../Redux/Actions/DynamicFields";
import { actionGeneratePreviewReset } from "../../Redux/Actions/GeneratePreview";
import { actionLogDataReset } from "../../Redux/Actions/LogData";
import { actionCloneSafeResetData } from "../../Redux/Actions/CloneSafe";
import TrackingService from "../../../TrackingService";

// const SelectOpportunity = ({ isView, isClone, latestSow, isDraft }) => {
const SelectOpportunity = ({ isView, isEdit, isClone, latestSow, isDraft }) => {
  const history = useHistory();
  const match = useRouteMatch();
  const { oppId, oppIdFetched } = useSelector(
    (state) => ({
      oppId: state.masterData.oppId,
      oppIdFetched: state.masterData.oppIdFetched,
    }),
    shallowEqual
  );
  const oppIdRef = useRef(oppId);
  const oppIdIsFetchedRef = useRef(false);
  const [alreadyClonedText, setAlreadyClonedText] = useState("");
  const dispatch = useDispatch();

  const handleClick = () => {
    new TrackingService().LogSowGetInfoClick(Cookies.get("empnumber"), oppId);
    if (isClone) {
      dispatch(actionFetchCustomerData(oppId, null, false, true));
    } else {
      oppIdIsFetchedRef.current = true;
      dispatch(actionCloneSafeResetData());
      dispatch(actionMasterDataResetData());
      dispatch(actionMasterDropDownDataReset());
      dispatch(actionLogDataReset());
      dispatch(actionCustomerDataReset());
      dispatch(actionE3TDataReset());
      dispatch(actionSolutionHubDropDownReset());
      dispatch(actionResetDynamicFields());
      dispatch(actionGeneratePreviewReset());
      dispatch(actionMasterDropDownFetchAll());
      dispatch(actionFetchCustomerData(oppId, actionMasterDropDownFetchAll));

      if (match.url.indexOf("edit") > -1) {
        history.replace("/sow");
      }
    }
  };

  useLayoutEffect(() => {
    if (oppIdRef.current !== oppId) {
      // if (oppIdFetched) {
      setAlreadyClonedText("");
      dispatch(actionMasterDataOppIdReset());
      // }
      // oppIdRef.current = oppId;
    } else if (
      oppId.trim().length > 0 &&
      !(latestSow?.templateOutputName.split("_")[0] === oppId && isClone)
    ) {
      setAlreadyClonedText("");
      dispatch(actionMasterDataValueChanged("oppIdFetched", true));
    } else if (
      latestSow?.templateOutputName.split("_")[0] === oppId &&
      isClone
    ) {
      dispatch(actionMasterDataOppIdReset());
      setAlreadyClonedText("* Please change Opportunity ID");
    } else {
      setAlreadyClonedText("");
    }
  }, [oppId, isClone]);

  const isValidOppId = useMemo(() => {
    if (
      (oppId.indexOf("OPE") > -1 || oppId.indexOf("OPP") > -1) &&
      oppId.trim().length === 14 &&
      !isNaN(oppId.trim().split("-")[1])
    ) {
      return "";
    }
    return "* Please enter a valid Opportunity ID";
  }, [oppId]);

  return (
    <SOWFormFieldRowComponent
      idx={0}
      hasButton
      id={0}
      name="oppId"
      // readonly={isView || isDraft}
      readonly={isView || isEdit || isDraft}
      value={[oppId]}
      onChange={(e) =>
        !isView &&
        dispatch(actionMasterDataValueChanged("oppId", trim(e.target.value)))
      }
      required
      type="text"
      title="Opportunity ID"
      // buttonDisabled={isView || isValidOppId || alreadyClonedText || isDraft}
      buttonDisabled={isView || isEdit || isValidOppId || alreadyClonedText || isDraft}
      onButtonClick={(e) => {
        e.preventDefault();
        if (oppId) {
          handleClick();
        }
      }}
      buttonTitle="Get Info"
      bsPrefix="btn btn-sm btn-primary info-button"
      errorText={isValidOppId || alreadyClonedText}
    />
  );
};

export default SelectOpportunity;
