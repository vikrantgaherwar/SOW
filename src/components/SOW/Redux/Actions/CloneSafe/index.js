import { Store } from "../../Store";
import {
  actionCustomerDataProductLineChanged,
  actionCustomerDataResetSKU,
  actionCustomerDataSectionCloneRevert,
  actionFetchCustomerDataClone,
} from "../CustomerData";
import {
  actionMasterDataBusinessChanged,
  actionMasterDataTemplateChanged,
} from "../MasterData";
import { CLONE_SAFE_TYPES } from "./CloneSafeTypes";

export const actionCloneSafeSaveProductLines = (safeData) => {
  return (dispatch) => {
    dispatch({
      type: CLONE_SAFE_TYPES.PRODUCT_LINES_FETCHED,
      payload: safeData,
    });
  };
};

export const actionCloneSafeSaveCustomerData = (customerData) => {
  return (dispatch) => {
    dispatch({
      type: CLONE_SAFE_TYPES.CUSTOMER_DATA_FETCHED,
      payload: customerData,
    });
  };
};

export const actionCloneSafeResetData = () => {
  return (dispatch) => {
    dispatch({
      type: CLONE_SAFE_TYPES.RESET_DATA,
    });
  };
};

export const actionCloneSafeShowModal = (type) => {
  return (dispatch) => {
    dispatch({
      type: CLONE_SAFE_TYPES.SHOW_MODAL,
      payload: {
        message: `The selected ${
          type.startsWith("customer")
            ? "opportunity"
            : type.startsWith("template")
            ? "template"
            : type.startsWith("product")
            ? "productLine"
            : "business"
        } is not compatible with the exisiting data.\nDynamic Data will be reset. Do you want to continue?`,
        type,
        show: true,
      },
    });
  };
};

export const actionCloneSafeModalConfirm = () => {
  return (dispatch) => {
    const state = Store.getState();
    const cloneSafe = state.cloneSafe;

    if (cloneSafe.type.startsWith("customer")) {
      dispatch(actionFetchCustomerDataClone());
    } else if (cloneSafe.type.startsWith("template")) {
      dispatch(actionCustomerDataResetSKU());
      dispatch(
        actionMasterDataTemplateChanged("sowTemplate", cloneSafe.newTemplate)
      );
    } else if (cloneSafe.type.startsWith("busines")) {
      dispatch(
        actionMasterDataBusinessChanged("business", cloneSafe.newBusiness)
      );
    } else if (cloneSafe.type.startsWith("product")) {
      dispatch(actionCustomerDataProductLineChanged(cloneSafe.newProductLine));
    } else {
      dispatch({
        type: "PASS",
      });
    }
    dispatch({ type: CLONE_SAFE_TYPES.CLONE_BREAK });
    dispatch({ type: CLONE_SAFE_TYPES.CLOSE_MODAL });
  };
};

export const actionCloneSafeModalCancel = () => {
  return (dispatch) => {
    const state = Store.getState();
    const cloneSafe = state.cloneSafe;

    if (cloneSafe.type.startsWith("customer")) {
      dispatch(actionCustomerDataSectionCloneRevert());
    } else if (cloneSafe.type.startsWith("template")) {
      dispatch(actionCloneSafeSaveNewTemplate(""));
    } else if (cloneSafe.type.startsWith("busines")) {
      dispatch(actionCloneSafeSaveNewBusiness(""));
    } else if (cloneSafe.type.startsWith("product")) {
      dispatch(actionCloneSafeSaveNewProductLine(""));
    } else {
      dispatch({
        type: "PASS",
      });
    }

    dispatch({ type: CLONE_SAFE_TYPES.CLOSE_MODAL });
  };
};

export const actionCloneSafeSaveNewProductLine = (productLine) => {
  return (dispatch) => {
    dispatch({
      type: CLONE_SAFE_TYPES.SAVE_NEW_PRODUCT_LINE,
      payload: productLine,
    });
  };
};

export const actionCloneSafeSaveNewBusiness = (business) => {
  return (dispatch) => {
    dispatch({
      type: CLONE_SAFE_TYPES.SAVE_NEW_BUSINESS,
      payload: business,
    });
  };
};

export const actionCloneSafeSaveNewTemplate = (template) => {
  return (dispatch) => {
    dispatch({
      type: CLONE_SAFE_TYPES.SAVE_NEW_TEMPLATE,
      payload: template,
    });
  };
};
