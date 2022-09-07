import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { parseFloating, parseInteger } from "../E3TForm/e3tFormData";
import E3TSummarySkillTable from "../E3TSummarySkillTable";
import PricingFormFieldComponent from "../PricingFormFieldComponent";
import MyRow from "../MyRow";
import { useState, useContext, useRef, useEffect } from "react";
import { ModeContext } from "../ModeProvider";
import { Col, Form, Row } from "react-bootstrap";
import E3TSummaryRiskTable from "../E3TSummaryRiskTable";
import E3TSummaryDiscountSection from "../E3TSummaryDiscountTable";
import { actionE3TValueChanged } from "../../Redux/Actions/E3T";
import SOWFormFieldComponent from "../SOWFormFieldComponent";
import SOWPriceComponent from "../SOWPriceComponent";
const E3TSummaryForm = () => {
  const { e3tData, e3t, selectedTypeOfWork } = useSelector(
    (state) => ({
      e3tData: state.e3tData,
      e3t: state.e3t,
      selectedTypeOfWork: state.moduleSidePanel.selectedTypeOfWork,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  const ttRef = useRef();

  useEffect(() => {
    return () => {
      if (ttRef.current) {
        clearTimeout(ttRef.current);
      }
    };
  }, []);

  const { isView } = useContext(ModeContext);
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

  console.log({ totalHours, remoteHours, deliveryMix });

  const [nonStandardAssumption, setNonStandardAssumption] = useState(
    e3t.nonStandardAssumption
  );

  useEffect(() => {
    setNonStandardAssumption(e3t.nonStandardAssumption);
  }, [e3t.nonStandardAssumption]);

  const handleAssumptionChange = (e) => {
    const val = e.target.value;
    setNonStandardAssumption(val);

    if (ttRef.current) {
      clearTimeout(ttRef.current);
    }

    ttRef.current = setTimeout(() => {
      dispatch(actionE3TValueChanged("nonStandardAssumption", val));
    }, 300);
  };
  return (
    <>
      {/* <E3TSummarySkillTable
        resourceTable={e3t.resourceTable}
        e3tData={e3tData}
      /> */}
      {/* <MyRow>
        <PricingFormFieldComponent
          onChange={() => {}}
          readonly={true}
          value={[deliveryMix.toFixed(2)]}
          step={0.01}
          name="deliveryMix"
          col={[4, 6]}
          title={"Remote Delivery Mix %"}
        />
      </MyRow> */}
      {/* <MyRow>
        <Col>
          <Form.Group as={Row}>
            <Col sm={4}>
              <Form.Label>
                <strong>Non Standard Assumption</strong>
              </Form.Label>
            </Col>
            <Col sm={6}>
              <Form.Control
                size="sm"
                as="textarea"
                rows={3}
                readOnly={isView}
                onChange={isView ? () => {} : handleAssumptionChange}
                value={nonStandardAssumption}
                onBlur={() => {
                  dispatch(
                    actionE3TValueChanged(
                      "nonStandardAssumption",
                      nonStandardAssumption
                    )
                  );
                }}
              />
            </Col>
          </Form.Group>
        </Col>
      </MyRow> */}

      <E3TSummaryRiskTable
        resourceTable={e3t.resourceTable}
        e3tData={e3tData}
        selectedTypeOfWork={selectedTypeOfWork}
      />

      <MyRow>
        <Col>
          <Form.Group as={Row}>
            <Col sm={4}>
              <Form.Label>
                <strong>Non Standard Assumption</strong>
              </Form.Label>
            </Col>
            <Col sm={6}>
              <Form.Control
                size="sm"
                as="textarea"
                rows={3}
                readOnly={isView}
                onChange={isView ? () => {} : handleAssumptionChange}
                value={nonStandardAssumption}
                onBlur={() => {
                  dispatch(
                    actionE3TValueChanged(
                      "nonStandardAssumption",
                      nonStandardAssumption
                    )
                  );
                }}
              />
            </Col>
          </Form.Group>
        </Col>
      </MyRow>

      <MyRow>
        <SOWPriceComponent
          name="tcv"
          title="Total Cost with Risk Reserve"
          value={e3t["totalCostWithRiskReserve"]}
          col={[4, 6]}
        />
      </MyRow>
      <MyRow>
        {/* <SOWFormFieldComponent
          onChange={() => {}}
          readonly={true}
          value={[e3t["totalCostWithRiskReserve"]]}
          type="number"
          col={[4, 8]}
          title="Total Cost with Risk Reserve"
        /> */}
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

      <E3TSummaryDiscountSection e3t={e3t} isView={isView} />
    </>
  );
};

export default E3TSummaryForm;
