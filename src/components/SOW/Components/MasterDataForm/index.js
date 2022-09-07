import {
  EDIT_DISABLED_MASTER_DATA_FIELDS,
  selectMasterFormData,
} from "./selectOpportunityData";
import SOWFormFieldRowComponent from "../SOWFormFieldRowComponent";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  actionMasterDataBusinessChanged,
  actionMasterDataCountryChanged,
  actionMasterDataSelectCloneFrom,
  actionMasterDataTemplateChanged,
  actionMasterDataValueChanged,
} from "../../Redux/Actions/MasterData";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import MyRow from "../MyRow";
import SOWFormFieldComponent from "../SOWFormFieldComponent";
import { useLocation } from "react-router";
import { actionCustomerDataResetSKU } from "../../Redux/Actions/CustomerData";
import {
  actionCloneSafeSaveNewBusiness,
  actionCloneSafeSaveNewTemplate,
  actionCloneSafeShowModal,
} from "../../Redux/Actions/CloneSafe";
import { actionFetchCustomModulesDropdown } from "../../Redux/Actions/CustomModulesSidePanel";

const MasterDataForm = ({ form, isView, isClone, isEdit, isDraft }) => {
  const {
    masterDropDownData,
    masterData,
    history,
    cloneBreak,
    customerDataFetchState,
    draftLogsFetchState,
    latestDataId,
  } = useSelector(
    (state) => ({
      masterDropDownData: state.masterDropDown,
      masterData: state.masterData,
      cloneBreak: state.cloneSafe.cloneBreak,
      customerDataFetchState: state.customerData.customerDataFetchState,
      draftLogsFetchState: state.draft.draftLogsFetchState,
      latestDataId: state.logData.latestData.id,
      history: state.showHistory.history.map((e) => ({
        name: e.templateOutputName
          .split("_")
          // .splice(0, 3)
          .map((k, idx) =>
            idx === 1
              ? k
                  .split(" ")
                  .map((x) => x.charAt(0))
                  .join("")
              : k
          )
          .join("_"),
        id: e.id.toString(),
      })),
    }),
    shallowEqual
  );
  const dispatch = useDispatch();
  const handleClick = () => {};

  // const location = useLocation();
  return (
    <>
      {selectMasterFormData.map((e, idx1) => {
        const readonly =
          masterDropDownData.preloadFieldsDataFetchDataStatus !==
            APIFetchStatus.FETCHED ||
          (EDIT_DISABLED_MASTER_DATA_FIELDS.indexOf(e.name) > -1 && isEdit) ||
          (EDIT_DISABLED_MASTER_DATA_FIELDS.indexOf(e.name) > -1 &&
            isDraft &&
            draftLogsFetchState === APIFetchStatus.FETCHED &&
            latestDataId !== -1) ||
          isView;
        return (
          <SOWFormFieldComponent
            key={`${e.name}_${e.title}_${e.id}_${e.idx1}`}
            idx={idx1}
            id={e.id}
            value={masterData[e.name]}
            readonly={readonly}
            onChange={(ev) => {
              if (e.name === "sowTemplate") {
                // const id = masterDropDownData["templateFieldDropDownData"].find(
                //   (template) => template.templateInputName === ev.target.value
                // )["id"];
                if (isClone && !cloneBreak) {
                  dispatch(actionCloneSafeSaveNewTemplate(ev.target.value));
                  dispatch(actionCloneSafeShowModal("template"));
                } else {
                  dispatch(actionCustomerDataResetSKU());
                  dispatch(
                    actionMasterDataTemplateChanged(e.name, ev.target.value)
                  );
                  dispatch(actionFetchCustomModulesDropdown(ev.target.value));
                }
              } else if (e.name === "clone") {
                console.warn("clone from master data is deprecated");
                dispatch(
                  actionMasterDataSelectCloneFrom(e.name, ev.target.value)
                );
              } else if (e.name === "business") {
                if (isClone && !cloneBreak) {
                  dispatch(actionCloneSafeSaveNewBusiness(ev.target.value));
                  dispatch(actionCloneSafeShowModal("business"));
                } else {
                  dispatch(
                    actionMasterDataBusinessChanged(e.name, ev.target.value)
                  );
                }
              } else if (e.name === "country") {
                dispatch(actionMasterDataCountryChanged(ev.target.value));
              } else {
                dispatch(actionMasterDataValueChanged(e.name, ev.target.value));
              }
            }}
            title={e.title}
            required={e.required}
            name={e.name}
            disabled={customerDataFetchState !== APIFetchStatus.FETCHED}
            type={e.type}
            buttonTitle={e.buttonTitle}
            hasButton={e.hasButton}
            onButtonClick={(ev) => {
              if (e.hasButton && masterData[e.name].length === 14) {
                ev.preventDefault();
                handleClick();
              }
            }}
            hasSelectData={e.hasSelectData}
            list={
              e.name === "country"
                ? masterDropDownData["countryDropDownData"]
                : e.name === "business"
                ? masterDropDownData["businessDropDownData"]
                : e.name === "contractTerms"
                ? masterDropDownData["contractTermsDropDownData"]
                : e.name === "revRecog"
                ? masterDropDownData["revRecogDropDownData"]
                : e.name === "clone"
                ? history
                : e.name === "sowTemplate"
                ? masterDropDownData["templateFieldDropDownData"]
                : []
            }
            placeholder={e.placeholder}
          />
        );
      })}
    </>
  );
};

export default MasterDataForm;
