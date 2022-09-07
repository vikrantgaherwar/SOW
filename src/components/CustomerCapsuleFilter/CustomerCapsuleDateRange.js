import React, { Fragment } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import _ from "lodash";
import { addMonths, subYears, subtract, add } from "date-fns";
import {} from "react-datepicker/dist/react-datepicker.css";

class CustomerCapsuleDateRange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createdFromDateCC: new Date(),
      createdToDateCC: new Date(),
      creation_dateCC: [],
      isCreatedDateCCChange: false,
      mindate: "",
      maxdate: 1,
    };
  }
  componentDidMount() {
    var today = new Date();
    var year = today.getFullYear();
    var currentMonth = today.getMonth() + 1;
    if (currentMonth == 10 || currentMonth <= 10) {
      const mindateyear = year - 3;
      const mindate = "11-01-" + mindateyear; // "11-01-2017"
      const maxdate = "10-31-" + year; // "10-31-2020"
      this.setState({ mindate: mindate, maxdate: maxdate });
    }
    if (currentMonth === 11 || currentMonth === 12) {
      const mindateyear = year - 2;
      const mindate = "11-01-" + mindateyear; // "11-01-2018"
      const maxdate = "10-31-" + (year + 1); // "10-31-2021"
      this.setState({ mindate: mindate, maxdate: maxdate });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.AccountId !== prevProps.AccountId) {
      this.setState({
        createdFromDateCC: new Date(),
        createdToDateCC: new Date(),
      });
      var today = new Date();
      var year = today.getFullYear();
      var currentMonth = today.getMonth();
      if (currentMonth == 10 || currentMonth <= 10) {
        const mindateyear = year - 3;
        const mindate = "11-01-" + mindateyear; // "11-01-2017"
        const maxdate = "10-31-" + year; // "10-31-2020"
        this.setState({ mindate: mindate, maxdate: maxdate });
      }
      if (currentMonth == 11 || currentMonth == 12) {
        const mindateyear = year - 2;
        const mindate = "11-01-" + mindateyear; // "11-01-2018"
        const maxdate = "10-31-" + (year + 1); // "10-31-2021"
        this.setState({ mindate: mindate, maxdate: maxdate });
      }
    }
  }
  formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };
  handleCreatedFromDate = (createdFromDateCC) => {
    this.setState(
      { createdFromDateCC: createdFromDateCC, isCreatedDateCCChange: true },
      () => {
        this.props.UpdateCCFilters(false);
        this.props.OnCCapsuleCreatedDateChange(
          this.formatDate(this.state.createdFromDateCC) +
            " To " +
            this.formatDate(this.state.createdToDateCC)
        );
      }
    );
  };
  handleCreatedToDate = (createdToDateCC) => {
    this.setState(
      { createdToDateCC: createdToDateCC, isCreatedDateCCChange: true },
      () => {
        this.props.UpdateCCFilters(false);
        this.props.OnCCapsuleCreatedDateChange(
          this.formatDate(this.state.createdFromDateCC) +
            " To " +
            this.formatDate(this.state.createdToDateCC)
        );
      }
    );
  };

  //   ClearCCDates = (Type)=> {
  //      if(Type === "CreatedDate"){
  //       var createdFromDateCC= new Date(new Date().setFullYear(new Date().getFullYear() - 3));
  //       var createdToDateCC= new Date();
  //       this.setState({createdFromDateCC,createdToDateCC, isCreatedDateCCChange : false},
  //         ()=>{
  //            this.props.UpdateCCFilters(true);
  //             this.props.OnCCapsuleCreatedDateChange("");
  //         });
  //      }
  //   }

  //   static getDerivedStateFromProps(props, state) {
  //     if(props.creation_dateCC.length !== state.creation_dateCC.length){
  //       var createdFromDateCC= new Date(new Date().setFullYear(new Date().getFullYear() - 3));
  //       var createdToDateCC= new Date();

  //       return {creation_dateCC: props.creation_dateCC,
  //               createdToDateCC, createdFromDateCC,
  //               UpdateCCFilters : props.UpdateCCFilters
  //             };
  //     }
  //     return null;
  //   }

  render() {
    return (
      <Fragment>
        {/* {(this.state.creation_dateCC.length >0) &&  */}
        <div className="card mb-0" align="left">
          <h5 className="mb-0 cc_cardbg">
            <button
              className="btn custom-btn btn-full pt-0 pb-0 collapsed"
              type="button"
              data-toggle="collapse"
              aria-expanded="false"
              aria-controls="ccdate"
              data-target="#ccdate"
            >
              DATE RANGE
            </button>
          </h5>

          <div
            className="collapse"
            aria-labelledby="headingHPSE"
            data-parent="#customercapsule_accordion"
            aria-expanded="false"
            id="ccdate"
          >
            <div className="card-body ml-1 mr-0">
              <div
                className="collapse show"
                aria-labelledby="headingHPSE"
                data-parent="#accordionExample"
                aria-expanded="false"
                id="ccdateItems"
              >
                <div className="card-body ml-1 mr-1">
                  <div className="accordion" id="ccyears">
                    <div className="row pl-3 pb-1 ccoverflow">
                      {/* {this.state.creation_dateCC.length >0 && */}
                      <table
                        className="table-sm"
                        cellSpacing="0"
                        cellPadding="0"
                        border="0"
                      >
                        <tbody>
                          <tr>
                            <td className="d1">
                              <DatePicker
                                className="form-control form-control-sm custom-datePicker creation_date_startCC"
                                selected={this.state.createdFromDateCC}
                                onChange={(createdFromDateCC) =>
                                  this.handleCreatedFromDate(createdFromDateCC)
                                }
                                showYearDropdown
                                dateFormatCalendar="MMMM"
                                // yearDropdownItemNumber={10}
                                scrollableYearDropdown
                                // minDate={subYears(new Date(), this.state.mindate)}
                                // maxDate={subYears(new Date(), this.state.maxdate)}
                                minDate={new Date(this.state.mindate)}
                                maxDate={new Date(this.state.maxdate)}
                              />

                              <input
                                type="checkbox"
                                value={this.state.isCreatedDateCCChange}
                                name="createdToDateCC"
                                className="display-none"
                              ></input>
                            </td>
                            <td className="d2">
                              <DatePicker
                                className="form-control form-control-sm custom-datePicker creation_date_endCC"
                                selected={this.state.createdToDateCC}
                                onChange={(createdToDateCC) =>
                                  this.handleCreatedToDate(createdToDateCC)
                                }
                                showYearDropdown
                                dateFormatCalendar="MMMM"
                                //   yearDropdownItemNumber={10}
                                scrollableYearDropdown
                                // minDate={subYears(
                                //   new Date(),
                                //   this.state.mindate
                                // )}
                                // maxDate={subYears(
                                //   new Date(),
                                //   this.state.maxdate
                                // )}

                                minDate={new Date(this.state.mindate)}
                                maxDate={new Date(this.state.maxdate)}
                                popperClassName="datepicker-custom-class"
                                popperPlacement="top-left"
                                popperModifiers={{
                                  offset: {
                                    enabled: true,
                                    offset: "5px, 5px",
                                  },
                                  preventOverflow: {
                                    enabled: true,
                                    escapeWithReference: false,
                                    boundariesElement: "viewport",
                                  },
                                }}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      {/* //  } */}
                    </div>
                  </div>
                </div>
              </div>
              <p style={{ color: "red" }}>
                Note:Date Range Filter is Not Applicable to Install base
              </p>
            </div>
          </div>
        </div>
        {/* // } */}
      </Fragment>
    );
  }
}
export default CustomerCapsuleDateRange;
