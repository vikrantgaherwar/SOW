import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";

import logo from "../../img/logo/anps-logo-big01.png";
import logo_results_page from "../../img/logo/anps-logo-big01.png";
import URLConfig from "../URLConfig";
import { UserContext } from "../../UserContext";
import RolesDropdown from "../RolesDropdown";

const Header = (props) => {
  let history = useHistory();

  const [user, dispatch] = useContext(UserContext);
  const [userDetails, setUserDetails] = useState({});
  const [rolesData, setRolesData] = useState([]);
  const [selectedRoleValues, setSelectedRoleValues] = useState([]);

  useEffect(() => {
    if (user?.isLoggedIn) {
      const rolesData = [];
      user.AllRoles.forEach((element) => {
        rolesData.push({ label: element.role, value: element.roleSolar });
      });
      setRolesData(rolesData);
      var userRoles = Cookies.get("roles")?.split(",");
      var userRoleNames = Cookies.get("roleNames")?.split(",");
      if (userRoles.length === 1) {
        if (userRoles[0] === "Guest") {
          userRoles.pop();
        }
      }
      setUserDetails({
        name: user.Name,
        country: user.Country,
        selected: userRoles,
        selectedRoleNames: userRoleNames,
      });
      setSelectedRoleValues(userRoles);
    }
  }, [user]);

  const goToHome = () => {
    history.push("/");
  };

  const setSelected = (selected) => {
    setUserDetails((prevState) => ({ ...prevState, selected }));
    props.updateRoles(selected);
  };

  const onRollChange = (e) => {
    let selectedRoles = [...userDetails.selected];
    let values = [...selectedRoleValues];
    const { value, checked, name } = e.target;
    if (value === "0" && checked) {
      selectedRoles = rolesData.map((i) => i.value);
      values = rolesData.map((i) => i.label);
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

    setSelectedRoleValues(values);
    setSelected(selectedRoles);
  };

  return (
    <div id="header" className="col-12">
      <div className="row">
        <div className="col-4 pt-2" id="logo">
          <img
            alt="HPE Logo"
            src={logo}
            height="60"
            className="header-logo-only-hp"
            onClick={() => goToHome()}
          />
          <img
            src={logo_results_page}
            height="55"
            className="display-none header-logo-with-anps"
            onClick={() => goToHome()}
          />
        </div>
        <div className="col-3">&nbsp;</div>
        <div className="col-5 row pr-0">
          <div className="col-6">&nbsp;</div>
          <div className="col-6 user-info pt-2">
            <span className="username">{userDetails.name}</span>
            <p>
              <span className="department">{userDetails.country}</span>
              {/* {this.state.Name !== "Login..." &&
                <span className="department pointer"
                data-toggle="modal"
                data-target="#LanguageSelectionModal"
                ><u style={{ borderBottom: "1px dotted #fff",
                  textDecoration: "none"}}>({this.getLangaugeNameByCode(this.state.UserLang)})</u>
                </span>
                } */}
              {/* <span id="google_translate_element" className="display-none"></span>   */}
            </p>
            <div className="mutlisepct-topbox mutlisepct-topbox2">
              {URLConfig.get_Environment() === "UAT" && rolesData?.length > 0 && (
                // <MultiSelect
                //   options={rolesData}
                //   selected={userDetails.selected}
                //   disableSearch={true}
                //   onSelectedChanged={(selected) => setSelected(selected)}
                //   overrideStrings={{
                //     selectSomeItems: "Select Roles",
                //     allItemsAreSelected: "All",
                //     selectAll: "Select All",
                //   }}
                // />
                <RolesDropdown
                  onChange={onRollChange}
                  selectedRoleValues={selectedRoleValues}
                  Roles={rolesData}
                />
              )}
              {URLConfig.get_Environment() === "PROD" && (
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

                    {userDetails?.selected?.length === 0 ? (
                      <span>Guest</span>
                    ) : (
                      <span>{userDetails?.selectedRoleNames?.join(", ")}</span>
                    )}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
