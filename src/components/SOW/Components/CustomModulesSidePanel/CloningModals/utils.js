import Cookies from "js-cookie";
import moment from "moment";

export const customModulesSavePackage = (
  typeOfWork,
  state,
  workPackageNames,
  typeOfWorkId = 0,
  workPackageId = 0,
  domain
) => {
  return {
    sowCustomModulesTypeOfWork: {
      id: typeOfWorkId,
      IsCustTowCloned: true,
      ClonedFrmCustTowId: typeOfWork?.id,
      typeOfWork: typeOfWork?.name,
      createdBy: Cookies.get("name"),
      createdDate: moment().toISOString(),
      modifiedBy: Cookies.get("name"),
      modifiedDate: moment().toISOString(),
      user_Id: Cookies.get("empnumber"),
      domainName: domain.name,
      practiceName: domain.practice,
    },

    sowCustomModulesWorkPackage: state?.workPackages?.map((custom, i) => {
      return {
        id: workPackageId,
        IsCustWrkPkgCloned: true,
        ClonedFrmCustWrkPkgId: custom[0].workPackageId,
        ClonedTypeOfWorkId: custom[0].typeOfWorkId,
        workPackage: workPackageNames[custom[0].workPackageId],
        typeOfWorkId,
        displayOrder: i,
        createdBy: Cookies.get("name"),
        createdDate: moment().toISOString(),
        modifiedBy: Cookies.get("name"),
        modifiedDate: moment().toISOString(),
        sowCustomModulesData: custom.map((e) => {
          if (e.workPackage) {
            delete e.workPackage;
          }
          return {
            ...e,
            clonedSolutionHubDataID: e.id,
            id: 0,
            typeOfWorkId: 0,
            workPackageId: 0,
          };
        }),
      };
    }),
  };
};
