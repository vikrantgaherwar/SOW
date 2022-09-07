let DYNAMIC_TABLE_STRUCTURE = {};

export const saveTableStructure = (name, value) => {
  DYNAMIC_TABLE_STRUCTURE[name] = value;
};

export const resetDynamicTableStructure = () => {
  DYNAMIC_TABLE_STRUCTURE = {};
};
export const getTableStucture = (tableName) => {
  return { ...DYNAMIC_TABLE_STRUCTURE[tableName] };
};

export default DYNAMIC_TABLE_STRUCTURE;
