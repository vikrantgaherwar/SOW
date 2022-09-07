import { Spinner } from "react-bootstrap";
const PricingSpinner = () => (
  <div className="d-flex flex-column align-items-center">
    <div className="p-2">
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
    <div className="p-2">Loading...</div>
  </div>
);

export default PricingSpinner;
