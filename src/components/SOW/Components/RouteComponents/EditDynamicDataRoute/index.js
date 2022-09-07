import EditDynamicDataLoadedPath from "../../EditDynamicDataLoadedPath";
import EditE3TDataLoadedPath from "../../EditE3TDataLoadedPath";
import ModeProvider from "../../ModeProvider";
import EditE3TRoute from "../EditE3TRoute";

const EditDynamicDataRoute = ({
  children,
  checkState,
  shouldLoad,
  ...rest
}) => (
  <EditE3TRoute shouldLoad={shouldLoad} checkState={checkState} {...rest}>
    <EditDynamicDataLoadedPath>
      {children}
    </EditDynamicDataLoadedPath>
  </EditE3TRoute>
);

export default EditDynamicDataRoute;
