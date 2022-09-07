import React, { useState } from "react";

const Search = ({ onSearch }) => {
  const [search, setSearch] = useState("");

  const onInputChange = (value) => {
    setSearch(value);
    onSearch(value);
  };
  return (
    <>
      <input
        type="text"
        className="form-control form-control-sm search-boxes searchbox_chr mb-1 float-left"
        style={{
          width: "200px",
          border: "1px solid #606060 !important",
        }}
        placeholder="Filter"
        value={search}
        onChange={(e) => onInputChange(e.target.value)}
      />
      <i
        className="fas fa-info-circle helptextservice mt-2"
        title="Filter using: Cluster,Country,Skill Name,Skill Set Name & Skill Type"
      ></i>
    </>
  );
};

export default Search;
