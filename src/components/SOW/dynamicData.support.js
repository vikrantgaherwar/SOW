/* get randomNumber for workPkgId*/
export const getRandomWorkPkgID = () =>
  +Math.random().toString().split(".")[1].substring(0, 8);
/* get work package emprty row item */
export const getWorkPackageRowItem = (
  item,
  randomNumber,
  label,
  workPkgRowCount
) => {
  item.workPackageId = randomNumber;
  item.workPackageSectionDataId = item.id;
  item.id = getRandomWorkPkgID();
  if (label) {
    item.sectionName = label.WorkPackageDetailsLbl + ` (${workPkgRowCount})`;
  }
  return item;
};

/* check predefined modules are slected or not and set add button accordingly */
export const checkPredefinedModulesAdd = (value) => {
  if (!value[0]?.typeOfWork) {
    return true;
  }
  return false;
};
/* check predefined modules are slected or not and set remove button accordingly */
export const checkPredefinedModulesRemove = (
  solutionHubData,
  solutionHubSections,
  section,
  workPack
) => {
  if (
    solutionHubData?.length !== workPack?.length &&
    !solutionHubSections[section.id][0]?.typeOfWork
  ) {
    return true;
  }
  return false;
};
/* get rows to be added in SKU table */
export const getSkuTableValue = (
  skuSelectedValue,
  template,
  templateFields
) => {
  const skuChildren = templateFields.filter(
    (child) => child.sectionId === null && child.tableId === template.tableId
  );
  const addSelectedSkuChildrens = skuSelectedValue.map((item1) =>
    skuChildren.map((item2) => {
      if (item2.fieldName === "Service Activity") {
        return {
          ...item2,
          value: item1.value,
          isEditable: false,
        };
      } else {
        return { ...item2 };
      }
    })
  );
  return addSelectedSkuChildrens;
};
