import { Spinner } from "react-bootstrap";
import "./style.css"

const HistorySearchLoader = () => {
  return (
    <div className="text-font">
      <div className="d-flex flex-row align-items-center justify-content-center pt-1 full-screen-loader">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    </div>
  );
};
export default HistorySearchLoader;