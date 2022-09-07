import React, { Component, Fragment } from "react";
import DragAndDrop from "../DragAndDrop";
import axios from "axios";
import Cookies from "js-cookie";
import logo from "../img/loading-icon-animated.gif";
import { post } from "axios";
import { FileDetails, DeltaDocumentDetails } from "../FileDetails";
import URLConfig from "../URLConfig";
import _ from "lodash";
import UploadDocumentDetailsModal from "./UploadDocumentDetailsModal";
import Modal from "react-bootstrap/Modal";
import { formatDate } from "../../../utils/Date";
import { identifyFileFormat } from "../../../utils/FileType";
import popuplogo from "../img/element-popup-headers.png";
import Pagination from "react-js-pagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bootbox from "bootbox";
class UploadDocuments extends Component {
  constructor() {
    super();
    this.state = {
      files: [],
      OppId: "",
      filesMetaData: [],
      MasterData: null,
      roleList: [],
      selectedValue: [],
      isLoading: false,
      geoRegionData: {},
      IsOpenMetaPopUp: false,
      AllDraftsSelected: false,
      SelectedIds: [],
      DraftsactivePage: 1,
      DraftsitemsCountPerPage: 4,
      DraftstotalItemsCount: 16,
      DraftDocuments: [],
      SubmitDocsAfterDrafts: false,
      SavedDrafts: [],
      AllDocNames: [],
      showDocumentPreview: false,
      UploadCount: 0,
      UploadApisCount: 0,
      modifyGeoRegionData: this.modifyGeoRegionData.bind(this),
      MasterDataOther: {},
    };
    this.handleDrop = this.handleDrop.bind(this);
    this.showMetaInfoPopUp = this.showMetaInfoPopUp.bind(this);
    this.SaveData = this.SaveData.bind(this);
    this.UpdateMasterTableDataOthers =
      this.UpdateMasterTableDataOthers.bind(this);
    this.UpdateMasterTableDataOthersNew =
      this.UpdateMasterTableDataOthersNew.bind(this);
  }
  CancelUpload = () => {
    var DraftsList = [];
    for (var i = 0; i < this.state.DraftsList.length; i++) {
      if (this.state.DraftsList[i].id.toString().indexOf("D-") == -1) {
        DraftsList.push(this.state.DraftsList[i]);
      }
    }
    this.setState(
      {
        files: [],
        filesMetaData: [],
        DraftsList,
        UploadCount: 0,
        UploadApisCount: 0,
      },
      () => this.paginate()
    );
  };
  SaveAsDraft = () => {
    this.setState({ isLoading: true }, () => {
      this.UploadAndSaveDocDetails(true);
    });
  };

  // UploadConfirmation() {
  //   var box = bootbox.confirm({
  //     size: "small",
  //     // title: "Duplicate!!",
  //     buttons: {
  //       cancel: {
  //         label: "No",
  //         // className: "btn btn-default custombutton",
  //         className: "btn btn-dark btn-sm",
  //       },
  //       confirm: {
  //         label: "Yes",
  //         // className: "btn btn-default custombutton",
  //         className: "btn btn-success btn-sm",
  //       },
  //     },
  //     message:
  //       "<div>Updated the predicted document type and metadata?<br/>Proceed to submit</div>",
  //     callback: (result) => {
  //       if (result) {
  //         this.UploadAndSaveDocDetails();
  //       }
  //     },
  //   });
  //   box.find(".modal-content").css({
  //     "font-size": "13px",
  //     "padding-top": "10px",
  //     right: "50px",
  //     top: "150px",
  //     "max-width": "115%",
  //   });
  // }
  UploadConfirmation() {
    var box = bootbox.confirm({
      size: "small",
      // title: "Duplicate!!",
      buttons: {
        cancel: {
          label: "No",
          // className: "btn btn-default custombutton",
          className: "btn btn-dark btn-sm",
        },
        confirm: {
          label: "Yes",
          // className: "btn btn-default custombutton",
          className: "btn btn-success btn-sm",
        },
      },
      message:
        "<div>Updated the predicted document type and metadata?<br/>Proceed to submit</div>",
      callback: (result) => {
        if (result) {
          this.SubmitDocuments();
        }
      },
    });
    box.find(".modal-content").css({
      "font-size": "13px",
      "padding-top": "10px",
      right: "50px",
      top: "150px",
      "max-width": "115%",
    });
  }

  SubmitDocuments = () => {
    this.setState({ isLoading: true }, () => {
      let requests = [];
      if (this.state.files.length > 0) {
        //Have Un Saved Documents
        this.setState({ SubmitDocsAfterDrafts: true }, () => {
          this.UploadAndSaveDocDetails(true);
        });
      } else {
        const empnumber = Cookies.get("empnumber");
        let DocIds = [];
        if (this.state.SavedDrafts.length > 0) {
          for (var i = 0; i < this.state.SavedDrafts.length; i++) {
            var DocID = this.state.SavedDrafts[i];
            this.setState({ isLoading: true });
            requests.push(
              axios.get(
                URLConfig.GetMarkAsInProgressAPI() + DocID + "/" + empnumber
              )
            );
            DocIds.push(DocID);
          }
        } else {
          for (var i = 0; i < this.state.DraftsList.length; i++) {
            var DocID = this.state.DraftsList[i].id;
            if (DocID !== 0 && this.state.SelectedIds.indexOf(DocID) !== -1) {
              this.setState({ isLoading: true });
              requests.push(
                axios.get(
                  URLConfig.GetMarkAsInProgressAPI() + DocID + "/" + empnumber
                )
              );
              DocIds.push(DocID);
            }
          }
        }

        axios
          .all(requests)
          .then(
            axios.spread((...responses) => {
              const response = responses;
              if (response.filter((x) => x.data == false).length == 0) {
                this.setState(
                  {
                    isLoading: false,
                    files: [],
                    filesMetaData: [],
                    DraftsList: [],
                    SubmitDocsAfterDrafts: false,
                  },
                  () => {
                    this.FireContributionMails(DocIds);
                    this.refresh();
                  }
                );
              }
              // use/access the results
            })
          )
          .catch((errors) => {
            // react on errors.
          });
      }
    });
  };

  // FormDefaultFileDetails(fileName) {
  //   var filesmetaData = this.state.filesMetaData;
  //   var fileDetails = new FileDetails();
  //   fileDetails.Name = fileName;
  //   fileDetails.oppId = this.state.OppId;
  //   fileDetails.client = "";
  //   fileDetails.industryVertical = "";
  //   fileDetails.industrySegment = "";
  //   fileDetails.language = "en";
  //   fileDetails.projectName = "";
  //   fileDetails.documentType = "";
  //   fileDetails.Document_Sub_Type = "";
  //   fileDetails.country = Cookies.get("country");
  //   fileDetails.id = filesmetaData.length;
  //   fileDetails.exclusiveFor = JSON.stringify(this.state.geoRegionData);

  //   filesmetaData.push(fileDetails);
  //   this.setState({ filesMetaData: filesmetaData });
  // }
  FormDefaultFileDetails = (fileName) => {
    var DraftsList = this.state.DraftsList;
    var fileDetails = new FileDetails();
    fileDetails.name = fileName;
    fileDetails.oppId = this.state.OppId;
    fileDetails.client = "";
    fileDetails.industryVertical = "";
    fileDetails.industrySegment = "";
    fileDetails.projectName = "";
    fileDetails.id = "D-" + DraftsList.length;
    var deltaDocumentDetails = new DeltaDocumentDetails();

    deltaDocumentDetails.language = "en";
    deltaDocumentDetails.documentType = "";
    deltaDocumentDetails.country = Cookies.get("country");
    deltaDocumentDetails.exclusiveFor = JSON.stringify(
      this.state.geoRegionData
    );

    fileDetails.deltaDocumentDetails.push(deltaDocumentDetails);

    DraftsList.push(fileDetails);
    this.setState({ DraftsList: DraftsList, isLoading: false }, () =>
      this.paginate()
    );
  };

  // FormFileDetails(data) {
  //   var filesmetaData = this.state.filesMetaData;
  //   var fileDetails = filesmetaData.find((x) => x.Name == data.filename);
  //   fileDetails.Name = data.filename;
  // fileDetails.client =
  //   data.psa_opportunity_details[0].Account_Account_ST_Name__c;
  // fileDetails.industryVertical =
  //   data.psa_opportunity_details[0].Account_Industry_Vertical__c;
  // fileDetails.industrySegment =
  //   data.psa_opportunity_details[0].Account_Industry_Segment__c;
  // fileDetails.language = data.language;
  // fileDetails.projectName =
  //   data.project_details.length > 0
  //     ? data.project_details[0].project_name
  //     : "";
  //   fileDetails.documentType = data.predicted_document_type;
  //   fileDetails.Document_Sub_Type =
  //     data.predicted_document_sub_type == null
  //       ? ""
  //       : data.predicted_document_sub_type;

  //   //filesmetaData.push(fileDetails);
  //   this.setState({ filesMetaData: filesmetaData });
  // }
  FormFileDetails = (data) => {
    debugger;
    var DraftsList = this.state.DraftsList;
    var fileDetails = DraftsList.find((x) => x.name == data.filename);
    fileDetails.Name = data.filename;
    fileDetails.client =
      data.psa_opportunity_details[0].Account_Account_ST_Name__c;
    fileDetails.industryVertical =
      data.psa_opportunity_details[0].Account_Industry_Vertical__c;
    fileDetails.industrySegment =
      data.psa_opportunity_details[0].Account_Industry_Segment__c;
    fileDetails.projectName =
      data.project_details.length > 0
        ? data.project_details[0].project_name
        : "";
    fileDetails.Document_Sub_Type =
      data.predicted_document_sub_type == null
        ? ""
        : data.predicted_document_sub_type;
    var deltaDocumentDetails = fileDetails.deltaDocumentDetails[0];
    deltaDocumentDetails.language = data.language;
    deltaDocumentDetails.documentType = data.predicted_document_type;
    deltaDocumentDetails.country = Cookies.get("country");
    this.setState({ DraftsList: DraftsList }, () => this.paginate());
  };
  getFileMetaData(FileName) {
    debugger;
    this.FormDefaultFileDetails(FileName);
    const URL =
      "https://hpedelta.com:5003/api/v1/ml/predict?q=" +
      FileName +
      "&opp_wbs_id=" +
      this.state.OppId;
    const config = URLConfig.ApplyAuth(URL);
    axios(config)
      .then((res) => {
        this.FormFileDetails(res.data);
        this.CheckApiCompletion();
      })
      .catch((errors) => {
        this.CheckApiCompletion();
      });
  }

  CheckApiCompletion = () => {
    const UploadApisCount = this.state.UploadApisCount + 1;
    if (this.state.UploadCount === UploadApisCount) {
      this.setState({ UploadApisCount, isLoading: false });
    } else {
      this.setState({ UploadApisCount });
    }
  };
  toastError = (ErrorMessage) => {
    toast.error(ErrorMessage, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };
  // handleDrop = (files) => {
  //   let fileList = this.state.files;
  //   for (var i = 0; i < files.length; i++) {
  //     if (!files[i].name) return;
  //     fileList.push(files[i]);
  //     this.getFileMetaData(files[i].name);
  //   }
  //   this.setState({
  //     files: fileList,
  //     UploadCount: files.length,
  //     isLoading: true,
  //   });
  // };

  handleDrop = (files) => {
    // this.setState({ isLoading: true });
    let fileList = this.state.files;
    for (var i = 0; i < files.length; i++) {
      if (!files[i].name) return;
      if (i > 14) {
        this.toastError(
          "Won't be able to upload " +
            files[i].name +
            " since the maximum drafts limit exceeds 15"
        );
      } else {
        fileList.push(files[i]);
        this.getFileMetaData(files[i].name);
      }
    }
    this.setState({
      files: fileList,
      UploadCount: files.length,
      isLoading: true,
    });
  };

  // setFile(e) {
  //   let fileList = [];
  //   let setFileList = [],
  //     customsetFileList = [],
  //     addSetFileList = [];
  //   let setAllDocs = [],
  //     customAllDocs = [],
  //     addAllDocs = [];
  //   this.setState({ isLoading: true });
  //   for (var i = 0; i < e.target.files.length; i++) {
  //     if (this.state.AllOppDocNames.includes(e.target.files[i].name)) {
  //       // this.toastError("Duplicate Document!! Please re-validate");
  //       // continue;
  //       setFileList.push(e.target.files[i].name + "<br/>");
  //       customsetFileList = setFileList.join(" ");
  //       addSetFileList = customsetFileList.replace(/,/g, " ");
  //       continue;
  //     }
  //     if (fileList.filter((x) => x.name == e.target.files[i].name).length > 0) {
  //       // this.toastError(
  //       //   "Won't be able to upload " +
  //       //     e.target.files[i].name +
  //       //     " since the duplicate files"
  //       // );
  //       // continue;
  //       setAllDocs.push(e.target.files[i].name + "<br/>");
  //       customAllDocs = setAllDocs.join(" ");
  //       addAllDocs = customAllDocs.replace(/,/g, " ");
  //       continue;
  //     } else {
  //       fileList.push(e.target.files[i]);
  //       this.getFileMetaData(e.target.files[i].name);
  //     }
  //   }
  //   if (addSetFileList.length >= 1 || setAllDocs.length >= 1) {
  //     var box = bootbox.alert({
  //       size: "small",
  //       title: "Duplicate!!",
  //       buttons: {
  //         ok: {
  //           label: "OK",
  //           className: "btn btn-default custombutton",
  //         },
  //       },
  //       message:
  //         "<div>Document already contributed. Please re-validate!!</div><br/>" +
  //         addSetFileList +
  //         addAllDocs,
  //     });
  //     box.find(".modal-content").css({
  //       "font-size": "13px",
  //       border: "4px solid #191970",
  //       right: "140px",
  //     });
  //   }
  //   this.setState({
  //     files: fileList,
  //     isLoading: true,
  //     UploadCount: e.target.files.length,
  //   });
  // }

  setFile = (e) => {
    let fileList = [];
    let setFileList = [],
      customsetFileList = [],
      addSetFileList = [];
    let setAllDocs = [],
      customAllDocs = [],
      addAllDocs = [];
    this.setState({ isLoading: true });
    for (var i = 0; i < e.target.files.length; i++) {
      // if file is present in any of the lifecycle
      if (this.state.AllDocNames.includes(e.target.files[i].name)) {
        // this.toastError("Duplicate Document!! Please re-validate");
        // continue;
        setFileList.push(e.target.files[i].name + "<br/>");
        customsetFileList = setFileList.join(" ");
        addSetFileList = customsetFileList.replace(/,/g, " ");
        continue;
      }

      if (fileList.filter((x) => x.name == e.target.files[i].name).length > 0) {
        // this.toastError(
        //   "Won't be able to upload " +
        //     e.target.files[i].name +
        //     " since the duplicate files"
        // );
        // continue;
        setAllDocs.push(e.target.files[i].name + "<br/>");
        customAllDocs = setAllDocs.join(" ");
        addAllDocs = customAllDocs.replace(/,/g, " ");
        continue;
      }
      if (i > 14) {
        this.toastError(
          "Exceeded permissible number of documents that can be saved as draft. Please submit / delete existing drafts to proceed."
        );
      }

      // uncomment once validation is done
      else {
        fileList.push(e.target.files[i]);
        this.getFileMetaData(e.target.files[i].name);
      }
    }

    if (addSetFileList.length >= 1 || setAllDocs.length >= 1) {
      var box = bootbox.alert({
        size: "small",
        title: "Duplicate!!",
        buttons: {
          ok: {
            label: "OK",
            className: "btn btn-default custombutton",
          },
        },
        message:
          "<div>Document already contributed. Please re-validate!!</div><br/>" +
          addSetFileList +
          addAllDocs,
      });
      box.find(".modal-content").css({
        "font-size": "13px",
        border: "4px solid #191970",
        right: "140px",
      });
    }
    this.setState({
      files: fileList,
      isLoading: true,
      UploadCount: e.target.files.length,
    });
  };

  // AddMore = (e) => {
  //   this.setState({ isLoading: true });
  //   var files = this.state.files;
  //   let setFileList = [],
  //     customsetFileList = [],
  //     addSetFileList = [];
  //   let setAllDocs = [],
  //     customAllDocs = [],
  //     addAllDocs = [];
  //   for (var i = 0; i < e.target.files.length; i++) {
  //     if (this.state.AllOppDocNames.includes(e.target.files[i].name)) {
  //       // this.toastError("Duplicate Document!! Please re-validate");
  //       // continue;
  //       setFileList.push(e.target.files[i].name + "<br/>");
  //       customsetFileList = setFileList.join(" ");
  //       addSetFileList = customsetFileList.replace(/,/g, " ");
  //       continue;
  //     }
  //     if (files.filter((x) => x.name == e.target.files[i].name).length > 0) {
  //       // this.toastError(
  //       //   "Won't be able to upload " +
  //       //     e.target.files[i].name +
  //       //     " since the duplicate files"
  //       // );
  //       // continue;
  //       setAllDocs.push(e.target.files[i].name + "<br/>");
  //       customAllDocs = setAllDocs.join(" ");
  //       addAllDocs = customAllDocs.replace(/,/g, " ");
  //       continue;
  //     } else {
  //       files.push(e.target.files[i]);
  //       this.getFileMetaData(e.target.files[i].name);
  //     }
  //   }
  //   if (addSetFileList.length >= 1 || setAllDocs.length >= 1) {
  //     var box = bootbox.alert({
  //       size: "small",
  //       title: "Duplicate!!",
  //       buttons: {
  //         ok: {
  //           label: "OK",
  //           className: "btn btn-default custombutton",
  //         },
  //       },
  //       message:
  //         "<div>Document already contributed. Please re-validate!!</div><br/>" +
  //         addSetFileList +
  //         addAllDocs,
  //     });
  //     box.find(".modal-content").css({
  //       "font-size": "13px",
  //       border: "4px solid #191970",
  //       right: "140px",
  //     });
  //   }
  //   this.setState({
  //     files,
  //     isLoading: false,
  //     UploadCount: e.target.files.length,
  //   });
  // };
  AddMore = (e) => {
    this.setState({ isLoading: true });
    const presentCount = this.state.DraftsList.length;
    var files = this.state.files;
    let setFileList = [],
      customsetFileList = [],
      addSetFileList = [];
    let setAllDocs = [],
      customAllDocs = [],
      addAllDocs = [];
    for (var i = 0; i < e.target.files.length; i++) {
      if (
        files.filter((x) => x.name == e.target.files[i].name).length > 0 ||
        this.state.DraftsList.filter((x) => x.name == e.target.files[i].name)
          .length > 0
      ) {
        // this.toastError(
        //   "Won't be able to upload " +
        //     e.target.files[i].name +
        //     " since the duplicate files"
        // );
        // continue;
        setAllDocs.push(e.target.files[i].name + "<br/>");
        customAllDocs = setAllDocs.join(" ");
        addAllDocs = customAllDocs.replace(/,/g, " ");
        continue;
      }

      if (this.state.AllDocNames.includes(e.target.files[i].name)) {
        // this.toastError("Duplicate Document!! Please re-validate");
        // continue;
        setFileList.push(e.target.files[i].name + "<br/>");
        customsetFileList = setFileList.join(" ");
        addSetFileList = customsetFileList.replace(/,/g, " ");
        continue;
      }

      if (this.state.DraftsList.length > 14) {
      } else {
        if (i + presentCount > 14) {
          this.toastError(
            "Exceeded permissible number of documents that can be saved as draft. Please submit / delete existing drafts to proceed."
          );
        } else {
          files.push(e.target.files[i]);
          this.getFileMetaData(e.target.files[i].name);
        }
      }
    }
    if (addSetFileList.length >= 1 || setAllDocs.length >= 1) {
      var box = bootbox.alert({
        size: "small",
        title: "Duplicate!!",
        buttons: {
          ok: {
            label: "OK",
            className: "btn btn-default custombutton",
          },
        },
        message:
          "<div>Document already contributed. Please re-validate!!</div><br/>" +
          addSetFileList +
          addAllDocs,
      });
      box.find(".modal-content").css({
        "font-size": "13px",
        border: "4px solid #191970",
        right: "140px",
      });
    }
    this.setState({
      files,
      isLoading: false,
      UploadCount: e.target.files.length,
    });
    e.target.value = "";
  };
  // componentDidMount() {
  //   const OppId = this.props.oppId;
  //   this.setState({ OppId: OppId });
  //   if (this.props.MasterData.geoRegions) {
  //     this.setState({ geoRegions: this.props.MasterData.geoRegions }, () =>
  //       this.modifyGeoRegionData()
  //     );
  //   }
  //   let DocNameURL = URLConfig.GetAllDocumentNames();
  //   axios(URLConfig.ApplyAuth(DocNameURL)).then((res) => {
  //     if (res.data.length > 0) {
  //       this.setState({ AllOppDocNames: res.data });
  //     }
  //   });
  // }
  componentDidMount() {
    const OppId = this.props.oppId;
    const DraftsList = this.props.docs
      ? this.props.docs.filter(
          (x) => x.status == 1 && x.uploadedBy == Cookies.get("empnumber")
        )
      : "";
    const files = [];
    this.setState({ OppId, DraftsList, files }, () => this.paginate());
    if (this.props.MasterData.geoRegions) {
      this.setState({ geoRegions: this.props.MasterData.geoRegions }, () =>
        this.modifyGeoRegionData()
      );
    }

    let DocNameURL = URLConfig.GetAllDocumentNames();
    axios(URLConfig.ApplyAuth(DocNameURL)).then((res) => {
      if (res.data.length > 0) {
        this.setState({ AllDocNames: res.data });
      }
    });
    this.UpdateMasterTableDataOthers();
  }

  UpdateMasterTableDataOthers() {
    const otherURL = URLConfig.GetAllOtherMasterTablesDataURL();
    axios.get(otherURL).then((res) => {
      if (res.data) {
        this.setState({
          MasterDataOther: res.data,
        });
      }
    });
  }
  UpdateMasterTableDataOthersNew(data, name) {
    let MasterDataOther = this.state.MasterDataOther;
    MasterDataOther.competitorsOthers = [];
    MasterDataOther.researchVendorsOthers = [];
    MasterDataOther.partnersOthers = [];
    if (data.competitorsOthers != undefined && data.competitorsOthers != "") {
      var competitorOthers = data.competitorsOthers.split(",");
      for (var i = 0; i < competitorOthers.length; i++)
        MasterDataOther.competitorsOthers.push({
          name: competitorOthers[i],
          createdBy: name,
        });
    }
    if (
      data.researchVendorsOthers != undefined &&
      data.researchVendorsOthers != ""
    ) {
      var vendorsOthers = data.researchVendorsOthers.split(",");
      for (var i = 0; i < vendorsOthers.length; i++)
        MasterDataOther.researchVendorsOthers.push({
          name: vendorsOthers[i],
          createdBy: name,
        });
    }
    if (data.partnersOthers != undefined && data.partnersOthers != "") {
      var partnerOthers = data.partnersOthers.split(",");
      for (var i = 0; i < partnerOthers.length; i++)
        MasterDataOther.partnersOthers.push({
          name: partnerOthers[i],
          createdBy: name,
        });
    }
    this.setState({ MasterDataOther: MasterDataOther });
  }

  paginate = () => {
    // pagination
    const pageSize = this.state.DraftsitemsCountPerPage;
    this.setState({
      DraftsListPaginated: this.state.DraftsList.slice(0, pageSize),
      TotalCount: this.state.DraftsList.length,
      DraftstotalItemsCount: this.state.DraftsList.length,
    });
  };
  handlePageChange = (pageNumber) => {
    const lists = this.state.DraftsList;
    const begin =
      pageNumber * this.state.DraftsitemsCountPerPage -
      this.state.DraftsitemsCountPerPage;
    const end =
      pageNumber * this.state.DraftsitemsCountPerPage >
      this.state.DraftsList.length
        ? this.state.DraftsList.length
        : pageNumber * this.state.DraftsitemsCountPerPage;
    const list = lists.slice(begin, end);
    this.setState({ DraftsactivePage: pageNumber, DraftsListPaginated: list });
  };

  // modifyGeoRegionData = (geoRegions) => {
  //   const transformedObject = {};
  //   transformedObject.isTouched = false;
  //   let data = [...this.state.geoRegions];

  //   let regionsObject = _.groupBy(data, "region");
  //   let regions = Object.keys(regionsObject);

  //   let regionsWithCheckBoxValue = regions.map((r) => {
  //     return { regionName: r, isChecked: true };
  //   });

  //   transformedObject.regions = regionsWithCheckBoxValue;

  //   for (let i = 0; i < transformedObject.regions.length; ++i) {
  //     let sameRegions = data.filter((c) => {
  //       return c.region === regions[i];
  //     });

  //     let clustersObject = _.groupBy(sameRegions, "cluster");
  //     let clusters = Object.keys(clustersObject);

  //     let clustersWithCheckBoxValue = clusters.map((c) => {
  //       return {
  //         clusterName: c,
  //         isChecked: true,
  //         countries: clustersObject[c].map((country) => {
  //           return { ...country, isChecked: true };
  //         }),
  //       };
  //     });

  //     transformedObject.regions[i].clusters = clustersWithCheckBoxValue;
  //   }
  //   this.setState({ geoRegionData: transformedObject });
  // };

  modifyGeoRegionData = () => {
    const transformedObject = {};
    transformedObject.isTouched = false;
    let data = [...this.state.geoRegions];

    let regionsObject = _.groupBy(data, "region");
    let regions = Object.keys(regionsObject);

    let regionsWithCheckBoxValue = regions.map((r) => {
      return { regionName: r, isChecked: true };
    });

    transformedObject.regions = regionsWithCheckBoxValue;

    for (let i = 0; i < transformedObject.regions.length; ++i) {
      let sameRegions = data.filter((c) => {
        return c.region === regions[i];
      });

      let clustersObject = _.groupBy(sameRegions, "cluster");
      let clusters = Object.keys(clustersObject);

      let clustersWithCheckBoxValue = clusters.map((c) => {
        return {
          clusterName: c,
          isChecked: true,
          countries: clustersObject[c].map((country) => {
            return { ...country, isChecked: true };
          }),
        };
      });

      transformedObject.regions[i].clusters = clustersWithCheckBoxValue;
    }
    this.setState({ geoRegionData: transformedObject });
  };

  showMetaInfoPopUp(data) {
    this.setState({ SelectedDoc: data, IsOpenMetaPopUp: true });
  }

  // SaveData(data) {
  //   //Update Selected/Edited File details here
  //   const MetaData = [];
  //   for (var i = 0; i < this.state.filesMetaData.length; i++) {
  //     if (this.state.filesMetaData[i].Name !== data.Name) {
  //       MetaData.push(this.state.filesMetaData[i]);
  //     } else {
  //       MetaData.push(data);
  //     }
  //   }
  //   this.setState({ filesMetaData: MetaData });
  // }
  SaveData(data) {
    debugger;
    //Update Selected/Edited File details here
    const DraftsList = [];
    for (var i = 0; i < this.state.DraftsList.length; i++) {
      if (this.state.DraftsList[i].name !== data.name) {
        DraftsList.push(this.state.DraftsList[i]);
        this.UpdateMasterTableDataOthersNew(
          data,
          this.state.DraftsList[i].name
        );
      } else {
        DraftsList.push(data);
        if (data.id.toString().indexOf("D-") == -1) {
          this.SaveMetaData(data.deltaDocumentDetails[0]);
        }
      }
    }
    this.setState({ DraftsList }, () => this.paginate());
  }

  SaveMetaData = (docData) => {
    debugger;
    const url = URLConfig.EditDocumentDetails();
    docData.modifiedBy = Cookies.get("mail");
    post(url, docData).then((res) => {
      if (res.data) {
        this.setState({ isLoading: false });
        this.UpdateMasterTableDataOthers();
      }
    });
  };

  // UploadAndSaveDocDetails() {
  //   var element = [];
  //   this.setState({ isLoading: true });
  //   const files = this.state.filesMetaData;
  //   const empnumber = Cookies.get("empnumber");
  //   const url = URLConfig.UploadFile(empnumber, this.state.OppId, false);
  //   const formData = new FormData();
  //   for (var index = 0; index < this.state.SelectedIds.length; index++) {
  //     var id = this.state.SelectedIds[index];
  //     element = this.state.files[id];
  //     formData.append("files", element);
  //   }
  //   const config = {
  //     headers: {
  //       "content-type": "multipart/form-data",
  //     },
  //   };
  //   post(url, formData, config).then((res) => {
  //     if (res.data) {
  //       this.SaveDocumentDetails(res.data);
  //     }
  //   });
  // }

  UploadAndSaveDocDetails = (isDraft) => {
    const empnumber = Cookies.get("empnumber");
    const url = URLConfig.UploadFile(empnumber, this.state.OppId, isDraft);
    const formData = new FormData();
    if (this.state.files && this.state.files.length > 0) {
      if (this.state.SubmitDocsAfterDrafts) {
        for (var index = 0; index < this.state.SelectedIds.length; index++) {
          var file = this.state.files.filter(
            (x) =>
              x.name ==
              this.state.DraftsList.filter(
                (x) => x.id == this.state.SelectedIds[index]
              )[0].name
          )[0];
          //if (!isDraft && this.state.SelectedIds.indexOf(file.name) != -1)
          formData.append("files", file);
          //else if (isDraft) formData.append("files", file);
        }
      } else {
        for (var index = 0; index < this.state.files.length; index++) {
          var file = this.state.files[index];
          if (!isDraft && this.state.SelectedIds.indexOf(file.name) != -1)
            formData.append("files", file);
          else if (isDraft) formData.append("files", file);
        }
      }

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      post(url, formData, config).then((res) => {
        if (res.data) {
          this.SaveDocumentDetails(res.data, isDraft);
        }
      });
    }
  };

  // SaveDocumentDetails(data) {
  //   let PostRequests = [];
  //   let DocIds = [];
  //   for (var i = 0; i < data.length; i++) {
  //     var MetaData = this.state.filesMetaData.find(
  //       (x) => x.Name === data[i].fileName
  //     );
  //     MetaData.uploadedBy = Cookies.get("mail");
  //     DocIds.push(data[i].id);
  //     const url = URLConfig.AddDocumentDetails() + data[i].id;
  //     PostRequests.push(axios.post(url, MetaData));
  //   }
  //   axios
  //     .all(PostRequests)
  //     .then(
  //       axios.spread((...responses) => {
  //         const response = responses;
  //         if (response.filter((x) => x.data == false).length == 0) {
  //           //this.FireContributionMails(data.map((x) => x.id));
  //           this.setState(
  //             {
  //               isLoading: false,
  //             },
  //             () => {
  //               this.FireContributionMails(DocIds);
  //               this.refresh();
  //             }
  //           );
  //         }
  //         // use/access the results
  //       })
  //     )
  //     .catch((errors) => {
  //       // react on errors.
  //     });
  // }
  SaveDocumentDetails = (data, isDraft) => {
    let PostRequests = [];
    let SavedDrafts = [];
    for (var i = 0; i < data.length; i++) {
      var MetaData = this.state.DraftsList.find(
        (x) => x.name === data[i].fileName
      ).deltaDocumentDetails[0];
      MetaData.uploadedBy = Cookies.get("mail");
      const url = URLConfig.AddDocumentDetails() + data[i].id;
      PostRequests.push(axios.post(url, MetaData));
      SavedDrafts.push(data[i].id);
    }
    axios
      .all(PostRequests)
      .then(
        axios.spread((...responses) => {
          const response = responses;
          if (
            response.filter((x) => x.data == false).length == 0 &&
            this.state.SubmitDocsAfterDrafts
          ) {
            //this.FireContributionMails(data.map((x) => x.id));
            this.setState(
              {
                files: [],
                filesMetaData: [],
                SubmitDocsAfterDrafts: false,
                SavedDrafts,
              },
              () => {
                this.SubmitDocuments();
              }
            );
          } else {
            this.setState(
              {
                isLoading: false,
                files: [],
                filesMetaData: [],
                DraftsList: [],
              },
              () => {
                this.refresh();
              }
            );
          }
          // use/access the results
        })
      )
      .catch((errors) => {
        // react on errors.
      });
  };

  FireContributionMails = (data) => {
    var data = JSON.stringify(data);
    var config = {
      method: "post",
      url: URLConfig.GetContributionMail_URL(),
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  refresh() {
    const { refreshData } = this.props;
    refreshData();
  }

  // RemoveUploadingFile = (index) => {
  //   var filesMetaData = [];
  //   var files = [];
  //   for (var i = 0; i < this.state.filesMetaData.length; i++) {
  //     if (this.state.files[i].name !== this.state.filesMetaData[index].Name) {
  //       files.push(this.state.files[i]);
  //     }
  //     if (index != i) {
  //       filesMetaData.push(this.state.filesMetaData[i]);
  //     }
  //   }
  //   this.setState({ filesMetaData, files });
  // };
  RemoveUploadingFile = (index) => {
    var DraftsList = [];
    var files = [];
    var document = this.state.DraftsList[index];
    var isUploadedDraft =
      document.id.toString().indexOf("D-") === -1 ? false : true;
    for (var i = 0; i < this.state.DraftsList.length; i++) {
      if (index !== i) {
        DraftsList.push(this.state.DraftsList[i]);
      }
    }
    for (var i = 0; i < this.state.files.length; i++) {
      if (this.state.files[i].name !== document.name) {
        files.push(this.state.files[i]);
      }
    }

    if (isUploadedDraft) {
      this.setState({ DraftsList, files }, () => this.paginate());
    } else {
      const URL =
        URLConfig.GetDraftDeleteAPI() +
        document.id +
        "/" +
        Cookies.get("empnumber");
      axios.delete(URL).then((res) => {
        if (res.data)
          this.setState({ DraftsList, files }, () => this.paginate());
      });
    }
  };

  toggleSelectAllCheckbox = () => {
    let AllDraftsSelected = !this.state.AllDraftsSelected;
    if (AllDraftsSelected)
      var SelectedIds = this.state.DraftsList.map((x) => x.id);
    else SelectedIds = [];
    this.setState({ AllDraftsSelected, SelectedIds });
  };

  toggleSelectDocCheckbox = (checked, id) => {
    let SelectedIds = this.state.SelectedIds;
    if (checked) {
      SelectedIds.push(id);
      if (SelectedIds.length === this.state.DraftsList.length) {
        this.setState({ AllDraftsSelected: true, SelectedIds });
      } else {
        this.setState({ SelectedIds });
      }
    } else {
      //Remove it from SelectedIds
      const index = SelectedIds.indexOf(id);
      if (index > -1) {
        SelectedIds.splice(index, 1);
        if (this.state.AllDraftsSelected) {
          this.setState({ SelectedIds, AllDraftsSelected: false });
        } else {
          this.setState({ SelectedIds });
        }
      }
    }
  };

  render() {
    const count = this.props.count;
    const MasterData = this.props.MasterData;
    MasterData.exclusiveFor = this.state.geoRegionData;
    return (
      <Fragment>
        {this.state.DraftsList && this.state.DraftsList.length > 0 && (
          <Fragment>
            <div className="col-12 mt-3">
              <table
                className="table-sm table-striped table-bordered"
                width="100%"
              >
                <tbody>
                  <tr className="border-bottom mb-2">
                    <td className="border-none tab-background" width="4%">
                      <input
                        type="checkbox"
                        checked={this.state.AllDraftsSelected}
                        onChange={this.toggleSelectAllCheckbox}
                      ></input>
                    </td>
                    <td className="border-none tab-background" width="50%">
                      <strong>Document Name</strong>
                    </td>
                    <td className="border-none tab-background">
                      <strong>Uploaded Date (UTC)</strong>
                    </td>
                    <td className="border-none tab-background">
                      <strong>Predicted Document Type</strong>
                    </td>
                    <td className="border-none tab-background"></td>
                    <td className="border-none tab-background"></td>
                    <td className="border-none tab-background"></td>
                  </tr>
                  {this.state.DraftsListPaginated &&
                    this.state.DraftsListPaginated.map((value, index) => (
                      <tr key={index}>
                        <td width="4%">
                          <input
                            type="checkbox"
                            checked={
                              this.state.SelectedIds.indexOf(value.id) != -1
                            }
                            onChange={(e) =>
                              this.toggleSelectDocCheckbox(
                                e.target.checked,
                                value.id
                              )
                            }
                          ></input>
                        </td>
                        <td className="pt-2">
                          {
                            <a
                              className={identifyFileFormat(
                                value.name.toLowerCase()
                              )}
                            ></a>
                          }
                          <a>{value.name}</a>
                        </td>
                        <td className="pt-2">{formatDate(value.uploadedDt)}</td>
                        <td className="pt-2">
                          {value?.deltaDocumentDetails[0]?.documentType}
                        </td>
                        <td className="pt-2">
                          <button
                            type="button"
                            className="btn btn-light p-1"
                            onClick={() => this.showMetaInfoPopUp(value)}
                          >
                            <i className="fas fa-bars"></i>
                          </button>
                        </td>
                        <td className="pt-2">
                          <button
                            type="button"
                            className="btn btn-light p-1"
                            onClick={() => this.RemoveUploadingFile(index)}
                          >
                            <i className="fas fa-trash" aria-hidden="true"></i>
                          </button>
                        </td>
                        {value.documentPath && (
                          <td className="pt-2 ">
                            <button type="button" className="btn btn-light p-1">
                              <i
                                className="fas fa-eye pointer"
                                title="Document Preview"
                                onClick={() =>
                                  this.setState({
                                    showDocumentPreview: true,
                                    previewURL: URLConfig.handlePreview(
                                      value.documentPath
                                    ),
                                  })
                                }
                              ></i>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  {this.state.DraftsListPaginated &&
                    this.state.DraftsList.length > 4 && (
                      <tr>
                        <td colSpan="5">
                          <div className="text-center">
                            <Pagination
                              prevPageText="<"
                              nextPageText=">"
                              firstPageText="<<"
                              lastPageText=">>"
                              activePage={this.state.DraftsactivePage}
                              itemsCountPerPage={
                                this.state.DraftsitemsCountPerPage
                              }
                              totalItemsCount={this.state.DraftstotalItemsCount}
                              pageRangeDisplayed={5}
                              onChange={this.handlePageChange}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
              {!this.state.isLoading && (
                <Fragment>
                  {this.state.DraftstotalItemsCount &&
                    this.state.DraftstotalItemsCount < 15 && (
                      <div className="col-12 mt-4">
                        <button className="btn btn-sm btn-success mr-3">
                          Add More
                          <input
                            type="file"
                            multiple
                            onChange={(e) => this.AddMore(e)}
                            className="doc-depo-input-upload"
                          ></input>
                        </button>
                      </div>
                    )}

                  <div className="col-12 mt-3">
                    {this.state.files && this.state.files.length > 0 && (
                      <Fragment>
                        <button
                          className="btn btn-sm btn-danger float-right mb-3"
                          onClick={() => {
                            this.CancelUpload();
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-sm btn-info float-right mb-3 mr-3"
                          onClick={() => {
                            this.SaveAsDraft();
                          }}
                        >
                          Save As Draft
                        </button>
                      </Fragment>
                    )}
                    {this.state.SelectedIds.length > 0 && (
                      <button
                        className="btn btn-sm float-right btn-success mb-3 mr-3"
                        onClick={() => {
                          this.UploadConfirmation();
                        }}
                      >
                        Submit Documents
                      </button>
                    )}
                  </div>
                </Fragment>
              )}
            </div>
          </Fragment>
        )}
        <DragAndDrop handleDrop={this.handleDrop}>
          {this.state.DraftsList && this.state.DraftsList.length === 0 && (
            <div className="col-12 p-5 mt-5 nodocspace">
              <div className="doc-depo-div-file-select">
                {count === 0 && (
                  <h6>
                    {/* No Documents Available. Please Select or drag and drop the
                    documents to upload */}
                    Click to browse or drag and drop to upload more
                  </h6>
                )}
                {count > 0 && (
                  <h6>Click to browse or drag and drop to upload more</h6>
                )}
                <input
                  type="file"
                  multiple
                  onChange={(e) => this.setFile(e)}
                  className="doc-depo-input-upload"
                />
              </div>
            </div>
          )}
        </DragAndDrop>
        {/* <DragAndDrop handleDrop={this.handleDrop}>
          {this.state.files.length === 0 && (
            <div className="col-12 p-5 mt-5 nodocspace">
              <div className="doc-depo-div-file-select">
                {count === 0 && (
                  <h6>Click to browse or drag and drop to upload more</h6>
                )}
                {count > 0 && (
                  <h6>Click to browse or drag and drop to upload more</h6>
                )}
                <input
                  type="file"
                  multiple
                  onChange={(e) => this.setFile(e)}
                  className="doc-depo-input-upload"
                />
              </div>
            </div>
          )}
          {this.state.files.length > 0 && (
            <div className="col-12 mt-3">
              <table className="table-borderless" width="100%">
                <tbody>
                  <tr className="border-bottom mb-2">
                    <td className="border-none" width="4%">
                      <input
                        type="checkbox"
                        checked={this.state.AllDraftsSelected}
                        onChange={this.toggleSelectAllCheckbox}
                      ></input>
                    </td>
                    <td className="border-none" width="50%">
                      <strong>Document Name</strong>
                    </td>
                    <td className="border-none">
                      <strong>Predicted Document Type</strong>
                    </td>
                    <td className="border-none"></td>
                  </tr>
                  {this.state.filesMetaData.map((value, index) => (
                    <tr key={index}>
                      <td width="4%">
                        <input
                          type="checkbox"
                          checked={
                            this.state.SelectedIds.indexOf(value.id) != -1
                          }
                          onChange={(e) =>
                            this.toggleSelectDocCheckbox(
                              e.target.checked,
                              value.id
                            )
                          }
                        ></input>
                      </td>
                      <td width="pt-2">
                        {/* <td className="pt-2"> */}
        {/* {
                          <a
                            className={this.identifyFileFormat(
                              value.Name.toLowerCase()
                            )}
                          ></a>
                        } */}
        {/* <a>{value.Name}</a>
                      </td> */}
        {/* <td className="pt-2">{value.documentType}</td> */}
        {/* <select className="form-control form-control-sm"><option>SOW</option></select></td> */}

        {/* <td className="pt-2">
                        <button
                          type="button"
                          className="btn btn-light p-1"
                          onClick={() => this.showMetaInfoPopUp(value)}
                        >
                          <i className="fas fa-bars"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-light p-1 pointer ml-2"
                          onClick={() => this.RemoveUploadingFile(index)}
                        >
                          <i className="fas fa-trash" aria-hidden="true"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!this.state.isLoading && ( */}
        {/* <Fragment>
                  <div className="col-12 mt-4">
                    <button className="btn btn-sm btn-success mr-3">
                      Add More
                      <input
                        type="file"
                        multiple
                        onChange={(e) => this.AddMore(e)}
                        className="doc-depo-input-upload"
                      ></input>
                    </button>
                  </div>
                  <div className="col-12 mt-4">
                    <button
                      className="btn btn-sm btn-danger float-right"
                      onClick={this.CancelUpload}
                    >
                      Cancel
                    </button>
                    {this.state.SelectedIds.length > 0 && (
                      <button
                        className="btn btn-sm float-right btn-success mr-3"
                        onClick={this.UploadConfirmation}
                      >
                        Submit Documents
                      </button>
                    )}
                  </div>
                </Fragment>
              )}
            </div>
          )}
        </DragAndDrop> */}
        <Modal
          show={this.state.IsOpenMetaPopUp}
          dialogClassName="doc-depo-meta-popups"
          size="lg"
        >
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a className="btn btn-sm btn-transp">
                {this.state.SelectedDoc ? this.state.SelectedDoc.Name : ""}
              </a>
              <a
                className="btn btn-link float-right mtop-5 Doc-Depo-Heading close-btn"
                onClick={() => {
                  this.setState({ IsOpenMetaPopUp: false, SelectedDoc: null });
                }}
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.SelectedDoc && (
              <UploadDocumentDetailsModal
                onSave={this.SaveData}
                MasterData={MasterData}
                docData={this.state.SelectedDoc}
                geoRegionData={this.state.geoRegionData}
                EditMode={true}
                MasterDataOther={this.state.MasterDataOther}
              ></UploadDocumentDetailsModal>
            )}
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.showDocumentPreview}
          onHide={() => this.setState({ showDocumentPreview: false })}
          dialogClassName="preview-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Document Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body dialogClassName="preview-body">
            <div className="preview_iframe">
              <iframe
                frameborder="0"
                allowfullscreen
                src={this.state.previewURL}
              />
            </div>
          </Modal.Body>
        </Modal>
        {this.state.isLoading && (
          <div className="text-center">
            <img className="loading-img" src={logo} alt="loading"></img>
          </div>
        )}
      </Fragment>
    );
  }
}
export default UploadDocuments;
