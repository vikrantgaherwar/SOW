const ModulesSearchComponent = (props) => {
  return (
    <input
      className={props.className ?? "form-control"}
      value={props.searchQuery}
      onChange={(e) => props.setSearchQuery(e.target.value)}
      aria-describedby={props["aria-describedby"] ?? "Search"}
      placeholder={props.placeholder ?? "Search"}
    />
  );
};

export default ModulesSearchComponent;
