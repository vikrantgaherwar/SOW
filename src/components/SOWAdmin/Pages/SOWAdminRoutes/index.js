import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Header from '../../Components/Header';
import '../../CSS/sow-admin.css';
import '../../Components/SideBar/sidebar.css';
import SideMenu from '../../Components/SideBar/SideMenu';
import { Breadcrumb } from 'react-bootstrap';
import MenuData from '../../Components/SideBar/MenuData';
import { useHistory } from 'react-router-dom'
import agent from '../../API/agent';
import Cookies from 'js-cookie';
import PrivateRoute from '../../Components/PrivateRoute';

export const SowAdminRoutes = (props) => {
    const [UserLoginInfo, SetUserLoginInfo] = useState({});
    const [RolesLoginInfo, SetRolesLoginInfo] = useState([]);
    const [IsAuthenticated, SetAuthenticated] = useState(false);
    const history = useHistory();
    useEffect(() => {
        agent.LoginInfo.details(Cookies.get('empnumber')).then((response) => {
            SetUserLoginInfo(response);
            let UserRoles = [];
            response.roles?.forEach(role => {
                if (role.roleName === 'Admin' && response.isActive) SetAuthenticated(true)
                UserRoles.push(role.roleName)
            });
            SetRolesLoginInfo(UserRoles);
            if (UserRoles.indexOf('Admin') === -1 || response.isActive === false) history.push('/sow')
        })
    }, []);
    return <>
        {/* <ToastContainer position='top-right' hideProgressBar theme='colored' /> */}
        {!IsAuthenticated ? <div></div> : (
            <div>
                <Header userInfo={UserLoginInfo} roleInfo={RolesLoginInfo} />
                <SideMenu />
                <main>
                    <Breadcrumb>
                        <Breadcrumb.Item disabled>
                            <i style={{ color: 'teal' }} className="fas fa-chevron-right fa-xs pr-2" />
                            {history.location.pathname.split('/')[2] === "work" ? "Work and Package Management" : "User Access Management"}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item style={{ textTransform: 'capitalize' }}>
                            <i style={{ color: 'teal' }} className="fas fa-chevron-right fa-xs pr-2" />
                            {history.location.pathname.split('/')[2] === undefined ? "Users" : history.location.pathname.split('/')[2]}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    {MenuData.map((menu, index) => (
                        <div key={`Routes_${menu.name + index}`}>
                            {menu.to &&
                                <PrivateRoute key={menu.name} exact={menu.exact} path={menu.to} authenticated={IsAuthenticated}>
                                    {React.cloneElement((menu.component), { UserLoginInfo })}
                                </PrivateRoute>
                            }
                            {menu.subMenus && menu.subMenus.length > 0
                                ? menu.subMenus.map((subMenu, i) => (
                                    <PrivateRoute key={`${menu.name}"_"${subMenu.name}_${i}`} path={subMenu.to} exact={subMenu.exact}
                                        authenticated={IsAuthenticated}>
                                        {React.cloneElement((subMenu.component), { UserLoginInfo })}
                                    </PrivateRoute>
                                ))
                                : null}
                        </div>
                    ))}
                </main>
            </div>)
        }
    </>
};