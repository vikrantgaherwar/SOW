import { Spinner } from "react-bootstrap";
const LoadingComponent = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-center">
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingComponent;
