import { React, useEffect, useMemo, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import { parseFloating } from "./PricingFormFields";
import { REGEX_INTEGERS } from "./regexConsts";

import "../../../css/search.css";
import { ResourceTypeSelectionContext } from "..";
import SingleOrMultiSelectDropDown from "../SingleOrMultiSelectDropDown";
// import SearchDropDown from "./SearchDropDown";

const PricingResourceTableRow = ({
  id,
  idx,
  resourceType,
  resourceTypeList,
  noOfResources,
  projectDuration,
  workingHours,
  regionalData,
  cost,
  setState,
}) => {
  const { setResourceTypeSelected } = useContext(ResourceTypeSelectionContext);
  const rate = useMemo(() => {
    const f = regionalData.find((rec) => rec.resourceType === resourceType);
    if (f) {
      return f["sowE3tTsRates"][0]["rate"];
    }
    return 0.0;
  }, [resourceType, regionalData]);

  const handleResourceChange = (e) => {
    if (e) {
      const value = e.value;
      const record = regionalData.find((rec) => rec.resourceType === value);
      setResourceTypeSelected(true);
      setState((state) => {
        const newState = { ...state };
        newState.resourceTable = newState.resourceTable.map((field, index) => {
          const newField = { ...field };
          if (index === idx) {
            newField.resourceType = value;
            newField.workingHours = record.sowE3tTsRates[0].masterCountry.workHrsPerDay.toString();
          }
          return newField;
        });
        return newState;
      });
    } else {
      setResourceTypeSelected(false);
      setState((state) => {
        const newState = { ...state };
        newState.resourceTable = newState.resourceTable.map((field, index) => {
          const newField = { ...field };
          if (index === idx) {
            newField.resourceType = null;
            newField.workingHours = null;
          }
          return newField;
        });
        return newState;
      });
    }
  };

  useEffect(() => {
    const no = parseFloating(noOfResources);
    const pd = parseFloating(projectDuration);
    const wh = parseFloating(workingHours);
    setState((state) => {
      const newState = { ...state };
      let sum = 0;
      newState.resourceTable = newState.resourceTable.map((field, index) => {
        const newField = { ...field };

        if (index === idx) {
          newField.cost = (no * pd * wh * rate).toFixed(2);
        }
        sum += parseFloating(newField.cost);
        return newField;
      });
      newState.totalResourceCost = sum.toFixed(2);
      return newState;
    });
  }, [workingHours, projectDuration, noOfResources, resourceType]);

  const handleButtonClick = (e) => {
    e.preventDefault();
    const newResourceTable = (state) =>
      state.resourceTable.filter((ob, index) => index !== idx);
    setState((state) => ({
      ...state,
      resourceTable: newResourceTable(state),
    }));
  };

  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    setState((state) => {
      const newState = { ...state };
      newState.resourceTable = newState.resourceTable.map((ob, index) => {
        const field = { ...ob };
        if (index === idx) {
          field[name] = value;
        }
        return field;
      });
      return newState;
    });
    setState((state) => ({
      ...state,
      resourceTable: state.resourceTable.map((ob, index) => {
        if (index === idx) {
          return { ...ob, [name]: value };
        }
        return ob;
      }),
    }));
  };

  const searchList = useMemo(() => {
    return regionalData.map((row) => ({
      value: row.resourceType,
      label: row.resourceType,
      rate: row.rate,
      workingHours: row.workHrsPerDay,
    }));
  }, [regionalData]);

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      // borderColorfocus: "#80bdff",
      boxShadowfocus: "0 0 0 0.2rem rgb(0 123 255 / 25%)",
      height: 25,
      minHeight: 25,
      minWidth: "200px",
      borderRadius: "0",
    }),
    valueContainer: (base) => ({
      ...base,
      fontSize: "13px",
      height: 25,
      top: "0",
      padding: "0px 2px",
    }),
    singleValue: (base) => ({
      ...base,
      top: "50%",
      transform: "translate(0%,-60%)",
    }),
    option: (base) => ({
      ...base,
      overflowX: "hidden",
    }),
  };

  return (
    <tr>
      <td>
        <SingleOrMultiSelectDropDown
          isMulti={false}
          customSelectStyles={customSelectStyles}
          menuPlacement="bottom"
          name={resourceType}
          placeholder="Resource Type"
          classNamePrefix="Resource Type"
          handlechange={handleResourceChange}
          value={{
            value: resourceType,
            label: resourceType,
            rate,
            workingHours,
          }}
          options={searchList}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
            ClearIndicator: () => null,
          }}
        />
        {/* <SearchDropDown
          value={resourceType}
          onChange={handleResourceChange}
          name="resourceType"
          idx={idx}
          list={resourceTypeList}
        /> */}
      </td>
      <td>
        <Form.Control
          onChange={handleNumberInput}
          size="sm"
          name={`noOfResources`}
          type="number"
          pattern={REGEX_INTEGERS}
          data-testid={`noOfResources_${idx}`}
          min={0}
          value={noOfResources}
        />
      </td>
      <td>
        <Form.Control
          onChange={handleNumberInput}
          size="sm"
          name={`projectDuration`}
          type="number"
          pattern={REGEX_INTEGERS}
          data-testid={`projectDuration_${idx}`}
          min={0}
          value={projectDuration}
        />
      </td>
      <td>
        <Form.Control
          size="sm"
          readOnly
          name={`workingHours`}
          type="number"
          data-testid={`workingHours_${idx}`}
          value={workingHours ?? "0"}
          disabled={true}
        />
      </td>
      <td>
        <Form.Control
          size="sm"
          name={`cost`}
          type="number"
          value={cost}
          data-testid={`cost_${idx}`}
          disabled={true}
        />
      </td>
      <td
        style={{
          backgroundColor: "white",
          border: "0",
        }}
      >
        <Button
          bsPrefix="btn btn-success ml-1 btn-sm  pointer"
          title="Remove Row"
          onClick={handleButtonClick}
        >
          <i className="fas fa-minus fa-xs" />
        </Button>
      </td>
    </tr>
  );
};

export default PricingResourceTableRow;
