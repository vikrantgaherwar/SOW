import propTypes from "prop-types";

export const ITextField = {
  disabled: propTypes.bool,
  classNames: propTypes.string,
  id: propTypes.string,
  size: propTypes.string,
  onChangeFn: propTypes.func,
  fieldName: propTypes.string,
  value: propTypes.any,
  type: propTypes.string,
  placeholder: propTypes.string,
};
