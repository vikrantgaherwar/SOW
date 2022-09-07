import { useSelector } from "react-redux";
import { parseFloating } from "../E3TForm/e3tFormData";
import SOWDualValueNumberField from "../SOWDualValueNumberField";
import SOWFormFieldComponent from "../SOWFormFieldComponent";

const SOWPriceComponent = ({
  idx,
  name,
  title,
  value,
  id,
  onChange,
  required,
  readonly,
  list,
  type,
  fullWidth,
  helperText,

  form,
  hasButton,
  disabled,
  min,
  max,
  step,
  onButtonClick,
  onBlur,
  hasSelectData,
  selectData,
  bsPrefix,
  buttonTitle,
  buttonDisabled,
  col,
  noFullWidth,
  isPercentage,
}) => {
  const { fxRates, fx } = useSelector((state) => ({
    fxRates: state.e3tData.e3tFxRates,
    fx: state.e3tData.e3tRegionalData[0].fx,
  }));

  const f = fxRates.find((e) => e.isocode === fx);
  const rate = f
    ? f?.baseCurrencyAccountingRate === "USD"
      ? f?.accountingRates1
      : f?.accountingRates2
    : 1;

  const usd = (parseFloating(value) / rate).toFixed(2);
  //   console.log({ value, fx, usd });

  if (fx === "USD") {
    return (
      <SOWFormFieldComponent
        name={name}
        title={title}
        value={`${value} (${fx})`}
        type="text"
        readonly
        col={col}
      />
    );
  }
  return (
    <SOWDualValueNumberField
      name={name}
      title={title}
      col={col}
      values={[`${fx} ${value}`, `USD ${usd}`]}
    />
  );
};

export default SOWPriceComponent;
