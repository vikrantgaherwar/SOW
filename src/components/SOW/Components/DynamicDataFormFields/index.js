import DynamicDataTable from "../DynamicDataTable";
import PageTitle from "../PageTitle";
import RadioTable from "../RadioTable";
import SOWFormFieldRowComponent from "../SOWFormFieldRowComponent";
// import TextAreaFormField from "../TextAreaFormField";
import { useDispatch } from "react-redux";
import { actionDynamicDataFieldValueChanged } from "../../Redux/Actions/DynamicDataFields";
import axios from "axios";
import URLConfig from "../../../URLConfig";
import FontCase from "../../../../img/case.png";
import TextAreaFormField from "../TextAreaFormField";
import { toast } from "react-toastify";
import { useRef, useState } from "react";

const DynamicDataFormFields = (props) => {
  const capitalize = useRef(false);
  const handleFile = async (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      const { type } = files[0];
      if (type.indexOf("image/") > -1) {
        try {
          const url = URLConfig.getURL_SOW_UploadDocument();
          const fileData = new FormData();
          fileData.append("files", files[0]);
          toast.info("file is uploading"); //if file size is large, user may not get anyconfirmation, its just like loader
          const res = await axios.post(url, fileData, {
            headers: {
              "content-type": "multipart/form-data",
            },
          });
          props.handleFieldChange(name, res.data[0]);
          if (res.data) {
            toast.success("file uploaded successfully");
          }
        } catch (err) {
          props.handleFieldChange(name, "");
          console.error(err);
          toast.error("error in uploading file");
        }
      } else {
        props.handleFieldChange(name, "");
        toast.warn("selected file is not an image. only images allowed!");
      }
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
  };

  const handleTextDataChange = (e) => {
    const { name, value } = e.target;
    props.handleFieldChange(name, value);
    // dispatch(actionDynamicDataFieldValueChanged(name, value));
  };

  const handleCamelCaseText = (name) => {
    capitalize.current = !capitalize.current;
    props.handleFieldChange(
      name,
      capitalize.current
        ? props?.state[name]
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.substr(1).toLowerCase())
            .join(" ")
        : props?.state[name].toUpperCase()
    );
  };

  const handleTextAreaChange = (val, name) => {
    props.handleFieldChange(name, val);
    // dispatch(actionDynamicDataFieldValueChanged(name, val));
  };

  // const dispatch = useDispatch();
  const handleTableValueChange = (tableName, fieldName, value, id) => {
    if (props.handleTableValueChange) {
      props.handleTableValueChange(tableName, fieldName, value, id);
    }
  };

  const handleMultiValueChanged = (e) => {
    const { name, value } = e.target;
    props.handleMultipleFieldChange(name, value);
  };

  const displayField = () => {
    if (props.contentControlType === "text") {
      return (
        <SOWFormFieldRowComponent
          title={props.fieldName}
          readonly={
            !props.isView &&
            (props.contentControlTitle === "Consulting Services Price" ||
              props.contentControlTitle === "Travel and Expense Price" ||
              props.contentControlTitle === "Tooling Software Price" ||
              props.contentControlTitle === "Pricing Estimate Cost")
              ? props.resourceTableLength
              : !props.isEditable || props.isView
          }
          type="text"
          helperText={props.helperText}
          name={props.fieldName}
          onChange={handleTextDataChange}
          value={props.value}
          idx={props.id}
          noFullWidth={
            props.contentControlTitle === "Customer Name" ? false : true
          }
          col={props.contentControlTitle === "Customer Name" ? [2, 9] : false}
          buttonTitle={
            <span role="button">
              <img
                src={FontCase}
                width="22px"
                height="22px"
                title="Change Case"
                onClick={() => {
                  handleCamelCaseText(props.fieldName);
                }}
              />
            </span>
          }
          hasIcon={props.contentControlTitle === "Customer Name"}
        />
      );
    } else if (props.contentControlType === "text-dropdown") {
      return (
        <SOWFormFieldRowComponent
          title={props.fieldName}
          noFullWidth
          readonly={!props.isEditable || props.isView}
          type="text-dropdown"
          list={["Days", "Weeks", "Months"]}
          helperText={props.helperText}
          name={props.fieldName}
          onChange={handleMultiValueChanged}
          value={props.value}
          min={0}
          idx={props.id}
        />
      );
    } else if (props.contentControlType === "table") {
      return (
        <DynamicDataTable
          isView={props.isView}
          {...props}
          handleTableValueChange={handleTableValueChange}
        />
      );
    } else if (props.contentControlType === "file") {
      return (
        <SOWFormFieldRowComponent
          title={props.fieldName}
          readonly={!props.isEditable || props.isView}
          type="file"
          helperText={props.helperText}
          onChange={handleFile}
          value={props.value}
          name={props.fieldName}
          idx={props.id}
          // has
          // hasButton
          // onButtonClick={handleUpload}
          // buttonTitle="Upload"
        />
      );
    } else if (props.contentControlType === "date") {
      return (
        <SOWFormFieldRowComponent
          title={props.fieldName}
          readonly={!props.isEditable || props.isView}
          type="date"
          noFullWidth
          helperText={props.helperText}
          name={props.fieldName}
          onChange={handleTextDataChange}
          value={props.value}
          idx={props.id}
        />
      );
    } else if (props.contentControlType === "textarea") {
      return (
        // <></>
        <TextAreaFormField
          name={props.fieldName}
          helperText={props.helperText}
          value={props.value}
          readonly={!props.isEditable || props.isView}
          onChange={
            !props.isEditable || props.isView ? () => {} : handleTextAreaChange
          }
        />
      );
    } else if (props.contentControlType === "radiotable") {
      return (
        <RadioTable
          {...props}
          helperText={props.helperText}
          readonly={props.isView}
          value={props.value}
          onChange={
            props.isView
              ? () => {}
              : (e) => props.handleFieldChange(props.fieldName, e.target.value)
            // dispatch(
            //   actionDynamicDataFieldValueChanged(
            //     props.fieldName,
            //     e.target.value.toString()
            //   )
            // )
          }
        />
      );
    } else if (
      props.contentControlType === "date" ||
      props.contentControlType === "Date"
    ) {
      console.log({ date: props });
      return (
        <SOWFormFieldRowComponent
          title={props.fieldName}
          readonly={!props.isEditable || props.isView}
          type="date"
          noFullWidth
          helperText={props.helperText}
          name={props.fieldName}
          onChange={handleTextDataChange}
          value={props.value}
          idx={props.id}
        />
      );
    }
    console.log({ props });
    return <>ACN</>;
  };

  return (
    <>
      {props.showSection && (
        <PageTitle title={props.sectionDetails.sectionName} small />
      )}
      {displayField()}
    </>
  );
};

export default DynamicDataFormFields;
