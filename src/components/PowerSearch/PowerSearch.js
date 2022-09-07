import React, { Fragment } from "react";
import "bootstrap";
// import SearchIcon from "../../img/powersearch-icon.jpg";
import SearchIcon from "../../img/powersearch-icon.png";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
class PowerSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedoption: "Select",
      searchText: "",
      exactmatch: "",
      filematch: "",
      wildcardmatch: "",
      nowordmatch: "",
      andmatch: "",
      ormatch: "",
      ErrorMsg1: "",
      ErrorMsg2: "",
      ErrorMsg3: "",
      ErrorMsg4: "",
      ErrorMsg5: "",
      ErrorMsg6: "",
      btnaction: true,
      extbtnaction: true,
      filebtnaction: true,
      wildbtnaction: true,
      nomatchbtnaction: true,
      andbtnaction: true,
      orbtnaction: true,
    };
  }
  updateState = () => {
    this.setState(
      {
        exactmatch: "",
        filematch: "",
        wildcardmatch: "",
        nowordmatch: "",
        andmatch: "",
        ormatch: "",
        ErrorMsg1: "",
        ErrorMsg2: "",
        ErrorMsg3: "",
        ErrorMsg4: "",
        ErrorMsg5: "",
        ErrorMsg6: "",
        btnaction: true,
        extbtnaction: true,
        filebtnaction: true,
        wildbtnaction: true,
        andbtnaction: true,
        orbtnaction: true,
        nomatchbtnaction: true,
      },
      () => this.doSearchstart()
    );
  };
  updateExactMatch = (e) => {
    e.preventDefault();
    if (e.target.value.length > 0) {
      if (e.target.value.trim() == "") {
        this.setState({ ErrorMsg1: "Enter a valid keyword", exactmatch: "" });
      }
      if (e.target.value.trim() != "") {
        this.setState(
          { ErrorMsg1: "", extbtnaction: false, exactmatch: e.target.value },
          () => this.checkBtnStatus()
        );
      }
    }
    if (e.target.value.length == 0) {
      this.setState({ ErrorMsg1: "", exactmatch: "", extbtnaction: true }, () =>
        this.checkBtnStatus()
      );
    }
  };
  updateFileMatch = (e) => {
    e.preventDefault();
    if (e.target.value.length > 0) {
      if (e.target.value.trim() == "") {
        this.setState({ ErrorMsg2: "Enter a valid keyword", filematch: "" });
      }
      if (e.target.value.trim() != "") {
        this.setState(
          { filematch: e.target.value, ErrorMsg2: "", filebtnaction: false },
          () => this.checkBtnStatus()
        );
      }
    }
    if (e.target.value.length == 0) {
      this.setState({ filematch: "", ErrorMsg2: "", filebtnaction: true }, () =>
        this.checkBtnStatus()
      );
    }
  };
  updateWildCardMatch = (e) => {
    e.preventDefault();
    if (e.target.value.length > 0) {
      if (e.target.value.trim() == "") {
        this.setState({
          ErrorMsg3: "Enter a valid keyword",
          wildcardmatch: "",
        });
      }
      if (e.target.value.trim() != "") {
        this.setState(
          {
            wildcardmatch: e.target.value,
            ErrorMsg3: "",
            wildbtnaction: false,
          },
          () => this.checkBtnStatus()
        );
      }
    }
    if (e.target.value.length == 0) {
      this.setState(
        { wildcardmatch: "", ErrorMsg3: "", wildbtnaction: true },
        () => this.checkBtnStatus()
      );
    }
  };

  updateNoMatch = (e) => {
    e.preventDefault();
    if (e.target.value.length > 0) {
      if (e.target.value.trim() == "") {
        this.setState({
          ErrorMsg6: "Enter a valid keyword",
          nowordmatch: "",
        });
      }
      if (e.target.value.trim() != "") {
        this.setState(
          {
            nowordmatch: e.target.value,
            ErrorMsg6: "",
            nomatchbtnaction: false,
          },
          () => this.checkBtnStatus()
        );
      }
    }
    if (e.target.value.length == 0) {
      this.setState(
        { nowordmatch: "", ErrorMsg6: "", nomatchbtnaction: true },
        () => this.checkBtnStatus()
      );
    }
  };

  updateANDMatch = (e) => {
    e.preventDefault();
    if (e.target.value.length > 0) {
      if (e.target.value.trim() == "") {
        this.setState({ ErrorMsg4: "Enter a valid keyword", andmatch: "" });
      }
      if (e.target.value.trim() != "") {
        this.setState(
          { andmatch: e.target.value, ErrorMsg4: "", andbtnaction: false },
          () => this.checkBtnStatus()
        );
      }
    }
    if (e.target.value.length == 0) {
      this.setState({ andmatch: "", ErrorMsg4: "", andbtnaction: true }, () =>
        this.checkBtnStatus()
      );
    }
  };
  updateEitherORMatch = (e) => {
    e.preventDefault();
    if (e.target.value.length > 0) {
      if (e.target.value.trim() == "") {
        this.setState({ ErrorMsg5: "Enter a valid keyword", ormatch: "" });
      }
      if (e.target.value.trim() != "") {
        this.setState(
          { ormatch: e.target.value, ErrorMsg5: "", orbtnaction: false },
          () => this.checkBtnStatus()
        );
      }
    }
    if (e.target.value.length == 0) {
      this.setState({ ormatch: "", ErrorMsg5: "", orbtnaction: true }, () =>
        this.checkBtnStatus()
      );
    }
  };
  doSearchstart = () => {
    this.setState({ flag: this.state.flag + 1 });
    let searchterm = "";
    if (this.state.exactmatch != "") {
      var chars = { "+": "%2B", "@": "%40", ";": "%3B", "&":"%26" ,":":"%3A"};//Replacing the special characters
      var term = this.state.exactmatch.trim();
      term = term.replace(/[+@;&:]/g, (m) =>chars[m]);
      var modify = '"' + term + '"';
      searchterm += modify + " AND ";
    }
    if (this.state.filematch != "") {
      var chars = { "+": "%2B", "@": "%40", ";": "%3B", "&":"%26" ,":":"%3A"};//Replacing the special characters
      var term = this.state.filematch.trim();
      term = term.replace(/[+@;&:]/g, (m) =>chars[m]);
      var modify = 'unique_file:"' + term + '"';
      searchterm += modify + " AND ";
    }
    if (this.state.wildcardmatch != "") {
      var modify = this.state.wildcardmatch.trim() + "*";
      searchterm += modify + " AND ";
    }
    if (this.state.andmatch != "") {
      var trimmedterm = this.state.andmatch.trim();
      var terms = trimmedterm.split(" ");
      var modify = terms
        .map(function (terms) {
          return '"' + terms + '"';
        })
        .join(" AND ");
      modify = "(" + modify + ")";
      searchterm += modify + " AND ";
    }
    if (this.state.ormatch != "") {
      var trimmedterm = this.state.ormatch.trim();
      var terms = trimmedterm.split(" ");
      var modify = terms
        .map(function (terms) {
          return '"' + terms + '"';
        })
        .join(" OR ");
      modify = "(" + modify + ")";
      searchterm += modify + " AND ";
    }
    // if no match is set create a new query along with serach term

    if (this.state.nowordmatch != "") {
      var modify = this.state.nowordmatch.trim();
      searchterm += " NOT " + modify + " AND ";
    }

    var lastword = searchterm.lastIndexOf(" AND ", searchterm.length - 3);
    searchterm = searchterm.substring(0, lastword);
    const { fireSearch } = this.props;
    if (searchterm.trim() === "") {
      return fireSearch(searchterm);
    }
    fireSearch(searchterm);
  };
  checkBtnStatus = () => {
    if (
      (((((this.state.exactmatch == this.state.filematch) ==
        this.state.wildcardmatch) ==
        this.state.ormatch) ==
        this.state.andmatch) ==
        this.state.nowordmatch) ==
      ""
    ) {
      this.setState({ btnaction: true });
    }
    if (
      this.state.extbtnaction == false ||
      this.state.filebtnaction == false ||
      this.state.wildbtnaction == false ||
      this.state.orbtnaction == false ||
      this.state.andbtnaction == false ||
      this.state.nomatchbtnaction == false
    ) {
      this.setState({ btnaction: false });
    }
  };

  render() {
    return (
      <Fragment>
        <button
          style={{ marginTop: "-4px", marginLeft: "-12px" }}
          className="btn btn-link btnpowerserachicon fontx10"
          placeholder="Click here to start advance search"
          data-toggle="modal"
          title="Click to start your advanced search using keyword"
          data-target="#PoweSearchModal"
        >
          <img src={SearchIcon} width="20" height="20" />
        </button>

        <div
          className="modal fade"
          id="PoweSearchModal"
          role="dialog"
          aria-labelledby="PoweSearchModal"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="PoweSearchModaltitle">
                  Power Search
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  translate="no"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body search-data-modal">
                <form ref={(form) => (this.form = form)}>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <nobr>Exact/Phrase Match</nobr>{" "}
                        </td>
                        <td> : </td>
                        <td style={{ width: "100%" }}>
                          <input
                            type="text"
                            autoComplete="off"
                            className="powersearchfield exactmatch"
                            placeholder="Search a exact match in the document"
                            onChange={this.updateExactMatch}
                            value={this.state.exactmatch}
                          />
                          {this.state.ErrorMsg1 != "" && (
                            <span style={{ color: "red" }}>
                              {this.state.ErrorMsg1}
                            </span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>File Match </td>
                        <td> : </td>
                        <td>
                          <input
                            type="text"
                            autoComplete="off"
                            className="powersearchfield filematch"
                            placeholder="Search a particular column or a specific document"
                            id="filesearch"
                            onChange={this.updateFileMatch}
                            value={this.state.filematch}
                          />
                          {this.state.ErrorMsg2 != "" && (
                            <span style={{ color: "red" }}>
                              {this.state.ErrorMsg2}
                            </span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Wildcard Match </td>
                        <td> : </td>
                        <td>
                          <input
                            type="text"
                            autoComplete="off"
                            className="powersearchfield"
                            placeholder="Search for any word starts with or a partial keyword"
                            id="wildsearch"
                            onChange={this.updateWildCardMatch}
                            value={this.state.wildcardmatch}
                          />
                          {this.state.ErrorMsg3 != "" && (
                            <span style={{ color: "red" }}>
                              {this.state.ErrorMsg3}
                            </span>
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td>Not Match </td>
                        <td> : </td>
                        <td>
                          <input
                            type="text"
                            autoComplete="off"
                            className="powersearchfield"
                            placeholder="Type in any keyword to exclusion"
                            id="nomatchsearch"
                            onChange={this.updateNoMatch}
                            value={this.state.nowordmatch}
                          />
                          {this.state.ErrorMsg6 != "" && (
                            <span style={{ color: "red" }}>
                              {this.state.ErrorMsg6}
                            </span>
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td>AND Match </td>
                        <td> : </td>
                        <td>
                          <input
                            type="text"
                            autoComplete="off"
                            className="powersearchfield"
                            placeholder="Search a keyword with AND clause"
                            onChange={this.updateANDMatch}
                            value={this.state.andmatch}
                          />
                          {this.state.ErrorMsg4 != "" && (
                            <span style={{ color: "red" }}>
                              {this.state.ErrorMsg4}
                            </span>
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td>Either OR Match</td>
                        <td> : </td>
                        <td>
                          {" "}
                          <input
                            type="text"
                            autoComplete="off"
                            className="powersearchfield"
                            placeholder="Search a keyword with OR clause"
                            onChange={this.updateEitherORMatch}
                            value={this.state.ormatch}
                          />
                          {this.state.ErrorMsg5 != "" && (
                            <span style={{ color: "red" }}>
                              {this.state.ErrorMsg5}
                            </span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          {!this.state.btnaction && (
                            <button
                              id="ClearBtnPowerSearch"
                              type="reset"
                              onClick={this.updateState}
                            >
                              Clear All
                            </button>
                          )}

                          <button
                            id="BtnPowerSearch"
                            disabled={this.state.btnaction}
                            data-dismiss="modal"
                            onClick={this.doSearchstart}
                          >
                            Power Search
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default PowerSearch;
