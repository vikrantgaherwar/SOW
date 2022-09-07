import React, { Component, Fragment } from "react";
import "bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Multiselect } from "multiselect-react-dropdown";
import { getAllLanguages } from "../../../utils/Languages";
import { GetKnowledgeCategories, GetAudiance } from "../../../utils/Constants";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import _ from "lodash";
class UnTaggedModal extends Component { 
  constructor() {
    super();
    this.primaryRef = React.createRef();
    this.state = {
      OppId: "",
      startDate: new Date(),
      roleList: [],
      selectedValue: [],
      geoRegions: [],
      geoRegionData: {},
      selectedRegion: "",
      selectedCluster: "",
      DocMetaData: {},
      clusterCheckbox: true,
      countriesAllCheckbox: true,
      EditMode: false,
      lastLevelApproverData: [],
      datenda:false,
      exclusiveFor:"",
      clusterSelected:"",
      regionSelected:"",
      isGoldCollateralEnabled : false,
      otherCompetitors:false,
      otherResearchVendors:false,
      otherPartners:false,
      otherCompetitorsError:false

    };
    debugger;
    this.setStartDate = this.setStartDate.bind(this);
    this.handleChange_Client = this.handleChange_Client.bind(this);
    this.handleChange_Desc = this.handleChange_Desc.bind(this);
    this.handleChange_ProjectName = this.handleChange_ProjectName.bind(this);
    this.handleChange_DelieveryMode = this.handleChange_DelieveryMode.bind(
      this
    );
    this.handleChangeNDAMails = this.handleChange_NDAMails.bind(this);
    this.handleChange_NDA = this.handleChange_NDA.bind(this);
    this.handleChange_ChannelEnabled = this.handleChange_ChannelEnabled.bind(
      this
    );
    this.handleChange_IsInitiative = this.handleChange_IsInitiative.bind(this);
    this.handleChange_Greenlake = this.handleChange_Greenlake.bind(this);
    this.handleChange_ServiceType = this.handleChange_ServiceType.bind(this);
    this.handleChange_Competitors = this.handleChange_Competitors.bind(this);
    this.Add_Competitors=this.Add_Competitors.bind(this);
    this.Add_ResearchVendors=this.Add_ResearchVendors.bind(this);
    this.Add_Partners=this.Add_Partners.bind(this);
    this.handleRemove_CompetitorsOthers=this.handleRemove_CompetitorsOthers.bind(this);
    this.handleRemove_ResearchVendorsOthers=this.handleRemove_ResearchVendorsOthers.bind(this);
    this.handleRemove_PartnersOthers=this.handleRemove_PartnersOthers.bind(this);
    this.UpdateMasterTableOthersData=this.UpdateMasterTableOthersData.bind(this);

    this.handleChange_Vendors = this.handleChange_Vendors.bind(this);
    this.handleChange_Partners = this.handleChange_Partners.bind(this);
    this.handleChange_Disclosure = this.handleChange_Disclosure.bind(this);
    this.handleChange_Industry_Segment = this.handleChange_Industry_Segment.bind(
      this
    );
    this.handleChange_Industry_Vertical = this.handleChange_Industry_Vertical.bind(
      this
    );
    this.handleChange_Country = this.handleChange_Country.bind(this);
    this.handleChange_Language = this.handleChange_Language.bind(this);
    this.handleChange_KeyWords = this.handleChange_KeyWords.bind(this);
    this.handleChange_Notes = this.handleChange_Notes.bind(this);
    this.SaveData = this.SaveData.bind(this);
    this.updateRegionData=this.updateRegionData.bind(this);
    this.getSelectedClusterData=this.getSelectedClusterData.bind(this);
    this.updateExclusiveFor=this.updateExclusiveFor.bind(this);
    this.getSelectedCountryCode=this.getSelectedCountryCode.bind(this);
    this.HandleBusiness = this.HandleBusiness.bind(this);
    this.onSKUKeyUp = this.onSKUKeyUp.bind(this);
    this.handleChange_initiative = this.handleChange_initiative.bind(this);
    this.handleChange_DocType = this.handleChange_DocType.bind(this);
    this.handleChange_initiative_Other = this.handleChange_initiative_Other.bind(
      this
    );
    this.handleChange_RecommendedBy = this.handleChange_RecommendedBy.bind(
      this
    );
    this.handleChange_ApprovalRequired = this.handleChange_ApprovalRequired.bind(
      this
    );
    this.handleApproverSubmit = this.handleApproverSubmit.bind(this);
  }
  componentDidMount() {
    var roles = Cookies.get("roles").split(",");
    var isGoldCollateralEnabled = roles.indexOf("Admin") != -1 || 
                                  roles.indexOf("Analyst") != -1 ||
                                  roles.indexOf("Process") != -1 ||
                                  roles.indexOf("Specialist") != -1 ||
                                  roles.indexOf("Practice") != -1;
    

    if (this.props.docData?.deltaDocumentApprovals) {
      let lastLevelApproverData = [...this.state.lastLevelApproverData];
      var hasAdditionalApprovals = this.props.docData.deltaDocumentApprovals.filter(
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
    } else {
      if (this.state.DocMetaData.lastLevelApproverData != undefined) {
        this.setState({
          lastLevelApproverData: this.state.DocMetaData.lastLevelApproverData,
        });
      }
    }
    this.setState({isGoldCollateralEnabled});
    this.getValidNDAUptoDate();
    this.updateRegionData();
    this.UpdateMasterTableOthersData();
  };
  UpdateMasterTableOthersData()
  {
    debugger;
    let DocMetaData = this.state.DocMetaData;
    let otherComp=[...this.state.otherCompetitorsSelected];
    console.log(otherComp);
    DocMetaData.competitorsOthers=otherComp.map((x) => x.name).join(",");
    let otherRese=[...this.state.otherResearchVendorsSelected];
    DocMetaData.researchVendorsOthers=otherRese.map((x) => x.name).join(",");
    let otherPart=[...this.state.otherPartnersSelected];
    DocMetaData.partnersOthers=otherPart.map((x) => x.name).join(",");
    this.setState({otherCompetitors:this.state.DocMetaData.competitors.split(',').filter(x=>x=='Others')=='Others'?true:false, 
                  otherPartners:this.state.DocMetaData.partners.split(',').filter(x=>x=='Others')=='Others'?true:false,
                  otherResearchVendors:this.state.DocMetaData.researchVendors.split(',').filter(x=>x=='Others')=='Others'?true:false,
                  DocMetaData:DocMetaData});
  };
  getSelectedClusterData(country)
  {
    //clusterSelected
    if(this.state.exclusiveFor.includes(country.countryCode))
    {
      if(this.state.clusterSelected=="")
      this.state.clusterSelected=country.cluster;
    else
      this.state.clusterSelected=this.state.clusterSelected.includes(country.cluster)==false ? this.state.clusterSelected+","+country.cluster : this.state.clusterSelected;
    //regionSelected
    if(this.state.regionSelected=="")
      this.state.regionSelected=country.region;
    else
      this.state.regionSelected=this.state.regionSelected.includes(country.region)==false ? this.state.regionSelected+","+country.region : this.state.regionSelected;
    }
  }
  updateRegionData()
  {
    this.state.clusterSelected="";
    this.state.regionSelected="";
    let data = this.state.geoRegionData;
    data.regions.map((r) =>r.clusters.map((c)=>c.countries.map((cc)=> {this.getSelectedClusterData(cc)})));
    let dataUpdate = this.state.geoRegionData;
    let selectedRegion=dataUpdate.regions;
     for (let i = 0; i < selectedRegion.length; i++) 
     {
        let regionObj = selectedRegion[i];
        let clusters = regionObj.clusters;
        regionObj.clusters = clusters.map((c) => {
          let checked=false;
          if(this.state.clusterSelected.includes(c.clusterName))
          {
            c={...c};
            c.isChecked=true;
            checked=true;
          }
          else
          {
            c={...c};
            c.isChecked=false;
            checked=false;
          }
          return {
            ...c,
            isChecked: checked,
            countries: c.countries.map((cty) => {
              if(this.state.exclusiveFor.includes(cty.countryCode))
              {
                return {...cty, isChecked:true};
              }
              else
               return {...cty, isChecked: false};
            }),
          };
        });
        if(this.state.regionSelected.includes(regionObj.regionName))
          regionObj.isChecked=true;
        else 
          regionObj.isChecked=false;
      };
      this.setState({geoRegionData: dataUpdate});
  };
  static getDerivedStateFromProps(props, state) {
    if (props.docData.name !== state.DocName) {
      const SelectedDateOption =
        props.docData.deltaDocumentDetails[0]?.selectedPlannedShelfLife != ""
          ? props.docData.deltaDocumentDetails[0]?.selectedPlannedShelfLife
          : "1";
      let DocMetaData = props.docData.deltaDocumentDetails[0];
      const DocumentApprovals = props.docData.deltaDocumentApprovals;

      if (DocumentApprovals && DocMetaData.approvalRequired) {
        DocMetaData.primaryOwnerMailsRaw = DocumentApprovals.filter(
          (x) => x.isPrimaryOwner == true
        )[0]?.approverUid;
        DocMetaData.secondaryOwnerMailsRaw = DocumentApprovals.filter(
          (x) => x.isSecondryOwner == true
        )[0]?.approverUid;
        var hasAdditionalApprovals = DocumentApprovals.filter(
          (x) => x.isAdditionalApproval == true
        );
      }
      const audianceSelected = props.docData
        ? props.docData.deltaDocumentDetails[0].recommendedBy?.split(",") !==
          undefined
          ? props.docData.deltaDocumentDetails[0].recommendedBy?.split(",")
          : ""
        : "";
      return {
        DocMetaData: DocMetaData,
        DocName: props.docData.name,
        geoRegionData: props.MasterData.exclusiveFor,
        exclusiveFor:props.docData.deltaDocumentDetails[0].exclusiveFor,
        Document: props.docData,
        EditMode: props.EditMode,
        competitorsSelected: props.MasterData.competitors.filter(
          (x) =>
            props.docData.deltaDocumentDetails[0].competitors
              ?.split(",")
              .indexOf(x.name) != -1
        ),
        otherCompetitorsSelected: props.MasterDataOther.competitorsOthers.filter(a =>a.docId==props.docData.deltaDocumentDetails[0].docId || a.createdBy==props.docData.name,
          (x) =>
            props.docData.deltaDocumentDetails[0].competitorsOthers
              ?.split(",")
              .indexOf(x.name) != -1
        ),
        otherResearchVendorsSelected:props.MasterDataOther.researchVendorsOthers.filter(a =>a.docId==props.docData.deltaDocumentDetails[0].docId || a.createdBy==props.docData.name,
          (x) =>
            props.docData.deltaDocumentDetails[0].researchVendorsOthers
              ?.split(",")
              .indexOf(x.name) != -1
        ),
        serviceTypeSelected: props.MasterData.serviceTypes.filter(
          (x) =>
            props.docData.deltaDocumentDetails[0].serviceType
              ?.split(",")
              .indexOf(x.name) != -1
        ),
        researchVendorsSelected: props.MasterData.researchVendors.filter(
          (x) =>
            props.docData.deltaDocumentDetails[0].researchVendors
              ?.split(",")
              .indexOf(x.name) != -1
        ),
        partnersSelected: props.MasterData.partners.filter(
          (x) =>
            props.docData.deltaDocumentDetails[0].partners 
              ?.split(",")
              .indexOf(x.name) != -1
        ),
        otherPartnersSelected:props.MasterDataOther.partnersOthers.filter(a =>a.docId==props.docData.deltaDocumentDetails[0].docId || a.createdBy==props.docData.name,
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


  removeSecondaryOwner = () => {
    const docMetadata = this.state.DocMetaData;
    docMetadata.secondaryOwnerMailsRaw = "";
    docMetadata.lastLevelApproverData = this.state.lastLevelApproverData;
    this.setState({ DocMetaData: docMetadata });
  };

  getSelectedCountryCode(countryCode)
  {
    //fetching selected countries countryCode
    if(this.state.exclusiveFor=="")
      this.state.exclusiveFor=countryCode;
    else
      this.state.exclusiveFor=this.state.exclusiveFor+","+countryCode;
  }
  updateExclusiveFor()
  {
    this.state.exclusiveFor="";
    let data = this.state.geoRegionData;
    data.regions.map((r) =>r.isChecked && r.clusters.map((c)=>c.isChecked && c.countries.map((cc)=> {cc.isChecked==true && this.getSelectedCountryCode(cc.countryCode)}))); 
  }

  SaveData() { 
    if((this.state.DocMetaData.recommendedBy !== undefined && this.state.DocMetaData.recommendedBy == "") || 
    (this.state.DocMetaData.documentType !== undefined  && this.state.DocMetaData.documentType == "") || 
    (this.state.DocMetaData.disclosure !== undefined  && this.state.DocMetaData.disclosure == ""))
    {
      toast.error("Please Fill Required Fields",{
        position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
      })
      return;
    }
    if(this.state.DocMetaData.competitors.includes('Others'))
    {
      if(this.state.DocMetaData.competitorsOthers == undefined || this.state.DocMetaData.competitorsOthers=='')
      {
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
    if(this.state.DocMetaData.researchVendors.includes('Others'))
    {
      if(this.state.DocMetaData.researchVendorsOthers == undefined || this.state.DocMetaData.researchVendorsOthers=='')
      {
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
    if(this.state.DocMetaData.partners.includes('Others'))
    {
      if(this.state.DocMetaData.partnersOthers == undefined || this.state.DocMetaData.partnersOthers=='')
      {
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

    if(this.state.DocMetaData.nda === true)
    {
     
      if(this.state.DocMetaData.ndamailsRaw === "")
     {
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
    // Additional Approver validations
    if (this.state.DocMetaData.approvalRequired) {
      const docMetaData=this.state.DocMetaData;
      docMetaData.lastLevelApproverData=this.state.lastLevelApproverData;
      //Removing additional approver's data if approverContact is empty
      docMetaData.lastLevelApproverData.filter(x=>x.approverContact!="");
      if(docMetaData.secondaryOwnerMailsRaw=='')
        docMetaData.secondaryOwnerMailsRaw=null;
      this.setState({DocMetaData:docMetaData});
      //Validating Additional Approvers info
      if(this.state.DocMetaData.lastLevelApproverData !== undefined && this.state.DocMetaData.lastLevelApproverData.length>0){
        for (var i = 0; i <this.state.DocMetaData.lastLevelApproverData.length; i++) 
        {
          var ValidApproverMail = this.validateEmail(this.state.DocMetaData.lastLevelApproverData[i].approverContact.split(";"));
          if(ValidApproverMail == false)
          {
              this.state.ValidApproverMail=false;
              break;
          }
        }
      }
      if (
        this.state.DocMetaData.primaryOwnerMailsRaw === "" ||
        this.state.DocMetaData.primaryOwnerMailsRaw === undefined
      ) {
        toast.error("Primary Approver can't be empty", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      } else if (
        this.state.DocMetaData.primaryOwnerMailsRaw &&
        this.state.DocMetaData.secondaryOwnerMailsRaw &&
        this.state.DocMetaData.primaryOwnerMailsRaw ===
          this.state.DocMetaData.secondaryOwnerMailsRaw
      ) {
        toast.error("Primary Approver the Secondary Approver can't be same", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (
        this.state.DocMetaData.primaryOwnerMailsRaw &&
        this.state.ValidPrimaryMail === false
      ) {
        toast.error("Please Enter Valid Primary Approver", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (
        this.state.DocMetaData.secondaryOwnerMailsRaw &&
        this.state.ValidSecondaryMail === false
      ) {
        toast.error("Please Enter Valid Secondary Approver", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (
        this.state.DocMetaData.lastLevelApproverData &&
        this.state.ValidApproverMail === false
      ) {
        toast.error("Please Enter Valid Approver Contact(s)", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      } else {
        //Close PopUp
        const { onSave } = this.props;
        let Document = this.state.Document;
        Document.deltaDocumentDetails = [];
        // this.state.geoRegionData.countriesAllCheckbox=this.state.countriesAllCheckbox;
        // this.state.geoRegionData.clusterCheckbox=this.state.clusterCheckbox;
        // this.state.DocMetaData.exclusiveFor=JSON.stringify(
        //   this.state.geoRegionData
        // );
        this.updateExclusiveFor();
        this.state.DocMetaData.exclusiveFor=this.state.exclusiveFor;
        Document.deltaDocumentDetails.push(this.state.DocMetaData);
        onSave(Document);
        for (
          var i = 0;
          i < document.getElementsByClassName("close-btn").length;
          i++
        ) {
          document.getElementsByClassName("close-btn")[i].click();
        }
      }
    } else {
      //Close PopUp
      //Removing previous updated items from Additional Approvers
      this.updateExclusiveFor();
      this.state.DocMetaData.primaryOwnerMailsRaw="";
      this.state.DocMetaData.lastLevelApproverData=null;
      this.state.DocMetaData.secondaryOwnerMailsRaw="";
      this.state.DocMetaData.exclusiveFor=this.state.exclusiveFor;
      const { onSave } = this.props;
      let Document = this.state.Document;

      let DocMetaData = { ...this.state.DocMetaData };
      DocMetaData.lastModifiedBy = Cookies.get("mail");
      
      
      Document.deltaDocumentDetails = [];
      Document.deltaDocumentDetails.push(DocMetaData);
      onSave(Document);
      for (
        var i = 0;
        i < document.getElementsByClassName("close-btn").length;
        i++
      ) {
        document.getElementsByClassName("close-btn")[i].click();
      }
      
    }
    toast.success("Updated successfully", {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }
  handleChange_RecommendedBy(event) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.recommendedBy = event.target.value;
    this.setState({ DocMetaData: DocMetaData });
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
            return {...cty, isChecked:true};
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
      countries:oldCluster.countries.map((cty) => {
        return {...cty, isChecked:true};
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

  //All OnChange Events
  handleChange_Client(event) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.client = event.target.value;
    this.setState({ DocMetaData: DocMetaData });
  }
  handleChange_Desc(event) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.description = event.target.value;
    this.setState({ DocMetaData: DocMetaData });
  }
  handleChange_ProjectName(event) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.projectName = event.target.value;
    this.setState({ DocMetaData: DocMetaData });
  }
  handleChange_DocType(event) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.documentType = event.target.value;
    this.setState({ DocMetaData: DocMetaData });
  }
  handleChange_DelieveryMode(event) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.modeOfDelivery = event.target.value;
    this.setState({ DocMetaData: DocMetaData });
  }
  handleChange_NDA(event) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.nda = event.target.value === "true" ? true : false;
    this.setState({ DocMetaData: DocMetaData });
  }
  handleChange_Gold = (event) => {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.isGoldCollateral = event.target.value === "true" ? true : false;
    this.setState({ DocMetaData: DocMetaData });
  };
  handleChange_ChannelEnabled(event) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.channelEnabled = event.target.value === "true" ? true : false;
    this.setState({ DocMetaData: DocMetaData });
  }
  handleChange_IsInitiative(event) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.alignedToInitiative =
      event.target.value === "true" ? true : false;
    this.setState({ DocMetaData: DocMetaData });
  }
  handleChange_Greenlake(event) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.hpeGreenLake = event.target.value === "true" ? true : false;
    this.setState({ DocMetaData: DocMetaData });
  }
  // handleChange_ServiceType(event) {
  //   const DocMetaData = this.state.DocMetaData;
  //   DocMetaData.serviceType = event.target.value;
  //   this.setState({ DocMetaData: DocMetaData });
  // }
  handleChange_ServiceType(SelectedList, SelectedOne) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.serviceType = SelectedList.map((x) => x.name).join(",");
    var serviceTypeSelected = this.props.MasterData.serviceTypes.filter((x) =>
      SelectedList.includes(x)
    );
    this.setState({ DocMetaData: DocMetaData, serviceTypeSelected });
  }
  handleChange_Competitors(SelectedList, SelectedOne) {
    if(SelectedOne.name=='Others')
    {
      this.setState({otherCompetitors:true});
    }
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.competitors = SelectedList.map((x) => x.name).join(",");
    var competitorsSelected = this.props.MasterData.competitors.filter((x) =>
      SelectedList.includes(x)
    );
    this.setState({ DocMetaData: DocMetaData, competitorsSelected });
  }
  Add_Competitors()
  {
    let DocMetaData = this.state.DocMetaData;
    if(document.getElementById("otherCompetitors")!=null)
    {
          //this.setState({otherCompetitors:false});
         if(document.getElementById("otherCompetitors").value.length>=1)
         {
           //console.log(this.state.otherCompetitorsSelected);
           let list=[...this.state.otherCompetitorsSelected];
           list.push({name:document.getElementById("otherCompetitors").value,isActive:true});
           this.setState({otherCompetitorsSelected:list});
           DocMetaData.competitorsOthers=list.map((x) => x.name).join(",");
           this.setState({DocMetaData:DocMetaData,list});
           document.getElementById("otherCompetitors").value ="";
        }
    }    
  }
  Add_ResearchVendors()
  {
    let DocMetaData = this.state.DocMetaData;
    //const DocMetaData = this.state.DocMetaData;
    if(document.getElementById("otherResearchVendors")!=null)
    {
          //this.setState({otherCompetitors:false});
         if(document.getElementById("otherResearchVendors").value.length>=1)
         {
           //console.log(this.state.otherCompetitorsSelected);
           let list=[...this.state.otherResearchVendorsSelected];
           list.push({name:document.getElementById("otherResearchVendors").value,isActive:true});
           this.setState({otherResearchVendorsSelected:list});
           DocMetaData.researchVendorsOthers=list.map((x) => x.name).join(",");
           this.setState({DocMetaData:DocMetaData,list})
           document.getElementById("otherResearchVendors").value = "";
        }
    }   
  }
  Add_Partners()
  {
    let DocMetaData = this.state.DocMetaData;
    //const DocMetaData = this.state.DocMetaData;
    if(document.getElementById("otherPartners")!=null)
    {
          //this.setState({otherCompetitors:false});
         if(document.getElementById("otherPartners").value.length>=1)
         {
           //console.log(this.state.otherCompetitorsSelected);
           let list=[...this.state.otherPartnersSelected];
           list.push({name:document.getElementById("otherPartners").value,isActive:true});
           this.setState({otherPartnersSelected:list});
           DocMetaData.partnersOthers=list.map((x) => x.name).join(",");
           this.setState({DocMetaData:DocMetaData,list})
           document.getElementById("otherPartners").value = "";
        }
    }  
  }
  handleRemove_ServiceType = (SelectedList, removeItem) => {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.serviceType = SelectedList.map((x) => x.name).join(",");
    var serviceTypeSelected = this.props.MasterData.serviceTypes.filter((x) =>
      SelectedList.includes(x)
    );
    this.setState({ DocMetaData: DocMetaData, serviceTypeSelected });
  };
  handleRemove_Competitors = (SelectedList, removedItem) => {
    if(removedItem.name=='Others')
    {
      let list=[];
      this.setState({otherCompetitors:false,otherCompetitorsSelected:list});
      this.state.DocMetaData.competitorsOthers = "";
    }
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.competitors = SelectedList.map((x) => x.name).join(",");
    var competitorsSelected = this.props.MasterData.competitors.filter((x) =>
      SelectedList.includes(x)
    );
    this.setState({ DocMetaData: DocMetaData, competitorsSelected });
  };
  handleRemove_CompetitorsOthers(SelectedList, removedItem)
  {
    const DocMetaData = this.state.DocMetaData;
    var selectedList=SelectedList.map((x) => x.name).join(",");
    DocMetaData.competitorsOthers=SelectedList.map((x) => x.name).join(",");
    this.setState({DocMetaData:DocMetaData,selectedList});
    this.setState({otherCompetitorsSelected:SelectedList});
  };
  handleRemove_ResearchVendorsOthers(SelectedList, removedItem)
  {
    const DocMetaData = this.state.DocMetaData;
    var selectedList=SelectedList.map((x) => x.name).join(",");
    DocMetaData.researchVendorsOthers=SelectedList.map((x) => x.name).join(",");
    this.setState({DocMetaData:DocMetaData,selectedList});
    this.setState({otherResearchVendorsSelected:SelectedList});
  }
  handleRemove_PartnersOthers(SelectedList, removedItem)
  {
    const DocMetaData = this.state.DocMetaData;
    var selectedList=SelectedList.map((x) => x.name).join(",");
    DocMetaData.partnersOthers=SelectedList.map((x) => x.name).join(",");
    this.setState({DocMetaData:DocMetaData,selectedList});
    this.setState({otherPartnersSelected:SelectedList});
  }
  handleChange_Vendors(SelectedList, SelectedOne) {
    if(SelectedOne.name=='Others')
    {
      this.setState({otherResearchVendors:true});
    }
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.researchVendors = SelectedList.map((x) => x.name).join(",");
    var researchVendorsSelected = this.props.MasterData.researchVendors.filter(
      (x) => SelectedList.includes(x)
    );
    this.setState({ DocMetaData: DocMetaData, researchVendorsSelected });
  }
  handleRemove_Vendors = (SelectedList, removedItem) => {
    if(removedItem.name=='Others')
    {
      let list=[];
      this.setState({otherResearchVendors:false,otherResearchVendorsSelected:list});
      this.state.DocMetaData.researchVendorsOthers = "";
    }
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.researchVendors = SelectedList.map((x) => x.name).join(",");
    var researchVendorsSelected = this.props.MasterData.researchVendors.filter(
      (x) => SelectedList.includes(x)
    );
    this.setState({ DocMetaData: DocMetaData, researchVendorsSelected });

  };

  handleChange_Partners(SelectedList, SelectedOne) {
    if(SelectedOne.name=='Others')
    {
      this.setState({otherPartners:true});
    }

    const DocMetaData = this.state.DocMetaData;
    DocMetaData.partners = SelectedList.map((x) => x.name).join(",");
    var partnersSelected = this.props.MasterData.partners.filter((x) =>
      SelectedList.includes(x)
    );
    this.setState({ DocMetaData: DocMetaData, partnersSelected });

  }
  handleRemove_Partners = (SelectedList, removedItem) => {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.partners = SelectedList.map((x) => x.name).join(",");
    var partnersSelected = this.props.MasterData.partners.filter((x) =>
      SelectedList.includes(x)
    );
    this.setState({ DocMetaData: DocMetaData, partnersSelected });
    if(removedItem.name=='Others')
    {
      let list=[];
      this.setState({otherPartners:false,otherPartnersSelected:list});
      this.state.DocMetaData.partnersOthers="";
    }
  };

  handleChange_Disclosure(event) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.disclosure = event.target.value;
    this.setState({ DocMetaData: DocMetaData });
  }

  handleSelectedDate = (event) => {
    if (event.target.value != "Custom") {
      const plannedShelfLife = new Date(
        new Date().getFullYear() + parseInt(event.target.value),
        new Date().getMonth(),
        new Date().getDate()
      );
      const DocMetaData = this.state.DocMetaData;
      DocMetaData.plannedShelfLife = plannedShelfLife;
      DocMetaData.selectedPlannedShelfLife = event.target.value;
      this.setState({
        SelectedDateOption: event.target.value,
        DocMetaData: DocMetaData,
      });
    } else {
      const DocMetaData = this.state.DocMetaData;
      DocMetaData.selectedPlannedShelfLife = event.target.value;
      this.setState({
        SelectedDateOption: event.target.value,
        DocMetaData: DocMetaData,
      });
    }
  };

  handleChange_Industry_Segment(event) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.industrySegment = event.target.value;
    this.setState({ DocMetaData: DocMetaData });
  }
  handleChange_Industry_Vertical(event) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.industryVertical = event.target.value;
    this.setState({ DocMetaData: DocMetaData });
  }
  setStartDate(date) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.plannedShelfLife = date;
    this.setState({ DocMetaData: DocMetaData });
  }
  handleChange_Country(event) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.country = event.target.value;
    this.setState({ DocMetaData: DocMetaData });
  }
  handleChange_Language(event) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.language = event.target.value;
    this.setState({ DocMetaData: DocMetaData });
  }
  handleChange_KeyWords(event) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.keywords = event.target.value;
    this.setState({ DocMetaData: DocMetaData });
  }
  handleChange_Notes(event) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.notes = event.target.value;
    this.setState({ DocMetaData: DocMetaData });
  }
  handleChange_initiative_Other(event) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.initiativeIfOthers = event.target.value;
    this.setState({ DocMetaData: DocMetaData });
  }

  HandleBusiness(event) {
    this.setState({ SKUKey: event.target.value });
  }
  handleChange_initiative(event) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.initiativeName = event.target.value;
    this.setState({ DocMetaData: DocMetaData });
  }
  handleChange_ApprovalRequired(event) {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.approvalRequired = event.target.value === "true" ? true : false;
    this.setState({ DocMetaData: DocMetaData });
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
  ClosePopUp() {
    for (
      var i = 0;
      i < document.getElementsByClassName("close-btn").length;
      i++
    ) {
      document.getElementsByClassName("close-btn")[i].click();
    }
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
      var DocMetaData = this.state.DocMetaData;
      DocMetaData.business = BusinessName;
      this.setState({ DocMetaData: DocMetaData });
    }
  }
  handleSelectedValidUpto = (event) => {
    var SelectedValidUpto = event.target.value;
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.ndaUptoDt =
      SelectedValidUpto === "NoExpiry"
        ? null
        : new Date(
            new Date().getFullYear() + 1,
            new Date().getMonth(),
            new Date().getDate()
          );
    this.setState({ DocMetaData: DocMetaData });
  };
  setValidUptoDate = (date) => {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.ndaUptoDt = date;
    this.setState({ DocMetaData: DocMetaData });
  };
  handleBlur_NDAMails = (event) => {
    var ValidMail = this.validateEmail(event.target.value.split(";"));
    this.setState({ ValidMail });
  };
  handleChange_NDAMails = (event) => {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.ndamailsRaw = event.target.value;
    if (!this.state.ValidMail) {
      const ValidMail = this.validateEmail(event.target.value.split(";"));
      this.setState({ DocMetaData: DocMetaData, ValidMail });
    } else {
      this.setState({ DocMetaData: DocMetaData });
    }
  };
  handleChange_PrimaryOwnerMails = (event) => {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.primaryOwnerMailsRaw = event.target.value;
    if (!this.state.ValidPrimaryMail) {
      const ValidPrimaryOwnerMail = this.validateEmail(
        event.target.value.split(";")
      );
      this.setState({ DocMetaData: DocMetaData, ValidPrimaryOwnerMail });
    } else {
      this.setState({ DocMetaData: DocMetaData });
    }
  };
  handleBlur_PrimaryOwnerMails = (event) => {
    var ValidPrimaryMail = this.validateEmail(event.target.value.split(";"));
    this.setState({ ValidPrimaryMail });
  };
  handleBlur_SecondaryOwnerMails = (event) => {
    if (
      this.state.DocMetaData.primaryOwnerMailsRaw !== null ||
      this.state.DocMetaData.primaryOwnerMailsRaw !== "" ||
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
      this.state.DocMetaData.primaryOwnerMailsRaw === null ||
      this.state.DocMetaData.primaryOwnerMailsRaw === "" ||
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
    else if (
      this.state.DocMetaData.primaryOwnerMailsRaw === event.target.value
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
      const DocMetaData = this.state.DocMetaData;
      DocMetaData.secondaryOwnerMailsRaw = event.target.value;
      if (!this.state.ValidSecondaryMail) {
        const ValidSecondaryOwnerMail = this.validateEmail(
          event.target.value.split(";")
        );
        this.setState({ DocMetaData: DocMetaData, ValidSecondaryOwnerMail });
      } else {
        this.setState({ DocMetaData: DocMetaData });
      }
    }
  };
  validateEmail = (emails) => {
    var re = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@hpe\.com$/;
    for (var i = 0; i < emails.length; i++) {
      if (!re.test(emails[i].trim())) {
        return false;
      }
    }
    return true;
  };
  // Approvers
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
  // handleChange(i, event) {
  //   let approvers = [...this.state.approvers];
  //   approvers[i].approver = event.target.value;
  //   this.setState({ approvers });
  // }

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
      this.state.DocMetaData.primaryOwnerMailsRaw === null ||
      this.state.DocMetaData.primaryOwnerMailsRaw === "" ||
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
      this.state.DocMetaData.secondaryOwnerMailsRaw &&
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
    const DocMetaData = this.state.DocMetaData;
    const { name, value } = e.target;
    let lastLevelApproverData = [...this.state.lastLevelApproverData];
    lastLevelApproverData[i] = { ...lastLevelApproverData[i], [name]: value };
    DocMetaData.lastLevelApproverData = lastLevelApproverData;
    this.setState({ DocMetaData: DocMetaData, lastLevelApproverData });
  };
  removeLastLevelApproverClick = (i) => {
    // let lastLevelApproverData = [...this.state.lastLevelApproverData];
    // lastLevelApproverData.splice(i, 1);
    if (!this.state.ValidApproverMail) {
      this.setState({ ValidApproverMail: true });
    }
    this.setState((prevState) => {
      const lastLevelApproverData = prevState.lastLevelApproverData;
      lastLevelApproverData.splice(i, 1);
      const docMetadata = this.state.DocMetaData;
      docMetadata.lastLevelApproverData = lastLevelApproverData;
      this.setState({ DocMetaData: docMetadata });
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
    const DocMetaData = this.state.DocMetaData;
    var count = 0;
    if (DocMetaData.lastLevelApproverData != undefined) {
      for (var i = 0; i < DocMetaData.lastLevelApproverData.length; i++) {
        if (
          DocMetaData.lastLevelApproverData[i].approverContact ===
          event.target.value
        )
          count++;
        if (count > 1) {
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
          count = 0;
        }
      }
    }
    if (this.state.DocMetaData.primaryOwnerMailsRaw === event.target.value) {
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
      this.state.DocMetaData.secondaryOwnerMailsRaw &&
      this.state.DocMetaData.secondaryOwnerMailsRaw === event.target.value
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
  handleApproverSubmit(event) {
    alert(
      "Approver was submitted: " +
        JSON.stringify(this.state.lastLevelApproverData)
    );
    event.preventDefault();
  }
  handleChange_Audiance = (SelectedList, SelectedOne) => {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.recommendedBy = SelectedList.map((x) => x.name).join(",");
    var audianceSelected = GetAudiance().filter((x) =>
      SelectedList.includes(x)
    );
    this.setState({ DocMetaData, audianceSelected });
  };
  handleRemove_Audiance = (SelectedList, removedItem) => {
    const DocMetaData = this.state.DocMetaData;
    DocMetaData.recommendedBy = SelectedList.map((x) => x.name).join(",");
    var audianceSelected = GetAudiance().filter((x) =>
      SelectedList.includes(x)
    );
    this.setState({ DocMetaData, audianceSelected });
  };
  render() {
    const MasterData =
      this.props.MasterData != null ? this.props.MasterData : null;
    MasterData.exclusiveFor=this.state.geoRegionData;
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
        {this.state.DocMetaData && (
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
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            Document Name
                          </span>
                        </div>
                        <input
                          readOnly
                          className="form-control form-control-sm"
                          type="text"
                          value={
                            this.state.DocName
                              ? this.state.DocName.split(".")[0]
                              : ""
                          }
                        />
                      </div>
                    </td>
                  </tr>
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
                        onChange={this.handleChange_DocType}
                        value={
                          this.state.DocMetaData &&
                          this.state.DocMetaData.documentType !== ""
                            ? this.state.DocMetaData.documentType
                            : ""
                        }
                      >
                        <option disabled value="">
                          {" "}
                          -- select an option --{" "}
                        </option>
                        {GetKnowledgeCategories().map((list, index) => (
                          <option value={list.name} key={index}>
                            {list.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
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
                          rows="2"
                          maxLength="8000"
                          value={
                            this.state.DocMetaData
                              ? this.state.DocMetaData.description
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
                        {this.state.DocMetaData.description &&
                        this.state.DocMetaData.description.length > 0
                          ? 8000 -
                            this.state.DocMetaData.description.length +
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
                            name="NDA"
                            id="ndayes"
                            value="true"
                            onChange={this.handleChange_NDA}
                            checked={
                              this.state.DocMetaData
                                ? this.state.DocMetaData.nda
                                : false
                            }
                          />
                          <label className="p-1 m-0">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="pl-0"
                            type="radio"
                            name="NDA"
                            id="ndano"
                            value="false"
                            onChange={this.handleChange_NDA}
                            checked={
                              this.state.DocMetaData
                                ? !this.state.DocMetaData.nda
                                : false
                            }
                          />
                          <label className="p-1 m-0">No</label>
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
                  {this.state.DocMetaData && this.state.DocMetaData.nda && (
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
                                this.state.DocMetaData
                                  ? this.state.DocMetaData.ndamailsRaw
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
                          {this.state.DocMetaData.nda &&
                            !this.state.ValidMail && (
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
                                this.state.DocMetaData &&
                                this.state.DocMetaData.ndaUptoDt
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
                            {this.state.DocMetaData.ndaUptoDt && (
                              <DatePicker
                                className="datechoose"
                                selected={
                                  this.state.DocMetaData &&
                                  (this.state.DocMetaData.ndaUptoDt !== null ||
                                    "")
                                    ? this.formatDate(
                                        this.state.DocMetaData.ndaUptoDt
                                      )
                                    : new Date(
                                        new Date().getFullYear() + 1,
                                        new Date().getMonth(),
                                        new Date().getDate()
                                      )
                                }
                                showYearDropdown
                                onChange={(date) => this.setValidUptoDate(date)}
                                minDate={
                                  new Date(
                                    new Date().getFullYear(),
                                    new Date().getMonth(),
                                    new Date().getDate()
                                  )
                                }
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
                            id="GoldYes"
                            value="true"
                            onChange={this.handleChange_Gold}
                            checked={
                              this.state.DocMetaData
                                ? this.state.DocMetaData.isGoldCollateral
                                : false
                            }
                            disabled={!this.state.isGoldCollateralEnabled}
                          />
                          <label className="p-1 m-0">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="pl-0"
                            type="radio"
                            name="Gold"
                            id="GoldNo"
                            value="false"
                            onChange={this.handleChange_Gold}
                            checked={
                              this.state.DocMetaData
                                ? !this.state.DocMetaData.isGoldCollateral
                                : false
                            }
                            disabled={!this.state.isGoldCollateralEnabled}
                          />
                          <label className="p-1 m-0">No</label>
                        </div>
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
                            this.state.DocMetaData &&
                            this.state.DocMetaData.recommendedBy !== ""
                              ? this.state.DocMetaData.recommendedBy
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
                    <td colspan="2">
                      <div className="input-group">
                        <span className="input-group-text">
                          Channel Enabled
                        </span>
                        <div className="form-check form-check-inline  ml-2">
                          <input
                            className="pl-0"
                            type="radio"
                            name="ChannelRadio"
                            id="channelenabledyes"
                            value="true"
                            onChange={this.handleChange_ChannelEnabled}
                            checked={
                              this.state.DocMetaData
                                ? this.state.DocMetaData.channelEnabled
                                : false
                            }
                          />
                          <label className="p-1 m-0">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="pl-0"
                            type="radio"
                            name="ChannelRadio"
                            id="channelenabledno"
                            value="false"
                            onChange={this.handleChange_ChannelEnabled}
                            checked={
                              this.state.DocMetaData
                                ? !this.state.DocMetaData.channelEnabled
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
                            name="initiativeRadio"
                            id="initiativeyes"
                            value="true"
                            onChange={this.handleChange_IsInitiative}
                            checked={
                              this.state.DocMetaData
                                ? this.state.DocMetaData.alignedToInitiative
                                : false
                            }
                          />
                          <label className="p-1 m-0">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="pl-0"
                            type="radio"
                            name="initiativeRadio"
                            id="initiativeno"
                            value="false"
                            onChange={this.handleChange_IsInitiative}
                            checked={
                              this.state.DocMetaData
                                ? !this.state.DocMetaData.alignedToInitiative
                                : false
                            }
                          />
                          <label className="p-1 m-0">No</label>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {this.state.DocMetaData &&
                    this.state.DocMetaData.alignedToInitiative && (
                      <tr>
                        <td colSpan="2">
                          <select
                            className="form-control form-control-sm"
                            onChange={this.handleChange_initiative}
                            value={
                              this.state.DocMetaData &&
                              this.state.DocMetaData.initiativeName !== ""
                                ? this.state.DocMetaData.initiativeName
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
                  {this.state.DocMetaData &&
                    this.state.DocMetaData.alignedToInitiative &&
                    this.state.DocMetaData.initiativeName === "Others" && (
                      <tr>
                        <td colSpan="2">
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            onChange={this.handleChange_initiative_Other}
                            value={
                              this.state.DocMetaData
                                ? this.state.DocMetaData.initiativeIfOthers
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
                            name="greenlakeRadio"
                            id="greenlakeyes"
                            value="true"
                            onChange={this.handleChange_Greenlake}
                            checked={
                              this.state.DocMetaData
                                ? this.state.DocMetaData.hpeGreenLake
                                : false
                            }
                          />
                          <label className="p-1 m-0">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="pl-0"
                            type="radio"
                            name="greenlakeRadio"
                            id="greenlakeno"
                            value="false"
                            onChange={this.handleChange_Greenlake}
                            checked={
                              this.state.DocMetaData
                                ? !this.state.DocMetaData.hpeGreenLake
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
                  
                  {this.state.otherCompetitors==true && (
                  <tr>
                    <td colspan='2' className="input-td">
                      <div className="input-group">
                        <div>
                         <input type="text" className="form-control form-control-sm" id="otherCompetitors" placeholder="Enter Others " />
                           {/* <button className="btn btn-success btn-sm" onClick={this.Add_Competitors}>Add</button> */}
                           {/* <button className="btn btn-dark btn-sm" onClick={()=>this.setState({otherCompetitors:true})}>Cancel</button> */}
                        </div>
                        <div className="input-group-append">
                          <button
                            className="input-group-text input-group-text-sm"
                            for="inputGroupSelect01"
                            onClick={this.Add_Competitors}>
                          +
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>  
                  )}
                  {this.state.otherCompetitors==true && (
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
                              selectedValues={this.state.otherCompetitorsSelected} // Preselected value to persist in dropdown
                              displayValue="name" // Property name to display in the dropdown options
                              // onSelect={this.handleChange_Competitors}
                              onRemove={this.handleRemove_CompetitorsOthers}
                              placeholder =""
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
                  {this.state.otherResearchVendors==true && (
                  <tr>
                    <td colspan='2' className="input-td">
                      <div className="input-group">
                        <div>
                         <input type="text" className="form-control form-control-sm" id="otherResearchVendors" placeholder="Enter Others " />
                           {/* <button className="btn btn-success btn-sm" onClick={this.Add_Competitors}>Add</button> */}
                           {/* <button className="btn btn-dark btn-sm" onClick={()=>this.setState({otherCompetitors:true})}>Cancel</button> */}
                        </div>
                        <div className="input-group-append">
                          <button
                            className="input-group-text input-group-text-sm"
                            for="inputGroupSelect01"
                            onClick={this.Add_ResearchVendors}>
                          +
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>   
                  )}
                  {this.state.otherResearchVendors==true && (
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
                              options={this.state.otherResearchVendorsSelected} // Options to display in the dropdown
                              selectedValues={this.state.otherResearchVendorsSelected} // Preselected value to persist in dropdown
                              displayValue="name" // Property name to display in the dropdown options
                              // onSelect={this.handleChange_Competitors}
                              onRemove={this.handleRemove_ResearchVendorsOthers}
                              placeholder =""
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

                  {this.state.otherPartners==true && (
                  <tr>
                    <td colspan='2' className="input-td">
                      <div className="input-group">
                        <div>
                         <input type="text" className="form-control form-control-sm" id="otherPartners" placeholder="Enter Others " />
                           {/* <button className="btn btn-success btn-sm" onClick={this.Add_Competitors}>Add</button> */}
                           {/* <button className="btn btn-dark btn-sm" onClick={()=>this.setState({otherCompetitors:true})}>Cancel</button> */}
                        </div>
                        <div className="input-group-append">
                          <button
                            className="input-group-text input-group-text-sm"
                            for="inputGroupSelect01"
                            onClick={this.Add_Partners}>
                          +
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>   
                  )}
                  {this.state.otherPartners==true && (
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
                              selectedValues={this.state.otherPartnersSelected} // Preselected value to persist in dropdown
                              displayValue="name" // Property name to display in the dropdown options
                              // onSelect={this.handleChange_Competitors}
                              onRemove={this.handleRemove_PartnersOthers}
                              placeholder =""
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
                  {this.state.DocMetaData.business !== "" && (
                    <tr>
                      <td></td>
                      <td>
                        <label>{this.state.DocMetaData.business}</label>
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
                            Disclosure
                            <span className="asterisks ml-1">*</span>
                          </label>
                        </div>
                        <select
                          className="form-control form-control-sm"
                          onChange={this.handleChange_Disclosure}
                          value={
                            this.state.DocMetaData &&
                            this.state.DocMetaData.disclosure !== ""
                              ? this.state.DocMetaData.disclosure
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
                          className="datechoose"
                          disabled={this.state.SelectedDateOption != "Custom"}
                          selected={
                            this.state.DocMetaData &&
                            (this.state.DocMetaData.plannedShelfLife !== null ||
                              "")
                              ? this.formatDate(
                                  this.state.DocMetaData.plannedShelfLife
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
                            this.state.DocMetaData
                              ? this.state.DocMetaData.country
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
                            Language
                          </label>
                        </div>
                        <select
                          className="form-control form-control-sm"
                          onChange={this.handleChange_Language}
                          value={
                            this.state.DocMetaData &&
                            this.state.DocMetaData.language !== ""
                              ? this.state.DocMetaData.language
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
                          maxLength="8000"
                          rows="2"
                          onChange={this.handleChange_KeyWords}
                          value={
                            this.state.DocMetaData
                              ? this.state.DocMetaData.keywords
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
                        {this.state.DocMetaData.keywords &&
                        this.state.DocMetaData.keywords.length > 0
                          ? 8000 -
                            this.state.DocMetaData.keywords.length +
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
                          className="form-control"
                          id="notes"
                          rows="2"
                          maxLength="8000"
                          onChange={this.handleChange_Notes}
                          value={
                            this.state.DocMetaData
                              ? this.state.DocMetaData.notes
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
                        {this.state.DocMetaData.notes &&
                        this.state.DocMetaData.notes.length > 0
                          ? 8000 -
                            this.state.DocMetaData.notes.length +
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
                          Save
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <p className="vl"></p>
              <table
                className="table-sm col-6"
                cellSpacing="0"
                cellPadding="0"
                border="0"
              >
                <tbody style={{ position: "absolute" }}>
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
                                  className="form-check-label pl-0 mr-2"
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
                          <div id="cluster" className="col-6 pb-1 box-border">
                            <div
                              className="row pr-2 mt-1 border-bottom"
                              style={{}}
                            >
                              <div className="col-6">
                                <strong>Clusters</strong>
                              </div>
                              <div className="col-6 p-0" align="right">
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
                          <div id="countries" className="col-6 pb-1 box-border">
                            <div
                              style={{ borderBottom: "1px solid #ccc" }}
                              className="row pr-2 mt-1 border-bottom"
                            >
                              <div className="col-6">
                                <strong>Countries</strong>
                              </div>
                              <div className="col-6 p-0" align="right">
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
                    <td colspan="2">
                      <div className="input-group">
                        <span className="input-group-text">
                          Approval Required
                        </span>
                        <div className="form-check form-check-inline  ml-2">
                          <input
                            className="pl-0"
                            type="radio"
                            name="namerequireapprovalyes"
                            id="requireapprovalyes"
                            value="true"
                            onChange={this.handleChange_ApprovalRequired}
                            checked={
                              this.state.DocMetaData
                                ? this.state.DocMetaData.approvalRequired
                                : false
                            }
                          />
                          <label className="p-1 m-0">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="pl-0"
                            type="radio"
                            name="namerequireapprovalno"
                            id="requireapprovalno"
                            value="false"
                            onChange={this.handleChange_ApprovalRequired}
                            checked={
                              this.state.DocMetaData
                                ? !this.state.DocMetaData.approvalRequired
                                : false
                            }
                          />
                          <label className="p-1 m-0">No</label>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {/* ----------- Approval Work Flow : AMS -------- */}
                  {this.state.DocMetaData &&
                    this.state.DocMetaData.approvalRequired && (
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
                                  <span className="asterisks ml-1">*</span>
                                </span>
                              </div>
                              <input
                                className="form-control form-control-sm"
                                id="primaryapprover"
                                placeholder="Enter valid HPE email"
                                type="text"
                                value={
                                  this.state.DocMetaData
                                    ? this.state.DocMetaData
                                        .primaryOwnerMailsRaw
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
                            {this.state.DocMetaData.approvalRequired &&
                              !this.state.ValidPrimaryMail && (
                                <div className="float-right validate-red">
                                  Please Enter Valid HPE Email Id for Primary
                                  Owner
                                </div>
                              )}
                          </td>
                        </tr>

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
                                placeholder="Enter valid HPE email"
                                value={
                                  this.state.DocMetaData
                                    ? this.state.DocMetaData
                                        .secondaryOwnerMailsRaw
                                    : ""
                                }
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
                            <span
                              className="removeIcon pointer "
                              title="Click to Remove Secondary Owner"
                              onClick={() => this.removeSecondaryOwner()}
                            >
                              x
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td>
                            {this.state.DocMetaData.approvalRequired &&
                              this.state.DocMetaData.secondaryOwnerMailsRaw !==
                                "" &&
                              !this.state.ValidSecondaryMail && (
                                <p className="float-right validate-red">
                                  Please Enter Valid HPE Email Id for Secondary
                                  Owner
                                </p>
                              )}
                          </td>
                        </tr>
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
                                        value={item.approverContact}
                                        // value={
                                        //   this.state.DocMetaData
                                        //     .lastLevelApproverData
                                        //     ? this.state.DocMetaData
                                        //         .lastLevelApproverData[idx]
                                        //         .approverContact
                                        //     : item.approverContact
                                        // }
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
                                        placeholder="Approver Role"
                                        name="approverRole"
                                        value={item.approverRole}
                                        // value={
                                        //   this.state.DocMetaData
                                        //     .lastLevelApproverData
                                        //     ? this.state.DocMetaData
                                        //         .lastLevelApproverData[idx]
                                        //         .approverRole
                                        //     : item.approverRole
                                        // }
                                        onChange={(e) =>
                                          this.handleLastLevelApproverChange(
                                            e,
                                            idx
                                          )
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
                      </>
                    )}
                  {/* ---------------------------- */}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}
export default UnTaggedModal;
