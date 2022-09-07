import React from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Container,
  Spinner,
  Table,
} from "react-bootstrap";

import { STANDARD, DYNAMIC } from "./Constants";

const PricingData = ({
  loader,
  setActiveKey,
  pricingFields,
  setPricingFields,
}) => {
  const handleNext = () => {
    setActiveKey(DYNAMIC);
  };

  const dynamicTableFormControl = () => {
    return (
      <Form.Control
        size="sm"
        name="Test"
        type="text"
        value=""
        placeholder={`[test]`}
      />
    );
  };

  return (
    <Container bsPrefix="container container-fluid mt-4">
      {loader ? (
        <div className="d-flex flex-column align-items-center">
          <div className="p-2">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
          <div className="p-2">Loading...</div>
        </div>
      ) : (
        <>
          <Container bsPrefix="container sow-container">
            <Form noValidate>
              <Row>
                <Col>
                  <Form.Group as={Row} controlId="business">
                    <Col sm={2}>
                      <Form.Label>
                        <strong>Resource Table</strong>
                      </Form.Label>
                    </Col>
                    <Col sm={10}>
                      <Table bordered size="sm">
                        <thead>
                          <tr>
                            <th className="sow-table-header">Resource Type</th>
                            <th className="sow-table-header">
                              No. of Resources
                            </th>
                            <th className="sow-table-header">
                              Project Duration
                            </th>
                            <th className="sow-table-header">Working Hours</th>
                            <th className="sow-table-header">Cost</th>
                            <th
                              style={{
                                backgroundColor: "white",
                                border: "0",
                              }}
                            >
                              <Button
                                bsPrefix="btn btn-success ml-1 btn-sm action-button pointer"
                                title="Add Row"
                              >
                                <i className="fas fa-plus fa-xs" />
                              </Button>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{dynamicTableFormControl()}</td>
                            <td>{dynamicTableFormControl()}</td>
                            <td>{dynamicTableFormControl()}</td>
                            <td>{dynamicTableFormControl()}</td>
                            <td>{dynamicTableFormControl()}</td>
                            <td
                              style={{
                                backgroundColor: "white",
                                border: "0",
                              }}
                            >
                              <Button
                                bsPrefix="btn btn-success ml-1 btn-sm action-button pointer"
                                title="Remove Row"
                              >
                                <i className="fas fa-minus fa-xs" />
                              </Button>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="3"></td>
                            <td>
                              <strong>Total Cost</strong>
                            </td>
                            <td>{dynamicTableFormControl()}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group as={Row} controlId="Travel">
                    <Col sm={2}>
                      <Form.Label>
                        <strong>Travel</strong>
                      </Form.Label>
                    </Col>
                    <Col sm={4}>
                      <Form.Control
                        size="sm"
                        name="Travel"
                        type="text"
                        value=""
                        placeholder={`[Travel]`}
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group as={Row} controlId="Software">
                    <Col sm={4}>
                      <Form.Label>
                        <strong>Software</strong>
                      </Form.Label>
                    </Col>
                    <Col sm={8}>
                      <Form.Control
                        size="sm"
                        name="Software"
                        type="text"
                        value=""
                        placeholder={`[Software]`}
                      />
                    </Col>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group as={Row} controlId="Sofware Description">
                    <Col sm={4}>
                      <Form.Label>
                        <strong>Sofware Description</strong>
                      </Form.Label>
                    </Col>
                    <Col sm={8}>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="Sofware Description"
                        value=""
                        placeholder={`[Sofware Description]`}
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group as={Row} controlId="Hardware">
                    <Col sm={4}>
                      <Form.Label>
                        <strong>Hardware</strong>
                      </Form.Label>
                    </Col>
                    <Col sm={8}>
                      <Form.Control
                        size="sm"
                        name="Hardware"
                        type="text"
                        value=""
                        placeholder={`[Hardware]`}
                      />
                    </Col>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group as={Row} controlId="Hardware Description">
                    <Col sm={4}>
                      <Form.Label>
                        <strong>Hardware Description</strong>
                      </Form.Label>
                    </Col>
                    <Col sm={8}>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="Hardware Description"
                        value=""
                        placeholder={`[Hardware Description]`}
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group as={Row} controlId="Third Party">
                    <Col sm={4}>
                      <Form.Label>
                        <strong>Third Party</strong>
                      </Form.Label>
                    </Col>
                    <Col sm={8}>
                      <Form.Control
                        size="sm"
                        name="Third Party"
                        type="text"
                        value=""
                        placeholder={`[Third Party]`}
                      />
                    </Col>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group as={Row} controlId="Third Party Description">
                    <Col sm={4}>
                      <Form.Label>
                        <strong>Third Party Description</strong>
                      </Form.Label>
                    </Col>
                    <Col sm={8}>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="Third Party Description"
                        value=""
                        placeholder={`[Third Party Description]`}
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group as={Row} controlId="Risk Reserve">
                    <Col sm={2}>
                      <Form.Label>
                        <strong>Risk Reserve</strong>
                      </Form.Label>
                    </Col>
                    <Col sm={4}>
                      <Form.Control
                        size="sm"
                        name="Risk Reserve"
                        type="text"
                        value=""
                        placeholder={`[Risk Reserve]`}
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group as={Row} controlId="Total Cost with Risk Reserve">
                    <Col sm={2}>
                      <Form.Label>
                        <strong>Total Cost with Risk Reserve</strong>
                      </Form.Label>
                    </Col>
                    <Col sm={4}>
                      <Form.Control
                        size="sm"
                        name="Total Cost with Risk Reserve"
                        type="text"
                        value=""
                        placeholder={`[Total Cost with Risk Reserve]`}
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group as={Row} controlId="EGM">
                    <Col sm={2}>
                      <Form.Label>
                        <strong>EGM</strong>
                      </Form.Label>
                    </Col>
                    <Col sm={4}>
                      <Form.Control
                        size="sm"
                        name="EGM"
                        type="text"
                        value=""
                        placeholder={`[EGM]`}
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group as={Row} controlId="Total Cost">
                    <Col sm={2}>
                      <Form.Label>
                        <strong>Total Cost with EGM</strong>
                      </Form.Label>
                    </Col>
                    <Col sm={4}>
                      <Form.Control
                        size="sm"
                        name="Total Cost with EGM"
                        type="text"
                        value=""
                        placeholder={`[Total Cost with EGM]`}
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Container>
          <Row>
            <Col>
              <Button
                bsPrefix="btn btn-success btn-sm float-right action-button"
                onClick={handleNext}
              >
                Next
              </Button>
              <Button
                bsPrefix="btn btn-success btn-sm float-right mr-2 btn-warning"
                onClick={() => setActiveKey(STANDARD)}
              >
                Previous
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default PricingData;
