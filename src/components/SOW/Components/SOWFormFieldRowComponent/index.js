import MyRow from "../MyRow";
import SOWFormFieldComponent from "../SOWFormFieldComponent";

const SOWFormFieldRowComponent = ({
  idx,
  name,
  title,
  value,
  onChange,
  list,
  id,
  readonly,
  disabled,
  required,
  hasButton,
  onButtonClick,
  hasSelectData,
  helperText,
  selectData,
  fullWidth,
  buttonTitle,
  type,
  bsPrefix,
  buttonDisabled,
  noFullWidth,
  errorText,
  col,
  hasIcon,
}) => (
  <MyRow>
    <SOWFormFieldComponent
      hasIcon={hasIcon}
      col={col}
      noFullWidth={noFullWidth}
      idx={idx}
      id={id}
      name={name}
      title={title}
      readonly={readonly}
      required={required ?? false}
      value={value}
      disabled={disabled}
      onChange={onChange}
      helperText={helperText}
      hasButton={hasButton}
      onButtonClick={onButtonClick}
      buttonTitle={buttonTitle}
      hasSelectData={hasSelectData}
      selectData={selectData}
      type={type}
      list={list}
      fullWidth={fullWidth ?? false}
      bsPrefix={bsPrefix}
      buttonDisabled={buttonDisabled}
      errorText={errorText}
    />
  </MyRow>
);

export default SOWFormFieldRowComponent;
