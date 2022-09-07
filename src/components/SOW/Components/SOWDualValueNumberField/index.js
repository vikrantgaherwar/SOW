import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { REGEX_INTEGERS } from "../../Redux/utils/regex";

const SOWDualValueNumberField = ({
  idx,
  name,
  title,
  values,
  id,
  onChange,
  required,
  readonly,
  list,
  type,
  fullWidth,
  helperText,

  form,
  hasButton,
  disabled,
  min,
  max,
  step,
  onButtonClick,
  onBlur,
  hasSelectData,
  selectData,
  bsPrefix,
  buttonTitle,
  buttonDisabled,
  col,
  noFullWidth,
  isPercentage,
}) => {
  return (
    <Col>
      <Form.Group as={Row} controlId={`form_${name}`}>
        <Col sm={fullWidth ? 4 : col ? col[0] : 2}>
          <Form.Label>
            <b>{title}</b>
          </Form.Label>
        </Col>
        <Col
          sm={
            fullWidth
              ? hasButton
                ? 6
                : 8
              : noFullWidth
              ? 10
              : col
              ? col[1]
              : 4
          }
        >
          <InputGroup>
            <Form.Control
              size="sm"
              name={name}
              data-testid={name}
              type="text"
              readOnly
              step={step ?? "0.01"}
              min={min ?? 0}
              max={max ?? Number.MAX_SAFE_INTEGER}
              pattern={REGEX_INTEGERS}
              onChange={() => {}}
              value={values[0]}
              placeholder={title}
            />

            <InputGroup.Text
              className="p-1"
              style={{
                width: "50%",
                borderRadius: "0px",
                fontWeight: "500",
              }}
            >
              {values[1]}
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Form.Group>
    </Col>
  );
};
export default SOWDualValueNumberField;
