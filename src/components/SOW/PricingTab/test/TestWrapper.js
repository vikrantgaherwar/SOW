import { useEffect } from "react";
import { useState, useRef } from "react";
import ShowLoading from "../../ModuleSelection/ShowLoading";
import {
  generateBlankState,
  getDefaultResourceTableRow,
} from "../PricingFormFields";
import { parseFloating } from "../PricingFormFields";
import { ddData } from "./testDDData";
import { regionalData } from "./regionalData";
import React from "react";
import PricingTab from "../PricingTab";

const TestWrapper = (props) => {
  const [e3tFormState, setE3TFormState] = useState(generateBlankState());
  const [e3tRegionalData, setE3TRegionalData] = useState([]);
  const [e3TResourceDropDown, setE3TResourceDropDown] = useState([]);
  const e3tFormPreviousState = useRef(generateBlankState());
  const [regionalDataLoaded, setRegionalDataLoaded] = useState(false);
  const [ddDataLoaded, setDDDataLoaded] = useState(false);

  // const [loading, setLoading] = useState(false);
  const e3tFormKeysRef = useRef(
    Object.keys(e3tFormState).filter(
      (k) =>
        [
          "softwareDescription",
          "hardwareDescription",
          "thirdPartyDescrption",
          "resourceTable",
        ].indexOf(k) === -1
    )
  );

  const fetchE3TRegionalData = (country, productLine) => {
    try {
      const res = regionalData;
      setE3TRegionalData(res);
      setRegionalDataLoaded(true);
    } catch (err) {
      console.error( err );
    }
  };

  const fetchE3TResourceDropDown = () => {
    try {
      const res = ddData;
      setE3TResourceDropDown(
        res.map((r) => ({
          id: r.id,
          resourceType: r.resourceType,
        }))
      );
      setDDDataLoaded(true);
    } catch (err) {
      console.error( err );
    }
  };

  useEffect(() => {
    fetchE3TRegionalData("Austrailia", "G4");
    fetchE3TResourceDropDown();
  }, []);

  useEffect(() => {
    const newState = { ...e3tFormState };
    const {
      totalResourceCost,
      hardware,
      software,
      travel,
      thirdParty,
      riskReserve,
      egm,
    } = newState;
    let shouldCalc = false;
    e3tFormKeysRef.current.forEach((k) => {
      if (e3tFormState[k] !== e3tFormPreviousState.current[k]) {
        // do calc
        shouldCalc = true;
      }
    });
    if (shouldCalc) {
      const total =
        parseFloating(totalResourceCost) +
        parseFloating(hardware) +
        parseFloating(software) +
        parseFloating(travel) +
        parseFloating(thirdParty);

      const risk = parseFloating(riskReserve);
      const eg = parseFloating(egm);

      const totalCostWithRiskReserve = total * (1 + risk / 100);
      newState.total = total.toFixed(2);
      newState.totalCostWithRiskReserve = totalCostWithRiskReserve.toFixed(2);

      const tcv = totalCostWithRiskReserve * (1 + eg / 100);
      newState.totalContractValue = tcv.toFixed(2);

      setE3TFormState(newState);
    }
    e3tFormPreviousState.current = { ...newState };
  }, [e3tFormState]);

  useEffect(() => {
    const { resourceTable } = e3tFormState;
    if (resourceTable.length === 0) {
      setE3TFormState((state) => {
        return { ...state, resourceTable: [] };
      });
    }
  }, [e3tFormState.resourceTable]);

  if (ddDataLoaded && regionalDataLoaded) {
    return (
      <PricingTab
        loader={false}
        setActiveKey={(val) => {}}
        formState={e3tFormState}
        setFormState={setE3TFormState}
        resourceDropDownData={e3TResourceDropDown}
        regionalData={e3tRegionalData}
      />
    );
  } else {
    return <ShowLoading />;
  }
};

export default TestWrapper;
