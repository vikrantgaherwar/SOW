import React, {
  useRef,
  useState,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import {
  Editor,
  RichUtils,
  EditorState,
  ContentState,
  convertFromHTML,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
// import { stateFromHTML } from "draft-js-import-html";
import { Row, Button, Popover, OverlayTrigger } from "react-bootstrap";
import PropTypes from "prop-types";
import { map } from "lodash";

const BLOCK_TYPES = [
  { label: "UL", icon: "fa-list-ul", style: "unordered-list-item" },
  { label: "OL", icon: "fa-list-ol", style: "ordered-list-item" },
  { label: "H3", icon: "fa-heading", style: "header-three" },
];

const INLINE_STYLES = [
  { label: "B", icon: "fa-bold", style: "BOLD" },
  { label: "I", icon: "fa-italic", style: "ITALIC" },
  { label: "U", icon: "fa-underline", style: "UNDERLINE" },
];

const DraftTextField = ({ dynamicField, handleChange }) => {
  const editorRef = useRef(null);
  const previousDynamicFieldValueRef = useRef("");
  const [forceState, forceUpdate] = useReducer((x) => x + 1, 0);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (
      dynamicField?.value &&
      dynamicField?.value !== previousDynamicFieldValueRef.current
    ) {
      const blocksFromHTML = convertFromHTML(dynamicField.value);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      // const state = stateFromHTML(dynamicField.value);
      const newState = EditorState.createWithContent(state);
      setEditorState(newState);
      previousDynamicFieldValueRef.current = dynamicField?.value;
    }
  }, [dynamicField?.value]);

  useEffect(() => {
    if (dynamicField?.id && forceState > 0) {
      const htmlString = stateToHTML(editorState.getCurrentContent());
      previousDynamicFieldValueRef.current = htmlString;
      handleChange(htmlString, dynamicField.id);
    }
  }, [forceState]);

  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleKeyCommand = useCallback(
    (command, editorState) => {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        setEditorState(newState);
        forceUpdate();
        return "handled";
      }
      return "not-handled";
    },
    [editorState, setEditorState]
  );

  const onToggleInlineStyle = (event, inlineStyle) => {
    event.preventDefault();
    setEditorState((prevState) => {
      const newState = RichUtils.toggleInlineStyle(prevState, inlineStyle);
      return newState;
    });
    forceUpdate();
  };

  const onToggleBlockType = (event, blockType) => {
    event.preventDefault();
    setEditorState((prevState) => {
      const newState = RichUtils.toggleBlockType(prevState, blockType);
      return newState;
    });
    forceUpdate();
  };

  const onTogglePopoverClick = (show) => {
    setShowOverlay(show);
  };

  const selection = editorState.getSelection();

  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <>
      <OverlayTrigger
        trigger="focus"
        placement="auto-start"
        show={showOverlay}
        onToggle={(nextShow) => onTogglePopoverClick(nextShow)}
        overlay={
          <Popover id={`editor-popover`}>
            <Popover.Content>
              <Row bsPrefix="row pl-2 pr-2">
                {map(INLINE_STYLES, (item) => (
                  <Button
                    key={item.style}
                    bsPrefix={`btn ${
                      currentStyle.has(item.style) ? `btn-dark` : `btn-light`
                    } btn-sm mr-1`}
                    onMouseDown={(e) => onToggleInlineStyle(e, item.style)}
                  >
                    <i className={`fas ${item.icon}`} />
                  </Button>
                ))}
                {map(BLOCK_TYPES, (item) => (
                  <Button
                    key={item.style}
                    bsPrefix={`btn ${
                      blockType === item.style ? `btn-dark` : `btn-light`
                    } btn-sm mr-1`}
                    onMouseDown={(e) => onToggleBlockType(e, item.style)}
                  >
                    <i className={`fas ${item.icon}`} />
                  </Button>
                ))}
              </Row>
            </Popover.Content>
          </Popover>
        }
      >
        <div
          style={{
            minHeight: "100px",
            cursor: "text",
            overflow: "auto",
            resize: "vertical",
            fontSize: "12px",
          }}
          onClick={focusEditor}
          className="form-control"
        >
          <Editor
            ref={editorRef}
            editorState={editorState}
            stripPastedStyles
            spellCheck
            handleKeyCommand={handleKeyCommand}
            onChange={(newState) => {
              setEditorState(newState);
              forceUpdate();
            }}
            // placeholder="DraftJS"
          />
        </div>
      </OverlayTrigger>
    </>
  );
};

DraftTextField.propTypes = {
  dynamicField: PropTypes.object,
  handleChange: PropTypes.func,
};

export default DraftTextField;
