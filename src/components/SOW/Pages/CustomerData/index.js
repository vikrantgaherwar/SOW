import PageTitle from "../../Components/PageTitle";
import { useHistory, useRouteMatch } from "react-router-dom";
import SowRoutePageWrapper from "../../Components/RoutePageWrapper";
import { Button, Col } from "react-bootstrap";
import CustomerDataForm from "../../Components/CustomerDataForm";
import SelectOpportunity from "../../Components/SelectOpportunity";
import MasterDataForm from "../../Components/MasterDataForm";
import { useDispatch, useSelector } from "react-redux";
import { showE3T } from "../../Redux/utils/showE3T";
import { useContext, useEffect, useRef, useState } from "react";
import { ModeContext } from "../../Components/ModeProvider";
import { actionE3TRecalculate } from "../../Redux/Actions/E3T";
import { APIFetchStatus } from "../../Redux/utils/fetchStatus";
const CustomerData = () => {
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();

  const { oppId, oppIdFetched, showE3t, latestSow, customerDataFetched } =
    useSelector((state) => ({
      oppId: state.masterData.oppId,
      oppIdFetched: state.masterData.oppIdFetched,
      showE3t: showE3T(state),
      latestSow: state.logData?.latestData,
      customerDataFetched: state.cloneSafe.customerDataFetched,
    }));

  const { isClone, isEdit, isView, isDraft } = useContext(ModeContext);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // const sp = match.url.split("/");
    // sp[sp.length - 1] = "e3t";
    // const next = showE3t ? "e3t" : "dynamic-data";
    const next = "dynamic-data";
    if (isEdit || isView || isClone || isDraft) {
      history.push(`${match.url}/${next}`);
    } else {
      history.push(`${match.url}/${oppId}/${next}`);
    }
  };

  useEffect(() => {
    if (isClone && customerDataFetched === APIFetchStatus.FETCHED) {
      dispatch(actionE3TRecalculate());
    }
  }, []);

  return (
    <>
      <SowRoutePageWrapper>
        <form id="customerDataForm" onSubmit={handleFormSubmit}>
          <SelectOpportunity
            isEdit={isEdit}
            latestSow={latestSow}
            isView={isView}
            isDraft={isDraft}
            isClone={isClone}
          />
          <MasterDataForm
            form="customerDataForm"
            isView={isView}
            isDraft={isDraft}
            isClone={isClone}
            isEdit={isEdit}
          />
          <PageTitle title="Customer Data" small />
          <CustomerDataForm isView={isView} isClone={isClone} isEdit={isEdit} />
        </form>
      </SowRoutePageWrapper>
      <Col className="submit-prev-btn">
        <Button
          disabled={!oppIdFetched}
          form="customerDataForm"
          bsPrefix="prev-next-btn-size btn btn-success float-right btn-sm ml-4  action-button"
          type="submit"
        >
          Next
        </Button>
      </Col>
    </>
  );
};

export default CustomerData;
