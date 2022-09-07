// import React from "react";
// import Cookies from "js-cookie";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { map, filter, slice, uniqBy } from "lodash";
// import "react-toastify/dist/ReactToastify.css";

// import tiplogo from "../img/search-tips.png";
// import AccountNameAutoSuggest from "./AccountNameAutoSuggest";
// import PowerSearchModal from "./PowerSearch/PowerSearch";
// import URLConfig from "./URLConfig";
// import DocumentsAutoSuggest from "./DocumentsAutoSuggest";

// class SearchForm extends React.Component {
//   state = {
//     searchText: "",
//     customerID: "",
//     revenueData: null,
//     showRefineSearch: false,
//     fineSearch: "",
//     searchType: "",
//     accountNameValue: "",
//     searchHistory: [],
//   };

//   // componentDidMount() {
//   //   this.fetchSearchHistory();
//   // }
//   // componentDidUpdate(prevProps) {
//   //   if (this.props.searchTerm !== prevProps.searchTerm) {
//   //     this.fetchSearchHistory();
//   //   }
//   // }

//   fetchSearchHistory = async () => {
//     const URL =
//       URLConfig.getURL_UserTracking() +
//       "/" +
//       Cookies.get("empnumber") +
//       "/" +
//       "Search";
//     try {
//       const res = await axios.get(URL);
//       if (res && res.data) {
//         this.setState({ searchHistory: res.data });
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   toggleRefineSearch = () => {
//     let oldValue = this.state.showRefineSearch;
//     this.setState({ showRefineSearch: !oldValue });
//   };
//   setActiveFilter = (filter) => {
//     this.setState({ searchType: filter });
//   };
//   onFineSearchChange = (e) => {
//     let fineSearch = e.target.value.trim();
//     this.setState({ fineSearch, customerID: fineSearch });
//     this.identifySearchType(fineSearch);
//   };
//   isNumber = (str) => {
//     var reg = new RegExp("^[0-9]+$");
//     return reg.test(str);
//   };
//   identifySearchType = (fineSearch) => {
//     if (fineSearch.length > 2) {
//       if (this.isNumber(fineSearch)) {
//         this.setState({ searchType: "ST ID" });
//       } else if (fineSearch.toUpperCase().indexOf("PR-") === 0) {
//         this.setState({ searchType: "PR ID" });
//       } else if (
//         fineSearch.toUpperCase().indexOf("OPP") === 0 ||
//         fineSearch.toUpperCase().indexOf("OPE") === 0
//       ) {
//         this.setState({ searchType: "OPP ID" });
//       } else if (
//         URLConfig.get_countryCode().indexOf(
//           fineSearch.substring(0, 2).toUpperCase()
//         ) !== -1 &&
//         fineSearch.indexOf("-") === 3
//       ) {
//         this.setState({ searchType: "WBS ID" });
//       } else {
//         this.setState({
//           searchType: "Account Name",
//           accountNameValue: fineSearch,
//         });
//       }
//     }
//     if (fineSearch.length === 0) {
//       this.setState({ searchType: "", accountNameValue: "" });
//     }
//   };
//   fireCustomerCapsuleSearch = () => {
//     const { onCustomerSubmit } = this.props;
//     const { onSubmit } = this.props;

//     //Validations
//     if (this.state.searchType && this.state.searchType === "OPP ID") {
//       if (this.state.fineSearch.length !== 14) {
//         toast.error("Please enter valid Opportunity ID", {
//           position: "top-right",
//           autoClose: 4000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
//         return;
//       }
//     } else if (this.state.searchType && this.state.searchType === "WBS ID") {
//       if (this.state.fineSearch.length !== 9) {
//         toast.error("Please enter valid WBS ID", {
//           position: "top-right",
//           autoClose: 4000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
//         return;
//       }
//     } else if (this.state.searchType && this.state.searchType === "ST ID") {
//       let re = new RegExp("^[0-9]*$");
//       if (!this.state.fineSearch.match(re)) {
//         toast.error("Please enter valid ST ID", {
//           position: "top-right",
//           autoClose: 4000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
//         return;
//       }
//     } else if (this.state.searchType && this.state.searchType === "PR ID") {
//       if (!this.state.fineSearch.startsWith("PR-")) {
//         toast.error("Please enter valid PR ID", {
//           position: "top-right",
//           autoClose: 4000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
//         return;
//       }
//     } else if (
//       this.state.searchType &&
//       this.state.searchType === "Account Name"
//     ) {
//       let re = new RegExp("/^([0-9]|[a-z])+([0-9a-z]+)$/i");
//       if (
//         !this.state.fineSearch.match(re) &&
//         this.state.fineSearch.length < 10
//       ) {
//         toast.error("Please enter valid Account Name", {
//           position: "top-right",
//           autoClose: 4000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
//         return;
//       }
//     }

//     if (
//       this.state.searchType &&
//       (this.state.searchType === "OPP ID" || this.state.searchType === "WBS ID")
//     ) {
//       const Config = URLConfig.GetSearchKeyByOppID(
//         this.state.fineSearch.trim()
//       );
//       axios(Config).then((res) => {
//         if (res.data && res.data.response) {
//           if (this.state.searchText === "")
//             this.setState({ searchText: res.data.response });
//           onSubmit(this.state.searchText.replace(/[#?&@]/g, " "));
//           onCustomerSubmit(
//             this.state.customerID
//               .trim()
//               .replace(/[#?&@]/g, " ")
//               .toUpperCase()
//               .split(".")[0]
//           );
//         } else if (res.data && res.data.error) {
//           toast.error(res.data.error, {
//             position: "top-right",
//             autoClose: 4000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//           });
//           return;
//         }
//       });
//     } else {
//       setTimeout(() => {
//         const CustID =
//           this.state.searchType === "Account Name"
//             ? this.state.accountNameValue
//             : this.state.fineSearch
//                 .trim()
//                 .replace(/[#?&@]/g, " ")
//                 .toUpperCase()
//                 .split(".")[0];
//         onCustomerSubmit(CustID);

//         this.state.searchText &&
//           onSubmit(this.state.searchText.replace(/[#?&@]/g, " "));
//       }, 1000);
//       //this.state.searchText&&this.doSearch(this.state.searchText.replace(/[#?&@]/g, " "));
//     }
//   };
//   fireSearch = (e) => {
//     this.props.setActiveFilterAndValue(
//       this.state.searchType,
//       this.state.fineSearch
//     );
//     if (e.keyCode === 13) {
//       // Enter key
//       this.fireCustomerCapsuleSearch();
//     }
//   };
//   updateAccountNameSearchKey = (accountNameValue) => {
//     if (accountNameValue.length != 0) {
//       this.setState({ accountNameValue, fineSearch: accountNameValue });
//       this.identifySearchType(accountNameValue);
//     } else {
//       this.setState(
//         {
//           accountNameValue,
//           fineSearch: accountNameValue,
//           searchType: "",
//           customerID: "",
//         },
//         () => {
//           this.fineSearchInput.focus();
//         }
//       );
//     }
//   };
//   updateSearchKey = (searchText) => {
//     this.setState({ searchText: searchText });
//   };
//   doSearch = (searchText) => {
//     const { onSubmit } = this.props;
//     if (searchText.trim() === "") {
//       return;
//     }
//     if (this.state.fineSearch !== "") {
//       this.fireCustomerCapsuleSearch();
//       return;
//     }
//     onSubmit(searchText);
//   };
//   doPowerSearch = (searchText) => {
//     this.setState({ searchText }, () => {
//       this.doSearch(searchText);
//     });
//   };
//   updateInputValue = (evt) => {
//     this.setState({
//       searchText: evt.target.value,
//     });
//   };
//   fireAccountNameSearch = (e) => {
//     let searchId = e;
//     if (searchId) {
//       this.props.setActiveFilterAndValue(this.state.searchType, searchId);
//       this.setState({ customerID: searchId });
//       setTimeout(() => {
//         this.props.onCustomerSubmit(searchId);
//         const { onSubmit } = this.props;
//         this.state.searchText && onSubmit(this.state.searchText);
//       }, 1000);
//     }
//   };
//   ClearSearch = () => {
//     this.setState({
//       searchText: "",
//     });
//   };
//   ClearAdvSearch = () => {
//     this.setState({
//       fineSearch: "",
//     });
//   };
//   ClearAdvnSearch = () => {
//     this.setState({
//       accountNameValue: "",
//       fineSearch: "",
//     });
//   };
//   render() {
//     const size = 15;
//     const searchHistory = slice(
//       filter(
//         uniqBy(this.state.searchHistory, "data"),
//         (item) => item.data !== "*:*"
//       ),
//       0,
//       size
//     );
//     return (
//       <div className="col-12">
//         <div className="col-12" align="center">
//           <div className="row col-12 pr-2">
//             <div className="col-2"></div>
//             {/* <div className="row col-12 mt-2"> */}
//             {/* <div className="col-3 pl-0 pr-0">
//             {searchHistory.length > 0 && (
//               <div className="dropdown">
//                 <button
//                   type="button"
//                   id="last15"
//                   data-toggle={searchHistory.length > 0 ? "dropdown" : ""}
//                   aria-haspopup="true"
//                   aria-expanded="false"
//                   className="btn btn-success dropdown-toggle btn-sm last15header"
//                   style={{ width: "100%" }}
//                 >
//                   My Last 15 Searches
//                 </button>
//                 <div
//                   className="dropdown-menu pt-0 pb-0"
//                   style={{
//                     width: "100%",
//                     height: "200px",
//                     overflowX: "hidden",
//                     overflowY: "auto",
//                   }}
//                   aria-labelledby="last15"
//                 >
//                   <table
//                     className="table table-striped table-sm fontx12"
//                     style={{ width: "100%" }}
//                   >
//                     <tbody>
//                       {map(searchHistory, (item) => (
//                         <tr
//                           key={item.id}
//                           // className="dropdown-item table-dropdown-item"
//                         >
//                           <td
//                             style={{ cursor: "pointer" }}
//                             onClick={() => {
//                               this.props.onSubmit(item.data);
//                             }}
//                           >
//                             {item.data}
//                           </td>
//                           <td>
//                             {item.isExpress && <div className="last15E">E</div>}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//           </div> */}
//             <div className="col-8 pr-1 mt-2" id="SearchAutoSuggestionsPrimary">
//               <DocumentsAutoSuggest
//                 fireSearch={this.doSearch}
//                 value={this.state.searchText}
//                 onSearchValueChange={this.updateSearchKey}
//               />
//               {this.state.searchText !== "" ? (
//                 <span
//                   className="clearsearch sright"
//                   title="Clear"
//                   onClick={this.ClearSearch} translate="no"
//                 >
//                   X
//                 </span>
//               ) : (
//                 ""
//               )}
//               <button
//                 id="btnRefineSearch"
//                 className="btn btn-link float-right f-ten"
//                 onClick={this.toggleRefineSearch}
//               >
//                 Refine Search
//               </button>
//               <img
//                 src={tiplogo}
//                 id="imgTip"
//                 className="tips-icon"
//                 data-toggle="modal"
//                 data-target="#TipsDataModal"
//               />
//             </div>
//             <div className="col-2 ml-0 pl-0 mt-2" style={{ textAlign: "left" }}>
//               <PowerSearchModal fireSearch={this.doPowerSearch} />
//             </div>
//           </div>
//         </div>
//         {this.state.showRefineSearch && (
//           <div className="row col-12" id="refinesearch">
//             <div className="col-3" />
//             <div className="col-6 pr-0 mt-0 pl-4 ml-2" id="SearchOppIDPrimary">
//               {this.state.searchType &&
//               this.state.searchType === "Account Name" ? (
//                 <>
//                   <AccountNameAutoSuggest
//                     fireSearch={this.fireAccountNameSearch}
//                     value={this.state.accountNameValue}
//                     onSearchValueChange={this.updateAccountNameSearchKey}
//                   />
//                   {this.state.accountNameValue != "" ? (
//                     <span
//                       className="clearsearch sright"
//                       title="Clear"
//                       onClick={this.ClearAdvnSearch} translate="no"
//                     >
//                       X
//                     </span>
//                   ) : (
//                     ""
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <input
//                     onChange={this.onFineSearchChange}
//                     value={this.state.fineSearch}
//                     className="form-control form-control-sm search-boxes"
//                     type="text"
//                     placeholder={
//                       "Sales Territory ID / Project ID / PSA Project ID / Opportunity ID / Account Name"
//                     }
//                     onKeyUp={this.fireSearch}
//                     ref={(elem) => (this.fineSearchInput = elem)}
//                   />
//                   {this.state.fineSearch != "" ? (
//                     <span
//                       className="clearsearch sright"
//                       title="Clear"
//                       onClick={this.ClearAdvSearch} translate="no"
//                     >
//                       X
//                     </span>
//                   ) : (
//                     ""
//                   )}
//                 </>
//               )}
//               {/* <label>{this.state.searchType}</label>  */}
//             </div>
//             <div className="col-3" />
//           </div>
//         )}
//         {/* <a href="javascript:AceBrowser.openWindowModeless('https://localhost:44395/Aceoffix/editWord?q=aHR0cHM6Ly9ocGVkZWx0YS5jb206ODA4Mi9NYXN0ZXIlMjBTZXJ2aWNlcyUyMFJlcG9zaXRvcnkvSFBFJTIwV29ya2xvYWQlMjBNb2Rlcm5pemF0aW9uJTIwRGVzaWduJTIwU1ZDJTIwU2VydmljZSUyMERlbGl2ZXJ5JTIwR3VpZGUuZG9j', 'width=1200px;height=800px;');"> Edit Word document online</a>
//           <br/>
//           <a href="javascript:AceBrowser.openWindowModeless('https://localhost:44395/Aceoffix/editWord?q=aHR0cHM6Ly9ocGVkZWx0YS5jb206ODA4Mi9IeWJyaWQlMjBJVCUyMFByYWN0aWNlL01hc3RlckRhdGFTaGVldC54bHNt', 'width=1200px;height=800px;');"> Edit XL document online</a> */}
//       </div>
//     );
//   }
// }
// export default SearchForm;
import React from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { map, filter, slice, uniqBy } from "lodash";
import "react-toastify/dist/ReactToastify.css";

import tiplogo from "../img/search-tips.png";
import AccountNameAutoSuggest from "./AccountNameAutoSuggest";
import PowerSearchModal from "./PowerSearch/PowerSearch";
import URLConfig from "./URLConfig";
import DocumentsAutoSuggest from "./DocumentsAutoSuggest";

class SearchForm extends React.Component {
  state = {
    searchText: "",
    customerID: "",
    revenueData: null,
    showRefineSearch: false,
    fineSearch: "",
    searchType: "",
    accountNameValue: "",
    searchHistory: [],
  };

  fetchSearchHistory = async () => {
    const URL =
      URLConfig.getURL_UserTracking() +
      "/" +
      Cookies.get("empnumber") +
      "/" +
      "Search";
    try {
      const res = await axios.get(URL);
      if (res && res.data) {
        this.setState({ searchHistory: res.data });
      }
    } catch (error) {
      console.log(error);
    }
  };
  componentDidUpdate(prevProps) {
    if (this.props.searchText !== prevProps.searchText) {
      this.setState({ searchText: this.props.searchText });
    }
    if (
      this.props.activeFilter === "Account Name" &&
      prevProps.CustomerIDValue !== this.props.CustomerIDValue
    ) {
      const showRefineToggleButton = this.props.CustomerIDValue.trim() === "";
      this.setState(
        {
          accountNameValue: this.props.CustomerIDValue,
          fineSearch: this.props.CustomerIDValue,
          searchType: this.props.activeFilter,
          showRefineToggleButton,
          showRefineSearch: true,
        },
        () => this.fireAccountNameSearch(this.props.CustomerIDValue)
      );
    }
  }

  toggleRefineSearch = () => {
    let oldValue = this.state.showRefineSearch;
    this.setState({ showRefineSearch: !oldValue });
  };
  setActiveFilter = (filter) => {
    this.setState({ searchType: filter });
  };
  onFineSearchChange = (e) => {
    let fineSearch = e.target.value;
    this.setState({ fineSearch, customerID: fineSearch });
    this.identifySearchType(fineSearch);
  };
  isNumber = (str) => {
    var reg = new RegExp("^[0-9]+$");
    return reg.test(str);
  };
  identifySearchType = (fineSearch) => {
    var hasNumber = /\d/;
    if (fineSearch.length > 2) {
      if (this.isNumber(fineSearch) && fineSearch.length < 10) {
        this.setState({ searchType: "ST ID" });
      } else if (fineSearch.toUpperCase().indexOf("PR-") === 0) {
        this.setState({ searchType: "PR ID" });
      } else if (
        fineSearch.toUpperCase().indexOf("OPP") === 0 ||
        fineSearch.toUpperCase().indexOf("OPE") === 0
      ) {
        this.setState({ searchType: "OPP ID" });
      } else if (
        URLConfig.get_countryCode().indexOf(
          fineSearch.substring(0, 2).toUpperCase()
        ) !== -1 &&
        fineSearch.indexOf("-") === 3
      ) {
        this.setState({ searchType: "WBS ID" });
      } else if (
        (fineSearch.length === 10 || fineSearch.length === 12) &&
        fineSearch.includes("-") === false &&
        !this.isNumber(fineSearch) &&
        hasNumber.test(fineSearch)
      ) {
        this.setState({ searchType: "Serial ID" });
      } else if (
        fineSearch.length === 12 &&
        fineSearch.includes("-") === false &&
        this.isNumber(fineSearch)
      ) {
        this.setState({ searchType: "Service Agreement Id" });
      } else {
        this.setState({
          searchType: "Account Name",
          accountNameValue: fineSearch,
        });
      }
    }
    if (fineSearch.length === 0) {
      this.setState({ searchType: "", accountNameValue: "" });
    }
  };
  isAlphaNumeric = (str) => {
    var reg = new RegExp(/^[A-Za-z0-9]+$/);
    return reg.test(str);
  };
  fireCustomerCapsuleSearch = () => {
    debugger;
    const { onCustomerSubmit } = this.props;
    const { onSubmit } = this.props;

    //Validations
    if (this.state.searchType && this.state.searchType === "OPP ID") {
      if (this.state.fineSearch.length !== 14) {
        toast.error("Please enter valid Opportunity ID", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    } else if (this.state.searchType && this.state.searchType === "WBS ID") {
      if (this.state.fineSearch.length !== 9) {
        toast.error("Please enter valid WBS ID", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    } else if (this.state.searchType && this.state.searchType === "ST ID") {
      let re = new RegExp("^[0-9]*$");
      if (!this.state.fineSearch.match(re)) {
        toast.error("Please enter valid ST ID", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    } else if (this.state.searchType && this.state.searchType === "PR ID") {
      if (!this.state.fineSearch.startsWith("PR-")) {
        toast.error("Please enter valid PR ID", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    } else if (this.state.searchType && this.state.searchType === "Serial ID") {
      if (this.state.fineSearch.trim().length < 12) {
        if (this.state.fineSearch.trim().length < 10) {
          toast.error("Please enter valid Serial Number ID ", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          return;
        }
      }
    } else if (
      this.state.searchType &&
      this.state.searchType === "Account Name"
    ) {
      let re = new RegExp("/^([0-9]|[a-z])+([0-9a-z]+)$/i");
      if (
        !this.state.fineSearch.match(re) &&
        this.state.fineSearch.length < 10
      ) {
        toast.error("Please enter valid Account Name", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    }

    if (
      this.state.searchType &&
      (this.state.searchType === "OPP ID" || this.state.searchType === "WBS ID")
    ) {
      const Config = URLConfig.GetSearchKeyByOppID(
        this.state.fineSearch.trim()
      );
      axios(Config).then((res) => {
        if (res.data && res.data.response) {
          if (this.state.searchText === "")
            this.setState({ searchText: res.data.response });
          onSubmit(this.state.searchText.replace(/[#?&@]/g, " "));
          // commenting the below code as it makes the search function to execute twice
          // onCustomerSubmit(
          //   this.state.customerID
          //     .trim()
          //     .replace(/[#?&@]/g, " ")
          //     .toUpperCase()
          //     .split(".")[0]
          // );
        } else if (res.data && res.data.error) {
          toast.error(res.data.error, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          return;
        }
      });
    }
    if (this.state.searchType && this.state.searchType === "Serial ID") {
      onCustomerSubmit(this.state.fineSearch);
    } else {
      setTimeout(() => {
        const CustID =
          this.state.searchType === "Account Name"
            ? this.state.accountNameValue
            : this.state.fineSearch
                .trim()
                .replace(/[#?&@]/g, " ")
                .toUpperCase()
                .split(".")[0];
        onCustomerSubmit(CustID);

        this.state.searchText &&
          onSubmit(this.state.searchText.replace(/[#?&@]/g, " "));
      }, 1000);
      //this.state.searchText&&this.doSearch(this.state.searchText.replace(/[#?&@]/g, " "));
    }
  };

  fireSearch = (e) => {
    this.props.setActiveFilterAndValue(
      this.state.searchType,
      this.state.fineSearch
    );
    if (e.keyCode === 13) {
      // Enter key
      this.fireCustomerCapsuleSearch();
    }
  };

  updateAccountNameSearchKey = (accountNameValue) => {
    if (accountNameValue.length != 0) {
      this.setState({ accountNameValue, fineSearch: accountNameValue });
      this.identifySearchType(accountNameValue);
    } else {
      this.setState(
        {
          accountNameValue,
          fineSearch: accountNameValue,
          searchType: "",
          customerID: "",
        },
        () => {
          this.fineSearchInput.focus();
        }
      );
    }
  };
  updateSearchKey = (searchText) => {
    this.setState({ searchText: searchText });
  };
  doSearch = (searchText) => {
    const { onSubmit } = this.props;
    if (searchText.trim() === "") {
      return;
    }
    if (this.state.fineSearch !== "") {
      this.fireCustomerCapsuleSearch();
      return;
    }
    onSubmit(searchText);
  };
  doPowerSearch = (searchText) => {
    this.setState({ searchText }, () => {
      this.doSearch(searchText);
    });
  };
  updateInputValue = (evt) => {
    this.setState({
      searchText: evt.target.value,
    });
  };
  fireAccountNameSearch = (e) => {
    let searchId = e;
    if (searchId) {
      this.props.setActiveFilterAndValue(this.state.searchType, searchId);
      this.setState({ customerID: searchId });
      setTimeout(() => {
        this.props.onCustomerSubmit(searchId);
        const { onSubmit } = this.props;
        this.state.searchText && onSubmit(this.state.searchText);
      }, 1000);
    }
  };
  ClearSearch = () => {
    this.setState({
      searchText: "",
    });
  };
  ClearAdvSearch = () => {
    this.setState(
      {
        fineSearch: "",
        accountNameValue: "",
      },
      () => this.props.resetRefinedSearch()
    );
  };
  ClearAdvnSearch = () => {
    this.setState(
      {
        accountNameValue: "",
        fineSearch: "",
      },
      () => this.props.resetRefinedSearch()
    );
  };
  render() {
    const size = 15;
    const searchHistory = slice(
      filter(
        uniqBy(this.state.searchHistory, "data"),
        (item) => item.data !== "*:*"
      ),
      0,
      size
    );
    return (
      <>
        {/* <div className="col-12"> */}
        {/*------------------------ From here ------------------------------------*/}
        {/* <div className="col-12"> */}
        <div className="row col-12 pr-0">
          <div className="col-12 pr-0 mt-2 row mb-4">
            <div className="col-11 mr-0 pr-0">
              <div className="searchbox_adj" id="SearchAutoSuggestionsPrimary">
                <DocumentsAutoSuggest
                  fireSearch={this.doSearch}
                  value={this.state.searchText}
                  onSearchValueChange={this.updateSearchKey}
                />
                {this.state.searchText !== "" ? (
                  <span
                    className="clearsearch sright"
                    title="Clear"
                    onClick={this.ClearSearch}
                    translate="no"
                  >
                    X
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-1 mrl-0">
              <PowerSearchModal fireSearch={this.doPowerSearch} />
            </div>

            {/* <div className="col ml-0 pl-0 mt-2" style={{ textAlign: "right" }}>
              <PowerSearchModal fireSearch={this.doPowerSearch} />
            </div> */}
            <button
              id="btnRefineSearch"
              className="btn btn-link float-right f-ten refine_text"
              style={{
                position: "absolute",
                right: "25px",
                top: "25px",
              }}
              onClick={this.toggleRefineSearch}
            >
              {/* Refine Search */}
              Click here to refine your search
            </button>
            {/* <img
              src={tiplogo}
              id="imgTip"
              className="tips-icon"
              data-toggle="modal"
              data-target="#TipsDataModal"
            /> */}
          </div>
        </div>
        {/* </div> */}
        {/* --------------------------------------To here --------------------------------------------*/}
        {this.state.showRefineSearch && (
          <div className="row col-12 pr-2" id="refinesearch">
            <div className="col-11 mt-2 pr-2" id="SearchOppIDPrimary">
              {/* <div className="col-6 pr-0 mt-0 pl-4 ml-2" id="SearchOppIDPrimary"> */}
              {this.state.searchType &&
              this.state.searchType === "Account Name" ? (
                <>
                  <AccountNameAutoSuggest
                    fireSearch={this.fireAccountNameSearch}
                    value={this.state.accountNameValue}
                    onSearchValueChange={this.updateAccountNameSearchKey}
                    setActiveFilterAndValue={this.props.setActiveFilterAndValue}
                    searchType={this.state.searchType}
                  />
                  {this.state.accountNameValue != "" ? (
                    <span
                      className="clearsearch sright"
                      title="Clear"
                      onClick={this.ClearAdvnSearch}
                      translate="no"
                    >
                      X
                    </span>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                <>
                  <input
                    onChange={this.onFineSearchChange}
                    value={this.state.fineSearch}
                    className="form-control form-control-sm search-boxes"
                    type="text"
                    style={{ borderRadius: "0px" }}
                    placeholder={
                      "Sales Territory ID / Project ID / PSA Project ID / Opportunity ID / Account Name / Serial No / SAID"
                    }
                    onKeyUp={this.fireSearch}
                    ref={(elem) => (this.fineSearchInput = elem)}
                    autoFocus
                  />
                  {this.state.fineSearch != "" ? (
                    <span
                      className="clearsearch sright"
                      title="Clear"
                      onClick={this.ClearAdvSearch}
                      translate="no"
                    >
                      X
                    </span>
                  ) : (
                    ""
                  )}
                </>
              )}
              {/* <label>{this.state.searchType}</label>  */}
            </div>
            <div className="col-3" />
          </div>
        )}
        {/* <a href="javascript:AceBrowser.openWindowModeless('https://localhost:44395/Aceoffix/editWord?q=aHR0cHM6Ly9ocGVkZWx0YS5jb206ODA4Mi9NYXN0ZXIlMjBTZXJ2aWNlcyUyMFJlcG9zaXRvcnkvSFBFJTIwV29ya2xvYWQlMjBNb2Rlcm5pemF0aW9uJTIwRGVzaWduJTIwU1ZDJTIwU2VydmljZSUyMERlbGl2ZXJ5JTIwR3VpZGUuZG9j', 'width=1200px;height=800px;');"> Edit Word document online</a>
          <br/>
          <a href="javascript:AceBrowser.openWindowModeless('https://localhost:44395/Aceoffix/editWord?q=aHR0cHM6Ly9ocGVkZWx0YS5jb206ODA4Mi9IeWJyaWQlMjBJVCUyMFByYWN0aWNlL01hc3RlckRhdGFTaGVldC54bHNt', 'width=1200px;height=800px;');"> Edit XL document online</a> */}

        {/* </div> */}
      </>
    );
  }
}
export default SearchForm;
