import { Form } from "react-bootstrap";

const E3TTotalResource = ({ totalResourceCost }) => {
  return (
    <tr>
      <td colSpan="5"></td>
      <td>
        <strong>Total Cost</strong>
      </td>
      <td colSpan="1">
        <Form.Control
          size="sm"
          name={`totalResourceCost`}
          type="number"
          value={totalResourceCost}
          disabled={true}
          title={totalResourceCost}
        />
      </td>
    </tr>
  );
};

export default E3TTotalResource;
