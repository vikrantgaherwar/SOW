import Cookies from "js-cookie";
import moment from "moment";
import { parseInteger } from "../../../Components/E3TForm/e3tFormData";

export const makeCustomWorkPackagePacket = (
  typeOfWork,
  workPackage,
  domainData,
  state,
  typeOfWorkId = 0,
  workPackageId = 0,
  isPublished = null,
  displayOrder
) => {
  return {
    sowCustomModulesTypeOfWork: {
      id: parseInteger(typeOfWorkId),
      typeOfWork,
      practiceName: domainData.practice,
      domainName: domainData.domain,
      createdBy: Cookies.get("name"),
      createdDate: moment().toISOString(),
      modifiedBy: Cookies.get("name"),
      modifiedDate: moment().toISOString(),
      user_Id: Cookies.get("empnumber"),
    },
    sowCustomModulesWorkPackage: {
      id: parseInteger(workPackageId),
      workPackage,
      typeOfWorkId: parseInteger(typeOfWorkId),
      createdBy: Cookies.get("name"),
      createdDate: moment().toISOString(),
      modifiedBy: Cookies.get("name"),
      modifiedDate: moment().toISOString(),
      isPublished,
      displayOrder,
    },
    sowCustomModulesData: state,
  };
};

export const makeCustomWorkPackageClonePacket = (
  typeOfWork,
  workPackage,
  domainData,
  state,
  ClonedFrmCustTowId,
  ClonedFrmCustWrkPkgId
) => {
  return {
    sowCustomModulesTypeOfWork: {
      id: ClonedFrmCustTowId,
      ClonedFrmCustTowId,
      typeOfWork,
      practiceName: domainData.practice,
      domainName: domainData.domain,
      createdBy: Cookies.get("name"),
      createdDate: moment().toISOString(),
      modifiedBy: Cookies.get("name"),
      modifiedDate: moment().toISOString(),
      user_Id: Cookies.get("empnumber"),
    },
    sowCustomModulesWorkPackage: [
      {
        id: 0,
        IsCustWrkPkgCloned: true,
        ClonedFrmCustWrkPkgId,
        workPackage,
        createdBy: Cookies.get("name"),
        createdDate: moment().toISOString(),
        modifiedBy: Cookies.get("name"),
        modifiedDate: moment().toISOString(),

        sowCustomModulesData: state.map((s) => ({
          ...s,
          id: 0,
          typeOfWorkId: 0,
          workPackageId: 0,
        })),
      },
    ],
  };
};
