import React, { Fragment, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { NavDropdown } from "react-bootstrap/";
import { map, filter, uniqBy, slice } from "lodash";
import logo from "../img/logo/anps-logo-big01.png";
import gold from "../img/medal-icons/gold.png";
import bronze from "../img/medal-icons/bronze.png";
import silver from "../img/medal-icons/silver.png";
import diamond from "../img/medal-icons/diamond.png";
import platinum from "../img/medal-icons/platinum.png";
import white from "../img/medal-icons/white.png";
import { UserTracking } from "../components/Feedback/SurveyDetails";
import logo_results_page from "../img/logo/anps-logo-big01.png";
import TrackingService from "./TrackingService";
import URLConfig from "./URLConfig";
import { UserContext } from "../UserContext";
import { OverlayTrigger, Tooltip } from "react-bootstrap/";
import { getGoogleTranslatedLanguages } from "../utils/Languages";
import {
  fetchUserBookmarkDetails,
  fetchUserDeltaShareDetails,
} from "./Common/GeneralFunctions";
import GamificationModal from "./Gamification/Gamificationmodal";
import RolesDropdown from "./RolesDropdown";

class HeaderForm extends React.Component {
  constructor(props) {
    super(props);
    this.TrackingService = new TrackingService();
    this.state = {
      Name: "Login...",
      Country: "",
      selected: [],
      Roles: [],
      searchHistory: [],
      SearchInitiated: false,
      Environment: "UAT",
      LanguagesArr: [],
      SelectedLanguage: "",
      UserLang: "en",
      medalPoints: 0,
      medalpics: "",
      medalText: "",
      isGamificationUP: false,
      showPoints: false,
      show: false,
      showUser: false,
      allRolesSelected: false,
      selectedRoleValues: [],
      showGamificationLeaderDashBoard: false,
    };
    this.multiselectRef = React.createRef();
    this.signal = axios.CancelToken.source();
  }

  googleTranslateElementInit = () => {
    const Lang = this.state.UserLang;
    Cookies.set("googtrans", "/en/en");
    new window.google.translate.TranslateElement(
      { pageLanguage: "en" },
      "google_translate_element"
    );

    // this.waitForElementToDisplay(
    //   ".goog-te-combo",
    //   () => {
    //     var select = document.getElementsByClassName("goog-te-combo")[0];
    //     if (select) {
    //       select.addEventListener("change", function () {});
    //       const language =
    //         Cookies.get("UserLang") == null ? "en" : Cookies.get("UserLang");
    //       select.value = language;
    //       select.dispatchEvent(new Event("change"));
    //     }
    //   },

    //   500,
    //   9000
    // );
  };

  waitForElementToDisplay = (
    selector,
    callback,
    checkFrequencyInMs,
    timeoutInMs
  ) => {
    var startTimeInMs = Date.now();
    (function loopSearch() {
      if (
        document.querySelector(selector) != null &&
        document.getElementsByClassName("goog-te-combo")[0]?.options?.length
      ) {
        callback();
        return;
      } else {
        setTimeout(function () {
          if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) return;
          loopSearch();
        }, checkFrequencyInMs);
      }
    })();
  };

  componentDidMount() {
    var addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = this.googleTranslateElementInit;

    this.fetchSearchHistory(this.signal.token);
    const { user } = this.props;
    const { SearchInitiated } = this.props;
    var Environment = URLConfig.get_Environment();

    const size = 5;
    var Languages = getGoogleTranslatedLanguages();
    const LanguagesArr = Languages.reduce((acc, curr, i) => {
      if (!(i % size)) {
        // if index is 0 or can be divided by the `size`...
        acc.push(Languages.slice(i, i + size)); // ..push a chunk of the original array to the accumulator
      }
      return acc;
    }, []);

    var UserLang =
      Cookies.get("UserLang") == null ? "en" : Cookies.get("UserLang");

    if (SearchInitiated) {
      this.setState({ SearchInitiated, LanguagesArr, UserLang });
    }
    if (user && user.isLoggedIn) {
      const RolesData = [];
      user.AllRoles.forEach((element) => {
        //if(element.role.indexOf("KSO") == -1)
        RolesData.push({ label: element.role, value: element.roleSolar });
      });
      var userRoles = Cookies.get("roles")?.split(",");
      var userRoleNames = Cookies.get("roleNames")?.split(",");
      if (userRoles.length === 1) {
        if (userRoles[0] === "Guest") {
          userRoles.pop();
        }
      }
      //userRoles = userRoles.filter(x=>x!== "Admin" && x!== "Analyst" && x!== "Process" && x!== "Specialist");
      this.setState({
        Name: user.Name,
        Country: user.Country,
        selected: userRoles,
        Roles: RolesData,
        selectedRoleNames: userRoleNames,
        selectedRoleValues: userRoles,
        UserLang,
      });
    }
    this.setState({ Environment, LanguagesArr, UserLang });
    this.medalPointsDataService();
  }

  componentDidUpdate(prevProps) {
    if (this.props.searchTerm !== prevProps.searchTerm) {
      this.fetchSearchHistory(this.signal.token);
    }
    if (this.props.hasTouched !== prevProps.hasTouched) {
      this.setState({
        showPoints: !this.props.hasTouched,
      });
    }
    const { user } = this.props;
    const { SearchInitiated } = this.props;
    var Environment = URLConfig.get_Environment();
    if (this.props.SearchInitiated !== prevProps.SearchInitiated) {
      this.setState({ SearchInitiated });
    }
    if (this.props.user !== prevProps.user && user.isLoggedIn) {
      const RolesData = [];
      user.AllRoles.forEach((element) => {
        //if(element.role.indexOf("KSO") == -1)
        RolesData.push({ label: element.role, value: element.roleSolar });
      });
      var userRoles = Cookies.get("roles")?.split(",");
      var userRoleNames = Cookies.get("roleNames")?.split(",");
      if (userRoles.length === 1) {
        if (userRoles[0] === "Guest") {
          userRoles.pop();
        }
      }
      //userRoles = userRoles.filter(x=>x!== "Admin" && x!== "Analyst" && x!== "Process" && x!== "Specialist");
      this.setState({
        Name: user.Name,
        Country: user.Country,
        selected: userRoles,
        Roles: RolesData,
        selectedRoleNames: userRoleNames,
        selectedRoleValues: userRoles,
      });
    }
    if (this.props.Environment !== prevProps.Environment) {
      this.setState({ Environment });
    }
    if (this.props.hasTouched !== prevProps.hasTouched) {
      this.setState({
        showPoints: !this.props.hasTouched,
      });
    }
  }

  componentWillUnmount() {
    this.signal.cancel("Request Cancelled");
    // if(this.timer){
    //   clearTimeout(this.timer);
    // }
  }

  fetchSearchHistory = async (cancelToken) => {
    const URL =
      URLConfig.getURL_UserTracking() +
      "/" +
      Cookies.get("empnumber") +
      "/" +
      "Search";
    try {
      const res = await axios.get(URL, { cancelToken });
      if (res && res.data) {
        this.setState({ searchHistory: res.data });
      }
    } catch (error) {
      console.warn(error);
    }
  };

  goToHome = () => {
    window.location.href = window.location.href;
  };

  setSelected = (selected) => {
    const { updateRoles } = this.props;
    this.setState({ selected });
    updateRoles(selected);
  };

  handleRemoveBookmark = (bookmark) => {
    const { dispatch } = this.props;
    const URL = URLConfig.getURL_UserBookMark() + "/UserBookmark";
    axios
      .put(URL, {
        ...bookmark,
        isBookmarked: false,
      })
      .then(() => {
        fetchUserBookmarkDetails(dispatch);
      });
  };
  handleGamificationModal = () => {
    this.TrackingService.LogGamificationModalClick(
      Cookies.get("empnumber"),
      true
    );
    this.setState({ show: !this.state.show });
  };
  gamificationDashboard = () => {
    this.TrackingService.LogGamificationDashboardClick(
      Cookies.get("empnumber"),
      true
    );
  };
  lastsearchHistory = (item) => {
    this.TrackingService.LogLast15SearchClick(
      Cookies.get("empnumber"),
      item,
      true
    );
  };
  newShareDoc = (item) => {
    this.TrackingService.LogNewDocClick(Cookies.get("empnumber"), item, true);
  };
  logBookMarks = (item) => {
    this.TrackingService.LogNewBookMarkClick(
      Cookies.get("empnumber"),
      item,
      true
    );
  };

  handleRemoveNew = (item) => {
    const { dispatch } = this.props;
    const URL = URLConfig.getURL_UserBookMark() + "/ShareViaDelta";
    axios
      .put(URL, {
        ...item,
        isNew: false,
      })
      .then(() => {
        fetchUserDeltaShareDetails(dispatch);
      });
  };

  clearAllDeltaShares = async () => {
    const { dispatch } = this.props;
    const URL =
      URLConfig.getURL_UserBookMark() +
      "/RemoveAllDeltaShare/" +
      Cookies.get("mail");
    try {
      const res = await axios.delete(URL);
      if (res.status === 200) {
        fetchUserDeltaShareDetails(dispatch);
      }
    } catch (error) {
      console.log(error);
    }
  };

  clearAllBookmarks = async () => {
    const { dispatch } = this.props;
    const URL =
      URLConfig.getURL_UserBookMark() +
      "/RemoveAllUserBookmark/" +
      Cookies.get("empnumber");
    try {
      const res = await axios.delete(URL);
      if (res.status === 200) {
        fetchUserBookmarkDetails(dispatch);
      }
    } catch (error) {
      console.log(error);
    }
  };

  onLaungaugeSelection = (SelectedLanguage) => {
    this.setState({ SelectedLanguage });
  };

  SaveLanPreference = () => {
    var select = document.getElementsByClassName("goog-te-combo")[0];
    if (select) {
      select.addEventListener("change", function () {});
    }
    select.value = this.state.SelectedLanguage;
    select.dispatchEvent(new Event("change"));
    Cookies.set("UserLang", this.state.SelectedLanguage);

    this.setState({ UserLang: this.state.SelectedLanguage }, () => {
      var data = JSON.stringify({
        employeeNumber: Cookies.get("empnumber"),
        languagePreference: this.state.SelectedLanguage,
      });

      this.TrackingService.LogLanguageChange(
        Cookies.get("empnumber"),
        this.state.SelectedLanguage,
        true
      );
      var config = {
        method: "post",
        url: URLConfig.getURLDeltaAPI() + "DeltaUser",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios(config)
        .then(function (response) {})
        .catch(function (error) {
          console.log(error);
        });
    });
  };
  getLangaugeNameByCode = (Code) => {
    return getGoogleTranslatedLanguages().find((x) => x.value == Code)?.name;
  };
  medalPointsDataService = () => {
    let PostRequests = [];
    var userTracking = new UserTracking();
    userTracking.UserId = Cookies.get("empnumber");
    userTracking.host = window.location.href.split("?")[0];
    const URL = URLConfig.getURLDeltaAPI() + "UserGamificationDashboard";
    PostRequests.push(axios.post(URL, userTracking));
    axios
      .all(PostRequests)
      .then(
        axios.spread((...responses) => {
          const response = responses;
          this.setState({ isGamificationUP: true });
          if (response.length > 0) {
            //this.setState({medalPoints : 190000})
            this.setState({
              medalPoints: response[0].data.totalPoints,
              showGamificationLeaderDashBoard:
                response[0].data.showLeaderDashBoard,
            });
          }
          if (
            this.state.medalPoints > 5000 &&
            this.state.medalPoints <= 10000
          ) {
            this.setState({ medalpics: bronze });
            this.setState({ medalText: "Bronze(5000+)" });
          } else if (
            this.state.medalPoints > 10000 &&
            this.state.medalPoints <= 25000
          ) {
            this.setState({ medalpics: silver });
            this.setState({ medalText: "Silver(10000+)" });
          } else if (
            this.state.medalPoints > 25000 &&
            this.state.medalPoints <= 50000
          ) {
            this.setState({ medalpics: gold });
            this.setState({ medalText: "Gold(25000+)" });
          } else if (
            this.state.medalPoints > 50000 &&
            this.state.medalPoints <= 100000
          ) {
            this.state.medalpics = platinum;
            this.setState({ medalText: "Platinum(50000+)" });
          } else if (this.state.medalPoints > 100000) {
            this.state.medalpics = diamond;
            this.setState({ medalText: "Diamond(100000+)" });
          } else {
            this.state.medalpics = white;
            this.setState({ medalText: "" });
          }
        })
      )
      .catch((errors) => {
        console.log(errors);
      });
  };

  onRollChange = (e) => {
    let selectedRoles = [...this.state.selected];
    let values = [...this.state.selectedRoleValues];
    const { value, checked, name } = e.target;
    if (value === "0" && checked) {
      selectedRoles = this.state.Roles.map((i) => i.value);
      values = this.state.Roles.map((i) => i.label);
    } else if (value === "0" && !checked) {
      selectedRoles = [];
      values = [];
    } else {
      const role = selectedRoles.find((rl) => rl === name);
      if (checked && !role) {
        selectedRoles.push(name);
        values.push(value);
      } else if (!checked && role) {
        selectedRoles.splice(selectedRoles.indexOf(name), 1);
        values.splice(values.indexOf(value), 1);
      }
    }

    this.setState({ selected: selectedRoles, selectedRoleValues: values });
    this.setSelected(selectedRoles);
  };

  // componentDidUpdate(prevProps) {
  //   if (this.props.hasTouched !== prevProps.hasTouched) {
  //     this.setState({
  //       showPoints: !this.props.hasTouched,
  //     });
  //   }
  // }

  render() {
    const heightPoints = { height: "20px" };
    const heightpoints1 = { height: "20px" };
    const { user } = this.props;

    const userBookmarks = uniqBy(
      filter(user.userBookmarks, (item) => item.isBookmarked),
      "bookmarkURL"
    );
    const userDeltaShares = uniqBy(
      filter(user.userDeltaShares, (item) => item.isNew),
      "documentURL"
    );
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
        <div id="header" className="col-12">
          <div className="row">
            <div className="col-5 pt-2 pointer" id="logo">
              <img
                alt="HPE Logo"
                src={logo}
                height="60"
                className={
                  !this.state.SearchInitiated
                    ? "header-logo-only-hp"
                    : "display-none header-logo-only-hp"
                }
                onClick={() => this.goToHome()}
              />
              <img
                src={logo_results_page}
                height="55"
                className={
                  this.state.SearchInitiated
                    ? "header-logo-with-anps"
                    : "display-none header-logo-with-anps"
                }
                onClick={() => this.goToHome()}
              />
            </div>

            {this.state && (
              <>
                <div
                  className="col-2  pt-2"
                  title="Dashboard Overview"
                  style={{ zIndex: "1" }}
                  onClick={this.gamificationDashboard}
                >
                  {this.state.isGamificationUP && (
                    <div>
                      <NavDropdown
                        title={
                          <img
                            alt="HPE Logo"
                            src={this.state.medalpics}
                            height="35"
                          />
                        }
                        id="basic-nav-dropdown"
                        className="droptoggle gamedropdown"
                      >
                        <NavDropdown.Item
                          style={{
                            fontSize: "12px",
                          }}
                        >
                          <a
                            onClick={() => {
                              window.location.href =
                                window.location.href + "gamification";
                            }}
                            style={{ textDecoration: "underline" }}
                          >
                            {this.state.showGamificationLeaderDashBoard == true
                              ? "Leader Dashboard"
                              : "Points earned: " + this.state.medalPoints}{" "}
                          </a>
                          <i
                            className="pl-2 pt-1 pointer fas fa-info-circle fa-sm"
                            style={{
                              color: "rgb(0, 169, 130)",
                              fontSize: "14px",
                            }}
                            onClick={this.handleGamificationModal}
                            title="Gamification Overview"
                          ></i>
                        </NavDropdown.Item>
                      </NavDropdown>

                      <div
                        style={
                          this.state.medalText.length === 0
                            ? heightpoints1
                            : heightPoints
                        }
                        className="text-center"
                      >
                        {this.state.medalText}
                      </div>
                    </div>
                  )}
                </div>

                <GamificationModal
                  show={this.state.show}
                  handleClose={this.handleGamificationModal}
                  showPoints={this.state.medalPoints}
                />
              </>
            )}

            <div className="col-5 row pr-0">
              <div className="col-2 pt-2 pl-0 pr-0">
                <div className="dropdown">
                  <button
                    className="btn btn-dark header_btn dropdown-toggle"
                    type="button"
                    style={{ marginLeft: "-15px" }}
                    id="dropdownMenuButton"
                    data-toggle={
                      searchHistory && searchHistory.length > 0
                        ? "dropdown"
                        : ""
                    }
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fas fa-dolly" /> <br />
                    <span className="fontx11">Last 15 Searches</span>
                  </button>

                  <div
                    className="dropdown-menu fontx12 pt-0 pb-0"
                    aria-labelledby="dropdownMenuButton"
                    style={{
                      width: "250px",
                      maxHeight: "250px",
                      overflowY: "auto",
                    }}
                  >
                    {map(searchHistory, (item, index) => (
                      <div
                        className="container dropdown-item"
                        key={item.id}
                        style={{
                          backgroundColor:
                            index % 2 ? "" : "rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        <div className="row">
                          <div
                            onClick={() => {
                              this.lastsearchHistory(item.data);
                            }}
                            className={item.isExpress ? "col-10" : "col-12"}
                          >
                            <a
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                var chars = {
                                  "+": "%2B",
                                  "@": "%40",
                                  ";": "%3B",
                                  "&": "%26",
                                  ":": "%3A",
                                }; //Replacing the special characters
                                item.data = item.data
                                  .trim()
                                  .replace(/[+@;&:]/g, (m) => chars[m]);
                                this.props.onSubmit(item.data);
                              }}
                            >
                              <span className="header-word-break">
                                {item.data}
                              </span>
                            </a>
                          </div>
                          {item.isExpress && (
                            <div className="col-2">
                              <div className="last15E">E</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-2 pt-2 pl-0 pr-0">
                <div className="dropdown">
                  {/* {userDeltaShares && userDeltaShares.length > 0 && (
                  <div className="notification">{userDeltaShares.length}</div>
                )} */}
                  <button
                    className="btn btn-dark header_btn dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    style={{ marginLeft: "17px" }}
                    data-toggle={
                      userDeltaShares && userDeltaShares.length > 0
                        ? "dropdown"
                        : ""
                    }
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="far fa-star">
                      {userDeltaShares && userDeltaShares.length > 0 && (
                        <span className="notbadge">
                          {userDeltaShares.length}
                        </span>
                      )}
                    </i>
                    <br />
                    <span className="fontx11">New</span>
                  </button>
                  <div
                    className="dropdown-menu fontx12 pt-0 pb-0"
                    aria-labelledby="dropdownMenuButton"
                    style={{
                      width: "250px",
                      maxHeight: "250px",
                      overflowY: "auto",
                    }}
                  >
                    {userDeltaShares && userDeltaShares.length > 0 && (
                      <>
                        {map(userDeltaShares, (item, index) => (
                          <div
                            className="container dropdown-item"
                            key={item.id}
                            style={{
                              backgroundColor:
                                index % 2 ? "" : "rgba(0, 0, 0, 0.05)",
                            }}
                          >
                            <div
                              className="row"
                              onClick={() => {
                                this.newShareDoc(item.documentName);
                              }}
                            >
                              <div className="col-10">
                                <a
                                  href=""
                                  onClick={(e) => {
                                    e.preventDefault();
                                    var chars = {
                                      "+": "%2B",
                                      "@": "%40",
                                      ";": "%3B",
                                      "&": "%26",
                                      ":": "%3A",
                                    }; //Replacing the special characters
                                    item.documentName = item.documentName
                                      .trim()
                                      .replace(/[+@;&:]/g, (m) => chars[m]);
                                    if (item.isArchived) {
                                      this.props.onSubmit(
                                        `unique_file:"${item.documentName}"`,
                                        ""
                                      );
                                    } else {
                                      this.props.onSubmit(
                                        `unique_file:"${item.documentName}"`,
                                        "&fq=-isarchived:True"
                                      );
                                    }
                                  }}
                                >
                                  <span className="header-word-break">
                                    {item.documentName}
                                  </span>
                                  {item.sharedByName && (
                                    <span className="header-word-break fontx11">
                                      (Shared By - {item.sharedByName})
                                    </span>
                                  )}
                                </a>
                              </div>
                              <div className="col-2" align="right">
                                <i
                                  className="fas fa-trash pointer"
                                  onClick={() => this.handleRemoveNew(item)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        {/* Clear All */}
                        <div
                          className="container dropdown-item"
                          style={{
                            backgroundColor:
                              userDeltaShares.length % 2
                                ? ""
                                : "rgba(0, 0, 0, 0.05)",
                          }}
                        >
                          <div className="row">
                            <div className="col-10 ">
                              <a
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.clearAllDeltaShares();
                                }}
                              >
                                <span className="header-word-break">
                                  - Clear All -
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-2 pt-2 pl-0 pr-0">
                <div className="dropdown">
                  {/* {userBookmarks && userBookmarks.length > 0 && (
                  <div className="notification">{userBookmarks.length}</div>
                )} */}
                  <button
                    className="btn btn-dark header_btn dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle={
                      userBookmarks && userBookmarks.length > 0
                        ? "dropdown"
                        : ""
                    }
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="far fa-heart">
                      {userBookmarks && userBookmarks.length > 0 && (
                        <span className="notbadge">{userBookmarks.length}</span>
                      )}
                    </i>
                    <br />
                    <span className="fontx11">Bookmarks</span>
                  </button>
                  <div
                    className="dropdown-menu fontx12 pt-0 pb-0"
                    aria-labelledby="dropdownMenuButton"
                    style={{
                      width: "250px",
                      maxHeight: "250px",
                      overflowY: "auto",
                    }}
                  >
                    {userBookmarks && userBookmarks.length > 0 && (
                      <>
                        {map(userBookmarks, (item, index) => (
                          <div
                            className="container dropdown-item"
                            key={item.id}
                            style={{
                              backgroundColor:
                                index % 2 ? "" : "rgba(0, 0, 0, 0.05)",
                            }}
                          >
                            <div
                              className="row"
                              onClick={() => {
                                this.logBookMarks(item.documentName);
                              }}
                            >
                              <div className="col-10 ">
                                <a
                                  href=""
                                  onClick={(e) => {
                                    e.preventDefault();
                                    var chars = {
                                      "+": "%2B",
                                      "@": "%40",
                                      ";": "%3B",
                                      "&": "%26",
                                      ":": "%3A",
                                    }; //Replacing the special characters
                                    item.documentName = item.documentName
                                      .trim()
                                      .replace(/[+@;&:]/g, (m) => chars[m]);
                                    if (item.isArchived) {
                                      this.props.onSubmit(
                                        `unique_file:"${item.documentName}"`,
                                        ""
                                      );
                                    } else {
                                      this.props.onSubmit(
                                        `unique_file:"${item.documentName}"`,
                                        "&fq=-isarchived:True"
                                      );
                                    }
                                  }}
                                >
                                  <span className="header-word-break">
                                    {item.documentName}
                                  </span>
                                </a>
                              </div>
                              <div className="col-2" align="right">
                                <i
                                  className="fas fa-trash pointer"
                                  onClick={() =>
                                    this.handleRemoveBookmark(item)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        {/* Clear All */}
                        <div
                          className="container dropdown-item"
                          style={{
                            backgroundColor:
                              userBookmarks.length % 2
                                ? ""
                                : "rgba(0, 0, 0, 0.05)",
                          }}
                        >
                          <div className="row">
                            <div className="col-10 ">
                              <a
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.clearAllBookmarks();
                                }}
                              >
                                <span className="header-word-break">
                                  - Clear All Bookmarks -
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-6 user-info pt-2">
                <span className="username">{this.state.Name}</span>
                <p className="">
                  <span className="department mr-1">{this.state.Country}</span>
                  {/* <i className="fas fa-globe mr-2" style={{fontSize : "14px"}}> </i> */}
                  {this.state.Name !== "Login..." && (
                    <span
                      className="department pointer"
                      data-toggle="modal"
                      data-target="#LanguageSelectionModal"
                    >
                      <u
                        translate="no"
                        style={{
                          borderBottom: "1px dotted #fff",
                          textDecoration: "none",
                        }}
                      >
                        ({this.getLangaugeNameByCode(this.state.UserLang)})
                      </u>
                    </span>
                  )}
                  <span
                    id="google_translate_element"
                    className="display-none"
                  ></span>
                </p>
              </div>
              <div className="mutlisepct-topbox mutlisepct-topbox2">
                {this.state &&
                  this.state.Environment === "UAT" &&
                  this.state.Roles &&
                  this.state.Roles.length > 0 && (
                    // <MultiSelect
                    //   options={this.state.Roles}
                    //   selected={this.state.selected}
                    //   disableSearch={true}
                    //   onSelectedChanged={(selected) =>
                    //     this.setSelected(selected)
                    //   }
                    //   overrideStrings={{
                    //     selectSomeItems: "Select Roles",
                    //     allItemsAreSelected: "All",
                    //     selectAll: "Select All",
                    //   }}
                    // />
                    <RolesDropdown
                      onChange={this.onRollChange}
                      selectedRoleValues={this.state.selectedRoleValues}
                      Roles={this.state.Roles}
                    />
                  )}
                {this.state && this.state.Environment === "PROD" && (
                  <>
                    <span className="personaroles">
                      <a
                        style={{ color: "white" }}
                        target="_blank"
                        className="mr-3"
                        href="https://hpe.sharepoint.com/teams/delta/Lists/Role%20Change%20Request/NewForm.aspx?Source=https%3A%2F%2Fhpe%2Esharepoint%2Ecom%2Fteams%2Fdelta%2FLists%2FRole%2520Change%2520Request%2FAllItems%2Easpx&ContentTypeId=0x0100A6F9F50CEA13FD4DA4D5AEF3DAB8E5C3&RootFolder=%2Fteams%2Fdelta%2FLists%2FRole%20Change%20Request"
                      >
                        [ Change Persona ]
                      </a>

                      {this.state.selected.length === 0 ? (
                        <span>Guest</span>
                      ) : (
                        <span>{this.state.selectedRoleNames.join(", ")}</span>
                      )}
                    </span>
                    {/* <span className="" style={{ float: "left" }}>
                      <a
                        style={{ color: "black" }}
                        target="_blank"
                        href="https://hpe.sharepoint.com/teams/delta/Lists/Role%20Change%20Request/NewForm.aspx?Source=https%3A%2F%2Fhpe%2Esharepoint%2Ecom%2Fteams%2Fdelta%2FLists%2FRole%2520Change%2520Request%2FAllItems%2Easpx&ContentTypeId=0x0100A6F9F50CEA13FD4DA4D5AEF3DAB8E5C3&RootFolder=%2Fteams%2Fdelta%2FLists%2FRole%20Change%20Request"
                      >
                        [ Change Persona ]
                      </a>
                    </span> */}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="LanguageSelectionModal"
          role="dialog"
          aria-labelledby="LanguageSelectionModal"
          aria-hidden="true"
          translate="no"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              {/* <div className="modal-header">
                <h5 className="modal-title" id="LanguageSelectionModalTitle">
                 Select Launguage Preference
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div> */}
              <div className="modal-body search-data-modal">
                <table cellSpacing="0" cellPadding="0" border="0">
                  <tbody>
                    <tr valign="top">
                      {this.state.LanguagesArr &&
                        this.state.LanguagesArr?.length > 0 &&
                        this.state.LanguagesArr.map((item, index) => {
                          return (
                            <td key={index} className="pr-2 pl-2">
                              {item.map((v, i) => {
                                return (
                                  <a
                                    key={i}
                                    onClick={() => {
                                      this.onLaungaugeSelection(v.value);
                                    }}
                                    className={
                                      this.state.SelectedLanguage === v.value
                                        ? "lang-item-selected"
                                        : "lang-item"
                                    }
                                    // href="javascript:void(0)"
                                  >
                                    <div>
                                      <span className="indicator">›</span>
                                      <span className="text">{v.name}</span>
                                    </div>
                                  </a>
                                );
                              })}
                            </td>
                          );
                        })}
                    </tr>
                  </tbody>
                </table>
              </div>
              {this.state.SelectedLanguage != "" && (
                <div className="modal-footer">
                  <button
                    id="BtnSavePreference"
                    data-dismiss="modal"
                    onClick={() => {
                      this.SaveLanPreference();
                    }}
                  >
                    Save
                    {/* Save {getGoogleTranslatedLanguages().find(x=>x.value == this.state.SelectedLanguage).name} as default */}
                  </button>
                  <button
                    id="ClearBtnSavePreference"
                    data-dismiss="modal"
                    onClick={() => {
                      this.setState({ SelectedLanguage: "" });
                    }}
                  >
                    Cancel
                    {/* Save {getGoogleTranslatedLanguages().find(x=>x.value == this.state.SelectedLanguage).name} as default */}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default HeaderForm;
