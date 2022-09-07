import { useRef } from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch, shallowEqual, batch } from "react-redux";
import { Route, Redirect, useRouteMatch } from "react-router-dom";
import { actionFetchCustomerData } from "../../Redux/Actions/CustomerData";
import {
  actionE3TFetchRegionalData,
  actionE3TGetRemoteSDTs,
  actionE3TGetTShirtSizes,
} from "../../Redux/Actions/E3TData";
import { actionMasterDataValueChanged } from "../../Redux/Actions/MasterData";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
import LoadingComponent from "../LoadingComponent";
import SowRoutePageWrapper from "../RoutePageWrapper";

const CustomerDataLoadedPath = ({ children, shouldLoad, ...rest }) => {
  const dispatch = useDispatch();
  const [error, showError] = useState(false);
  const [loading, showLoading] = useState(true);
  const { customerDataFetchState, country, productLine, e3tFetchState } =
    useSelector(
      (state) => ({
        customerDataFetchState: state.customerData.customerDataFetchState,
        country: state.masterData.country,
        productLine: state.customerData.productLine,
        e3tFetchState: state.e3tData.e3tRegionalDataFetchState,
      }),
      shallowEqual
    );
  const oppIdRef = useRef("");
  const loaded = useRef(true);

  const match = useRouteMatch();
  useEffect(() => {
    if (match.params && match.params.id) {
      oppIdRef.current = match.params.id;
    } else {
      showError(true);
    }
  }, []);

  useEffect(() => {
    if (country && productLine && loaded.current === false) {
      console.log({ country, productLine });
      dispatch(actionE3TFetchRegionalData(country, productLine, false, true));
    }
  }, [country, productLine]);

  useEffect(() => {
    if (e3tFetchState === APIFetchStatus.FETCHING) {
      showLoading(true);
    } else if (
      customerDataFetchState === APIFetchStatus.BOOTED &&
      oppIdRef.current.length === 14
    ) {
      dispatch(actionMasterDataValueChanged("oppId", oppIdRef.current));
      dispatch(actionFetchCustomerData(oppIdRef.current));
    } else if (customerDataFetchState === APIFetchStatus.FAILED) {
      showError(true);
    } else if (
      customerDataFetchState === APIFetchStatus.FETCHED &&
      e3tFetchState === APIFetchStatus.FETCHING
    ) {
      showLoading(true);
    } else if (
      customerDataFetchState === APIFetchStatus.FETCHED &&
      e3tFetchState === APIFetchStatus.FETCHED
    ) {
      showLoading(false);
      loaded.current = false;
    } else if (customerDataFetchState === APIFetchStatus.FETCHING) {
      showLoading(true);
    }
  }, [customerDataFetchState, e3tFetchState]);

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

export default CustomerDataLoadedPath;
