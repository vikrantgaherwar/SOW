import { Spinner } from "react-bootstrap";

const ShowLoading = () => {
  return (
    <div className="module_slider_click" id="sowslide">
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
};

export default ShowLoading;
