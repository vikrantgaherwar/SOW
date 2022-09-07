import PageTitle from "../../Components/PageTitle";
import SowRoutePageWrapper from "../../Components/RoutePageWrapper";
import { Button, Col, Spinner } from "react-bootstrap";
import { useHistory, useRouteMatch } from "react-router";
import E3TForm from "../../Components/E3TForm";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { ModeContext } from "../../Components/ModeProvider";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { showE3T } from "../../Redux/utils/showE3T";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import { actionSavePageDraft } from "../../Redux/Actions/Draft";
// import { useDispatch } from "react-redux";
// import { actionDynamicDataFieldsPageShouldUpdate } from "../../Redux/Actions/DynamicDataFields";

const E3T = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const match = useRouteMatch();

  // const { showE3t } = useSelector((state) => showE3T(state), shallowEqual);
  const {
    e3tCostingEstimationFetchState,
    wpSectionDataLoad,
    showE3t,
    pagePostFetchState,
  } = useSelector(
    (state) => ({
      showE3t: showE3T(state),
      e3tCostingEstimationFetchState:
        state.e3tData.e3tCostingEstimationV2FetchState,
      wpSectionDataLoad: state.dynamicData.wpSectionDataLoad,
      pagePostFetchState: state.draft.pagePostFetchState,
    }),
    shallowEqual
  );
  // const location = useLocation();

  const { isClone, isEdit, isView } = useContext(ModeContext);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const sp = match.url.split("/");
    sp[sp.length - 1] = "summary";
    history.push(sp.join("/"));
  };

  const handlePrevious = (e) => {
    e.preventDefault();

    const sp = match.url.split("/");
    // if (showE3t) {
    sp[sp.length - 1] = "dynamic-data";
    // } else {
    //   if (!isEdit && !isView) {
    //     sp.pop();
    //   }
    //   sp.pop();
    // }
    history.push(sp.join("/"));
  };

  return (
    <>
      <SowRoutePageWrapper>
        {/* <PageTitle title="Pricing and Costing" small /> */}
        <form id="e3tForm" onSubmit={handleFormSubmit}>
          <E3TForm isView={isView} isEdit={isEdit} isClone={isClone} />
        </form>
      </SowRoutePageWrapper>
      <Col className="submit-prev-btn">
        <Button
          form="e3tForm"
          bsPrefix="prev-next-btn-size btn btn-success btn-sm float-right action-button"
          type="submit"
          disabled={
            wpSectionDataLoad === APIFetchStatus.FETCHING ||
            e3tCostingEstimationFetchState === APIFetchStatus.FETCHING ||
            pagePostFetchState === APIFetchStatus.FETCHING
          }
        >
          Next
        </Button>
        <Button
          bsPrefix="prev-next-btn-size btn btn-success btn-sm float-right mr-2 yellow-button btn-warning"
          onClick={handlePrevious}
          disabled={
            wpSectionDataLoad === APIFetchStatus.FETCHING ||
            e3tCostingEstimationFetchState === APIFetchStatus.FETCHING ||
            pagePostFetchState === APIFetchStatus.FETCHING
          }
        >
          Previous
        </Button>

        {!isView && (
          <Button
            disabled={pagePostFetchState === APIFetchStatus.FETCHING}
            onClick={(e) => {
              e.preventDefault();
              console.log("save as draft clicked");
              dispatch(actionSavePageDraft(match.url,), isClone);
            }}
            bsPrefix="prev-next-btn-size btn btn-success btn-sm float-right action-button mr-2"
          >
            {pagePostFetchState === APIFetchStatus.FETCHING ? (
              <>
                <Spinner size="sm" animation="border" role="status">
                  <span className="sr-only">Submitting...</span>
                </Spinner>
              </>
            ) : (
              "Save as Draft"
            )}
          </Button>
        )}
      </Col>
    </>
  );
};

export default E3T;
