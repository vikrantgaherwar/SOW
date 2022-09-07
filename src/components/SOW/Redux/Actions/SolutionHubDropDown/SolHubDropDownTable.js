class SolHubDropDownTableSingleton {
  constructor() {
    this.value = {};
  }

  addNewTable = (id, structure) => {
    this.value = { ...this.value, [id]: { ...structure, headers: [] } };
    console.log("table added, now :", this.value);
  };

  addTableColumn = (id, column) => {
    this.value = {
      ...this.value,
      [id]: { ...this.value[id], headers: [...this.value[id].headers, column] },
    };
  };

  resetTables = () => {
    this.value = {};
  };

  getAllTables = () => {
    console.log({ tables: this.value });
  };

  getTableColumns = (tableId) => {
    return this.value[tableId].headers.map((e) => ({
      ...e,
      value: e.fieldDefaultValue ?? "",
    }));
  };
}

const SolHubDropDownTable = new SolHubDropDownTableSingleton();

export default SolHubDropDownTable;
