import Roles from "../../Pages/SOWAdminRoutes/Roles/Roles";
import Users from "../../Pages/SOWAdminRoutes/Users/Users";
import TypeOfWork from "../../Pages/SOWAdminRoutes/PredefinedWorkPackage/TypeOfWork";
import CustomModulesAdmin from "../../Pages/SOWAdminRoutes/CustomModulesApproval/CustomModulesAdmin";

const MenuData = [
  {
    name: "User Access Management",
    exact: true,
    to: `/sow-admin`,
    component: <Users />,
    iconClassName: "fas fa-chevron-right pr-1",
    showInSideBar: true,
    subMenus: [
      {
        name: "Users",
        exact: true,
        to: "/sow-admin/users",
        NavLinksMultiple: "/sow-admin",
        component: <Users />,
        iconClassName: "fas fa-users fa-xs pr-2",
      },
      {
        name: "Roles",
        exact: true,
        to: "/sow-admin/roles",
        component: <Roles />,
        iconClassName: "fa fa-id-badge pr-2",
      },
    ],
  },
  {
    name: "Solution and Package Management",
    exact: true,
    iconClassName: "fas fa-chevron-right pr-1",
    showInSideBar: true,
    subMenus: [
      {
        name: "Predefined Solutions",
        to: "/sow-admin/predefined",
        component: <TypeOfWork />,
        iconClassName: "fa fa-briefcase fa-xs pr-2",
      },
      {
        name: "Custom Solutions",
        to: "/sow-admin/custom",
        component: <CustomModulesAdmin />,
        iconClassName: "fa fa-briefcase fa-xs pr-2",
      },
    ],
  },
];

export default MenuData;
