import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FixedSizeList as List } from "react-window";
import Select, { components, createFilter } from "react-select";
import CreatableSelect from "react-select/creatable";
import { Col, Form, Row, Button, InputGroup } from "react-bootstrap";
import { REGEX_INTEGERS } from "../../Redux/utils/regex";
import { parseInteger } from "../E3TForm/e3tFormData";
import { isArray } from "lodash";
import { parseFloating } from "../../PricingTab/PricingFormFields";
import { useDispatch } from "react-redux";

const CustomOption = ({ children, ...props }) => {
  // eslint-disable-next-line no-unused-vars
  const { onMouseMove, onMouseOver, ...rest } = props.innerProps;
  const newProps = { ...props, innerProps: rest };
  return (
    <components.Option {...newProps} className="custom-option">
      {children}
    </components.Option>
  );
};

CustomOption.propTypes = {
  innerProps: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

const DefaultItemHeight = 40;

class CustomMenuList extends React.Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
    maxHeight: PropTypes.number.isRequired,
    getValue: PropTypes.func.isRequired,
  };

  renderItem = (props) => {
    const { children } = this.props;
    if (Array.isArray(children)) {
      return (
        <span style={props.style} key={props.index}>
          {children[props.index]}
        </span>
      );
    }
    return (
      <span key={props.index} className="react-virtualized-menu-placeholder">
        {children.props.children}
      </span>
    );
  };

  render() {
    const { options, children, maxHeight, getValue } = this.props;

    const [value] = getValue();
    const initialOffset = options.indexOf(value) * DefaultItemHeight;
    const childrenOptions = React.Children.toArray(children);
    const wrapperHeight =
      maxHeight < childrenOptions.length * DefaultItemHeight
        ? maxHeight
        : childrenOptions.length * DefaultItemHeight;

    return (
      <span className="react-virtualized-list-wrapper">
        <List
          width="100%"
          height={wrapperHeight + 6}
          scrollOffset={initialOffset}
          itemCount={childrenOptions.length}
          itemSize={DefaultItemHeight}
        >
          {this.renderItem}
        </List>
      </span>
    );
  }
}

const SOWFormFieldComponent = ({
  idx,
  name,
  title,
  value,
  id,
  onChange,
  required,
  readonly,
  list,
  type,
  className,
  showEdit,
  edit,
  setEdit,
  fullWidth,
  helperText,
  placeholder,
  dontShowDefaultSelect,
  form,
  hasButton,
  disabled,
  min,
  max,
  step,
  onButtonClick,
  onBlur,
  hasSelectData,
  selectData,
  bsPrefix,
  buttonTitle,
  buttonDisabled,
  col,
  noFullWidth,
  isPercentage,
  customStyles,
  onCreateOption,
  isMulti,
  errorText,
  hasIcon,
}) => {
  const [state, setState] = useState(value);
  const debounce = useRef();
  const updateChange = (nextVal) => {
    if (nextVal !== value) {
      if (debounce.current) {
        clearTimeout(debounce.current);
      }
      debounce.current = setTimeout(() => {
        const singleValue = isArray(nextVal) ? nextVal[0] : nextVal;
        if (type === "number") {
          let finalValue;
          if (
            singleValue.split(".")[1] &&
            singleValue.split(".")[1].length > 2
          ) {
            finalValue = parseFloating(singleValue).toFixed(2);
          } else {
            finalValue = singleValue;
          }
          onChange({
            target: { name, value: finalValue },
          });
        } else {
          onChange({ target: { name, value: singleValue } });
        }
      }, 300);
    } else {
      // onChange({ target: { name, value } });
    }
  };

  const handleChange = (e) => {
    const val = max
      ? parseFloating(e.target.value) > max
        ? max.toFixed(2)
        : e.target.value
      : e.target.value;
    // console.log({ local: val });
    setState(isArray(value) ? [val] : val);
    updateChange(val);
  };

  useEffect(() => {
    setState(value);
  }, [value]);

  return (
    <Col>
      <Form.Group as={Row} controlId={`form_${name}`}>
        <Col sm={fullWidth ? 4 : col ? col[0] : 2}>
          <Form.Label>
            <b>{title}</b>
            {showEdit && value && value.id !== "" && value.id !== 0 ? (
              <i
                style={{ cursor: "pointer" }}
                className={`pl-2 fas fa-pen fa-sm ${
                  edit ? "toggle-selected-highlight" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setEdit((old) => !old);
                }}
              />
            ) : (
              <></>
            )}
          </Form.Label>
        </Col>
        <Col
          // style={{ display: "flex", flexDirection: "row" }}
          sm={
            fullWidth
              ? hasButton
                ? 6
                : 8
              : noFullWidth
              ? 10
              : col
              ? col[1]
              : 4
          }
        >
          <>
            {type === "select" ? (
              <Form.Control
                size="sm"
                name={name}
                required={required ?? false}
                data-testid={name}
                as={"select"}
                // onBlur={onBlur ? onBlur : () => {}}
                readOnly={readonly ?? false}
                disabled={disabled ?? false}
                onChange={readonly ? () => {} : onChange}
                value={value ?? ""}
              >
                {dontShowDefaultSelect ? (
                  <></>
                ) : (
                  <option value="">{`Select ${title}`}</option>
                )}

                {list.map((element, index) => (
                  <option
                    disabled={element.disabled ?? false}
                    value={
                      element.id
                        ? name === "productLine"
                          ? element.id.split("-")[0].trim()
                          : element.id
                        : element
                    }
                    key={`${
                      element.id ? element.id : element
                    }_${id}_${index}_${idx}`}
                  >
                    {element.name ? element.name : element}
                  </option>
                ))}
              </Form.Control>
            ) : type === "single-select" ? (
              <Select
                required={required}
                placeholder={placeholder}
                // classNamePrefix="Resource Type"
                isClearable
                value={value}
                isMulti={isMulti}
                isSearchable
                isDisabled={disabled}
                name={name}
                options={list}
                onChange={onChange}
                // onInputChange={onInputChange}
                styles={customStyles}
                components={{
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                  ClearIndicator: () => null,
                  Option: CustomOption,
                  MenuList: CustomMenuList,
                }}
                filterOption={createFilter({ ignoreAccents: false })}
              />
            ) : type === "checkbox" ? (
              <Form.Check
                name={name}
                required={required ?? false}
                data-testid={name}
                readOnly={readonly ?? false}
                disabled={disabled ?? false}
                onChange={readonly ? () => {} : onChange}
                checked={value ?? false}
              />
            ) : type === "creatable-select" ? (
              <CreatableSelect
                required={required}
                placeholder={placeholder}
                // classNamePrefix="Resource Type"
                isClearable
                value={value}
                isSearchable
                isDisabled={disabled}
                name={name}
                options={list}
                onChange={onChange}
                // onCreateOption={onCreateOption}
                styles={customStyles}
                components={{
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                  ClearIndicator: () => null,
                }}
              />
            ) : type === "text" ? (
              <Form.Control
                size="sm"
                name={name}
                data-testid={name}
                type={type}
                // onBlur={onBlur ? onBlur : () => {}}
                readOnly={readonly}
                disabled={disabled ?? false}
                required={required ?? false}
                onChange={readonly ? () => {} : handleChange}
                onBlur={readonly ? () => {} : () => updateChange(state)}
                value={state ?? ""}
                placeholder={title}
              />
            ) : type === "text-dropdown" ? (
              <Row>
                <Col sm={6}>
                  <Form.Control
                    size="sm"
                    name={name}
                    data-testid={name}
                    type={"number"}
                    min={min ?? 0}
                    readOnly={readonly}
                    disabled={disabled ?? false}
                    required={required ?? false}
                    onChange={readonly ? () => {} : onChange}
                    onBlur={readonly ? () => {} : () => updateChange(state)}
                    value={state?.split(" ")[0] ?? ""}
                    placeholder={title}
                  />
                </Col>
                <Col sm={6}>
                  <Form.Control
                    size="sm"
                    name={name}
                    required={required ?? false}
                    data-testid={name}
                    as={"select"}
                    // onBlur={onBlur ? onBlur : () => {}}
                    readOnly={readonly ?? false}
                    disabled={readonly ?? false}
                    onChange={readonly ? () => {} : onChange}
                    onBlur={readonly ? () => {} : () => updateChange(state)}
                    value={state?.split(" ")[1] ?? ""}
                  >
                    <option value="">{`Select ${title}`}</option>
                    {list.map((element, index) => (
                      <option value={element} key={`${id}_${index}_${idx}`}>
                        {element}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
              </Row>
            ) : type === "file" ? (
              readonly ? (
                <div className="d-flex flex-column">
                  {value ? <div>{value}</div> : <div>No Files Uploaded</div>}
                </div>
              ) : (
                <div className="d-flex flex-column">
                  <Form.Control
                    size="sm"
                    name={name}
                    data-testid={name}
                    type={type}
                    accept="image/*"
                    readOnly={readonly}
                    disabled={disabled ?? false}
                    required={required ?? false}
                    onChange={readonly ? () => {} : onChange}
                  />
                  {value === "" ? (
                    <div style={{ color: "red" }}>
                      upload failed.please upload only images
                    </div>
                  ) : (
                    <div>{value}</div>
                  )}
                </div>
              )
            ) : type === "date" ? (
              <Form.Control
                size="sm"
                name={name}
                data-testid={name}
                type={type}
                value={value ?? ""}
                onBlur={onBlur ? onBlur : () => {}}
                readOnly={readonly}
                disabled={disabled ?? false}
                required={required ?? false}
                onChange={readonly ? () => {} : onChange}
              />
            ) : type === "number" ? (
              <InputGroup>
                <Form.Control
                  size="sm"
                  name={name}
                  data-testid={name}
                  type={type}
                  // onBlur={onBlur ? onBlur : () => {}}
                  readOnly={readonly}
                  step={step ?? "0.01"}
                  min={min ?? 0}
                  max={max ?? Number.MAX_SAFE_INTEGER}
                  pattern={REGEX_INTEGERS}
                  disabled={disabled ?? false}
                  required={required ?? false}
                  onChange={readonly ? () => {} : handleChange}
                  onBlur={readonly ? () => {} : () => updateChange(state)}
                  value={isArray(state) ? state[0] : state ?? ""}
                  placeholder={title}
                />
                {isPercentage && (
                  <InputGroup.Text
                    className="p-0 justify-content-center"
                    style={{
                      width: "10%",
                      borderRadius: "0px",
                    }}
                  >
                    %
                  </InputGroup.Text>
                )}
              </InputGroup>
            ) : (
              <></>
            )}
            {helperText ? (
              <p
                className="text-muted border-top mt-2 pt-2"
                dangerouslySetInnerHTML={{ __html: helperText }}
              />
            ) : errorText ? (
              <p
                className="text-danger pt-1"
                dangerouslySetInnerHTML={{ __html: errorText }}
              />
            ) : (
              <></>
            )}
          </>
        </Col>
        {hasButton && (
          <Col
            sm={
              fullWidth
                ? hasButton
                  ? 6
                  : 8
                : noFullWidth
                ? 10
                : col
                ? col[2]
                : 4
            }
          >
            <Button
              bsPrefix={bsPrefix ?? "btn btn-success btn-sm  action-button"}
              disabled={buttonDisabled || (value && value.length === 0)}
              onClick={onButtonClick}
            >
              {buttonTitle}
            </Button>
          </Col>
        )}
        {hasIcon && (
          <Col
            sm={
              fullWidth
                ? hasButton
                  ? 6
                  : 8
                : noFullWidth
                ? 10
                : col
                ? col[2]
                : 4
            }
          >
            {buttonTitle}
          </Col>
        )}
        {/* </Col> */}
      </Form.Group>
    </Col>
  );
};

export default SOWFormFieldComponent;
