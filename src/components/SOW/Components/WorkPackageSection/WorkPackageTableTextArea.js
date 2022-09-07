import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
const WorkPackageTableTextArea = ({
  idx,
  childName,

  childIdx,
  isView,
  fieldName,
  value,
  onChange,
  ...rest
}) => {
  const [state, setState] = useState(value);
  const ttRef = useRef();

  const changedRef = useRef();

  useEffect(() => {
    return () => {
      if (ttRef.current) {
        clearTimeout(ttRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setState(value);
  }, [value]);
  useEffect(() => {
    if (changedRef.current) {
      changedRef.current = false;
      if (ttRef.current) {
        clearTimeout(ttRef.current);
      }

      ttRef.current = setTimeout(() => {
        onChange(state, childIdx, idx);
      }, 100);
    }
  }, [state]);
  return (
    <Form.Control
      as="textarea"
      rows={3}
      readOnly={rest.readonly || isView}
      name={fieldName}
      style={{ width: "100%" }}
      value={state}
      onBlur={
        rest.readonly || isView
          ? () => {}
          : () => {
              if (changedRef.current) {
                changedRef.current = false;
                onChange(state, childIdx, idx);
              }
              //   handleTableValueChange(
              //     rest.fieldName,
              //     header.fieldName,
              //     s[header.fieldName],
              //     index
              //   );
            }
      }
      onChange={
        rest.readonly || isView
          ? () => {}
          : (e) => {
              changedRef.current = true;
              //   handleTableBodyChange(header.fieldName, e.target.value, index);
              setState(e.target.value);
            }
      }
    />
  );
};

export default WorkPackageTableTextArea;
