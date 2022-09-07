const PanelWrapper = (props) => {
  const { panelOpen, onClick, panelTitle, searchComponent, children } = props;
  return (
    <>
      {panelOpen && (
        <div className="slider_click" id="sowslide">
          <button
            onClick={onClick}
            className="close close_button_modules_popup"
            aria-label="Close"
          >
            <span>&times;</span>
          </button>
          <div id="sliderow">
            <div className="col-12 mt-3">
              <h5 className="slider_header">{panelTitle}</h5>
            </div>
          </div>

          <div className="col-12 slider_content">
            <div className="pt-1 input-search sow-history-search">
              {searchComponent}
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};
export default PanelWrapper;
