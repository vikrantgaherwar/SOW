import { useState } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Redirect, Route } from "react-router";
import LoadingComponent from "../LoadingComponent";
import SowRoutePageWrapper from "../RoutePageWrapper";
import { useEffect } from "react";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import {
  actionGeneratePreview,
  actionGeneratePreviewLoadView,
} from "../../Redux/Actions/GeneratePreview";
import { useContext } from "react";
import { ModeContext } from "../ModeProvider";

const GeneratePreviewPath = ({ children, shouldLoad, ...rest }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const { previewPostState } = useSelector(
    (state) => ({
      previewPostState: state.generatePreview.previewPostState,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (previewPostState === APIFetchStatus.BOOTED) {
      dispatch(actionGeneratePreview());
    } else if (previewPostState === APIFetchStatus.FETCHING) {
      setLoading(true);
    } else if (previewPostState === APIFetchStatus.FETCHED) {
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

export default GeneratePreviewPath;
