import { Fragment } from "react";
import { Card, Col } from "react-bootstrap";
import { parseFloating, parseInteger } from "../E3TForm/e3tFormData";
import E3TSummarySkillTable from "../E3TSummarySkillTable";
import MyCol from "../MyCol";
import MyRow from "../MyRow";
import PricingFormFieldComponent from "../PricingFormFieldComponent";
import SOWFormFieldComponent from "../SOWFormFieldComponent";
import SOWPriceComponent from "../SOWPriceComponent";

const E3TCostBreakupSummary = ({ e3t }) => {
  const remoteHours = parseFloating(
    e3t.resourceTable
      .reduce(
        (total, e) =>
          e.remote === "Yes" ? total + parseFloating(e.projectDuration) : total,
        0.0
      )
      .toFixed(2)
  );
  const totalHours = parseFloating(
    e3t.resourceTable
      .reduce((total, e) => total + parseFloating(e.projectDuration), 0.0)
      .toFixed(2)
  );

  const deliveryMix = (((remoteHours / totalHours) * 100) | 0).toFixed(2);


  return (
    <>
      <E3TSummarySkillTable resourceTable={e3t.resourceTable} />
      <MyRow>
        <SOWPriceComponent
          onChange={() => {}}
          readonly={true}
          value={(
            parseFloating(e3t["travel"]) +
            parseFloating(e3t["hardware"]) +
            parseFloating(e3t["software"]) +
            parseFloating(e3t["thirdParty"])
          ).toFixed(2)}
          type="number"
          col={[4, 6]}
          title="Other Costs"
        />
      </MyRow>
      <MyRow>
        <SOWPriceComponent
          onChange={() => {}}
          readonly={true}
          value={e3t["total"]}
          type="number"
          title="Total Cost"
          col={[4, 6]}
        />
      </MyRow>

      <MyRow>
        <SOWPriceComponent
          onChange={() => {}}
          readonly={true}
          value={e3t["totalCostWithRiskReserve"]}
          type="number"
          col={[4, 6]}
          title="Total Cost with Risk Reserve"
        />
      </MyRow>
      <MyRow>
        <SOWFormFieldComponent
          onChange={() => {}}
          readonly={true}
          value={[deliveryMix]}
          step={0.01}
          name="deliveryMix"
          col={[4, 6]}
          title={"Remote Delivery Mix %"}
          // isPercentage
          type="number"
        />
      </MyRow>
    </>
  );
};

export default E3TCostBreakupSummary;
