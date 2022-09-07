import React, { Fragment } from "react";
import Cookies from "js-cookie";
import axios, { post } from "axios";
import bootbox from "bootbox";
import DocumentDetailsModal from "../DocMetaDataModal";
import URLConfig from "../URLConfig";
import Modal from "react-bootstrap/Modal";
import CryptoJS from "crypto-js";
import { New, MyWorkSpace_ByStatus } from "../Constants";
import Pagination from "react-js-pagination";
import UnTaggedModal from "../../DocumentDepo/KnowledgeRelated/UnTaggedModal";
import { identifyFileFormat } from "../../../utils/FileType";
import _ from "lodash";
import { toast } from "react-toastify";

class DocumentList extends React.Component {
  constructor() {
    super();
    this.state = {
      OppID: "",
      docList: [],
      SelectedDoc: null,
      type: "",
      SelectedDocMetaData: null,
      DownLoadLink: "",
      showMetaInfoPopUp: false,
      categoryData: [],
      filterPageChange: false,
      AssiggnTO: false,
      SearchText: "",
      SelectedCategory: New,
      LoadData: this.LoadData.bind(this),
      AssignMail: "",
      ValidMail: false,
      activePage: 1,
      itemsCountPerPage: 10,
      totalItemsCount: 0,
      showDocumentPreview: false,
      SelectedIds: [],
      AllSelected: false,
      ShowAdditionalInfo: false,
      AdditionalInfo: null,
      Comments: "",
      geoRegionData: {},
      showFilteredDocuments: false,
      documentCategory: [],
      dataSource: [],
      selectedColumn: "",
      approver: [],
      ksoOWner: [],
      technicalReviewer: [],
      qualityAuditor: [],
      selectedField: "",
      inactiveBy: [],
      archivedBy: [],
      showAscendingData: false,
      filter: "",
      MasterDataOther: {},
      SelectedStatusToMove: "0",
      showTechReviewers: false,
      KSOFeedBack: "",
      TechnicalReviewDone: false,
      QADone: false,
      Selected_Qa_Reviewer: "",
    };
    this.btnContinue = React.createRef();
  }
  showDocument = (document) => {
    var DownLoadLink =
      document.document_Type === "SharePoint"
        ? document.documentPath
        : "https://delta.app.hpecorp.net:444/" + document.documentPath;
    this.setState({ SelectedDoc: document, DownLoadLink });
    const URL =
      URLConfig.GetMetaDataByDocID(document.id) +
      document.document_Type +
      "/" +
      Cookies.get("empnumber");
    axios.get(URL).then((res) => {
      if (res.data) {
        try {
          this.setState({ SelectedDocMetaData: res.data });
          this.setState({ showMetaInfoPopUp: true });
        } catch (err) {
          //alert(err);
        }
      }
    });
  };
  componentDidMount() {
    const category = this.props.selectedCategory;
    this.LoadData(category.value);
    if (this.props.MasterData.geoRegions) {
      this.setState({ geoRegions: this.props.MasterData.geoRegions }, () =>
        this.modifyGeoRegionData()
      );
    }
    this.UpdateMasterTableDataOthers();
  }

  UpdateMasterTableDataOthers() {
    debugger;
    const otherURL = URLConfig.GetAllOtherMasterTablesDataURL();
    axios.get(otherURL).then((res) => {
      if (res.data) {
        console.log(res.data);
        this.setState({
          MasterDataOther: res.data,
        });
      }
    });
  }

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
  ChangeDocumentStatus = (event) => {
    const statusObj = MyWorkSpace_ByStatus.find(
      (x) => x.value == event.target.value
    );
    if (statusObj.name == "PendingReview") {
      var showTechReviewers = true;
      this.setState({
        SelectedStatusToMove: statusObj.value,
        ShowStatusMovePopUp: true,
        showTechReviewers,
      });
    } else if (statusObj.name === "QA") {
      var showQAReviewers = true;
      this.setState({
        SelectedStatusToMove: statusObj.value,
        ShowStatusMovePopUp: true,
        showQAReviewers,
      });
    } else if (statusObj.name === "PendingApproval") {
      const ApprovalInfo = this.state.SelectedDoc.approvals;
      let primaryOwnerMailsRaw = "";
      let secondaryOwnerMailsRaw = "";
      let lastLevelApproverData = [];
      if (ApprovalInfo && ApprovalInfo.length) {
        primaryOwnerMailsRaw =
          ApprovalInfo.filter((x) => x.isPrimaryOwner === true).length > 0
            ? ApprovalInfo.filter((x) => x.isPrimaryOwner === true)[0]
                ?.approverUid
            : "";
        secondaryOwnerMailsRaw =
          ApprovalInfo.filter((x) => x.isSecondryOwner === true).length > 0
            ? ApprovalInfo.filter((x) => x.isSecondryOwner === true)[0]
                ?.approverUid
            : "";
        let additionalApproval = ApprovalInfo.filter(
          (x) => x.isAdditionalApproval === true
        );
        if (additionalApproval) {
          additionalApproval.forEach((element) => {
            lastLevelApproverData.push({
              approverContact: element.approverUid,
              approverRole: element.additionalApprovalRole,
            });
          });
        }
      }
      this.setState(
        {
          SelectedStatusToMove: statusObj.value,
          ShowStatusMovePopUp: true,
          showApprovalRequired: true,
          primaryOwnerMailsRaw,
          secondaryOwnerMailsRaw,
          lastLevelApproverData,
        },
        () => {
          if (primaryOwnerMailsRaw === "") {
            this.btnContinue.current.setAttribute("disabled", "disabled");
          }
        }
      );
    } else {
      this.setState({
        ShowStatusMovePopUp: true,
        SelectedStatusToMove: statusObj.value,
      });
    }
  };
  handleKSOFeedBack = (e) => {
    this.setState({ KSOFeedBack: e.target.value });
  };
  handleChange_QA_Reviwer = (event) => {
    this.setState({ Selected_Qa_Reviewer: event.target.value });
  };
  handleChange_Tech_Reviwer = (event) => {
    this.setState({ Tech_Reviwer: event.target.value });
  };
  FireAPIForChangeDocumentStatus = () => {
    this.btnContinue.current.setAttribute("disabled", "disabled");
    const v = this.state;
    const empId = Cookies.get("empnumber");
    const Name = Cookies.get("name");
    const CallbackObj = this.props;
    const statusObj = MyWorkSpace_ByStatus.find(
      (x) => x.value == this.state.SelectedStatusToMove
    );
    console.log(statusObj);
    var reviewerEmpNo = "";
    var reviewerMail = "";
    var ksoFeedBack = "";
    var plannedShelfLife = "";
    if (statusObj.name == "PendingReview") {
      reviewerEmpNo = this.state.Tech_Reviwer;
      reviewerMail = this.props.MasterData.tect_reviwers.find(
        (x) => x.empNo == reviewerEmpNo
      ).email;
    } else if (statusObj.name == "QA") {
      reviewerEmpNo = this.state.Selected_Qa_Reviewer;
      reviewerMail = this.props.MasterData.qa_reviewers.find(
        (x) => x.empNo == reviewerEmpNo
      ).email;
    } else if (statusObj.name == "OnHold") {
      ksoFeedBack = this.state.KSOFeedBack;
      console.log(ksoFeedBack);
    } else if (statusObj.name == "UpforArchival") {
      plannedShelfLife = this.state.plannedShelfLife;
    } else if (statusObj.name == "PendingApproval") {
      if (
        this.state.ValidPrimaryMail == true &&
        this.state.ValidSecondaryMail == true &&
        this.state.ValidApproverMail == true
      ) {
      } else {
        this.btnContinue.current.removeAttribute("disabled");
        return;
      }
    }
    let data = {
      status: statusObj.value,
      // documentID: this.state.SelectedDoc.id,
      documentID: this.state.SelectedIds[0],
      requestedBy_EmpID: empId,
      previousStatus: this.state.SelectedCategory.value,
      requestedBy_Name: Name,
      comments: this.state.Comments,
      reviewerMail: reviewerMail,
      reviewerEmpNo: reviewerEmpNo,
      ksoFeedBack: ksoFeedBack,
      plannedShelfLife: plannedShelfLife,
      primaryOwnerMailsRaw: this.state.primaryOwnerMailsRaw,
      secondaryOwnerMailsRaw: this.state.secondaryOwnerMailsRaw,
      lastLevelApproverData: this.state.lastLevelApproverData,
      qaReviewDone: this.state.QADone,
      technicalReviewDone: this.state.TechnicalReviewDone,
    };
    post(URLConfig.ChangeStatus_API(), data).then((res) => {
      if (res.data) {
        console.log(res.data)
        this.btnContinue.current.removeAttribute("disabled");
        this.setState(
          {
            showTechReviewers: false,
            showQAReviewers: false,
            showApprovalRequired: false,
            Selected_Qa_Reviewer: "0",
            Tech_Reviwer: "0",
            plannedShelfLife: "",
          },
          () => {
            CallbackObj.refresh();
          }
        );
      }
    });
  };

  handleChange = (event) => {
    var documentCategory_ = "",
      dataSource_ = "",
      approver_ = "",
      ksoOwner_ = "",
      technicalReviewer_ = "",
      qualityAuditor_ = "",
      inactiveBy_ = "",
      archivedBy_ = "",
      title_ = "";

    if (this.state.selectedColumn == "Document Category") {
      documentCategory_ = event.target.value;
    } else if (this.state.selectedColumn == "Data Source") {
      dataSource_ = event.target.value;
    } else if (this.state.selectedColumn == "Approver") {
      approver_ = event.target.value;
    } else if (this.state.selectedColumn == "KSO Owner") {
      ksoOwner_ = event.target.value;
    } else if (this.state.selectedColumn == "Technical Reviewer") {
      technicalReviewer_ = event.target.value;
    } else if (this.state.selectedColumn == "Quality Auditor") {
      qualityAuditor_ = event.target.value;
    } else if (this.state.selectedColumn == "Inactive By") {
      inactiveBy_ = event.target.value;
    } else if (this.state.selectedColumn == "Archived By") {
      archivedBy_ = event.target.value;
    }
    var selectedCategory =
      "<SearchCriteria>" +
      "<documentCategory>" +
      documentCategory_ +
      "</documentCategory>" +
      "<documentDataSource>" +
      dataSource_ +
      "</documentDataSource>" +
      "<approver>" +
      approver_ +
      "</approver>" +
      "<ksoOwner>" +
      ksoOwner_ +
      "</ksoOwner>" +
      "<technicalReviwer>" +
      technicalReviewer_ +
      "</technicalReviwer>" +
      "<qualityAuditor>" +
      qualityAuditor_ +
      "</qualityAuditor>" +
      "<Title>" +
      title_ +
      "</Title>" +
      "<inactiveBy>" +
      inactiveBy_ +
      "</inactiveBy>" +
      "<archievedBy>" +
      archivedBy_ +
      "</archievedBy>" +
      "</SearchCriteria>";
    this.setState({ filter: selectedCategory, filterPageChange: true });
    this.LoadDatas(selectedCategory);
    toast.info("Filter applied Successfully", {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };
  Filterdata = () => {
    if (this.state.showFilteredDocuments === true) {
      this.setState({ showFilteredDocuments: false });
    } else {
      this.setState({ showFilteredDocuments: true });
    }
  };
  Sortdata = (col) => {
    if (this.state.showAscendingData === true) {
      this.setState({ showAscendingData: false });
      var descendingOrder =
        "<SearchCriteria>" +
        "<SortCol>" +
        col +
        "</SortCol>" +
        "<SortDir>" +
        "DESC" +
        "</SortDir>" +
        "</SearchCriteria>";
      var filterData =
        "<SortCol>" + col + "</SortCol>" + "<SortDir>" + "DESC" + "</SortDir>";
      this.SortData(descendingOrder);
      this.setState({ filter: filterData, filterPageChange: false });
    } else {
      this.setState({ showAscendingData: true });
      var ascendingOrder =
        "<SearchCriteria>" +
        "<SortCol>" +
        col +
        "</SortCol>" +
        "<SortDir>" +
        "ASC" +
        "</SortDir>" +
        "</SearchCriteria>";
      var filterData =
        "<SortCol>" + col + "</SortCol>" + "<SortDir>" + "ASC" + "</SortDir>";
      this.SortData(ascendingOrder);
      this.setState({ filter: filterData, filterPageChange: false });
    }
  };
  SortData = (datas) => {
    axios
      .get(
        URLConfig.GetQueuedDocuments() +
          "?Status=" +
          this.state.SelectedCategory.value +
          "&Page=1&Term=" +
          datas
      )
      .then((res) => {
        const DefaultDocument =
          res.data.items.length > 0 ? res.data.items[0] : null;
        this.setState({
          docList: res.data.items.length > 0 ? res.data.items : [],
          SelectedDoc: DefaultDocument,
          totalItemsCount: res.data.total,
          activePage: 1,
        });
      });
  };
  LoadDatas = (datas) => {
    axios
      .get(
        URLConfig.GetQueuedDocuments() +
          "?Status=" +
          this.state.SelectedCategory.value +
          "&Page=1&Term=" +
          datas
      )
      .then((res) => {
        const DefaultDocument =
          res.data.items.length > 0 ? res.data.items[0] : null;
        this.setState({
          docList: res.data.items.length > 0 ? res.data.items : [],
          documentCategory:
            res.data.documentCategory.length > 0
              ? res.data.documentCategory
              : [],
          dataSource: res.data.dataSource.length > 0 ? res.data.dataSource : [],
          approver: res.data.approver.length > 0 ? res.data.approver : [],
          ksoOWner: res.data.ksoOwner.length > 0 ? res.data.ksoOwner : [],
          technicalReviewer:
            res.data.technicalReviwer.length > 0
              ? res.data.technicalReviwer
              : [],
          qualityAuditor:
            res.data.qualityAuditor.length > 0 ? res.data.qualityAuditor : [],
          inactiveBy: res.data.inactiveBy.length > 0 ? res.data.inactiveBy : [],
          archivedBy: res.data.archivedBy.length > 0 ? res.data.archivedBy : [],
          SelectedDoc: DefaultDocument,
          totalItemsCount: res.data.filterCount,
          activePage: 1,
          categoryData: datas,
        });
      });
  };
  LoadData = (status) => {
    axios
      .get(
        URLConfig.GetQueuedDocuments() +
          "?Status=" +
          status +
          "&Page=1&Term=" +
          "<SearchCriteria>" +
          "</SearchCriteria>" +
          this.state.SearchText
      )
      .then((res) => {
        const DefaultDocument =
          res.data.items.length > 0 ? res.data.items[0] : null;
        this.setState({
          docList: res.data.items.length > 0 ? res.data.items : [],
          documentCategory:
            res.data.documentCategory.length > 0
              ? res.data.documentCategory
              : [],
          dataSource: res.data.dataSource.length > 0 ? res.data.dataSource : [],
          approver: res.data.approver.length > 0 ? res.data.approver : [],
          ksoOWner: res.data.ksoOwner.length > 0 ? res.data.ksoOwner : [],
          technicalReviewer:
            res.data.technicalReviwer.length > 0
              ? res.data.technicalReviwer
              : [],
          qualityAuditor:
            res.data.qualityAuditor.length > 0 ? res.data.qualityAuditor : [],
          inactiveBy: res.data.inactiveBy.length > 0 ? res.data.inactiveBy : [],
          archivedBy: res.data.archivedBy.length > 0 ? res.data.archivedBy : [],
          SelectedDoc: DefaultDocument,
          totalItemsCount: res.data.total,
          activePage: 1,
          filterPageChange: false,
        });
        //if(DefaultDocument !== null)
        //this.showDocument(DefaultDocument);
      });
  };
  doSearch = (e) => {
    if (e.keyCode === 13) {
      // Enter key
      var searchText = this.state.SearchText;
      var SearchTitle =
        "<SearchCriteria>" +
        "<Title>" +
        searchText +
        "</Title>" +
        "</SearchCriteria>";
      this.LoadDatas(SearchTitle);
    }
  };
  handlePageChange_ = (activePage) => {
    this.setState({ activePage }, () => {
      axios
        .get(
          URLConfig.GetQueuedDocuments() +
            "?Status=" +
            this.state.SelectedCategory.value +
            "&Page=" +
            this.state.activePage +
            "&Term=" +
            this.state.categoryData +
            this.state.SearchText
        )
        .then((res) => {
          const DefaultDocument =
            res.data.items.length > 0 ? res.data.items[0] : null;
          this.setState({
            docList: res.data.items.length > 0 ? res.data.items : [],
            SelectedDoc: DefaultDocument,
            totalItemsCount: res.data.filterCount,
          });
        });
    });
  };
  handlePageChange = (activePage) => {
    if (this.state.filterPageChange == true) {
      this.handlePageChange_(activePage);
    } else {
      this.setState({ activePage }, () => {
        // this.LoadData(this.state.SelectedCategory.value);
        axios
          .get(
            URLConfig.GetQueuedDocuments() +
              "?Status=" +
              this.state.SelectedCategory.value +
              "&Page=" +
              this.state.activePage +
              "&Term=" +
              "<SearchCriteria>" +
              this.state.filter +
              "</SearchCriteria>" +
              this.state.SearchText
          )
          .then((res) => {
            const DefaultDocument =
              res.data.items.length > 0 ? res.data.items[0] : null;
            this.setState({
              docList: res.data.items.length > 0 ? res.data.items : [],
              SelectedDoc: DefaultDocument,
              totalItemsCount: res.data.total,
            });
          });
      });
    }
  };
  static getDerivedStateFromProps(props, state) {
    if (props.selectedCategory.label !== state.SelectedCategory.label) {
      state.LoadData(props.selectedCategory.value);
      return {
        SelectedCategory: props.selectedCategory,
        SelectedIds: [],
        docList: [],
        activePage: 1,
        SearchText: "",
      };
    }
    return null;
  }

  formatURL = (url) => {
    var filepath =
      "E:\\anpsapi\\" + url.replace(/ /g, "%20").split("/").join("\\");

    filepath = CryptoJS.enc.Utf8.parse(filepath);
    filepath = CryptoJS.enc.Base64.stringify(filepath);
    return "https://delta.app.hpecorp.net:8543/viewer.aspx?file=" + filepath;
  };
  formatSharePointURL = (url) => {
    var filepath =
      "F:\\AnPS\\Sharepointfiles\\" +
      url
        .replace("https://hpedelta.com:8082/", "")
        .replace(/ /g, "%20")
        .split("/")
        .join("\\");
    filepath = CryptoJS.enc.Utf8.parse(filepath);
    filepath = CryptoJS.enc.Base64.stringify(filepath);
    return "https://hpedelta.com/Viewer.aspx?file=" + filepath;
  };

  showMetaInfoPopUp = () => {
    //alert(this.state.SelectedDoc.id);
    this.setState({ showMetaInfoPopUp: true });
  };
  formatDate = (date) => {
    if (date === "" || date === undefined || date === null) {
      return ""; //new Date(new Date().getFullYear()+ 1, new Date().getMonth(), new Date().getDate())"";
    }
    var dt = date.split("T");
    var year = dt[0].split("-")[0];
    var month = dt[0].split("-")[1];
    var day = dt[0].split("-")[2];
    var min = dt[1].split(":")[0];
    var sec = dt[1].split(":")[1];

    return month + "/" + day + "/" + year + " " + min + ":" + sec;
  };

  SearchBoxChange = (e) => {
    this.setState({ SearchText: e.target.value });
  };
  clearSearch = () => {
    this.setState({ SearchText: "" }, () => {
      this.LoadData(this.state.SelectedCategory.value);
    });
    //this.props.clearSearch();
  };
  handleChange_Mails = (event) => {
    var ValidMail = this.validateEmail(event.target.value);
    this.setState({ AssignMail: event.target.value, ValidMail });
  };
  handleBlur_Mails = (event) => {
    var ValidMail = this.validateEmail(event.target.value);
    this.setState({ ValidMail });
  };

  validateEmail = (email) => {
    var re =
      /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@hpe\.com$/;

    if (!re.test(email.trim())) {
      return false;
    }
    return true;
  };
  AssignDocument = (mail) => {
    this.refs.btnAssign.setAttribute("disabled", "disabled");
    if (
      this.state.SelectedCategory.name === "New" ||
      this.state.SelectedCategory.label === "Approval Recieved" ||
      this.state.SelectedCategory.label === "Pending Approval" ||
      this.state.SelectedCategory.name == "SharePoint"
    ) {
      const empId = mail === "" ? Cookies.get("mail") : mail;
      const Name = Cookies.get("name");
      const DocumentDetails = this.state.SelectedDoc;
      const data = {
        id: this.state.SelectedIds,
        assignedTo: empId,
        assignedToName: Name,
        comments: this.state.Comments,
        assignedBy: Cookies.get("mail"),
        assignedByName: Cookies.get("name"),
      };
      const url = URLConfig.AssignDocument();
      post(url, data).then((res) => {
        if (res.data) {
          //this.LoadData(this.state.SelectedCategory);
          this.props.refresh();
        }
      });
    } else {
      const statusObj = MyWorkSpace_ByStatus.find(
        (x) => x.value == this.state.ModalStatus
      );
      const empId = Cookies.get("empnumber");
      const Name = Cookies.get("name");
      const CallbackObj = this.props;
      let data = {
        status: statusObj.value,
        documentID: this.state.SelectedDoc.id,
        requestedBy_EmpID: empId,
        previousStatus: this.state.SelectedCategory.value,
        requestedBy_Name: Name,
        ReviewerMail: mail,
      };
      post(URLConfig.ChangeStatus_API(), data).then((res) => {
        if (res.data) {
          //this.LoadData(this.state.SelectedCategory);
          CallbackObj.refresh();
        }
      });
    }
  };
  SaveData = (docData) => {
    debugger;
    this.UpdateMasterTableDataOthersNew(docData);
    const DocumentDetails = this.state.SelectedDoc;
    if (DocumentDetails.source !== "Sharepoint" && docData.docId !== null) {
      const url = URLConfig.EditDocumentDetails();
      post(url, docData).then((res) => {
        if (res.data) {
          this.setState({ showMetaInfoPopUp: false });
          this.UpdateMasterTableDataOthers();
        }
      });
    } else {
      this.setState({ showMetaInfoPopUp: false });
    }
    // this.UpdateMasterTableDataOthersNew(docData);
  };
  handleChange_QAComplete = (event) => {
    const QADone = event.target.value === "true" ? true : false;
    this.setState({ QADone });
  };
  handleChange_TechnicalComplete = (event) => {
    const TechnicalReviewDone = event.target.value === "true" ? true : false;
    this.setState({ TechnicalReviewDone });
  };
  UpdateMasterTableDataOthersNew(data) {
    debugger;
    debugger;
    let MasterDataOther = this.state.MasterDataOther;
    MasterDataOther.competitorsOthers = [];
    MasterDataOther.researchVendorsOthers = [];
    MasterDataOther.partnersOthers = [];
    if (data.competitorsOthers != undefined && data.competitorsOthers != "") {
      var competitorOthers = data.competitorsOthers.split(",");
      for (var i = 0; i < competitorOthers.length; i++)
        MasterDataOther.competitorsOthers.push({
          name: competitorOthers[i],
          createdBy: data.name,
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
          createdBy: data.name,
        });
    }
    if (data.partnersOthers != undefined && data.partnersOthers != "") {
      var partnerOthers = data.partnersOthers.split(",");
      for (var i = 0; i < partnerOthers.length; i++)
        MasterDataOther.partnersOthers.push({
          name: partnerOthers[i],
          createdBy: data.name,
        });
    }
    this.setState({ MasterDataOther: MasterDataOther });
  }
  toggleSelectAllCheckbox = () => {
    let AllSelected = !this.state.AllSelected;
    if (AllSelected) var SelectedIds = this.state.docList.map((x) => x.id);
    else SelectedIds = [];
    this.setState({ AllSelected: !this.state.AllSelected, SelectedIds});
  };
  getApproverComment = (value) => {
    var length = value.approvals
      ? value.approvals[0]
        ? value.approvals.length
        : 0
      : "";
    var previousStatus_ = this.getStatusByValue(value.previous_Status);
    var i;
    if (previousStatus_ == "Response Received" || previousStatus_ == "Assigned") {
      return value.response_From_KSO;
    } else {
      for (i = length - 1; i >= 0; ) {
        if (value.approvals[i].approvedComments == null) {
          i--;
        } else return value.approvals[i].approvedComments;
      }
    }
  };
  toggleSelectDocCheckbox = (checked, id) => {
    let SelectedIds = this.state.SelectedIds;
    if (checked) {
      SelectedIds.push(id);
      if (SelectedIds.length === this.state.itemsCountPerPage) {
        this.setState({ AllSelected: true, SelectedIds});
      } else {
        this.setState({ SelectedIds});
      }
    } else {
      //Remove it from SelectedIds
      const index = SelectedIds.indexOf(id);
      if (index > -1) {
        SelectedIds.splice(index, 1);
        if (this.state.AllSelected) {
          this.setState({ SelectedIds, AllSelected: false });
        } else {
          this.setState({ SelectedIds });
        }
      }
    }
  };
  handleBtnDisable = () => {
    if (this.state.showTechReviewers) {
      return !this.state.Tech_Reviwer;
    }

    if (this.state.showQAReviewers) {
      return !this.state.Selected_Qa_Reviewer;
    }

    return false;
  };

  showAdditionalInfo = (value) => {
    this.setState({ ShowAdditionalInfo: true, AdditionalInfo: value });
  };
  renderAdditionalData = () => {
    let info = this.state.AdditionalInfo;

    return (
      <Fragment>
        <div className="row mb-2">
          <div className="col-4">Title</div>
          <div className="col">{info.title}</div>
        </div>
        <div className="row mb-2">
          <div className="col-4">Previous Status</div>
          <div className="col">{info.previous_Status}</div>
        </div>
        <div className="row mb-2">
          <div className="col-4">SubmittedBy</div>
          <div className="col">{info.submittedBy}</div>
        </div>
        <div className="row mb-2">
          <div className="col-4">Submitted Date(UTC)</div>
          <div className="col">{this.formatDate(info.submittedDate)}</div>
        </div>
        <div className="row mb-2">
          <div className="col-4">Document Category</div>
          <div className="col">{info.document_Category}</div>
        </div>
        <div className="row mb-2">
          <div className="col-4">Document Type</div>
          <div className="col">
            {info.document_Type == "CustomerOppertunity"
              ? "Customer Opportunity"
              : info.document_Type}
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-4">Disclosure</div>
          <div className="col">{info.disclosure}</div>
        </div>
        <div className="row mb-2">
          <div className="col-4">Opportunity ID</div>
          <div className="col">{info.oppId}</div>
        </div>
        <div className="row mb-2">
          <div className="col-4">Approval Required</div>
          <div className="col">
            {info.approvalRequired == true ? "Yes" : "No"}
          </div>
        </div>
        {info.approvalRequired == true && (
          <Fragment>
            <div className="row mb-2">
              <table className="col-10 m-2">
                <tbody>
                  <tr>
                    <th>Approver</th>
                    <th>Approved</th>
                    <th className="col-4">Email Request Send Date(UTC)</th>
                  </tr>
                  {info.approvals.map((value, index) => (
                    <tr>
                      <td>
                        {value.approverUid} (
                        {value.isPrimaryOwner == true
                          ? "primary"
                          : value.isSecondryOwner == true
                          ? "secondary"
                          : "additional"}
                        )
                      </td>
                      <td>{value.approvalRecieved == true ? "Yes" : "No"}</td>
                      <td className="col-4">
                        {this.formatDate(value.emailRequestDt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Fragment>
        )}
        <div className="row mb-2">
          <div className="col-4">Country</div>
          <div className="col">{info.country}</div>
        </div>
        <div className="row mb-2">
          <div className="col-4">Data Source</div>
          <div className="col">{info.data_Source}</div>
        </div>
        <div className="row mb-2">
          <div className="col-4">KSO Owner</div>
          <div className="col">{info.ksoOwner}</div>
        </div>
        <div className="row mb-2">
          <div className="col-4">Last Modified By</div>
          <div className="col">{info.lastModifiedBy}</div>
        </div>
        <div className="row mb-2">
          <div className="col-4">Last Modified Date(UTC)</div>
          <div className="col">{this.formatDate(info.lastModifiedDt)}</div>
        </div>
        <div className="row mb-2">
          <div className="col-4">Planned ShelfLife(UTC)</div>
          <div className="col">{this.formatDate(info.plannedShelfLife)}</div>
        </div>
        <div className="row mb-2">
          <div className="col-4">QualityAuditor</div>
          <div className="col">{info.qualityAuditorInternal}</div>
        </div>
        <div className="row mb-2">
          <div className="col-4">Technical Reviewer</div>
          <div className="col">{info.technicalReviewer}</div>
        </div>
        <div className="row mb-2">
          <div className="col-4">HPE GreenLake</div>
          <div className="col">{info.hpeGreenLake == true ? "Yes" : "No"}</div>
        </div>
      </Fragment>
    );
  };
  renderDataHeadersByStatus = () => {
    return (
      <Fragment>
        {(this.state.SelectedCategory.name === "New" ||
          this.state.SelectedCategory.name === "SharePoint") && (
          <Fragment>
            <td className="border-none tab-background" width="15%">
              <strong>Submitted Date(UTC)</strong>
              <button
                className="btn btn-light btn-filter"
                onClick={() => {
                  this.Sortdata("SubmittedDate");
                }}
              >
                <i class="fas fa-sort fa-xs"></i>
              </button>
            </td>
            <td className="border-none tab-background" width="16%">
              <strong>Document Category</strong>
              <button
                className="filterbtn btn btn-light filterbtnsize p-2 btn-filter"
                onClick={() => {
                  this.setState({ selectedColumn: "Document Category" });
                  this.Filterdata();
                }}
              >
                <i class="fas fa-filter fa-xs"></i>
              </button>
              {this.state.selectedColumn == "Document Category" &&
                this.state.showFilteredDocuments && (
                  <select
                    className="filterSelect"
                    onChange={this.handleChange}
                    onBlur={() => {
                      this.setState({ showFilteredDocuments: false });
                    }}
                  >
                    <option value="0" disabled selected>
                      Select
                    </option>
                    {this.state.documentCategory.map((list) => (
                      <option value={list}>{list}</option>
                    ))}
                  </select>
                )}
            </td>
            <td className="border-none tab-background" width="15%">
              <strong>Data Source</strong>
              <button
                className="btn btn-light filterbtnsize p-2 btn-filter"
                onClick={() => {
                  this.setState({ selectedColumn: "Data Source" });
                  this.Filterdata();
                }}
              >
                <i class="fas fa-filter fa-xs"></i>
              </button>
              {this.state.selectedColumn == "Data Source" &&
                this.state.showFilteredDocuments && (
                  <select
                    className="filterSelect"
                    onChange={this.handleChange}
                    onBlur={() => {
                      this.setState({ showFilteredDocuments: false });
                    }}
                  >
                    <option value="0" disabled selected>
                      Select
                    </option>
                    {this.state.dataSource.map((list) => (
                      <option value={list}>{list}</option>
                    ))}
                  </select>
                )}
            </td>
            <td className="border-none tab-background" width="12%">
              <strong>Approval Required</strong>
            </td>
            <td className="border-none tab-background" width="12%">
              <strong> </strong>
            </td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "Assigned" && (
          <Fragment>
            <td className="border-none tab-background " width="16%">
              <strong>Submitted Date(UTC)</strong>
              <button
                className="btn btn-light btn-filter"
                onClick={() => {
                  this.Sortdata("SubmittedDate");
                }}
              >
                <i class="fas fa-sort fa-xs"></i>
              </button>
            </td>
            <td className="border-none tab-background " width="16%">
              <strong>KSO Owner</strong>
              <button
                className="btn btn-light filterbtnsize p-2 btn-filter"
                onClick={() => {
                  this.setState({ selectedColumn: "KSO Owner" });
                  this.Filterdata();
                }}
              >
                <i class="fas fa-filter fa-xs"></i>
              </button>
              {this.state.selectedColumn == "KSO Owner" &&
                this.state.showFilteredDocuments && (
                  <select
                    className="filterSelect"
                    onChange={this.handleChange}
                    onBlur={() => {
                      this.setState({ showFilteredDocuments: false });
                    }}
                  >
                    <option value="0" disabled selected>
                      Select
                    </option>
                    {this.state.ksoOWner.map((list) => (
                      <option value={list}>{list}</option>
                    ))}
                  </select>
                )}
            </td>
            <td className="border-none tab-background " width="16%">
              <strong>Document Category</strong>
              <button
                className="btn btn-light filterbtnsize p-2 btn-filter"
                onClick={() => {
                  this.setState({ selectedColumn: "Document Category" });
                  this.Filterdata();
                }}
              >
                <i class="fas fa-filter fa-xs"></i>
              </button>
              {this.state.selectedColumn == "Document Category" &&
                this.state.showFilteredDocuments && (
                  <select
                    className="filterSelect"
                    onChange={this.handleChange}
                    onBlur={() => {
                      this.setState({ showFilteredDocuments: false });
                    }}
                  >
                    <option value="0" disabled selected>
                      Select
                    </option>
                    {this.state.documentCategory.map((list) => (
                      <option value={list}>{list}</option>
                    ))}
                  </select>
                )}
            </td>
            <td className="border-none tab-background " width="12%">
              <strong>Approval Required</strong>
            </td>
            <td className="border-none tab-background " width="12%">
              <strong> </strong>
            </td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "InProgress" && (
          <Fragment>
            <td className="border-none tab-background " width="16%">
              <strong>KSO Owner</strong>
              <button
                className="btn btn-light filterbtnsize p-2 btn-filter"
                onClick={() => {
                  this.setState({ selectedColumn: "KSO Owner" });
                  this.Filterdata();
                }}
              >
                <i class="fas fa-filter fa-xs"></i>
              </button>
              {this.state.selectedColumn == "KSO Owner" &&
                this.state.showFilteredDocuments && (
                  <select
                    className="filterSelect"
                    onChange={this.handleChange}
                    onBlur={() => {
                      this.setState({ showFilteredDocuments: false });
                    }}
                  >
                    <option value="0" disabled selected>
                      Select
                    </option>
                    {this.state.ksoOWner.map((list) => (
                      <option value={list}>{list}</option>
                    ))}
                  </select>
                )}
            </td>
            <td className="border-none tab-background " width="15%">
              <strong>Last Modified By</strong>
            </td>
            <td className="border-none tab-background " width="17%">
              <strong>Last Modified Date(UTC)</strong>
              <button
                className="btn btn-light btn-filter"
                onClick={() => {
                  this.Sortdata("LastModifiedDate");
                }}
              >
                <i class="fas fa-sort fa-xs"></i>
              </button>
            </td>
            <td className="border-none tab-background " width="12%">
              <strong>Approval Required</strong>
            </td>
            <td className="border-none tab-background " width="12%">
              <strong> </strong>
            </td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "PendingReview" && (
          <Fragment>
            <td className="border-none tab-background " width="16%">
              <strong>Technical Reviewer</strong>
              <button
                className="btn btn-light filterbtnsize p-2 btn-filter"
                onClick={() => {
                  this.setState({ selectedColumn: "Technical Reviewer" });
                  this.Filterdata();
                }}
              >
                <i class="fas fa-filter fa-xs"></i>
              </button>
              {this.state.selectedColumn == "Technical Reviewer" &&
                this.state.showFilteredDocuments && (
                  <select
                    className="filterSelect"
                    onChange={this.handleChange}
                    onBlur={() => {
                      this.setState({ showFilteredDocuments: false });
                    }}
                  >
                    <option value="0" disabled selected>
                      Select
                    </option>
                    {this.state.technicalReviewer.map((list) => (
                      <option value={list}>{list}</option>
                    ))}
                  </select>
                )}
            </td>
            <td className="border-none tab-background " width="15%">
              <strong>KSO Owner</strong>
              <button
                className="btn btn-light filterbtnsize p-2 btn-filter"
                onClick={() => {
                  this.setState({ selectedColumn: "KSO Owner" });
                  this.Filterdata();
                }}
              >
                <i class="fas fa-filter fa-xs"></i>
              </button>
              {this.state.selectedColumn == "KSO Owner" &&
                this.state.showFilteredDocuments && (
                  <select
                    className="filterSelect"
                    onChange={this.handleChange}
                    onBlur={() => {
                      this.setState({ showFilteredDocuments: false });
                    }}
                  >
                    <option value="0" disabled selected>
                      Select
                    </option>
                    {this.state.ksoOWner.map((list) => (
                      <option value={list}>{list}</option>
                    ))}
                  </select>
                )}
            </td>
            <td className="border-none tab-background " width="17%">
              <strong>Last Modified Date(UTC)</strong>
              <button
                className="btn btn-light btn-filter"
                onClick={() => {
                  this.Sortdata("LastModifiedDate");
                }}
              >
                <i class="fas fa-sort fa-xs"></i>
              </button>
            </td>
            <td className="border-none tab-background " width="12%">
              <strong>Approval Required</strong>
            </td>
            <td className="border-none tab-background " width="12%">
              <strong> </strong>
            </td>
          </Fragment>
        )}
        {(this.state.SelectedCategory.name === "QA" ||
          this.state.SelectedCategory.name === "ReWork") && (
          <Fragment>
            <td className="border-none tab-background " width="16%">
              <strong>Quality Auditor</strong>
              <button
                className="btn btn-light filterbtnsize p-2 btn-filter"
                onClick={() => {
                  this.setState({ selectedColumn: "Quality Auditor" });
                  this.Filterdata();
                }}
              >
                <i class="fas fa-filter fa-xs"></i>
              </button>
              {this.state.selectedColumn == "Quality Auditor" &&
                this.state.showFilteredDocuments && (
                  <select
                    className="filterSelect"
                    onChange={this.handleChange}
                    onBlur={() => {
                      this.setState({ showFilteredDocuments: false });
                    }}
                  >
                    <option value="0" disabled selected>
                      Select
                    </option>
                    {this.state.qualityAuditor.map((list) => (
                      <option value={list}>{list}</option>
                    ))}
                  </select>
                )}
            </td>
            <td className="border-none tab-background " width="15%">
              <strong>KSO Owner</strong>
              <button
                className="btn btn-light filterbtnsize p-2 btn-filter"
                onClick={() => {
                  this.setState({ selectedColumn: "KSO Owner" });
                  this.Filterdata();
                }}
              >
                <i class="fas fa-filter fa-xs"></i>
              </button>
              {this.state.selectedColumn == "KSO Owner" &&
                this.state.showFilteredDocuments && (
                  <select
                    className="filterSelect"
                    onChange={this.handleChange}
                    onBlur={() => {
                      this.setState({ showFilteredDocuments: false });
                    }}
                  >
                    <option value="0" disabled selected>
                      Select
                    </option>
                    {this.state.ksoOWner.map((list) => (
                      <option value={list}>{list}</option>
                    ))}
                  </select>
                )}
            </td>
            <td className="border-none tab-background " width="17%">
              <strong>Last Modified Date(UTC)</strong>
              <button
                className="btn btn-light btn-filter"
                onClick={() => {
                  this.Sortdata("LastModifiedDate");
                }}
              >
                <i class="fas fa-sort fa-xs"></i>
              </button>
            </td>
            <td className="border-none tab-background " width="12%">
              <strong>Approval Required</strong>
            </td>
            <td className="border-none tab-background " width="12%">
              <strong> </strong>
            </td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "ResponseRecieved" && (
          <Fragment>
            <td className="border-none tab-background " width="20%">
              <strong>KSO Owner</strong>
              <button
                className="btn btn-light filterbtnsize p-2 btn-filter"
                onClick={() => {
                  this.setState({ selectedColumn: "KSO Owner" });
                  this.Filterdata();
                }}
              >
                <i class="fas fa-filter fa-xs"></i>
              </button>
              {this.state.selectedColumn == "KSO Owner" &&
                this.state.showFilteredDocuments && (
                  <select
                    className="filterSelect"
                    onChange={this.handleChange}
                    onBlur={() => {
                      this.setState({ showFilteredDocuments: false });
                    }}
                  >
                    <option value="0" disabled selected>
                      Select
                    </option>
                    {this.state.ksoOWner.map((list) => (
                      <option value={list}>{list}</option>
                    ))}
                  </select>
                )}
            </td>
            <td className="border-none tab-background " width="20%">
              <strong>Last Modified Date(UTC)</strong>
              <button
                className="btn btn-light btn-filter"
                onClick={() => {
                  this.Sortdata("LastModifiedDate");
                }}
              >
                <i class="fas fa-sort fa-xs"></i>
              </button>
            </td>
            <td className="border-none tab-background " width="20%">
              <strong>Approval Required</strong>
            </td>
            <td className="border-none tab-background " width="12%">
              <strong> </strong>
            </td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "ApprovalRecieved" && (
          <Fragment>
            <td className="border-none tab-background " width="20%">
              <strong>KSO Owner</strong>
              <button
                className="btn btn-light filterbtnsize p-2 btn-filter"
                onClick={() => {
                  this.setState({ selectedColumn: "KSO Owner" });
                  this.Filterdata();
                }}
              >
                <i class="fas fa-filter fa-xs"></i>
              </button>
              {this.state.selectedColumn == "KSO Owner" &&
                this.state.showFilteredDocuments && (
                  <select
                    className="filterSelect"
                    onChange={this.handleChange}
                    onBlur={() => {
                      this.setState({ showFilteredDocuments: false });
                    }}
                  >
                    <option value="0" disabled selected>
                      Select
                    </option>
                    {this.state.ksoOWner.map((list) => (
                      <option value={list}>{list}</option>
                    ))}
                  </select>
                )}
            </td>
            <td className="border-none tab-background " width="20%">
              <strong>Approver</strong>
              <button
                className="btn btn-light filterbtnsize p-2 btn-filter"
                onClick={() => {
                  this.setState({ selectedColumn: "Approver" });
                  this.Filterdata();
                }}
              >
                <i class="fas fa-filter fa-xs"></i>
              </button>
              {this.state.selectedColumn == "Approver" &&
                this.state.showFilteredDocuments && (
                  <select
                    className="filterSelect"
                    onChange={this.handleChange}
                    onBlur={() => {
                      this.setState({ showFilteredDocuments: false });
                    }}
                  >
                    <option value="0" disabled selected>
                      Select
                    </option>
                    {this.state.approver.map((list) => (
                      <option value={list}>{list}</option>
                    ))}
                  </select>
                )}
            </td>
            <td className="border-none tab-background " width="18%">
              <strong>Last Modified Date(UTC)</strong>
              <button
                className="btn btn-light btn-filter"
                onClick={() => {
                  this.Sortdata("LastModifiedDate");
                }}
              >
                <i class="fas fa-sort fa-xs"></i>
              </button>
            </td>
            <td className="border-none tab-background" width="12%">
              <strong> </strong>
            </td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "Publish" && (
          <Fragment>
            <td className="border-none tab-background " width="20%">
              <strong>Published On</strong>
              <button
                className="btn btn-light btn-filter"
                onClick={() => {
                  this.Sortdata("PublishedOn");
                }}
              >
                <i class="fas fa-sort fa-xs"></i>
              </button>
            </td>
            <td className="border-none tab-background " width="20%">
              <strong>Re-Published On</strong>
              <button
                className="btn btn-light btn-filter"
                onClick={() => {
                  this.Sortdata("RePublishedOn");
                }}
              >
                <i class="fas fa-sort fa-xs"></i>
              </button>
            </td>
            <td className="border-none tab-background " width="20%">
              <strong>Last Modified Date(UTC)</strong>
              <button
                className="btn btn-light btn-filter"
                onClick={() => {
                  this.Sortdata("LastModifiedDate");
                }}
              >
                <i class="fas fa-sort fa-xs"></i>
              </button>
            </td>
            <td className="border-none tab-background " width="20%">
              <strong> </strong>
            </td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "PendingApproval" && (
          <Fragment>
            <td className="border-none tab-background " width="16%">
              <strong>KSO Owner</strong>
              <button
                className="btn btn-light filterbtnsize p-2 btn-filter"
                onClick={() => {
                  this.setState({ selectedColumn: "KSO Owner" });
                  this.Filterdata();
                }}
              >
                <i class="fas fa-filter fa-xs"></i>
              </button>
              {this.state.selectedColumn == "KSO Owner" &&
                this.state.showFilteredDocuments && (
                  <select
                    className="filterSelect"
                    onChange={this.handleChange}
                    onBlur={() => {
                      this.setState({ showFilteredDocuments: false });
                    }}
                  >
                    <option value="0" disabled selected>
                      Select
                    </option>
                    {this.state.ksoOWner.map((list) => (
                      <option value={list}>{list}</option>
                    ))}
                  </select>
                )}
            </td>
            <td className="border-none tab-background " width="16%">
              <strong>Approver</strong>
              <button
                className="btn btn-light filterbtnsize p-2 btn-filter"
                onClick={() => {
                  this.setState({ selectedColumn: "Approver" });
                  this.Filterdata();
                }}
              >
                <i class="fas fa-filter fa-xs"></i>
              </button>
              {this.state.selectedColumn == "Approver" &&
                this.state.showFilteredDocuments && (
                  <select
                    className="filterSelect"
                    onChange={this.handleChange}
                    onBlur={() => {
                      this.setState({ showFilteredDocuments: false });
                    }}
                  >
                    <option value="0" disabled selected>
                      Select
                    </option>
                    {this.state.approver.map((list) => (
                      <option value={list}>{list}</option>
                    ))}
                  </select>
                )}
            </td>
            <td className="border-none tab-background " width="13%">
              <strong>Last Modified Date(UTC)</strong>
              <button
                className="btn btn-light btn-filter"
                onClick={() => {
                  this.Sortdata("LastModifiedDate");
                }}
              >
                <i class="fas fa-sort fa-xs"></i>
              </button>
            </td>
            <td className="border-none tab-background " width="13%">
              Email Request Sent Date(UTC)
            </td>
            <td className="border-none tab-background " width="12%">
              <strong> </strong>
            </td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "OnHold" && (
          <Fragment>
            <td className="border-none tab-background " width="17%">
              <strong>KSO Owner</strong>
              <button
                className="btn btn-light filterbtnsize p-2 btn-filter"
                onClick={() => {
                  this.setState({ selectedColumn: "KSO Owner" });
                  this.Filterdata();
                }}
              >
                <i class="fas fa-filter fa-xs"></i>
              </button>
              {this.state.selectedColumn == "KSO Owner" &&
                this.state.showFilteredDocuments && (
                  <select
                    className="filterSelect"
                    onChange={this.handleChange}
                    onBlur={() => {
                      this.setState({ showFilteredDocuments: false });
                    }}
                  >
                    <option value="0" disabled selected>
                      Select
                    </option>
                    {this.state.ksoOWner.map((list) => (
                      <option value={list}>{list}</option>
                    ))}
                  </select>
                )}
            </td>
            <td className="border-none tab-background " width="26%">
              <strong>Response from KSO/Approver</strong>
            </td>
            <td className="border-none tab-background " width="17%">
              <strong>Last Modified Date(UTC)</strong>
              <button
                className="btn btn-light btn-filter"
                onClick={() => {
                  this.Sortdata("LastModifiedDate");
                }}
              >
                <i class="fas fa-sort fa-xs"></i>
              </button>
            </td>
            <td className="border-none tab-background " width="12%">
              <strong> </strong>
            </td>
          </Fragment>
        )}

        {this.state.SelectedCategory.name === "UnPublished" && (
          <Fragment>
            <td className="border-none tab-background " width="20%">
              <strong>KSO Owner</strong>
              <button
                className="btn btn-light filterbtnsize p-2 btn-filter"
                onClick={() => {
                  this.setState({ selectedColumn: "KSO Owner" });
                  this.Filterdata();
                }}
              >
                <i class="fas fa-filter fa-xs"></i>
              </button>
              {this.state.selectedColumn == "KSO Owner" &&
                this.state.showFilteredDocuments && (
                  <select
                    className="filterSelect"
                    onChange={this.handleChange}
                    onBlur={() => {
                      this.setState({ showFilteredDocuments: false });
                    }}
                  >
                    <option value="0" disabled selected>
                      Select
                    </option>
                    {this.state.ksoOWner.map((list) => (
                      <option value={list}>{list}</option>
                    ))}
                  </select>
                )}
            </td>
            <td className="border-none tab-background " width="20%">
              <strong>User Feedback</strong>
            </td>
            <td className="border-none tab-background " width="20%">
              <strong>Last Modified Date(UTC)</strong>
              <button
                className="btn btn-light btn-filter"
                onClick={() => {
                  this.Sortdata("LastModifiedDate");
                }}
              >
                <i class="fas fa-sort fa-xs"></i>
              </button>
            </td>
            <td className="border-none tab-background " width="12%">
              <strong> </strong>
            </td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "UpforArchival" && (
          <Fragment>
            <td className="border-none tab-background " width="20%">
              <strong>Planned Shelf Life</strong>
            </td>
            <td className="border-none tab-background " width="20%">
              <strong>Email Request Sent Date</strong>
            </td>
            <td className="border-none tab-background " width="20%">
              <strong>Last Modified Date(UTC)</strong>
              <button
                className="btn btn-light btn-filter"
                onClick={() => {
                  this.Sortdata("LastModifiedDate");
                }}
              >
                <i class="fas fa-sort fa-xs"></i>
              </button>
            </td>
            <td className="border-none tab-background " width="12%">
              <strong> </strong>
            </td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "Archived" && (
          <Fragment>
            <td className="border-none tab-background " width="20%">
              <strong>Archived By</strong>
              <button
                className="btn btn-light filterbtnsize p-2 btn-filter"
                onClick={() => {
                  this.setState({ selectedColumn: "Archived By" });
                  this.Filterdata();
                }}
              >
                <i class="fas fa-filter fa-xs"></i>
              </button>
              {this.state.selectedColumn == "Archived By" &&
                this.state.showFilteredDocuments && (
                  <select
                    className="filterSelect"
                    onChange={this.handleChange}
                    onBlur={() => {
                      this.setState({ showFilteredDocuments: false });
                    }}
                  >
                    <option value="0" disabled selected>
                      Select
                    </option>
                    {this.state.archivedBy.map((list) => (
                      <option value={list}>{list}</option>
                    ))}
                  </select>
                )}
            </td>
            <td className="border-none tab-background " width="20%">
              <strong>Archived On</strong>
              <button
                className="btn btn-light btn-filter"
                onClick={() => {
                  this.Sortdata("ArchivedOn");
                }}
              >
                <i class="fas fa-sort fa-xs"></i>
              </button>
            </td>
            <td className="border-none tab-background " width="20%">
              <strong>Last Modified Date(UTC)</strong>
              <button
                className="btn btn-light btn-filter"
                onClick={() => {
                  this.Sortdata("LastModifiedDate");
                }}
              >
                <i class="fas fa-sort fa-xs"></i>
              </button>
            </td>
            <td className="border-none tab-background " width="12%">
              <strong> </strong>
            </td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "InActive" && (
          <Fragment>
            <td className="border-none tab-background " width="20%">
              <strong>Inactive By</strong>
              <button
                className="btn btn-light filterbtnsize p-2 btn-filter"
                onClick={() => {
                  this.setState({ selectedColumn: "Inactive By" });
                  this.Filterdata();
                }}
              >
                <i class="fas fa-filter fa-xs"></i>
              </button>
              {this.state.selectedColumn == "Inactive By" &&
                this.state.showFilteredDocuments && (
                  <select
                    className="filterSelect"
                    onChange={this.handleChange}
                    onBlur={() => {
                      this.setState({ showFilteredDocuments: false });
                    }}
                  >
                    <option value="0" disabled selected>
                      Select
                    </option>
                    {this.state.inactiveBy.map((list) => (
                      <option value={list}>{list}</option>
                    ))}
                  </select>
                )}
            </td>
            <td className="border-none tab-background " width="20%">
              <strong>Inactive On</strong>
              <button
                className="btn btn-light btn-filter"
                onClick={() => {
                  this.Sortdata("InactiveOn");
                }}
              >
                <i class="fas fa-sort fa-xs"></i>
              </button>
            </td>
            <td className="border-none tab-background " width="20%">
              <strong>Last Modified Date(UTC)</strong>
              <button
                className="btn btn-light btn-filter"
                onClick={() => {
                  this.Sortdata("LastModifiedDate");
                }}
              >
                <i class="fas fa-sort fa-xs"></i>
              </button>
            </td>
            <td className="border-none tab-background " width="12%">
              <strong> </strong>
            </td>
          </Fragment>
        )}
      </Fragment>
    );
  };
  renderDataByStatus = (value) => {
    return (
      <Fragment>
        {(this.state.SelectedCategory.name === "New" ||
          this.state.SelectedCategory.name === "SharePoint") && (
          <Fragment>
            <td className="pt-2">{this.formatDate(value.submittedDate)}</td>
            <td className="pt-2">{value.document_Category}</td>
            <td className="pt-2">{value.data_Source}</td>
            <td>{value.approvalRequired == true ? "Yes" : "No"}</td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "Assigned" && (
          <Fragment>
            <td className="pt-2">{this.formatDate(value.submittedDate)}</td>
            <td className="pt-2">{value.ksoOwner}</td>
            <td className="pt-2">{value.document_Category}</td>
            <td className="pt-2">
              {value.approvalRequired == true ? "Yes" : "No"}
            </td>
            {/* <td className="pt-2"></td> */}
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "InProgress" && (
          <Fragment>
            <td className="pt-2">{value.ksoOwner}</td>
            <td className="pt-2">{value.lastModifiedBy}</td>
            <td className="pt-2">{this.formatDate(value.lastModifiedDt)}</td>
            <td className="pt-2">
              {value.approvalRequired == true ? "Yes" : "No"}
            </td>
            {/* <td className="border-none" width="10%"></td> */}
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "PendingReview" && (
          <Fragment>
            <td className="pt-2">{value.technicalReviewer}</td>
            <td className="pt-2">{value.ksoOwner}</td>
            <td className="pt-2">{this.formatDate(value.lastModifiedDt)}</td>
            <td className="pt-2">
              {value.approvalRequired == true ? "Yes" : "No"}
            </td>
            {/* <td className="border-none" width="10%"></td> */}
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "QA" && (
          <Fragment>
            <td className="pt-2">{value.qualityAuditorInternal}</td>
            <td className="pt-2">{value.ksoOwner}</td>
            <td className="pt-2">{this.formatDate(value.lastModifiedDt)}</td>
            <td className="pt-2">
              {value.approvalRequired == true ? "Yes" : "No"}
            </td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "ReWork" && (
          <Fragment>
            <td className="pt-2">{value.qualityAuditorInternal}</td>
            <td className="pt-2">{value.ksoOwner}</td>
            <td className="pt-2">{this.formatDate(value.lastModifiedDt)}</td>
            <td className="pt-2">
              {value.approvalRequired == true ? "Yes" : "No"}
            </td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "ResponseRecieved" && (
          <Fragment>
            <td className="pt-2">{value.ksoOwner}</td>
            <td className="pt-2">{this.formatDate(value.lastModifiedDt)}</td>
            <td className="pt-2">
              {value.approvalRequired == true ? "Yes" : "No"}
            </td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "ApprovalRecieved" && (
          <Fragment>
            <td className="pt-2">{value.ksoOwner}</td>
            <td className="pt-2">
              {
                value.approvals.filter((x) => x.approvalRecieved == true)[0]
                  ?.approvedBy
              }
            </td>
            <td className="pt-2">{this.formatDate(value.lastModifiedDt)}</td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "Publish" && (
          <Fragment>
            <td className="pt-2">{this.formatDate(value.published_DT)}</td>
            <td className="pt-2">{this.formatDate(value.rePublished_DT)}</td>
            <td className="pt-2">{this.formatDate(value.lastModifiedDt)}</td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "PendingApproval" && (
          <Fragment>
            <td className="pt-2">{value.ksoOwner}</td>
            <td className="pt-2">{value.approver}</td>
            <td className="pt-2">{this.formatDate(value.lastModifiedDt)}</td>
            <td className="pt-2">{this.formatDate(value.emailSend_DT)}</td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "OnHold" && (
          <Fragment>
            <td className="pt-2">{value.ksoOwner}</td>
            <td className="pt-2">{this.getApproverComment(value)}</td>
            <td className="pt-2">{this.formatDate(value.lastModifiedDt)}</td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "UnPublished" && (
          <Fragment>
            <td className="pt-2">{value.ksoOwner}</td>
            <td className="pt-2">-</td>
            <td className="pt-2">{this.formatDate(value.lastModifiedDt)}</td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "UpforArchival" && (
          <Fragment>
            <td className="pt-2">{value.plannedShelfLife}</td>
            <td className="pt-2">-</td>
            <td className="pt-2">{this.formatDate(value.lastModifiedDt)}</td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "Archived" && (
          <Fragment>
            <td className="pt-2">{value.archived_By}</td>
            <td className="pt-2">{this.formatDate(value.archived_DT)}</td>
            <td className="pt-2">{this.formatDate(value.lastModifiedDt)}</td>
          </Fragment>
        )}
        {this.state.SelectedCategory.name === "InActive" && (
          <Fragment>
            <td className="pt-2">{value.inactive_By}</td>
            <td className="pt-2">{this.formatDate(value.inactive_DT)}</td>
            <td className="pt-2">{this.formatDate(value.lastModifiedDt)}</td>
          </Fragment>
        )}
      </Fragment>
    );
  };
  getStatusByValue = (Status) => {
    switch (Status) {
      case "InProgress":
        Status = "In progress";
        break;
      case "PendingReview":
        Status = "Pending Review";
        break;
      case "ReWork":
        Status = "Rework Required";
        break;
      case "ResponseRecieved":
        Status = "Response Recieved";
        break;
      case "QA":
        Status = "Ready for QA";
        break;
      case "UnPublished":
        Status = "Un Published";
        break;
      case "ApprovalRecieved":
        Status = "Approval Recieved";
        break;
      case "PendingApproval":
        Status = "Pending Approval";
        break;
      case "OnHold":
        Status = "On Hold";
        break;
      case "UpforArchival":
        Status = "Up for Archival";
        break;
      default:
        Status = Status;
      // code block
    }
    return Status;
  };
  renderData = () => {
    return (
      <Fragment>
        <tbody>
          <tr className="border-bottom mb-2">
            {/* {(this.state.SelectedCategory.label !== "New") && ( */}
              <td className="border-none" width="2%">
                <input
                  type="checkbox"
                  checked={this.state.AllSelected}
                  onChange={this.toggleSelectAllCheckbox}
                ></input>
              </td>
            {/* )}  */}
            <td className="border-none tab-background" width="18%">
              <strong>Title</strong>
              <button
                className="btn btn-light btn-filter"
                onClick={() => {
                  this.Sortdata("Title");
                }}
              >
                <i class="fas fa-sort fa-xs"></i>
              </button>
            </td>
            <td className="border-none tab-background" width="12%">
              <strong>Previous Status</strong>
            </td>
            {this.renderDataHeadersByStatus()}
          </tr>
          {this.state.docList.map((value, index) => (
            <tr key={index}>
              {/* {(this.state.SelectedCategory.label !== "New") && ( */}
                <td className="border-none">
                  <input
                    type="checkbox"
                    checked={this.state.SelectedIds.indexOf(value.id) != -1}
                    onChange={(e) =>
                      this.toggleSelectDocCheckbox(e.target.checked, value.id)
                    }
                  ></input>
                </td>
               {/* )}  */}
              <td className="pt-2">
                {
                  <a
                    className={identifyFileFormat(value.title.toLowerCase())}
                  ></a>
                }
                <a>{value.title}</a>
              </td>
              <td className="pt-2">
                {this.getStatusByValue(value.previous_Status)}
              </td>
              {this.renderDataByStatus(value)}
              <td className="pt-2">
                <button
                  type="button"
                  className="btn btn-light p-1 pointer"
                  onClick={() => {
                    this.showAdditionalInfo(value);
                  }}
                >
                  <i className="fa fa-info"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-light p-1 pointer ml-2"
                  onClick={() => this.showDocument(value)}
                >
                  <i className="fas fa-bars"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-light p-1 pointer ml-2"
                >
                  <i
                    className="fas fa-eye pointer"
                    title="Document Preview"
                    onClick={() =>
                      this.setState({
                        showDocumentPreview: true,
                        previewURL: URLConfig.handlePreview(value.documentPath),
                      })
                    }
                  ></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Fragment>
    );
  };
  handleComments = (e) => {
    this.setState({ Comments: e.target.value });
  };
  render() {
    const MasterData = this.props.MasterData;
    MasterData.exclusiveFor = this.state.geoRegionData;
    return (
      <Fragment>
        <div className="row height-100vh">
          <div className="col-12 p-0 doc-analysis-section doc-list-container">
            <Fragment>
              {this.state.docList.length > 0 && (
                <div className="row p-0 m-3">
                  <div className="col-4 p-0">
                    <input
                      type="text"
                      value={this.state.SearchText}
                      onChange={this.SearchBoxChange}
                      required
                      className="form-control form-control-sm col-12"
                      placeholder={"Search Documents"}
                      onKeyUp={this.doSearch}
                    />
                    {this.state.SearchText !== "" && (
                      <button
                        className="close-icon"
                        type="reset"
                        onClick={this.clearSearch}
                      ></button>
                    )}
                    {/* <button className="close-icon" type="reset" onClick={this.clearSearch}></button> */}
                  </div>
                  {this.state.filterPageChange && (
                    <div className="col-8 text-right">
                      <button
                        className="btn btn-light"
                        style={{ color: "#0d5265" }}
                        title="Click to reset filter"
                        onClick={() => {
                          this.props.refreshbutton();
                        }}
                      >
                        {/* <i class="fas fa-sync-alt fa-xs"></i> */}
                        <i class="fas fa-undo-alt fa-xs pr-1"></i>
                        <span className="filterbtnsize">Reset filter</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
              {this.state.docList.length === 0 && this.state.SearchText !== "" && (
                <div className="col-12 p-0 mt-3">
                  <div className="col-4 p-0">
                    <input
                      type="text"
                      value={this.state.SearchText}
                      onChange={this.SearchBoxChange}
                      required
                      className="form-control form-control-sm col-12"
                      placeholder={"Search Documents"}
                      onKeyUp={this.doSearch}
                    />
                    <button
                      className="close-icon"
                      type="reset"
                      onClick={this.clearSearch}
                    ></button>
                  </div>
                </div>
              )}
              {this.state.SelectedDoc !== null &&
                this.state.docList.length > 0 && (
                  <Fragment>
                    <table
                      className="table-striped table-bordered m-3 custom-docanalysis-dolist"
                      width="100%"
                    >
                      {this.renderData()}
                    </table>
                  </Fragment>
                )}
              <div className="col-12 p-0 m-3 row">
                <div className="col-4 p-0">
                  {(this.state.SelectedCategory.label === "New" ||
                    this.state.SelectedCategory.label === "Approval Recieved" ||
                    //  this.state.SelectedCategory.label === "Pending Approval"  ||
                    this.state.SelectedCategory.name === "SharePoint") &&
                    this.state.SelectedIds.length > 0 && (
                      <div className="col-4 p-0">
                        <button
                          className="btn btn-sm btn-success m-1"
                          onClick={() => {
                            this.setState({ AssiggnTO: true });
                          }}
                        >
                          Assign to
                        </button>
                      </div>
                    )}
                  <div className="col-8 p-0">
                  <div className="col-6 p-0">
                  {this.state.docList &&
                    this.state.docList.length > 0 &&
                    this.state.SelectedIds.length > 0 && 
                    this.state.SelectedCategory.label !== "New" && (
                      <select
                        className="form-control form-control-sm"
                        value={this.state.SelectedStatusToMove}
                        onChange={this.ChangeDocumentStatus}
                      >
                        <option value="0" disabled selected>
                          -- Move To --
                        </option>
                        {this.state.SelectedCategory.AllowedActions.map(
                          (value, index) => {
                            return (
                              <option
                                value={
                                  MyWorkSpace_ByStatus.find(
                                    (x) => x.name === value
                                  ).value
                                }
                                key={index}
                              >
                                {
                                  MyWorkSpace_ByStatus.find(
                                    (x) => x.name === value
                                  ).label
                                }
                              </option>
                            );
                          }
                        )}
                      </select>
                    )}
                    </div>
                </div>
                </div>
                {this.state.docList &&
                  this.state.docList.length > 0 &&
                  this.state.totalItemsCount > 10 && (
                    <div className="p-0 col-8">
                      <Pagination
                        prevPageText="<"
                        nextPageText=">"
                        firstPageText="<<"
                        lastPageText=">>"
                        activePage={this.state.activePage}
                        itemsCountPerPage={this.state.itemsCountPerPage}
                        totalItemsCount={this.state.totalItemsCount}
                        pageRangeDisplayed={5}
                        onChange={this.handlePageChange}
                      />
                    </div>
                  )}
              </div>
            </Fragment>
          </div>
        </div>
        <Modal show={this.state.showMetaInfoPopUp} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a className="btn btn-sm btn-transp">
                {this.state.SelectedDoc ? this.state.SelectedDoc.title : ""}
              </a>
              <a
                className="btn btn-link float-right mtop-5 Doc-Depo-Heading"
                onClick={() => {
                  this.setState({ showMetaInfoPopUp: false });
                }}
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.SelectedDoc && this.state.SelectedDoc.source !== 2 && (
              <DocumentDetailsModal
                onSave={this.SaveData}
                MasterData={MasterData}
                docData={this.state.SelectedDocMetaData}
                EditMode={true}
                DocType={this.state.SelectedDocMetaData?.source}
                Status={this.state.SelectedCategory.value}
                MasterDataOther={this.state.MasterDataOther}
              ></DocumentDetailsModal>
            )}
            {this.state.SelectedDoc && this.state.SelectedDoc.source === 2 && (
              <DocumentDetailsModal
                onSave={this.SaveData}
                MasterData={MasterData}
                docData={this.state.SelectedDocMetaData}
                EditMode={true}
                DocType={this.state.SelectedDocMetaData?.source}
                Status={this.state.SelectedCategory.value}
                MasterDataOther={this.state.MasterDataOther}
              ></DocumentDetailsModal>
            )}
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.AssiggnTO}
          onHide={() => {
            this.setState({
              AssiggnTO: false,
              AssignMail: "",
              ValidMail: false,
            });
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Assign To</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-12 row pr-0 mr-0">
              <div className="row col-12">
                <div className="col-4 pl-0 mb-2">Assign To</div>
                <div className="col-8 mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm mb-1"
                    autoComplete="off"
                    placeholder="Enter valid HPE email"
                    value={this.state.AssignMail}
                    onBlur={this.handleBlur_Mails}
                    onChange={this.handleChange_Mails}
                  ></input>
                  {this.state.AssignMail.length > 0 &&
                    !this.state.ValidMail && (
                      <div className="row pl-4 text-danger">
                        Please enter only valid HPE Email Ids
                      </div>
                    )}
                </div>
              </div>
              <div className="row col-12">
                <div className="col-4 pl-0">Comments (Optional)</div>
                <div className="col-8">
                  <textarea
                    className="form-control"
                    id="addcomments"
                    value={this.state.Comments}
                    onChange={this.handleComments}
                    rows="2"
                    name="addComments"
                  ></textarea>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!this.state.ValidMail}
              ref="btnAssign"
              onClick={() => {
                this.AssignDocument(this.state.AssignMail);
              }}
            >
              Assign
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                this.setState({
                  AssiggnTO: false,
                  AssignMail: "",
                  ValidMail: false,
                });
              }}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.ShowAdditionalInfo}
          onHide={() => {
            this.setState({ ShowAdditionalInfo: false });
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Additional Info</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.AdditionalInfo && this.renderAdditionalData()}
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
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
          {/* <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleModalClose(DOC_PREVIEW)}
            >
              Close
            </button>
          </Modal.Footer> */}
        </Modal>
        <Modal
          show={this.state.ShowStatusMovePopUp}
          onHide={() => {
            this.setState({
              ShowStatusMovePopUp: false,
              AssignMail: "",
              ValidMail: false,
              SelectedStatusToMove: "0",
              showTechReviewers: false,
              showQAReviewers: false,
              showApprovalRequired: false,
            });
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Please Confirm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-12 row pr-0 mr-0">
              {this.props.MasterData.tect_reviwers.length > 0 &&
                this.state.showTechReviewers && (
                  <div className="row col-12">
                    <div className="col-4 pl-0 mb-2">Technical Reviewer</div>
                    <div className="col-8 mb-2">
                      <select
                        className="form-control form-control-sm"
                        onChange={this.handleChange_Tech_Reviwer}
                        value={
                          this.state.Tech_Reviwer &&
                          this.state.Tech_Reviwer !== ""
                            ? this.state.Tech_Reviwer
                            : "0"
                        }
                      >
                        <option disabled value="0">
                          {" "}
                          -- Please Select --{" "}
                        </option>
                        {this.props.MasterData.tect_reviwers.map(
                          (list, index) => (
                            <option value={list.empNo} key={index}>
                              {list.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                )}
              {this.props.MasterData.qa_reviewers.length > 0 &&
                this.state.showQAReviewers && (
                  <div className="row col-12">
                    <div className="col-4 pl-0 mb-2">QA Reviewer</div>
                    <div className="col-8 mb-2">
                      <select
                        className="form-control form-control-sm"
                        onChange={this.handleChange_QA_Reviwer}
                        value={
                          this.state.Selected_Qa_Reviewer &&
                          this.state.Selected_Qa_Reviewer !== ""
                            ? this.state.Selected_Qa_Reviewer
                            : "0"
                        }
                      >
                        <option disabled value="0">
                          {" "}
                          -- Please Select --{" "}
                        </option>
                        {this.props.MasterData.qa_reviewers.map(
                          (list, index) => (
                            <option value={list.empNo} key={index}>
                              {list.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                )}
              {this.state.showApprovalRequired && (
                <Fragment>
                  <table>
                    <tr>
                      <td colSpan="2">
                        <div className="input-group alignment-pending-approve">
                          <div className="input-group-prepend ">
                            <span
                              className="pending-approval"
                              id="PrimaryOwnerLabel"
                            >
                              Primary Owner
                            </span>
                          </div>
                          <input
                            className="form-control form-control-sm"
                            id="primaryapprover"
                            placeholder="Enter valid HPE email"
                            type="text"
                            value={this.state.primaryOwnerMailsRaw}
                            onChange={this.handleChange_PrimaryOwnerMails}
                            onBlur={(e) => this.handleBlur_PrimaryOwnerMails(e)}
                            ref={this.primaryRef}
                          ></input>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2">
                        {!this.state.ValidPrimaryMail && (
                          <div className="float-right validate-red">
                            Please Enter Valid HPE Email Id for Primary Owner
                          </div>
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan="2">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span
                              className="pending-approval"
                              id="SecondaryOwnerLabel"
                            >
                              Secondary Owner
                            </span>
                          </div>

                          <input
                            className="form-control form-control-sm "
                            type="text"
                            placeholder="Enter valid HPE email"
                            value={this.state.secondaryOwnerMailsRaw}
                            onChange={this.handleChange_SecondaryOwnerMails}
                            onBlur={(e) =>
                              this.handleBlur_SecondaryOwnerMails(e)
                            }
                          />
                        </div>
                      </td>
                      <td>
                        <span
                          className="plusIcon pointer"
                          title="Click to Add Additional Approver Details"
                          onClick={() => this.addLastLevelApproverClick()}
                        >
                          +
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        {!this.state.ValidSecondaryMail && (
                          <p className="float-right validate-red">
                            Please Enter Valid HPE Email Id for Secondary Owner
                          </p>
                        )}
                      </td>
                    </tr>
                    {this.state.lastLevelApproverData.length > 0 && (
                      <p className="pending-approval">Additional Approvers</p>
                    )}
                    {this.state.lastLevelApproverData.length > 0 &&
                      this.state.lastLevelApproverData.map((item, idx) => (
                        <>
                          {idx < 4 && (
                            <tr>
                              <td colSpan="2">
                                <div className="input-group">
                                  <input
                                    placeholder="Enter valid HPE email"
                                    className="form-control form-control-sm"
                                    name="approverContact"
                                    value={item.approverContact}
                                    onChange={(e) =>
                                      this.handleLastLevelApproverChange(e, idx)
                                    }
                                    onBlur={(event) =>
                                      this.handleApproverContact(event)
                                    }
                                  />

                                  <input
                                    className="form-control form-control-sm ml-2"
                                    placeholder="Approver Role"
                                    name="approverRole"
                                    value={item.approverRole}
                                    onChange={(e) =>
                                      this.handleLastLevelApproverChange(e, idx)
                                    }
                                  />
                                </div>
                              </td>
                              <td>
                                {idx < 3 && (
                                  <span
                                    className="plusIcon pointer "
                                    title="Click to Add Additional Approver Details"
                                    onClick={() =>
                                      this.addLastLevelApproverClick()
                                    }
                                  >
                                    +
                                  </span>
                                )}

                                <span
                                  className="removeIcon pointer "
                                  title="Click to Remove Additional Approver Details"
                                  onClick={() =>
                                    this.removeLastLevelApproverClick(idx)
                                  }
                                >
                                  x
                                </span>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    <tr>
                      {!this.state.ValidApproverMail && (
                        <p className="float-left validate-red ml-2">
                          Please Enter Valid HPE Email Id for Additional
                          Approver
                        </p>
                      )}
                    </tr>
                  </table>
                </Fragment>
              )}
              {this.state.SelectedStatusToMove == "12" && (
                <Fragment>
                  <div className="col-4 pl-0 mt-2">Response from KSO</div>
                  <div className="col-8 mt-2">
                    <textarea
                      className="form-control"
                      id="addKSOFeedback"
                      value={this.state.KSOFeedBack}
                      onChange={this.handleKSOFeedBack}
                      rows="6"
                      name="addComments"
                    ></textarea>
                  </div>
                </Fragment>
              )}
              {this.state.SelectedCategory.name === "QA" && (
                <Fragment>
                  <div className="row col-12">
                    <div className="col-4 pl-0 mb-2">QA Review Completed</div>
                    <div className="col-8 mb-2">
                      <div className="input-group">
                        <div className="form-check form-check-inline  ml-2">
                          <input
                            className="pl-0"
                            type="radio"
                            name="QAReview_1"
                            id="QAReview_Yes"
                            value="true"
                            onChange={this.handleChange_QAComplete}
                            checked={
                              this.state.QADone ? this.state.QADone : false
                            }
                          />
                          <label className="p-1 m-0">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="pl-0"
                            type="radio"
                            name="QAReview_2"
                            id="QAReview_No"
                            value="false"
                            onChange={this.handleChange_QAComplete}
                            checked={!this.state.QADone ? true : false}
                          />
                          <label className="p-1 m-0">No</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </Fragment>
              )}
              {this.state.SelectedCategory.name === "PendingReview" && (
                <Fragment>
                  <div className="row col-12">
                    <div className="col-4 pl-0 mb-2">
                      Technical Review Completed
                    </div>
                    <div className="col-8 mb-2">
                      <div className="input-group">
                        <div className="form-check form-check-inline  ml-2">
                          <input
                            className="pl-0"
                            type="radio"
                            name="TechnicalReview_1"
                            id="TechnicalReview_Yes"
                            value="true"
                            onChange={this.handleChange_TechnicalComplete}
                            checked={
                              this.state.TechnicalReviewDone
                                ? this.state.TechnicalReviewDone
                                : false
                            }
                          />
                          <label className="p-1 m-0">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="pl-0"
                            type="radio"
                            name="TechnicalReview_2"
                            id="TechnicalReview_No"
                            value="false"
                            onChange={this.handleChange_TechnicalComplete}
                            checked={
                              !this.state.TechnicalReviewDone ? true : false
                            }
                          />
                          <label className="p-1 m-0">No</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </Fragment>
              )}
              {this.state.SelectedStatusToMove != "12" && (
                <div className="row col-12">
                  <div className="col-4 pl-0 mt-2">Comments (Optional)</div>
                  <div className="col-8 mt-2">
                    <textarea
                      className="form-control"
                      id="addcomments"
                      value={this.state.Comments}
                      onChange={this.handleComments}
                      rows="6"
                      name="addComments"
                    ></textarea>
                  </div>
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              ref={this.btnContinue}
              onClick={() => {
                this.FireAPIForChangeDocumentStatus();
              }}
              disabled={this.handleBtnDisable()}
            >
              Continue
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                this.setState({
                  ShowStatusMovePopUp: false,
                  AssignMail: "",
                  ValidMail: false,
                  SelectedStatusToMove: "0",
                  showTechReviewers: false,
                  showQAReviewers: false,
                  showApprovalRequired: false,
                });
              }}
            >
              Cancel
            </button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}
export default DocumentList;
