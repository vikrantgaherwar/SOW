import React from "react";
import PropTypes from "prop-types";

const HelperText = ({ displayText }) => {
  return displayText ? (
    <p
      className="text-muted border-top mt-2 pt-2"
      dangerouslySetInnerHTML={{ __html: displayText }}
    />
  ) : null;
};

HelperText.propTypes = {
  displayText: PropTypes.string,
};

export default HelperText;
