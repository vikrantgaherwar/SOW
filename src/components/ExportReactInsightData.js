import React from "react";
import { CSVLink } from "react-csv";
export class ExportReactInsightData extends React.Component {
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
      <a
        className="auto-cursor custom-insight-download"
        data-toggle="tooltip"
        title="Export Insights Data"
        onClick={() => {
          console.log("INsights Export");
        }}
      >
        <CSVLink
          data={this.state.csvData}
          filename={this.state.fileName}
          key={Math.random()}
        >
          <i class="fa fa-download "></i>
        </CSVLink>
      </a>
    );
  }
}
