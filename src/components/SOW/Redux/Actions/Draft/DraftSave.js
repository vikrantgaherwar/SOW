import Cookies from "js-cookie";
import { flattenDeep, groupBy, isNumber, map } from "lodash";
import {
  isRecordFilled,
  parseFloating,
  parseInteger,
} from "../../../Components/E3TForm/e3tFormData";
import { dynamicDataMapper } from "../../utils/dynamicDataMapper";
import { e3tMapDataToArray } from "../../utils/e3tDataMapper";
import { APIFetchStatus } from "../../utils/fetchStatus";
import moment from "moment";
// import { parseFloating, parseInteger } from "../../../PricingTab/PricingFormFields";

export const getDraftData = (name, state) => {
  const packet = getNewDraftPacket(state.masterData.sowTemplate, state);

  switch (name) {
    case "DRAFT_CUSTOMER": {
      packet.standardField = getCustomerDataPacket(state);
      const {
        sowTemplateField,
        solutionHubData,
        customModuleSelectedValue,
        predefinedModuleSelectedValue,
        customModulesData,
      } = getDynamicDataPacket(state);
      packet.sowTemplateField = sowTemplateField;
      packet.solutionHubData = solutionHubData;
      packet.customModuleSelectedValue = customModuleSelectedValue;
      packet.predefinedModuleSelectedValue = predefinedModuleSelectedValue;
      packet.customModulesData = customModulesData;
      packet.e3tFormState = getE3TDataPacket(state);
      break;
    }

    case "DRAFT_COSTING": {
      packet.standardField = getCustomerDataPacket(state);
      const {
        sowTemplateField,
        solutionHubData,
        customModuleSelectedValue,
        predefinedModuleSelectedValue,
        customModulesData,
      } = getDynamicDataPacket(state);
      packet.sowTemplateField = sowTemplateField;
      packet.solutionHubData = solutionHubData;
      packet.customModuleSelectedValue = customModuleSelectedValue;
      packet.predefinedModuleSelectedValue = predefinedModuleSelectedValue;
      packet.customModulesData = customModulesData;
      packet.e3tFormState = getE3TDataPacket(state);
      break;
    }

    case "DRAFT_DYNAMIC_DATA": {
      packet.standardField = getCustomerDataPacket(state);
      const {
        sowTemplateField,
        solutionHubData,
        customModuleSelectedValue,
        predefinedModuleSelectedValue,
        customModulesData,
      } = getDynamicDataPacket(state);
      packet.sowTemplateField = sowTemplateField;
      packet.solutionHubData = solutionHubData;
      packet.customModuleSelectedValue = customModuleSelectedValue;
      packet.predefinedModuleSelectedValue = predefinedModuleSelectedValue;
      packet.customModulesData = customModulesData;
      packet.e3tFormState = getE3TDataPacket(state);

      break;
    }

    case "DRAFT_SUMMARY": {
      packet.standardField = getCustomerDataPacket(state);
      const {
        sowTemplateField,
        solutionHubData,
        customModuleSelectedValue,
        predefinedModuleSelectedValue,
        customModulesData,
      } = getDynamicDataPacket(state);
      packet.sowTemplateField = sowTemplateField;
      packet.solutionHubData = solutionHubData;
      packet.customModuleSelectedValue = customModuleSelectedValue;
      packet.predefinedModuleSelectedValue = predefinedModuleSelectedValue;
      packet.customModulesData = customModulesData;
      packet.e3tFormState = getE3TDataPacket(state);
      break;
    }

    default:
      packet.standardField = getCustomerDataPacket(state);
  }

  return packet;
};

export const getPageType = (url = "") => {
  const split = url.split("/");
  const last = split[split.length - 1].toLowerCase();
  if (last.indexOf("dynamic") > -1) {
    return "DRAFT_DYNAMIC_DATA";
  } else if (last.indexOf("e3t") > -1) {
    return "DRAFT_COSTING";
  } else if (last.indexOf("summary") > -1) {
    return "DRAFT_SUMMARY";
  } else {
    return "DRAFT_CUSTOMER";
  }
};

const getNewDraftPacket = (templateId, state) => {
  return {
    id: isNumber(templateId) ? templateId : parseInteger(templateId),
    templateInputName:
      state.draft.pagePostFetchState === APIFetchStatus.FETCHED
        ? state.draft.pagePostData?.templateOutputName
        : "",
    templateInputPath:
      state.draft.pagePostFetchState === APIFetchStatus.FETCHED
        ? state.draft.pagePostData?.templateOutputPath
        : "",
    createdBy: Cookies.get("name"),
    userId: Cookies.get("empnumber"),
    createdDate: moment().toISOString(),
    modifiedBy: Cookies.get("name"),
    modifiedDate: moment().toISOString(),
    sowGeneratedId:
      state.draft.pagePostFetchState === APIFetchStatus.FETCHED
        ? state.draft.pagePostData?.id
        : null,
    isCloned: false,
  };
};

export const getCustomerDataPacket = (state) => {
  const selectedCountry = state.masterDropDown?.countryDropDownData?.find(
    (m) => m.id === state.masterData.country
  );

  return {
    business: state.masterData.business,
    contractTerm: state.masterData.contractTerms,
    revenueRecognition: state.masterData.revRecog,
    oppId: state.masterData.oppId,
    accountName: state.customerData.accountName,
    geo: state.customerData.geo,
    countryName: state.customerData.countryName,
    country: selectedCountry.name,
    countryCode: state.masterData.country,
    businessName: state.customerData.businessName,
    salesStage: state.customerData.salesStage,
    winLossReason: state.customerData.winLossReason ?? "",
    productLine: state.customerData.productLine,
    sowTemplate: state.masterData.sowTemplate,
    SKU: JSON.stringify(state.customerData.sku),
  };
};
export const getE3TDataPacket = (state) => {
  const { e3t } = state;
  const remoteHours = parseFloating(
    e3t.resourceTable
      .reduce(
        (total, e) =>
          e.remote === "Yes" ? total + parseFloating(e.projectDuration) : total,
        0.0
      )
      .toFixed(2)
  );

  const totalHours = parseFloating(
    e3t.resourceTable
      .reduce((total, e) => total + parseFloating(e.projectDuration), 0.0)
      .toFixed(2)
  );
  const deliveryMix = (((remoteHours / totalHours) * 100) | 0).toFixed(2);

  const otherCosts = (
    parseFloating(e3t.travel) +
    parseFloating(e3t.hardware) +
    parseFloating(e3t.software) +
    parseFloating(e3t.thirdParty)
  ).toFixed(2);

  const riskTable = e3t.resourceTable
    .filter((e) => e.riskRating === "Medium" || e.riskRating === "High")
    .reduce((arr, curr) => {
      if (
        arr.findIndex(
          (e) =>
            e.typeOfWorkId === curr.typeOfWorkId &&
            e.workPackageId === curr.workPackageId
        ) === -1
      ) {
        return [...arr, curr];
      }
      return [...arr];
    }, []);

  const skills = flattenDeep(
    map(
      groupBy(
        e3t.resourceTable
          .filter((e) => isRecordFilled(e))
          .map((e) => {
            if (e.remote === "Yes") {
              const sdtOb = state.e3tData.e3tRemoteSTDs.find(
                (k) => k.id === e.sdt
              );
              return { ...e, sdt: sdtOb.sdtLookup };
            } else {
              return { ...e, sdt: state.e3tData.e3tRegionalData[0]?.sdt };
            }
          }),
        (e) => e.sdt
      )
    ).map((e) =>
      Object.values(
        e.reduce((prev, curr) => {
          const newPrev = { ...prev };
          if (newPrev[curr.resourceType]) {
            newPrev[curr.resourceType].hours = (
              parseFloating(newPrev[curr.resourceType].hours) +
              parseFloating(curr.projectDuration)
            ).toString();
            newPrev[curr.resourceType].cost = (
              parseFloating(newPrev[curr.resourceType].cost) +
              parseFloating(curr.cost)
            ).toFixed(2);
          } else {
            const ob = {
              sdt: curr.sdt,
              resourceType: curr.resourceType,
              hours: curr.projectDuration,
              cost: curr.cost,
            };
            newPrev[curr.resourceType] = ob;
          }
          return newPrev;
        }, {})
      )
    )
  ).map(({ sdt, hours, ...rest }) => ({
    ...rest,
    sdtName: sdt,
    projectDuration: hours,
  }));

  const totalH = skills.reduce((ob, curr) => {
    let t = parseFloating(ob[curr.sdtName]);
    return {
      ...ob,
      [curr.sdtName]: t + parseFloating(curr.projectDuration),
    };
  }, {});

  const totalC = skills.reduce((ob, curr) => {
    let t = parseFloating(ob[curr.sdtName]);
    return {
      ...ob,
      [curr.sdtName]: t + parseFloating(curr.cost),
    };
  }, {});

  const skillsTable = skills.map((e) => ({
    ...e,
    totalHours: totalH[e.sdtName].toFixed(2),
    totalCost: totalC[e.sdtName].toFixed(2),
  }));

  let discountDescription;
  if (e3t.discount === "1") {
    discountDescription = "Workload Discount";
  } else if (e3t.discount === "2") {
    discountDescription = "Volume Discount";
  } else if (e3t.discount === "3") {
    discountDescription = "Premium Pricing";
  } else {
    discountDescription = "No Discount";
  }

  return e3tMapDataToArray(
    {
      ...e3t,
      remoteDeliveryMix: deliveryMix,
      otherCosts,
      riskTable,
      skillsTable,
      discountDescription,
    },
    state.e3tData.e3tRegionalData[0]?.fx,
    state.e3tData.e3tFxRates
  );
};

export const getDynamicDataPacket = (state) => {
  const { sectionId } =
    state.masterDropDown.workPackageSectionData.length > 0
      ? state.masterDropDown.workPackageSectionData[0]
      : state.masterDropDown.workPackageSectionData;

  const { data: dynamicFields } = { ...state.dynamicFields };
  const { selectedWorkPackages } = state.moduleSidePanel;
  const { selectedWorkPackages: customSelectedWorkPackages } =
    state.customModuleSidePanel;

  dynamicFields.sowTemplateField = dynamicDataMapper(
    dynamicFields,
    state.dynamicData,
    sectionId
  );

  const f = dynamicFields.sowTemplateFields.find(
    (e) => e.sectionId === sectionId
  );
  const name = f?.fieldName;

  const wp = name
    ? state.dynamicData[name]
        .map((e) => {
          if (e[0]?.fieldType === "table") {
            return e.map((row) => {
              if (row.fieldType === "table") {
                return { ...row };
              }
              return row;
            });
          }
          return e;
        })
        .flat()
        .map((e, idx) => ({ ...e, displayOrder: idx }))
    : [];

  dynamicFields.solutionHubData = wp.filter((e) => !e.sectionName);

  dynamicFields.customModulesData = wp.filter((e) => e.sectionName);

  dynamicFields.predefinedModuleSelectedValue =
    JSON.stringify(selectedWorkPackages);

  dynamicFields.customModuleSelectedValue = JSON.stringify(
    customSelectedWorkPackages
  );

  return dynamicFields;
};
