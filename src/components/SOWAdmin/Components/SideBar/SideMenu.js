import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import MenuData from "./MenuData";
import MenuItem from "./MenuItem";

const SideMenu = () => {
  return (
    <div className="side-menu">
      <div className="main-menu">
        <ul className="admin-ul">
          {MenuData.map((menuItem, index) => (menuItem.showInSideBar &&
            <MenuItem
              key={index + menuItem.to + menuItem.name}
              name={menuItem.name}
              subMenus={menuItem.subMenus || []}
              iconClassName={menuItem.iconClassName}
            />
          ))}
          <li style={{ position: 'fixed', bottom: 0 }}>
            <Link to="/sow">
              <Button size="sm" variant="secondary">
              <i className="fa fa-angle-double-left"></i> Back To SOW
              </Button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideMenu;
