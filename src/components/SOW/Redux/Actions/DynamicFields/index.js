import axios from "axios";
import URLConfig from "../../../URLConfig";
import {
  actionDynamicDataFieldsLoadState,
  actionDynamicDataReset,
} from "../DynamicDataFields";
import { actionModuleSidePanelAllReset } from "../ModulesSidePanel";
import { DYNAMIC_FIELDS_DATA } from "./dynamicFieldsData";

export const actionFetchDynamicFields = (templateId, edit) => {
  // console.log({ actionFetchDynamicFields: "called" });
  return async (dispatch) => {
    try {
      dispatch({
        type: DYNAMIC_FIELDS_DATA.API_FETCHING,
      });

      const URL = URLConfig.getURLDeltaSOWAPI() + "SOW/GetDynamicFields";

      const res = await axios.get(URL, { params: { templateId } });

      const data = res.data;
      let newData = [];
      let noSectionData = [];
      let MsaTextArea = {};
      let headersTemp = {};
      data.sowTemplateFields.forEach((row) => {
        // let isNoSection = false;
        // if(row.sectionId === null){
        //   isNoSection = true;
        // }
        if (row.sectionId === null && row.tableId === null) {
          newData = [...newData, row];
          noSectionData = [...noSectionData, row];
        } else if (row.sectionId && row.tableId) {
          const table = { ...row, headers: [] };
          newData = [...newData, table];
          // noSectionData = [...noSectionData, table];
        } else if (row.sectionId === null && row.tableId) {
          /* Client agreement - MSA field value */
          if (row.contentControlTitle === "MSAContent") {
            // newData = [...newData, row];
            MsaTextArea = row;
          }
          const index = newData.findIndex((e) => e.tableId === row.tableId);
          console.log({ row, index });
          if (index === -1 && row.contentControlType !== "table") {
            // type table
            headersTemp[row.tableId] = headersTemp[row.tableId] ?? [];
            headersTemp[row.tableId] = [...headersTemp[row.tableId], row];
            console.log({ adding: row, headersTemp });
            // newData[index]["headers"] = [...newData[index]["headers"], row];
          } else if (index === -1 && row.contentControlType === "table") {
            const newRow = {
              ...row,
              headers: headersTemp[row.tableId]
                ? [...headersTemp[row.tableId]]
                : [],
            };
            console.log({ newRow });
            newData = [...newData, { ...newRow }];
            // noSectionData = [...noSectionData, newRow];
            headersTemp = Object.keys(headersTemp)
              .filter((key) => key !== row.tableId)
              .map((e) => headersTemp[e]); //remove the element from the header temp
            // console.log({ removing: row, headersTemp, newRow, newData });
          } else {
            console.log({ tableData: row });
            newData[index]["headers"] = [...newData[index]["headers"], row];
          }
        } else if (row.sectionId && row.tableId === null) {
          newData = [...newData, row];
          // noSectionData = [...noSectionData, row];
        }
      });

      let sectionData = newData.filter((e) => e.sectionId === null);
      console.log({ sectionData });
      let sections = [];

      data.sowSections.forEach((section) => {
        const newSection = { ...section };

        newSection.children = newData.filter(
          (row) => row.sectionId === section.id
        );
        if (newSection.children.length > 0) {
          sections = [...sections, newSection];
        }
      });

      // section

      sectionData = [
        ...sectionData,
        ...sections.sort((a, b) => (a.displayOrder > b.displayOrder ? 1 : -1)),
      ];

      // console.log({newData});

      dispatch({
        type: DYNAMIC_FIELDS_DATA.API_FETCHED,
        payload: { data: res.data, fields: sectionData, MsaTextArea },
      });

      dispatch(actionDynamicDataFieldsLoadState(newData, edit));
    } catch (err) {
      console.error(err);
      dispatch({
        type: DYNAMIC_FIELDS_DATA.API_FETCH_FAILED,
      });
    }
  };
};

export const actionResetDynamicFields = () => {
  return (dispatch) => {
    dispatch(actionDynamicDataReset());
    dispatch(actionModuleSidePanelAllReset());
    dispatch({
      type: DYNAMIC_FIELDS_DATA.API_RESET,
    });
  };
};
