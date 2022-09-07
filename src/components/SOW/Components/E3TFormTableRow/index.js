import { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  actionE3TAddResourceTableRow,
  actionE3TRemoveResourceTableRow,
  actionE3TResourceTypeChanged,
  actionE3TResourceValueChanged,
} from "../../Redux/Actions/E3T";
import { calculateCost } from "../../Redux/utils/calculateCost";
import { REGEX_INTEGERS } from "../../Redux/utils/regex";
import Select from "react-select";
import { isRecordFilled, parseInteger } from "../E3TForm/e3tFormData";
import { DEFUALT_SDT } from "../../Redux/utils/getdefaultSDT";
import { parseFloating } from "../../PricingTab/PricingFormFields";

const E3TFormTableRow = ({
  idx,
  country,
  isView,
  resourceTable,
  resourceType,
  rate,
  typeOfWork,
  workPackage,
  noOfResources,
  projectDuration,
  workingHours,
  workPackageId,
  typeOfWorkId,
  regionalData,
  cost,
  e3tRemoteSTDs,
  handleRemoteChange1,
  handleSDTChange1,
  remote,
  dependency,
  riskRating,
  custom,
  sizingEstimate,
  sdt,
  durationName,
}) => {
  const dispatch = useDispatch();
  const [projDuration, setProjDuration] = useState(projectDuration);
  const StandardWorkingHoursInADay = 8;

  useEffect(() => {
    if (projectDuration != null || projectDuration !== undefined) {
      let userValue = projectDuration;
      if (
        durationName.Current === "Days" &&
        durationName.Previous === "Hours"
      ) {
        userValue = projectDuration / StandardWorkingHoursInADay;
      }
      let val = parseFloating(userValue).toFixed(2);
      setProjDuration(val);
    }
  }, [durationName?.Current]);

  const tt = useRef();

  // useEffect(() => {
  //   setProjDuration(projectDuration);
  // }, [projectDuration]);

  useEffect(() => {
    return () => {
      if (tt.current) {
        clearTimeout(tt.current);
      }
    };
  }, []);

  const handleChangeProjDuration = (e) => {
    e.preventDefault();
    let { name, value } = e.target;
    const decimalValue = value.split(".");

    if (+decimalValue[1] > 5)
      value =
        +value > +(+(decimalValue[0] + ".59"))
          ? Math.round(value).toString()
          : value;

    if (tt.current) {
      clearTimeout(tt.current);
    }
    tt.current = setTimeout(() => {
      console.log("hi");

      handleNumberInput(name, value);
    }, 200);
    if (value.split(".")[1] && value.split(".")[1].length > 2) {
      const val = parseFloating(e.target.value).toFixed(2);
      setProjDuration(val);
    } else {
      setProjDuration(value);
    }
  };

  const searchList = useMemo(() => {
    // lijhijpi
    if (remote === "No") {
      const f = e3tRemoteSTDs.find((k) => k.id === sdt);
      if (f !== undefined) {
        return f.sowE3tTsRates
          .map((e) => ({
            value: e.resourceType,
            label: e.resourceType,
            rate: e.newRate,
            workingHours: f.workHrsPerDay,
          }))
          .filter((x) => parseFloating(x.rate) !== 0);
      } else {
        return custom
          ? regionalData
              .filter((row) => parseFloating(row.rate) > 0)
              .map((row) => ({
                value: row.resourceType,
                label: row.resourceType,
                rate: row.rate,
                workingHours: row.workHrsPerDay,
              }))
          : regionalData.map((row) => ({
              value: row.resourceType,
              label: row.resourceType,
              rate: row.rate,
              workingHours: row.workHrsPerDay,
            }));
      }
    } else {
      const f = e3tRemoteSTDs.find((k) => k.id === sdt);
      // console.log();
      return f.sowE3tTsRates
        .map((e) => ({
          value: e.resourceType,
          label: e.resourceType,
          rate: e.newRate,
          workingHours: 7.5,
        }))
        .filter((x) => parseFloating(x.rate) !== 0);
    }
  }, [regionalData, remote, sdt]);

  const STDs = useMemo(() => {
    let e3tRemoteSTDsLocal = [...e3tRemoteSTDs];
    return e3tRemoteSTDsLocal
      .filter((std) => std.isRemote === (remote === "Yes" ? true : null))
      .map((row) => ({
        value: row.id,
        label: row.sdtLookup,
      }));
  }, [e3tRemoteSTDs, remote]);

  const updateRowState = useCallback((row, empty) => {
    let newRow = { ...row };
    if (empty) {
    } else {
      newRow.cost = calculateCost(newRow);
    }
    dispatch(actionE3TResourceTypeChanged({ idx, ...newRow }));
  }, []);

  const getSDTLabel = useMemo(() => {
    /* set Default sdt*/
    if (!sdt && remote === "Yes") {
      // setUpdatedRate(e3tCostingEstimation, "resourceId");
      return { value: DEFUALT_SDT?.id, label: DEFUALT_SDT?.sdtLookup };
    } else if (sdt && remote === "Yes") {
      const ob = { label: "", value: "" };
      const f = STDs.find((e) => e.value === sdt);
      console.log({ f });
      if (sdt !== "") {
        ob.label = f.label;
        ob.value = sdt;
      }
      // setUpdatedRate(e3tCostingEstimation, "resourceId");
      return ob;
    } else if (sdt && remote === "No") {
      // setUpdatedRate(regionalData, "id");
      const ob = { label: "", value: "" };
      let f = STDs.find((e) => e.value === sdt);
      if (f === undefined) {
        f = STDs.find((x) => x.label == regionalData[0].sdt);
      }
      if (sdt !== "" && f !== undefined) {
        ob.label = f.label;
        ob.value = sdt;
      }
      return ob;
    }
    return "";
  }, [sdt, remote]);

  const onRemoteChange = (e) => {
    e.preventDefault();
    const val = e.target.value;
    // handleNewE3TChange(val, name, idx);
    handleRemoteChange1(idx, val);
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    dispatch(actionE3TRemoveResourceTableRow(idx));
  };

  const handleSDTChange = (val) => {
    handleSDTChange1(idx, val.value);
    // handleNewE3TChange(val.value, "sdt", idx);
  };

  const handleResourceChange = useCallback((res) => {
    if (res) {
      const { value, rate, workingHours } = res;

      const newRow = {
        resourceType: value,
        rate: rate.toFixed(2),
        noOfResources,
        projectDuration,
        typeOfWorkId,
        workPackageId,
        workingHours: workingHours.toFixed(2),
        cost,
        typeOfWork,
        sizingEstimate,
        workPackage,
        sdt,
        dependency,
        riskRating,
        remote,
        custom,
      };
      updateRowState(newRow);
    } else {
      const newRow = {
        typeOfWork: "",
        workPackage: "",
        typeOfWorkId: -999,
        workPackageId: -999,
        resourceType: "",
        rate: "",
        noOfResources,
        sizingEstimate: -999,
        projectDuration,
        workingHours: "",
        cost: "",
        sdt: "",
        dependency: "1",
        riskRating: "",
        remote: "No",
        custom: true,
      };
      updateRowState(newRow, true);
    }
  });

  const handleNumberInput = (name, value) => {
    //dispatch should always be in hours
    let valueInHours = value;
    if (durationName.Current === "Days" && durationName.Previous === "Hours") {
      valueInHours = value * StandardWorkingHoursInADay;
    }
    dispatch(
      actionE3TResourceValueChanged(
        name,
        parseFloating(valueInHours).toFixed(2),
        idx
      )
    );
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 25,
      minHeight: 25,
      minWidth: "145px",
      borderRadius: "0",
    }),
    valueContainer: (base) => ({
      ...base,
      fontSize: "13px",

      top: "0",
      padding: "0px 2px",
    }),
    singleValue: (base) => ({
      ...base,
      padding: "0 0 4px 0",
    }),
    option: (base) => ({
      ...base,
      overflowX: "hidden",
    }),
  };

  return (
    <>
      <tr>
        <td>
          <Form.Control
            size="sm"
            className="e3t-form-elements"
            name={"remote"}
            // style={{ width: "60px" }}
            required
            data-testid={"remote"}
            disabled={isView}
            as={"select"}
            onChange={onRemoteChange}
            value={remote}
            title={remote}
          >
            {["Yes", "No"].map((element, index) => (
              <option value={element} key={`${element}_${index}`}>
                {element}
              </option>
            ))}
          </Form.Control>
        </td>
        <td>
          {/* Credits - Vikrant Gaherwar */}
          <div title={getSDTLabel && getSDTLabel.label}>
            <Select
              required
              // name="sdt"
              placeholder="Resource Origin"
              isClearable
              value={getSDTLabel}
              isSearchable
              isDisabled={isView}
              name={"SDT"}
              options={STDs}
              onChange={handleSDTChange}
              styles={customStyles}
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
                ClearIndicator: () => null,
              }}
            />
          </div>
        </td>

        <td>
          {/* Credits - Vikrant Gaherwar */}
          <div title={resourceType}>
            <Select
              required
              // name="resourceType"
              placeholder="Resource Type"
              classNamePrefix="Resource Type"
              isClearable
              value={{
                value: resourceType,
                label: resourceType,
                rate,
                workingHours,
              }}
              isSearchable
              isDisabled={isView}
              name={resourceType}
              options={searchList}
              onChange={handleResourceChange}
              styles={customStyles}
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
                ClearIndicator: () => null,
              }}
            />
          </div>
        </td>
        <td>
          <Form.Control
            size="sm"
            className="e3t-form-elements"
            // style={{ width: "65px" }}
            name={`rate`}
            type="number"
            pattern={REGEX_INTEGERS}
            data-testid={`rate_${idx}`}
            disabled={true}
            min={0}
            value={rate}
            title={rate}
          />
        </td>

        <td>
          <Form.Control
            onChange={() => {}}
            size="sm"
            className="e3t-form-elements"
            readOnly={true}
            name={`noOfResources`}
            // style={{ width: "60px" }}
            type="number"
            pattern={REGEX_INTEGERS}
            data-testid={`noOfResources_${idx}`}
            min={1}
            value={noOfResources}
            title={noOfResources}
          />
        </td>

        <td>
          <Form.Control
            onChange={isView ? () => {} : handleChangeProjDuration}
            onBlur={isView ? () => {} : handleChangeProjDuration}
            readOnly={isView}
            size="sm"
            className="e3t-form-elements"
            name={`projectDuration`}
            type="number"
            step={0.01}
            pattern={REGEX_INTEGERS}
            data-testid={`projectDuration_${idx}`}
            min={0}
            value={projDuration}
            title={projectDuration}
          />
        </td>

        <td>
          <Form.Control
            size="sm"
            className="e3t-form-elements"
            name={`cost`}
            style={{ minWidth: "80px" }}
            type="number"
            value={cost}
            title={cost}
            data-testid={`cost_${idx}`}
            disabled={true}
          />
        </td>
        <td>
          <Button
            bsPrefix="btn btn-success btn-sm sow-table-header-button mr-1"
            title="Add Row"
            data-testid="AddTableRow"
            onClick={(e) => {
              e.preventDefault();
              dispatch(
                actionE3TAddResourceTableRow(
                  typeOfWork,
                  workPackage,
                  typeOfWorkId,
                  workPackageId
                )
              );
            }}
            disabled={isView}
          >
            <i className="fas fa-plus fa-xs" />
          </Button>
        </td>
        <td
          style={{
            borderLeftColor: "white",
          }}
        >
          <Button
            bsPrefix="btn btn-success new-btn-success btn-sm  pointer"
            title="Remove Row"
            disabled={isView}
            onClick={handleButtonClick}
          >
            <i className="fas fa-minus fa-xs" />
          </Button>
        </td>
      </tr>
    </>
  );
};

export default E3TFormTableRow;
