import { Col, Form, Row, Table } from "react-bootstrap";

import MyRow from "../MyRow";
import DynamicDataTableBody from "./DynamicDataTableBody";
import DynamicDataTableHeader from "./DynamicDataTableHeader";

const DynamicDataTable = (props) => {
  return (
    <>
      <MyRow>
        <Col>
          <Form.Group as={Row}>
            <Col sm={2} className="d-flex flex-row align-items-center">
              <Form.Label>
                <div className="vert-aligned">
                  <strong>{props.fieldName}</strong>
                </div>
              </Form.Label>
            </Col>
            <Col sm={10}>
              <>
                <Table bordered size="sm">
                  <DynamicDataTableHeader
                    headers={props.headers}
                    values={props.value}
                    name={props.fieldName}
                    isView={props.isView}
                  />
                  <DynamicDataTableBody
                    {...props}
                    values={props.value}
                    headers={props.headers}
                    handleTableValueChange={props.handleTableValueChange}
                  />
                </Table>
              </>
              {props.helperText ? (
                <p
                  className="text-muted border-top mt-2 pt-2"
                  dangerouslySetInnerHTML={{ __html: props.helperText }}
                />
              ) : (
                <></>
              )}
            </Col>
          </Form.Group>
        </Col>
      </MyRow>
    </>
  );
};

export default DynamicDataTable;
