import { Redirect, Route } from "react-router-dom";
import LoadingComponent from "../LoadingComponent";
import SowRoutePageWrapper from "../RoutePageWrapper";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useEffect, useState } from "react";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import { actionE3TFetchRegionalData } from "../../Redux/Actions/E3TData";

const E3TDataLoadedPath = ({ children, shouldLoad, ...rest }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // const dispatch = useDispatch();
  const {
    e3tRegionalDataFetchState,
    country,
    productLine,
    e3tFxRatesFetchState,
    e3tTshirtSizesFetchState,
    e3tRemoteSTDsFetchState,
  } = useSelector(
    (state) => ({
      e3tRegionalDataFetchState: state.e3tData.e3tRegionalDataFetchState,
      e3tFxRatesFetchState: state.e3tData.e3tFxRatesFetchState,
      e3tTshirtSizesFetchState: state.e3tData.e3tTshirtSizesFetchState,
      e3tRemoteSTDsFetchState: state.e3tData.e3tRemoteSTDsFetchState,
      country: state.masterData.country,
      productLine: state.customerData.productLine,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (
      e3tRegionalDataFetchState === APIFetchStatus.BOOTED ||
      e3tFxRatesFetchState === APIFetchStatus.BOOTED ||
      // e3tTshirtSizesFetchState === APIFetchStatus.BOOTED ||
      e3tRemoteSTDsFetchState === APIFetchStatus.BOOTED
    ) {
      setLoading(true);
    } else if (
      e3tRegionalDataFetchState === APIFetchStatus.FETCHING ||
      // e3tTshirtSizesFetchState === APIFetchStatus.FETCHING ||
      e3tFxRatesFetchState === APIFetchStatus.FETCHING ||
      e3tRemoteSTDsFetchState === APIFetchStatus.FETCHING
    ) {
      setLoading(true);
    } else if (
      e3tRegionalDataFetchState === APIFetchStatus.FAILED ||
      e3tFxRatesFetchState === APIFetchStatus.FAILED ||
      // e3tTshirtSizesFetchState === APIFetchStatus.FAILED ||
      e3tRemoteSTDsFetchState === APIFetchStatus.FAILED
    ) {
      console.log({
        e3tRegionalDataFetchState,
        e3tFxRatesFetchState,
        e3tTshirtSizesFetchState,
        e3tRemoteSTDsFetchState,
      });
      setError(true);
    } else {
      console.log({
        e3tRegionalDataFetchState,
        e3tFxRatesFetchState,
        e3tTshirtSizesFetchState,
        e3tRemoteSTDsFetchState,
      });
      setError(false);
      setLoading(false);
    }
  }, [
    e3tRegionalDataFetchState,
    e3tFxRatesFetchState,
    // e3tTshirtSizesFetchState,
    e3tRemoteSTDsFetchState,
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

export default E3TDataLoadedPath;
