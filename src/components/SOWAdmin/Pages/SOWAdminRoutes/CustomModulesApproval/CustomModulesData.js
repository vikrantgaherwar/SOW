import moment from "moment";
import { useEffect, useState } from "react";
import {
  InputGroup,
  Button,
  OverlayTrigger,
  Badge,
  ButtonGroup,
  Popover,
} from "react-bootstrap";
import agent from "../../../API/agent";
const CustomModulesData = (props) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const handleOnMouseEnter = () => {
    setShowOverlay(true);
  };
  const handleOnMouseLeave = () => {
    setShowOverlay(false);
  };
  const CheckModuleToApprove = (moudledData, customModule) => {
    var data = moudledData?.filter((item) => item === customModule.id);
    return data ? data.length : 0;
  };
  return (
    <>
      <tr
        key={`${props.customModule.typeOfWork}`}
        style={{ cursor: "pointer" }}
      >
        <td
          onClick={(e) =>
            props.handleToggleCollapseClick(e, props.customModule.id)
          }
        >
          <span>
            {props.show ? (
              <i
                style={{ color: "green" }}
                className="fas fa-chevron-down pr-2"
              />
            ) : (
              <i className="fas fa-chevron-right pr-2" />
            )}
          </span>
        </td>
        <td
          onClick={(e) =>
            props.handleToggleCollapseClick(e, props.customModule.id)
          }
        >
          {props.customModule.typeOfWork}
        </td>
        <td
          onClick={(e) =>
            props.handleToggleCollapseClick(e, props.customModule.id)
          }
        >
          {props.customModule.isActive ? (
            <i style={{ color: "green" }} className="fa fa-check"></i>
          ) : (
            <i
              style={{ color: "red" }}
              className="fa-solid fa-square-xmark"
            ></i>
          )}
        </td>
        <td
          onClick={(e) =>
            props.handleToggleCollapseClick(e, props.customModule.id)
          }
        >
          {props.customModule.createdBy}
        </td>
        <td
          onClick={(e) =>
            props.handleToggleCollapseClick(e, props.customModule.id)
          }
        >
          {moment(props.customModule.createdDate, moment.ISO_8601)
            .format("YYYY-MM-DD#HH:mm")
            .replace("#", " at ")}
        </td>
        <td
          onClick={(e) =>
            props.handleToggleCollapseClick(e, props.customModule.id)
          }
        >
          {moment(props.customModule.modifiedDate, moment.ISO_8601)
            .format("YYYY-MM-DD#HH:mm")
            .replace("#", " at ")}
        </td>
        <td>
          <InputGroup>
            {props.modulesDataToApprove ? (
              <>
                {process.env.REACT_APP_ENV !== "PROD" &&
                CheckModuleToApprove(
                  props.modulesDataToApprove,
                  props.customModule
                ) > 0 ? (
                  <OverlayTrigger
                    key={"OverlayTrigger" + props.customModule.id}
                    trigger={["hover", "focus"]}
                    placement="auto-start"
                    show={showOverlay}
                    overlay={
                      <Popover
                        onMouseEnter={handleOnMouseEnter}
                        onMouseLeave={handleOnMouseLeave}
                        id="tShirtSize"
                      >
                        <Popover.Content>
                          <h6>
                            <Badge
                              pill
                              style={{ color: "white", background: "dimgrey" }}
                            >
                              Select Action
                            </Badge>
                          </h6>
                          <ButtonGroup size="sm">
                            <Button
                              key={"approve"}
                              onClick={() =>
                                props.handleToApproveCustomModule(
                                  props.customModule,
                                  "approve"
                                )
                              }
                              variant="outline-secondary"
                            >
                              {props.loadingModuleToApprove ===
                              `handleCustomModuleToApproveClick_${props.customModule.id}` ? (
                                <>
                                  <i className="fa fa-spinner fa-spin" />{" "}
                                  <span pt-r={3}>Approving</span>
                                </>
                              ) : (
                                "Approve"
                              )}
                            </Button>
                            {/* <Button key={'reject'} variant="outline-secondary">Reject</Button> */}
                          </ButtonGroup>
                        </Popover.Content>
                      </Popover>
                    }
                  >
                    <Button
                      onMouseEnter={handleOnMouseEnter}
                      onMouseLeave={handleOnMouseLeave}
                      style={{ borderColor: "white" }}
                      className="btn btn-sm"
                      variant="outline-secondary"
                    >
                      {props.loadingModuleToApprove ===
                      `handleCustomModuleToApproveClick_${props.customModule.id}` ? (
                        <i
                          style={{ color: "dodgerblue" }}
                          className="fa fa-spinner fa-spin"
                        />
                      ) : (
                        <i
                          style={{ color: "#0d5265" }}
                          className="fa fa-money-check-alt"
                        ></i>
                      )}
                    </Button>
                  </OverlayTrigger>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <Button
                style={{ borderColor: "white" }}
                variant="outline-secondary"
                className="btn btn-sm"
                // onClick={(e) => props.handleTypeOfWorkEditClick(e,props.typeOfWork)}
                // title="Edit Module Name"
              >
                <i
                  style={{ color: "dodgerblue" }}
                  className="fa fa-spinner fa-spin"
                />
              </Button>
            )}
            {/* <Button
                style={{ borderColor: "white" }}
                variant="outline-secondary"
                className="btn btn-sm"
                // onClick={(e) => props.handleTypeOfWorkEditClick(e,props.typeOfWork)}
                title="Edit Module Name"
                >
                    <i style={{ color: "#0d5265" }} className="fas fa-edit pr-2"></i>
                </Button> */}
          </InputGroup>
        </td>
      </tr>
    </>
  );
};
export default CustomModulesData;
