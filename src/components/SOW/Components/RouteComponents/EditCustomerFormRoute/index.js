import EditCustomerDataLoadedPath from "../../EditCustomerDataLoadedPath";
import EditDataLoadedPath from "../../EditDataLoadedPath";
import ModeProvider from "../../ModeProvider";

const EditCustomerFormRoute = ({
  children,
  checkState,
  shouldLoad,
  ...rest
}) => (
  <EditDataLoadedPath shouldLoad={shouldLoad} checkState={checkState} {...rest}>
    <EditCustomerDataLoadedPath>
      {children}
    </EditCustomerDataLoadedPath>
  </EditDataLoadedPath>
);
export default EditCustomerFormRoute;
