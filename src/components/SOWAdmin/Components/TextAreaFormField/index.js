import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useReducer,
} from "react";
import {
  Editor,
  RichUtils,
  EditorState,
  ContentState,
  convertFromHTML,
  getDefaultKeyBinding,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { stateToHTML } from "draft-js-export-html";
// import { stateFromHTML } from "draft-js-import-html";
import {
  Row,
  Button,
  Popover,
  OverlayTrigger,
  Col,
  Form,
} from "react-bootstrap";
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

const TextAreaFormField = ({
  name,
  value,
  onChange,
  noLabel,
  id,
  readonly,
  textAreaResized,
  textAreaReset,
}) => {
  const editorRef = useRef(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const blocksFromHTML = convertFromHTML(value);
  const state = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );
  const newState = EditorState.createWithContent(state);
  const [editorState, setEditorState] = useState(newState);
  const previousDynamicFieldValueRef = useRef("");
  const [loaded, setLoaded] = useState(false);
  // const [forceState, forceUpdate] = useReducer((x) => x + 1, 0);

  const tt = useRef();

  useEffect(() => {
    if (value && value !== previousDynamicFieldValueRef.current) {
      const blocksFromHTML = convertFromHTML(value ?? "<p><br/></p>");
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      const newState = EditorState.createWithContent(state);
      setEditorState(newState);
      previousDynamicFieldValueRef.current = value;
    }
  }, [value]);

  const updateState = (htmlString) => {
    if (tt.current) {
      clearTimeout(tt.current);
    }
    tt.current = setTimeout(() => {
      if (onChange) {
        onChange(htmlString, name);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (tt.current) {
        clearTimeout(tt.current);
      }
    };
  }, []);

  useEffect(() => {
    const htmlString = stateToHTML(editorState.getCurrentContent());
    if (htmlString !== previousDynamicFieldValueRef.current) {
      if (!loaded) {
        setLoaded(true);
      } else {
        updateState(htmlString);
      }
    }

    previousDynamicFieldValueRef.current = htmlString;
  }, [editorState]);

  // useEffect(() => {
  //   // console.log("DraftTextField useEffect editorState", forceState);
  //   if (name && forceState > 0) {
  //
  //     previousDynamicFieldValueRef.current = htmlString;
  //     // onChange(htmlString, name);
  //     if (tt.current) {
  //       clearTimeout(tt.current);
  //     }
  //     tt.current = setTimeout(() => {
  //       console.log("writing state");
  //       onChange(htmlString, name);
  //     }, 1000);
  //   }
  // }, [forceState]);

  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleKeyCommand = useCallback(
    (command, editorState) => {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        // console.log({ newState });
        setEditorState(newState);
        //forceUpdate();
        return "handled";
      }
      return "not-handled";
    },
    [editorState, setEditorState]
  );

  const mapKeyToEditorCommand = useCallback(
    (e) => {
      switch (e.keyCode) {
        case 9: // TAB
          const newEditorState = RichUtils.onTab(
            e,
            editorState,
            4 /* maxDepth */
          );

          if (newEditorState !== editorState) {
            setEditorState(newEditorState);
          }
          return null;
      }
      return getDefaultKeyBinding(e);
    },
    [editorState, setEditorState]
  );

  const onToggleInlineStyle = (event, inlineStyle) => {
    event.preventDefault();
    setEditorState((prevState) => {
      const newState = RichUtils.toggleInlineStyle(prevState, inlineStyle);
      return newState;
    });
    //forceUpdate();
  };

  const onToggleBlockType = (event, blockType) => {
    event.preventDefault();
    setEditorState((prevState) => {
      const newState = RichUtils.toggleBlockType(prevState, blockType);
      return newState;
    });
    //forceUpdate();
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

  const renderTextArea = () => {
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
                      bsPrefix={`btn ${currentStyle.has(item.style) ? `btn-dark` : `btn-light`
                        } btn-sm mr-1`}
                      onMouseDown={(e) => onToggleInlineStyle(e, item.style)}
                    >
                      <i className={`fas ${item.icon}`} />
                    </Button>
                  ))}
                  {map(BLOCK_TYPES, (item) => (
                    <Button
                      key={item.style}
                      bsPrefix={`btn ${blockType === item.style ? `btn-dark` : `btn-light`
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
              background: readonly ? "lightgray" : "",
              opacity: readonly ? "0.7" : "",
            }}
            onClick={focusEditor}
            className="form-control"
            onMouseOverCapture={textAreaResized}
            onMouseOutCapture={textAreaReset}
          >
            <Editor
              ref={editorRef}
              stripPastedStyles
              spellCheck
              readOnly={readonly}
              editorState={editorState}
              handleKeyCommand={readonly ? () => { } : handleKeyCommand}
              keyBindingFn={mapKeyToEditorCommand}
              onBlur={() => {
                if (tt.current) {
                  clearTimeout(tt.current);
                }
                const htmlString = stateToHTML(editorState.getCurrentContent());
                if (onChange) {
                  onChange(htmlString, name);
                }
              }}
              onChange={(editorState) => {
                if (!readonly) {
                  setEditorState(editorState);
                  //forceUpdate();
                }
              }}
            />
          </div>
        </OverlayTrigger>
      </>
    );
  };

  if (noLabel) {
    return renderTextArea();
  }
  return (
    <Row>
      <Col>
        <Form.Group as={Row} controlId={`form_${name}`}>
          <Col sm={2}>
            <Form.Label>
              <strong>{name}</strong>
            </Form.Label>
          </Col>
          <Col sm={10}>{renderTextArea()}</Col>
        </Form.Group>
      </Col>
    </Row>
  );
};

export default TextAreaFormField;