import CustomerDataLoadedPath from "../../CustomerDataLoadedPath";
import DropDownLoadedPath from "../../DropDownLoadedPath";
import DynamicDataLoadedPath from "../../DynamicDataLoadedPath";
import E3TDataLoadedPath from "../../E3TDataLoadedPath";
import ModeProvider from "../../ModeProvider";

const DynamicDataRoute = ({ children, shouldLoad, ...rest }) => (
  <DropDownLoadedPath shouldLoad={shouldLoad} {...rest}>
    <CustomerDataLoadedPath>
      
        <DynamicDataLoadedPath>
          {children}
        </DynamicDataLoadedPath>
      
    </CustomerDataLoadedPath>
  </DropDownLoadedPath>
);

export default DynamicDataRoute;
