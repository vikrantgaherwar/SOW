import { each } from "jquery";
import { useCallback } from "react";
import { Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { parseFloating } from "../../PricingTab/PricingFormFields";
import {
  actionE3THandleDependencyChange,
  actionE3TResourceValueChanged,
} from "../../Redux/Actions/E3T";
import { REGEX_INTEGERS } from "../../Redux/utils/regex";

const E3TResourceTableTypeOfWorkSection = ({
  idx,
  section,
  isView,
  dependency,
}) => {
  const dispatch = useDispatch();
  const handleNumberInput = useCallback((e, idx) => {
    const { name, value } = e.target;
    let finalVal;
    if (value.split(".")[1] && value.split(".")[1].length > 2) {
      finalVal = parseFloating(value).toFixed(2);
    } else {
      finalVal = value;
    }
    dispatch(
      actionE3THandleDependencyChange(finalVal, section[0][0].typeOfWorkId)
    );
  });

  return (
    <tr style={{ backgroundColor: "WhiteSmoke" }}>
      <td colSpan="5">
        <b>
          {section[0][0].sectionName === "General"
            ? section[0][0].sectionName
            : section[0][0].sectionName.split(" (")[0]}
        </b>
      </td>
      <td>
        <b>Dependancy</b>
      </td>
      <td>
        <Form.Control
          size="sm"
          className="e3t-form-elements"
          pattern={REGEX_INTEGERS}
          name={`dependency`}
          type="number"
          data-testid={`dependancy_${idx}`}
          min={1}
          value={section[0][0].dependency}
          title={dependency}
          disabled={isView}
          onChange={isView ? () => {} : handleNumberInput}
        />
      </td>
    </tr>
  );
};

export default E3TResourceTableTypeOfWorkSection;
