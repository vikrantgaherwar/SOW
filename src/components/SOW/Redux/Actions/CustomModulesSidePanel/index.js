import { Store } from "../../Store";
import axios from "axios";

import {
  actionDynamicDataFieldsApplyWorkPackages,
  actionDynamicDataFieldsCustomWorkPackageAdd,
  actionDynamicDataLoadEditData,
} from "../DynamicDataFields";
import { CUSTOM_MODULES_SIDE_PANEL_DATA } from "./customModulesSidePanelData";
import URLConfig from "../../../URLConfig";
import { DYNAMIC_DATA_TYPES } from "../DynamicDataFields/dynamicDataType";
import { makeCustomWorkPackagePacket } from "../DynamicDataFields/customWorkPackages";
import { E3T_DATA_TYPE } from "../E3T/e3tDataType";
import Cookies from "js-cookie";
import { APIFetchStatus } from "../../utils/fetchStatus";
import { isString } from "lodash";
import { actionE3TRecalculate } from "../E3T";

export const actionCustomModuleSidePanelTypeOfWorkAdd = (
  typeOfWork,
  workPackages
) => {
  return (dispatch) => {
    dispatch({
      type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_TYPE_OF_WORK_ADDED,
      payload: { typeOfWork, workPackages },
    });
  };
};

export const actionCustomModuleSidePanelOpen = () => {
  return (dispatch) => {
    dispatch({
      type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODAL_OPEN,
    });
  };
};

export const actionCustomModuleSidePanelClose = () => {
  return (dispatch) => {
    dispatch({
      type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODAL_CLOSE,
    });
  };
};

export const actionCustomModuleSidePanelToggle = () => {
  return (dispatch) => {
    dispatch({
      type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODAL_TOGGLE,
    });
  };
};

export const actionCustomModuleWPChangeName = (name, workPackageId) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_NAME_CHANGE_SETTING,
      });

      const state = Store.getState();
      const templateId = state.masterData.sowTemplate;
      const URL = URLConfig.getURL_SOW_GetCustomModulesV2();
      const res = await axios.post(URL, {
        templateId,
        selectedCustomWorkPackageIds: [workPackageId],
      });
      const data = res.data;

      const typeOfWork = state.customModuleSidePanel.customDropdown.find(
        (e) => e.id === data[0].typeOfWorkId
      );

      const packet = makeCustomWorkPackagePacket(
        typeOfWork.typeOfWork,
        name,
        data.map((e) => ({ ...e, value: e.fieldHtmlDefaultValue })),
        typeOfWork.id,
        workPackageId
      );

      console.log({ packet });

      await axios.post(URLConfig.getCustomModulesSaveUpdate(), packet);
      dispatch(actionFetchCustomModulesDropdown());
      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_NAME_CHANGE_SET,
      });

      // const packet = makeCustomWorkPackagePacket(
      //   name,
      //   workPackage.workPackage,
      //   data.map((e) => ({ ...e, value: e.fieldHtmlDefaultValue })),
      //   typeOfWorkId,
      //   workPackage.id
      // );
    } catch (err) {
      console.log(err);
      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_NAME_CHANGE_SET_FAILED,
      });
    }
  };
};
export const actionCustomModuleChangeName = (name, typeOfWorkId) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_NAME_CHANGE_SETTING,
      });
      const state = Store.getState();
      const f = state.customModuleSidePanel.customDropdown.find(
        (e) => e.id === typeOfWorkId
      );
      const templateId = state.masterData.sowTemplate;
      const workPackage = f.sowCustomModulesWorkPackages[0];
      console.log({ typeOfWorkId, workPackage });

      const URL = URLConfig.getURL_SOW_GetCustomModulesV2();
      const res = await axios.post(URL, {
        templateId,
        selectedCustomWorkPackageIds: [workPackage.id],
      });
      const data = res.data;
      // console.log({ data, f, workPackage });

      const packet = makeCustomWorkPackagePacket(
        name,
        workPackage.workPackage,
        data.map((e) => ({ ...e, value: e.fieldHtmlDefaultValue })),
        typeOfWorkId,
        workPackage.id
      );

      console.log({ packet });

      const sx = await axios.post(
        URLConfig.getCustomModulesSaveUpdate(),
        packet
      );

      dispatch(actionFetchCustomModulesDropdown());
      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_NAME_CHANGE_SET,
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_NAME_CHANGE_SET_FAILED,
      });
    }
  };
};

export const actionCustomModuleSidePanelTypeOfWorkRemove = (
  typeOfWork,
  workPackages
) => {
  return (dispatch) => {
    dispatch({
      type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_TYPE_OF_WORK_REMOVED,
      payload: { typeOfWork, workPackages },
    });
  };
};

export const actionCustomModuleSidePanelWorkPackageAdd = (workPackage) => {
  return (dispatch) => {
    dispatch({
      type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_WORK_PACKAGES_ADDED,
      payload: { workPackage },
    });
  };
};

export const actionCustomModuleSidePanelWorkPackageRemove = (workPackage) => {
  console.log({ workPackage });
  return (dispatch) => {
    dispatch({
      type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_WORK_PACKAGES_REMOVED,
      payload: { workPackage },
    });
  };
};

export const actionCustomModuleSidePanelReset = () => {
  return (dispatch) => {
    dispatch({
      type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_PANEL_RESET,
    });
    const state = Store.getState();
    if (
      state.masterDropDown.workPackageSectionData &&
      state.masterDropDown.workPackageSectionData.length > 0
    ) {
      const f = state.dynamicFields.data.sowTemplateFields.find(
        (e) =>
          e.sectionId ===
          state.masterDropDown.workPackageSectionData[0].sectionId
      );
      const typeOfWorkIds = state.customModuleSidePanel.customDropdown.map(
        (e) => e.id
      );

      const newState = state.dynamicData[f.fieldName].filter(
        (e) => typeOfWorkIds.indexOf(e[0].typeOfWorkId) === -1
      );
      console.log({ typeOfWorkIds, newState });

      dispatch({
        type: DYNAMIC_DATA_TYPES.PREDEFINED_PACKAGE_ADDED,
        payload: { workPackages: newState, fieldName: f.fieldName },
      });

      dispatch({
        type: E3T_DATA_TYPE.NEW_E3T_CUSTOM_WP_ADDED,
        payload: [],
      });
      dispatch(actionE3TRecalculate());
    } else {
      dispatch({
        type: "actionCustomModuleSidePanelReset No DATA",
      });
    }
  };
};

export const actionCustomModuleSidePanelAllReset = () => {
  return (dispatch) => {
    dispatch({
      type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_ALL_RESET,
    });
  };
};

/* new */
export const actionFetchCustomModulesDropdown = (templateId) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_DROPDOWN_FETCHING,
      });
      const state = Store.getState();
      let tempId = templateId;
      if (tempId) {
      } else {
        tempId = state.masterData.sowTemplate;
      }
      const URL =
        URLConfig.getURLDeltaSOWAPI() + "SOW/GetCustomModulesDropdownV3";

      const customWpIds =
        state.logData?.customModulesLog?.customModuleSelectedValue;

      const body = {
        templateId: tempId,

        userId: Cookies.get("empnumber"),

        selectedCustomWorkPackageIds: customWpIds
          ? JSON.parse(customWpIds)
          : [],
      };

      const res = await axios.post(URL, body);

      const log =
        state.logData.fetchStatus === APIFetchStatus.FETCHED &&
        state.logData.customModulesLog?.customModuleSelectedValue?.length > 0
          ? JSON.parse(state.logData.customModulesLog.customModuleSelectedValue)
          : [];
      const data = res.data
        .map((e) => ({
          ...e,
          sowCustomModulesWorkPackages: e.sowCustomModulesWorkPackages.filter(
            (k) => {
              // console.log({ id: k.id, log });
              return k.isPublished === false
                ? k.createdBy === Cookies.get("name")
                  ? true
                  : state.logData.fetchStatus === APIFetchStatus.FETCHED &&
                    log.indexOf(k.id) > -1
                  ? true
                  : false
                : true;
            }
          ),
        }))
        .map((e) => ({
          ...e,
          sowCustomModulesWorkPackages: e.sowCustomModulesWorkPackages.sort(
            (a, b) => (a.displayOrder > b.displayOrder ? 1 : -1)
          ),
        }))
        .sort((a, b) => (a.displayOrder > b.displayOrder ? 1 : -1));
      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_DROPDOWN_FETCHED,
        payload: data,
      });

      if (state.customModuleSidePanel.shouldLoadDynamicData) {
        dispatch(actionCustomWorkPackageShouldLoadEditValueReset());
        dispatch(actionDynamicDataLoadEditData());
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_DROPDOWN_FAILED,
      });
    }
  };
};

export const actionSubmitCustomModules = (
  templateId,
  selectedCustomWorkPackageIds,
  submit = false
) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_SUBMIT_FETCHING,
      });
      if (submit) {
        dispatch({
          type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_WORK_PACKAGES_ADDING,
        });
      }
      // const URL = URLConfig.getURL_SOW_GetCustomModulesV2();
      const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetCustomModulesDataV3";
      const res = await axios.post(URL, {
        templateId,
        selectedCustomWorkPackageIds,
      });
      const data = res.data.sowCustomModulesData;

      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_SEARCH_FETCHED,
        payload: data,
      });
      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_DOMAIN_FETCHED,
        payload: res.data.domain,
      });
      if (submit) {
        dispatch(actionDynamicDataFieldsCustomWorkPackageAdd());
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_SUBMIT_FAILED,
      });
    }
  };
};

export const actionCustomWorkPackageWorkPackageAdd = (workPackage) => {
  return (dispatch) =>
    dispatch({
      type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_STATE_ADD,
      payload: { workPackage },
    });
};

export const actionCustomWorkPackageWorkPackageRemove = (idx) => {
  return (dispatch) =>
    dispatch({
      type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_STATE_REMOVE,
      payload: { idx },
    });
};

export const actionCustomWorkPackageUpdate = (idx, name, data) => {
  return (dispatch) => {
    dispatch({
      type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_MODULES_STATE_UPDATE,
      payload: { idx, name, data },
    });
  };
};

export const actionCustomWorkPackageLoadEditData = () => {
  return (dispatch) => {
    const state = Store.getState();
    const { customModulesLog } = state.logData;
    const { customModulesDraftLog } = state.draft;
    if (
      customModulesLog &&
      customModulesLog?.customModuleSelectedValue?.length > 0
    ) {
      const workPackages = JSON.parse(
        customModulesLog.customModuleSelectedValue
      );
      const typeOfWork = state.logData.customModulesDataLog
        .filter(
          (e) => workPackages.indexOf(e.sowCustomModulesData.workPackageId) > -1
        )
        .map((e) => e.sowCustomModulesData.typeOfWorkId)
        .reduce((arr, curr) => {
          return arr.indexOf(curr) === -1 ? [...arr, curr] : [...arr];
        }, []);
      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_EDIT_LOADED,
        payload: { typeOfWork, workPackages },
      });
    } else if (
      customModulesDraftLog &&
      customModulesDraftLog?.customModuleSelectedValue?.length > 0
    ) {
      const workPackages = JSON.parse(
        customModulesDraftLog.customModuleSelectedValue
      );
      const typeOfWork = state.draft.customModulesDataDraftLog
        .filter(
          (e) => workPackages.indexOf(e.sowCustomModulesData.workPackageId) > -1
        )
        .map((e) => e.sowCustomModulesData.typeOfWorkId)
        .reduce((arr, curr) => {
          return arr.indexOf(curr) === -1 ? [...arr, curr] : [...arr];
        }, []);
      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_EDIT_LOADED,
        payload: { typeOfWork, workPackages },
      });
    } else {
      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_EDIT_LOADED,
        payload: { typeOfWork: [], workPackages: [] },
      });
    }
  };
};

export const actionCustomWorkPackagePublish = (
  CustomModulesTypeOfWorkId,
  publish = false
) => {
  return async (dispatch) => {
    const res = await axios.post(
      URLConfig.getURL_SOW_PublishCustomWorkPackage(),
      { CustomModulesTypeOfWorkId, Action: publish }
    );
    console.log({ res });
    dispatch(actionFetchCustomModulesDropdown());
  };
};

export const actionCustomWorkPackageClearSubmitData = () => {
  return (dispatch) => {
    dispatch({
      type: CUSTOM_MODULES_SIDE_PANEL_DATA.RESET_SUBMIT,
    });
  };
};

export const actionCustomWorkPackageShouldLoadEditValueChanged = (
  value = false
) => {
  return (dispatch) => {
    dispatch({
      type: CUSTOM_MODULES_SIDE_PANEL_DATA.SHOULD_LOAD_DYNAMIC_VALUE_CHANGED,
      payload: value,
    });
  };
};

export const actionCustomWorkPackageShouldLoadEditValueReset = () => {
  return (dispatch) => {
    dispatch(actionCustomWorkPackageShouldLoadEditValueChanged());
  };
};

export const actionGetCustomMainModulesData = (
  templateId,
  selectedCustomWorkPackageIds,
  selectedModule
) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_CLONE_MAIN_MODULES_CLONE_FETCHING,
      });

      const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetCustomModulesDataV3";
      const res = await axios.post(URL, {
        templateId,
        selectedCustomWorkPackageIds,
      });

      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_CLONE_MAIN_MODULES_CLONE_FETCHED,
        payload: {
          data: res.data.sowCustomModulesData,
          domain: res.data.domain,
          selectedModule,
        },
      });
    } catch (err) {
      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_CLONE_MAIN_MODULES_CLONE_FAILED,
      });
    }
  };
};

export const actionSubmitCustomMainModulesData = (
  templateId,
  selectedCustomWorkPackageIds
) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_SUBMIT_MODULES_FETCHING,
      });

      const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/CloneCustomModuleData";
      const res = await axios.post(URL, {
        templateId,
        ...selectedCustomWorkPackageIds,
      });
      dispatch(actionFetchCustomModulesDropdown());

      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_SUBMIT_MODULES_FETCHED,
      });
    } catch (err) {
      dispatch({
        type: CUSTOM_MODULES_SIDE_PANEL_DATA.CUSTOM_SUBMIT_MODULES_FAILED,
      });
    }
  };
};
