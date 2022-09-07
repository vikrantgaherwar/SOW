import React from "react";
import { Form } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";

const MenuItem = (props) => {
  const { name, subMenus, iconClassName } = props;
  const { pathname } = useLocation();
  return (
    <li>
      <Form.Label className={`menu-item`}>
        <div className="menu-icon">
          <i className={iconClassName}></i>
        </div>
        <span>{name}</span>
      </Form.Label>
      {subMenus && subMenus.length > 0 ? (
        <ul key={name} className={`sub-menu active`}>
          {subMenus.map((subMenu, index) => (
            <li key={index + subMenu.to + subMenu.name}>
              <NavLink to={subMenu.to} isActive={() => [subMenu.to,subMenu.NavLinksMultiple].includes(pathname)}>
                <div className="menu-icon">
                  <i className={subMenu.iconClassName}></i>
                  <span>{subMenu.name}</span>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
};

export default MenuItem;
