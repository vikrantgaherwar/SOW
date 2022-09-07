import React from "react";
import { CSVLink } from "react-csv";
export class ExportReactCSVData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csvData: [],
      fileName: "",
      title: "",
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.csvData.length != state.csvData.length) {
      return {
        csvData: props.csvData,
        fileName: props.fileName,
        title: props.title,
      };
    }
    return null;
  }
  render() {
    const csvData = this.state.csvData;
    const fileName = this.state.fileName;
    const title = this.state.title;
    return (
      <button className="btn btn-sm btn-success mb-1 exp-link float-right">
        <CSVLink
          data={this.state.csvData}
          filename={this.state.fileName}
          key={Math.random()}
        >
          <i class="fas fa-file-export pr-1"></i>
          {title ? title : "Export"}
        </CSVLink>
      </button>
    );
  }
}
