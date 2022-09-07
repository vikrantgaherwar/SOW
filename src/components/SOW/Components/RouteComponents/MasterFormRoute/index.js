import DropDownLoadedPath from "../../DropDownLoadedPath";

const MasterFormRoute = ({ children, shouldLoad, ...rest }) => (
  <DropDownLoadedPath {...rest} shouldLoad={shouldLoad}>
    {children}
  </DropDownLoadedPath>
);

export default MasterFormRoute;
