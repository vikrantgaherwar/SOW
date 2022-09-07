import moment from "moment";
import { useState } from "react";
import { InputGroup, Button} from "react-bootstrap";
const TypeOfWorkData = (props) => {
    const [showOverlay, setShowOverlay] = useState(false);
    const handleOnMouseEnter = () => {
        setShowOverlay(true);
    }
    const handleOnMouseLeave = () => {
        setShowOverlay(false);
    }
    return (
        <>
            <tr style={{ cursor: 'pointer' }} key={props.typeOfWork.id}>
                <td onClick={(e) => props.handleToggleCollapseClick(e, props.typeOfWork.id)}>
                    <span>
                        {props.show ? (
                            <i style={{ color: 'green' }} className="fas fa-chevron-down pr-2" />
                        ) : (
                            <i className="fas fa-chevron-right pr-2" />
                        )}
                    </span>
                </td>
                <td onClick={(e) => props.handleToggleCollapseClick(e, props.typeOfWork.id)}>
                    {props.typeOfWork.typeOfWork}
                </td>
                <td onClick={(e) => props.handleToggleCollapseClick(e, props.typeOfWork.id)}>
                    {props.typeOfWork.isActive ? <i style={{ color: 'green' }} className="fa fa-check"></i> :
                        <i style={{ color: 'red' }} className="fa-solid fa-square-xmark"></i>}
                </td>
                <td onClick={(e) => props.handleToggleCollapseClick(e, props.typeOfWork.id)}>
                    {props.typeOfWork.createdBy}
                </td>
                <td onClick={(e) => props.handleToggleCollapseClick(e, props.typeOfWork.id)}>
                    {moment(props.typeOfWork.createdDate, moment.ISO_8601)
                        .format("YYYY-MM-DD#HH:mm")
                        .replace("#", " at ")}
                </td>
                <td>
                    {props.typeOfWork.sowEffortTshirtSizes.length !== 0 &&
                        <InputGroup>
                            <Button onClick={() => props.handleCostManagementEditClick(props.typeOfWork)} 
                            style={{ borderColor: "white" }} 
                            className="btn btn-sm" 
                            variant="outline-secondary"
                            title="Edit Cost Data"
                            >
                                <i style={{ color: "#0d5265" }} className="fa fa-money-check-alt"></i>
                            </Button>
                            <Button
                            style={{ borderColor: "white" }}
                            variant="outline-secondary"
                            className="btn btn-sm"
                            onClick={(e) => props.handleTypeOfWorkEditClick(e,props.typeOfWork)}
                            title="Edit Module Name"
                            >
                                <i style={{ color: "#0d5265" }} className="fas fa-edit pr-2"></i>
                            </Button>
                        </InputGroup>}
                </td>
            </tr>
        </>
    )
}

export default TypeOfWorkData;