import { Accordion, Col, Form, Row, Table } from "react-bootstrap";
import { useSelector, shallowEqual } from "react-redux";

import DynamicDataTable from "../DynamicDataTable";
import MyRow from "../MyRow";
import WorkPackageAccordian from "../WorkPackageAccordian";
import WorkPackageDDSection from "./WorkPackageDDSection";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { actionDynamicDataWorkPackageMoveEnd } from "../../Redux/Actions/DynamicDataFields";
import WorkPackageTable from "./WorkPackageTable";
import { useState } from "react";

const WorkPackageSection = (props) => {
  const [resized, setResized] = useState(false);
  const dispatch = useDispatch();
  const onDragEnd = (result) => {
    if (!props.isView) {
      if (!result.destination) {
        return;
      }

      const { source, destination } = result;

      // console.log({ result });

      dispatch(
        actionDynamicDataWorkPackageMoveEnd(
          props.child.fieldName,
          source.index,
          destination.index
        )
      );
    }
  };

  const textAreaResized = () => {
    setResized(true);
  };

  const textAreaReset = () => {
    setResized(false);
  };

  return (
    <MyRow>
      <Col>
        <Form.Group as={Row}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <Col
                  sm={12}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {props.value.map((workPackageSection, parentId) => (
                    <Draggable
                      draggableId={workPackageSection[0].workPackageId.toString()}
                      index={parentId}
                      key={`${
                        workPackageSection[0].sectionName ??
                        workPackageSection[0].workPackage +
                          workPackageSection[0].typeOfWork
                      }`}
                      isDragDisabled={resized}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <WorkPackageAccordian
                            id={parentId}
                            ddId={workPackageSection[0].workPackageId}
                            idx={
                              workPackageSection[0].sectionName ??
                              workPackageSection[0].workPackage +
                                workPackageSection[0].typeOfWork
                            }
                            name={props.child.fieldName}
                            // isPredefined={workPackageSection[0].sectionName ? false : true}
                            title={
                              workPackageSection[0].sectionName
                                ? workPackageSection[0].sectionName
                                : `${workPackageSection[0].typeOfWork} (${workPackageSection[0].workPackage})`
                            }
                            showRemove={
                              false
                              // !workPackageSection[0].typeOfWork &&
                              // props.value.length > 1
                              //   ? true
                              //   : false
                            }
                            showEdit={
                              // props.isView
                              //   ? false
                              //   : workPackageSection[0].sectionName
                              //   ? true
                              //   : false
                              false
                            }
                            isView={props.isView}
                          >
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {workPackageSection[0].fieldType === "table" ? (
                                <WorkPackageTable
                                  data={workPackageSection}
                                  isView={props.isView}
                                  parentId={parentId}
                                  name={props.child.fieldName}
                                />
                              ) : (
                                workPackageSection.map(
                                  ({ sectionName, ...rest }, id) => (
                                    <WorkPackageDDSection
                                      textAreaResized={textAreaResized}
                                      textAreaReset={textAreaReset}
                                      isView={props.isView}
                                      parentId={parentId}
                                      isView={props.isView}
                                      key={`${sectionName}_${parentId}_${id}`}
                                      {...rest}
                                      id={id}
                                      name={props.child.fieldName}
                                    />
                                  )
                                )
                              )}
                            </div>
                          </WorkPackageAccordian>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Col>
              )}
            </Droppable>
          </DragDropContext>
        </Form.Group>
      </Col>
    </MyRow>
  );
};

export default WorkPackageSection;
