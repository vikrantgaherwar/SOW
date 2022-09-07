import React, { useEffect } from "react";

import { map, reduce } from "lodash";
import { Col, Row, Form, Table, Button } from "react-bootstrap";
import HelperText from "./HelperText";

const DynamicTable = ({ item, dynamicTableFields, setTemplateFields }) => {
  const handleChange = (event, id, idx, fieldId) => {
    const { value } = event.target;
    setTemplateFields((templateFields) => {
      templateFields = map(templateFields, (item) => {
        if (item.id === id) {
          const changedTableValue = map(item.tableValue, (row, index) => {
            if (index === idx) {
              return map(row, (col) => {
                if (col.id === fieldId) {
                  return { ...col, value };
                }
                return { ...col };
              });
            }
            return row;
          });
          return { ...item, tableValue: [...changedTableValue] };
        }
        return { ...item };
      });
      return templateFields;
    });
  };

  const handleAddTableRow = (id) => {
    setTemplateFields((templateFields) => {
      templateFields = map(templateFields, (field) => {
        if (field.id === id) {
          const newTableRow = [...dynamicTableFields[field.tableId]];
          return { ...field, tableValue: [...field.tableValue, newTableRow] };
        }
        return { ...field };
      });
      return templateFields;
    });
  };

  const handleRemoveTableRow = (id, idx) => {
    setTemplateFields((templateFields) => {
      templateFields = map(templateFields, (field) => {
        if (field.id === id) {
          field.tableValue.splice(idx, 1);
          return { ...field, tableValue: [...field.tableValue] };
        }
        return { ...field };
      });
      return templateFields;
    });
  };

  const dynamicTableFormControl = (item, column, index) => {
    if (item && column) {
      switch (column.contentControlType) {
        case "textarea":
          return (
            <Form.Control
              // size="sm"
              as="textarea"
              disabled={!column.isEditable}
              rows={4}
              name={column.fieldName}
              placeholder={`[${column.fieldName}]`}
              value={column.value || ""}
              onChange={(e) => handleChange(e, item.id, index, column.id)}
            />
          );
        default:
          return (
            <Form.Control
              disabled={!column.isEditable}
              size="sm"
              name={column.fieldName}
              type={column.contentControlType}
              value={column.value || ""}
              placeholder={`[${column.fieldName}]`}
              onChange={(e) => handleChange(e, item.id, index, column.id)}
            />
          );
      }
    } else {
      return null;
    }
  };

  return (
    <>
      {dynamicTableFields[item.tableId] &&
        dynamicTableFields[item.tableId].length > 0 && (
          <Col>
            <Form.Group as={Row} controlId={item.fieldName}>
              <Col sm={3}>
                <Form.Label>
                  <strong>{item.fieldName}</strong>
                </Form.Label>
              </Col>
              <Col sm={9}>
                <Table bordered size="sm">
                  <thead>
                    <tr>
                      {map(dynamicTableFields[item.tableId], (column) => (
                        <th className="sow-table-header" key={column.id}>
                          {column.fieldName}
                        </th>
                      ))}
                      <th
                        style={{
                          backgroundColor: "white",
                          border: "0",
                        }}
                      >
                        <Button
                          bsPrefix="btn btn-success ml-1 btn-sm action-button pointer"
                          onClick={() => handleAddTableRow(item.id)}
                          title="Add Row"
                        >
                          <i className="fas fa-plus fa-xs" />
                        </Button>
                      </th>
                    </tr>
                  </thead>
                  {item?.tableValue?.length > 0 && (
                    <tbody>
                      {map(
                        [...Array(item.tableValue.length).keys()],
                        (index) => (
                          <tr key={index}>
                            {map(item.tableValue[index], (column, idx) => (
                              <td key={column.id}>
                                {dynamicTableFormControl(item, column, index)}
                              </td>
                            ))}
                            <td
                              style={{
                                backgroundColor: "white",
                                border: "0",
                              }}
                            >
                              {/* <Button
                                bsPrefix="btn btn-success ml-1 btn-sm action-button"
                                onClick={() => handleAddTableRow()}
                              >
                                <i className="fas fa-plus fa-xs" />
                              </Button> */}
                              <Button
                                bsPrefix="btn btn-success ml-1 btn-sm action-button pointer"
                                onClick={() =>
                                  handleRemoveTableRow(item.id, index)
                                }
                                title="Remove Row"
                              >
                                <i className="fas fa-minus fa-xs" />
                              </Button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  )}
                </Table>
                <HelperText displayText={item.helperText} />
              </Col>
            </Form.Group>
          </Col>
        )}
    </>
  );
};

export default DynamicTable;
