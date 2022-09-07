import EditDataLoadedPath from "../../EditDataLoadedPath";
import ModeProvider from "../../ModeProvider";

const EditMasterFormRoute = ({ children, shouldLoad, checkState, ...rest }) => (
  <EditDataLoadedPath shouldLoad={shouldLoad} checkState={checkState} {...rest}>
    {children}
  </EditDataLoadedPath>
);

export default EditMasterFormRoute;
