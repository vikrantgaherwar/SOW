export function identifyFileFormat(fileName) {
  if (fileName.indexOf("pdf") !== -1) return "fa fa-file-pdf pdf-file";
  else if (fileName.indexOf("docx") !== -1 || fileName.indexOf("doc") !== -1)
    return "fa fa-file-word word-file";
  else if (fileName.indexOf("pptx") !== -1 || fileName.indexOf("ppt") !== -1)
    return "fa fa-file-powerpoint ppt-file";
  else if (
    fileName.indexOf("xls") !== -1 ||
    fileName.indexOf("xl") !== -1 ||
    fileName.indexOf("csv") !== -1
  )
    return "fa fa-file-excel xl-file";
  else if (fileName.indexOf("msg") !== -1)
    return "fa fa-envelope-square mail-file";
  else if (
    fileName.indexOf("mp4") !== -1 ||
    fileName.indexOf("wmv") !== -1 ||
    fileName.indexOf("avi") !== -1
  )
    return "fa fa-file-video xl-file";
  else if (fileName.indexOf("zip") !== -1)
    return "fas fa-file-archive file-zip";
  else if (fileName.indexOf("vsd") !== -1) return "fas fa-file-alt file-zip";
  else return "fa fa-external-link-square-alt xl-file";
}

export function ISValidFileForPreview(fileName) {
  return (
    fileName.indexOf("pdf") !== -1 ||
    fileName.indexOf("docx") !== -1 ||
    fileName.indexOf("doc") !== -1 ||
    fileName.indexOf("pptx") !== -1 ||
    fileName.indexOf("ppt") !== -1 ||
    fileName.indexOf("mpp") !== -1 ||
    fileName.indexOf("csv") !== -1 ||
    fileName === "xls" ||
    fileName === "xlsx" ||
    fileName === "xlsm"
  );
}
