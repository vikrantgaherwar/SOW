import MyRow from "../MyRow";
import { Col, Table, Card } from "react-bootstrap";

const E3TSummaryRiskTable = ({
  resourceTable,
  e3tData,
  selectedTypeOfWork,
}) => {
  const riskRating = resourceTable
    .filter((e) => e.riskRating === "Medium" || e.riskRating === "High")
    .reduce((arr, curr) => {
      if (
        arr.findIndex(
          (e) =>
            e.typeOfWorkId === curr.typeOfWorkId &&
            e.workPackageId === curr.workPackageId
        ) === -1
      ) {
        return [...arr, curr];
      }
      return [...arr];
    }, []);

  return (
    <>
      <MyRow>
        <Col sm={12}>
          <Card>
            <Card.Header as="h5" bsPrefix="sow-sectionline">
              Risk Summary
            </Card.Header>
          </Card>
        </Col>
      </MyRow>
      <MyRow>
        <Col>
          <Table bordered style={{ marginBottom: "3em" }}>
            <thead className="sow-table-header-sticky">
              <tr style={{ borderBottom: "1.5px solid black" }}>
                <th className="sow-table-header">Type of Work</th>
                <th className="sow-table-header">Work Package</th>
                <th className="sow-table-header">Risk Rating</th>
              </tr>
            </thead>
            <tbody>
              {riskRating.length > 0 ? (
                riskRating.map((row, rowId) => (
                  <tr key={`e3t_summary_risk_table_row_${rowId}`}>
                    <td>
                      <span className="d-flex flex-row align-items-center">
                        {row.typeOfWork}
                      </span>
                    </td>
                    <td>
                      <span className="d-flex flex-row align-items-center">
                        {row.workPackage}
                      </span>
                    </td>
                    <td>
                      <span className="d-flex flex-row align-items-center">
                        <i
                          className="fas fa-exclamation-circle fa-2x mr-1"
                          style={{
                            color:
                              row.riskRating === "Low"
                                ? "green"
                                : row.riskRating === "Medium"
                                ? "orange"
                                : row.riskRating === "High"
                                ? "red"
                                : "",
                          }}
                        />
                        {row.riskRating}
                      </span>
                    </td>
                  </tr>
                ))
              ) : selectedTypeOfWork.length > 0 ? (
                <tr>
                  <td colSpan="100%">
                    <strong>
                      <span style={{ fontSize: "1rem" }}>
                        Risk Rating is{" "}
                        <span style={{ color: "green" }}>LOW</span> for the
                        Selected Modules
                      </span>
                    </strong>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="100%">
                    <strong>Nothing is selected yet</strong>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </MyRow>
    </>
  );
};

export default E3TSummaryRiskTable;
