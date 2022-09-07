import React, { Fragment } from "react";
import _ from "lodash";
class DataSource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doc_source: [],
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.doc_source.length !== state.doc_source.length) {
      let data = props.doc_source;
      data = props.doc_source.map((source, index) => {
        return { name: source, checked: false, value: source };
      });
      data = _.sortBy(data, "name");
      return {
        doc_source: data,
        UpdateFilters: props.UpdateFilters,
        default: data,
      };
    }
    return null;
  }
  OnDocSourceChange = (name, checked) => {
    var doc_source = this.state.doc_source.map((source, index) => {
      if (source.name === name) {
        return Object.assign({}, source, {
          checked,
        });
      }
      return source;
    });
    this.setState({ doc_source }, () => {
      this.state.UpdateFilters(false);
      var SelectedSources = this.state.doc_source
        .filter((x) => x.checked == true)
        .map((x) => x.name)
        .join(", ");
      if (
        this.state.doc_source.length ===
        this.state.doc_source.filter((x) => x.checked == true).length
      )
        SelectedSources = "All";
      this.props.OnDocSourceChange(SelectedSources);
    });
  };
  ClearDocSources = () => {
    const DefaultData = this.state.default;
    this.setState({ doc_source: DefaultData }, () => {
      const SelectedSources = this.state.doc_source
        .filter((x) => x.checked == true)
        .map((x) => x.name);
      this.props.OnDocSourceChange("");
      this.state.UpdateFilters(true);
    });
  };
  render() {
    return (
      <Fragment>
        <div className="card">
          <div id="datasourcemain" className="" align="left">
            <h5 className="mb-0 cardbg">
              <button
                type="button"
                data-toggle="collapse"
                data-target="#datasource"
                aria-expanded="false"
                className="btn custom-btn pt-0 pb-0 collapsed"
                aria-controls="datasource"
              >
                DATA SOURCE
              </button>
            </h5>
          </div>

          <div
            id="datasource"
            className="collapse"
            style={{
              maxHeight: "300px",
              overflowX: "hidden",
              overflowY: "auto",
              color: "#000"
            }}
            aria-labelledby="filetype"
            data-parent="#sidefilters"
            aria-expanded="false"
          >
            <div className="selections_container col">
              {this.state.doc_source &&
                this.state.doc_source.map((list, index) => (
                  <div className="row pl-1 pb-1" key={index}>
                    <label className="mb-0 ml-4">
                      <input
                        type="checkbox"
                        value={list.name}
                        checked={list.checked}
                        name="doc_source"
                        className="mr-2"
                        onChange={(e) => {
                          this.OnDocSourceChange(list.name, e.target.checked);
                        }}
                      />
                      {/* Stakeholders ask for removing Cloud and show only Saba : 25/11/2020 : AMS */}
                      {list.name === "Saba Cloud" ? "Saba" : list.name}
                    </label>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default DataSource;
