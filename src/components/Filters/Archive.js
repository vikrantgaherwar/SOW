import React from "react";
import axios from 'axios'
import Cookies from "js-cookie";

class Archive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: "",
      hasNDA : false,
      SelectedFilters: {
        SelectedLanguages: "",
        SelectedCountries: "",
        SelectedDocSource: "",
        SelectedDisclouser: "",
        SelectedFileTypes: "",
        SelectedCreatedDates: "",
        SelectedPublishedDates: "",
        SelectedModifiedDates: "",
        SelectedServiceType: "",
        SelectedOnRecommendedBy: "",
        SelectedInitiative: "",
        SelectedGoldCollateral: false,
        IsNDAOnly: false,
        SelectedShowArchivedDocs: false,
        SelectedResearchVendors: "",
        SelectedCompetitors: "",
      },
    };
  }
  componentDidMount = () => {
    this.CheckUserHaveNDADocuments();
  }
  CheckUserHaveNDADocuments = () => {
    debugger;
    var searchKey = document
    .getElementsByClassName("react-autosuggest__input")[0]
    .value.replace(/[#?&@]/g, " ");
    if(searchKey.indexOf('unique_file') === 0){
    // searchKey= eval(searchKey);
    }
    if(searchKey.indexOf('"') === 0){
      searchKey = searchKey.substring(1,searchKey.length-1);
    }
    axios
      .get(
        "https://hpedelta.com:8983/solr/sharepoint_index/select?defType=edismax&fl=id,title,nda,ndamails_raw,score,isarchived&group.field=document_type_details&group=true&indent=on&q=" +
          searchKey +
          "&rows=500&wt=json&group.limit=15&fq=persona_role:*Admin*&fq=-isarchived:True&fq=nda:%22True%22&fq=ndamails_raw:*" +
          Cookies.get("mail") +
          "*"
      )
      .then((res) => {
        debugger;
        if (res.data) {
          debugger;
          if(res.data.grouped.document_type_details.matches > 0){
          this.setState({
            hasNDA : true,
          });
        }
        }
      });
  };
  onArchivedDocsChange = (e) => {
    if (e.target.checked == true) {
      this.setState(
        {
          SelectedFilters: {
            SelectedShowArchivedDocs: true,
          },
        },
        () => {
          this.props.ApplyFilter(
            this.state.filters,
            this.state.SelectedFilters
          );
        }
      );
    }
  };
  onNDAChange = (e) => {
    if (e.target.checked == true) {
      this.setState(
        {
          SelectedFilters: {
            IsNDAOnly: true,
          },
          filters : '&fq=-isarchived:True&fq=nda:"True"&fq=ndamails_raw:*' + Cookies.get("mail") + '*'
        },
        () => {
          this.props.ApplyFilter(
            this.state.filters,
            this.state.SelectedFilters
          );
        }
      );
    }
  };
  render() {
    return (
      <>
        <label className="mb-1 mt-1" style={{ color: "#000" }}>
          <input
            type="checkbox"
            value="checked"
            name="archived_result"
            className="mr-2"
            id="archived_result"
            style={{ verticalAlign: "middle" }}
            checked={this.props.value}
            onChange={(e) => {
              this.onArchivedDocsChange(e);
            }}
          />
          <span className="archivedDocs mr-1 ml-0">
            <strong>A</strong>
          </span>
          Include Archived Documents
        </label>
        <br/>
        {this.state.hasNDA &&
        <label className="mb-1 mt-1" style={{ color: "#000" }}>
        <input
          type="checkbox"
          value="checked"
          name="NDAOnly"
          className="mr-2"
          id="NDAOnly"
          style={{ verticalAlign: "middle" }}
          onChange={(e) => {
            this.onNDAChange(e);
          }}
        />
        <i className="fa fa-key mr-1 ml-0 ndadoc"></i>Show NDA Documents Only
        </label>
        }
      </>
    );
  }
}

export default Archive;
