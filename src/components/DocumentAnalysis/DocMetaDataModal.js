import React, { Component, Fragment } from "react";
import "bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import _ from "lodash";
import { getAllLanguages } from "../../utils/Languages";
import {
  GetRefrenceCategories,
  GetKnowledgeCategories,
  GetAudiance,
} from "../../utils/Constants";
import { Multiselect } from "multiselect-react-dropdown";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import axios, { post } from "axios";
import URLConfig from "./URLConfig";
class DocumentDetailsModal extends Component {
  constructor() {
    super();
    this.state = {
      OppId: "",
      startDate: new Date(),
      roleList: [],
      selectedValue: [],
      geoRegions: [],
      geoRegionData: {},
      selectedRegion: "",
      selectedCluster: "",
      DocData: {},
      clusterCheckbox: true,
      countriesAllCheckbox: true,
      EnableEdit: true,
      lastLevelApproverData: [],
      deltaDocumentApprovals: [],
      datenda: false,
      exclusiveFor: "",
      clusterSelected: "",
      regionSelected: "",
      validOppID: true,
      isGoldCollateralEnabled: false,
      otherCompetitors: false,
      otherResearchVendors: false,
      otherPartners: false,
      otherCompetitorsError: false,
    };
    this.OppIDInput = React.createRef();
    this.setStartDate = this.setStartDate.bind(this);
    this.handleChange_Client = this.handleChange_Client.bind(this);
    this.handleChange_Desc = this.handleChange_Desc.bind(this);
    this.handleChange_ProjectName = this.handleChange_ProjectName.bind(this);
    this.handleChange_DelieveryMode =
      this.handleChange_DelieveryMode.bind(this);
    this.handleChange_NDA = this.handleChange_NDA.bind(this);
    this.handleChangeNDAMails = this.handleChange_NDAMails.bind(this);
    this.handleChange_ChannelEnabled =
      this.handleChange_ChannelEnabled.bind(this);
    this.handleChange_IsInitiative = this.handleChange_IsInitiative.bind(this);
    this.handleChange_Greenlake = this.handleChange_Greenlake.bind(this);
    this.handleChange_ServiceType = this.handleChange_ServiceType.bind(this);
    this.handleChange_Competitors = this.handleChange_Competitors.bind(this);
    this.handleChange_Vendors = this.handleChange_Vendors.bind(this);
    this.handleChange_Partners = this.handleChange_Partners.bind(this);
    this.handleChange_Disclosure = this.handleChange_Disclosure.bind(this);
    this.handleChange_Industry_Segment =
      this.handleChange_Industry_Segment.bind(this);
    this.handleChange_Industry_Vertical =
      this.handleChange_Industry_Vertical.bind(this);
    this.handleChange_Country = this.handleChange_Country.bind(this);
    this.handleChange_Language = this.handleChange_Language.bind(this);
    this.handleChange_KeyWords = this.handleChange_KeyWords.bind(this);
    this.handleChange_Notes = this.handleChange_Notes.bind(this);
    this.SaveData = this.SaveData.bind(this);
    this.updateRegionData = this.updateRegionData.bind(this);
    this.getSelectedClusterData = this.getSelectedClusterData.bind(this);
    this.updateExclusiveFor = this.updateExclusiveFor.bind(this);
    this.getSelectedCountryCode = this.getSelectedCountryCode.bind(this);
    this.HandleBusiness = this.HandleBusiness.bind(this);
    this.onSKUKeyUp = this.onSKUKeyUp.bind(this);
    this.handleChange_initiative = this.handleChange_initiative.bind(this);

    this.handleChange_initiative_Other =
      this.handleChange_initiative_Other.bind(this);
    this.handleChange_RecommendedBy =
      this.handleChange_RecommendedBy.bind(this);
    this.Add_Competitors = this.Add_Competitors.bind(this);
    this.Add_ResearchVendors = this.Add_ResearchVendors.bind(this);
    this.Add_Partners = this.Add_Partners.bind(this);
    this.handleRemove_CompetitorsOthers =
      this.handleRemove_CompetitorsOthers.bind(this);
    this.handleRemove_ResearchVendorsOthers =
      this.handleRemove_ResearchVendorsOthers.bind(this);
    this.handleRemove_PartnersOthers =
      this.handleRemove_PartnersOthers.bind(this);
    this.UpdateMasterTableOthersData =
      this.UpdateMasterTableOthersData.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    debugger;
    const SelectedDateOption =
      props.docData.deltaDocumentDetails[0]?.selectedPlannedShelfLife != ""
        ? props.docData.deltaDocumentDetails[0]?.selectedPlannedShelfLife
        : "1";
    const competitorsSelected = props.docData
      ? props.docData.deltaDocumentDetails[0].competitors?.split(",") !==
        undefined
        ? props.docData.deltaDocumentDetails[0].competitors?.split(",")
        : ""
      : "";
    const serviceTypeSelected = props.docData
      ? props.docData.deltaDocumentDetails[0].serviceType?.split(",") !==
        undefined
        ? props.docData.deltaDocumentDetails[0].serviceType?.split(",")
        : ""
      : "";
    const researchVendorsSelected = props.docData
      ? props.docData.deltaDocumentDetails[0].researchVendors?.split(",") !==
        undefined
        ? props.docData.deltaDocumentDetails[0].researchVendors?.split(",")
        : ""
      : "";
    const partnersSelected = props.docData
      ? props.docData.deltaDocumentDetails[0].partners?.split(",") !== undefined
        ? props.docData.deltaDocumentDetails[0].partners?.split(",")
        : ""
      : "";
    const audianceSelected = props.docData
      ? props.docData.deltaDocumentDetails[0].recommendedBy?.split(",") !==
        undefined
        ? props.docData.deltaDocumentDetails[0].recommendedBy?.split(",")
        : ""
      : "";
    if (props.docData.id !== state.DocData.docId) {
      let DocData = props.docData.deltaDocumentDetails[0];

      const DocumentApprovals = props.docData.deltaDocumentApprovals;

      if (DocumentApprovals && DocData.approvalRequired) {
        DocData.primaryOwnerMailsRaw = DocumentApprovals.filter(
          (x) => x.isPrimaryOwner == true
        )[0]?.approverUid;
        DocData.secondaryOwnerMailsRaw = DocumentApprovals.filter(
          (x) => x.isSecondryOwner == true
        )[0]?.approverUid;
        var hasAdditionalApprovals = DocumentApprovals.filter(
          (x) => x.isAdditionalApproval == true
        );
      }

      var deltaDocumentApprovals = props.docData.deltaDocumentApprovals;
      debugger;
      return {
        DocData: DocData,
        deltaDocumentApprovals,
        geoRegionData: props.MasterData.exclusiveFor,
        exclusiveFor:
          props.docData.source !== 3
            ? props.docData.source === 4
              ? props.MasterData.geoRegions
              : props.docData.deltaDocumentDetails[0].exclusiveFor
            : props.MasterData.geoRegions,
        DocName: props.docData.name,
        OppId: props.docData.oppId,
        EditMode: props.EditMode,
        DocType: props.DocType,
        DefaultDocType: props.DocType,
        competitorsSelected: props.MasterData.competitors.filter(
          (x) => competitorsSelected.indexOf(x.name) != -1
        ),
        otherCompetitorsSelected:
          props.MasterDataOther.competitorsOthers.filter(
            (a) =>
              a.docId == props.docData.deltaDocumentDetails[0].docId ||
              a.createdBy == props.docData.name,
            (x) =>
              props.docData.deltaDocumentDetails[0].competitorsOthers
                ?.split(",")
                .indexOf(x.name) != -1
          ),
        otherResearchVendorsSelected:
          props.MasterDataOther.researchVendorsOthers.filter(
            (a) =>
              a.docId == props.docData.deltaDocumentDetails[0].docId ||
              a.createdBy == props.docData.name,
            (x) =>
              props.docData.deltaDocumentDetails[0].researchVendorsOthers
                ?.split(",")
                .indexOf(x.name) != -1
          ),
        serviceTypeSelected: props.MasterData.serviceTypes.filter(
          (x) => serviceTypeSelected.indexOf(x.name) != -1
        ),
        researchVendorsSelected: props.MasterData.researchVendors.filter(
          (x) => researchVendorsSelected.indexOf(x.name) != -1
        ),
        partnersSelected: props.MasterData.partners.filter(
          (x) => partnersSelected.indexOf(x.name) != -1
        ),
        otherPartnersSelected: props.MasterDataOther.partnersOthers.filter(
          (a) =>
            a.docId == props.docData.deltaDocumentDetails[0].docId ||
            a.createdBy == props.docData.name,
          (x) =>
            props.docData.deltaDocumentDetails[0].partnersOthers
              ?.split(",")
              .indexOf(x.name) != -1
        ),
        audianceSelected: GetAudiance().filter(
          (x) => audianceSelected.indexOf(x.name) != -1
        ),
        SelectedDateOption: SelectedDateOption,
        ValidMail: true,
        ValidPrimaryMail: true,
        ValidSecondaryMail: true,
        ValidApproverMail: true,
      };
    } else {
      return null;
    }
  }
  componentDidMount() {
    var roles = Cookies.get("roles").split(",");
    var isGoldCollateralEnabled =
      roles.indexOf("Admin") != -1 ||
      roles.indexOf("Analyst") != -1 ||
      roles.indexOf("Process") != -1 ||
      roles.indexOf("Specialist") != -1 ||
      roles.indexOf("Practice") != -1;

    if (this.props.MasterData.geoRegions) {
      this.setState(
        {
          geoRegions: this.props.MasterData.geoRegions,
          isGoldCollateralEnabled,
        },
        () => this.modifyGeoRegionData()
      );
    }
    this.updateRegionData();
    if (this.props.docData?.deltaDocumentApprovals) {
      let lastLevelApproverData = [...this.state.lastLevelApproverData];
      var hasAdditionalApprovals =
        this.props.docData.deltaDocumentApprovals.filter(
          (x) => x.isAdditionalApproval == true
        );
      if (hasAdditionalApprovals.length) {
        hasAdditionalApprovals.forEach((element, i) => {
          const approverContact = element.approverUid;
          const approverRole = element.additionalApprovalRole;
          lastLevelApproverData.push({ approverContact, approverRole });
        });

        this.setState({
          lastLevelApproverData: lastLevelApproverData,
        });
      }
    }
    this.getValidNDAUptoDate();
    this.updatePlannedShelfLife();
    this.UpdateMasterTableOthersData();
  }
  UpdateMasterTableOthersData() {
    debugger;
    let DocMetaData = this.state.DocData;
    let otherComp = [...this.state.otherCompetitorsSelected];
    console.log(otherComp);
    DocMetaData.competitorsOthers = otherComp.map((x) => x.name).join(",");
    let otherRese = [...this.state.otherResearchVendorsSelected];
    DocMetaData.researchVendorsOthers = otherRese.map((x) => x.name).join(",");
    let otherPart = [...this.state.otherPartnersSelected];
    DocMetaData.partnersOthers = otherPart.map((x) => x.name).join(",");
    this.setState({
      otherCompetitors:
        this.state.DocData.competitors
          ?.split(",")
          .filter((x) => x == "Others") == "Others"
          ? true
          : false,
      otherPartners:
        this.state.DocData.partners?.split(",").filter((x) => x == "Others") ==
        "Others"
          ? true
          : false,
      otherResearchVendors:
        this.state.DocData.researchVendors
          ?.split(",")
          .filter((x) => x == "Others") == "Others"
          ? true
          : false,
      DocData: DocMetaData,
    });
  }
  getSelectedClusterData(country) {
    //clusterSelected
    if (this.state.exclusiveFor.includes(country.countryCode)) {
      if (this.state.clusterSelected == "")
        this.state.clusterSelected = country.cluster;
      else
        this.state.clusterSelected =
          this.state.clusterSelected.includes(country.cluster) == false
            ? this.state.clusterSelected + "," + country.cluster
            : this.state.clusterSelected;
      //regionSelected
      if (this.state.regionSelected == "")
        this.state.regionSelected = country.region;
      else
        this.state.regionSelected =
          this.state.regionSelected.includes(country.region) == false
            ? this.state.regionSelected + "," + country.region
            : this.state.regionSelected;
    }
  }
  updateRegionData() {
    this.state.clusterSelected = "";
    this.state.regionSelected = "";
    let data = this.state.geoRegionData;
    data.regions.map((r) =>
      r.clusters.map((c) =>
        c.countries.map((cc) => {
          this.getSelectedClusterData(cc);
        })
      )
    );
    let dataUpdate = this.state.geoRegionData;
    let selectedRegion = dataUpdate.regions;
    for (let i = 0; i < selectedRegion.length; i++) {
      let regionObj = selectedRegion[i];
      let clusters = regionObj.clusters;
      regionObj.clusters = clusters.map((c) => {
        let checked = false;
        if (this.state.clusterSelected.includes(c.clusterName)) {
          c = { ...c };
          c.isChecked = true;
          checked = true;
        } else {
          c = { ...c };
          c.isChecked = false;
          checked = false;
        }
        return {
          ...c,
          isChecked: checked,
          countries: c.countries.map((cty) => {
            if (this.state.exclusiveFor.includes(cty.countryCode)) {
              return { ...cty, isChecked: true };
            } else return { ...cty, isChecked: false };
          }),
        };
      });
      if (this.state.regionSelected.includes(regionObj.regionName))
        regionObj.isChecked = true;
      else regionObj.isChecked = false;
    }
    this.setState({ geoRegionData: dataUpdate });
  }

  onRegionClick = (region) => {
    this.setState({ selectedCluster: "", selectedRegion: region.regionName });
  };
  onClusterClick = (cluster) => {
    this.setState({ selectedCluster: cluster.clusterName });
  };
  areAllRegionsChecked = () => {
    let regions = [...this.state.geoRegionData.regions];
    let regionsChecked = regions.filter((r) => r.isChecked);
    if (regions.length === regionsChecked.length) {
      return true;
    } else {
      return false;
    }
  };
  handleChange_RecommendedBy(event) {
    const DocData = this.state.DocData;
    DocData.recommendedBy = event.target.value;
    this.setState({ DocData: DocData });
  }

  handleChange_DataSource = (event) => {
    const DocData = this.state.DocData;
    DocData.dataSource = event.target.value;
    this.setState({ DocData: DocData });
  };
  handleChange_KsoOwner = (event) => {
    const DocData = this.state.DocData;
    DocData.ksoOwner = event.target.value;
    this.setState({ DocData: DocData });
  };
  toggleRegionCheckbox = (region) => {
    let data = { ...this.state.geoRegionData };
    data.isTouched = true;
    var regions = [...data.regions];
    var index = regions.findIndex((r) => r.regionName === region.regionName);
    var region = regions[index];
    var isCheckedValue = region.isChecked;
    let clusters = region.clusters;
    region.clusters = clusters.map((c) => {
      return {
        ...c,
        isChecked: true,
        countries: c.countries.map((cty) => {
          return { ...cty, isChecked: true };
        }),
      };
    });

    var updatedRegion = { ...region, isChecked: !isCheckedValue };
    regions[index] = updatedRegion;
    data.regions = regions;
    this.setState({ geoRegionData: data }, () => {
      this.setState({ areAllRegionsChecked: this.areAllRegionsChecked() });
    });
  };

  toggleClusterCheckbox = (region, cluster) => {
    let data = { ...this.state.geoRegionData };
    var regions = data.regions;
    var index = regions.findIndex((r) => r.regionName === region.regionName);
    var region = regions[index];
    var clusters = region.clusters;
    var index2 = clusters.findIndex(
      (c) => c.clusterName === cluster.clusterName
    );
    let oldCluster = clusters[index2];

    var oldIsCheckedValue = oldCluster.isChecked;
    var updatedCluster = {
      ...oldCluster,
      isChecked: !oldIsCheckedValue,
      countries: oldCluster.countries.map((cty) => {
        return { ...cty, isChecked: true };
      }),
    };
    //clusters updated
    clusters[index2] = updatedCluster;
    //regions[index].clusters=
    data.regions = regions;
    //data.regions = regions;
    this.setState({ geoRegionData: data });
  };

  toggleCompanyCheckbox = (cluster, company) => {
    let data = { ...this.state.geoRegionData };
    var regions = data.regions;
    var filteredRegions = regions.filter((r) => r.isChecked);
    for (let index = 0; index < filteredRegions.length; index++) {
      var region = filteredRegions[index];
      var clusters = region.clusters;
      var index2 = clusters.findIndex(
        (c) => c.clusterName === cluster.clusterName
      );
      if (index2 === -1) continue;
      let oldCluster = clusters[index2];

      var countries = oldCluster.countries;
      var index3 = countries.findIndex((c) => c.country === company.country);
      var oldCountry = countries[index3];
      let oldIsCheckedValue = oldCountry.isChecked;
      var updatedContry = {
        ...oldCountry,
        isChecked: !oldIsCheckedValue,
      };
      countries[index3] = updatedContry;
      this.setState({ geoRegionData: data });
    }
  };

  toggleRegionSelectAllCheckbox = () => {
    if (this.state.clusterCheckbox === false) {
      let data = this.state.geoRegionData;
      let selectedRegion = data.regions.filter((r) => r.isChecked);

      for (let i = 0; i < selectedRegion.length; i++) {
        let regionObj = selectedRegion[i];
        let clusters = regionObj.clusters;
        regionObj.clusters = clusters.map((c) => {
          return {
            ...c,
            isChecked: true,
            countries: c.countries.map((cty) => {
              return { ...cty, isChecked: true };
            }),
          };
        });
      }
      this.setState({ geoRegionData: data, clusterCheckbox: true });
    } else {
      let data = this.state.geoRegionData;
      let selectedRegion = data.regions.filter((r) => r.isChecked);

      for (let i = 0; i < selectedRegion.length; i++) {
        let regionObj = selectedRegion[i];
        let clusters = regionObj.clusters;
        regionObj.clusters = clusters.map((c) => {
          return {
            ...c,
            isChecked: false,
            countries: c.countries.map((cty) => {
              return { ...cty, isChecked: false };
            }),
          };
        });
      }
      this.setState({ geoRegionData: data, clusterCheckbox: false });
    }
  };

  toggleCountriesSelectAllCheckbox = () => {
    if (this.state.countriesAllCheckbox === false) {
      let data = this.state.geoRegionData;
      let selectedRegion = data.regions.filter((r) => r.isChecked);

      for (let i = 0; i < selectedRegion.length; i++) {
        let regionObj = selectedRegion[i];
        let clusters = regionObj.clusters;
        regionObj.clusters = clusters.map((c) => {
          if (c.isChecked) {
            return {
              ...c,
              isChecked: true,
              countries: c.countries.map((cty) => {
                return {
                  ...cty,
                  isChecked: true,
                };
              }),
            };
          } else {
            return { ...c };
          }
        });
      }
      this.setState({ geoRegionData: data, countriesAllCheckbox: true });
    } else {
      let data = this.state.geoRegionData;
      let selectedRegion = data.regions.filter((r) => r.isChecked);

      for (let i = 0; i < selectedRegion.length; i++) {
        let regionObj = selectedRegion[i];
        let clusters = regionObj.clusters;
        //let selectedClusters=clusters.filter(f=>f.isChecked);
        regionObj.clusters = clusters.map((c) => {
          return {
            ...c,
            countries: c.countries.map((cty) => {
              return { ...cty, isChecked: false };
            }),
          };
        });
      }
      this.setState({ geoRegionData: data, countriesAllCheckbox: false });
    }
  };
  getValidNDAUptoDate = () => {
    var timeStampNow = Date.now();
    var timeStampNda = Date.parse(
      this.props.docData.deltaDocumentDetails[0].ndaUptoDt
    );
    if (timeStampNow == timeStampNda || timeStampNow > timeStampNda)
      return this.setState({ datenda: true });
    else if (timeStampNow < timeStampNda)
      return this.setState({ datenda: false });
  };
  updatePlannedShelfLife = () => {
    var republishedDate =
      this.props.docData.deltaDocumentDetails[0].rePublishedDt;
    if (republishedDate != null) {
      if (
        this.props.docData.deltaDocumentDetails[0].selectedPlannedShelfLife !=
          "Custom" &&
        this.props.docData.deltaDocumentDetails[0].selectedPlannedShelfLife ===
          1
      ) {
        const DocData = this.state.DocData;
        var newDate = republishedDate.replace(
          republishedDate.substring(0, 4),
          Number(republishedDate.substring(0, 4)) + 1
        );
        DocData.plannedShelfLife = newDate;
        this.setState({ DocData: DocData });
      }
    }
  };
  //All OnChange Events
  handleChange_DocumentTitle = (e) => {
    var extension = this.state.DocName.split(".").pop();
    var DocName = e.target.value + "." + extension;
    this.setState({ DocName });
  };
  handleChange_Client(event) {
    const DocData = this.state.DocData;
    DocData.client = event.target.value;
    this.setState({ DocData: DocData });
  }

  handleChange_DocumentType(event) {
    const DocData = this.state.DocData;
    DocData.documentType = event.target.value;
    this.setState({ DocData: DocData });
  }
  handleChange_Desc(event) {
    const DocData = this.state.DocData;
    DocData.description = event.target.value;
    this.setState({ DocData: DocData });
  }
  handleChange_ProjectName(event) {
    const DocData = this.state.DocData;
    DocData.projectName = event.target.value;
    this.setState({ DocData: DocData });
  }

  handleChange_DelieveryMode(event) {
    const DocData = this.state.DocData;
    DocData.modeOfDelivery = event.target.value;
    this.setState({ DocData: DocData });
  }
  handleChange_DocType = (event) => {
    const DocData = this.state.DocData;
    DocData.documentType = event.target.value;
    this.setState({ DocData: DocData });
  };
  handleChange_NDA(event) {
    const DocData = this.state.DocData;
    DocData.nda = event.target.value === "true" ? true : false;
    this.setState({ DocData: DocData });
  }
  handleChange_ApprovalRequired = (event) => {
    const DocData = this.state.DocData;
    DocData.approvalRequired = event.target.value === "true" ? true : false;
    this.setState({ DocData: DocData });
  };
  handleChange_TechnicalReviewRequired = (event) => {
    const DocData = this.state.DocData;
    DocData.technicalReviewRequired =
      event.target.value === "true" ? true : false;
    this.setState({ DocData: DocData });
  };
  handleChange_ChannelEnabled(event) {
    const DocData = this.state.DocData;
    DocData.channelEnabled = event.target.value === "true" ? true : false;
    this.setState({ DocData: DocData });
  }
  handleChange_IsInitiative(event) {
    const DocData = this.state.DocData;
    DocData.alignedToInitiative = event.target.value === "true" ? true : false;
    this.setState({ DocData: DocData });
  }
  handleChange_Greenlake(event) {
    //
    const DocData = this.state.DocData;
    DocData.hpeGreenLake = event.target.value === "true" ? true : false;
    this.setState({ DocData: DocData });
  }
  // handleChange_ServiceType(event) {
  //   //
  //   const DocData = this.state.DocData;
  //   DocData.serviceType = event.target.value;
  //   this.setState({ DocData: DocData });
  // }
  handleChange_Competitors(SelectedList, SelectedOne) {
    debugger;
    // SelectedList.split(',').filter(x=>x=='Others')=='Others'?true:false
    this.setState({
      otherCompetitors:
        SelectedList.filter((x) => x.name == "Others").length > 0,
    });
    const DocData = this.state.DocData;
    DocData.competitors = SelectedList.map((x) => x.name).join(",");
    var competitorsSelected = this.props.MasterData.competitors.filter((x) =>
      SelectedList.includes(x)
    );
    this.setState({ DocData, competitorsSelected });
  }
  Add_Competitors() {
    let DocMetaData = this.state.DocData;
    if (document.getElementById("otherCompetitors") != null) {
      //this.setState({otherCompetitors:false});
      if (document.getElementById("otherCompetitors").value.length >= 1) {
        //console.log(this.state.otherCompetitorsSelected);
        let list = [...this.state.otherCompetitorsSelected];
        list.push({
          name: document.getElementById("otherCompetitors").value,
          isActive: true,
        });
        this.setState({ otherCompetitorsSelected: list });
        DocMetaData.competitorsOthers = list.map((x) => x.name).join(",");
        this.setState({ DocData: DocMetaData, list });
        document.getElementById("otherCompetitors").value = "";
      }
    }
  }

  Add_ResearchVendors() {
    let DocMetaData = this.state.DocData;
    //const DocMetaData = this.state.DocMetaData;
    if (document.getElementById("otherResearchVendors") != null) {
      //this.setState({otherCompetitors:false});
      if (document.getElementById("otherResearchVendors").value.length >= 1) {
        //console.log(this.state.otherCompetitorsSelected);
        let list = [...this.state.otherResearchVendorsSelected];
        list.push({
          name: document.getElementById("otherResearchVendors").value,
          isActive: true,
        });
        this.setState({ otherResearchVendorsSelected: list });
        DocMetaData.researchVendorsOthers = list.map((x) => x.name).join(",");
        this.setState({ DocData: DocMetaData, list });
        document.getElementById("otherResearchVendors").value = "";
      }
    }
  }
  Add_Partners() {
    let DocMetaData = this.state.DocData;
    //const DocMetaData = this.state.DocMetaData;
    if (document.getElementById("otherPartners") != null) {
      //this.setState({otherCompetitors:false});
      if (document.getElementById("otherPartners").value.length >= 1) {
        //console.log(this.state.otherCompetitorsSelected);
        let list = [...this.state.otherPartnersSelected];
        list.push({
          name: document.getElementById("otherPartners").value,
          isActive: true,
        });
        this.setState({ otherPartnersSelected: list });
        DocMetaData.partnersOthers = list.map((x) => x.name).join(",");
        this.setState({ DocData: DocMetaData, list });
        document.getElementById("otherPartners").value = "";
      }
    }
  }

  handleChange_ServiceType(SelectedList, SelectedOne) {
    const DocData = this.state.DocData;
    DocData.serviceType = SelectedList.map((x) => x.name).join(",");
    var serviceTypeSelected = this.props.MasterData.serviceTypes.filter((x) =>
      SelectedList.includes(x)
    );
    this.setState({ DocData, serviceTypeSelected });
  }
  handleChange_Audiance = (SelectedList, SelectedOne) => {
    const DocData = this.state.DocData;
    DocData.recommendedBy = SelectedList.map((x) => x.name).join(",");
    var audianceSelected = GetAudiance().filter((x) =>
      SelectedList.includes(x)
    );
    this.setState({ DocData, audianceSelected });
  };

  handleRemove_Audiance = (SelectedList, removedItem) => {
    const DocData = this.state.DocData;
    DocData.recommendedBy = SelectedList.map((x) => x.name).join(",");
    var audianceSelected = GetAudiance().filter((x) =>
      SelectedList.includes(x)
    );
    this.setState({ DocData, audianceSelected });
  };
  handleRemove_ServiceType = (SelectedList, removeItem) => {
    const DocData = this.state.DocData;
    DocData.serviceType = SelectedList.map((x) => x.name).join(",");
    var serviceTypeSelected = this.props.MasterData.serviceTypes.filter((x) =>
      SelectedList.includes(x)
    );
    this.setState({ DocData, serviceTypeSelected });
  };

  handleRemove_Competitors = (SelectedList, removedItem) => {
    this.setState({
      otherCompetitors:
        SelectedList.filter((x) => x.name == "Others").length > 0,
    });
    this.state.DocData.competitorsOthers = "";
    const DocData = this.state.DocData;
    DocData.competitors = SelectedList.map((x) => x.name).join(",");
    var competitorsSelected = this.props.MasterData.competitors.filter((x) =>
      SelectedList.includes(x)
    );
    this.setState({ DocData, competitorsSelected });
  };
  handleRemove_CompetitorsOthers(SelectedList, removedItem) {
    const DocMetaData = this.state.DocData;
    var selectedList = SelectedList.map((x) => x.name).join(",");
    DocMetaData.competitorsOthers = SelectedList.map((x) => x.name).join(",");
    this.setState({ DocData: DocMetaData, selectedList });
    this.setState({ otherCompetitorsSelected: SelectedList });
  }
  handleRemove_ResearchVendorsOthers(SelectedList, removedItem) {
    const DocMetaData = this.state.DocData;
    var selectedList = SelectedList.map((x) => x.name).join(",");
    DocMetaData.researchVendorsOthers = SelectedList.map((x) => x.name).join(
      ","
    );
    this.setState({ DocData: DocMetaData, selectedList });
    this.setState({ otherResearchVendorsSelected: SelectedList });
  }
  handleRemove_PartnersOthers(SelectedList, removedItem) {
    const DocMetaData = this.state.DocData;
    var selectedList = SelectedList.map((x) => x.name).join(",");
    DocMetaData.partnersOthers = SelectedList.map((x) => x.name).join(",");
    this.setState({ DocData: DocMetaData, selectedList });
    this.setState({ otherPartnersSelected: SelectedList });
  }

  handleChange_Vendors(SelectedList, SelectedOne) {
    this.setState({
      otherResearchVendors:
        SelectedList.filter((x) => x.name == "Others").length > 0,
    });
    const DocData = this.state.DocData;
    DocData.researchVendors = SelectedList.map((x) => x.name).join(",");
    var researchVendorsSelected = this.props.MasterData.researchVendors.filter(
      (x) => SelectedList.includes(x)
    );
    this.setState({ DocData, researchVendorsSelected });
  }
  handleRemove_Vendors = (SelectedList, removedItem) => {
    this.setState({
      otherResearchVendors:
        SelectedList.filter((x) => x.name == "Others").length > 0,
    });
    this.state.DocData.researchVendorsOthers = "";
    const DocData = this.state.DocData;
    DocData.researchVendors = SelectedList.map((x) => x.name).join(",");
    var researchVendorsSelected = this.props.MasterData.researchVendors.filter(
      (x) => SelectedList.includes(x)
    );
    this.setState({ DocData, researchVendorsSelected });
  };

  handleChange_Partners(SelectedList, SelectedOne) {
    this.setState({
      otherPartners: SelectedList.filter((x) => x.name == "Others").length > 0,
    });
    const DocData = this.state.DocData;
    DocData.partners = SelectedList.map((x) => x.name).join(",");
    var partnersSelected = this.props.MasterData.partners.filter((x) =>
      SelectedList.includes(x)
    );
    this.setState({ DocData, partnersSelected });
  }
  handleRemove_Partners = (SelectedList, removedItem) => {
    this.setState({
      otherPartners: SelectedList.filter((x) => x.name == "Others").length > 0,
    });
    this.state.DocData.partnersOthers = "";
    const DocData = this.state.DocData;
    DocData.partners = SelectedList.map((x) => x.name).join(",");
    var partnersSelected = this.props.MasterData.partners.filter((x) =>
      SelectedList.includes(x)
    );
    this.setState({ DocData, partnersSelected });
  };
  handleChange_Disclosure(event) {
    const DocData = this.state.DocData;
    DocData.disclosure = event.target.value;
    this.setState({ DocData: DocData });
  }
  handleChange_Industry_Segment(event) {
    const DocData = this.state.DocData;
    DocData.industrySegment = event.target.value;
    this.setState({ DocData: DocData });
  }
  handleChange_Industry_Vertical(event) {
    const DocData = this.state.DocData;
    DocData.industryVertical = event.target.value;
    this.setState({ DocData: DocData });
  }
  setStartDate(date) {
    const DocData = this.state.DocData;
    DocData.plannedShelfLife = date;
    this.setState({ DocData: DocData });
  }
  handleSelectedDate = (event) => {
    if (event.target.value != "Custom") {
      const plannedShelfLife = new Date(
        new Date().getFullYear() + parseInt(event.target.value),
        new Date().getMonth(),
        new Date().getDate()
      );
      const DocData = this.state.DocData;
      DocData.plannedShelfLife = plannedShelfLife;
      DocData.selectedPlannedShelfLife = event.target.value;
      this.setState({
        SelectedDateOption: event.target.value,
        DocData: DocData,
      });
    } else {
      const DocData = this.state.DocData;
      DocData.selectedPlannedShelfLife = event.target.value;
      this.setState({
        SelectedDateOption: event.target.value,
        DocData: DocData,
      });
    }
  };
  handleChange_Country(event) {
    const DocData = this.state.DocData;
    DocData.country = event.target.value;
    this.setState({ DocData: DocData });
  }
  handleChange_Language(event) {
    const DocData = this.state.DocData;
    DocData.language = event.target.value;
    this.setState({ DocData: DocData });
  }
  handleChange_KeyWords(event) {
    const DocData = this.state.DocData;
    DocData.keywords = event.target.value;
    this.setState({ DocData: DocData });
  }
  handleChange_Notes(event) {
    const DocData = this.state.DocData;
    DocData.notes = event.target.value;
    this.setState({ DocData: DocData });
  }
  handleChange_initiative_Other(event) {
    const DocData = this.state.DocData;
    DocData.initiativeIfOthers = event.target.value;
    this.setState({ DocData: DocData });
  }
  formatDate(plannedShelfLife) {
    if (typeof plannedShelfLife === "object") {
      return plannedShelfLife;
    }
    if (plannedShelfLife === "" || plannedShelfLife === undefined) {
      return new Date(
        new Date().getFullYear() + 1,
        new Date().getMonth(),
        new Date().getDate()
      );
    }
    var dt = plannedShelfLife.split("T");
    var year = dt[0].split("-")[0];
    var month = dt[0].split("-")[1];
    var day = dt[0].split("-")[2];
    return new Date(year, month - 1, day);
  }
  EmailSent = () => {};
  SendSecondaryMailReminder = () => {
    this.refs.btnReminder.setAttribute("disabled", "disabled");
    axios
      .get(
        URLConfig.GetContributionMail_URL() +
          "?DocumentId=" +
          this.state.DocData.docId
      )
      .then((res) => {
        if (res.data) {
          //this.refs.btnReminder.removeAttribute("disabled");
          toast.info("Mail notification sent!!", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      });
  };
  ReadableDate = (date) => {
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
  ClosePopUp() {
    for (
      var i = 0;
      i < document.getElementsByClassName("close-btn").length;
      i++
    ) {
      document.getElementsByClassName("close-btn")[i].click();
    }
  }
  getSelectedCountryCode(countryCode) {
    //fetching selected countries countryCode
    if (this.state.exclusiveFor == "") this.state.exclusiveFor = countryCode;
    else this.state.exclusiveFor = this.state.exclusiveFor + "," + countryCode;
  }
  updateExclusiveFor() {
    this.state.exclusiveFor = "";
    let data = this.state.geoRegionData;
    data.regions.map(
      (r) =>
        r.isChecked &&
        r.clusters.map(
          (c) =>
            c.isChecked &&
            c.countries.map((cc) => {
              cc.isChecked == true &&
                this.getSelectedCountryCode(cc.countryCode);
            })
        )
    );
  }
  ValidateOppID = () => {
    const URL =
      "https://hpedelta.com:5003/services/data/v38.0/sobjects/query2?q=select%20Id,Account.Account_ST_ID__c,Account.Account_ST_Name__c,Account.Name,Opportunity_Name__c,Name%20from%20Opportunity%20where%20Opportunity_ID__c%20=%20%27" +
      this.state.OppId +
      "%27";
    const config = URLConfig.ApplyAuth(URL);
    axios(config)
      .then((res) => {
        var client = res.data.response[0].Account_Account_ST_Name__c;
        var projectName = res.data.response[0].Name;
        const DocData = this.state.DocData;
        DocData.projectName = projectName;
        DocData.client = client;
        this.setState({ DocData: DocData, validOppID: true });
      })
      .catch((errors) => {
        this.setState({ validOppID: false });
      });
  };
  SaveData() {
    if (this.state.DocData.competitors.includes("Others")) {
      if (
        this.state.DocData.competitorsOthers == undefined ||
        this.state.DocData.competitorsOthers == ""
      ) {
        toast.error("Competitors Covered (Others) is a Mandatory Field", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    }
    if (this.state.DocData.researchVendors.includes("Others")) {
      if (
        this.state.DocData.researchVendorsOthers == undefined ||
        this.state.DocData.researchVendorsOthers == ""
      ) {
        toast.error("Research Vendors (Others) is a Mandatory Field", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    }
    if (this.state.DocData.partners.includes("Others")) {
      if (
        this.state.DocData.partnersOthers == undefined ||
        this.state.DocData.partnersOthers == ""
      ) {
        toast.error("Partners or SI (Others) is a Mandatory Field", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    }
    //Close PopUp
    const { onSave } = this.props;
    debugger;
    //let docDataCopy = { ...this.state.DocData };
    //docDataCopy.exclusiveFor = this.state.exclusiveFor;
    // docDataCopy.name = this.state.DocName;
    //docDataCopy.modifiedBy = Cookies.get("mail");
    //this.setState({ DocData: docDataCopy }, () => onSave(this.state.DocData));
    this.updateExclusiveFor();
    this.state.DocData.exclusiveFor = this.state.exclusiveFor;
    this.state.DocData.modifiedBy = Cookies.get("mail");
    if (this.state.DocType == 1) {
      if (
        this.state.OppId === null ||
        this.state.OppId === "" ||
        !this.state.validOppID
      ) {
        toast.error("Enter valid Opportunity ID / Project ID", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
      var DocData = this.state.DocData;
      DocData.oppId = this.state.OppId;
      DocData.capsule = this.state.DocType;
      this.setState({ DocData: DocData });
    } else {
      var DocData = this.state.DocData;
      DocData.oppId = "";
      DocData.capsule = this.state.DocType;
      this.setState({ DocData: DocData });
    }

    if (this.state.DocData.nda === true) {
      if (
        this.state.DocData.ndamailsRaw === "" ||
        this.state.DocData.ndamailsRaw === null
      ) {
        toast.error("Access Restricted to Can't be Empty", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    }
    onSave(this.state.DocData);
    for (
      var i = 0;
      i < document.getElementsByClassName("close-btn").length;
      i++
    ) {
      document.getElementsByClassName("close-btn")[i].click();
    }
    toast.success("Updated successfully", {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
  HandleBusiness(event) {
    this.setState({ SKUKey: event.target.value });
  }
  handleChange_initiative(event) {
    const DocData = this.state.DocData;
    DocData.initiativeName = event.target.value;
    this.setState({ DocData: DocData });
  }
  onSKUKeyUp(e) {
    if (e.keyCode === 13) {
      const Business = this.props.MasterData.businesses;
      var BusinessName = Business.filter(
        (x) =>
          this.state.SKUKey.replace(/ /g, "").split(",").indexOf(x.sku) != -1
      )
        .map((x) => x.businessName)
        .join(", ");
      var DocData = this.state.DocData;
      DocData.business = BusinessName;
      this.setState({ DocData: DocData });
    }
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
    //this.setState({ geoRegionData: transformedObject });
  };
  handleSelectedValidUpto = (event) => {
    var SelectedValidUpto = event.target.value;
    const DocData = this.state.DocData;
    DocData.ndaUptoDt =
      SelectedValidUpto === "NoExpiry"
        ? null
        : new Date(
            new Date().getFullYear() + 1,
            new Date().getMonth(),
            new Date().getDate()
          );
    this.setState({ DocData: DocData });
  };
  setValidUptoDate = (date) => {
    const DocData = this.state.DocData;
    DocData.ndaUptoDt = date;
    this.setState({ DocData: DocData });
  };
  handleBlur_NDAMails = (event) => {
    var ValidMail = this.validateEmail(event.target.value.split(";"));
    this.setState({ ValidMail });
  };
  handleChange_NDAMails = (event) => {
    const DocData = this.state.DocData;
    DocData.ndamailsRaw = event.target.value;
    if (!this.state.ValidMail) {
      const ValidMail = this.validateEmail(event.target.value.split(";"));
      this.setState({ DocData: DocData, ValidMail });
    } else {
      this.setState({ DocData: DocData });
    }
  };
  handleChange_Gold = (event) => {
    const DocData = this.state.DocData;
    DocData.isGoldCollateral = event.target.value === "true" ? true : false;
    this.setState({ DocData: DocData });
  };

  handleChange_PrimaryOwnerMails = (event) => {
    const DocData = this.state.DocData;
    DocData.primaryOwnerMailsRaw = event.target.value;
    if (!this.state.ValidPrimaryMail) {
      const ValidPrimaryOwnerMail = this.validateEmail(
        event.target.value.split(";")
      );
      this.setState({ DocData, ValidPrimaryOwnerMail });
    } else {
      this.setState({ DocData });
    }
  };
  handleBlur_PrimaryOwnerMails = (event) => {
    var ValidPrimaryMail = this.validateEmail(event.target.value.split(";"));
    this.setState({ ValidPrimaryMail });
  };
  handleBlur_SecondaryOwnerMails = (event) => {
    if (
      this.state.DocData.primaryOwnerMailsRaw !== null ||
      this.state.DocData.primaryOwnerMailsRaw !== "" ||
      this.state.ValidPrimaryMail === true
    ) {
      var ValidSecondaryMail = this.validateEmail(
        event.target.value.split(";")
      );
      this.setState({ ValidSecondaryMail });
    }
  };
  handleChange_SecondaryOwnerMails = (event) => {
    //checking primary approver is not empty and valid
    if (
      this.state.DocData.primaryOwnerMailsRaw === null ||
      this.state.DocData.primaryOwnerMailsRaw === "" ||
      this.state.ValidPrimaryMail === false
    ) {
      toast.error("Please Enter a Valid Primary Approver and Continue", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      this.primaryRef.current.focus();
    }
    //checking secondary approver isn't same as primary
    else if (this.state.DocData.primaryOwnerMailsRaw === event.target.value) {
      toast.error(
        "Duplicate email address!! Please re-validate approver's list.",
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } else {
      const DocData = this.state.DocData;
      DocData.secondaryOwnerMailsRaw = event.target.value;
      if (!this.state.ValidSecondaryMail) {
        const ValidSecondaryOwnerMail = this.validateEmail(
          event.target.value.split(";")
        );
        this.setState({ DocData, ValidSecondaryOwnerMail });
      } else {
        this.setState({ DocData });
      }
    }
  };
  validateEmail = (emails) => {
    var re =
      /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@hpe\.com$/;
    for (var i = 0; i < emails.length; i++) {
      if (!re.test(emails[i].trim())) {
        return false;
      }
    }
    return true;
  };
  createUI() {
    return this.state.approvers.map((el, i) => (
      <div key={i}>
        <input
          type="text"
          value={el.approver || ""}
          onChange={this.handleChange.bind(this, i)}
        />
        <input
          type="button"
          value="remove"
          onClick={this.removeClick.bind(this, i)}
        />
      </div>
    ));
  }
  addClick() {
    this.setState((prevState) => ({
      approvers: [...prevState.approvers, { approver: null }],
    }));
  }
  // addApproverDetailsClick() {
  //   this.setState({
  //     showapproverdetails: true,
  //   });
  // }
  removeClick(i) {
    let approvers = [...this.state.approvers];
    approvers.splice(i, 1);
    this.setState({ approvers });
  }
  addLastLevelApproverClick = () => {
    // checking whether the additional approver contact is added before adding a valid primary
    if (
      this.state.DocData.primaryOwnerMailsRaw === null ||
      this.state.DocData.primaryOwnerMailsRaw === "" ||
      this.state.ValidPrimaryMail === false
    ) {
      toast.error("Please Enter a Valid Primary Approver and Continue", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else if (
      this.state.DocData.secondaryOwnerMailsRaw &&
      this.state.ValidSecondaryMail === false
    ) {
      toast.error("Please Enter a Valid Secondary Approver and Continue", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      this.setState((prevState) => ({
        lastLevelApproverData: [
          ...prevState.lastLevelApproverData,
          { approverContact: "", approverRole: "" },
        ],
      }));
    }
  };

  handleLastLevelApproverChange = (e, i) => {
    const DocData = this.state.DocData;
    const { name, value } = e.target;
    let lastLevelApproverData = [...this.state.lastLevelApproverData];
    lastLevelApproverData[i] = { ...lastLevelApproverData[i], [name]: value };
    DocData.lastLevelApproverData = lastLevelApproverData;

    this.setState({ DocData, lastLevelApproverData });
  };
  removeLastLevelApproverClick = (i) => {
    // let lastLevelApproverData = [...this.state.lastLevelApproverData];
    // lastLevelApproverData.splice(i, 1);
    this.setState((prevState) => {
      const lastLevelApproverData = prevState.lastLevelApproverData;
      lastLevelApproverData.splice(i, 1);
      return { lastLevelApproverData };
    });
  };
  handleShowApproverDetails = (i) => {
    if (i === 0 && this.state.lastLevelApproverData.length === 0) {
      this.setState({
        showapproverdetails: false,
        lastLevelApproverData: [{ approverContact: "", approverRole: "" }],
      });
    }
  };
  handleApproverContact = (event) => {
    if (this.state.DocData.primaryOwnerMailsRaw === event.target.value) {
      toast.error(
        "Duplicate email address!! Please re-validate approver's list.",
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
    if (
      this.state.DocData.secondaryOwnerMailsRaw &&
      this.state.DocData.secondaryOwnerMailsRaw === event.target.value
    ) {
      toast.error(
        "Duplicate email address!! Please re-validate approver's list.",
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } else {
      var ValidApproverMail = this.validateEmail(event.target.value.split(";"));
      this.setState({ ValidApproverMail });
    }
  };
  showElapsedTime = (emailSendDate) => {
    // return emailSendDate;
    if (emailSendDate != null || emailSendDate != undefined) {
      return this.findDaysDiffrent(emailSendDate);
    } else {
      return "Last sent: Never";
    }
  };
  timeSince = (date) => {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  };
  findDaysDiffrent = (fromDate) => {
    let CreatedDate = new Date(fromDate);
    let today = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    );

    let requiredDiffrentDays;

    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((CreatedDate - today) / oneDay));

    if (diffDays >= 360) {
      requiredDiffrentDays =
        Math.floor(diffDays / 360) == 1
          ? `${Math.floor(diffDays / 365)} year ago`
          : `${Math.floor(diffDays / 365)} years ago`;
    } else if (diffDays >= 30) {
      requiredDiffrentDays =
        Math.floor(diffDays / 30) == 1
          ? `${Math.floor(diffDays / 30)} month ago`
          : `${Math.floor(diffDays / 30)} months ago`;
    } else if (diffDays < 30) {
      if (diffDays == 0) {
        requiredDiffrentDays = "today";
      } else if (diffDays == 1) {
        requiredDiffrentDays = `${diffDays} day ago`;
      } else {
        requiredDiffrentDays = `${diffDays} days ago`;
      }
      // requiredDiffrentDays =
      //   diffDays == 1 || diffDays == 0
      //     ? `${diffDays} day ago`
      //     : `${diffDays} days ago`;
    }

    return "Last sent: " + requiredDiffrentDays;
  };
  render() {
    const MasterData =
      this.props.MasterData != null ? this.props.MasterData : null;

    const displayCountry = () => {
      let countriesArrayData = [];
      var filteredRegions = this.state.geoRegionData.regions.filter(
        (r) => r.isChecked
      );
      let clusterArray = [];
      for (let i = 0; i < filteredRegions.length; i++) {
        clusterArray = clusterArray.concat(
          filteredRegions[i].clusters.filter((c) => c.isChecked)
        );
      }

      for (let j = 0; j < clusterArray.length; j++) {
        countriesArrayData.push({
          clusterName: clusterArray[j].clusterName,
          countries: clusterArray[j].countries,
        });
        countriesArrayData[j].countries = _.sortBy(
          countriesArrayData[j].countries,
          "country"
        );
      }

      return countriesArrayData.map((c) => {
        return (
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <button
                  data-toggle="collapse"
                  aria-expanded="false"
                  aria-controls="collapseOne"
                  data-target={
                    "#" +
                    c.clusterName.replace(/ /g, "").replace(/[^a-zA-Z ]/g, "")
                  }
                  className="btn btn-link p-0 essential-fontsizes collapsed"
                >
                  {c.clusterName}
                </button>
              </h5>
            </div>
            <div
              className="card-body collapse"
              aria-labelledby={c.clusterName + "heading"}
              data-parent="#accordionExample"
              aria-expanded="false"
              id={c.clusterName.replace(/ /g, "").replace(/[^a-zA-Z ]/g, "")}
            >
              <div>
                <ul
                  className="p-1 list-unstyled mb-1"
                  id={c.clusterName.replace(/ /g, "") + "list"}
                >
                  {c.countries.map((cnt) => {
                    return (
                      <li>
                        <input
                          className="form-check-input mr-1 ml-2"
                          type="checkbox"
                          checked={cnt.isChecked}
                          onChange={() => {
                            this.toggleCompanyCheckbox(c, cnt);
                          }}
                        />
                        <span
                          style={{
                            marginLeft: "25px",
                          }}
                        >
                          {cnt.country}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        );
      });
    };

    return (
      <Fragment>
        {this.state.DocData && (
          <div className="modal-body tax-modal-content">
            <div className="row col-12">
              <table
                className="table-sm col-6"
                cellSpacing="0"
                cellPadding="0"
                border="0"
              >
                <tbody>
                  <tr>
                    <td colSpan="2">
                      <h6 className="briefcase_header">Metadata</h6>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            Document Name
                          </span>
                        </div>
                        <input
                          className="form-control form-control-sm"
                          type="text"
                          onChange={this.handleChange_DocumentTitle}
                          value={
                            this.state.DocName
                              ? this.state.DocName.split(".")[0]
                              : ""
                          }
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <label
                            className="input-group-text"
                            for="inputGroupSelect01"
                          >
                            Document Type
                            <span className="asterisks ml-1">*</span>
                          </label>
                        </div>
                        <select
                          className="form-control form-control-sm"
                          onChange={(e) => {
                            this.setState(
                              {
                                DocType: e.target.value,
                                validOppID:
                                  this.state.DefaultDocType == 2 ? false : true,
                                OppId:
                                  this.state.DefaultDocType == 2
                                    ? ""
                                    : this.state.OppId,
                              },
                              () => {
                                this.state.DocType == 1 &&
                                  this.OppIDInput.current.focus();
                              }
                            );
                          }}
                          value={this.state.DocType}
                        >
                          <option disabled value="">
                            {" "}
                            -- select an option --{" "}
                          </option>
                          <option value="1">Customer Opportunity</option>
                          <option value="2">Knowledge Related</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                  {this.state.DocType == 1 && (
                    <>
                      <tr>
                        <td colSpan="2">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span
                                className="input-group-text"
                                id="basic-addon1"
                              >
                                Opportunity ID / Project ID
                              </span>
                            </div>
                            <input
                              className="form-control form-control-sm"
                              type="text"
                              value={this.state.OppId ? this.state.OppId : ""}
                              onChange={(e) => {
                                this.setState({ OppId: e.target.value });
                              }}
                              onKeyUp={(e) => {
                                if (
                                  e.target.value.length == 14 &&
                                  (e.target.value.indexOf("OPP") == 0 ||
                                    e.target.value.indexOf("OPE") == 0)
                                ) {
                                  this.ValidateOppID();
                                }
                              }}
                              ref={this.OppIDInput}
                            />
                          </div>
                        </td>
                      </tr>
                      {!this.state.validOppID && (
                        <tr>
                          <td></td>
                          <td>
                            <p
                              className="float-right red"
                              style={{ fontSize: 11 }}
                            >
                              Enter valid Opportunity ID / Project ID
                            </p>
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan="2">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span
                                className="input-group-text"
                                id="basic-addon1"
                              >
                                Client
                              </span>
                            </div>
                            <input
                              className="form-control form-control-sm"
                              type="text"
                              onChange={this.handleChange_Client}
                              value={
                                this.state.DocData
                                  ? this.state.DocData.client == null
                                    ? ""
                                    : this.state.DocData.client
                                  : ""
                              }
                              disabled
                            />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span
                                className="input-group-text"
                                id="basic-addon1"
                              >
                                Project Name
                              </span>
                            </div>
                            <input
                              className="form-control form-control-sm"
                              type="text"
                              onChange={this.handleChange_ProjectName}
                              value={
                                this.state.DocData
                                  ? this.state.DocData.projectName
                                  : ""
                              }
                              disabled
                            />
                          </div>
                        </td>
                      </tr>
                    </>
                  )}
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <label
                            className="input-group-text"
                            for="inputGroupSelect01"
                          >
                            Document Category
                          </label>
                        </div>
                        <select
                          className="form-control form-control-sm"
                          onChange={this.handleChange_DocType}
                          value={
                            this.state.DocData &&
                            this.state.DocData.documentType !== ""
                              ? this.state.DocData.documentType
                              : ""
                          }
                        >
                          <option disabled value="">
                            {" "}
                            -- select an option --{" "}
                          </option>
                          {this.state.DocType == 1 &&
                            GetRefrenceCategories().map((list, index) => (
                              <option value={list.name} key={index}>
                                {list.name}
                              </option>
                            ))}
                          {this.state.DocType != 1 &&
                            GetKnowledgeCategories().map((list, index) => (
                              <option value={list.name} key={index}>
                                {list.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <div className="input-group">
                        <span className="input-group-text">
                          Approval Required
                        </span>
                        <div className="form-check form-check-inline  ml-2">
                          {this.state.DocData.approvalRequired ? (
                            <label className="p-1 m-0">Yes</label>
                          ) : (
                            <label className="p-1 m-0">No</label>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                  {/* ----------- Approval Work Flow : AMS -------- */}
                  {this.state.DocData && this.state.DocData.approvalRequired && (
                    <>
                      <tr>
                        <td colSpan="2">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span
                                className="input-group-text"
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
                              readOnly
                              value={
                                this.state.DocData
                                  ? this.state.DocData.primaryOwnerMailsRaw
                                  : ""
                              }
                              onChange={this.handleChange_PrimaryOwnerMails}
                              onBlur={(e) =>
                                this.handleBlur_PrimaryOwnerMails(e)
                              }
                              ref={this.primaryRef}
                            ></input>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2">
                          {this.state.DocData.approvalRequired &&
                            !this.state.ValidPrimaryMail && (
                              <div className="float-right validate-red">
                                Please Enter Valid HPE Email Id for Primary
                                Owner
                              </div>
                            )}
                        </td>
                      </tr>
                      {this.state.DocData &&
                        this.state.DocData.secondaryOwnerMailsRaw &&
                        this.state.DocData.secondaryOwnerMailsRaw != "" && (
                          <Fragment>
                            <tr>
                              <td colSpan="2">
                                <div className="input-group">
                                  <div className="input-group-prepend">
                                    <span
                                      className="input-group-text"
                                      id="SecondaryOwnerLabel"
                                    >
                                      Secondary Owner
                                    </span>
                                  </div>

                                  <input
                                    className="form-control form-control-sm "
                                    type="text"
                                    readOnly
                                    placeholder="Enter valid HPE email"
                                    value={
                                      this.state.DocData
                                        ? this.state.DocData
                                            .secondaryOwnerMailsRaw
                                        : ""
                                    }
                                    onChange={
                                      this.handleChange_SecondaryOwnerMails
                                    }
                                    onBlur={(e) =>
                                      this.handleBlur_SecondaryOwnerMails(e)
                                    }
                                  />
                                </div>
                              </td>
                            </tr>
                            {this.state.deltaDocumentApprovals.filter(
                              (x) =>
                                (x.approvalRecieved == false ||
                                  x.approvalRecieved == null) &&
                                x.isPrimaryOwner == true
                            ).length > 0 &&
                              this.state.deltaDocumentApprovals.filter(
                                (x) =>
                                  (x.approvalRecieved == false ||
                                    x.approvalRecieved == null) &&
                                  x.isSecondryOwner == true
                              ).length > 0 &&
                              this.props.Status == 11 && (
                                <tr>
                                  <td colspan="2">
                                    <a className="timelapse">
                                      {this.showElapsedTime(
                                        this.state.deltaDocumentApprovals.filter(
                                          (x) => x.isSecondryOwner == true
                                        )[0]?.emailRequestDt
                                      )}
                                    </a>
                                    <button
                                      type="button"
                                      className="btn-12 btn-success btn-sm"
                                      onClick={() =>
                                        this.SendSecondaryMailReminder()
                                      }
                                      ref="btnReminder"
                                    >
                                      Send Reminder
                                    </button>
                                  </td>
                                </tr>
                              )}

                            <tr>
                              <td></td>
                              <td>
                                {this.state.DocData.approvalRequired &&
                                  this.state.DocData.secondaryOwnerMailsRaw !==
                                    "" &&
                                  !this.state.ValidSecondaryMail && (
                                    <p className="float-right validate-red">
                                      Please Enter Valid HPE Email Id for
                                      Secondary Owner
                                    </p>
                                  )}
                              </td>
                            </tr>
                          </Fragment>
                        )}
                      {this.state.lastLevelApproverData.length > 0 && (
                        <p className="ml-1 input-group-text">
                          Additional Approvers
                        </p>
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
                                      readOnly
                                      value={item.approverContact}
                                      onChange={(e) =>
                                        this.handleLastLevelApproverChange(
                                          e,
                                          idx
                                        )
                                      }
                                      onBlur={(event) =>
                                        this.handleApproverContact(event)
                                      }
                                    />

                                    <input
                                      className="form-control form-control-sm ml-2"
                                      placeholder=""
                                      name="approverRole"
                                      readOnly
                                      value={item.approverRole}
                                      onChange={(e) =>
                                        this.handleLastLevelApproverChange(
                                          e,
                                          idx
                                        )
                                      }
                                    />
                                  </div>
                                </td>
                                {/* <td>
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
                                  </td> */}
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
                    </>
                  )}
                  {/* ---------------------------- */}
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            Description
                          </span>
                        </div>
                        <textarea
                          className="form-control"
                          id="description"
                          maxLength="8000"
                          rows="2"
                          value={
                            this.state.DocData
                              ? this.state.DocData.description
                              : ""
                          }
                          onChange={this.handleChange_Desc}
                        ></textarea>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <p className="float-right">
                        {this.state.DocData &&
                        this.state.DocData.description &&
                        this.state.DocData.description.length > 0
                          ? 8000 -
                            this.state.DocData.description.length +
                            " characters left"
                          : "max 8000 characters"}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <div className="input-group">
                        <span className="input-group-text">NDA</span>
                        <div className="form-check form-check-inline  ml-2">
                          <input
                            className="pl-0"
                            type="radio"
                            name="NDADetails_1"
                            id="ndayes"
                            value="true"
                            onChange={this.handleChange_NDA}
                            checked={
                              this.state.DocData
                                ? this.state.DocData.nda
                                : false
                            }
                          />
                          <label className="pl-1 m-0">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="pl-0"
                            type="radio"
                            name="NDADetails_1"
                            id="ndano"
                            value="false"
                            onChange={this.handleChange_NDA}
                            checked={
                              this.state.DocData
                                ? !this.state.DocData.nda
                                : false
                            }
                          />
                          <label className="pl-1 m-0">No</label>
                        </div>
                      </div>
                      {this.state.datenda && (
                        <td>
                          <p className="aligntextnda validate-red">
                            NDA is Expired!
                          </p>
                        </td>
                      )}
                    </td>
                  </tr>
                  {this.state.DocData && this.state.DocData.nda && (
                    <>
                      <tr>
                        <td colSpan="2">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span
                                className="input-group-text"
                                id="basic-addon1"
                              >
                                Access Restricted to
                                <span className="asterisks ml-1">*</span>
                              </span>
                            </div>
                            <input
                              className="form-control form-control-sm"
                              id="maillist"
                              type="text"
                              placeholder="Enter valid HPE email"
                              value={
                                this.state.DocData
                                  ? this.state.DocData.ndamailsRaw
                                  : ""
                              }
                              onChange={this.handleChange_NDAMails}
                              onBlur={this.handleBlur_NDAMails}
                            ></input>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>
                          {this.state.DocData.nda && !this.state.ValidMail && (
                            <p className="float-right validate-red">
                              Please enter valid HPE Email Id
                            </p>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <label
                                className="input-group-text"
                                for="inputGroupSelect01"
                              >
                                Valid Upto
                              </label>
                            </div>
                            <select
                              className="form-control form-control-sm"
                              onChange={this.handleSelectedValidUpto}
                              value={
                                this.state.DocData &&
                                this.state.DocData.ndaUptoDt
                                  ? "Date"
                                  : "NoExpiry"
                              }
                            >
                              <option disabled value="">
                                {" "}
                                -- select an option --{" "}
                              </option>
                              <option value="Date">MM/DD/YYYY</option>
                              <option value="NoExpiry">Valid throughout</option>
                            </select>
                            {this.state.DocData.ndaUptoDt && (
                              <DatePicker
                                className="datechoose"
                                selected={
                                  this.state.DocData &&
                                  (this.state.DocData.ndaUptoDt !== null || "")
                                    ? this.formatDate(
                                        this.state.DocData.ndaUptoDt
                                      )
                                    : new Date(
                                        new Date().getFullYear() + 1,
                                        new Date().getMonth(),
                                        new Date().getDate()
                                      )
                                }
                                minDate={
                                  new Date(
                                    new Date().getFullYear(),
                                    new Date().getMonth(),
                                    new Date().getDate()
                                  )
                                }
                                showYearDropdown
                                onChange={(date) => this.setValidUptoDate(date)}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    </>
                  )}
                  <tr>
                    <td colspan="2">
                      <div className="input-group">
                        <span className="input-group-text">
                          Is Gold Collateral
                        </span>
                        <div className="form-check form-check-inline  ml-2">
                          <input
                            className="pl-0"
                            type="radio"
                            name="Gold"
                            id="goldyes"
                            value="true"
                            onChange={this.handleChange_Gold}
                            checked={
                              this.state.DocData
                                ? this.state.DocData.isGoldCollateral
                                : false
                            }
                            disabled={!this.state.isGoldCollateralEnabled}
                          />
                          <label className="pl-1 m-0">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="pl-0"
                            type="radio"
                            name="Gold"
                            id="goldno"
                            value="false"
                            onChange={this.handleChange_Gold}
                            checked={
                              this.state.DocData
                                ? !this.state.DocData.isGoldCollateral
                                : false
                            }
                            disabled={!this.state.isGoldCollateralEnabled}
                          />
                          <label className="pl-1 m-0">No</label>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <label
                            className="input-group-text"
                            for="inputGroupSelect01"
                          >
                            Disclosure
                            <span className="asterisks ml-1">*</span>
                          </label>
                        </div>
                        <select
                          className="form-control form-control-sm"
                          onChange={this.handleChange_Disclosure}
                          value={
                            this.state.DocData &&
                            this.state.DocData.disclosure !== "" &&
                            this.state.DocData.disclosure !== null
                              ? this.state.DocData.disclosure
                              : ""
                          }
                        >
                          <option disabled value="">
                            {" "}
                            -- select an option --{" "}
                          </option>
                          {MasterData !== null &&
                            MasterData.documentDisclosures &&
                            MasterData.documentDisclosures.map(
                              (list, index) => (
                                <option value={list.name} key={index}>
                                  {list.name}
                                </option>
                              )
                            )}
                        </select>
                      </div>
                    </td>
                  </tr>

                  {/* <tr>
                      <td colSpan="2">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <label
                              className="input-group-text"
                              for="inputGroupSelect01"
                            >
                              Recommended for
                            </label>
                          </div>
                          <select
                            className="form-control form-control-sm"
                            onChange={this.handleChange_RecommendedBy}
                            value={
                              this.state.DocData &&
                              this.state.DocData.recommendedBy !== "" &&
                              this.state.DocData.recommendedBy !== null
                                ? this.state.DocData.recommendedBy
                                : ""
                            }
                          >
                            <option disabled value="">
                              {" "}
                              -- select an option --{" "}
                            </option>
                            {MasterData !== null &&
                              MasterData.recommendedBy &&
                              MasterData.recommendedBy.map((list, index) => (
                                <option value={list.name} key={index}>
                                  {list.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </td>
                    </tr> */}
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend mr-30">
                          <span className="input-group-text" id="basic-addon1">
                            Exclusive For
                          </span>
                        </div>

                        {this.state.geoRegionData &&
                          this.state.geoRegionData.regions &&
                          this.state.geoRegionData.regions.map((r, index) => {
                            return (
                              <div className="form-check form-check-inline ml1-8">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={r.isChecked}
                                  onChange={() => this.toggleRegionCheckbox(r)}
                                  name="region"
                                  id="amsmain"
                                />
                                <label
                                  htmlFor="inlineCheckbox1"
                                  className="form-check-label pl-0 mr-3"
                                >
                                  {r.regionName}
                                </label>
                              </div>
                            );
                          })}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      {this.state.geoRegionData && (
                        // this.state.geoRegionData.regions &&
                        // this.state.geoRegionData.isTouched &&
                        // !this.state.areAllRegionsChecked &&
                        <div className="row pl-3">
                          <div id="cluster" className="pb-1 borderfix">
                            <div
                              className="row bborderfix pr-2 mt-1 border-bottom"
                              style={{}}
                            >
                              <div className="col-6 pl-2">
                                <strong>Clusters</strong>
                              </div>
                              <div className="col-5 p-0" align="right">
                                <input
                                  type="checkbox"
                                  checked={this.state.clusterCheckbox}
                                  id="selectall"
                                  className="form-check-input mr-1"
                                  onChange={() =>
                                    this.toggleRegionSelectAllCheckbox()
                                  }
                                />
                                Select All
                              </div>
                            </div>
                            <div className="accordion" id="accordionExample">
                              {this.state.geoRegionData.regions &&
                                this.state.geoRegionData.regions
                                  .filter((reg) => {
                                    return reg.isChecked;
                                  })
                                  .map((r, index) => {
                                    return (
                                      <div className="card" id="amscard">
                                        <div
                                          onClick={() => this.onRegionClick(r)}
                                          className="card-header regionarea"
                                          id={"heading" + index}
                                        >
                                          <h5 className="mb-0">
                                            <button
                                              type="button"
                                              data-toggle="collapse"
                                              data-target={"#collapse" + index}
                                              aria-expanded="false"
                                              aria-controls={"collapse" + index}
                                              className="btn btn-link p-0 essential-fontsizes collapsed"
                                            >
                                              {r.regionName}
                                            </button>
                                          </h5>
                                        </div>
                                        <div
                                          id={"collapse" + index}
                                          className="collapse"
                                          aria-labelledby={"heading" + index}
                                          data-parent="#accordionExample"
                                          aria-expanded="false"
                                        >
                                          <div
                                            className="card-body"
                                            id="amsclusterdiv"
                                          >
                                            <ul
                                              className="p-1 list-unstyled mb-1"
                                              id="amsclusters"
                                            >
                                              {this.state.geoRegionData.regions
                                                .filter((reg) => {
                                                  return reg.isChecked;
                                                })
                                                [index].clusters.map((c, i) => {
                                                  return (
                                                    <li
                                                      onClick={() =>
                                                        this.onClusterClick(c)
                                                      }
                                                      id={"amsli" + i}
                                                    >
                                                      <input
                                                        type="checkbox"
                                                        checked={c.isChecked}
                                                        onChange={() =>
                                                          this.toggleClusterCheckbox(
                                                            r,
                                                            c
                                                          )
                                                        }
                                                        id={"ams" + i}
                                                        className="form-check-input mr-1 ml-2"
                                                      ></input>
                                                      <span
                                                        style={{
                                                          marginLeft: "25px",
                                                        }}
                                                      >
                                                        {c.clusterName}
                                                      </span>
                                                    </li>
                                                  );
                                                })}
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                            </div>
                          </div>
                          <div id="countries" className="pb-1 borderfix">
                            <div
                              style={{ borderBottom: "1px solid #ccc" }}
                              className="row cbborderfix pr-2 mt-1 border-bottom"
                            >
                              <div className="col-6 pl-4">
                                <strong>Countries</strong>
                              </div>
                              <div className="col-5 p-0" align="right">
                                <input
                                  type="checkbox"
                                  checked={this.state.countriesAllCheckbox}
                                  id="selectall"
                                  className="form-check-input mr-1"
                                  onChange={() =>
                                    this.toggleCountriesSelectAllCheckbox()
                                  }
                                />
                                Select All
                              </div>
                            </div>
                            <div
                              className="accordion countrylist"
                              id="accordionExample"
                            >
                              {displayCountry()}
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <label
                            className="input-group-text"
                            for="inputGroupSelect01"
                          >
                            Mode of Delivery
                          </label>
                        </div>
                        <select
                          className="form-control form-control-sm"
                          onChange={this.handleChange_DelieveryMode}
                          value={
                            this.state.DocData &&
                            this.state.DocData.modeOfDelivery !== "" &&
                            this.state.DocData.modeOfDelivery !== null
                              ? this.state.DocData.modeOfDelivery
                              : ""
                          }
                        >
                          <option disabled value="">
                            {" "}
                            -- select an option --{" "}
                          </option>
                          {MasterData !== null &&
                            MasterData.deliveryModes &&
                            MasterData.deliveryModes.map((list, index) => (
                              <option value={list.name} key={index}>
                                {list.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <div className="input-group">
                        <span className="input-group-text">
                          Channel Enabled
                        </span>
                        <div className="form-check form-check-inline  ml-2">
                          <input
                            className="pl-0"
                            type="radio"
                            name="ChannelRadioDetails_1"
                            id="channelenabledyes"
                            value="true"
                            onChange={this.handleChange_ChannelEnabled}
                            checked={
                              this.state.DocData
                                ? this.state.DocData.channelEnabled
                                : false
                            }
                          />
                          <label className="p-1 m-0">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="pl-0"
                            type="radio"
                            name="ChannelRadioDetails_1"
                            id="channelenabledno"
                            value="false"
                            onChange={this.handleChange_ChannelEnabled}
                            checked={
                              this.state.DocData
                                ? !this.state.DocData.channelEnabled
                                : false
                            }
                          />
                          <label className="p-1 m-0">No</label>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <div className="input-group">
                        <span className="input-group-text">
                          If Aligned to Initiative
                        </span>
                        <div className="form-check form-check-inline  ml-2">
                          <input
                            className="pl-0"
                            type="radio"
                            name="initiativeRadioDetails_1"
                            id="initiativeyes"
                            value="true"
                            onChange={this.handleChange_IsInitiative}
                            checked={
                              this.state.DocData
                                ? this.state.DocData.alignedToInitiative
                                : false
                            }
                          />
                          <label className="p-1 m-0">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="pl-0"
                            type="radio"
                            name="initiativeRadioDetails_1"
                            id="initiativeno"
                            value="false"
                            onChange={this.handleChange_IsInitiative}
                            checked={
                              this.state.DocData
                                ? !this.state.DocData.alignedToInitiative
                                : false
                            }
                          />
                          <label className="p-1 m-0">No</label>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {this.state.DocData &&
                    this.state.DocData.alignedToInitiative && (
                      <tr>
                        <td colSpan="2">
                          <select
                            className="form-control form-control-sm"
                            onChange={this.handleChange_initiative}
                            value={
                              this.state.DocData &&
                              this.state.DocData.initiativeName !== ""
                                ? this.state.DocData.initiativeName
                                : ""
                            }
                          >
                            <option disabled value="">
                              {" "}
                              -- select an option --{" "}
                            </option>
                            {MasterData !== null &&
                              MasterData.initiatives &&
                              MasterData.initiatives.map((list, index) => (
                                <option value={list.name} key={index}>
                                  {list.name}
                                </option>
                              ))}
                          </select>
                        </td>
                      </tr>
                    )}
                  {this.state.DocData &&
                    this.state.DocData.alignedToInitiative &&
                    this.state.DocData.initiativeName === "Others" && (
                      <tr>
                        <td colSpan="2">
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            onChange={this.handleChange_initiative_Other}
                            value={
                              this.state.DocData
                                ? this.state.DocData.initiativeIfOthers
                                : ""
                            }
                          />
                        </td>
                      </tr>
                    )}

                  <tr>
                    <td colspan="2">
                      <div className="input-group">
                        <span className="input-group-text">HPE Greenlake</span>
                        <div className="form-check form-check-inline  ml-2">
                          <input
                            className="pl-0"
                            type="radio"
                            name="greenlakeRadioDetails_1"
                            id="greenlakeyes"
                            value="true"
                            onChange={this.handleChange_Greenlake}
                            checked={
                              this.state.DocData
                                ? this.state.DocData.hpeGreenLake
                                : false
                            }
                          />
                          <label className="p-1 m-0">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="pl-0"
                            type="radio"
                            name="greenlakeRadioDetails_1"
                            id="greenlakeno"
                            value="false"
                            onChange={this.handleChange_Greenlake}
                            checked={
                              this.state.DocData
                                ? !this.state.DocData.hpeGreenLake
                                : false
                            }
                          />
                          <label className="p-1 m-0">No</label>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <label
                            className="input-group-text"
                            for="inputGroupSelect01"
                          >
                            Service Type
                          </label>
                        </div>
                        <div className="multiselector">
                          {MasterData !== null && MasterData.serviceTypes && (
                            <Multiselect
                              showCheckbox="true"
                              avoidHighlightFirstOption="true"
                              options={MasterData.serviceTypes} // Options to display in the dropdown
                              selectedValues={this.state.serviceTypeSelected} // Preselected value to persist in dropdown
                              displayValue="name" // Property name to display in the dropdown options
                              onSelect={this.handleChange_ServiceType}
                              onRemove={this.handleRemove_ServiceType}
                            />
                          )}
                        </div>

                        {/* <select
                          className="form-control form-control-sm"
                          onChange={this.handleChange_ServiceType}
                          value={
                            this.state.DocData &&
                            this.state.DocData.serviceType !== "" &&
                            this.state.DocData.serviceType !== null
                              ? this.state.DocData.serviceType
                              : ""
                          }
                        >
                          <option disabled value="">
                            {" "}
                            -- select an option --{" "}
                          </option>
                          {MasterData !== null &&
                            MasterData.serviceTypes &&
                            MasterData.serviceTypes.map((list, index) => (
                              <option value={list.name} key={index}>
                                {list.name}
                              </option>
                            ))}
                        </select> */}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            Business / Product
                          </span>
                        </div>
                        <input
                          placeholder="Enter SKU"
                          type="text"
                          className="form-control form-control-sm"
                          value={this.state.SKUKey}
                          onKeyUp={this.onSKUKeyUp}
                          onChange={this.HandleBusiness}
                        ></input>
                      </div>
                    </td>
                  </tr>
                  {this.state.DocData.business !== "" && (
                    <tr>
                      <td></td>
                      <td>
                        <label>{this.state.DocData.business}</label>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <label
                            className="input-group-text"
                            for="inputGroupSelect01"
                          >
                            Competitors Covered
                          </label>
                        </div>
                        <div className="multiselector">
                          {MasterData !== null && MasterData.competitors && (
                            <Multiselect
                              showCheckbox="true"
                              avoidHighlightFirstOption="true"
                              options={MasterData.competitors} // Options to display in the dropdown
                              selectedValues={this.state.competitorsSelected} // Preselected value to persist in dropdown
                              displayValue="name" // Property name to display in the dropdown options
                              onSelect={this.handleChange_Competitors}
                              onRemove={this.handleRemove_Competitors}
                            />
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                  {/* SPID --> 969 */}
                  {this.state.otherCompetitors == true && (
                    <tr>
                      <td colspan="2" className="input-td">
                        <div className="input-group">
                          <div>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="otherCompetitors"
                              placeholder="Enter Others "
                            />
                            {/* <button className="btn btn-success btn-sm" onClick={this.Add_Competitors}>Add</button> */}
                            {/* <button className="btn btn-dark btn-sm" onClick={()=>this.setState({otherCompetitors:true})}>Cancel</button> */}
                          </div>
                          <div className="input-group-append">
                            <button
                              className="input-group-text input-group-text-sm"
                              for="inputGroupSelect01"
                              onClick={this.Add_Competitors}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}

                  {this.state.otherCompetitors == true && (
                    <tr>
                      <td colSpan="2">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <label
                              className="input-group-text"
                              for="inputGroupSelect01"
                            >
                              Competitors Covered (Others)
                            </label>
                          </div>
                          <div className="multiselector">
                            {MasterData !== null && MasterData.competitors && (
                              <Multiselect
                                showCheckbox="true"
                                avoidHighlightFirstOption="true"
                                options={this.state.otherCompetitorsSelected} // Options to display in the dropdown
                                selectedValues={
                                  this.state.otherCompetitorsSelected
                                } // Preselected value to persist in dropdown
                                displayValue="name" // Property name to display in the dropdown options
                                // onSelect={this.handleChange_Competitors}
                                onRemove={this.handleRemove_CompetitorsOthers}
                              />
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <label
                            className="input-group-text"
                            for="inputGroupSelect01"
                          >
                            Research Vendors
                          </label>
                        </div>
                        <div className="multiselector">
                          {MasterData !== null && MasterData.researchVendors && (
                            <Multiselect
                              showCheckbox="true"
                              avoidHighlightFirstOption="true"
                              options={MasterData.researchVendors} // Options to display in the dropdown
                              selectedValues={
                                this.state.researchVendorsSelected
                              } // Preselected value to persist in dropdown
                              displayValue="name" // Property name to display in the dropdown options
                              onSelect={this.handleChange_Vendors}
                              onRemove={this.handleRemove_Vendors}
                            />
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                  {this.state.otherResearchVendors == true && (
                    <tr>
                      <td colspan="2" className="input-td">
                        <div className="input-group">
                          <div>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="otherResearchVendors"
                              placeholder="Enter Others "
                            />
                            {/* <button className="btn btn-success btn-sm" onClick={this.Add_Competitors}>Add</button> */}
                            {/* <button className="btn btn-dark btn-sm" onClick={()=>this.setState({otherCompetitors:true})}>Cancel</button> */}
                          </div>
                          <div className="input-group-append">
                            <button
                              className="input-group-text input-group-text-sm"
                              for="inputGroupSelect01"
                              onClick={this.Add_ResearchVendors}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {this.state.otherResearchVendors == true && (
                    <tr>
                      <td colSpan="2">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <label
                              className="input-group-text"
                              for="inputGroupSelect01"
                            >
                              Research Vendors (Others)
                            </label>
                          </div>
                          <div className="multiselector">
                            {MasterData !== null && MasterData.competitors && (
                              <Multiselect
                                showCheckbox="true"
                                avoidHighlightFirstOption="true"
                                options={
                                  this.state.otherResearchVendorsSelected
                                } // Options to display in the dropdown
                                selectedValues={
                                  this.state.otherResearchVendorsSelected
                                } // Preselected value to persist in dropdown
                                displayValue="name" // Property name to display in the dropdown options
                                // onSelect={this.handleChange_Competitors}
                                onRemove={
                                  this.handleRemove_ResearchVendorsOthers
                                }
                              />
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <label
                            className="input-group-text"
                            for="inputGroupSelect01"
                          >
                            Partners or SI
                          </label>
                        </div>
                        <div className="multiselector">
                          {MasterData !== null && MasterData.partners && (
                            <Multiselect
                              showCheckbox="true"
                              avoidHighlightFirstOption="true"
                              options={MasterData.partners} // Options to display in the dropdown
                              selectedValues={this.state.partnersSelected} // Preselected value to persist in dropdown
                              displayValue="name" // Property name to display in the dropdown options
                              onSelect={this.handleChange_Partners}
                              onRemove={this.handleRemove_Partners}
                            />
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>

                  {this.state.otherPartners == true && (
                    <tr>
                      <td colspan="2" className="input-td">
                        <div className="input-group">
                          <div>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="otherPartners"
                              placeholder="Enter Others "
                            />
                            {/* <button className="btn btn-success btn-sm" onClick={this.Add_Competitors}>Add</button> */}
                            {/* <button className="btn btn-dark btn-sm" onClick={()=>this.setState({otherCompetitors:true})}>Cancel</button> */}
                          </div>
                          <div className="input-group-append">
                            <button
                              className="input-group-text input-group-text-sm"
                              for="inputGroupSelect01"
                              onClick={this.Add_Partners}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {this.state.otherPartners == true && (
                    <tr>
                      <td colSpan="2">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <label
                              className="input-group-text"
                              for="inputGroupSelect01"
                            >
                              Partners or SI (Others)
                            </label>
                          </div>
                          <div className="multiselector">
                            {MasterData !== null && MasterData.competitors && (
                              <Multiselect
                                showCheckbox="true"
                                avoidHighlightFirstOption="true"
                                options={this.state.otherPartnersSelected} // Options to display in the dropdown
                                selectedValues={
                                  this.state.otherPartnersSelected
                                } // Preselected value to persist in dropdown
                                displayValue="name" // Property name to display in the dropdown options
                                // onSelect={this.handleChange_Competitors}
                                onRemove={this.handleRemove_PartnersOthers}
                              />
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* <tr>
              <td colSpan="2">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">Industry Vertical</span>
                </div>
                <input className="form-control form-control-sm" type="text" onChange={this.handleChange_Industry_Vertical} value={this.state.DocData? this.state.DocData.industryVertical : ''} />
              </div>
              </td>
            </tr>
            
            <tr>
              <td colSpan="2">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">Industry Segment</span>
                </div>
                <input className="form-control form-control-sm" type="text" onChange={this.handleChange_Industry_Segment} value={this.state.DocData? this.state.DocData.industrySegment : ''} />
              </div>
              </td>
            </tr> */}
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="">
                            Planned Document Shelf Life
                          </span>
                        </div>
                        <select
                          className="form-control form-control-sm"
                          onChange={this.handleSelectedDate}
                          value={this.state.SelectedDateOption}
                        >
                          <option disabled value="">
                            {" "}
                            -- select an option --{" "}
                          </option>
                          <option value="1">1 Year</option>
                          <option value="2">2 Years</option>
                          <option value="3">3 Years</option>
                          <option value="Custom">Custom</option>
                        </select>
                        <DatePicker
                          disabled={this.state.SelectedDateOption != "Custom"}
                          selected={
                            this.state.DocData &&
                            (this.state.DocData.plannedShelfLife !== null || "")
                              ? this.formatDate(
                                  this.state.DocData.plannedShelfLife
                                )
                              : new Date(
                                  new Date().getFullYear() + 1,
                                  new Date().getMonth(),
                                  new Date().getDate()
                                )
                          }
                          onChange={(date) => this.setStartDate(date)}
                          minDate={
                            new Date(
                              new Date().getFullYear(),
                              new Date().getMonth(),
                              new Date().getDate()
                            )
                          }
                          showYearDropdown
                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            Country of Origin
                          </span>
                        </div>
                        <input
                          className="form-control form-control-sm"
                          type="text"
                          onChange={this.handleChange_Country}
                          value={
                            this.state.DocData ? this.state.DocData.country : ""
                          }
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <label
                            className="input-group-text"
                            for="inputGroupSelect01"
                          >
                            Language
                          </label>
                        </div>
                        <select
                          className="form-control form-control-sm"
                          onChange={this.handleChange_Language}
                          value={
                            this.state.DocData &&
                            this.state.DocData.language !== ""
                              ? this.state.DocData.language
                              : ""
                          }
                        >
                          <option disabled value="">
                            {" "}
                            -- select an option --{" "}
                          </option>
                          {getAllLanguages().map((list, index) => (
                            <option value={list.value} key={index}>
                              {list.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            Keywords
                          </span>
                        </div>
                        <textarea
                          className="form-control"
                          id="keywords"
                          rows="2"
                          maxLength="8000"
                          onChange={this.handleChange_KeyWords}
                          value={
                            this.state.DocData
                              ? this.state.DocData.keywords
                              : ""
                          }
                        ></textarea>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <p className="float-right">
                        {this.state.DocData &&
                        this.state.DocData.keywords &&
                        this.state.DocData.keywords.length > 0
                          ? 8000 -
                            this.state.DocData.keywords.length +
                            " characters left"
                          : "max 8000 characters"}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            Note to KM Team
                          </span>
                        </div>
                        <textarea
                          readOnly
                          className="form-control"
                          id="notes"
                          maxLength="8000"
                          rows="2"
                          onChange={this.handleChange_Notes}
                          value={
                            this.state.DocData ? this.state.DocData.notes : ""
                          }
                        ></textarea>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <p className="float-right">
                        {this.state.DocData &&
                        this.state.DocData.notes &&
                        this.state.DocData.notes.length > 0
                          ? 8000 -
                            this.state.DocData.notes.length +
                            " characters left"
                          : "max 8000 characters"}
                      </p>
                    </td>
                  </tr>

                  {this.state.EditMode && (
                    <tr>
                      <td className="pt-3" colSpan="2" align="center">
                        <button
                          type="button"
                          className="btn btn-dark btn-sm"
                          onClick={this.ClosePopUp}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={this.SaveData}
                        >
                          Submit
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <table
                className="table-sm col-6"
                cellSpacing="0"
                cellPadding="0"
                border="0"
              >
                <tbody style={{ position: "absolute" }}>
                  <tr>
                    <td colSpan="2">
                      <h6
                        className="briefcase_header"
                        style={{ width: "550px" }}
                      >
                        Audit
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            Created By
                          </span>
                        </div>
                        <input
                          className="form-control form-control-sm"
                          type="text"
                          readOnly
                          value={this.state.DocData.createdBy}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr></tr>
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            Creator Role
                          </span>
                        </div>
                        <input
                          className="form-control form-control-sm"
                          type="text"
                          readOnly
                          value={this.state.DocData.createdRole}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            Created On
                          </span>
                        </div>
                        <input
                          className="form-control form-control-sm"
                          type="text"
                          readOnly
                          value={this.ReadableDate(
                            this.state.DocData.createdOnDt
                          )}
                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <label
                            className="input-group-text"
                            for="inputGroupSelect01"
                          >
                            Recommended for
                            <span className="asterisks ml-1">*</span>
                          </label>
                        </div>
                        <div className="multiselector">
                          <Multiselect
                            showCheckbox="true"
                            avoidHighlightFirstOption="true"
                            options={GetAudiance()} // Options to display in the dropdown
                            selectedValues={this.state.audianceSelected} // Preselected value to persist in dropdown
                            displayValue="name" // Property name to display in the dropdown options
                            onSelect={this.handleChange_Audiance}
                            onRemove={this.handleRemove_Audiance}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            Data Source
                          </span>
                        </div>

                        <input
                          className="form-control form-control-sm"
                          type="text"
                          readOnly
                          value={this.state.DocData.dataSource}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            KSO Owner
                          </span>
                        </div>
                        <input
                          className="form-control form-control-sm"
                          type="text"
                          readOnly
                          onChange={this.handleChange_KsoOwner}
                          value={this.state.DocData.ksoOwner}
                        />
                      </div>
                    </td>
                  </tr>
                  {/* <tr>
            <td colSpan="2">
              <div className="input-group">
              <div className="input-group-prepend">
                <label className="input-group-text" for="inputGroupSelect01">Document Status</label>
              </div>
              <select  className="form-control form-control-sm" value={this.state.DocData && (this.state.DocData.recommendedBy !== '' && this.state.DocData.recommendedBy !== null)  ? this.state.DocData.recommendedBy : ''}>
                <option disabled value=''> -- select an option -- </option>
                {MasterData !== null && MasterData.documentStatus &&
                 MasterData.documentStatus.map((list,index) => 
                 <option value={list.id} key={index}>{list.label}</option>
                )}
                </select>
            </div>
            </td>
            </tr> */}

                  <tr>
                    <td colspan="2">
                      <div className="input-group">
                        <span className="input-group-text">
                          Technical Review Required
                        </span>
                        <div className="form-check form-check-inline ml-2">
                          <label className="p-1 m-0">
                            {this.state.DocData &&
                            this.state.DocData.technicalReviewRequired === true
                              ? "Yes"
                              : "No"}
                          </label>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {this.state.DocData &&
                    this.state.DocData.technicalReviewRequired === true && (
                      <Fragment>
                        <tr>
                          <td colSpan="2">
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text"
                                  id="basic-addon1"
                                >
                                  Technical Reviewer
                                </span>
                              </div>
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                readOnly
                                value={
                                  this.state.DocData.technicalReviewer &&
                                  this.state.DocData.technicalReviewer !== null
                                    ? this.state.DocData.technicalReviewer
                                    : ""
                                }
                              ></input>
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td colspan="2">
                            <div className="input-group">
                              <span className="input-group-text">
                                Technical Review Complete
                              </span>
                              <div className="form-check form-check-inline ml-2">
                                <label className="p-1 m-0">
                                  {this.state.DocData.technicalReviewComplete &&
                                  this.state.DocData.technicalReviewComplete ===
                                    true
                                    ? "Yes"
                                    : "No"}
                                </label>
                              </div>
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td colSpan="2">
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text"
                                  id="basic-addon1"
                                >
                                  Technical Review Completed On
                                </span>
                              </div>
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                readOnly
                                value={this.ReadableDate(
                                  this.state.DocData.technicalReviewCompletedDt
                                )}
                              />
                            </div>
                          </td>
                        </tr>
                      </Fragment>
                    )}
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <span className="input-group-text">
                          Quality Auditing Required
                        </span>
                        <div className="form-check form-check-inline ml-2">
                          <label className="p-1 m-0">
                            {this.props.docData.qaReviewer &&
                            this.props.docData.qaReviewer !== null
                              ? "Yes"
                              : "No"}
                          </label>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {this.props.docData.qaReviewer &&
                    this.props.docData.qaReviewer !== null && (
                      <Fragment>
                        <tr>
                          <td colSpan="2">
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text"
                                  id="basic-addon1"
                                >
                                  Quality Auditor
                                </span>
                              </div>
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                readOnly
                                value={this.props.docData.qaReviewerUid}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2">
                            <div className="input-group">
                              <span className="input-group-text">
                                Quality Audit Complete
                              </span>
                              <div className="form-check form-check-inline ml-2">
                                <label className="p-1 m-0">
                                  {this.state.DocData.qualityAuditComplete &&
                                  this.state.DocData.qualityAuditComplete ===
                                    true
                                    ? "Yes"
                                    : "No"}
                                </label>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="2">
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text"
                                  id="basic-addon1"
                                >
                                  Quality Audit Completed Date
                                </span>
                              </div>
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                readOnly
                                value={this.ReadableDate(
                                  this.props.docData.qaReviewDt
                                )}
                              />
                            </div>
                          </td>
                        </tr>
                      </Fragment>
                    )}

                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            Last Modified By
                          </span>
                        </div>
                        <input
                          className="form-control form-control-sm"
                          type="text"
                          readOnly
                          value={this.state.DocData.lastModifiedBy}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            Last Modified On
                          </span>
                        </div>
                        <input
                          className="form-control form-control-sm"
                          type="text"
                          readOnly
                          value={this.ReadableDate(
                            this.state.DocData.lastModifiedDt
                          )}
                        />
                      </div>
                    </td>
                  </tr>
                  {/* <tr>
                      <td colSpan="2">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span
                              className="input-group-text"
                              id="basic-addon1"
                            >
                              Quality Audited On
                            </span>
                          </div>
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            readOnly
                            value={this.state.DocData.reviewedOnDt}
                          />
                        </div>
                      </td>
                    </tr> */}
                  {this.state.deltaDocumentApprovals &&
                    this.state.deltaDocumentApprovals.filter(
                      (x) =>
                        x.approvalRecieved == true && x.isPrimaryOwner == true
                    ).length > 0 && (
                      <>
                        <tr>
                          <td colSpan="2">
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text"
                                  id="basic-addon1"
                                >
                                  Approved By (Primary)
                                </span>
                              </div>
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                readOnly
                                value={
                                  this.state.deltaDocumentApprovals.filter(
                                    (x) =>
                                      x.approvalRecieved == true &&
                                      x.isPrimaryOwner == true
                                  )[0].approvedBy
                                }
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="2">
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text"
                                  id="basic-addon1"
                                >
                                  Approved On
                                </span>
                              </div>
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                readOnly
                                value={this.ReadableDate(
                                  this.state.deltaDocumentApprovals.filter(
                                    (x) =>
                                      x.approvalRecieved == true &&
                                      x.isPrimaryOwner == true
                                  )[0].approvedDt
                                )}
                              />
                            </div>
                          </td>
                        </tr>
                      </>
                    )}
                  {this.state.deltaDocumentApprovals &&
                    this.state.deltaDocumentApprovals.filter(
                      (x) =>
                        x.approvalRecieved == true && x.isSecondryOwner == true
                    ).length > 0 && (
                      <>
                        <tr>
                          <td colSpan="2">
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text"
                                  id="basic-addon1"
                                >
                                  Approved By (Secondary)
                                </span>
                              </div>
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                readOnly
                                value={
                                  this.state.deltaDocumentApprovals.filter(
                                    (x) =>
                                      x.approvalRecieved == true &&
                                      x.isSecondryOwner == true
                                  )[0].approvedBy
                                }
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="2">
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text"
                                  id="basic-addon1"
                                >
                                  Approved On
                                </span>
                              </div>
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                readOnly
                                value={this.ReadableDate(
                                  this.state.deltaDocumentApprovals.filter(
                                    (x) =>
                                      x.approvalRecieved == true &&
                                      x.isSecondryOwner == true
                                  )[0].approvedDt
                                )}
                              />
                            </div>
                          </td>
                        </tr>
                      </>
                    )}
                  {this.state.deltaDocumentApprovals &&
                    this.state.deltaDocumentApprovals.filter(
                      (x) =>
                        x.approvalRecieved == true &&
                        x.isAdditionalApproval == true
                    ).length > 0 &&
                    this.state.deltaDocumentApprovals
                      .filter(
                        (x) =>
                          x.approvalRecieved == true &&
                          x.isAdditionalApproval == true
                      )
                      .map((list, index) => (
                        <>
                          <tr>
                            <td colSpan="2">
                              <div className="input-group">
                                <div className="input-group-prepend">
                                  <span
                                    className="input-group-text"
                                    id="basic-addon1"
                                  >
                                    Approved By (Additional)
                                  </span>
                                </div>
                                <input
                                  className="form-control form-control-sm"
                                  type="text"
                                  readOnly
                                  value={list.approvedBy}
                                />
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="2">
                              <div className="input-group">
                                <div className="input-group-prepend">
                                  <span
                                    className="input-group-text"
                                    id="basic-addon1"
                                  >
                                    Approved On
                                  </span>
                                </div>
                                <input
                                  className="form-control form-control-sm"
                                  type="text"
                                  readOnly
                                  value={this.ReadableDate(list.approvedDt)}
                                />
                              </div>
                            </td>
                          </tr>
                        </>
                      ))}
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            Published By
                          </span>
                        </div>
                        <input
                          className="form-control form-control-sm"
                          type="text"
                          readOnly
                          value={this.state.DocData.publishedBy}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            Published On
                          </span>
                        </div>
                        <input
                          className="form-control form-control-sm"
                          type="text"
                          readOnly
                          value={this.ReadableDate(
                            this.state.DocData.publishedDt
                          )}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            Re-Published On
                          </span>
                        </div>
                        <input
                          className="form-control form-control-sm"
                          type="text"
                          readOnly
                          value={this.ReadableDate(
                            this.state.DocData.rePublishedDt
                          )}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            Archived By
                          </span>
                        </div>
                        <input
                          className="form-control form-control-sm"
                          type="text"
                          readOnly
                          value={this.state.DocData.archivedBy}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            Archived On
                          </span>
                        </div>
                        <input
                          className="form-control form-control-sm"
                          type="text"
                          readOnly
                          value={this.ReadableDate(
                            this.state.DocData.archivedDt
                          )}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            Status Notes
                          </span>
                        </div>
                        {/* <textarea className="form-control" id="keywords" rows="2" maxlength="8000"></textarea> */}
                      </div>
                    </td>
                  </tr>
                  {this.props.docData &&
                    this.props.docData.deltaDocumentLogs.length > 0 &&
                    this.props.docData.deltaDocumentLogs.map(
                      (list, index) =>
                        list.comments != "" && (
                          <tr key={index}>
                            <td colSpan="2">
                              <div>
                                {list.userName}{" "}
                                {this.ReadableDate(list.createdDt)} :{" "}
                                {list.comments}
                              </div>
                            </td>
                          </tr>
                        )
                    )}
                  {this.props.docData &&
                    this.props.docData.deltaDocumentApprovals.length > 0 &&
                    this.props.docData.deltaDocumentApprovals.map(
                      (list, index) =>
                        list.approvedComments != null && (
                          <tr key={index}>
                            <td colSpan="2">
                              <div>
                                {list.approverUid}{" "}
                                {list.approvedDt != null
                                  ? this.ReadableDate(list.approvedDt)
                                  : this.ReadableDate(list.modifiedDt)}
                                : {list.approvedComments}
                              </div>
                            </td>
                          </tr>
                        )
                    )}
                  <tr>
                    <td colSpan="2">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            Response from KSO
                          </span>
                        </div>
                        {/* <textarea className="form-control" id="keywords" rows="2" maxlength="8000"></textarea> */}
                      </div>
                    </td>
                  </tr>
                  {this.props.docData &&
                    this.props.docData.deltaDocumentKsoFeedBack.length > 0 &&
                    this.props.docData.deltaDocumentKsoFeedBack.map(
                      (list, index) => (
                        <tr key={index}>
                          <td colSpan="2">
                            <div>
                              {list.ksoOwnerUid}{" "}
                              {this.ReadableDate(list.feedBackDt)} :{" "}
                              {list.feedBackFromKso}
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}
export default DocumentDetailsModal;
