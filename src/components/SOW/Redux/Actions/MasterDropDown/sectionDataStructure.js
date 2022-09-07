let SECTION_DATA_STRUCTURE = [];
let count = 1;

let wpkgId = 10000;

export const resetSectionDataStructure = (name = "Work Package Details") => {
  SECTION_DATA_STRUCTURE = [];
};

export const setSectionDataCount = (cc) => {
  count = cc;
}

const getRandomWorkPkgID = () =>
  +Math.random().toString().split(".")[1].substring(0, 8);

export const resetSectionDataCount = () => {
  count = 0;
};

export const generateBlankSectionTypeOfWork = (
  typeOfWorkName = "General",
  WorkPackages = ["WP1"]
) => {
  const typeOfWorkId = getRandomWorkPkgID();

  const p = WorkPackages.map((k) => {
    const x = generateBlankSectionData().map((e) => {
      e.sectionName = `${typeOfWorkName}-${k}`;
      e.typeOfWork = typeOfWorkName;
      e.workPackage = k;
      e.workPackageId = getRandomWorkPkgID();
      e.typeOfWorkId = typeOfWorkId;
      return e;
    });
    return x;
  });
  return p;
};
export const generateBlankSectionData = (name = "Work Package Details") => {
  // console.log({ generateBlankSectionData: SECTION_DATA_STRUCTURE });
  count++;

  if (
    SECTION_DATA_STRUCTURE &&
    SECTION_DATA_STRUCTURE.length > 1 &&
    SECTION_DATA_STRUCTURE[0].fieldType &&
    SECTION_DATA_STRUCTURE[0].fieldType === "table"
  ) {
    console.log({ SECTION_TABLE: SECTION_DATA_STRUCTURE });
    return SECTION_DATA_STRUCTURE.filter((e) => e.fieldType !== "table").map(
      (e) => ({
        ...e,
        sectionName: `${name} (${count})`,
        workPackageId: e.workPackageId + count,
      })
    );
  } else {
    return SECTION_DATA_STRUCTURE.map((e) => {
      return {
        ...e,
        sectionName: `${name} (${count})`,
        workPackageId: e.workPackageId + count,
      };
    });
  }
};

export const generateBlankExisitingSectionData = (
  name = "Work Package Details"
) => {
  if (
    SECTION_DATA_STRUCTURE &&
    SECTION_DATA_STRUCTURE.length > 1 &&
    SECTION_DATA_STRUCTURE[0].fieldType &&
    SECTION_DATA_STRUCTURE[0].fieldType === "table"
  ) {
    console.log({ SECTION_TABLE: SECTION_DATA_STRUCTURE });
    return SECTION_DATA_STRUCTURE.filter((e) => e.fieldType !== "table").map(
      (e) => ({
        ...e,
        value: e.fieldDefaultValue ?? "",
        sectionName: `${name} (${count})`,
        // workPackageId: e.workPackageId + count,
      })
    );
  } else {
    return SECTION_DATA_STRUCTURE.map((e) => {
      return {
        ...e,
        sectionName: `${name} (${count})`,
        // workPackageId: e.workPackageId + count,
      };
    });
  }
  // const sec = SECTION_DATA_STRUCTURE.map((e) => {
  //   return {
  //     ...e,
  //     id: getRandomWorkPkgID(),
  //     sectionName: `${e.sectionName} (${count})`,
  //   };
  // });
  // return sec;
};

export const resetSectionData = () => {
  SECTION_DATA_STRUCTURE = [];
  count = 0;
};

export const pushSectionDataStructure = (newRow) => {
  SECTION_DATA_STRUCTURE = [...SECTION_DATA_STRUCTURE, { ...newRow }];
};

export default SECTION_DATA_STRUCTURE;
