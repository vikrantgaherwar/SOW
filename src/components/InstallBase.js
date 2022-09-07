import React from "react";
import axios from "axios";
import URLConfig from "./URLConfig";
import SalesAllChannel from "./SalesAllChannel";
import SalesByChannel from "./SalesByChannel";
import SalesByProductLine from "./SalesByProductLine";
import SalesCategoryTable from "./SalesCategoryTable";
import ProductDetailsTable from "./ProductDetailsTable";
import Modal from "react-bootstrap/Modal";
import { ExportReactCSV } from "./ExportReactCSV";
import _ from "lodash";
import Cookies from "js-cookie";
import TrackingService from "./TrackingService";
class InstallBase extends React.Component {
  constructor(props) {
    super(props);
    this.TrackingService = new TrackingService();
    this.state = {
      data: [],
      selectedChannel: "",
      SalesDirect: [],
      SalesInDirect: [],
      SalesByChannelProdType: [],
      ProductLineData: [],
      displayChannelSales: true,
      displayProductLinesByChannel: false,
      displayProductLine: false,
      type: "",
      IsOpen: true,
      IsOpenPrdt: true,
      displaySaleCategory: false,
      IsOpenSaleCat: false,
      countryfilterlist: this.props.countryfilterlist,
    };
  }

  componentDidMount = () => {
    if (this.props.AllChannelData != null) {
      this.setState({
        data: this.props.AllChannelData,
        parentAccountStID: this.props.parentAccountStID,
      });
    }
    if (this.props.SalesDirect != null) {
      this.setState({ SalesDirect: this.props.SalesDirect });
    }
    if (this.props.SalesInDirect != null) {
      this.setState({ SalesInDirect: this.props.SalesInDirect });
    }
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.countryfilterlist !== prevProps.countryfilterlist) {
      this.setState({ countryfilterlist: this.props.countryfilterlist });
    }
    if (prevProps.AllChannelData !== this.props.AllChannelData) {
      if (this.props.AllChannelData != null) {
        this.setState({
          data: this.props.AllChannelData,
          parentAccountStID: this.props.parentAccountStID,
        });
      }
    }
    if (prevProps.SalesDirect !== this.props.SalesDirect) {
      if (this.props.SalesDirect != null) {
        this.setState({ SalesDirect: this.props.SalesDirect });
      }
    }
    if (prevProps.SalesInDirect !== this.props.SalesInDirect) {
      if (this.props.SalesInDirect != null) {
        this.setState({ SalesInDirect: this.props.SalesInDirect });
      }
    }
  };

  selectChannel = (channelName) => {
    this.setState({ selectedChannel: channelName });
    if (channelName === "Direct") {
      this.setState({
        IsOpen: true,
        SalesByChannelProdType: this.state.SalesDirect,
        type: "Direct",
        displayProductLinesByChannel: true,
        displayChannelSales: false,
      });
    } else {
      this.setState({
        IsOpen: true,
        SalesByChannelProdType: this.state.SalesInDirect,
        type: "InDirect",
        displayProductLinesByChannel: true,
        displayChannelSales: false,
      });
    }
  };

  selectProduct = (channel, productName) => {
    if (productName === "Others") {
      return;
    }
    this.setState({
      IsOpenPrdt: true,
      displayProductLinesByChannel: false,
      displayProductLine: true,
      ProductLineData: [],
    });
    if (this.state.countryfilterlist == "") {
      var selectproductURL =
        URLConfig.getURLInstallBaseAPI(this.props.parentAccountStID) +
        "/" +
        channel +
        "/" +
        productName.replace(" ", "%20").replace("/", "%2F");
    }
    if (this.state.countryfilterlist != "") {
      var selectproductURL =
        URLConfig.getURLInstallBaseAPI(this.props.parentAccountStID) +
        "/" +
        channel +
        "/" +
        productName.replace(" ", "%20").replace("/", "%2F") +
        "?c=" +
        this.state.countryfilterlist;
    }
    axios.get(selectproductURL).then((res) => {
      if (res.data.length) {
        this.setState({
          IsOpenPrdt: true,
          ProductLineData: res.data,
          ProductLineName: productName,
        });
      }
    });
  };

  selectProductLine = (channel, productNameID) => {
    this.setState({
      IsOpenSaleCat: true,
      displayProductLinesByChannel: false,
      displayProductLine: false,
      displaySaleCategory: true,
      SaleCategoryeData: [],
    });

    if (this.state.countryfilterlist == "") {
      var selectProductLineURL =
        URLConfig.getURLInstallBaseAPI(this.props.parentAccountStID) +
        "/" +
        channel +
        "/level4/" +
        productNameID;
    }
    if (this.state.countryfilterlist != "") {
      var selectProductLineURL =
        URLConfig.getURLInstallBaseAPI(this.props.parentAccountStID) +
        "/" +
        channel +
        "/level4/" +
        productNameID +
        "?c=" +
        this.state.countryfilterlist;
    }
    axios.get(selectProductLineURL).then((res) => {
      if (res.data.length) {
        var data = _.orderBy(res.data, "product_Type", "desc");
        this.setState({
          IsOpenSaleCat: true,
          SaleCategoryeData: data,
          ProductLineNameID: productNameID,
        });
      }
    });
  };

  selectSaleCategory = (channel, productFamilyID, count) => {
    this.setState({
      IsOpenProDetails: true,
      displayProductLinesByChannel: false,
      displayProductLine: false,
      displaySaleCategory: false,
      displayProdDetails: true,
      DetailedProdData: [],
    });
    axios
      .get(
        URLConfig.getURLInstallBaseProductAPI(this.props.parentAccountStID) +
          "/" +
          channel +
          "/" +
          productFamilyID
      )
      .then((res) => {
        if (res.data.length) {
          this.setState({
            IsOpenProDetails: true,
            DetailedProdData: res.data,
            productFamilyID: productFamilyID,
            count: count,
          });
        }
      });
  };

  backToChannelSales = () => {
    this.setState({
      IsOpenPrdt: false,
      displayProductLinesByChannel: true,
      displayProductLine: false,
    });
  };

  backToAllChannels = () => {
    this.setState({
      IsOpen: false,
      IsOpenPrdt: false,
      IsOpenSaleCat: false,
      IsOpenProDetails: false,
      displayChannelSales: true,
      displayProductLinesByChannel: false,
    });
  };

  backToChannelProductLine = () => {
    this.setState({
      IsOpenSaleCat: false,
      displayChannelSales: false,
      displayProductLinesByChannel: false,
      displayProductLine: true,
      displaySaleCategory: false,
    });
  };

  backTosalesCategoryChannel = () => {
    this.setState({
      IsOpenSaleCat: true,
      displayChannelSales: false,
      displayProductLinesByChannel: false,
      displayProductLine: false,
      displaySaleCategory: true,
      displayProdDetails: false,
    });
  };

  render() {
    return (
      <>
        {this.state.data.length > 0 && (
          <div className="card">
            <div className="card-header" id="headingFive">
              <h5 className="mb-0">
                <button
                  title="Displays overall install base of a customer account. Click on the section of pie diagram for more details."
                  className="btn btn-link btn-full collapsed"
                  type="button"
                  data-toggle="collapse"
                  aria-expanded="false"
                  data-target="#custFive"
                  aria-controls="custFive"
                  onClick={() => {
                    console.log("install base");
                  }}
                >
                  Install base
                </button>
              </h5>
            </div>
            <div
              aria-labelledby="headingFive"
              data-parent="#accordionCust"
              aria-expanded="false"
              id="custFive"
              className="collapse"
            >
              <div className="card-body ml-3"></div>
              {this.state.data === null && (
                <p className="loading-text">Loading Data..</p>
              )}
              {this.state.data !== null && this.state.displayChannelSales && (
                <SalesAllChannel
                  onChannelSelect={this.selectChannel}
                  dataSales={this.state.data}
                />
              )}
              {this.state.displayProductLinesByChannel && (
                <div className="Install-Chart-Layout">
                  <Modal show={this.state.IsOpen}>
                    <Modal.Header as="section">
                      <Modal.Title className="ibheadertext col-12" as="div">
                        <a className="btn btn-sm btn-transp">
                          {this.state.type}
                        </a>
                        <a
                          className="btn btn-link float-right mtop-5 Doc-Depo-Heading"
                          onClick={this.backToAllChannels}
                          translate="no"
                        >
                          X
                        </a>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <SalesByChannel
                        onProductSelect={this.selectProduct}
                        dataSales={this.state.SalesByChannelProdType}
                        type={this.state.type}
                      />
                    </Modal.Body>
                  </Modal>
                </div>
              )}
              {this.state.displayProductLine && (
                <div className="Install-Chart-Layout">
                  <Modal show={this.state.IsOpenPrdt}>
                    <Modal.Header as="section">
                      <Modal.Title className="ibheadertext col-12" as="div">
                        {this.state.ProductLineData.length > 0 && (
                          <a className="btn btn-sm btn-transp">
                            {this.state.type} {" >> "}
                            {this.state.ProductLineName}
                          </a>
                        )}
                        <a
                          className="btn btn-link float-right mtop-5 Doc-Depo-Heading"
                          onClick={this.backToAllChannels}
                          translate="no"
                        >
                          X
                        </a>
                        <a
                          className="btn btn-sm btn-transp float-left"
                          onClick={this.backToChannelSales}
                        >
                          <i className="fas fa-arrow-left" />
                        </a>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {this.state.ProductLineData.length === 0 && (
                        <p className="loading-text">Loading Data..</p>
                      )}
                      {this.state.ProductLineData.length > 0 && (
                        <SalesByProductLine
                          onProductLineSelect={this.selectProductLine}
                          dataSales={this.state.ProductLineData}
                          type={this.state.ProductLineName}
                          channelname={this.state.type}
                        />
                      )}
                    </Modal.Body>
                  </Modal>
                </div>
              )}
              {this.state.displaySaleCategory && (
                <div className="Install-Chart-Layout">
                  <Modal
                    show={this.state.IsOpenSaleCat}
                    id="salesCategoryModal"
                  >
                    <Modal.Header as="section">
                      <Modal.Title className="ibheadertext col-12" as="div">
                        {this.state.SaleCategoryeData.length > 0 && (
                          <a className="btn btn-sm btn-transp">
                            {this.state.type} {" >> "}
                            {this.state.ProductLineName} {" >> "}
                            {this.state.ProductLineNameID}
                          </a>
                        )}
                        <a
                          className="btn btn-link float-right mtop-5 Doc-Depo-Heading"
                          onClick={this.backToAllChannels}
                          translate="no"
                        >
                          X
                        </a>
                        <a
                          className="btn btn-sm btn-transp float-left"
                          onClick={this.backToChannelProductLine}
                        >
                          <i className="fas fa-arrow-left" />
                        </a>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {this.state.SaleCategoryeData.length === 0 && (
                        <p className="loading-text">Loading Data..</p>
                      )}
                      {this.state.SaleCategoryeData.length > 0 && (
                        <SalesCategoryTable
                          onselectProductID={this.selectSaleCategory}
                          Sales={this.state.SaleCategoryeData}
                          Type={this.state.ProductLineNameID}
                          selectedChannel={this.state.selectedChannel}
                        />
                      )}
                    </Modal.Body>
                  </Modal>
                </div>
              )}
              {this.state.displayProdDetails && (
                <div className="Install-Chart-Layout">
                  <Modal
                    show={this.state.IsOpenProDetails}
                    id="productdetailsModal"
                  >
                    <Modal.Header as="section">
                      <Modal.Title className="ibheadertext col-12" as="div">
                        {this.state.DetailedProdData.length > 0 && (
                          <a className="btn btn-sm btn-transp">
                            {this.state.type} {" >> "}
                            {this.state.ProductLineName} {" >> "}
                            {this.state.ProductLineNameID} {" >> "}
                            {this.state.productFamilyID}
                          </a>
                        )}
                        <a
                          className="btn btn-link float-right mtop-5 Doc-Depo-Heading"
                          onClick={this.backToAllChannels}
                          translate="no"
                        >
                          X
                        </a>
                        <a
                          className="btn btn-sm btn-transp float-left"
                          onClick={this.backTosalesCategoryChannel}
                        >
                          <i className="fas fa-arrow-left" />
                        </a>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {this.state.DetailedProdData.length === 0 && (
                        <p className="loading-text">Loading Data..</p>
                      )}
                      {this.state.DetailedProdData.length > 0 && (
                        <>
                          <ExportReactCSV
                            csvData={this.state.DetailedProdData}
                            fileName="ProductData.xls"
                          >
                            Export
                          </ExportReactCSV>
                          <ProductDetailsTable
                            Sales={this.state.DetailedProdData}
                            Type={this.state.productFamilyID}
                            selectedChannel={this.state.selectedChannel}
                            count={this.state.count}
                          />
                        </>
                      )}
                    </Modal.Body>
                  </Modal>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }
}
export default InstallBase;
