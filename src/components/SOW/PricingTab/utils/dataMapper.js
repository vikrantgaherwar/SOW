export const mapDataToArray = (ob) => {
  const arr = [];
  Object.keys(ob).forEach((key) => {
    if (key === "resourceTable") {
      arr.push({
        fieldName: key,
        tableValue: ob[key],
      });
    } else {
      arr.push({
        fieldName: key,
        fieldValue: ob[key],
      });
    }
  });

  return arr;
};
