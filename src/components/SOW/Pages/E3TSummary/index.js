import { useContext } from "react";
import { Button, Col, Spinner } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import E3TSummaryForm from "../../Components/E3TSummaryForm";
import { ModeContext } from "../../Components/ModeProvider";
import SowRoutePageWrapper from "../../Components/RoutePageWrapper";
import { actionSavePageDraft } from "../../Redux/Actions/Draft";
import { actionGeneratePreviewReset } from "../../Redux/Actions/GeneratePreview";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import { showE3T } from "../../Redux/utils/showE3T";

const E3TSummary = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const dispatch = useDispatch();

  // const { showE3t } = useSelector((state) => showE3T(state), shallowEqual);
  const { pagePostFetchState, id, isEditPossible } = useSelector(
    (state) => ({
      pagePostFetchState: state.draft.pagePostFetchState,
      isEditPossible: state.logData.latestData.isEditPossible,
      id: state.logData.latestData.id,
    }),
    shallowEqual
  );

  const { isClone, isEdit, isView, isDraft } = useContext(ModeContext);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      dispatch(actionGeneratePreviewReset());
    }
    const sp = match.url.split("/");
    sp[sp.length - 1] = "generate-preview";
    history.push(sp.join("/"));
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    const sp = match.url.split("/");
    sp[sp.length - 1] = "e3t";
    history.push(sp.join("/"));
  };

  return (
    <>
      <SowRoutePageWrapper>
        <form id="summaryForm" onSubmit={handleFormSubmit}>
          <E3TSummaryForm />
        </form>
      </SowRoutePageWrapper>
      <Col className="submit-prev-btn">
        <Button
          form="summaryForm"
          bsPrefix="prev-next-btn-size btn btn-success btn-sm float-right action-button"
          type="submit"
          disabled={
            pagePostFetchState === APIFetchStatus.FETCHING ||
            (isDraft && (id !== -1 && isEditPossible === false))
          }
        >
          {isEdit || isClone || id !== -1
            ? "Update & Preview"
            : isView
            ? "Preview"
            : "Save & Preview"}
        </Button>
        <Button
          disabled={pagePostFetchState === APIFetchStatus.FETCHING}
          bsPrefix="prev-next-btn-size btn btn-success btn-sm float-right mr-2 yellow-button btn-warning"
          onClick={handlePrevious}
        >
          Previous
        </Button>

        {!isView && (
          <Button
            disabled={pagePostFetchState === APIFetchStatus.FETCHING}
            onClick={(e) => {
              e.preventDefault();
              console.log("save as draft clicked");
              dispatch(
                actionSavePageDraft(
                  match.url,
                  id,
                  isClone
                )
              );
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

export default E3TSummary;
