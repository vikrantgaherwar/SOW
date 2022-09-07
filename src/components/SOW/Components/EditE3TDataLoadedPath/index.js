import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import SowRoutePageWrapper from "../RoutePageWrapper";
import LoadingComponent from "../LoadingComponent";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";

const EditE3TDataLoadedPath = ({ children, checkState, ...rest }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const {
    e3tRemoteSTDsFetchState,
    e3tFxRatesFetchState,
    e3tTshirtSizesV2FetchState,
  } = useSelector((state) => ({
    e3tRemoteSTDsFetchState: state.e3tData.e3tRemoteSTDsFetchState,
    e3tFxRatesFetchState: state.e3tData.e3tFxRatesFetchState,
    e3tTshirtSizesV2FetchState: state.e3tData.e3tTshirtSizesV2FetchState,
  }));
  useEffect(() => {
    if (
      e3tFxRatesFetchState === APIFetchStatus.FETCHED &&
      e3tFxRatesFetchState === APIFetchStatus.FETCHED &&
      (e3tTshirtSizesV2FetchState === APIFetchStatus.FETCHED ||
        e3tTshirtSizesV2FetchState === APIFetchStatus.BOOTED)
    ) {
      setLoading(false);
    } else if (
      e3tFxRatesFetchState === APIFetchStatus.FAILED &&
      e3tFxRatesFetchState === APIFetchStatus.FAILED &&
      e3tTshirtSizesV2FetchState === APIFetchStatus.FAILED
    ) {
      setError(true);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [
    e3tRemoteSTDsFetchState,
    e3tFxRatesFetchState,
    e3tTshirtSizesV2FetchState,
  ]);
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

export default EditE3TDataLoadedPath;
