import { Col, Form, Row } from "react-bootstrap";
import Select from "react-select";

const SKUComponent = ({
  value,
  options,
  handlechange,
  components,
  isMulti,
  name,
  placeholder,
  classNamePrefix,
  menuPlacement,
  customSelectStyles,
  readonly,
}) => {
  return (
    <Col>
      <Form.Group as={Row} controlId={`form_${name}`}>
        <Col className="d-flex flex-column justify-content-center" sm={2}>
          <b>SKU</b>
        </Col>
        <Col sm={10}>
          <Select
            isDisabled={readonly}
            required
            menuPlacement={menuPlacement}
            isMulti={isMulti}
            name={name}
            placeholder={placeholder}
            classNamePrefix={classNamePrefix}
            isClearable
            value={value} // set selected values
            isSearchable
            options={options}
            onChange={handlechange}
            styles={customSelectStyles}
            components={components}
          />
        </Col>
      </Form.Group>
    </Col>
  );
};
export default SKUComponent;
