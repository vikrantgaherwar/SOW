import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { actionDynamicDataFieldValueChanged } from "../../Redux/Actions/DynamicDataFields";
import { parseInteger } from "../E3TForm/e3tFormData";
import MyRow from "../MyRow";
import TextAreaFormField from "../TextAreaFormField";

const RadioTable = (props) => {
  const [text, setText] = useState("<p><br/></p>");
  const [showText, setShowText] = useState(false);
  const { data, MsaTextArea, MSAContent } = useSelector((state) => ({
    data: state.dynamicFields.data.sowTemplateFields,
    MsaTextArea: state.dynamicFields.MsaTextArea,
    MSAContent: state.dynamicData["MSA Content"],
  }));
  const dispatch = useDispatch();

  const tt = useRef();

  useEffect(() => {
    setText(MSAContent ?? "<p><br/></p>");
  }, [MSAContent]);

  useEffect(() => {
    const value = parseInteger(props.value);
    const f = data.find((e) => e.id === value && e.fieldName === "MSA");
    if (f) {
      setShowText(true);
    } else {
      setShowText(false);
    }

    // return () => {
    //   if (tt.current) {
    //     clearTimeout(tt.current);
    //   }
    // };
  }, [props.value]);

  // const debounceSave = () => {
  //   if (tt.current) {
  //     clearTimeout(tt.current);
  //   }

  //   tt.current = setTimeout(() => {
  //     dispatch(actionDynamicDataFieldValueChanged("MSA Content", text));
  //   }, 300);
  // };

  const handleChange = (e) => {
    setText(e);
    // debounceSave();
    dispatch(actionDynamicDataFieldValueChanged("MSA Content", e));
  };

  // useEffect(() => {
  //   if (props.headers.length > 0) {
  //     const MSAitem = props.headers.find(
  //       (e) => e.id === parseInteger(props.value)
  //     );
  //     /* if other terms get selected empty MSA field */
  //     if (MSAitem.contentControlTitle !== "MSA") {
  //       dispatch(
  //         actionDynamicDataFieldValueChanged("MSA Content", "<p><br></p>")
  //       );
  //     }
  //     MSA.current = MSAitem;
  //   }
  // }, [props.value]);

  // /* handle single text of MSA change */
  // const handleFieldChange = useCallback((name, value) => {
  //   dispatch(actionDynamicDataFieldValueChanged(name, value));
  // });

  // return (
  //   <MyRow>
  //     <Col>
  //       <Form.Group as={Row} controlId={`form_${props.fieldName}`}>
  //         <Col sm={4}>
  //           <Form.Label>{props.fieldName}</Form.Label>
  //         </Col>
  //         <Col sm={8}>
  //           {props.headers.map(
  //             (header, index) =>
  //               header.contentControlType === "radio" && (
  //                 <Form.Check
  //                   readOnly={props.readonly}
  //                   id={`form_${props.fieldName}_${header.fieldName}`}
  //                   checked={header.id === parseInteger(props.value)}
  //                   type={header.contentControlType}
  //                   key={`${header.fieldName}_${index}`}
  //                   inline
  //                   label={header.fieldName}
  //                   value={header.id}
  //                   onChange={props.readonly ? () => {} : props.onChange}
  //                 />
  //               )
  //           )}
  //         </Col>
  //         &nbsp;
  //         {/* Client agreement - MSA field value */}
  //         {MsaTextArea && MSA.current?.contentControlTitle === "MSA" && (
  //           <TextAreaFormField
  //             name={MsaTextArea.fieldName}
  //             helperText={MsaTextArea.helperText}
  //             value={state[MsaTextArea.fieldName] ?? ""}
  //             readonly={props.readonly}
  //             onChange={(e) => handleFieldChange(MsaTextArea.fieldName, e)}
  //           />
  //         )}
  //       </Form.Group>
  //     </Col>
  //   </MyRow>
  // );

  return (
    <MyRow>
      <Col>
        <Form.Group as={Row} controlId={`form_${props.fieldName}`}>
          <Col sm={2}>
            <Form.Label>
              <strong>{props.fieldName}</strong>
            </Form.Label>
          </Col>
          <Col sm={10}>
            {props.headers.map(
              (header, index) =>
                header.contentControlType === "radio" && (
                  <Form.Check
                    readOnly={props.readonly}
                    id={`form_${props.fieldName}_${header.fieldName}`}
                    checked={header.id === parseInteger(props.value)}
                    type={header.contentControlType}
                    key={`${header.fieldName}_${index}`}
                    inline
                    label={header.fieldName}
                    value={header.id}
                    onChange={props.readonly ? () => {} : props.onChange}
                  />
                )
            )}
          </Col>
          &nbsp;
          {/* Client agreement - MSA field value */}
          {showText && (
            <TextAreaFormField
              name={MsaTextArea.fieldName}
              helperText={MsaTextArea.helperText}
              value={text}
              readonly={props.readonly}
              onChange={handleChange}
            />
          )}
          {/* {MsaTextArea && MSA.current?.contentControlTitle === "MSA" && (
            <TextAreaFormField
              name={MsaTextArea.fieldName}
              helperText={MsaTextArea.helperText}
              value={state[MsaTextArea.fieldName] ?? ""}
              readonly={props.readonly}
              onChange={(e) => handleFieldChange(MsaTextArea.fieldName, e)}
            />
          )} */}
        </Form.Group>
      </Col>
    </MyRow>
  );
};

export default RadioTable;
