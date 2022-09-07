import EditGeneratePreview from "../../EditGeneratePreview";
import ModeProvider from "../../ModeProvider";
import DynamicDataRoute from "../DynamicDataRoute";

const EditGeneratePreviewRoute = ({
  children,
  checkState,
  shouldLoad,
  ...rest
}) => (
  <DynamicDataRoute shouldLoad={shouldLoad} checkState={checkState} {...rest}>
    <EditGeneratePreview>
      {children}
    </EditGeneratePreview>
  </DynamicDataRoute>
);

export default EditGeneratePreviewRoute;
