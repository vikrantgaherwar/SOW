import EditE3TDataLoadedPath from "../../EditE3TDataLoadedPath";
import ModeProvider from "../../ModeProvider";
import EditCustomerFormRoute from "../EditCustomerFormRoute";

const EditE3TRoute = ({ children, checkState, shouldLoad, ...rest }) => (
  <EditCustomerFormRoute
    shouldLoad={shouldLoad}
    checkState={checkState}
    {...rest}
  >
    <EditE3TDataLoadedPath>{children}</EditE3TDataLoadedPath>
  </EditCustomerFormRoute>
);

export default EditE3TRoute;
