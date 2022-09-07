import { isNumber } from "lodash";
import { Row, Col, Form, InputGroup } from "react-bootstrap";
import { parseFloating } from "./PricingFormFields";
import { REGEX_FLOATING } from "./regexConsts";
const PricingFormFieldComponent = ({
  name,
  title,
  value,
  onChange,
  type,
  precision,
  hasDescription,
  min,
  max,
  descriptionName,
  descriptionTitle,
  isPercentage,
}) => {
  const handleValueChange = (e) => {
    const thisValue = e.target.value;
    const thisName = e.target.name;
    if (title.indexOf("%") > -1) {
      if (isNumber(min) && isNumber(max)) {
        const x = parseFloating(thisValue);
        if (x > 0) {
          let v = x;
          if (v > max) {
            v = max;
            onChange((state) => {
              return { ...state, [thisName]: v.toFixed(precision) };
            });
          } else {
            onChange((state) => {
              return { ...state, [thisName]: thisValue };
            });
          }
        } else {
          onChange((state) => {
            return { ...state, [thisName]: thisValue };
          });
        }
      } else {
        console.log("no min, max");
      }
    } else {
      onChange((state) => {
        return { ...state, [thisName]: thisValue };
      });
    }
  };

  return (
    <Row>
      <Col>
        <Form.Group as={Row} controlId={`form_${name}`}>
          <Col sm={hasDescription ? 4 : 2}>
            <Form.Label>
              <strong>{title}</strong>
            </Form.Label>
          </Col>
          <Col sm={hasDescription ? 8 : 4}>
            <InputGroup>
              <Form.Control
                size="sm"
                name={name}
                data-testid={name}
                min={min ?? -Number.MAX_SAFE_INTEGER}
                max={max ?? Number.MAX_SAFE_INTEGER}
                pattern={REGEX_FLOATING}
                type={type}
                step={1 / Math.pow(10, precision)}
                onChange={handleValueChange}
                value={value[0]}
                placeholder={title}
              />

              {isPercentage && <InputGroup.Text>%</InputGroup.Text>}
            </InputGroup>
          </Col>
        </Form.Group>
      </Col>
      {hasDescription && (
        <Col>
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
                  as="textarea"
                  onChange={handleValueChange}
                  value={value[1]}
                  placeholder={descriptionTitle}
                />
                {isPercentage && <InputGroup.Text>%</InputGroup.Text>}
              </InputGroup>
            </Col>
          </Form.Group>
        </Col>
      )}
    </Row>
  );
};

export default PricingFormFieldComponent;
