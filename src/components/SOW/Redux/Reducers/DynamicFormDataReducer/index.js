import { DYNAMIC_DATA_TYPES } from "../../Actions/DynamicDataFields/dynamicDataType";
import { getTableStucture } from "../../Actions/DynamicDataFields/dynamicTableStructure";
import {
  generateBlankSectionData,
  generateBlankSectionTypeOfWork,
} from "../../Actions/MasterDropDown/sectionDataStructure";
import SolHubDropDownTable from "../../Actions/SolutionHubDropDown/SolHubDropDownTable";
import { arrPosMove, findWorkPackageId } from "../../utils/arrPosMove";
import { APIFetchStatus } from "../../utils/fetchStatus";

const initialState = {
  stateLoaded: APIFetchStatus.BOOTED,
  pageUpdate: APIFetchStatus.BOOTED,
  wpSectionDataLoad: APIFetchStatus.BOOTED,
  customModulesFetchState: APIFetchStatus.BOOTED,
};

const DynamicFormDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case DYNAMIC_DATA_TYPES.FIELDS_RESET:
      return { ...initialState };
    case DYNAMIC_DATA_TYPES.FIELDS_LOADED:
      return {
        ...state,
        ...action.payload,
        stateLoaded: APIFetchStatus.FETCHED,
        pageUpdate: APIFetchStatus.FETCHED,
      };
    case DYNAMIC_DATA_TYPES.SECTION_DATA_LOADING:
      return {
        ...state,
        wpSectionDataLoad: APIFetchStatus.FETCHING,
      };
    case DYNAMIC_DATA_TYPES.SECTION_DATA_LOADED:
      return {
        ...state,
        wpSectionDataLoad: APIFetchStatus.FETCHED,
      };
    case DYNAMIC_DATA_TYPES.FIELD_VALUE_CHANGED:
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case DYNAMIC_DATA_TYPES.FIELD_MULTIPLE_VALUE_CHANGED:
      if (
        !isNaN(action.payload.value) &&
        state[action.payload.name]?.split(" ")[1]
      ) {
        return {
          ...state,
          [action.payload.name]: state[action.payload.name].replace(
            state[action.payload.name]?.split(" ")[0],
            action.payload.value
          ),
        };
      } else if (isNaN(action.payload.value)) {
        return {
          ...state,
          [action.payload.name]: state[action.payload.name].replace(
            state[action.payload.name]?.split(" ")[1],
            action.payload.value
          ),
        };
      }
      return {
        ...state,
        [action.payload.name]: action.payload.value + " " + "Days",
      };

    case DYNAMIC_DATA_TYPES.TABLE_VALUE_CHANGED:
      return {
        ...state,
        [action.payload.tableName]: state[action.payload.tableName].map(
          (row, index) => {
            const newRow = { ...row };
            if (index === action.payload.index) {
              newRow[action.payload.name] = action.payload.value;
            }
            return newRow;
          }
        ),
      };

    case DYNAMIC_DATA_TYPES.TABLE_ROW_REMOVED:
      return {
        ...state,
        [action.payload.name]:
          state[action.payload.name].length === 1
            ? [getTableStucture(action.payload.name)]
            : state[action.payload.name].filter(
                (_, index) => index !== action.payload.index
              ),
      };

    case DYNAMIC_DATA_TYPES.CUSTOM_MODULES_SAVE_UPDATE_FETCHING:
      return { ...state, customModulesFetchState: APIFetchStatus.FETCHING };

    case DYNAMIC_DATA_TYPES.CUSTOM_MODULES_SAVE_UPDATE_FETCHED:
      return { ...state, customModulesFetchState: APIFetchStatus.FETCHED };

    case DYNAMIC_DATA_TYPES.CUSTOM_MODULES_SAVE_UPDATE_FAILED:
      return { ...state, customModulesFetchState: APIFetchStatus.FAILED };

    case DYNAMIC_DATA_TYPES.FIELDS_CHANGED:
      return {
        ...state,
        ...action.payload,
      };

    case DYNAMIC_DATA_TYPES.TABLE_ROW_ADDED:
      state[action.payload.name].splice(
        action.payload.index + 1,
        0,
        getTableStucture(action.payload.name)
      );
      return {
        ...state,
        [action.payload.name]: [...state[action.payload.name]],
      };
    case DYNAMIC_DATA_TYPES.FIELDS_PAGE_UPDATE:
      return {
        ...state,
        pageUpdate: APIFetchStatus.FETCHED,
        ...action.payload,
      };
    case DYNAMIC_DATA_TYPES.PAGE_SHOULD_UPDATE:
      return {
        ...state,
        pageUpdate: APIFetchStatus.BOOTED,
      };

    case DYNAMIC_DATA_TYPES.CUSTOM_WORK_PACKAGE_ADD: {
      // return {
      //   ...state,
      //   [action.payload.name]: [
      //     ...state[action.payload.name],
      //     ...action.payload.data,
      //   ],
      // };
      // const oldState = [...state[action.payload.name]];
      // let newState = [];
      // action.payload.data.forEach(e => {
      //   const f = oldState.find(k => k.workPackageId === e.workPackageId && )
      // })
      return {
        ...state,
        [action.payload.name]: [
          ...state[action.payload.name].filter((e) => !e[0].sectionName),
          ...action.payload.data,
        ],
      };
    }

    case DYNAMIC_DATA_TYPES.WORK_PACKAGE_ADD: {
      // const data = generateBlankSectionData(action.payload.sectionName);
      const data = generateBlankSectionTypeOfWork(
        action.payload.typeOfWork,
        action.payload.workPackage
      );

      return {
        ...state,
        [action.payload.name]: [...state[action.payload.name], ...data],
      };
    }
    case DYNAMIC_DATA_TYPES.WORK_PACKAGE_REMOVE:
      // data1.sectionName = `${data1.sectionName} (1)`;

      return {
        ...state,
        [action.payload.fieldName]:
          state[action.payload.fieldName].length === 1
            ? []
            : state[action.payload.fieldName].filter(
                (_, i) => i !== action.payload.id
              ),
      };

    case DYNAMIC_DATA_TYPES.WORK_PACKAGE_MOVED: {
      const { name, origId, dropId } = action.payload;
      let data = state[name];

      const origIndex = findWorkPackageId(origId, data);
      const dropIndex = findWorkPackageId(dropId, data);
      const newArr = arrPosMove(data, origIndex, dropIndex);

      return { ...state, [name]: [...newArr] };
      // return state;
    }

    case DYNAMIC_DATA_TYPES.WORK_PACKAGE_UPDATE_END: {
      const { name, sourceIndex, destIndex } = action.payload;
      let data = state[name];
      const newArr = arrPosMove(data, sourceIndex, destIndex);

      return {
        ...state,
        [name]: [...newArr],
      };
    }

    case DYNAMIC_DATA_TYPES.WORK_PACKAGE_NAME_CHANGED: {
      const { fieldName, id, value } = action.payload;
      return {
        ...state,
        [fieldName]: state[fieldName].map((s, index) => {
          if (index === id) {
            // console.log({ s, index, fieldName, id, value });
            return s.map((e) => {
              const newS = { ...e, sectionName: value };
              return newS;
            });
          }
          return s;
        }),
      };
    }

    case DYNAMIC_DATA_TYPES.CUSTOM_MODULES_RENAME: {
      const { name, typeOfWork, typeOfWorkId, workPackage, workPackageId } =
        action.payload;

      const newState = state[name].map((e) => {
        // const newE = { ...e };
        if (
          e[0].typeOfWorkId === typeOfWorkId &&
          e[0].workPackageId === workPackageId
        ) {
          // newE.typeOfWork = typeOfWork;
          // newE.workPackage = workPackage;
          // newE.sectionName = `${typeOfWork} (${workPackage})`;
          return e.map((x) => ({
            ...x,
            typeOfWork,
            sectionName: `${typeOfWork} (${workPackage})`,
            workPackage,
          }));
        } else {
          return e;
        }
      });

      return {
        ...state,
        [name]: newState,
      };
    }

    case DYNAMIC_DATA_TYPES.WORK_PACKAGE_UPDATE:
      const { parentId, fieldName, id, value } = action.payload;

      return {
        ...state,
        [fieldName]: state[fieldName].map((s, index) => {
          if (index === parentId) {
            return s.map((e, idx) => {
              if (idx === id) {
                return { ...e, value: value };
              }
              return e;
            });
          }
          return s;
        }),
      };

    case DYNAMIC_DATA_TYPES.EDIT_WORK_PACKAGES_INIT: {
      const { name, data } = action.payload;
      return { ...state, [name]: [...data] };
    }

    case DYNAMIC_DATA_TYPES.PREDEFINED_PACKAGE_ADDED: {
      const { fieldName, workPackages } = action.payload;
      return { ...state, [fieldName]: [...workPackages] };
    }

    case DYNAMIC_DATA_TYPES.PRODUCTLINE_SKU_CHANGED: {
      const { sku, skuList } = action.payload;

      const userSku = state["SKU Table"].filter(
        (e) => !skuList.some((k) => k.sku === e["Service Activity"])
      );

      const newPreSKU = sku.map((e) => ({
        ...getTableStucture("SKU Table"),
        "Service Activity": e.sku,
        "Service Activity_isDisabled": true,
      }));

      return {
        ...state,
        "SKU Table": [...newPreSKU, ...userSku],
      };
    }

    case DYNAMIC_DATA_TYPES.SKU_EDIT_UPDATE: {
      const { newSKU } = action.payload;
      return { ...state, "SKU Table": [...newSKU] };
    }

    case DYNAMIC_DATA_TYPES.WORK_PACKAGE_TABLE_UPDATE: {
      const { name, parentId, childId, columnId, value } = action.payload;
      const section = state[name].map((sec, secId) => {
        if (secId === parentId) {
          return sec.map((x, xId) => {
            if (x.tableValue && x.tableValue.length > 0) {
              return {
                ...x,
                tableValue: x.tableValue.map((child, cId) => {
                  if (cId === childId) {
                    return child.map((col, colId) => {
                      if (colId === columnId) {
                        return { ...col, value: value };
                      }
                      return col;
                    });
                  }
                  return child;
                }),
              };
            }
            return x;
          });
        }
        return sec;
      });

      return {
        ...state,
        [name]: section,
      };
    }

    case DYNAMIC_DATA_TYPES.WORK_PACKAGE_TABLE_ROW_ADD: {
      const { name, parentId } = action.payload;
      return {
        ...state,
        [name]: state[name].map((p, pId) => {
          if (pId === parentId) {
            return p.map((e, eId) => {
              if (eId === 0) {
                return {
                  ...e,
                  tableValue: [
                    ...e.tableValue,
                    SolHubDropDownTable.getTableColumns(e.tableId),
                  ],
                };
              }
              return e;
            });
          }
          return p;
        }),
      };
    }

    case DYNAMIC_DATA_TYPES.WORK_PACKAGE_TABLE_ROW_REMOVE: {
      const { name, parentId, childId } = action.payload;
      console.log({ name, parentId, childId });

      return {
        ...state,
        [name]: state[name].map((p, pId) => {
          if (pId === parentId) {
            return p.map((e, eId) => {
              if (eId === 0) {
                return {
                  ...e,
                  tableValue:
                    e.tableValue.length <= 1
                      ? [SolHubDropDownTable.getTableColumns(e.tableId)]
                      : e.tableValue.filter((_, vId) => vId !== childId),
                };
              }
              return e;
            });
          }
          return p;
        }),
      };
    }

    default:
      return state;
  }
};

export default DynamicFormDataReducer;
