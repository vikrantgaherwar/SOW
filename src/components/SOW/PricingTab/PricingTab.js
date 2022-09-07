import { STANDARD, DYNAMIC } from "../Constants";
import { Container, Row, Button, Col } from "react-bootstrap";
import PricingSpinner from "./PricingSpinner";
import PricingForm from "./PricingForm";

const PricingTab = ({
  loader,
  setActiveKey,
  formState,
  setFormState,
  resourceDropDownData,
  regionalData,
  isResourceTypeSelected,
}) => {
  const handleNext = () => {
    setActiveKey(DYNAMIC);
  };

  return (
    <Container
      bsPrefix="container container-fluid mt-4"
      data-testid="PricingTabComponent"
    >
      {loader ? (
        <PricingSpinner />
      ) : (
        <PricingForm
          formState={formState}
          regionalData={regionalData}
          setFormState={setFormState}
          resourceDropDownData={resourceDropDownData}
        />
      )}
      <Row>
        <Col>
          <Button
            bsPrefix="btn btn-success btn-sm float-right action-button"
            onClick={handleNext}
            // disabled={!isResourceTypeSelected}
          >
            Next
          </Button>
          <Button
            bsPrefix="btn btn-success btn-sm float-right mr-2 btn-warning"
            onClick={() => setActiveKey(STANDARD)}
          >
            Previous
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default PricingTab;
