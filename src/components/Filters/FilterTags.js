import React from "react";
import _ from "lodash";

const FilterTags = (props) => {
  return (
    <>
      {props.filters != null &&
        Object.values(props.filters).some((x) => x !== null && x !== "") && (
          <section className="pl-0 ml-2" id="section_filtertags">
            <div className="w-100">
              <div className="block">
                <div className="col-12 row">
                  {/* <div className="pl-2 pt-1">
          <div className="">
            <strong>Applied Filters</strong>
          </div>
        </div> */}
                  <div className="col-10 ml-0 pl-0 mt-1">
                    {props.filters?.SelectedLanguages && (
                      <span
                        className="filtertags p-1"
                        title={"Languages >" + props.filters?.SelectedLanguages}
                      >
                        <b>Languages</b> &gt;
                        {props.filters?.SelectedLanguages?.length > 50
                          ? props.filters.SelectedLanguages.substr(0, 50) +
                            "..."
                          : props.filters.SelectedLanguages}
                        <i
                          className="fa fa-times ml-1"
                          aria-hidden="true"
                          onClick={() => {
                            props.ClearFilter("language");
                          }}
                        />
                      </span>
                    )}
                    {props.filters?.SelectedDocSource && (
                      <span
                        className="filtertags p-1"
                        title={
                          "Document Source >" + props.filters.SelectedDocSource
                        }
                      >
                        <b>Document Source</b> &gt;
                        {props.filters.SelectedDocSource.length > 50
                          ? props.filters.SelectedDocSource.substr(0, 50) +
                            " ..."
                          : props.filters.SelectedDocSource}
                        <i
                          className="fa fa-times ml-1"
                          aria-hidden="true"
                          onClick={() => {
                            props.ClearFilter("doc_source");
                          }}
                        />
                      </span>
                    )}
                    {props.filters?.SelectedIndustrySegment && (
                      <span
                        className="filtertags p-1"
                        title={
                          "Industry Segment >" +
                          props.filters.SelectedIndustrySegment
                        }
                      >
                        <b>Industry Segment</b> &gt;
                        {props.filters.SelectedIndustrySegment.length > 50
                          ? props.filters.SelectedIndustrySegment.substr(
                              0,
                              50
                            ) + " ..."
                          : props.filters.SelectedIndustrySegment}
                        <i
                          className="fa fa-times ml-1"
                          aria-hidden="true"
                          onClick={() => {
                            props.ClearFilter("industry_segment");
                          }}
                        />
                      </span>
                    )}
                    {props.filters?.SelectedDisclouser && (
                      <span
                        className="filtertags p-1"
                        title={
                          "Disclosure Level >" +
                          props.filters.SelectedDisclouser
                        }
                      >
                        <b>Disclosure Level</b> &gt;
                        {props.filters.SelectedDisclouser.length > 50
                          ? props.filters.SelectedDisclouser.substr(0, 50) +
                            " ..."
                          : props.filters.SelectedDisclouser}
                        <i
                          className="fa fa-times ml-1"
                          aria-hidden="true"
                          onClick={() => {
                            props.ClearFilter("disclosure_level");
                          }}
                        />
                      </span>
                    )}
                    {props.filters?.SelectedFileTypes && (
                      <span
                        className="filtertags p-1"
                        title={
                          "Document Type >" + props.filters.SelectedFileTypes
                        }
                      >
                        <b>Document Type</b> &gt;
                        {props.filters?.SelectedFileTypes?.length > 50
                          ? props.filters.SelectedFileTypes.substr(0, 50) +
                            " ..."
                          : props.filters.SelectedFileTypes}
                        <i
                          className="fa fa-times ml-1"
                          aria-hidden="true"
                          onClick={() => {
                            props.ClearFilter("file_type");
                          }}
                        />
                      </span>
                    )}
                    {props.filters?.SelectedCountries && (
                      <>
                        <span
                          className="filtertags p-1"
                          id="geotitle"
                          title={
                            "Geography >" +
                            props.filters.SelectedCountries.replace(
                              /<[^>]*>/g,
                              ""
                            )
                          }
                        >
                          <b>Geography</b> &gt;
                          <span
                            dangerouslySetInnerHTML={{
                              __html:
                                props.filters.SelectedCountries.length > 50
                                  ? props.filters.SelectedCountries.substr(
                                      0,
                                      50
                                    ) + " ..."
                                  : props.filters.SelectedCountries,
                            }}
                          />
                          <i
                            className="fa fa-times ml-1"
                            aria-hidden="true"
                            onClick={() => {
                              props.ClearFilter("geo");
                            }}
                          />
                        </span>
                      </>
                    )}

                    {props.filters?.SelectedCreatedDates && (
                      <span
                        className="filtertags p-1"
                        title={
                          "Created Date >" + props.filters.SelectedCreatedDates
                        }
                      >
                        <b>Created Date</b> &gt;
                        {props.filters.SelectedCreatedDates.length > 50
                          ? props.filters.SelectedCreatedDates.substr(0, 50) +
                            " ..."
                          : props.filters.SelectedCreatedDates}
                        <i
                          className="fa fa-times ml-1"
                          aria-hidden="true"
                          onClick={() => {
                            props.ClearFilter("CreatedDate");
                          }}
                        />
                      </span>
                    )}
                    {props.filters?.SelectedPublishedDates && (
                      <span
                        className="filtertags p-1"
                        title={
                          "Published Date >" +
                          props.filters.SelectedPublishedDates
                        }
                      >
                        <b>Published Date</b> &gt;
                        {props.filters.SelectedPublishedDates.length > 50
                          ? props.filters.SelectedPublishedDates.substr(0, 50) +
                            " ..."
                          : props.filters.SelectedPublishedDates}
                        <i
                          className="fa fa-times ml-1"
                          aria-hidden="true"
                          onClick={() => {
                            props.ClearFilter("PublishDate");
                          }}
                        />
                      </span>
                    )}
                    {props.filters?.SelectedModifiedDates && (
                      <span
                        className="filtertags p-1"
                        title={
                          "Modified Date >" +
                          props.filters.SelectedModifiedDates
                        }
                      >
                        <b>Modified Date</b> &gt;
                        {props.filters.SelectedModifiedDates.length > 50
                          ? props.filters.SelectedModifiedDates.substr(0, 50) +
                            " ..."
                          : props.filters.SelectedModifiedDates}
                        <i
                          className="fa fa-times ml-1"
                          aria-hidden="true"
                          onClick={() => {
                            props.ClearFilter("ModifiedDate");
                          }}
                        />
                      </span>
                    )}
                    {props.filters?.SelectedServiceType && (
                      <span
                        className="filtertags p-1"
                        title={
                          "Service Type >" + props.filters.SelectedServiceType
                        }
                      >
                        <b>Service Type</b> &gt;
                        {props.filters.SelectedServiceType.length > 50
                          ? props.filters.SelectedServiceType.substr(0, 50) +
                            " ..."
                          : props.filters.SelectedServiceType}
                        <i
                          className="fa fa-times ml-1"
                          aria-hidden="true"
                          onClick={() => {
                            props.ClearFilter("ServiceType");
                          }}
                        />
                      </span>
                    )}
                    {props.filters?.SelectedOnRecommendedBy && (
                      <span
                        className="filtertags p-1"
                        title={
                          "Recommended By >" +
                          props.filters.SelectedOnRecommendedBy
                        }
                      >
                        <b>Recommended By</b> &gt;
                        {props.filters.SelectedOnRecommendedBy.length > 50
                          ? props.filters.SelectedOnRecommendedBy.substr(
                              0,
                              50
                            ) + " ..."
                          : props.filters.SelectedOnRecommendedBy}
                        <i
                          className="fa fa-times ml-1"
                          aria-hidden="true"
                          onClick={() => {
                            props.ClearFilter("RecommendedBy");
                          }}
                        />
                      </span>
                    )}
                    {props.filters?.SelectedInitiative && (
                      <span
                        className="filtertags p-1"
                        title={
                          "Aligned Initiative >" +
                          props.filters.SelectedInitiative
                        }
                      >
                        <b>Aligned Initiative</b> &gt;
                        {props.filters.SelectedInitiative.length > 50
                          ? props.filters.SelectedInitiative.substr(0, 50) +
                            " ..."
                          : props.filters.SelectedInitiative}
                        <i
                          className="fa fa-times ml-1"
                          aria-hidden="true"
                          onClick={() => {
                            props.ClearFilter("AlignedInitiative");
                          }}
                        />
                      </span>
                    )}
                    {props.filters?.SelectedGoldCollateral && (
                      <span className="filtertags p-1" title="Gold Collaterals">
                        <b>Gold Collaterals</b>
                        <i
                          className="fa fa-times ml-1"
                          aria-hidden="true"
                          onClick={() => {
                            props.ClearFilter("GoldCollateral");
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      </span>
                    )}

                    {props.filters?.IsNDAOnly && (
                      <span className="filtertags p-1" title="NDA Documents">
                        <b>NDA Documents</b>
                        <i
                          className="fa fa-times ml-1"
                          aria-hidden="true"
                          onClick={() => {
                            props.ClearFilter("NDAOnly");
                          }}
                        />
                      </span>
                    )}

                    {props.filters?.SelectedShowArchivedDocs && (
                      <span className="filtertags p-1" title="Archived Docs">
                        <b>Archived Docs</b>
                        <i
                          className="fa fa-times ml-1"
                          aria-hidden="true"
                          onClick={() => {
                            props.ClearFilter("ArchivedDocs");
                          }}
                        />
                      </span>
                    )}
                    {props.filters?.SelectedResearchVendors && (
                      <span
                        className="filtertags p-1"
                        title={
                          "Research Vendors >" +
                          props.filters.SelectedResearchVendors
                        }
                      >
                        <b>Research Vendors</b> &gt;
                        {props.filters.SelectedResearchVendors.length > 50
                          ? props.filters.SelectedResearchVendors.substr(
                              0,
                              50
                            ) + " ..."
                          : props.filters.SelectedResearchVendors}
                        <i
                          className="fa fa-times ml-1"
                          aria-hidden="true"
                          onClick={() => {
                            props.ClearFilter("reserach_vendors");
                          }}
                        />
                      </span>
                    )}
                    {props.filters?.SelectedCompetitors && (
                      <span
                        className="filtertags p-1"
                        title={
                          "Competitors >" + props.filters.SelectedCompetitors
                        }
                      >
                        <b>Competitors</b> &gt;
                        {props.filters.SelectedCompetitors.length > 50
                          ? props.filters.SelectedCompetitors.substr(0, 50) +
                            " ..."
                          : props.filters.SelectedCompetitors}
                        <i
                          className="fa fa-times ml-1"
                          aria-hidden="true"
                          onClick={() => {
                            props.ClearFilter("competitors");
                          }}
                        />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
    </>
  );
};

export default FilterTags;
