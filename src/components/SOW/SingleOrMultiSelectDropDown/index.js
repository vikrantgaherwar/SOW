import Select from "react-select";

const SingleOrMultiSelectDropDown = ({
  value,
  options,
  handlechange,
  components,
  isMulti,
  name,
  placeholder,
  classNamePrefix,
  menuPlacement,
  customSelectStyles,
}) => {
  return (
    <Select
      required
      menuPlacement={menuPlacement}
      isMulti={isMulti}
      name={name}
      placeholder={placeholder}
      classNamePrefix={classNamePrefix}
      isClearable
      value={value} // set selected values
      isSearchable
      options={options}
      onChange={handlechange}
      styles={customSelectStyles}
      components={components}
    />
  );
};
export default SingleOrMultiSelectDropDown;
