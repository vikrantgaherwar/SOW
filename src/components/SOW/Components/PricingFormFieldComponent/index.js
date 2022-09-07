import { isNumber } from "lodash";
import { Row, Col, Form, InputGroup } from "react-bootstrap";
import { REGEX_FLOATING } from "../../Redux/utils/regex";
import MyCol from "../MyCol";
import MyRow from "../MyRow";

const PricingFormFieldComponent = ({
  name,
  title,
  value,
  onChange,
  type,
  precision,
  hasDescription,
  min,
  required,
  readonly,
  max,
  descriptionName,
  descriptionTitle,
  isPercentage,
  col,
}) => {
  return (
    <MyRow>
      <Col>
        <Form.Group as={Row} controlId={`form_${name}`}>
          <Col sm={hasDescription ? 4 : col ? col[0] : 2}>
            <Form.Label>
              <strong>{title}</strong>
            </Form.Label>
          </Col>
          <Col sm={hasDescription ? 8 : col ? col[1] : 4}>
            <InputGroup>
              <Form.Control
                size="sm"
                name={name}
                required={required ?? false}
                readOnly={readonly ?? false}
                data-testid={name}
                min={min ?? -Number.MAX_SAFE_INTEGER}
                max={max ?? Number.MAX_SAFE_INTEGER}
                pattern={REGEX_FLOATING}
                type={type}
                step={1 / Math.pow(10, precision ?? 2)}
                onChange={onChange}
                value={value[0]}
                placeholder={title}
              />

              {isPercentage && (
                <InputGroup.Text
                  className="p-0 justify-content-center"
                  style={{
                    width: "10%",
                    borderRadius: "0px",
                  }}
                >
                  %
                </InputGroup.Text>
              )}
            </InputGroup>
          </Col>
        </Form.Group>
      </Col>
      {hasDescription && (
        <Col style={{ top: "1em" }}>
          <Form.Group as={Row} controlId={`form_${descriptionName}`}>
            <Col sm={4}>
              <Form.Label>
                <strong>{descriptionTitle}</strong>
              </Form.Label>
            </Col>
            <Col sm={8}>
              <InputGroup>
                <Form.Control
                  size="sm"
                  name={descriptionName}
                  data-testid={descriptionName}
                  readOnly={readonly ?? false}
                  as="textarea"
                  onChange={onChange}
                  value={value[1]}
                  placeholder={descriptionTitle}
                />
                {isPercentage && <InputGroup.Text>%</InputGroup.Text>}
              </InputGroup>
            </Col>
          </Form.Group>
        </Col>
      )}
    </MyRow>
  );
};

export default PricingFormFieldComponent;
