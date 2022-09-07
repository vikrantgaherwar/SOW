import React from "react";

class ArchivedDocs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onArchivedDocsChange = (e) => {
    this.props.onArchivedCheckChange(e.target.checked);
    this.props.UpdateFilters(false);
  };

  ClearArchivedDocs = () => {
    this.props.onArchivedCheckChange(false);
    this.props.UpdateFilters(true);
  };

  render() {
    return (
      <>
        <label className="mb-1 mt-1" style={{ color: "#000" }}>
          <input
            type="checkbox"
            value="checked"
            name="archived_result"
            className="mr-2"
            id="archived_result"
            style={{ verticalAlign: "middle" }}
            checked={this.props.value}
            onChange={(e) => {
              this.onArchivedDocsChange(e);
            }}
          />
          <span className="archivedDocs mr-1 ml-0">
            <strong>A</strong>
          </span>
          Include Archived Documents
        </label>
      </>
    );
  }
}

export default ArchivedDocs;
