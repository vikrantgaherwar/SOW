import { groupBy, map } from "lodash";
import axios from "axios";
import { Fragment, useState } from "react";
import {
  Col,
  Table,
  Card,
  Modal,
  CloseButton,
  Form,
  Badge,
  Row,
  Button,
  Spinner,
} from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import {
  isRecordFilled,
  parseFloating,
  parseInteger,
} from "../E3TForm/e3tFormData";
import MyRow from "../MyRow";
import "./skill-mapping.css";
import URLConfig from "../../URLConfig";

const E3TSummarySkillTable = ({ resourceTable }) => {
  const [show, setSow] = useState(false);
  const [employeeData, setEmployeeData] = useState({});
  const envData = URLConfig.get_Env();
  const { e3tData } = useSelector(
    (state) => ({ e3tData: state.e3tData }),
    shallowEqual
  );

  const usableResourceTable = map(
    groupBy(
      resourceTable
        .filter((e) => isRecordFilled(e))
        .map((e) => {
          if (e.remote === "Yes") {
            const sdtOb = e3tData.e3tRemoteSTDs.find((k) => k.id === e.sdt);
            console.log({ sdtOb, e });
            return { ...e, sdt: sdtOb.sdtLookup };
          } else {
            let sdtOb = e3tData.e3tRemoteSTDs.find((k) => k.id === e.sdt);
            if (sdtOb === undefined) {
              sdtOb = e3tData.e3tRemoteSTDs.find((k) => k.id === parseFloating(e3tData.e3tRegionalDataV2[0].id));
            }
            return { ...e, sdt: sdtOb.sdtLookup };
          }
        }),
      (e) => e.sdt
    )
  ).map((e) =>
    Object.values(
      e.reduce((prev, curr) => {
        const newPrev = { ...prev };
        console.log({ newPrev, curr });

        if (newPrev[curr.resourceType]) {
          newPrev[curr.resourceType].hours = (
            parseFloating(newPrev[curr.resourceType].hours) +
            parseFloating(curr.projectDuration)
          ).toFixed(2);
          newPrev[curr.resourceType].cost = (
            parseFloating(newPrev[curr.resourceType].cost) +
            parseFloating(curr.cost)
          ).toFixed(2);
          console.log({
            duration: curr.projectDuration,
            newPrevHours: newPrev[curr.resourceType].hours,
            resourceType: curr.resourceType,
          });
        } else {
          const ob = {
            sdt: curr.sdt,
            resourceType: curr.resourceType,
            hours: curr.projectDuration,
            cost: curr.cost,
          };
          newPrev[curr.resourceType] = ob;
          console.log({
            new: true,
            ob,
          });
        }
        if (curr.resourceType === "Customer Proj/Prgm Mgr IV") {
          console.log({ curr, newPrev });
        }
        return newPrev;
      }, {})
    )
  );

  const dataResourceTable = map(
    groupBy(
      resourceTable
        .filter((e) => isRecordFilled(e))
        .map((e) => {
          if (e.remote === "Yes") {
            const sdtOb = e3tData.e3tRemoteSTDs.find((k) => k.id === e.sdt);
            console.log(e);
            console.log(sdtOb);
            return { ...e, sdt: sdtOb.sdtLookup };
          } else {
            console.log(e);
            console.log(e3tData);
            return { ...e, sdt: e3tData.e3tRegionalData[0].sdt };
          }
        }),
      (e) => e.sdt
    )
  );

  // URLConfig.get_Environment()

  const FetchApiData = () => {
    const res = axios
      .post(URLConfig.getURL_SkillMapping(), dataResourceTable)
      .then((response) => {
        if (response.data) setEmployeeData(response.data);
        else setSow(!show);
      });
  };

  const GetEmployeeData = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (show === false) FetchApiData();
    setSow(!show);
  };

  console.log({
    resourceTable,
    ff: resourceTable.filter((e) => isRecordFilled(e)),
  });

  return (
    <>
      <MyRow>
        <Col sm={12}>
          <Card>
            <Card.Header as="h5" bsPrefix="sow-sectionline">
              Cost Breakup Summary
            </Card.Header>
          </Card>
        </Col>
      </MyRow>
      {envData !== "PROD" && (
        <MyRow>
          <Col sm={12}>
            <div style={{ float: "right", marginBottom: "0.25em" }}>
              <Button
                onClick={(e) => GetEmployeeData(e)}
                className="btn-mapping-color"
                variant="btn-mapping-color"
              >
                Skill Available?
              </Button>
            </div>
          </Col>
        </MyRow>
      )}
      <MyRow>
        <Col>
          <Table bordered style={{ marginBottom: "3em" }}>
            <thead className="sow-table-header-sticky">
              <tr style={{ borderBottom: "1.5px solid black" }}>
                <th className="sow-table-header">Resource Origin</th>
                <th className="sow-table-header">Resources</th>
                <th className="sow-table-header">Hours</th>
                <th className="sow-table-header">Cost</th>
              </tr>
            </thead>
            <tbody>
              {usableResourceTable.length > 0 ? (
                usableResourceTable.map((section, sectionIndex) => (
                  <Fragment key={`e3t_summary_section_${sectionIndex}`}>
                    {section.map((row, rowId) => (
                      <tr
                        key={`e3t_summary_section_${section[0].sdt}_${sectionIndex}_row_${rowId}`}
                      >
                        {rowId === 0 && (
                          <td
                            rowSpan={section.length.toString()}
                            style={{ backgroundColor: "WhiteSmoke" }}
                          >
                            <b>{row.sdt}</b>
                          </td>
                        )}
                        <td>{row.resourceType}</td>
                        <td>{parseFloating(row.hours).toFixed(2)}</td>
                        <td>{parseFloating(row.cost).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr style={{ borderBottom: "2px solid black" }}>
                      <td></td>
                      <td
                        style={{
                          borderLeft: "2px solid black",
                          borderTop: "2px solid black",
                        }}
                      >
                        <b>Total</b>
                      </td>
                      <td
                        style={{
                          borderLeft: "2px solid black",
                          borderTop: "2px solid black",
                        }}
                      >
                        <b>
                          {section
                            .reduce(
                              (total, e) => total + parseFloating(e.hours),
                              0
                            )
                            .toFixed(2)
                            .toString()}
                        </b>
                      </td>
                      <td
                        style={{
                          borderLeft: "2px solid black",
                          borderTop: "2px solid black",
                          borderRight: "2px solid black",
                        }}
                      >
                        <b>
                          {section
                            .reduce(
                              (total, e) => total + parseFloating(e.cost),
                              0
                            )
                            .toFixed(2)}
                        </b>
                      </td>
                    </tr>
                  </Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="100%">
                    <strong>
                      <span style={{ fontSize: "1rem" }}>No Data Yet</span>
                    </strong>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </MyRow>
      {show && (
        <>
          <Modal
            size="lg"
            centered
            show={show}
            backdrop="static"
            keyboard={false}
            dialogClassName="custom-skill-dialog"
          >
            <div className="modal-content">
              <Modal.Header className="cost-modal-header">
                <h5>Skill Availability</h5>
                <CloseButton
                  style={{ float: "right" }}
                  onClick={() => setSow(!show)}
                />
              </Modal.Header>
              <Modal.Body>
                {employeeData?.length > 0 ? (
                  <div className="sow-skill-mapping-container">
                    <Table
                      style={{ marginBottom: "3em", border: "1px solid grey" }}
                    >
                      <thead className="skill-table-header">
                        <tr
                          style={{
                            borderBottom: "1.5px solid black",
                          }}
                          className="sow-admin-tr"
                        >
                          <th>Resource Origin</th>
                          <th>Employee Name</th>
                          <th>Employee Email</th>
                          <th>Competency Level</th>
                        </tr>
                      </thead>
                      <tbody className="skill-modal-body">
                        {employeeData?.length > 0 &&
                          employeeData?.map((section, sectionIndex) => (
                            <>
                              <tr
                                key={sectionIndex + "_" + section}
                                style={{ padding: "10px" }}
                                className="heading-origin"
                              >
                                <td colSpan={4}>
                                  <b>{section.origin}</b>
                                </td>
                              </tr>
                              <tr></tr>
                              {section?.resourceData?.map(
                                (sectionItem, Index) => (
                                  <>
                                    <tr
                                      key={Index + "_" + sectionItem}
                                      className="heading-resource"
                                    >
                                      <td colSpan={4}>
                                        <b>{sectionItem.resourceType}</b>
                                      </td>
                                    </tr>
                                    {sectionItem?.csvData?.length > 0 ? (
                                      sectionItem?.csvData?.map(
                                        (resource, resourceIndex) => (
                                          <tr
                                            key={resourceIndex + "_" + resource}
                                          >
                                            <td></td>
                                            <td>{resource.employeeName}</td>
                                            <td>{resource.employeeEmail}</td>
                                            <td>{resource.competencyLevel}</td>
                                          </tr>
                                        )
                                      )
                                    ) : (
                                      <tr>
                                        <td
                                          colSpan="100%"
                                          style={{ textAlign: "center" }}
                                        >
                                          <strong>
                                            <span
                                              style={{
                                                fontSize: "1rem",
                                                textAlign: "center",
                                              }}
                                            >
                                              No Data
                                            </span>
                                          </strong>
                                        </td>
                                      </tr>
                                    )}
                                  </>
                                )
                              )}
                            </>
                          ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <div className="skill-spinner">
                    <Spinner size="sm" animation="border" role="status">
                      <span className="sr-only">Loading...</span>
                    </Spinner>
                  </div>
                )}
              </Modal.Body>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};

export default E3TSummarySkillTable;
