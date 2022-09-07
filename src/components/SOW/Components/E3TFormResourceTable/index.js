import { map, some, groupBy } from "lodash";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  actionE3TAddResourceTableRow,
  actionE3TResouceTableRowChanged,
  actionE3TResourceTableDependencyChange,
  actionNewE3TRemoteChanged,
  actionNewE3TSDTChanged,
} from "../../Redux/Actions/E3T";
import { DEFUALT_SDT } from "../../Redux/utils/getdefaultSDT";
import { isRecordFilled } from "../E3TForm/e3tFormData";
import E3TFormTableRow from "../E3TFormTableRow";
import E3TFormTableSubSectionRow from "../E3TFormTableSubSectionRow";
import E3TFormTableSectionRow from "../E3TFormTableSectionRow";
import E3TTotalResource from "../E3TTotalResource";
const E3TFormResourceTable = ({
  resourceTable,
  regionalData,
  totalResourceCost,
  isView,
  isEdit,
  isClone,
  country,
  e3tRemoteSTDs,
  e3tCostingEstimation,
  e3t,
  e3tTshirtSizes,
  onSizeEstChange,
}) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState({});
  const [durationName, setDurationName] = useState({
    Current: "Hours",
    Previous: "",
  });

  const { customWorkPackages, selectedWorkPackages } = useSelector((state) => ({
    selectedWorkPackages: state.moduleSidePanel.selectedWorkPackages,
    customWorkPackages: state.customModuleSidePanel.selectedWorkPackages,
  }));

  const sectionGB = groupBy(
    map(resourceTable, (r, idx) => ({ ...r, idx })),
    (t) => t.typeOfWork
  );

  useEffect(() => {
    map(sectionGB, (section, sectionIdx) => {
      if (show[sectionIdx]) {
      } else {
        setShow((old) => ({ ...old, [sectionIdx]: true }));
      }
    });
  }, [resourceTable]);

  const handleNewE3TChange = (val, name, idx) => {
    dispatch(
      actionE3TResouceTableRowChanged({
        idx,
        ...resourceTable[idx],
        [name]: val,
      })
    );
  };

  const handleDependencyChange = (val, typeOfWorkId) => {
    dispatch(
      actionE3TResourceTableDependencyChange({
        typeOfWorkId,
        dependency: val,
      })
    );
  };

  const handleRemoteChange = (idx, val) => {
    dispatch(actionNewE3TRemoteChanged(idx, val));
  };

  const handleSDTChange = (idx, val) => {
    dispatch(actionNewE3TSDTChanged(idx, val));
  };

  const getDefaultSdt = (id) => {
    if (id) {
      return id;
    } else {
      return DEFUALT_SDT?.id;
    }
  };

  const handleResourceDurationChange = (event) => {
    setDurationName((prevState) => ({
      ...prevState,
      Current: event.target.value,
      Previous: durationName.Current,
    }));
  };

  // console.log({ resourceTable });

  return (
    <Table bordered>
      <thead className="sow-table-header-sticky">
        <tr>
          <th className="sow-table-header">Remote</th>
          <th className="sow-table-header">Resource Origin</th>
          {/* <th className="sow-table-header">Risk Rating</th> */}
          {/* <th className="sow-table-header">Dependancy</th> */}
          <th className="sow-table-header sow-table-header--resource-type">
            Resource Type
          </th>
          <th className="sow-table-header">Rate</th>
          {/* <th className="sow-table-header">Fx</th> */}
          <th className="sow-table-header">Resources</th>
          <th className="sow-table-header">
            <div style={{ display: "flex", alignItems: "end" }}>
              Duration:
              <Form.Control
                size="sm"
                className="e3t-form-elements"
                name="name_costing_duration"
                style={{ width: "80px" }}
                required
                data-testid="id_costing_duration"
                disabled={isView}
                as={"select"}
                onChange={(e) => handleResourceDurationChange(e)}
                value={durationName.Current}
                title={"Duration"}
              >
                {["Hours", "Days"].map((element, index) => (
                  <option value={element} key={`${element}_${index}`}>
                    {element}
                  </option>
                ))}
              </Form.Control>
            </div>
          </th>
          {/* <th className="sow-table-header">Working Hours</th> */}
          <th className="sow-table-header">Cost</th>
          <th className="sow-table-header"></th>
          {((customWorkPackages.length === 0 &&
            selectedWorkPackages.length === 0) ||
            resourceTable.some((e) => e.typeOfWork === "General") ||
            resourceTable.length === 0) && (
            <th className="sow-table-header">
              <Button
                bsPrefix="btn btn-success btn-sm sow-table-header-button"
                title="Add Row"
                data-testid="AddTableRow"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(actionE3TAddResourceTableRow());
                }}
                disabled={false}
              >
                <i className="fas fa-plus fa-xs" />
              </Button>
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {map(sectionGB, (section, sectionIdx) => {
          return (
            <Fragment key={`section_${sectionIdx}`}>
              <E3TFormTableSectionRow
                section={section}
                sectionIdx={sectionIdx}
                isView={isView}
                handleNewE3TChange={handleNewE3TChange}
                handleDependencyChange={handleDependencyChange}
                show={show[sectionIdx]}
                setShow={setShow}
                e3t={e3t}
                e3tTshirtSizes={e3tTshirtSizes}
                onSizeEstChange={onSizeEstChange}
              />

              {show[sectionIdx] ? (
                map(
                  groupBy(section, (w) => w.workPackage),
                  (subSection, subSectionIdx) => {
                    // console.log("Second Loop", subSection);
                    return (
                      <Fragment
                        key={`subsection_${sectionIdx}_${subSectionIdx}`}
                      >
                        {sectionIdx !== "General" && (
                          <E3TFormTableSubSectionRow
                            idx={subSection[0].idx}
                            section={section}
                            sectionIdx={sectionIdx}
                            handleNewE3TChange={handleNewE3TChange}
                            // handleDependencyChange={handleDependencyChange}
                            subSection={subSection}
                            isView={isView}
                          />
                        )}
                        {subSection.map((row, rowIdx) => (
                          <E3TFormTableRow
                            idx={row.idx}
                            isView={isView}
                            isEdit={isEdit}
                            isClone={isClone}
                            custom={row.custom}
                            country={country}
                            regionalData={regionalData}
                            sizingEstimate={row.sizingEstimate}
                            resourceTable={resourceTable}
                            e3tRemoteSTDs={e3tRemoteSTDs}
                            handleSDTChange1={handleSDTChange}
                            handleRemoteChange1={handleRemoteChange}
                            e3tCostingEstimation={e3tCostingEstimation}
                            key={`row_${sectionIdx}_${subSectionIdx}_${rowIdx}`}
                            durationName={durationName}
                            {...row}
                          />
                        ))}
                      </Fragment>
                    );
                  }
                )
              ) : (
                <></>
              )}
            </Fragment>
          );
        })}
        <E3TTotalResource totalResourceCost={totalResourceCost} />
      </tbody>
    </Table>
  );
};

export default E3TFormResourceTable;
