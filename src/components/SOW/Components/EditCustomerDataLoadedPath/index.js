import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import SowRoutePageWrapper from "../RoutePageWrapper";
import LoadingComponent from "../LoadingComponent";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import { actionE3TFetchRegionalData } from "../../Redux/Actions/E3TData";
import { actionE3TLoadEditData } from "../../Redux/Actions/E3T";
import { actionDynamicDataLoadEditData } from "../../Redux/Actions/DynamicDataFields";
const EditCustomerDataLoadedPath = ({ children, checkState, ...rest }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const {
    e3tRegionalDataFetchState,
    country,
    customerDataFetchState,
    productLine,
    customerLog,
    e3tRemoteSTDsFetchState,
    e3tFxRatesFetchState,
    e3tTshirtSizesV2FetchState,
  } = useSelector(
    (state) => ({
      e3tRegionalDataFetchState: state.e3tData.e3tRegionalDataFetchState,
      country: state.masterData.country,
      customerDataFetchState: state.customerData.customerDataFetchState,
      productLine: state.customerData.productLine,
      customerLog: state.logData.customerLog,
      e3tRemoteSTDsFetchState: state.e3tData.e3tRemoteSTDsFetchState,
      e3tFxRatesFetchState: state.e3tData.e3tFxRatesFetchState,
      e3tTshirtSizesV2FetchState: state.e3tData.e3tTshirtSizesV2FetchState,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (e3tRegionalDataFetchState === APIFetchStatus.BOOTED) {
      console.log({ country, productLine });
      dispatch(actionE3TFetchRegionalData(country, productLine, true));
    } else if (e3tRegionalDataFetchState === APIFetchStatus.FETCHING) {
      setLoading(true);
    } else if (e3tRegionalDataFetchState === APIFetchStatus.FAILED) {
      setError(true);
    } else {
      if (
        e3tFxRatesFetchState === APIFetchStatus.FETCHED &&
        e3tRemoteSTDsFetchState === APIFetchStatus.FETCHED &&
        (e3tTshirtSizesV2FetchState === APIFetchStatus.FETCHED ||
          e3tTshirtSizesV2FetchState === APIFetchStatus.BOOTED)
      ) {
        setLoading(false);
      } else if (
        e3tFxRatesFetchState === APIFetchStatus.FAILED &&
        e3tRemoteSTDsFetchState === APIFetchStatus.FAILED &&
        e3tTshirtSizesV2FetchState === APIFetchStatus.FAILED
      ) {
        setError(true);
        setLoading(false);
      } else {
        setLoading(true);
      }
    }
  }, [
    e3tRegionalDataFetchState,
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

export default EditCustomerDataLoadedPath;
