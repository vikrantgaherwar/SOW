import propTypes from "prop-types";

export const IButton = {
  disabled: propTypes.bool,
  classNames: propTypes.string,
  id: propTypes.string,
  onClickFn: propTypes.func,
  title: propTypes.string,
  content: propTypes.any,
};
