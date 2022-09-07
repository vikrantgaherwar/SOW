import { Button } from "react-bootstrap";
import { isTableStateFilled } from "../../Redux/utils/isTableStateFilled";
import { useDispatch } from "react-redux";
import { actionDynamicDataFieldsTableRowAdded } from "../../Redux/Actions/DynamicDataFields";

const DynamicDataTableHeader = ({ headers, values, name, isView }) => {
  const dispatch = useDispatch();

  return (
    <thead>
      <tr>
        {headers.map((header, index) => (
          <th className="sow-table-header" key={`${header.fieldName}_${index}`}>
            {header.fieldName}
          </th>
        ))}
        <th className="sow-table-header text-center">
          {/* <Button
            bsPrefix="btn btn-success sow-table-header-button btn-sm"
            title="Add Row"
            data-testid="AddTableRow"
            onClick={(e) => {
              e.preventDefault();
              dispatch(actionDynamicDataFieldsTableRowAdded(name));
            }}
            disabled={
              !isTableStateFilled(values[values.length - 1], true) || isView
            }
          >
            <i className="fas fa-plus fa-xs" />
          </Button> */}
        </th>
      </tr>
    </thead>
  );
};

export default DynamicDataTableHeader;
