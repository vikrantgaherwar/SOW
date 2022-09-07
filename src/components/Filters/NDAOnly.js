import React, { Fragment } from "react";
import _ from "lodash";
class NDAOnly extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onNDAChange = (e) => {
    var ISNDA = document.getElementById("NDAOnly").checked;
    this.props.onNDAChange(ISNDA);
    this.props.UpdateFilters(false);
  };
  ClearNDAOnly = () => {
    document.getElementById("NDAOnly").checked = !document.getElementById(
      "NDAOnly"
    ).checked;
    this.props.onNDAChange(false);
    this.props.UpdateFilters(true);
  };
  render() {
    return (
      <label className="mb-1 mt-1" style={{ color: "#000" }}>
        <input
          type="checkbox"
          value="checked"
          name="NDAOnly"
          className="mr-2"
          id="NDAOnly"
          style={{ verticalAlign: "middle" }}
          onChange={(e) => {
            this.onNDAChange(e);
          }}
        />
        <i className="fa fa-key mr-1 ml-0 ndadoc"></i>Show NDA Documents Only
      </label>
    );
  }
}
export default NDAOnly;
