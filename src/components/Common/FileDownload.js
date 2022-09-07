import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

const FileDownload = ({ doc }) => {
  const [fileLoader, setFileLoader] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDirectDownload = async (e, doc) => {
    e.preventDefault();
    // setDownloadProgress(0);
    setFileLoader(true);
    const URL = `https://hpedelta.com/viewer.aspx?requestType=EV`;
    const files = [];

    files.push(
      "F:\\AnPS\\Sharepointfiles\\" +
        doc.url
          .replace("https://hpedelta.com:8082/", "")
          .replace(/ /g, "%20")
          .split("/")
          .join("\\")
    );

    if (files.length > 0) { 
      try {
        const response = await axios.post(
          URL,
          { files },
          {
            responseType: "blob",
            onDownloadProgress: (progressEvent) =>
              setDownloadProgress(
                Math.round((progressEvent.loaded / progressEvent.total) * 100)
              ),
          }
        );
        if(files.length > 0 && files.length == 1)
        {
          debugger;
          saveAs(response.data, files[0].replace(/^.*[\\\/]/, '').replace(/%20/g, " "));
        }
        else if(files.length >1)
        {
          debugger;
         saveAs(response.data, `Download-${new Date().toISOString()}.zip`);
        }

      } catch (error) {
        console.log(error);
      }
    }
    setFileLoader(false);
  };

  return (
    <>
      <a
        href=""
        className="breakall_word"
        onClick={
          fileLoader
            ? (e) => e.preventDefault()
            : (e) => handleDirectDownload(e, doc)
        }
      >
        {doc.file}
        {doc.isarchived && <span className="archivedDocs">A</span>}
        {doc.isgoldcollateral && <span className="goldCol">G</span>}
      </a>
      {fileLoader ? `Downloading...${downloadProgress}%` : ''}
    </>
  );
};

export default FileDownload;
