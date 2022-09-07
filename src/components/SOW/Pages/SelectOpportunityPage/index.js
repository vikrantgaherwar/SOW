import SowRoutePageWrapper from "../../Components/RoutePageWrapper";
import SelectOpportunity from "../../Components/SelectOpportunity";
import { Button, Col } from "react-bootstrap";
import MasterDataForm from "../../Components/MasterDataForm";
import { useHistory, useRouteMatch } from "react-router-dom";

const SelectOpportunityPage = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // const fd = new FormData(e.target);
    const length = e.target.length;
    let ob = {};
    for (let i = 0; i < length; i++) {
      const name = e.target[i].name;
      const value = e.target[i].value;
      if (name.length > 0) {
        ob[name] = value;
      }
    }

    if (ob["oppId"] && ob["oppId"].indexOf("-") > -1) {
      // console.log({ history });
      if (history.location.pathname.indexOf("edit") > -1) {
        history.push(`${match.url}/customer-data`);
      } else {
        history.push(`${match.url}/${ob["oppId"]}/customer-data`);
      }
    }
  };
  return (
    <SowRoutePageWrapper>
      <form id="selectOpportunityForm" onSubmit={handleFormSubmit}>
        <SelectOpportunity
          readonly={history.location.pathname.indexOf("view") > -1}
        />
        <MasterDataForm />
      </form>
      <Col className="d-flex align-items-center justify-content-center">
        <Button
          form="selectOpportunityForm"
          className="buttons-control-sow sow-next"
          bsPrefix="btn btn-success btn-sm px-5 action-button"
          type="submit"
        >
          Next
        </Button>
      </Col>
    </SowRoutePageWrapper>
  );
};

export default SelectOpportunityPage;
