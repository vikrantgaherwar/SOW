import CustomerDataLoadedPath from "../../CustomerDataLoadedPath";
import DropDownLoadedPath from "../../DropDownLoadedPath";
import DynamicDataLoadedPath from "../../DynamicDataLoadedPath";
import E3TDataLoadedPath from "../../E3TDataLoadedPath";
import ModeProvider from "../../ModeProvider";

const E3TFormRoute = ({ children, shouldLoad, ...rest }) => (
  <DropDownLoadedPath shouldLoad={shouldLoad} {...rest}>
    <CustomerDataLoadedPath>
      <DynamicDataLoadedPath>
        <E3TDataLoadedPath>{children}</E3TDataLoadedPath>
      </DynamicDataLoadedPath>
    </CustomerDataLoadedPath>
  </DropDownLoadedPath>
);

export default E3TFormRoute;
