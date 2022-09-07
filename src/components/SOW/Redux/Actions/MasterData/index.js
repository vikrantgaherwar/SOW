import { MASTER_DATA_ACTION_TYPES } from "./MasterDataType";
import { Store } from "../../Store";
import { APIFetchStatus } from "../../utils/fetchStatus";
import {
  actionMasterDropDownDataTemplateChanged,
  actionMasterDropDownDataTemplateChangedNew,
  actionMasterDropDownFetchAll,
  actionMasterDropDownFetchSectionData,
  actionMasterDropDownFetchTemplateField,
} from "../MasterDropDown";
import {
  actionFetchSolutionHubDropDownData,
  actionSolutionHubDropDownReset,
} from "../SolutionHubDropDown";
import {
  actionFetchDynamicFields,
  actionResetDynamicFields,
} from "../DynamicFields";
import { DYNAMIC_DATA_TYPES } from "../DynamicDataFields/dynamicDataType";
import SECTION_DATA_STRUCTURE, {
  resetSectionDataStructure,
} from "../MasterDropDown/sectionDataStructure";
import { resetDynamicTableStructure } from "../DynamicDataFields/dynamicTableStructure";
import {
  actionCustomerDataLoadDraft,
  actionCustomerDataLoadEdit,
  actionCustomerDataValueChanged,
  actionFetchCustomerData,
} from "../CustomerData";
import { isNumber } from "lodash";
import { actionLogDataFetch } from "../LogData";
import { parseInteger } from "../../../Components/E3TForm/e3tFormData";
import { actionE3TLoadEditData, actionE3TRecalculate } from "../E3T";
import {
  actionDynamicDataLoadEditData,
  actionDynamicDataReset,
} from "../DynamicDataFields";
import { actionE3TFetchRegionalData } from "../E3TData";
import URLConfig from "../../../URLConfig";

export const actionMasterDataValueChanged = (name, value) => {
  return (dispatch) => {
    console.log({ name, value });
    dispatch({
      type: MASTER_DATA_ACTION_TYPES.VALUE_CHANGED,
      payload: { [name]: value },
    });
  };
};
/* country dropdown data*/
// export const actionGetCountryDropdownData = () => {
//   return async (dispatch) => {
//     try {
//       dispatch({
//         type: MASTER_DATA_ACTION_TYPES.COUNTRY_DROPDOWN_DATA_FETCHING,
//       });
//       const url = URLConfig.getCountryDropDownURL();
//       const res = await axios.post(url);
//       dispatch({
//         type: MASTER_DATA_ACTION_TYPES.COUNTRY_DROPDOWN_DATA_FETCHED,
//         payload: res.data,
//       });
//     } catch (err) {
//       dispatch({
//         type: MASTER_DATA_ACTION_TYPES.COUNTRY_DROPDOWN_DATA_FAILED,
//       });
//     }
//   };
// };

export const actionMasterDataCountryChanged = (country) => {
  return (dispatch) => {
    const state = Store.getState();
    const countryName = state.masterDropDown.countryDropDownData.find(
      (c) => c.id === country
    );
    dispatch(actionCustomerDataValueChanged("countryName", countryName.name));
    dispatch(actionMasterDataValueChanged("country", country));
    dispatch(actionMasterDropDownFetchTemplateField(country, ""));
    dispatch(actionE3TFetchRegionalData(country, "", false, true));
  };
};

export const actionMasterDataBusinessChanged = (name, value) => {
  return (dispatch) => {
    dispatch(actionMasterDataValueChanged(name, value));
    dispatch(actionResetDynamicFields());
    dispatch(actionSolutionHubDropDownReset());
    dispatch(actionMasterDropDownFetchTemplateField("", value));
  };
};

export const actionMasterDataOpportunityIdFetched = (country, edit) => {
  return (dispatch) => {
    dispatch({
      type: MASTER_DATA_ACTION_TYPES.VALUE_CHANGED,
      payload: edit
        ? {
            oppIdFetched: true,
          }
        : {
            country,
            oppIdFetched: true,
          },
    });
  };
};

export const actionMasterDataTemplateChanged = (name, value) => {
  return (dispatch) => {
    dispatch({ type: DYNAMIC_DATA_TYPES.FIELDS_RESET });
    resetSectionDataStructure();
    resetDynamicTableStructure();
    dispatch(actionResetDynamicFields());
    dispatch(actionSolutionHubDropDownReset());

    // dispatch(actionMasterDropDownFetchAll(state.masterData.country, id));
    dispatch(actionMasterDropDownDataTemplateChangedNew(value));

    // dispatch(actionMasterDropDownFetchSectionData(id));
    // dispatch(actionFetchSolutionHubDropDownData(id));
    // dispatch(actionFetchDynamicFields(id));
    dispatch({
      type: MASTER_DATA_ACTION_TYPES.VALUE_CHANGED,
      payload: { [name]: value },
    });
  };
};

export const actionMasterDataValueReset = () => {
  return (dispatch) => {
    dispatch({
      type: MASTER_DATA_ACTION_TYPES.MASTER_DATA_RESET,
    });
  };
};

export const actionMasterDataOppIdReset = () => {
  return (dispatch) => {
    dispatch({
      type: MASTER_DATA_ACTION_TYPES.MASTER_DATA_OPPID_RESET,
    });
  };
};
export const actionSetDefaultFetchedValues = () => {
  return (dispatch) => {
    const state = Store.getState();
    const ddData = state.masterDropDown;

    if (ddData.preloadFieldsDataFetchDataStatus === APIFetchStatus.FETCHED) {
      dispatch({
        type: MASTER_DATA_ACTION_TYPES.VALUE_CHANGED,
        payload: {
          business: ddData["businessDropDownData"][0],
          country: "AU",
          contractTerms: ddData["contractTermsDropDownData"][0],
          revRecog: ddData["revRecogDropDownData"][0],
          sowTemplate:
            ddData["templateFieldDropDownData"][0]["templateInputName"],
        },
      });
    } else {
      dispatch({
        type: "WRONG_USE_OF_actionSetDefaultFetchedValues",
      });
    }
  };
};

export const actionMasterDataLoadDraftData = () => {
  return (dispatch) => {
    console.log("actionMasterDataLoadDraftData")
    const state = Store.getState();
    const customerLogData = state.draft.customerDraftLog;
    const masterData = {
      business: "",
      country: "",
      contractTerms: "",
      revRecog: "",
      sowTemplate: "",
      oppId: "",
    };
    const ddData = state.masterDropDown.templateFieldDropDownData;

    customerLogData.forEach((row) => {
      switch (row.standardField.fieldName) {
        case "business":
          masterData.business = row.fieldDefaultValue;
          break;
        // case "countryName": {
        //   const cc = row.fieldDefaultValue;
        //   const state = Store.getState();
        //   const f = state.masterDropDown.countryDropDownData.find(
        //     (e) => e.name === cc
        //   );

        //   masterData.country = f.id;
        //   break;
        // }
        case "countryCode":
          masterData.country = row.fieldDefaultValue;
          break;
        case "contractTerm":
          masterData.contractTerms = row.fieldDefaultValue;
          break;
        case "oppId":
          masterData.oppId = row.fieldDefaultValue;
          break;
        case "sowTemplate":
          const id = isNumber(row.fieldDefaultValue)
            ? row.fieldDefaultValue.toString()
            : row.fieldDefaultValue;

          // console.log({ id, ddData, d });
          masterData.sowTemplate = id;
          break;
        case "revenueRecognition":
          masterData.revRecog = row.fieldDefaultValue;
          break;
        default:
          break;
      }
    });
    // console.log({ masterData });

    dispatch(
      actionFetchCustomerData(
        masterData.oppId,
        actionCustomerDataLoadDraft,
        true
      )
    );

    dispatch({
      type: MASTER_DATA_ACTION_TYPES.VALUE_CHANGED,
      payload: { ...masterData },
    });
  };
};

export const actionMasterDataLoadEditData = () => {
  return (dispatch) => {
    const state = Store.getState();
    const customerLogData = state.logData.customerLog;
    const masterData = {
      business: "",
      country: "",
      contractTerms: "",
      revRecog: "",
      sowTemplate: "",
      oppId: "",
    };
    const ddData = state.masterDropDown.templateFieldDropDownData;

    customerLogData.forEach((row) => {
      switch (row.standardField.fieldName) {
        case "business":
          masterData.business = row.fieldDefaultValue;
          break;
        // case "countryName": {
        //   const cc = row.fieldDefaultValue;
        //   const state = Store.getState();
        //   const f = state.masterDropDown.countryDropDownData.find(
        //     (e) => e.name === cc
        //   );

        //   masterData.country = f.id;
        //   break;
        // }
        case "countryCode":
          masterData.country = row.fieldDefaultValue;
          break;
        case "contractTerm":
          masterData.contractTerms = row.fieldDefaultValue;
          break;
        case "oppId":
          masterData.oppId = row.fieldDefaultValue;
          break;
        case "sowTemplate":
          const id = isNumber(row.fieldDefaultValue)
            ? row.fieldDefaultValue.toString()
            : row.fieldDefaultValue;

          // console.log({ id, ddData, d });
          masterData.sowTemplate = id;
          break;
        case "revenueRecognition":
          masterData.revRecog = row.fieldDefaultValue;
          break;
        default:
          break;
      }
    });
    // console.log({ masterData });

    dispatch(
      actionFetchCustomerData(
        masterData.oppId,
        actionCustomerDataLoadEdit,
        true
      )
    );

    dispatch({
      type: MASTER_DATA_ACTION_TYPES.VALUE_CHANGED,
      payload: { ...masterData },
    });
  };
};

export const actionMasterDataResetAll = () => {
  return (dispatch) => {
    dispatch({ type: MASTER_DATA_ACTION_TYPES.MASTER_DATA_RESET_ALL });
  };
};

export const actionMasterDataResetData = () => {
  return (dispatch) => {
    dispatch({ type: MASTER_DATA_ACTION_TYPES.MASTER_DATA_RESET_DATA });
  };
};

export const actionMasterDataSelectCloneFrom = (name, value) => {
  return (dispatch) => {
    dispatch({
      type: MASTER_DATA_ACTION_TYPES.VALUE_CHANGED,
      payload: { [name]: value },
    });

    dispatch(actionLogDataFetch(value, true));
  };
};

export const actionMasterDataLoadClone = () => {
  return (dispatch) => {
    const state = Store.getState();
    const masterData = state.logData.customerLog;
    const template = masterData.find(
      (e) => e.standardField.fieldName === "sowTemplate"
    );
    if (template) {
      const templateValue = parseInteger(template.fieldDefaultValue);
      const t = state.masterDropDown.templateFieldDropDownData.find(
        (e) => e.id === templateValue
      );
      if (t) {
        const templateName = t.templateInputName;
        if (state.masterData.sowTemplate !== templateName) {
          // dispatch(
          //   // actionMasterDropDownDataTemplateChanged(templateValue, true)
          // );
        } else {
          dispatch(actionDynamicDataLoadEditData(true));
          dispatch(actionE3TLoadEditData());
          dispatch(actionE3TRecalculate());
        }
      }
    }
  };
};
