import { useCallback } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  actionDynamicDataFieldsWorkPackageTableRowAdded,
  actionDynamicDataFieldsWorkPackageTableRowRemoved,
  actionDynamicDataFieldsWorkPackageTableValueChanged,
} from "../../Redux/Actions/DynamicDataFields";
import { isTableStateFilled } from "../../Redux/utils/isTableStateFilled";
import DynamicDataTable from "../DynamicDataTable";
import MyRow from "../MyRow";
import WorkPackageTableTextArea from "./WorkPackageTableTextArea";

const WorkPackageTable = (props) => {
  const [table, ...headers] = props.data;
  const dispatch = useDispatch();
  const handleTableValueChange = useCallback((state, childId, idx) => {
    dispatch(
      actionDynamicDataFieldsWorkPackageTableValueChanged(
        props.name,
        props.parentId,
        childId,
        idx,
        state
      )
    );
  });

  return (
    <MyRow>
      <Col>
        <Form.Group as={Row}>
          <Col sm={2} className="d-flex flex-row align-items-center">
            <Form.Label>
              <div className="vert-aligned">
                <strong>{table.fieldName}</strong>
              </div>
            </Form.Label>
          </Col>
          <Col sm={10}>
            <>
              <Table bordered size="sm">
                <thead>
                  <tr>
                    {headers.map((header, index) => (
                      <th
                        className="sow-table-header"
                        key={`${header.fieldName}_${index}`}
                      >
                        {header.fieldName}
                      </th>
                    ))}

                    <th className="sow-table-header text-center">
                      <Button
                        bsPrefix="btn btn-success sow-table-header-button btn-sm"
                        title="Add Row"
                        data-testid="AddTableRow"
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(
                            actionDynamicDataFieldsWorkPackageTableRowAdded(
                              props.name,
                              props.parentId
                            )
                          );
                        }}
                        disabled={
                          !isTableStateFilled(
                            table.tableValue[table.tableValue.length - 1],
                            true
                          ) || props.isView
                        }
                      >
                        <i className="fas fa-plus fa-xs" />
                      </Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {table.tableValue.map((row, id) => {
                    return (
                      <tr key={`table_${headers[id]}_${id}`}>
                        {row.map((cell, cellId) => (
                          <td key={`table_${headers[id]}_${id}_${cellId}`}>
                            <WorkPackageTableTextArea
                              childIdx={id}
                              idx={cellId}
                              fieldName={cell.fieldName}
                              {...cell}
                              isView={props.isView}
                              childName={props.name}
                              onChange={handleTableValueChange}
                              //   parentId={props.parentId}
                            />
                            {/* <Form.Control
                              as="textarea"
                              rows={3}
                              readOnly={cell.readonly || props.isView}
                              name={cell.fieldName}
                              style={{ width: "100%" }}
                              value={cell.value}
                              onBlur={
                                cell.readonly || props.isView
                                  ? () => {}
                                  : () => {
                                        handleTableValueChange(
                                          rest.fieldName,
                                          header.fieldName,
                                          s[header.fieldName],
                                          index
                                        );
                                    }
                              }
                              onChange={
                                cell.readonly || props.isView
                                  ? () => {}
                                  : (e) => {
                                        handleTableBodyChange(
                                          header.fieldName,
                                          e.target.value,
                                          index
                                        );
                                    }
                              }
                            /> */}
                          </td>
                        ))}
                        <td className="text-center align-middle">
                          <Button
                            bsPrefix="btn btn-success new-btn-success1 btn-sm   pointer"
                            title="Remove Row"
                            // readOnly={header.readonly}
                            disabled={props.isView}
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(
                                actionDynamicDataFieldsWorkPackageTableRowRemoved(
                                  props.name,
                                  props.parentId,
                                  id
                                )
                              );
                              //   handleRowRemove(rest.fieldName, index);
                            }}
                          >
                            <i className="fas fa-minus fa-xs" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* <DynamicDataTableHeader
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
              /> */}
              </Table>
            </>
            <p
              className="text-muted border-top mt-2 pt-2"
              dangerouslySetInnerHTML={{ __html: props.helperText }}
            />
          </Col>
        </Form.Group>
      </Col>
    </MyRow>
  );
};

export default WorkPackageTable;
