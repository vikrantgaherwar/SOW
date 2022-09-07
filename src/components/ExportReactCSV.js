import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";

export const ExportReactCSV = ({ csvData, fileName }) => {
  const [csvDataReceived, setCsvDataReceived] = useState(csvData);
  useEffect(() => {
    setCsvDataReceived(csvData);
  }, [csvData]);
  return (
    <button className="btn btn-sm btn-success mb-1 exp-link float-right">
      <CSVLink data={csvDataReceived} filename={fileName}>
      <i class="fas fa-file-export"></i> Export
      </CSVLink>
    </button>
  );
};
