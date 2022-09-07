import { some } from "lodash";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useLocation } from "react-router";
import {
  actionCloneSafeSaveNewProductLine,
  actionCloneSafeSaveProductLines,
  actionCloneSafeShowModal,
} from "../../Redux/Actions/CloneSafe";
import {
  actionCustomerDataProductLineChanged,
  actionCustomerDataValueChanged,
} from "../../Redux/Actions/CustomerData";
import { actionDynamicDataProductLineSKUChanged } from "../../Redux/Actions/DynamicDataFields";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import MyRow from "../MyRow";
import SKUComponent from "../SKUComponent";
import SOWFormFieldComponent from "../SOWFormFieldComponent";
import SOWFormFieldRowComponent from "../SOWFormFieldRowComponent";
import {
  customerDataFields,
  EDIT_DISABLED_CUSTOMER_DATA_FIELDS,
} from "./customerDataFields";

const customSelectStyles = {
  option: (base) => ({
    ...base,
    overflowX: "hidden",
  }),
};

const CustomerDataForm = ({ isView, isClone, isEdit }) => {
  const {
    productLineDropDownData,
    customerData,
    sowTemplate,
    sku,
    cloneBreak,
    safeProductLines,
    customerDataFetchState,
    customerLogData
  } = useSelector(
    (state) => ({
      customerDataFetchState: state.customerData.customerDataFetchState,
      cloneBreak: state.cloneSafe.cloneBreak,
      productLineDropDownData: state.masterDropDown.productLineDropDownData,
      customerData: state.customerData,
      sowTemplate: state.masterData.sowTemplate,
      sku: state.masterDropDown.sku,
      safeProductLines: state.cloneSafe.productLines,
      customerLogData: state.logData.customerLog
    }),
    shallowEqual
  );

  const dispatch = useDispatch();
  // const location = useLocation();
 
  return (
    <>
      {customerDataFields.map((k, idx1) => (
        <MyRow key={idx1}>
          {k.map((e, idx2) => (
            <SOWFormFieldComponent
              key={`${e.name}_${e.title}_${e.id}_${e.idx1}_${e.idx2}`}
              idx={idx1 + (idx2 + 1)}
              id={e.id}
              fullWidth={k.length === 1 ? false : true}
              value={customerData[e.name]}
              onChange={(ev) => {
                if (
                  e.name === "productLine"
                  // sowTemplate.startsWith("I&PS")
                ) {
                  if (
                    isClone &&
                    !cloneBreak &&
                    safeProductLines.length > 0 &&
                    safeProductLines.findIndex(
                      (e) => e.productLine === ev.target.value
                    ) === -1
                  ) {
                    dispatch(
                      actionCloneSafeSaveNewProductLine(ev.target.value)
                    );
                    dispatch(actionCloneSafeShowModal("productLine"));
                  } else {
                    dispatch(
                      actionCustomerDataProductLineChanged(ev.target.value)
                    );
                  }
                  // dispatch(actionCustomerDataResetSKU());
                  // dispatch(actionMasterDataDropDownFetchSKU(ev.target.value));
                } else {
                  dispatch(
                    actionCustomerDataValueChanged(e.name, ev.target.value)
                  );
                }
              }}
              disabled={customerDataFetchState !== APIFetchStatus.FETCHED}
              readonly={
                (EDIT_DISABLED_CUSTOMER_DATA_FIELDS.indexOf(e.name) > -1 &&
                  isEdit && customerData["productLine"] !== "" &&
                  productLineDropDownData.some(li => li.id.split("-")[0].trim() === customerLogData.find((e) => e.standardField.fieldName === "productLine").fieldDefaultValue)) ||
                isView ||
                e.readonly
              }
              title={e.title}
              required={e.required}
              name={e.name}
              type={e.type}
              buttonTitle={e.buttonTitle}
              hasButton={e.hasButton}
              onButtonClick={(ev) => {}}
              list={e.name === "productLine" ? productLineDropDownData : []}
              placeholder={e.placeholder}
              errorText={e.name === "productLine" && e.required && customerData[e.name] === "" && customerDataFetchState === APIFetchStatus.FETCHED ? "please select the product line" : ""}
            />
          ))}
        </MyRow>
      ))}
      {sowTemplate === "15" ? (
        <MyRow>
          <SKUComponent
            isMulti
            customSelectStyles={customSelectStyles}
            menuPlacement="top"
            name="sku"
            placeholder="SKU"
            classNamePrefix="SKU"
            readonly={isView}
            handlechange={
              !isView &&
              ((e) => {
                const val = Array.isArray(e) ? e : [];
                dispatch(actionCustomerDataValueChanged("sku", val));
                dispatch(actionDynamicDataProductLineSKUChanged(val, sku));
              })
            }
            value={sku.filter((obj) =>
              customerData["sku"].some((sku) => sku.value === obj.value)
            )}
            options={sku}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
              ClearIndicator: () => null,
            }}
          />
        </MyRow>
      ) : null}
    </>
  );
};

export default CustomerDataForm;
