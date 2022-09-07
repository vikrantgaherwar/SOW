import React, { memo } from "react";
import { ITextField } from "../../../interfaces";
import { Form } from "react-bootstrap";

const CustomTextField = (props) => {
  /* Destructuring props */
  const { placeholder, disabled, value, size, onChangeFn, type } = props;
  return (
    <Form.Control
      size={size}
      disabled={disabled}
      as={type}
      rows={3}
      name={value}
      placeholder={placeholder}
      value={value || ""}
      onChange={onChangeFn}
    />
  );
};

/* Props Signature */
CustomTextField.propTypes = ITextField;

export default memo(CustomTextField);
