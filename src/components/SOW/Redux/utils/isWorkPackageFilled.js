export const isWorkPackageFilled = (workPackages) => {
  try {
    for (let i = 0; i < workPackages.length; i++) {
      const wp = workPackages[i];
      if (
        wp.value &&
        wp.value.trim().length > 0 &&
        wp.value !== "<p><br></p>"
      ) {
        return true;
      }
    }
    return false;
  } catch (err) {
    return false;
  }
};
