import { Table, Form, Button } from "react-bootstrap";
import { isRecordFilled } from "./PricingFormFields";
import PricingResourceTableRow from "./PricingResourceTableRow";
import { getDefaultResourceTableRow } from "./PricingFormFields";

const PricingResourceTable = ({
  formState,
  setFormState,
  resourceDropDownData,
  regionalData,
}) => {
  return (
    <Table bordered size="sm">
      <thead>
        <tr>
          <th className="sow-table-header">Resource Type</th>
          <th className="sow-table-header">No. of Resources</th>
          <th className="sow-table-header">Project Duration (Days)</th>
          <th className="sow-table-header">Working Hours (Day)</th>
          <th className="sow-table-header">Cost</th>
          <th
            style={{
              backgroundColor: "white",
              border: "0",
            }}
          >
            <Button
              bsPrefix="btn btn-success ml-1 btn-sm"
              title="Add Row"
              data-testid="AddTableRow"
              onClick={(e) => {
                e.preventDefault();
                setFormState((state) => ({
                  ...state,
                  resourceTable: [...state.resourceTable],
                }));
              }}
              disabled={
                !isRecordFilled(
                  formState.resourceTable[formState.resourceTable.length - 1]
                )
              }
            >
              <i className="fas fa-plus fa-xs" />
            </Button>
          </th>
        </tr>
      </thead>
      <tbody>
        {formState.resourceTable.map((resourceTableRow, index) => (
          <PricingResourceTableRow
            regionalData={regionalData}
            idx={index}
            resourceTypeList={resourceDropDownData}
            key={`resourceTableRow_${index}`}
            setState={setFormState}
            {...resourceTableRow}
          />
        ))}
        <tr>
          <td colSpan="3"></td>
          <td>
            <strong>Total Cost</strong>
          </td>
          <td>
            <Form.Control
              size="sm"
              name={`totalResourceCost`}
              type="number"
              value={formState.totalResourceCost}
              disabled={true}
            />
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default PricingResourceTable;
