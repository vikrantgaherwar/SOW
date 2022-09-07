import { isNumber, isString } from "lodash";

export const isResourceTableFilled = (row) => {
  try {
    const keys = Object.keys(row);
    const filtered = keys.filter((e) => e !== "remote" && e !== "sdt");
    const val = filtered.some(
      (e) =>
        (isNumber(row[e]) && row[e] !== -999 && row[e] !== 0) ||
        (isString(row[e]) && row[e].trim().length === 0)
    );
    console.log(val);
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const isTableStateFilled = (row, weak) => {
  try {
    if (row === undefined) {
      return false;
    }

    // if(isTable){
    //   return row.some(e => Object.value(e).)
    // }

    // else
    if (Array.isArray(row)) {
      // console.log({ row });
      // console.log({ row });
      if (row && row[0] && row[0].fieldType && row[0].fieldType === "table") {
        const ob = row[0].tableValue;
        const val = ob.some((arr) => {
          const inner = arr.some(
            (e) => e.value.trim().length > 0 && arr.value !== "<p><br></p>"
          );
          // console.log({ arr, inner });
          return inner;
        });

        return val;
      } else {
        if (row && row[0] && row[0].value) {
          const val = row.some(
            (arr) => arr.value.trim().length > 0 && arr.value !== "<p><br></p>"
          );
          return val;
        } else {
          return row.every((ob) =>
            Object.values(ob).some((v) => v && v.trim().length > 0)
          );
        }
      }
    } else {
      let values = [];
      Object.keys(row).forEach((key) => {
        if (key.indexOf("isDisabled") === -1) {
          values = [...values, row[key]];
        }
      });

      for (let i = 0; i < values.length; i++) {
        const val = values[i];

        if (
          (isNumber(val) && val !== -999) ||
          (isString(val) && val.trim().length > 0)
        ) {
          if (weak) {
            return true;
          }
        } else {
          if (!weak) {
            return false;
          }
        }
      }
      return weak ? false : true;
    }
  } catch (err) {
    console.log({ row, weak });
    console.log(err);
    return false;
  }
};
