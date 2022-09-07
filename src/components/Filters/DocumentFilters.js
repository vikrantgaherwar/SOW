import React, { Fragment } from "react";
import _ from "lodash";
class DocumentFilters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Disclosure_TO_Hide: ["MULTIMEDIA", "Live-Demonstrations", "DOCUMENT"],
      Disclosure: [],
      file_type: [],
    };
  }
  componentDidMount() {}
  UpdateFilters = () => {
    this.props.UpdateFilters(false);
  };
  static getDerivedStateFromProps(props, state) {
    if (props.Disclosure.length !== state.Disclosure.length) {
      let Disclosure = props.Disclosure;
      Disclosure = props.Disclosure.map((disclosure, index) => {
        return { name: disclosure, checked: false, value: disclosure };
      });
      Disclosure = _.sortBy(Disclosure, "name");
      return {
        Disclosure,
        defaultDisclosure: Disclosure,
        UpdateFilters: props.UpdateFilters,
      };
    }
    if (props.file_type.length !== state.file_type.length) {
      let file_type = props.file_type;
      file_type = props.file_type.map((file, index) => {
        return { name: file, checked: false, value: file };
      });
      file_type = _.sortBy(file_type, "name");
      return {
        UpdateFilters: props.UpdateFilters,
        file_type,
        defaultFileTypes: file_type,
      };
    }
    return null;
  }
  onDisclosureChange = (name, checked) => {
    var Disclosure = this.state.Disclosure.map((source, index) => {
      if (source.name === name) {
        return Object.assign({}, source, {
          checked,
        });
      }
      return source;
    });
    this.setState({ Disclosure }, () => {
      this.state.UpdateFilters(false);
      let SelectedDisclosure = this.state.Disclosure.filter(
        (x) => x.checked == true
      )
        .map((x) => x.name)
        .join(", ");
      if (
        this.state.Disclosure.length ===
        this.state.Disclosure.filter((x) => x.checked == true).length
      )
        SelectedDisclosure = "All";
      this.props.OnDisclouserChange(SelectedDisclosure);
    });
  };
  onFileTypeChange = (name, checked) => {
    var file_type = this.state.file_type.map((source, index) => {
      if (source.name === name) {
        return Object.assign({}, source, {
          checked,
        });
      }
      return source;
    });
    this.setState({ file_type }, () => {
      this.state.UpdateFilters(false);
      let Selected = this.state.file_type
        .filter((x) => x.checked == true)
        .map((x) => x.name)
        .join(", ");
      if (
        this.state.file_type.length ===
        this.state.file_type.filter((x) => x.checked == true).map((x) => x.name)
          .length
      )
        Selected = "All";
      this.props.onFileTypeChange(Selected);
    });
  };
  ClearDocumentFilters = (FilterType) => {
    if (FilterType === "disclosure_level") {
      const DefaultData = this.state.defaultDisclosure;
      this.setState({ Disclosure: DefaultData }, () => {
        this.props.OnDisclouserChange("");
        this.state.UpdateFilters(true);
      });
    } else if (FilterType === "file_type") {
      const file_type = this.state.defaultFileTypes;
      this.setState({ file_type }, () => {
        this.props.onFileTypeChange("");
        this.state.UpdateFilters(true);
      });
    }
  };
  render() {
    const rating = this.props.rating;
    return (
      <Fragment>
        {/* <!-- Main Filter Item 03 Starts --> */}
        <div className="card mb-0" align="left">
          <h5 className="mb-0 cardbg">
            <button
              className="btn custom-btn btn-full pt-0 pb-0 collapsed"
              type="button"
              data-toggle="collapse"
              aria-expanded="false"
              aria-controls="SKUCategory"
              data-target="#document_attributes"
            >
              DOCUMENT ATTRIBUTES
            </button>
          </h5>

          <div
            className="collapse"
            aria-labelledby="headingHPSE"
            data-parent="#sidefilters"
            aria-expanded="false"
            id="document_attributes"
          >
            <div className="card-body ml-1 mr-0 mt-2">
              <div
                className="collapse show"
                aria-labelledby="headingHPSE"
                data-parent="#accordionExample"
                aria-expanded="false"
                id="document_filter_categories"
              >
                <div className="card-body ml-1 mr-1 mt-2">
                  <div className="accordion" id="accordionSERCategories">
                    {/* <div className="card" align="left">
                                  <h5 className="mb-0 in-flex cardBorder">
                                      <button className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed" type="button" data-toggle="collapse" aria-expanded="false" aria-controls="rating" data-target="#rating">Rating                                
                                      </button>
                                  </h5>
                                  <div className="collapse" aria-labelledby="headingHPSE" data-parent="#document_attributes" id="rating" aria-expanded="false">
                                  <div className="selections_container col pr-1">
                                      {rating !==undefined && rating.length >0 && rating.indexOf("0") !== -1 &&
                                      <div className="row pl-3 pb-1">
                                          <label className="mb-0">
                                          <p className="mb-0">
                                          <input type="checkbox" name="rating" value="0" className="mr-2" onClick={()=>{this.UpdateFilters()}}/>
                                              
                                                  <i className="far fa-star txt-selective-yellow font11"></i>
                                                  <i className="far fa-star txt-selective-yellow font11"></i>
                                                  <i className="far fa-star txt-selective-yellow font11"></i>
                                                  <i className="far fa-star txt-selective-yellow font11"></i>
                                                  <i className="far fa-star txt-selective-yellow font11"></i>
                                              </p>
                                              </label>
                                      </div>
                                     }
                                     {rating !==undefined && rating.length >0 && rating.indexOf("1") !== -1 &&
                                      <div className="row pl-3 pb-1">
                                          <input type="checkbox" name="rating" value="1" className="mr-2" onClick={()=>{this.UpdateFilters()}}/>
                                          <div className="font11">
                                            <i className="far fa-star txt-selective-yellow font11"></i>
                                            <i className="far fa-star txt-selective-yellow font11"></i>
                                            <i className="far fa-star txt-selective-yellow font11"></i>
                                            <i className="far fa-star txt-selective-yellow font11"></i>
                                            <i className="far fa-star font11 "></i>
                                          </div>
                                      </div>
                                    }
                                    {rating !==undefined && rating.length >0 && rating.indexOf("2") !== -1 &&
                                      <div className="row pl-3 pb-1">
                                          <input type="checkbox" name="rating" value="2" className="mr-2" onClick={()=>{this.UpdateFilters()}}/>
                                          <div className="font11">
                                            <i className="far fa-star txt-selective-yellow font11"></i>
                                            <i className="far fa-star txt-selective-yellow font11"></i>
                                            <i className="far fa-star txt-selective-yellow font11"></i>
                                            <i className="far fa-star font11 "></i>
                                            <i className="far fa-star font11 "></i>
                                          </div>
                                      </div>
                                    }
                                    {rating !==undefined && rating.length >0 && rating.indexOf("3") !== -1 &&
                                      <div className="row pl-3 pb-1">
                                          <input type="checkbox" name="rating" value="3" className="mr-2" onClick={()=>{this.UpdateFilters()}}/>
                                          <div className="font11">
                                            <i className="far fa-star txt-selective-yellow font11"></i>
                                            <i className="far fa-star  txt-selective-yellow font11"></i>
                                            <i className="far fa-star font11"></i>
                                            <i className="far fa-star font11 "></i>
                                            <i className="far fa-star font11"></i>
                                          </div>
                                      </div>
                                     }
                                     {rating !==undefined && rating.length >0 && rating.indexOf("4") !== -1 &&
                                      <div className="row pl-3 pb-1">
                                          <input type="checkbox" name="rating" value="4" className="mr-2" onClick={()=>{this.UpdateFilters()}}/>
                                          <div className="font11">
                                            <i className="far fa-star txt-selective-yellow "></i>
                                            <i className="far fa-star "></i>
                                            <i className="far fa-star  "></i>
                                            <i className="far fa-star  "></i>
                                            <i className="far fa-star  "></i>
                                          </div>
                                      </div>      
                                    }                        
                                  </div>
                              </div>
                              </div> */}

                    <div
                      className="card mb-1"
                      align="left"
                      style={{
                        maxHeight: "300px",
                        overflowX: "hidden",
                        overflowY: "auto",
                        color: "#000",
                      }}
                    >
                      <h5 className="mb-0 ml-2 in-flex cardBorder">
                        <button
                          className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed"
                          type="button"
                          data-toggle="collapse"
                          aria-expanded="false"
                          aria-controls="disclosure_level"
                          data-target="#disclosure_level"
                        >
                          Disclosure Level
                        </button>
                      </h5>

                      <div
                        className="collapse"
                        data-parent="#document_attributes"
                        id="disclosure_level"
                        aria-expanded="false"
                      >
                        <div className="selections_container col">
                          {this.state.Disclosure !== undefined &&
                            this.state.Disclosure.map((value, index) => (
                              <Fragment key={index}>
                                {this.state.Disclosure_TO_Hide.indexOf(
                                  value.name
                                ) === -1 && (
                                  <div className="row pl-3 pb-1" key={index}>
                                    <label className="mb-0 ml-2">
                                      <input
                                        type="checkbox"
                                        name="disclosure_level"
                                        checked={value.checked}
                                        onChange={(e) => {
                                          this.onDisclosureChange(
                                            value.name,
                                            e.target.checked
                                          );
                                        }}
                                        value={value.name}
                                        className="mr-2"
                                        onClick={() => {
                                          this.UpdateFilters();
                                        }}
                                      />
                                      {value.name}
                                    </label>
                                  </div>
                                )}
                              </Fragment>
                            ))}
                        </div>
                      </div>
                    </div>

                    <div
                      className="card mb-1 overflowStyle2"
                      align="left"
                      style={{ color: "#000" }}
                    >
                      <h5 className="mb-0 ml-2 in-flex cardBorder">
                        <button
                          className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed"
                          type="button"
                          data-toggle="collapse"
                          aria-expanded="false"
                          aria-controls="document_type"
                          data-target="#document_type"
                        >
                          Document Type
                        </button>
                      </h5>
                      <div
                        className="collapse"
                        aria-labelledby="headingHPSE"
                        data-parent="#document_attributes"
                        id="document_type"
                        aria-expanded="false"
                      >
                        <div className="selections_container col">
                          {this.state.file_type !== undefined &&
                            this.state.file_type.map((value, index) => (
                              <Fragment key={index}>
                                {value !== undefined &&
                                  value !== null &&
                                  value !== "" && (
                                    <div className="row pl-3 pb-1">
                                      <label className="mb-0 ml-2">
                                        <input
                                          type="checkbox"
                                          name="file_type"
                                          value={value.name}
                                          className="mr-2"
                                          checked={value.checked}
                                          onChange={(e) => {
                                            this.onFileTypeChange(
                                              value.name,
                                              e.target.checked
                                            );
                                          }}
                                        />
                                        {value.name}
                                      </label>
                                    </div>
                                  )}
                              </Fragment>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Main Filter Item 03 Ends --> */}
      </Fragment>
    );
  }
}
export default DocumentFilters;
