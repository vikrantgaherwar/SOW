import { Row, Col, Form, Container } from "react-bootstrap";
import PricingFormFieldComponent from "./PricingFormFieldComponent";
import PricingResourceTable from "./PricingResourceTable";
import { PricingFormField } from "./PricingFormFields";

const PricingForm = ({ formState, setFormState, resourceDropDownData, regionalData }) => {
  
  return (
    <Container bsPrefix="container sow-container">
      <Form noValidate>
        <Row>
          <Col>
            <Form.Group as={Row} controlId="business">
              <Col sm={2} className="d-flex flex-row align-items-center">
                <Form.Label>
                  <div className="vert-aligned">
                    <strong>Resource Details</strong>
                  </div>
                </Form.Label>
              </Col>
              <Col sm={10}>
                <PricingResourceTable
                  regionalData={regionalData}
                  resourceDropDownData={resourceDropDownData}
                  formState={formState}
                  setFormState={setFormState}
                />
              </Col>
            </Form.Group>
          </Col>
        </Row>
        {PricingFormField.map((field) => (
          <PricingFormFieldComponent
            onChange={setFormState}
            value={[formState[field.name], formState[field.descriptionName]]}
            key={`${field.id}_${field.title}`}
            {...field}
          />
        ))}
      </Form>
    </Container>
  );
};

export default PricingForm;
