import { each } from "lodash";
import React, { useCallback } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { actionE3TResourceTableRiskRatingChanged } from "../../Redux/Actions/E3T";
import { REGEX_INTEGERS } from "../../Redux/utils/regex";
import LowRisk from "../../../../img/LowRisk.png";
import MediumRisk from "../../../../img/MediumRisk.png";
import HighRisk from "../../../../img/HighRisk.png";

const E3TFormTableSubSectionRow = ({
  idx,
  subSection,
  sectionIdx,
  section,
  handleNewE3TChange,
  handleDependencyChange,
  isView,
}) => {
  // console.log("E3TFormTableSubSectionRow", subSection);
  const dispatch = useDispatch();

  // const handleNumberInput = useCallback((e, idx) => {
  //   const { name, value } = e.target;
  //   dispatch(actionE3TResourceValueChanged(name, value, idx));
  // });

  // const handleDependencyChange = (e) => {
  //   each(section, (item) => {
  //     handleNewE3TChange(e.target.value, e.target.name, item.idx);
  //     handleNumberInput(e, item.idx);
  //   });
  // };

  // const onDependencyChange = (e) => {
  //   // console.log({ subSection, idx });
  //   handleNumberInput(e, idx);
  //   handleDependencyChange(e.target.value, idx);
  // };
  return (
    <>
      <tr style={{ backgroundColor: "WhiteSmoke" }}>
        <td colSpan="5">
          <b>{subSection[0]?.workPackage}</b>
        </td>
        {/* {sectionIdx !== "General" && (
          <>
            <td
              style={{
                borderLeft: "2px solid black",
                borderTop: "2px solid black",
                borderBottom: "2px solid black",
              }}
            >
              <b>
                {subSection[0]?.dependencyName
                  ? subSection[0]?.dependencyName
                  : "Dependency"}
              </b>
            </td>
            <td
              style={{
                // borderLeft: "2px solid black",
                borderTop: "2px solid black",
                borderBottom: "2px solid black",
              }}
            >
              <Form.Control
                size="sm"
                className="e3t-form-elements"
                pattern={REGEX_INTEGERS}
                name={`dependency`}
                type="number"
                data-testid={`dependancy_${sectionIdx}`}
                min={0}
                value={subSection[0]?.dependency}
                disabled={isView}
                onChange={isView ? () => {} : onDependencyChange}
              />
            </td>
          </>
        )} */}
        <td></td>
        <td
          className="text-center p-0"
          // style={{
          //   borderLeft: "2px solid black",
          //   borderTop: "2px solid black",
          //   borderBottom: "2px solid black",
          // }}
        >
          <Form.Control
            size="sm"
            className="e3t-form-elements"
            name={"riskRating"}
            // style={{ width: "60px" }}
            required
            data-testid={"riskRating"}
            disabled={isView}
            as={"select"}
            onChange={(e) => dispatch(actionE3TResourceTableRiskRatingChanged({ "riskRating": e.target.value, "typeOfWorkId": subSection[0].typeOfWorkId, "workPackageId": subSection[0].workPackageId }))}
            value={subSection[0].riskRating}
            title={"Risk Rating"}
          >
            {["Low", "Medium", "High"].map((element, index) => (
              <option value={element} key={`${element}_${index}`}>
                {element + " Risk"}
              </option>
            ))}
          </Form.Control>

          <img alt="Risk Rating"
            style={{ width: "60%", maxHeight: "7px" }}
            src={
              subSection[0].riskRating === "Low"
                ? LowRisk
                : subSection[0].riskRating === "Medium"
                ? MediumRisk
                : HighRisk
            }
          />
        </td>
        {/* <td
          style={
            {
              // borderLeft: "2px solid black",
              // borderTop: "2px solid black",
              // borderBottom: "2px solid black",
              // borderRight: "2px solid black",
            }
          }
        >
          <InputGroup>
            <InputGroup.Prepend>
              <i
                className="fas fa-exclamation-circle fa-2x mr-1"
                style={{
                  color:
                    subSection[0].riskRating === "Low"
                      ? "green"
                      : subSection[0].riskRating === "Medium"
                      ? "orange"
                      : subSection[0].riskRating === "High"
                      ? "red"
                      : "",
                }}
              />
            </InputGroup.Prepend>
            <Form.Control
              size="sm"
              className="e3t-form-elements"
              name={`riskRating`}
              type="text"
              data-testid={`riskRating_${idx}`}
              disabled={true}
              value={subSection[0]?.riskRating}
              title={subSection[0]?.riskRating}
            />
          </InputGroup>
        </td> */}
        <td></td>
        <td></td>
      </tr>
    </>
  );
};

export default E3TFormTableSubSectionRow;
