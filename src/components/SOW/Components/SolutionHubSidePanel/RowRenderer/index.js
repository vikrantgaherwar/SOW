import ChildProvider from "../../HistorySidePanel/HistoryChildProvider";
import HistoryLoader from "../../HistorySidePanel/HistoryLoader";
import HistoryRow from "../../HistorySidePanel/HistoryRow";
import HistorySearchLoader from "../../HistorySidePanel/HistorySearchLoader";

const RowRenderer = (props) => {
  const {
    fetchStatus,
    searching,
    panelData,
    pagination,
    APIFetchStatus,
    handleLinkClick,
    handleChildClick,
    childLoading,
    bottomDivRef,
    singleChild,
  } = props;

  if (fetchStatus === APIFetchStatus.FETCHING) {
    return <HistoryLoader />;
  } else {
    return (
      <div
        style={{ margin: "60px 0px 30px 0px" }}
        // className={
        //   searching === APIFetchStatus.FETCHING ? "search-in-progress" : ""
        // }
      >
        <ChildProvider
          value={{
            data: singleChild,
            loader: childLoading,
          }}
        >
          {panelData.map((h, index) => (
            <HistoryRow
              key={`history_${h.id}_${index}`}
              listItem={h}
              onClick={handleLinkClick}
              onChildClick={handleChildClick}
              loader={childLoading}
            />
          ))}
          {pagination.HasNext && searching !== APIFetchStatus.FETCHING && (
            <div id="lastComponent" ref={bottomDivRef} />
          )}
          {searching === APIFetchStatus.FETCHING && <HistoryLoader />}
        </ChildProvider>
      </div>
    );
  }
};
export default RowRenderer;
