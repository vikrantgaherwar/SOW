import React, { memo } from "react";
import { map } from "lodash";
import { Col, Row, Form } from "react-bootstrap";

const DynamicRadioCheck = ({ item, dynamicTableFields, setTemplateFields }) => {
  const handleRadioChange = (id, field) => {
    setTemplateFields((templateFields) => {
      templateFields = map(templateFields, (item) => {
        if (item.id === id) {
          return { ...item, value: `${field.id}` };
        }
        return { ...item };
      });
      return templateFields;
    });
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
              <Col sm={7}>
                {map(dynamicTableFields[item.tableId], (button) => (
                  <Form.Check
                    inline
                    key={button.id}
                    type={button.contentControlType}
                    label={button.fieldName}
                    id={button.id}
                    value={button.id}
                    onChange={() => handleRadioChange(item.id, button)}
                    checked={item.value === `${button.id}`}
                  />
                ))}
              </Col>
            </Form.Group>
          </Col>
        )}
    </>
  );
};

export default memo(DynamicRadioCheck);
