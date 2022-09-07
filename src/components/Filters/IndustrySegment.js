import React, { Fragment } from "react";
import _ from "lodash";
class IndustrySegment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        industry_segment: [],
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.industry_segment.length !== state.industry_segment.length) {
      let data = props.doc_source;
      data = props.industry_segment.map((source, index) => {
        return { name: source, checked: false, value: source };
      });
      data = _.sortBy(data, "name");
      return {
        industry_segment: data,
        UpdateFilters: props.UpdateFilters,
        default: data,
      };
    }
    return null;
  }
  OnIndustrySegmentChange = (name, checked) => {
    var industry_segment = this.state.industry_segment.map((source, index) => {
      if (source.name === name) {
        return Object.assign({}, source, {
          checked,
        });
      }
      return source;
    });
    this.setState({ industry_segment }, () => {
      this.state.UpdateFilters(false);
      var SelectedSources = this.state.industry_segment
        .filter((x) => x.checked == true)
        .map((x) => x.name)
        .join(", ");
      if (
        this.state.industry_segment.length ===
        this.state.industry_segment.filter((x) => x.checked == true).length
      )
        SelectedSources = "All";
      this.props.OnIndustrySegmentChange(SelectedSources);
    });
  };
  ClearIndustrySegment = () => {
    const DefaultData = this.state.default;
    this.setState({ industry_segment: DefaultData }, () => {
      const SelectedSources = this.state.industry_segment
        .filter((x) => x.checked == true)
        .map((x) => x.name);
      this.props.OnIndustrySegmentChange("");
      this.state.UpdateFilters(true);
    });
  };
  render() {
    return (
      <Fragment>
        <div className="card">
          <div id="industrysegmentmain" className="" align="left">
            <h5 className="mb-0 cardbg">
              <button
                type="button"
                data-toggle="collapse"
                data-target="#industrysegment"
                aria-expanded="false"
                className="btn custom-btn pt-0 pb-0 collapsed"
                aria-controls="industrysegment"
              >
                INDUSTRY SEGMENT
              </button>
            </h5>
          </div>

          <div
            id="industrysegment"
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
              {this.state.industry_segment &&
                this.state.industry_segment.map((list, index) => (
                  <div className="row pl-1 pb-1" key={index}>
                    <label className="mb-0 ml-4">
                      <input
                        type="checkbox"
                        value={list.name}
                        checked={list.checked}
                        name="industry_segment"
                        className="mr-2"
                        onChange={(e) => {
                          this.OnIndustrySegmentChange(list.name, e.target.checked);
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
export default IndustrySegment;
