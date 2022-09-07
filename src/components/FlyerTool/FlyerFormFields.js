import React from "react";
import { Form } from "react-bootstrap";

const FlyerFormFields = ({
  field,
  disableAction,
  contactDetails,
  setContactDetails,
}) => {
  const handleChange = (event) => {
    setContactDetails((prevContactDetails) => ({
      ...prevContactDetails,
      [event.target.name]: event.target.value,
    }));
  };

  const customSelectStyles = {
    option: (base) => ({
      ...base,
      overflowX: "hidden",
    }),
  };

  return (
    <>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>{field?.title}</Form.Label>
        {field?.type === "text" ? (
          <Form.Control
            size="sm"
            type={field?.type}
            name={field?.name}
            disabled={disableAction}
            placeholder={field?.placeholder}
            required={field?.required}
            value={contactDetails[field?.name] || ""}
            onChange={(e) => handleChange(e)}
          />
        ) : field?.type === "email" ? (
          <Form.Control
            size="sm"
            type={field?.type}
            name={field?.name}
            disabled={disableAction}
            placeholder={field?.placeholder}
            required={field?.required}
            value={contactDetails[field?.name] || ""}
            onChange={(e) => handleChange(e)}
          />
        ) : field?.type === "textarea" ? (
          <Form.Control
            size="sm"
            as="textarea"
            name={field?.name}
            placeholder={field?.placeholder}
            required={field?.required}
            rows={field?.rows}
            maxLength={field?.maxLength}
            disabled={disableAction}
            value={contactDetails[field?.name] || ""}
            onChange={(e) => handleChange(e)}
          />
        ) : (
          <></>
        )}
      </Form.Group>
    </>
  );
};

export default FlyerFormFields;
