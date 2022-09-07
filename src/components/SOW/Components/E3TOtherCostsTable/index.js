import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { isTableStateFilled } from "../../Redux/utils/isTableStateFilled";
import { REGEX_INTEGERS } from "../../Redux/utils/regex";
import { parseFloating } from "../E3TForm/e3tFormData";
import MyRow from "../MyRow";
import { some } from "lodash";
import {
  e3tOtherCostIsTableRowFilled,
  E3TOtherCostsSelectOptions,
  otherCostState,
} from "./otherCostState";
import { toCamelCase } from "../../Redux/utils/toCamelCase";
import {
  actionE3TOtherValueTypeChanged,
  actionE3TValueChanged,
  actionNewE3TOtherCostRowRemoved,
} from "../../Redux/Actions/E3T";
import { useDispatch } from "react-redux";

const toFind = (state = [], keyword = "") => {
  return state.findIndex((e) => e.type === keyword);
};

const checkPropsForChanges = (
  state,
  name,
  cost,
  description,
  profit,
  total
) => {
  let newState = [...state];
  if (parseFloating(cost) > 0 || description.trim().length > 0) {
    const index = toFind(state, name);
    if (index === -1) {
      const newRow = otherCostState();
      newRow.type = name;
      newRow.cost = cost;
      newRow.description = description;
      newRow.profit = profit;
      newRow.total = total;
      newState = [newRow, ...newState];
    } else {
      newState[index].cost = cost;
      newState[index].description = description;
      newState[index].total = total;
      newState[index].profit = profit;
    }
  }
  return newState;
};

const E3TOtherCostsTable = ({
  travel,
  software,
  hardware,
  thirdParty,
  travelDescription,
  softwareDescription,
  hardwareDescription,
  thirdPartyDescription,
  travelProfit,
  travelTotal,
  softwareProfit,
  softwareTotal,
  hardwareProfit,
  hardwareTotal,
  thirdPartyTotal,
  // thirdPartyDescription,
  thirdPartyProfit,
  isView,
  handleChange,
}) => {
  const [costState, setCostState] = useState([otherCostState()]);
  const dispatch = useDispatch();

  const [selectOptions, setSelectOptions] = useState(
    E3TOtherCostsSelectOptions
  );

  const reduxUpdateRef = useRef();

  useEffect(() => {
    return () => {
      if (reduxUpdateRef.current) {
        clearTimeout(reduxUpdateRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setCostState((oldState) => {
      let newState = checkPropsForChanges(
        oldState,
        "Travel",
        travel,
        travelDescription,
        travelProfit,
        travelTotal
      );

      newState = checkPropsForChanges(
        newState,
        "Software",
        software,
        softwareDescription,
        softwareProfit,
        softwareTotal
      );
      newState = checkPropsForChanges(
        newState,
        "Hardware",
        hardware,
        hardwareDescription,
        hardwareProfit,
        hardwareTotal
      );
      newState = checkPropsForChanges(
        newState,
        "Third Party",
        thirdParty,
        thirdPartyDescription,
        thirdPartyProfit,
        thirdPartyTotal
      );

      return newState;
    });
  }, [
    travel,
    software,
    hardware,
    thirdParty,
    travelProfit,
    travelTotal,
    travelDescription,
    softwareProfit,
    softwareTotal,
    softwareDescription,
    hardwareProfit,
    hardwareTotal,
    hardwareDescription,
    thirdPartyProfit,
    thirdPartyTotal,
    thirdPartyDescription,
  ]);

  const clearExistingTimeout = () => {
    if (reduxUpdateRef.current) {
      clearTimeout(reduxUpdateRef.current);
    }
  };

  const handleTypeChanged = (index) => (e) => {
    const value = e.target.value;

    const oldType = costState[index].type.startsWith("Third")
      ? "thirdParty"
      : costState[index].type.toLowerCase();
    const newType = value.startsWith("Third")
      ? "thirdParty"
      : value.toLowerCase();

    const formState = costState.map((e, eIdx) => {
      if (eIdx === index) {
        const newRow = { ...e };
        newRow.type = value;
        return newRow;
      }
      return e;
    });

    setCostState(formState);

    reduxUpdateRef.current = setTimeout(() => {
      dispatch(actionE3TOtherValueTypeChanged(newType, oldType));
    }, 300);
    // dispatch(actionE3TOtherValueTypeChanged(newType, oldType));
  };

  const handleCostChange = (index) => (e) => {
    const value = e.target.value;
    let total = "0.00";
    const formState = costState.map((e, eIdx) => {
      if (eIdx === index) {
        const newRow = { ...e };
        newRow.cost = value;
        const valF = parseFloating(value);
        const profitF = parseFloating(newRow.profit);
        newRow.total = (valF * (1 + profitF / 100)).toFixed(2);
        total = newRow.total;
        return newRow;
      }
      return e;
    });

    const t = formState[index].total;

    setCostState(formState);
    clearExistingTimeout();
    reduxUpdateRef.current = setTimeout(() => {
      handleChange({
        target: { name: toCamelCase(costState[index].type), value },
      });
      handleChange({
        target: {
          name: `${toCamelCase(costState[index].type)}Total`,
          value: t,
        },
      });
    }, 300);
  };

  const handleRowRemove = (index) => (e) => {
    e.preventDefault();
    const formState = costState.filter((_, idx) => idx !== index);
    const type = costState[index].type.startsWith("Third")
      ? "thirdParty"
      : costState[index].type.toLowerCase();

    dispatch(actionNewE3TOtherCostRowRemoved(type));
    setCostState(formState);
  };

  const handleProfitChange = (index) => (e) => {
    const value = e.target.value;
    let total = "0.00";
    const formState = costState.map((e, eIdx) => {
      if (eIdx === index) {
        const newRow = { ...e };
        newRow.profit = value;
        const valF = parseFloating(newRow.cost);
        const profitF = parseFloating(value);
        console.log({ valF, profitF });
        newRow.total = (valF * (1 + profitF / 100)).toFixed(2);
        total = newRow.total;
        return newRow;
      }
      return e;
    });

    const t = formState[index].total;

    setCostState(formState);
    clearExistingTimeout();
    reduxUpdateRef.current = setTimeout(() => {
      handleChange({
        target: {
          name: `${toCamelCase(costState[index].type)}Profit`,
          value,
        },
      });

      handleChange({
        target: {
          name: `${toCamelCase(costState[index].type)}Total`,
          value: t,
        },
      });
    }, 300);
  };

  const handleDescriptionChange = (index) => (e) => {
    const value = e.target.value;
    const formState = costState.map((e, eIdx) => {
      if (eIdx === index) {
        const newRow = { ...e };
        newRow.description = value;
        return newRow;
      }
      return e;
    });

    setCostState(formState);
    clearExistingTimeout();
    reduxUpdateRef.current = setTimeout(() => {
      handleChange({
        target: {
          name: `${toCamelCase(costState[index].type)}Description`,
          value,
        },
      });
    }, 300);
  };

  // useEffect(() => {}, [costState]);

  return (
    <>
      <MyRow>
        <Col sm={12}>
          <Card>
            <Card.Header as="h5" bsPrefix="sow-sectionline">
              Other Costs
            </Card.Header>
          </Card>
        </Col>
      </MyRow>
      <MyRow>
        <Col>
          <Form.Group as={Row}>
            <Col sm={12}>
              <Table bordered>
                <thead className="sow-table-header">
                  <tr>
                    <th className="sow-table-header">Type</th>
                    <th className="sow-table-header">Cost</th>
                    <th className="sow-table-header">Description</th>
                    <th className="sow-table-header">EGM %</th>
                    <th className="sow-table-header">Total</th>
                    <th className="sow-table-header">
                      <Button
                        bsPrefix="btn btn-success btn-sm sow-table-header-button"
                        title="Add Row"
                        data-testid="AddTableRow"
                        onClick={(e) => {
                          e.preventDefault();
                          setCostState((old) => [...old, otherCostState()]);
                          //   dispatch(actionE3TAddResourceTableRow());
                        }}
                        disabled={
                          some(
                            costState,
                            (e) => !e3tOtherCostIsTableRowFilled(e)
                          ) || isView
                        }
                      >
                        <i className="fas fa-plus fa-xs" />
                      </Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {costState.map((row, rowIndex) => (
                    <tr key={`other_cost_row_${row.type}_${rowIndex}`}>
                      <td>
                        <Form.Control
                          as="select"
                          size="sm"
                          value={row.type}
                          onChange={handleTypeChanged(rowIndex)}
                        >
                          <option value="">Select Type</option>
                          {selectOptions
                            .filter(
                              (e) =>
                                costState.findIndex((k) => k.type === e) ===
                                  -1 || row.type === e
                            )
                            .map((opt, optionIndex) => (
                              <option
                                value={opt}
                                key={`other_cost_type_select_${opt}_${optionIndex}`}
                              >
                                {opt}
                              </option>
                            ))}
                        </Form.Control>
                      </td>

                      <td>
                        <Form.Control
                          size="sm"
                          name={`cost`}
                          type="number"
                          pattern={REGEX_INTEGERS}
                          disabled={row.type === "" || isView}
                          value={row.cost}
                          min={0}
                          onChange={handleCostChange(rowIndex)}
                          onBlur={() =>
                            handleChange({
                              target: {
                                name: toCamelCase(row.type),
                                value: row.cost,
                              },
                            })
                          }
                        />
                      </td>

                      <td>
                        <Form.Control
                          size="sm"
                          name={"description"}
                          disabled={row.type === "" || isView}
                          //   readOnly={readonly ?? false}
                          as="textarea"
                          onChange={handleDescriptionChange(rowIndex)}
                          value={row.description}
                          placeholder={"Enter Description"}
                          onBlur={() =>
                            handleChange({
                              target: {
                                name: `${toCamelCase(row.type)}Description`,
                                value: row.description,
                              },
                            })
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          size="sm"
                          name={`profit`}
                          type="number"
                          pattern={REGEX_INTEGERS}
                          disabled={row.type === "" || isView}
                          value={row.profit}
                          min={0}
                          onChange={handleProfitChange(rowIndex)}
                          onBlur={() =>
                            handleChange({
                              target: {
                                name: `${toCamelCase(row.type)}Profit`,
                                value: row.profit,
                              },
                            })
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          size="sm"
                          name={`total`}
                          type="number"
                          pattern={REGEX_INTEGERS}
                          disabled={true}
                          value={row.total}
                          min={0}

                          // onChange={handleCostChange(rowIndex)}
                          // onBlur={() =>
                          //   handleChange({
                          //     target: {
                          //       name: toCamelCase(row.type),
                          //       value: row.cost,
                          //     },
                          //   })
                          // }
                        />
                      </td>
                      <td
                        style={{
                          borderLeftColor: "white",
                        }}
                      >
                        <Button
                          bsPrefix="btn btn-success new-btn-success btn-sm  pointer"
                          title="Remove Row"
                          disabled={
                            isView || !e3tOtherCostIsTableRowFilled(row)
                          }
                          onClick={handleRowRemove(rowIndex)}
                        >
                          <i className="fas fa-minus fa-xs" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Form.Group>
        </Col>
      </MyRow>
    </>
  );
};

export default E3TOtherCostsTable;
