import { isTableStateFilled } from "./isTableStateFilled";

export const dynamicDataMapper = (fields, state, sectionId) => {
  const templateFields = fields.sowTemplateFields;
  const tables = {};

  //   const arr

  const someData = templateFields
    .map((field, index) => {
      if (field.sectionId === null && field.tableId === null) {
        return { ...field, value: state[field.fieldName] };
      } else if (field.sectionId === sectionId) {
        return { ...field };
      } else if (field.tableId === null) {
        return { ...field, value: state[field.fieldName] };
      } else if (field.contentControlType === "radiotable") {
        return { ...field, value: state[field.fieldName] };
      } else if (field.contentControlType === "radio") {
        return { ...field };
      } else if (field.contentControlTitle === "MSAContent") {
        return { ...field, value: state[field.fieldName] };
      } else if (
        field.tableId !== null &&
        field.contentControlType !== "table"
      ) {
        const tableId = field.tableId;
        tables[tableId] = tables[tableId] ?? [];
        tables[tableId] = [...tables[tableId], { ...field }];
        return { ...field };
      } else {
        return { ...field, tableValue: [] };
      }
    })
    .map((field) => {
      if (field.contentControlType === "table") {
        const name = field.fieldName;
        const thisStruct = tables[field.tableId];

        const st = state[name];
        // const tempFields = Object.keys(st).map((k) =>
        //   thisStruct.find((e) => e.fieldName.indexOf(k) > -1)
        // );
        // console.log({ name, field, st });
        const val = st
          .filter((e) => isTableStateFilled(e, true))
          .map((e) =>
            [...thisStruct].map((r) => ({ ...r, value: e[r.fieldName] }))
          );

        const newField = {
          ...field,
          tableValue: val,
        };
        // console.log({ val, newField });
        return newField;
      }

      return field;
    });

  return someData;
};
