import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { resetAll } from "../../Redux/Actions/ResetAll";

const ErrorComponent = () => {
  /* dispatch reset action */
  const dispatch = useDispatch();

  const { noResponseData } = useSelector(
    (state) => ({
      noResponseData: state.customerData.noResponseData,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (noResponseData) {
      toast.warn(noResponseData, {
        position: "bottom-left",
        // autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        dispatch(resetAll(true));
      }, 3000);
    }
  }, [noResponseData]);

  /* handle home route */
  const handlePrevious = (e) => {
    e.preventDefault();
    dispatch(resetAll(true));
  };

  /* render Error component*/
  return (
    <div className="d-flex flex-column align-items-center justify-center">
      <h4>Something went wrong, Please try again later</h4>
      <Button
        disabled={noResponseData}
        bsPrefix="prev-next-btn-size btn btn-success btn-sm float-right mr-2 yellow-button btn-warning"
        onClick={handlePrevious}
      >
        Go Back
      </Button>
      <ToastContainer />
    </div>
  );
};

export default ErrorComponent;
