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
      clonedFromTowID: typeOfWork?.id,
      typeOfWork: typeOfWork?.name,
      createdBy: Cookies.get("name"),
      createdDate: moment().toISOString(),
      modifiedBy: Cookies.get("name"),
      modifiedDate: moment().toISOString(),
      userId: Cookies.get("empnumber"),
      domainName: domain.name,
      practiceName: domain.practice,
    },

    sowCustomModulesWorkPackage: state?.workPackages?.map((custom, i) => {
      return {
        id: workPackageId,
        ClonedWorkPkgId: custom[0].workPackageId,
        ClonedTypeOfWorkId: custom[0].typeOfWorkId,
        workPackage: workPackageNames[custom[0].workPackageId],
        typeOfWorkId,
        displayOrder: custom[0].displayOrder,
        createdBy: Cookies.get("name"),
        createdDate: moment().toISOString(),
        modifiedBy: Cookies.get("name"),
        modifiedDate: moment().toISOString(),
        sowCustomModulesData: custom.map((e) => {
          return {
            ...e,
            ClonedSolutionHubDataID: e.id,
            id: 0,
            typeOfWorkId: 0,
            workPackageId: 0,
          };
        }),
      };
    }),
  };
};
