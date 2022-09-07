import TextAreaFormField from "../TextAreaFormField";
import { useDispatch } from "react-redux";
import { actionDynamicDataFieldsWorkPackageUpdate } from "../../Redux/Actions/DynamicDataFields";
const WorkPackageDDSection = ({
  parentId,
  id,
  name,
  isView,
  value,
  ...rest
}) => {
  const dispatch = useDispatch();
  return (
    <TextAreaFormField
      {...rest}
      id={id}
      readonly={isView}
      name={rest.fieldName}
      onChange={(val, nam) => {
        dispatch(
          actionDynamicDataFieldsWorkPackageUpdate(parentId, id, name, nam, val)
        );
      }}
      value={value ?? "<p><br/></p>"}
    />
  );
};

export default WorkPackageDDSection;
