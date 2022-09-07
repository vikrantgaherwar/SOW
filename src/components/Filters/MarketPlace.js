import React, { Fragment } from "react";
class MarketPlace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      competitors_covered: [],
      research_vendors: [],
      isAllCompetitorsSelected: false,
      isAllResearchVendorsSelected: false,
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (
      props.competitors_covered.length !== state.competitors_covered.length ||
      props.research_vendors.length !== state.research_vendors.length
    ) {
      const competitors_covered = props.competitors_covered.map(
        (item, index) => {
          return { name: item, checked: false };
        }
      );
      const research_vendors = props.research_vendors.map((item, index) => {
        return { name: item, checked: false };
      });

      return {
        competitors_covered,
        research_vendors,
        defaultCompetitors: competitors_covered,
        defaultResearchVendors: research_vendors,
        isAllCompetitorsSelected: false,
        isAllResearchVendorsSelected: false,
        UpdateFilters: props.UpdateFilters,
      };
    }
    return null;
  }
  onCompetitorsBoxChange(checkName, isChecked) {
    let isAllChecked = checkName === "all" && isChecked;
    let isAllUnChecked = checkName === "all" && !isChecked;
    const checked = isChecked;
    const CompetitorsCovered = this.state.competitors_covered.map(
      (item, index) => {
        if (isAllChecked || item.name === checkName) {
          return Object.assign({}, item, {
            checked,
          });
        } else if (isAllUnChecked) {
          return Object.assign({}, item, {
            checked: false,
          });
        }
        return item;
      }
    );

    this.setState({ CompetitorsCovered }, () => {
      this.state.UpdateFilters(false);
      let SelectedCompetitorsCovered = this.state.CompetitorsCovered.filter(
        (x) => x.checked == true
      )
        .map((x) => x.name)
        .join(", ");
      if (
        this.state.CompetitorsCovered.length ===
        this.state.CompetitorsCovered.filter((x) => x.checked == true).length
      )
        SelectedCompetitorsCovered = "All";
      this.props.onCompetitorsBoxChange(SelectedCompetitorsCovered);
    });
    let isAllCompetitorsSelected =
      CompetitorsCovered.findIndex((item) => item.checked === false) === -1 ||
      isAllChecked;
    this.setState({
      competitors_covered: CompetitorsCovered,
      isAllCompetitorsSelected,
    });
  }
  onResearchVendorsBoxChange(checkName, isChecked) {
    let isAllChecked = checkName === "all" && isChecked;
    let isAllUnChecked = checkName === "all" && !isChecked;
    const checked = isChecked;
    var ResearchVendors = this.state.research_vendors.map((item, index) => {
      if (isAllChecked || item.name === checkName) {
        return Object.assign({}, item, {
          checked,
        });
      } else if (isAllUnChecked) {
        return Object.assign({}, item, {
          checked: false,
        });
      }
      return item;
    });

    this.setState({ ResearchVendors }, () => {
      this.state.UpdateFilters(false);
      let SelectedResearchVendors = this.state.ResearchVendors.filter(
        (x) => x.checked == true
      )
        .map((x) => x.name)
        .join(", ");
      if (
        this.state.ResearchVendors.length ===
        this.state.ResearchVendors.filter((x) => x.checked == true).length
      )
        SelectedResearchVendors = "All";
      this.props.onResearchVendorsBoxChange(SelectedResearchVendors);
    });
    let isAllResearchVendorsSelected =
      ResearchVendors.findIndex((item) => item.checked === false) === -1 ||
      isAllChecked;
    this.setState({
      research_vendors: ResearchVendors,
      isAllResearchVendorsSelected,
    });
  }
  ClearMarketPlace = (FilterType) => {
    if (FilterType === "reserach_vendors") {
      const DefaultData = this.state.defaultResearchVendors;
      this.setState({ research_vendors: DefaultData }, () => {
        this.props.onResearchVendorsBoxChange("");
        this.state.UpdateFilters(true);
      });
    } else if (FilterType === "competitors") {
      const competitors_covered = this.state.defaultCompetitors;
      this.setState({ competitors_covered }, () => {
        this.props.onCompetitorsBoxChange("");
        this.state.UpdateFilters(true);
      });
    }
  };
  render() {
    return (
      <Fragment>
        {(this.state.competitors_covered.length > 0 ||
          this.state.research_vendors.length > 0) && (
          <div className="card mb-0" align="left">
            <h5 className="mb-0 cardbg">
              <button
                className="btn custom-btn btn-full pt-0 pb-0 collapsed"
                type="button"
                data-toggle="collapse"
                aria-expanded="false"
                aria-controls="market_place"
                data-target="#market_place"
              >
                MARKET PLACE
              </button>
            </h5>

            <div
              className="collapse"
              data-parent="#sidefilters"
              aria-expanded="false"
              id="market_place"
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
                      <Fragment>
                        {/* <div className="card mb-1" align="left">
                                  <h5 className="mb-0 in-flex cardBorder">
          <input type="checkbox" readonly="" value="on" className="ml-2 mt-1 inputclass"/>
                                      <button className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed" type="button" data-toggle="collapse" aria-expanded="false" aria-controls="marketplace_industry" data-target="#marketplace_industry">Industry                                
                                      </button>
                                  </h5>
                              </div>
                              <div className="collapse" data-parent="#market_place" id="marketplace_industry" aria-expanded="false">
                                <div className="collapse show" aria-labelledby="headingHPSE" data-parent="#accordionSERCategories" aria-expanded="true"  id="industryverticals"><div className="card-body ml-1 mr-0 mt-2"><div className="collapse show" aria-labelledby="headingHPSE" data-parent="#accordionExample" aria-expanded="false"  id="industryverticalsItems"><div className="card-body ml-1 mr-1 mt-2"><div className="accordion" id="accordionSERCategories"><div className="card mb-1" align="left"><h5 className="mb-0 in-flex cardBorder">
          <input type="checkbox" readonly="" value="on" className="ml-2 mt-1 inputclass"/><button className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed" type="button" data-toggle="collapse" aria-expanded="false" aria-controls="SERCategory" data-target="#cme">CME</button></h5></div><div className="collapse" aria-labelledby="headingHPSE" data-parent="#marketplace_industry"  id="cme" aria-expanded="false"><div className="selections_container col pr-1">
                                  <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Media &amp; Entertainment</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Network Equipment Providers</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">NULL</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Service Provider T1</div></div>
                                  <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Service Provider T2</div></div>
                                <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Service Provider T3</div></div>
                                
                                <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Service Providers</div></div>
                                
                                <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Telco</div></div>
                                
                                
                                </div></div>
                                
                                
                                <div className="card" align="left"><h5 className="mb-0 in-flex cardBorder">
          <input type="checkbox" readonly="" value="on" className="ml-2 mt-1 inputclass"/><button className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed" type="button" data-toggle="collapse" aria-expanded="false" aria-controls="fin" data-target="#fin">Financial Services industry</button></h5></div><div className="collapse" aria-labelledby="headingHPSE" data-parent="#marketplace_industry"  id="fin" aria-expanded="false"><div className="selections_container col">
                                  <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Automotive</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Banking</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Consumer Packaged Goods</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Financial Markets</div></div>
                                  <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Insurance</div></div>
                                <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">NULL</div></div>
                                
                                
                                </div></div>
                                    
                                    <div className="card" align="left"><h5 className="mb-0 in-flex cardBorder">
          <input type="checkbox" readonly="" value="on" className="ml-2 mt-1 inputclass"/><button className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed" type="button" data-toggle="collapse" aria-expanded="false" aria-controls="hls" data-target="#hls">Health &amp; Life Sciences</button></h5></div><div className="collapse" aria-labelledby="headingHPSE" data-parent="#marketplace_industry"  id="hls" aria-expanded="false"><div className="selections_container col">
                                  <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Healthcare Payers</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Healthcare Providers</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Life Sciences</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">NULL</div></div>
                                  <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Pharmaceutical</div></div>
                                
                                
                                
                                </div></div>
                                    
                                    <div className="card" align="left"><h5 className="mb-0 in-flex cardBorder">
          <input type="checkbox" readonly="" value="on" className="ml-2 mt-1 inputclass"/><button className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed" type="button" data-toggle="collapse" aria-expanded="false" aria-controls="mfgdist" data-target="#mfgdist">Mfg &amp; Dist</button></h5></div><div className="collapse" aria-labelledby="headingHPSE" data-parent="#marketplace_industry"  id="mfgdist" aria-expanded="false"><div className="selections_container col" >
                                  <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Aerospace</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Automotive</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Chemicals</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Consumer Packaged Goods</div></div>
                                  <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Discrete-Energy &amp; Nat. Res.</div></div>
                                <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Discrete - High Tech</div></div>
                                
                                
                                </div></div>
                                <div className="card" align="left"><h5 className="mb-0 in-flex cardBorder">
          <input type="checkbox" readonly="" value="on" className="ml-2 mt-1 inputclass"/><button className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed" type="button" data-toggle="collapse" aria-expanded="false" aria-controls="null" data-target="#null">Null</button></h5></div>
                                
                                <div className="collapse" aria-labelledby="headingHPSE" data-parent="#marketplace_industry" aria-expanded="false"  id="null"><div className="selections_container col">
                                  <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Agriculture/forestry/fishing</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Automotive</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Banking</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Business Services</div></div>
                                  <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Computer Software/Services</div></div>
                                <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Construction</div></div>
                                
                                
                                </div></div>
                                
                                <div className="card" align="left"><h5 className="mb-0 in-flex cardBorder">
          <input type="checkbox" readonly="" value="on" className="ml-2 mt-1 inputclass"/><button className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed" type="button" data-toggle="collapse" aria-expanded="false" aria-controls="others" data-target="#others">Other Industries</button></h5></div>
                                
                                <div className="collapse" aria-labelledby="headingHPSE" data-parent="#marketplace_industry" aria-expanded="false"  id="others"><div className="selections_container col">
                                  <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Accounting</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Agriculture/forestry/fishing</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Amusement and Recreation</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Automotive</div></div>
                                  <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Business Consultancy</div></div>
                                <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Business Services</div></div>
                                
                                
                                </div></div>
                                <div className="card" align="left"><h5 className="mb-0 in-flex cardBorder">
          <input type="checkbox" readonly="" value="on" className="ml-2 mt-1 inputclass"/><button className="btn btn-link btn-full pt-0 pb-0 pl-1 collapsed" type="button" data-toggle="collapse" aria-expanded="false" aria-controls="pubedu" data-target="#pubedu">Public Sector &amp; Education</button></h5></div>
                                
                                <div className="collapse" aria-labelledby="headingHPSE" data-parent="#marketplace_industry"  id="pubedu" aria-expanded="false"><div className="selections_container col">
                                  <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Defense/Security/Police</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Education</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Education: K-12 /School</div></div><div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Education:Higher Ed/University</div></div>
                                  <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Gov. Administration &amp; Finance</div></div>
                                <div className="row pl-3 pb-1"><input type="checkbox" readonly="" value="on" className="mr-2" /><div className="font11">Gov. Public Health Programs</div></div>
                                
                                
                                </div></div>
                                
                                </div></div></div></div></div>
                              </div> */}
                      </Fragment>
                      {this.state.competitors_covered.length > 0 && (
                        <Fragment>
                          <div className="card" align="left">
                            <h5 className="mb-0 in-flex cardBorder">
                              <input
                                type="checkbox"
                                checked={this.state.isAllCompetitorsSelected}
                                className="ml-2 mt-1 inputclass"
                                onChange={(e) =>
                                  this.onCompetitorsBoxChange(
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
                                aria-controls="competitors_covered"
                                data-target="#competitors_covered"
                              >
                                Competitors Covered
                              </button>
                            </h5>
                          </div>
                          <div
                            className="collapse"
                            aria-labelledby="headingHPSE"
                            data-parent="#market_place"
                            id="competitors_covered"
                            aria-expanded="false"
                          >
                            <div
                              className="selections_container col"
                              style={{ color: "#000" }}
                            >
                              {this.state.competitors_covered &&
                                this.state.competitors_covered.map(
                                  (list, index) => (
                                    <Fragment key={index}>
                                      {list &&
                                        list !== undefined &&
                                        list !== "" && (
                                          <div className="row pl-3 pb-1">
                                            <label className="mb-0">
                                              <input
                                                type="checkbox"
                                                name="competitors_covered"
                                                value={list.name}
                                                checked={list.checked}
                                                className="mr-2"
                                                onChange={(e) =>
                                                  this.onCompetitorsBoxChange(
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
                        </Fragment>
                      )}
                      {this.state.research_vendors.length > 0 && (
                        <Fragment>
                          <div className="card" align="left">
                            <h5 className="mb-0 in-flex cardBorder">
                              <input
                                type="checkbox"
                                checked={
                                  this.state.isAllResearchVendorsSelected
                                }
                                className="ml-2 mt-1 inputclass"
                                onChange={(e) =>
                                  this.onResearchVendorsBoxChange(
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
                                aria-controls="reserach_vendors"
                                data-target="#reserach_vendors"
                              >
                                Research Vendors
                              </button>
                            </h5>
                          </div>
                          <div
                            className="collapse"
                            aria-labelledby="headingHPSE"
                            data-parent="#market_place"
                            id="reserach_vendors"
                            aria-expanded="false"
                          >
                            <div
                              className="selections_container col"
                              style={{ color: "#000" }}
                            >
                              {this.state.research_vendors &&
                                this.state.research_vendors.map(
                                  (list, index) => (
                                    <Fragment key={index}>
                                      {list &&
                                        list !== undefined &&
                                        list !== "" && (
                                          <div className="row pl-3 pb-1">
                                            <label className="mb-0">
                                              <input
                                                type="checkbox"
                                                name="research_vendors"
                                                value={list.name}
                                                checked={list.checked}
                                                className="mr-2"
                                                onChange={(e) =>
                                                  this.onResearchVendorsBoxChange(
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
                        </Fragment>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}
export default MarketPlace;
