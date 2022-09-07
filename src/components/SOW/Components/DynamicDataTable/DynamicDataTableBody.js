import { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";

import {
  actionDynamicDataFieldsTableRowRemoved,
  actionDynamicDataFieldsTableValueChanged,
} from "../../Redux/Actions/DynamicDataFields";
import { isTableStateFilled } from "../../Redux/utils/isTableStateFilled";
import { useDispatch } from "react-redux";
import { actionDynamicDataFieldsTableRowAdded } from "../../Redux/Actions/DynamicDataFields";

const DynamicDataTableBody = ({
  values,
  headers,
  handleTableValueChange,
  isView,
  ...rest
}) => {
  const dispatch = useDispatch();
  const [state, setState] = useState(values.map((value) => ({ ...value })));
  const changedRef = useRef({
    name: "",
    value: "",
    id: -1,
  });

  const tt = useRef();

  const handleTableBodyChange = (name, value, index) => {
    changedRef.current = {
      name,
      value,
      id: index,
    };
    setState((prevState) =>
      prevState.map((s, idx) => {
        if (index === idx) {
          return { ...s, [name]: value };
        }
        return s;
      })
    );
  };

  useEffect(() => {
    if (state !== values && changedRef.current.id > -1) {
      if (tt.current) {
        clearTimeout(tt.current);
      }

      tt.current = setTimeout(() => {
        handleTableValueChange(
          rest.fieldName,
          changedRef.current.name,
          changedRef.current.value,
          changedRef.current.id
        );

        changedRef.current = {
          name: "",
          value: "",
          id: -1,
        };
      }, 500);
    }
  }, [state]);

  useEffect(() => {
    setState(values.map((value) => ({ ...value })));
  }, [values]);

  const handleRowRemove = (name, index) => {
    dispatch(actionDynamicDataFieldsTableRowRemoved(name, index));
  };

  return (
    <tbody>
      {state.map((s, index) => (
        <tr key={`table row-${rest.fieldName}-${index}`}>
          {headers.map((header, keyIdx) => (
            <td key={`table row-${rest.fieldName}-${index}-${keyIdx}`}>
              {header["contentControlType"] === "text" ? (
                <Form.Control
                  size="sm"
                  readOnly={header.readonly || isView}
                  className="w-100"
                  key={`${header.fieldName}-${index}-${keyIdx}`}
                  type="text"
                  disabled={s[`${header.fieldName}_isDisabled`] ?? false}
                  value={s[header.fieldName]}
                  name={header.fieldName}
                  onBlur={
                    header.readonly || isView
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
                    header.readonly || isView
                      ? () => {}
                      : (e) =>
                          handleTableBodyChange(
                            header.fieldName,
                            e.target.value,
                            index
                          )
                  }
                />
              ) : header["contentControlType"] === "textarea" ? (
                <Form.Control
                  as="textarea"
                  rows={3}
                  readOnly={header.readonly || isView}
                  name={header.fieldName}
                  style={{ width: "100%" }}
                  value={s[header.fieldName]}
                  onBlur={
                    header.readonly || isView
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
                    header.readonly || isView
                      ? () => {}
                      : (e) => {
                          handleTableBodyChange(
                            header.fieldName,
                            e.target.value,
                            index
                          );
                        }
                  }
                />
              ) : (
                // <TextAreaFormField
                //   style={{ minWidth: "400px" }}
                //   name={key}
                //   noLabel
                //   value={value[key]}
                //   onChange={(_, value) =>
                //     handleTableBodyChange(key, value, index)
                //   }
                // />
                <></>
              )}
            </td>
          ))}
          {/*           
          {Object.keys(value).map((key, keyIdx) => {
            return (
              <td key={`table row-${rest.fieldName}-${index}-${keyIdx}`}>
                {headers[keyIdx]["contentControlType"] === "text" ? (
                  <Form.Control
                    size="sm"
                    className="w-100"
                    key={`${key}-${index}-${keyIdx}`}
                    type="text"
                    disabled={value[`${key}_isDisabled`] ?? false}
                    value={value[key]}
                    name={key}
                    onChange={(e) =>
                      handleTableBodyChange(key, e.target.value, index)
                    }
                  />
                ) : headers[keyIdx]["contentControlType"] === "textarea" ? (
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name={key}
                    style={{ width: "100%" }}
                    value={value[key]}
                    onChange={(e) => {
                      handleTableBodyChange(key, e.target.value, index);
                    }}
                  />
                ) : (
                  // <TextAreaFormField
                  //   style={{ minWidth: "400px" }}
                  //   name={key}
                  //   noLabel
                  //   value={value[key]}
                  //   onChange={(_, value) =>
                  //     handleTableBodyChange(key, value, index)
                  //   }
                  // />
                  <></>
                )}
              </td>
            );
          })} */}

          <td className="d-flex justify-content-center">
            <Button
              bsPrefix="btn btn-success sow-table-header-button btn-sm"
              title="Add Row"
              data-testid="AddTableRow"
              disabled={!isTableStateFilled(values, true) || isView}
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  actionDynamicDataFieldsTableRowAdded(rest.fieldName, index)
                );
              }}
            >
              <i className="fas fa-plus fa-xs" />
            </Button>
            &nbsp;
            <Button
              bsPrefix="btn btn-success new-btn-success btn-sm   pointer"
              title="Remove Row"
              // readOnly={header.readonly}
              disabled={isView}
              onClick={(e) => {
                e.preventDefault();
                handleRowRemove(rest.fieldName, index);
              }}
            >
              <i className="fas fa-minus fa-xs" />
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default DynamicDataTableBody;
