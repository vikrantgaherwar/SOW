import axios from "axios";
import { uniq } from "lodash";
import URLConfig from "../../../URLConfig";
import { Store } from "../../Store";
import { actionFetchCustomModulesDropdown } from "../CustomModulesSidePanel";
import { CUSTOM_MODULES_SIDE_PANEL_DATA } from "../CustomModulesSidePanel/customModulesSidePanelData";
import { actionDynamicDataFieldsApplyWorkPackages } from "../DynamicDataFields";
import { actionFetchDynamicFields } from "../DynamicFields";
import { actionE3TGetTShirtSizesV2 } from "../E3TData";
import { MODULES_SIDE_PANEL_DATA } from "./modulesSidePanelData";
import { DYNAMIC_DATA_TYPES } from "../DynamicDataFields/dynamicDataType";
import { APIFetchStatus } from "../../utils/fetchStatus";

export const actionModuleSidePanelTypeOfWorkAdd = (
  typeOfWork,
  workPackages
) => {
  return (dispatch) => {
    dispatch({
      type: MODULES_SIDE_PANEL_DATA.TYPE_OF_WORK_ADDED,
      payload: { typeOfWork, workPackages },
    });
  };
};

export const actionModuleSidePanelOpen = () => {
  return (dispatch) => {
    dispatch({
      type: MODULES_SIDE_PANEL_DATA.MODAL_OPEN,
    });
  };
};

export const actionModuleSidePanelClose = () => {
  return (dispatch) => {
    dispatch({
      type: MODULES_SIDE_PANEL_DATA.MODAL_CLOSE,
    });
  };
};

export const actionModuleSidePanelToggle = () => {
  return (dispatch) => {
    dispatch({
      type: MODULES_SIDE_PANEL_DATA.MODAL_TOGGLE,
    });
  };
};

export const actionModuleSidePanelTypeOfWorkRemove = (
  typeOfWork,
  workPackages
) => {
  return (dispatch) => {
    dispatch({
      type: MODULES_SIDE_PANEL_DATA.TYPE_OF_WORK_REMOVED,
      payload: { typeOfWork, workPackages },
    });
  };
};

export const actionModuleSidePanelWorkPackageAdd = (workPackage) => {
  return (dispatch) => {
    dispatch({
      type: MODULES_SIDE_PANEL_DATA.WORK_PACKAGES_ADDED,
      payload: { workPackage },
    });
  };
};

export const actionModuleSidePanelWorkPackageRemove = (workPackage) => {
  console.log({ workPackage });
  return (dispatch) => {
    dispatch({
      type: MODULES_SIDE_PANEL_DATA.WORK_PACKAGES_REMOVED,
      payload: { workPackage },
    });
  };
};

export const actionModuleSidePanelReset = (isData) => {
  return (dispatch) => {
    dispatch({
      type: MODULES_SIDE_PANEL_DATA.PANEL_RESET,
    });
    if (isData) {
      dispatch(actionDynamicDataFieldsApplyWorkPackages([]));
    }
  };
};

export const actionModuleSidePanelAllReset = () => {
  return (dispatch) => {
    dispatch({
      type: MODULES_SIDE_PANEL_DATA.ALL_RESET,
    });
  };
};

export const actionModuleSidePanelLoadEditData = (data) => {
  return (dispatch) => {
    const state = Store.getState();

    // const id =
    //       state.draft.draftLogsFetchState === APIFetchStatus.FETCHED &&
    //       state.draft.customerDraftLog &&
    //       state.draft.customerDraftLog.length > 0
    //         ? state.draft.customerDraftLog[0].templateId.toString()
    //         : state.logData.customerLog[0].templateId.toString();

    const predefinedModulesSelected =
      state.draft.draftLogsFetchState === APIFetchStatus.FETCHED &&
      state.draft.predefinedModulesDraftLog &&
      state.draft.predefinedModulesDraftLog.predefinedModuleSelectedValue
        ? JSON.parse(
            state.draft.predefinedModulesDraftLog.predefinedModuleSelectedValue
          )
        : JSON.parse(state.logData.predefinedLog.predefinedModuleSelectedValue);

    // const predefinedModulesSelected =
    //   state.logData.predefinedLog.length > 0
    //     ? JSON.parse(state.logData.predefinedLog.predefinedModuleSelectedValue)
    //     : JSON.parse(
    //         state.draft.predefinedModulesDraftLog.predefinedModuleSelectedValue
    //       );
    const solHubDD = data ? data : state.solutionHubDropDown.dropDown;
    console.log({ data, solHubDD, predefinedModulesSelected });

    const packages = solHubDD
      .filter((e) => {
        const f = e.sowSolutionHubWorkPackages.find(
          (k) => predefinedModulesSelected.indexOf(k.id) > -1
        );
        if (f) {
          return true;
        } else {
          return false;
        }
      })
      .map((e) => e.id);

    const f = solHubDD.filter((e) =>
      e.sowSolutionHubWorkPackages
        .map((k) => k.id)
        .filter((k) => predefinedModulesSelected.indexOf(k) > -1)
    );

    if (!predefinedModulesSelected.length) {
      const pricingData = {};
      state.logData.transactionalLog.length &&
        state.logData.transactionalLog.forEach((log) => {
          if (
            log.field.contentControlTitle === "Consulting Services Price" ||
            log.field.contentControlTitle === "Travel and Expense Price" ||
            log.field.contentControlTitle === "Tooling Software Price" ||
            log.field.contentControlTitle === "Pricing Estimate Cost"
          ) {
            pricingData[log.field.contentControlTitle] =
              parseFloat(log.fieldValue) ?? 0;
          }
        });

      dispatch({
        type: DYNAMIC_DATA_TYPES.FIELDS_LOADED,
        payload: pricingData,
      });
    }

    dispatch(actionE3TGetTShirtSizesV2(packages));

    dispatch({
      type: MODULES_SIDE_PANEL_DATA.EDIT_LOADED,
      payload: {
        typeOfWork: packages,
        workPackages: predefinedModulesSelected,
      },
    });
  };
};

export const actionSetTowDisabled = (typeOfWork) => {
  return (dispatch) => {
    dispatch({
      type: MODULES_SIDE_PANEL_DATA.SET_TOW_DISABLED,
      payload: typeOfWork,
    });
  };
};

export const actionSetTowWp = (selectedTow, workPkg) => {
  return (dispatch) => {
    const state = Store.getState();
    const tow = state.solutionHubDropDown?.dropDown?.find(
      (e) => e.id === selectedTow[0]
    );
    const typeOfWork = tow?.typeOfWork;
    const towId = tow?.id;
    const wpName = workPkg.name;
    const wpid = workPkg.id;
    dispatch({
      type: MODULES_SIDE_PANEL_DATA.SET_TOW_WP,
      payload: {
        typeOfWork: { value: typeOfWork, label: typeOfWork, id: towId },
        wp: {
          value: wpName,
          label: wpName,
          id: wpid,
          displayOrder: workPkg?.displayOrder,
        },
      },
    });
  };
};

export const actionGetSolutionHubData = (templateId, workPackage) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: MODULES_SIDE_PANEL_DATA.GET_SOLUTION_HUB_DATA_FETCHING,
      });
      const URL3 = URLConfig.getURLDeltaSOWAPI() + "SOW/GetSolutionHubData";
      const solutionHubRes = await axios.post(URL3, workPackage, {
        params: { templateId },
      });
      dispatch({
        type: MODULES_SIDE_PANEL_DATA.GET_SOLUTION_HUB_DATA_FETCHED,
        payload: solutionHubRes.data,
      });
    } catch (err) {
      dispatch({
        type: MODULES_SIDE_PANEL_DATA.GET_SOLUTION_HUB_DATA_FAILED,
      });
    }
  };
};

export const actionSubmitCloneSelectedTypeOfWork = (
  templateId,
  typeOfWorkName,
  workPackage
) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: MODULES_SIDE_PANEL_DATA.TYPE_OF_WORK_DATA_FETCHING,
      });
      const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetSolutionHubData";
      const towCloningData = await axios.post(URL, workPackage, {
        params: { templateId },
      });
      dispatch({
        type: MODULES_SIDE_PANEL_DATA.TYPE_OF_WORK_DATA_FETCHED,
        payload: { data: towCloningData.data, typeOfWorkName },
      });
    } catch (err) {
      dispatch({
        type: MODULES_SIDE_PANEL_DATA.TYPE_OF_WORK_DATA_FAILED,
      });
    }
  };
};

export const actionSaveSelectedTypeOfWorkClone = (templateID, workPackage) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: MODULES_SIDE_PANEL_DATA.TYPE_OF_WORK_CLONE_SAVE_FETCHING,
      });
      const URL =
        URLConfig.getURLDeltaSOWAPI() +
        "SOW/ClonePredefinedModuleDataToCustomModule";
      const data = await axios.post(URL, workPackage, {
        params: { templateID },
      });
      dispatch({
        type: MODULES_SIDE_PANEL_DATA.TYPE_OF_WORK_CLONE_SAVE_FETCHED,
      });
      dispatch(actionFetchCustomModulesDropdown());
    } catch (err) {
      dispatch({
        type: MODULES_SIDE_PANEL_DATA.TYPE_OF_WORK_CLONE_SAVE_FAILED,
      });
    }
  };
};

export const actionGetCloneSelectedTypeOfWork = (typeOfWork) => {
  return (dispatch) => {
    dispatch({
      type: MODULES_SIDE_PANEL_DATA.GET_CLONE_SELECTED_TYPE_OF_WORK,
      payload: typeOfWork,
    });
  };
};
