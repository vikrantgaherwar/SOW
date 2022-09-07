import { useContext } from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Redirect, Route } from "react-router";
import {
  actionGeneratePreview,
  actionGeneratePreviewLoadView,
  actionUpdateAndPreview,
} from "../../Redux/Actions/GeneratePreview";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import LoadingComponent from "../LoadingComponent";
import { ModeContext } from "../ModeProvider";
import SowRoutePageWrapper from "../RoutePageWrapper";

const EditGeneratePreview = ({ children, checkState, ...rest }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const { isView, isClone, isDraft } = useContext(ModeContext);
  const { previewPostState, isEditPossible, id, sidePanelData } = useSelector(
    (state) => ({
      previewPostState: state.generatePreview.previewPostState,
      isEditPossible: state.logData.latestData.isEditPossible,
      id: state.logData.latestData.id,
      sidePanelData: state.draft.sidePanelData,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (previewPostState === APIFetchStatus.BOOTED) {
      if (isDraft) {
        if (isEditPossible && id !== -1) {
          let isCloned = false;
          const f = sidePanelData.find((e) => e.originalId === id);
          console.log({ f, sidePanelData, id });
          if (f && f.isCloned) {
            isCloned = f.isCloned;
          }
          dispatch(actionUpdateAndPreview(isCloned));
        } else if (!isEditPossible && id !== -1) {
          alert("Invalid route");
          setError(true);
        } else {
          dispatch(actionGeneratePreview());
        }
      } else if (isView) {
        dispatch(actionGeneratePreviewLoadView());
      } else {
        dispatch(actionUpdateAndPreview(isClone));
      }
    } else if (previewPostState === APIFetchStatus.FETCHING) {
      // console.log({ msg: "Generate Preview APIFetchStatus.FETCHING" });
      setLoading(true);
    } else if (previewPostState === APIFetchStatus.FETCHED) {
      // console.log({ msg: "Generate Preview APIFetchStatus.FETCHED" });
      setError(false);
      setLoading(false);
    } else {
      setError(true);
    }
  }, [previewPostState]);

  return (
    <Route
      {...rest}
      render={() =>
        error ? (
          <Redirect to="/sow" />
        ) : loading ? (
          <SowRoutePageWrapper>
            <LoadingComponent />
          </SowRoutePageWrapper>
        ) : (
          children
        )
      }
    />
  );
};

export default EditGeneratePreview;
