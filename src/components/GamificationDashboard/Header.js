import React, { Fragment, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import logo from "../../img/logo/anps-logo-big01.png";
import { Link } from "react-router-dom";
import URLConfig from "../URLConfig";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: "Login...",
      Country: "",
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
    };
    this.multiselectRef = React.createRef();
    this.signal = axios.CancelToken.source();
  }

  goToHome = () => {
    window.location.href = window.location.href;
  };

  componentDidMount() {
    if (Cookies.get("empnumber") === undefined) {
      //redirect for Auth
      window.location.href = URLConfig.getURL_OAuth();
    }
    if (Cookies.get("empnumber") !== undefined) {
      this.setState({
        Name: Cookies.get("name"),
        Country: Cookies.get("country"),
        //Roles: Cookies.get("empnumber"),
      });
    }
  }

  render() {
    return (
      <>
        <div id="header" className="col-12">
          <div className="row">
            <div className="col-6 pt-2 pointer" id="logo">
              <Link to="/">
                <img
                  alt="HPE Logo"
                  src={logo}
                  height="60"
                  className={
                    !this.state.SearchInitiated
                      ? "header-logo-only-hp"
                      : "display-none header-logo-only-hp"
                  }
                  // onClick={() => this.goToHome()}
                />
              </Link>
            </div>

            <div className="col-6 row pr-0">
              <div className="col-6"></div>
              <div className="col-6 user-info pt-2">
                <span className="username">{this.state.Name}</span>
                <p className="">
                  <span className="department mr-1">{this.state.Country}</span>
                  {/* <i className="fas fa-globe mr-2" style={{fontSize : "14px"}}> </i> */}
                </p>
              </div>
              {/* <div className="mutlisepct-topbox mutlisepct-topbox2">
                {this.state &&
                  this.state.Environment === "UAT" &&
                  this.state.Roles &&
                  this.state.Roles.length > 0 && (
                    <MultiSelect
                      options={this.state.Roles}
                      selected={this.state.selected}
                      disableSearch={true}
                      onSelectedChanged={(selected) =>
                        this.setSelected(selected)
                      }
                      overrideStrings={{
                        selectSomeItems: "Select Roles",
                        allItemsAreSelected: "All",
                        selectAll: "Select All",
                      }}
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
                    
                  </>
                )}
              </div> */}
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default Header;
