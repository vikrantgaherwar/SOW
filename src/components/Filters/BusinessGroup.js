import React, { Fragment } from "react";
class BusinessGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      service_type: [],
      recommended_by: [],
      alligned_initiative: [],
      isAllServicesSelected: false,
      isAllRecommendedSelected: false,
      isAllInitiativeSelected: false,
      AllBGIndeterminate: false,
      AllServiceIndeterminate: false,
      AllRecommendedIndeterminate: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.service_type.length !== state.service_type.length ||
      props.recommended_by.length !== state.recommended_by.length ||
      props.alligned_initiative.length !== state.alligned_initiative.length
    ) {
      const service_type = props.service_type.map((item, index) => {
        return { name: item, checked: false };
      });
      const recommended_by = props.recommended_by.map((item, index) => {
        return { name: item, checked: false };
      });
      const alligned_initiative = props.alligned_initiative.map(
        (item, index) => {
          return { name: item, checked: false };
        }
      );
      return {
        service_type: service_type,
        recommended_by: recommended_by,
        alligned_initiative: alligned_initiative,
        isAllServicesSelected: false,
        isAllRecommendedSelected: false,
        isAllInitiativeSelected: false,
        defaultServices: service_type,
        defaultRecommended: recommended_by,
        defaultInitiative: alligned_initiative,
        UpdateFilters: props.UpdateFilters,
      };
    }
    return null;
  }
  onInitiativeBoxChange(checkName, isChecked) {
    let isAllChecked = checkName === "all" && isChecked;
    let isAllUnChecked = checkName === "all" && !isChecked;
    const checked = isChecked;
    const checkList = this.state.alligned_initiative.map((Item, index) => {
      if (isAllChecked || Item.name === checkName) {
        return Object.assign({}, Item, {
          checked,
        });
      } else if (isAllUnChecked) {
        return Object.assign({}, Item, {
          checked: false,
        });
      }
      return Item;
    });
    let isAllInitiativeSelected =
      checkList.findIndex((item) => item.checked === false) === -1 ||
      isAllChecked;
    let AllBGIndeterminate =
      checkList.filter((x) => x.checked).length > 0 && !isAllInitiativeSelected;
    this.setState(
      {
        alligned_initiative: checkList,
        isAllInitiativeSelected,
        AllBGIndeterminate,
      },
      () => {
        this.state.UpdateFilters(false);
        var SelectedInitiative = checkList
          .filter((x) => x.checked == true)
          .map((x) => x.name)
          .join(", ");
        if (
          checkList.length === checkList.filter((x) => x.checked == true).length
        ) {
          SelectedInitiative = "All";
        }
        this.props.OnInitiativeChange(SelectedInitiative);
      }
    );
  }
  onRecommendedBoxChange(checkName, isChecked) {
    let isAllChecked = checkName === "all" && isChecked;
    let isAllUnChecked = checkName === "all" && !isChecked;
    const checked = isChecked;
    const checkList = this.state.recommended_by.map((Item, index) => {
      if (isAllChecked || Item.name === checkName) {
        return Object.assign({}, Item, {
          checked,
        });
      } else if (isAllUnChecked) {
        return Object.assign({}, Item, {
          checked: false,
        });
      }
      return Item;
    });
    let isAllRecommendedSelected =
      checkList.findIndex((item) => item.checked === false) === -1 ||
      isAllChecked;
    let AllRecommendedIndeterminate =
      checkList.filter((x) => x.checked).length > 0 &&
      !isAllRecommendedSelected;
    this.setState(
      {
        recommended_by: checkList,
        isAllRecommendedSelected,
        AllRecommendedIndeterminate,
      },
      () => {
        this.state.UpdateFilters(false);
        var SelectedRecommendedBy = checkList
          .filter((x) => x.checked == true)
          .map((x) => x.name)
          .join(", ");
        if (
          checkList.length === checkList.filter((x) => x.checked == true).length
        ) {
          SelectedRecommendedBy = "All";
        }
        this.props.OnRecommendedByChange(SelectedRecommendedBy);
      }
    );
  }
  onServiceBoxChange(checkName, isChecked) {
    let isAllChecked = checkName === "all" && isChecked;
    let isAllUnChecked = checkName === "all" && !isChecked;
    const checked = isChecked;
    const checkList = this.state.service_type.map((service_type, index) => {
      if (isAllChecked || service_type.name === checkName) {
        return Object.assign({}, service_type, {
          checked,
        });
      } else if (isAllUnChecked) {
        return Object.assign({}, service_type, {
          checked: false,
        });
      }
      return service_type;
    });
    let isAllServicesSelected =
      checkList.findIndex((item) => item.checked === false) === -1 ||
      isAllChecked;
    let AllServiceIndeterminate =
      checkList.filter((x) => x.checked).length > 0 && !isAllServicesSelected;
    this.setState(
      {
        service_type: checkList,
        isAllServicesSelected,
        AllServiceIndeterminate,
      },
      () => {
        this.state.UpdateFilters(false);
        var SelectedServices = checkList
          .filter((x) => x.checked == true)
          .map((x) => x.name)
          .join(", ");
        if (
          checkList.length === checkList.filter((x) => x.checked == true).length
        ) {
          SelectedServices = "All";
        }
        this.props.OnServiceTypeChange(SelectedServices);
      }
    );
  }
  ClearBusinessGroup = (FilterType) => {
    if (FilterType == "ServiceType") {
      const initialValues = this.state.defaultServices;
      this.setState(
        { service_type: initialValues, isAllServicesSelected: false },
        () => {
          this.props.OnServiceTypeChange("");
          this.state.UpdateFilters(true);
        }
      );
    } else if (FilterType === "RecommendedBy") {
      const initialValues = this.state.defaultRecommended;
      this.setState(
        { recommended_by: initialValues, isAllRecommendedSelected: false },
        () => {
          this.props.OnRecommendedByChange("");
          this.state.UpdateFilters(true);
        }
      );
    } else if (FilterType == "AlignedInitiative") {
      const initialValues = this.state.defaultInitiative;
      this.setState(
        { service_type: initialValues, isAllInitiativeSelected: false },
        () => {
          this.props.OnInitiativeChange("");
          this.state.UpdateFilters(true);
        }
      );
    }
  };
  render() {
    return (
      <>
        {(this.state.recommended_by.length > 0 ||
          this.state.alligned_initiative.length > 0 ||
          this.state.service_type.length) > 0 && (
          <div className="card" align="left">
            <h5 className="mb-0 cardbg">
              <button
                className="btn custom-btn btn-full pt-0 pb-0 collapsed"
                type="button"
                data-toggle="collapse"
                aria-expanded="false"
                aria-controls="businessgroup"
                data-target="#businessgroup"
              >
                BUSINESS GROUP
              </button>
            </h5>

            <div
              className="collapse"
              aria-labelledby="headingHPSE"
              data-parent="#sidefilters"
              aria-expanded="false"
              id="businessgroup"
            >
              <div className="card-body ml-1 mr-0 mt-2">
                <div
                  className="collapse show"
                  aria-labelledby="headingHPSE"
                  data-parent="#accordionExample"
                  aria-expanded="false"
                  id="localizationItems"
                >
                  <div className="card-body ml-1 mr-1 mt-2">
                    <div className="accordion" id="accordionINDCategories">
                      <>
                        {/* <div className="card" align="left">
                                      <h5 className="mb-0 in-flex cardBorder">
                                          <input type="checkbox" readonly="" value="on" className="ml-2 mt-1 inputclass"/><button
                                              className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed" type="button"
                                              data-toggle="collapse" aria-expanded="false" aria-controls="practices"
                                              data-target="#practices">Practices</button></h5>
                                  </div> */}
                        {/* <div className="collapse" data-parent="#businessgroup"
                                      aria-expanded="false" id="practices">
                                      <div className="card-body ml-1 mr-0 mt-2">
                                          <div className="collapse show" aria-labelledby="headingHPSE"
                                              data-parent="#accordionSERCategories" aria-expanded="true" id="industryverticals">
                                              <div className="card-body ml-1 mr-0 mt-2">
                                                  <div className="collapse show" aria-labelledby="headingHPSE"
                                                      data-parent="#accordionExample" aria-expanded="false"
                                                      id="industryverticalsItems">
                                                      <div className="card-body ml-1 mr-1 mt-2">
                                                          <div className="accordion" id="accordionSERCategories">
                                                              <div className="card" align="left">
                                                                  <h5 className="mb-0 in-flex cardBorder">
                                                                      <input type="checkbox" readonly="" value="on"
                                                                          className="ml-2 mt-1"/><button
                                                                          className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed"
                                                                          type="button" data-toggle="collapse"
                                                                          aria-expanded="false" aria-controls="SERCategory"
                                                                          data-target="#ai">AI&amp;Data</button></h5>
                                                              </div>
                                                              <div className="collapse" aria-labelledby="headingHPSE"
                                                                  data-parent="#accordionSERCategories" aria-expanded="false"
                                                                  id="ai">
                                                                  <div className="selections_container col pr-1">
                                                                      <div className="row pl-3 pb-1"><input type="checkbox"
                                                                              readonly="" value="on" className="mr-2" />
                                                                          <div className="font11 ">Artificial Intelligence, Data
                                                                              Platform (Big Data)</div>
                                                                      </div>
                                                                      <div className="row pl-3 pb-1"><input type="checkbox"
                                                                              readonly="" value="on" className="mr-2" />
                                                                          <div className="font11">BlueData / MapR</div>
                                                                      </div>
          
                                                                  </div>
                                                              </div>
          
          
                                                              <div className="card" align="left">
                                                                  <h5 className="mb-0 in-flex cardBorder">
                                                                      <input type="checkbox" readonly="" value="on"
                                                                          className="ml-2 mt-1"/><button
                                                                          className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed"
                                                                          type="button" data-toggle="collapse"
                                                                          aria-expanded="false" aria-controls="SERCategory1"
                                                                          data-target="#edu">Education and MOC</button></h5>
                                                              </div>
                                                              <div className="collapse" aria-labelledby="headingHPSE"
                                                                  data-parent="#accordionSERCategories" aria-expanded="false"
                                                                  id="edu">
                                                                  <div className="selections_container col">
                                                                      <div className="row pl-3 pb-1"><input type="checkbox"
                                                                              readonly="" value="on" className="mr-2" />
                                                                          <div className="font11">Digital Learner Subscription</div>
                                                                      </div>
                                                                      <div className="row pl-3 pb-1"><input type="checkbox"
                                                                              readonly="" value="on" className="mr-2" />
                                                                          <div className="font11">Management of Change</div>
                                                                      </div>
                                                                      <div className="row pl-3 pb-1"><input type="checkbox"
                                                                              readonly="" value="on" className="mr-2" />
                                                                          <div className="font11">Training Event Services</div>
                                                                      </div>
          
          
          
          
                                                                  </div>
                                                              </div>
          
          
          
                                                              <div className="card" align="left">
                                                                  <h5 className="mb-0 in-flex cardBorder">
                                                                      <input type="checkbox" readonly="" value="on"
                                                                          className="ml-2 mt-1"/><button
                                                                          className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed"
                                                                          type="button" data-toggle="collapse"
                                                                          aria-expanded="false" aria-controls="SERCategory"
                                                                          data-target="#hit">Hybrid IT</button></h5>
                                                              </div>
                                                              <div className="collapse" aria-labelledby="headingHPSE"
                                                                  data-parent="#accordionSERCategories" aria-expanded="false"
                                                                  id="hit">
                                                                  <div className="selections_container col">
                                                                      <div className="row pl-3 pb-1"><input type="checkbox"
                                                                              readonly="" value="on" className="mr-2" />
                                                                          <div className="font11">Artificial Intelligence,<br/> Data
                                                                              Platform (Big Data)</div>
                                                                      </div>
                                                                      <div className="row pl-3 pb-1"><input type="checkbox"
                                                                              readonly="" value="on" className="mr-2" />
                                                                          <div className="font11">Cloud Native &amp; Containers</div>
                                                                      </div>
                                                                      <div className="row pl-3 pb-1"><input type="checkbox"
                                                                              readonly="" value="on" className="mr-2" />
                                                                          <div className="font11">CTP</div>
                                                                      </div>
                                                                      <div className="row pl-3 pb-1"><input type="checkbox"
                                                                              readonly="" value="on" className="mr-2" />
                                                                          <div className="font11">Data Center Technology<br/> Services
                                                                          </div>
                                                                      </div>
                                                                      <div className="row pl-3 pb-1"><input type="checkbox"
                                                                              readonly="" value="on" className="mr-2" />
                                                                          <div className="font11">Hybrid IT &amp; CTP Security</div>
                                                                      </div>
          
                                                                      <div className="row pl-3 pb-1"><input type="checkbox"
                                                                              readonly="" value="on" className="mr-2" />
                                                                          <div className="font11">I&amp;PS
                                                                          </div>
                                                                      </div>
          
                                                                      <div className="row pl-3 pb-1"><input type="checkbox"
                                                                              readonly="" value="on" className="mr-2" />
                                                                          <div className="font11">Migratons
                                                                          </div>
                                                                      </div>
          
                                                                      <div className="row pl-3 pb-1"><input type="checkbox"
                                                                              readonly="" value="on" className="mr-2" />
                                                                          <div className="font11">Platform &amp; Automation
                                                                          </div>
                                                                      </div>
          
                                                                      <div className="row pl-3 pb-1"><input type="checkbox"
                                                                              readonly="" value="on" className="mr-2" />
                                                                          <div className="font11">SAP
                                                                          </div>
                                                                      </div>
          
                                                                      <div className="row pl-3 pb-1"><input type="checkbox"
                                                                              readonly="" value="on" className="mr-2" />
                                                                          <div className="font11">Storage
                                                                          </div>
                                                                      </div>
          
                                                                      <div className="row pl-3 pb-1"><input type="checkbox"
                                                                              readonly="" value="on" className="mr-2" />
                                                                          <div className="font11">Strategic Transformation,
                                                                              <br/>Governance &amp; Process
                                                                          </div>
                                                                      </div>
          
                                                                  </div>
                                                              </div>
          
          
          
                                                              <div className="card">
                                                                  <h5 className="mb-0 in-flex cardBorder">
                                                                      <input type="checkbox" readonly="" value="on"
                                                                          className="ml-2 mt-1"/><button type="button"
                                                                          data-toggle="collapse" aria-expanded="false"
                                                                          aria-controls="SERCategory" data-target="#netwrkint"
                                                                          className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed">Networking,
                                                                          Workplace <br/> &amp; Intelligent Edge</button></h5>
                                                              </div>
                                                              <div className="collapse" aria-labelledby="headingHPSE"
                                                                  data-parent="#accordionSERCategories" aria-expanded="false"
                                                                  id="netwrkint">
                                                                  <div className="selections_container col">
                                                                      <div className="row pl-3 pb-1"><input type="checkbox"
                                                                              readonly="" value="on" className="mr-2" />
                                                                          <div className="font11">Digital Workplace Services</div>
                                                                      </div>
                                                                      <div className="row pl-3 pb-1"><input type="checkbox"
                                                                              readonly="" value="on" className="mr-2" />
                                                                          <div className="font11">Edge Security</div>
                                                                      </div>
                                                                      <div className="row pl-3 pb-1"><input type="checkbox"
                                                                              readonly="" value="on" className="mr-2" />
                                                                          <div className="font11">I&amp;PS</div>
                                                                      </div>
                                                                      <div className="row pl-3 pb-1"><input type="checkbox"
                                                                              readonly="" value="on" className="mr-2" />
                                                                          <div className="font11">Networking Services</div>
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div> */}
                      </>
                      {this.state.recommended_by.length > 0 && (
                        <div className="card" align="left">
                          <h5 className="mb-0 in-flex cardBorder">
                            <input
                              type="checkbox"
                              checked={this.state.isAllRecommendedSelected}
                              ref={(el) =>
                                el &&
                                (el.indeterminate =
                                  this.state.AllRecommendedIndeterminate)
                              }
                              className="ml-2 mt-1 inputclass"
                              onChange={(e) =>
                                this.onRecommendedBoxChange(
                                  "all",
                                  e.target.checked
                                )
                              }
                            />
                            <button
                              className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed"
                              type="button"
                              data-toggle="collapse"
                              aria-expanded="false"
                              aria-controls="recommended"
                              data-target="#recommended"
                            >
                              Recommended by
                            </button>
                          </h5>

                          <div
                            className="collapse"
                            data-parent="#businessgroup"
                            aria-expanded="false"
                            id="recommended"
                          >
                            <div
                              className="selections_container col"
                              style={{ color: "#000" }}
                            >
                              {this.state.recommended_by &&
                                this.state.recommended_by.map((list, index) => (
                                  <Fragment key={index}>
                                    {list && list !== undefined && list !== "" && (
                                      <div className="row pl-3 pb-1">
                                        <label className="mb-0">
                                          <input
                                            type="checkbox"
                                            className="mr-2"
                                            name="recommended_by"
                                            value={list.name}
                                            checked={list.checked}
                                            onChange={(e) =>
                                              this.onRecommendedBoxChange(
                                                list.name,
                                                e.target.checked
                                              )
                                            }
                                          />
                                          {list.name}
                                        </label>
                                      </div>
                                    )}
                                  </Fragment>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}
                      {this.state.alligned_initiative.length > 0 && (
                        <div className="card" align="left">
                          <h5 className="mb-0 in-flex cardBorder">
                            <input
                              type="checkbox"
                              checked={this.state.isAllInitiativeSelected}
                              ref={(el) =>
                                el &&
                                (el.indeterminate =
                                  this.state.AllBGIndeterminate)
                              }
                              className="ml-2 mt-1 inputclass"
                              onChange={(e) =>
                                this.onInitiativeBoxChange(
                                  "all",
                                  e.target.checked
                                )
                              }
                            />
                            <button
                              className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed"
                              type="button"
                              data-toggle="collapse"
                              aria-expanded="false"
                              aria-controls="alignedinitiative"
                              data-target="#alignedinitiative"
                            >
                              Aligned Initiative
                            </button>
                          </h5>

                          <div
                            className="collapse"
                            data-parent="#businessgroup"
                            aria-expanded="false"
                            id="alignedinitiative"
                          >
                            <div
                              className="selections_container col"
                              style={{ color: "#000" }}
                            >
                              {this.state.alligned_initiative &&
                                this.state.alligned_initiative.map(
                                  (list, index) => (
                                    <Fragment key={index}>
                                      {list &&
                                        list !== undefined &&
                                        list !== "" && (
                                          <div className="row pl-3 pb-1">
                                            <label className="mb-0">
                                              <input
                                                type="checkbox"
                                                className="mr-2"
                                                checked={list.checked}
                                                value={list.name}
                                                name="alligned_initiative"
                                                onChange={(e) =>
                                                  this.onInitiativeBoxChange(
                                                    list.name,
                                                    e.target.checked
                                                  )
                                                }
                                              />
                                              {list.name}
                                            </label>
                                          </div>
                                        )}
                                    </Fragment>
                                  )
                                )}
                            </div>
                          </div>
                        </div>
                      )}
                      {this.state.service_type.length > 0 && (
                        <div className="card" align="left">
                          <h5 className="mb-0 in-flex cardBorder">
                            <input
                              type="checkbox"
                              checked={this.state.isAllServicesSelected}
                              ref={(el) =>
                                el &&
                                (el.indeterminate =
                                  this.state.AllServiceIndeterminate)
                              }
                              onChange={(e) =>
                                this.onServiceBoxChange("all", e.target.checked)
                              }
                              className="ml-2 mt-1 inputclass"
                            />
                            <button
                              className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed"
                              type="button"
                              data-toggle="collapse"
                              aria-expanded="false"
                              aria-controls="servicetype"
                              data-target="#servicetype"
                            >
                              Service Type
                            </button>
                          </h5>

                          <div
                            className="collapse"
                            data-parent="#businessgroup"
                            aria-expanded="false"
                            id="servicetype"
                          >
                            <div
                              className="selections_container col"
                              style={{ color: "#000" }}
                            >
                              {this.state.service_type &&
                                this.state.service_type.map((list, index) => (
                                  <Fragment key={index}>
                                    {list && list !== undefined && list !== "" && (
                                      <div className="row pl-3 pb-1">
                                        <label className="mb-0">
                                          <input
                                            type="checkbox"
                                            className="mr-2"
                                            name="service_type"
                                            value={list.name}
                                            checked={list.checked}
                                            onChange={(e) =>
                                              this.onServiceBoxChange(
                                                list.name,
                                                e.target.checked
                                              )
                                            }
                                          />
                                          {list.name}
                                        </label>
                                      </div>
                                    )}
                                  </Fragment>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
export default BusinessGroup;
