import React, { useState } from "react";

const Search = ({ onSearch, placeholder = "Search" }) => {
  const [search, setSearch] = useState("");

  const onInputChange = (value) => {
    setSearch(value);
    onSearch(value);
  };
  return (
    <input
      type="text"
      className="form-control form-control-sm search-boxes searchbox_chr mb-1"
      style={{
        width: "200px",
        border: "1px solid #606060 !important",
      }}
      placeholder={placeholder}
      value={search}
      onChange={(e) => onInputChange(e.target.value)}
    />
  );
};

export default Search;
