import { PricingFormField } from "../E3TForm/e3tFormData";
import PricingFormFieldComponent from "../PricingFormFieldComponent";
import { useSelector, useDispatch, shallowEqual, batch } from "react-redux";
import { Fragment, useEffect } from "react";
import {
  actionE3TUpdateDynamicData,
  actionE3TUpdateExpenses,
  actionE3TValueChanged,
  actionNewE3TCalcNewEGMAndFinalPrice,
} from "../../Redux/Actions/E3T";
import {
  calcuateTotalContractValue,
  calculateConsultingCosts,
  calculateToolingCosts,
  calculateTotalCost,
  calculateTotalCostWithRiskReserve,
  calculateTravelCosts,
} from "../../Redux/utils/calculateCost";
import { actionDynamicDataUpdateE3T } from "../../Redux/Actions/DynamicDataFields";
import { useCallback } from "react";
import { Card, Col, Table } from "react-bootstrap";
import E3TOtherCostsTable from "../E3TOtherCostsTable";
import MyRow from "../MyRow";
import E3TCostBreakupSummary from "../E3TCostBreakupSummary";
import MyCol from "../MyCol";
import SOWPriceComponent from "../SOWPriceComponent";
import { parseFloating } from "../../PricingTab/PricingFormFields";

const E3TExpensesForm = ({ expenses, isView }) => {
  const dispatch = useDispatch();

  const handleChanges = useCallback(() => {
    if (!isView) {
      // const newTotal = calculateTotalCost(
      //   expenses.travel,
      //   expenses.software,
      //   expenses.hardware,
      //   expenses.thirdParty,
      //   expenses.totalResourceCost
      // );

      // const newTotalWithRiskReserve = calculateTotalCostWithRiskReserve(
      //   newTotal,
      //   expenses.riskReserve
      // );

      // const newTotalContractValue = calcuateTotalContractValue(
      //   newTotalWithRiskReserve,
      //   expenses.egm
      // );

      // const consulting = calculateConsultingCosts(
      //   expenses.totalResourceCost,
      //   expenses.riskReserve,
      //   expenses.egm
      // );
      // const tooling = calculateToolingCosts(
      //   expenses.hardware,
      //   expenses.software,
      //   expenses.thirdParty,
      //   expenses.riskReserve,
      //   expenses.egm
      // );
      // const tra = calculateTravelCosts(
      //   expenses.travel,
      //   expenses.riskReserve,
      //   expenses.egm
      // );
      // dispatch(
      //   actionDynamicDataUpdateE3T(
      //     consulting,
      //     tooling,
      //     tra,
      //     newTotalContractValue
      //   )
      // );

      dispatch(actionE3TUpdateDynamicData());
    }
  }, [expenses.totalResourceCost]);

  useEffect(() => {
    handleChanges();
  }, [expenses.totalResourceCost]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    console.log({ name, value });
    let finalVal;
    if (value.split(".")[1] && value.split(".")[1].length > 2) {
      finalVal = parseFloating(value).toFixed(2);
    } else {
      finalVal = value;
    }
    if (name.indexOf("Description") > -1) {
      dispatch(actionE3TValueChanged(name, finalVal));
    } else {
      const newExp = { ...expenses, [name]: finalVal };
      const newTotal = calculateTotalCost(
        newExp.travel,
        newExp.software,
        newExp.hardware,
        newExp.thirdParty,
        newExp.totalResourceCost
      );

      const newTotalWithRiskReserve = calculateTotalCostWithRiskReserve(
        newTotal,
        newExp.riskReserve
      );

      const newTotalContractValue = calcuateTotalContractValue(
        newTotalWithRiskReserve,
        newExp.egm
      );

      const consulting = calculateConsultingCosts(
        expenses.totalResourceCost,
        expenses.riskReserve,
        expenses.egm
      );
      const tooling = calculateToolingCosts(
        expenses.hardware,
        expenses.software,
        expenses.thirdParty,
        expenses.riskReserve,
        expenses.egm
      );
      const tra = calculateTravelCosts(
        expenses.travel,
        expenses.riskReserve,
        expenses.egm
      );

      batch(() => {
        dispatch(actionE3TValueChanged(name, finalVal));
        dispatch(
          actionE3TUpdateExpenses(
            newTotal,
            newTotalWithRiskReserve,
            newTotalContractValue
          )
        );
      });

      dispatch(actionNewE3TCalcNewEGMAndFinalPrice());
    }
  });

  return (
    <>
      <E3TOtherCostsTable {...expenses} handleChange={handleChange} />

      <MyRow>
        <Col sm={12}>
          <Card>
            <Card.Header as="h5" bsPrefix="sow-sectionline">
              Risk Reserve
            </Card.Header>
          </Card>
        </Col>
      </MyRow>

      <Col className="p-0">
        <PricingFormFieldComponent
          onChange={isView ? () => {} : handleChange}
          readonly={isView ?? false}
          value={[expenses["riskReserve"]]}
          {...PricingFormField[5]}
          col={[4, 6]}
          title={PricingFormField[5].title}
          // isPercentage
        />
      </Col>
      <MyRow>
        <Col className="p-0">
          <SOWPriceComponent
            col={[4, 6]}
            name="totalCostWithRiskReserve"
            title="Total Cost with Risk Reserve"
            value={expenses["totalCostWithRiskReserve"]}
          />
          {/* <PricingFormFieldComponent
          onChange={() => {}}
          readonly={true}
          value={[expenses["totalCostWithRiskReserve"]]}
          type="number"
          col={[5, 7]}
          title="Total Cost with Risk Reserve"
        /> */}
        </Col>
      </MyRow>

      {/* {PricingFormField.map((field) =>
        [
          "hardware",
          "software",
          "travel",
          "thirdParty",
          "nonStandardAssumption",
          "discount",
          "discountPercentage",
          "newEGM",
          "finalPrice",
          "egm",
          "currency",
          "remoteTCV",
          "onsiteTCV",
          "currency",
          "totalContractValue",
          "totalCostWithRiskReserve"
        ].indexOf(field.name) > -1 ? (
          <Fragment key={`empty_${field.name}`} />
        ) : (
          <PricingFormFieldComponent
            onChange={isView ? () => {} : handleChange}
            readonly={isView}
            value={[expenses[field.name], expenses[field.descriptionName]]}
            key={`e3t_PricingField_${field.id}_${field.title}_${field.name}`}
            {...field}
            title={
              field.title === "TCV"
                ? `${field.title} (${expenses.currency})`
                : field.title
            }
          />
        )
      )} */}

      <E3TCostBreakupSummary e3t={expenses} />
    </>
  );
};

export default E3TExpensesForm;
