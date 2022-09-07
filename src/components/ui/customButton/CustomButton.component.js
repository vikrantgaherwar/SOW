import React, { memo } from "react";
import { IButton } from "../../../interfaces";
import { Button } from "react-bootstrap";

const CustomButton = (props) => {
  /* Destructuring props */
  const { disabled, classNames, id, onClickFn, title, content } = props;
  return (
    <>
      <Button
        disabled={disabled}
        bsPrefix={classNames}
        onClick={onClickFn}
        title={title}
      >
        {content}
      </Button>
    </>
  );
};

/* Props Signature */
CustomButton.propTypes = IButton;

export default memo(CustomButton);
