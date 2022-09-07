import SowRoutePageWrapper from "../../Components/RoutePageWrapper";
import { Button, Col, Spinner } from "react-bootstrap";
import { useHistory, useRouteMatch } from "react-router";
import DynamicDataForm from "../../Components/DynamicDataForm";
import { useDispatch, useSelector } from "react-redux";
import { showE3T } from "../../Redux/utils/showE3T";
import { useContext, useMemo } from "react";
import { ModeContext } from "../../Components/ModeProvider";
import { actionGeneratePreviewReset } from "../../Redux/Actions/GeneratePreview";
import { actionSavePageDraft } from "../../Redux/Actions/Draft";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";

const DynamicData = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const dispatch = useDispatch();

  const {
    showE3t,
    wpSectionDataLoad,
    customModulesDataFetchState,
    costingEstimationFetchState,
    e3tTshirtSizesV2FetchState,
    pagePostFetchState,
    originalId,
  } = useSelector((state) => ({
    showE3t: showE3T(state),
    wpSectionDataLoad: state.dynamicData?.wpSectionDataLoad,
    customModulesDataFetchState:
      state.customModuleSidePanel?.customModulesDataFetchState,
    costingEstimationFetchState: state.e3tData.e3tCostingEstimationV2FetchState,
    e3tTshirtSizesV2FetchState: state.e3tData.e3tTshirtSizesV2FetchState,
    pagePostFetchState: state.draft.pagePostFetchState,
    originalId: state.logData.latestData?.id,
  }));

  console.log({ originalId });
  const { isView, isEdit, isClone, isDraft } = useContext(ModeContext);
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!showE3t && isEdit) {
      dispatch(actionGeneratePreviewReset());
    }
    const sp = match.url.split("/");
    sp[sp.length - 1] = showE3t ? "e3t" : "generate-preview";
    history.push(sp.join("/"));
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    const sp = match.url.split("/");
    if (!isEdit && !isView && !isClone && !isDraft) {
      sp.pop();
    }
    sp.pop();
    history.push(sp.join("/"));
  };

  const isFetching = useMemo(() => {
    return (
      wpSectionDataLoad === 1 ||
      customModulesDataFetchState === 1 ||
      costingEstimationFetchState === 1 ||
      e3tTshirtSizesV2FetchState === 1
    );
  }, [
    wpSectionDataLoad,
    customModulesDataFetchState,
    costingEstimationFetchState,
    e3tTshirtSizesV2FetchState,
  ]);

  return (
    <>
      <SowRoutePageWrapper>
        {/* <PageTitle title="Dynamic Data" small /> */}
        <form
          className={isFetching ? "disableScreen" : ""}
          id="dynamicDataForm"
          onSubmit={handleFormSubmit}
        >
          <DynamicDataForm isView={isView} />
        </form>
      </SowRoutePageWrapper>
      <Col className="submit-prev-btn">
        <Button
          disabled={
            isFetching || pagePostFetchState === APIFetchStatus.FETCHING
          }
          form="dynamicDataForm"
          bsPrefix="prev-next-btn-size btn btn-success btn-sm float-right action-button"
          type="submit"
        >
          {showE3t
            ? "Next"
            : isEdit || isClone || originalId !== -1
            ? "Update & Preview"
            : isView
            ? "Preview"
            : "Save & Preview"}
        </Button>
        <Button
          disabled={
            isFetching || pagePostFetchState === APIFetchStatus.FETCHING
          }
          bsPrefix="prev-next-btn-size btn btn-success btn-sm float-right mr-2 yellow-button btn-warning"
          onClick={handlePrevious}
        >
          Previous
        </Button>

        {!isView && (
          <Button
            disabled={
              isFetching || pagePostFetchState === APIFetchStatus.FETCHING
            }
            onClick={(e) => {
              e.preventDefault();
              console.log("save as draft clicked");
              dispatch(
                actionSavePageDraft(
                  match.url,
                  originalId && originalId !== -1 ? originalId : "",
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

export default DynamicData;
