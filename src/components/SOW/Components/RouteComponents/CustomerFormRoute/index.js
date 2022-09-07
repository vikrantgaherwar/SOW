import CustomerDataLoadedPath from "../../CustomerDataLoadedPath";
import DropDownLoadedPath from "../../DropDownLoadedPath";
import ModeProvider from "../../ModeProvider";

const CustomerFormRoute = ({ children, shouldLoad, ...rest }) => (
  <DropDownLoadedPath shouldLoad={shouldLoad} {...rest}>
    <CustomerDataLoadedPath>
      {children}
    </CustomerDataLoadedPath>
  </DropDownLoadedPath>
);

export default CustomerFormRoute;
