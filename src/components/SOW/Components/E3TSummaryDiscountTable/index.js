import { batch, useDispatch } from "react-redux";
import {
  actionE3TDiscountChange,
  actionE3TUpdateDynamicData,
  actionE3TValueChanged,
  actionNewE3TCalcNewEGMAndFinalPrice,
  actionNewE3TFixDiscountPercentage,
} from "../../Redux/Actions/E3T";
import {
  calculateDiscount,
  parseFloating,
  parseInteger,
} from "../E3TForm/e3tFormData";
import MyRow from "../MyRow";
import SOWFormFieldComponent from "../SOWFormFieldComponent";
import { REGEX_INTEGERS } from "../../Redux/utils/regex";
import SOWDualValueNumberField from "../SOWDualValueNumberField";
import SOWPriceComponent from "../SOWPriceComponent";
import { useEffect, useRef } from "react";
import { isUndefined } from "lodash";

const E3TSummaryDiscountSection = ({ e3t, isView }) => {
  const dispatch = useDispatch();
  const startRef = useRef(false);

  useEffect(() => {
    const { minPremium } = calculateDiscount(e3t);

    if (parseFloating(e3t.discountPercentage) < parseFloating(minPremium)) {
      batch(() => {
        dispatch(actionE3TValueChanged("discount", "3", true));
        dispatch(actionE3TValueChanged("discountPercentage", minPremium, true));
        if (!isView) {
          dispatch(actionE3TUpdateDynamicData());
        }
      });
    }
  }, [e3t.onsiteTCV, e3t.remoteTCV]);

  const { maxDiscount, maxPremium, minPremium } = calculateDiscount(e3t);

  console.log({ maxDiscount, maxPremium, minPremium });

  // const finalPrice = useMemo(() => {
  //   return (
  //     parseFloating(e3t.onsiteTCV) *
  //     (1 - parseInteger(e3t.discountPercentage) / 100)
  //   );
  // }, [e3t.discountPercentage]);

  // const newEGM = useMemo(() => {
  //   return (
  //     ((finalPrice - parseFloating(e3t.totalCostWithRiskReserve)) /
  //       finalPrice) *
  //     100
  //   );
  // }, [finalPrice, e3t.discountPercentage]);

  // console.log({ finalPrice, newEGM });

  useEffect(() => {
    if (parseFloating(e3t.total) < 100000 && startRef.current === true) {
      dispatch(actionE3TValueChanged("discount", "0.00"));
      dispatch(actionE3TValueChanged("discountPercentage", "0.00"));
      dispatch(actionE3TUpdateDynamicData());
    }
  }, [e3t.total]);

  const tcv =
    parseFloating(e3t.onsiteTCV) > parseFloating(e3t.remoteTCV)
      ? e3t.onsiteTCV
      : e3t.remoteTCV;

  return (
    <>
      <MyRow>
        <SOWPriceComponent
          name="tcv"
          title="Default Price"
          col={[4, 6]}
          value={isUndefined(tcv) ? "0.00" : tcv}
        />
      </MyRow>

      <MyRow>
        <SOWFormFieldComponent
          name="discount"
          title="Discount / Premium Pricing"
          value={e3t.discount}
          onChange={(e) => {
            startRef.current = true;
            dispatch(actionE3TValueChanged("discount", e.target.value));
            dispatch(actionE3TDiscountChange());
            dispatch(actionNewE3TFixDiscountPercentage());
            dispatch(actionNewE3TCalcNewEGMAndFinalPrice());
          }}
          disabled={isView}
          type="select"
          col={[4, 6]}
          dontShowDefaultSelect={parseFloating(minPremium) > 0}
          list={[
            {
              id: "0",
              name: "No Discount",
              disabled: parseFloating(minPremium) > 0,
            },
            {
              id: "1",
              name: "Workload Discount",
              disabled:
                parseInteger(tcv) < 100000 || parseFloating(minPremium) > 0,
            },
            {
              id: "2",
              name: "Volume Discount",
              disabled:
                parseInteger(tcv) < 100000 || parseFloating(minPremium) > 0,
            },
            {
              id: "3",
              name: "Premium Pricing",
            },
          ]}
        />
      </MyRow>
      <MyRow>
        <SOWFormFieldComponent
          name="discountPercentage"
          title={`${e3t.discount === "3" ? "Premium Pricing" : "Discount"} %`}
          value={[e3t.discountPercentage]}
          pattern={REGEX_INTEGERS}
          step={0.01}
          min={e3t.discount === "3" ? minPremium : 0}
          max={e3t.discount === "3" ? maxPremium : maxDiscount}
          onChange={(e) => {
            startRef.current = true;
            // console.log({ val: e.target.value });
            const val = e.target.value;
            if (parseFloating(minPremium) > 0) {
              if (val === "") {
                dispatch(
                  actionE3TValueChanged("discountPercentage", e.target.value)
                );
              } else if (
                parseFloating(val) < parseFloating(e3t.discountPercentage)
              ) {
              } else {
                dispatch(
                  actionE3TValueChanged("discountPercentage", e.target.value)
                );
              }
            } else {
              dispatch(
                actionE3TValueChanged("discountPercentage", e.target.value)
              );
            }

            dispatch(actionNewE3TCalcNewEGMAndFinalPrice());
          }}
          disabled={e3t.discount === "0" ? true : isView ?? false}
          col={[4, 6]}
          type="number"
          // isPercentage
        />
      </MyRow>
      <MyRow>
        <SOWFormFieldComponent
          name="egm"
          title="EGM %"
          //   value={`${(
          //     ((parseFloating(e3t.onsiteTCV) *
          //       (1 - parseInteger(e3t.discountPercentage) / 100) -
          //       parseFloating(e3t.totalCostWithRiskReserve)) /
          //       parseFloating(e3t.onsiteTCV)) *
          //     (1 - parseInteger(e3t.discountPercentage) / 100) *
          //     100
          //   ).toFixed(2)}%`}
          value={[e3t.newEGM]}
          onChange={() => {}}
          step={0.01}
          col={[4, 6]}
          readonly={true}
          //   col={[4, 6]}
          type="number"
          // isPercentage
        />
      </MyRow>

      <MyRow>
        <SOWPriceComponent
          name="finalPrice"
          title="Customer Price"
          value={e3t.finalPrice}
          col={[4, 6]}
        />
      </MyRow>
    </>
  );
};

export default E3TSummaryDiscountSection;
