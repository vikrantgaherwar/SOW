import axios from "axios";
import URLConfig from "../../../URLConfig";
import { Store } from "../../Store";
import { actionDynamicDataFieldsEditWorkPackagesUpdated } from "../DynamicDataFields";
import { actionE3TLoadEditData } from "../E3T";
import {
  actionModuleSidePanelAllReset,
  actionModuleSidePanelLoadEditData,
} from "../ModulesSidePanel";
import SolHubDropDownTable from "./SolHubDropDownTable";
import { SolHubToken, solHubToken } from "./solHubToken";
import { SOLUTION_HUB_DROP_DOWN_DATA } from "./solutionHubDropDownData";

// let source = axios.CancelToken.source();

export const actionFetchSolutionHubDropDownData = (templateId, edit) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SOLUTION_HUB_DROP_DOWN_DATA.DROP_DOWN_DATA_FETCHING,
      });
      SolHubDropDownTable.resetTables();

      if (process.env.REACT_APP_ENV !== "PROD") {
        console.warn(
          "NEED TO FIX DEV AND PROD SWITCH FOR SOLUTION HUB DROP DOWN"
        );
      }
      const URL =
        URLConfig.getURLDeltaSOWAPI() + "SOW/GetSolutionHubDropdownV2";

      const res = await axios.get(URL, {
        params: {
          templateId,
          // Need to Remove this later
          prodFlag: `${process.env.REACT_APP_ENV === "PROD" ? "1" : "0"}`,
        },
        cancelToken: SolHubToken.token.token,
      });

      const data = res.data
        .map((e) => ({
          ...e,
          sowSolutionHubWorkPackages: e.sowSolutionHubWorkPackages.sort(
            (a, b) => (a.displayOrder > b.displayOrder ? 1 : -1)
          ),
        }))
        .sort((a, b) => (a.displayOrder > b.displayOrder ? -1 : 1));

      if (edit) {
        const state = Store.getState();
        const dynamicData = state.dynamicData;
        const sectionId =
          state.masterDropDown.workPackageSectionData &&
          state.masterDropDown.workPackageSectionData.length > 0
            ? state.masterDropDown.workPackageSectionData[0].sectionId
            : -999;

        if (sectionId !== -999) {
          const field = state.dynamicFields.data.sowTemplateFields.find(
            (e) => e.sectionId === sectionId
          );
          console.log({ field, sectionId });
          // console.log({ dd: dynamicData[field.fieldName], field: field });
          const wp = dynamicData[field.fieldName].map((e) => {
            console.log({ solHubDD: e });
            if (e.length > 0) {
              if (!e[0].sectionName) {
                const workPackageId = e[0].workPackageId;
                const typeOfWorkId = e[0].typeOfWorkId;

                let field = data.find((z) => z.id === typeOfWorkId);

                let wp = field.sowSolutionHubWorkPackages.find(
                  (k) => k.id === workPackageId
                );

                console.log({ field, wp, workPackageId });

                return e.map((k) => ({
                  ...k,
                  typeOfWork: field.typeOfWork,
                  workPackage: wp.workPackage,
                }));
              }
              return e;
            }
            return e;
          });

          dispatch(
            actionDynamicDataFieldsEditWorkPackagesUpdated(field.fieldName, wp)
          );
        }

        dispatch(actionModuleSidePanelLoadEditData(data));
        dispatch(actionE3TLoadEditData());
      }
      // dispatch(actionFetchCustomModulesDropdown(id));

      dispatch({
        type: SOLUTION_HUB_DROP_DOWN_DATA.DROP_DOWN_DATA_FETCHED,
        payload: data,
      });

      // SolHubDropDownTable.getAllTables();
    } catch (err) {
      console.error(err);
      dispatch({
        type: SOLUTION_HUB_DROP_DOWN_DATA.DROP_DOWN_DATA_FETCH_FAILED,
      });
    }
  };
};

export const actionSolutionHubDropDownReset = () => {
  return (dispatch) => {
    console.log("resetting solhubDD");
    // source.cancel();
    SolHubToken.cancelToken();
    dispatch(actionModuleSidePanelAllReset());
    dispatch({ type: SOLUTION_HUB_DROP_DOWN_DATA.DROP_DOWN_DATA_RESET });
  };
};
