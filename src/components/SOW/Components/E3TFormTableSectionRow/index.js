import { useCallback } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { actionE3TResourceValueChanged } from "../../Redux/Actions/E3T";
import { REGEX_INTEGERS } from "../../Redux/utils/regex";
import { parseInteger } from "../E3TForm/e3tFormData";
import { parseFloating } from "../../PricingTab/PricingFormFields";
const E3TFormTableSectionRow = ({
  section,
  sectionIdx,
  isView,
  handleNewE3TChange,
  handleDependencyChange,
  show,
  setShow,
  e3t,
  e3tTshirtSizes,
  onSizeEstChange,
}) => {
  const dispatch = useDispatch();

  const handleNumberInput = useCallback((e, idx) => {
    const { name, value } = e.target;
    dispatch(actionE3TResourceValueChanged(name, value, idx));
  });

  const handleDependencyChange1 = useCallback((e) => {
    // each(section, (item) => {
    // if (+item.dependency) {
    // handleNewE3TChange(e.target.name,e.target.value );
    // handleNumberInput(e, item.idx);
    // }
    // });
    const { value } = e.target;
    let finalVal;
    if (value.split(".")[1] && value.split(".")[1].length > 2) {
      finalVal = parseFloating(value).toFixed(2);
    } else {
      finalVal = value;
    }
    handleDependencyChange(finalVal, section[0].typeOfWorkId);
  });

  const handleShow = (e) => {
    e.preventDefault();
    setShow((old) => ({ ...old, [sectionIdx]: !old[sectionIdx] }));
  };
  // const firstItem = find(section, () => true);
  // console.log({ section });

  const f = e3tTshirtSizes.filter(
    (e) => e.typeOfWorkId === section[0].typeOfWorkId
  );
  // console.log({ tshirt: f });
  const dep = section.find((d) => parseInteger(d.dependency) > 0);
  const defaultDep = section.find((d) => parseInteger(d.defaultDependency) > 0);

  const tableSectionRenderer = (
    <tr
      style={{
        backgroundColor: "rgb(97,71,103)",
        color: "white",
        // borderTop: "1.5px solid black",
      }}
    >
      <td colSpan={2} onClick={handleShow}>
        <span>
          {show ? (
            <i className="fas fa-chevron-down fa-xs pr-2" />
          ) : (
            <i className="fas fa-chevron-right fa-xs pr-2" />
          )}
          <b>{sectionIdx}</b>
        </span>
      </td>
      {sectionIdx !== "General" &&
      parseInteger(defaultDep?.defaultDependency) > 0 ? (
        <>
          <td colSpan={2}>
            <Row>
              <Col sm={4}>
                <b>
                  {section[0]?.dependencyName
                    ? section[0]?.dependencyName
                    : "Dependency"}
                </b>
              </Col>
              <Col sm={8}>
                <Form.Control
                  size="sm"
                  className="e3t-form-elements"
                  pattern={REGEX_INTEGERS}
                  name={`dependency`}
                  type="number"
                  data-testid={`dependancy_${sectionIdx}`}
                  min={1}
                  value={dep?.dependency}
                  disabled={isView}
                  onChange={isView ? () => {} : handleDependencyChange1}
                />
              </Col>
            </Row>
          </td>
        </>
      ) : (
        <>
          <td colSpan={2}></td>
        </>
      )}

      {section[0].sizingEstimate !== -999 && f ? (
        <>
          <td colSpan={3}>
            <Row>
              <Col sm={4}>
                <b>Sizing Estimate</b>
              </Col>
              <Col sm={8}>
                <Form.Group>
                  {f.map((tShirt, i) => (
                    <Form.Check
                      readOnly={isView}
                      id={`form_${i}_${tShirt.id}`}
                      checked={section[0].sizingEstimate === tShirt.id}
                      type={"radio"}
                      key={`${tShirt.id}_${i}`}
                      inline
                      label={
                        f.length === 1 && tShirt.tshirtSize === "Small"
                          ? "Standard"
                          : tShirt.tshirtSize
                      }
                      value={tShirt.id}
                      name={tShirt.typeOfWorkId}
                      title={tShirt.value}
                      onChange={isView ? () => {} : onSizeEstChange}
                    />
                  ))}
                </Form.Group>
              </Col>
            </Row>
          </td>
        </>
      ) : (
        <>
          <td colSpan={3}></td>
        </>
      )}

      <td></td>
      <td></td>
    </tr>
  );

  return <>{tableSectionRenderer}</>;
};

export default E3TFormTableSectionRow;
