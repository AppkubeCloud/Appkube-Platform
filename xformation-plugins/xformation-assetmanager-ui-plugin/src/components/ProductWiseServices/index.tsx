import * as React from 'react';
import { Link } from 'react-router-dom';
import { images } from '../../img';
import { PLUGIN_BASE_URL } from '../../constants';
import { SelectCloudFilter } from '../SelectCloudFilter';
import { ServicesPerformance } from './ServicesPerformance';
import { v4 } from 'uuid';

const ViewMapping: any = {
  BUSINESS_VIEW: "0",
  CLOUD_VIEW: "1"
};

export class ProductWiseServices extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      showRecentFilter: false,
      showAddNewFilter: false,
      productComponent: [],
      departmentList: [
        {
          name: 'Human Resources',
          noOfProduct: '150',
          prodBilling: '$100',
          otherBilling: '$275'
        },
        {
          name: 'It Infra',
          noOfProduct: '150',
          prodBilling: '$100',
          otherBilling: '$275'
        },
        {
          name: 'IT Devlopment',
          noOfProduct: '150',
          prodBilling: '$100',
          otherBilling: '$275'
        },
        {
          name: 'Finance',
          noOfProduct: '150',
          prodBilling: '$100',
          otherBilling: '$275'
        },
        {
          name: 'Finance',
          noOfProduct: '150',
          prodBilling: '$100',
          otherBilling: '$275'
        },
        {
          name: 'It Infra',
          noOfProduct: '150',
          prodBilling: '$100',
          otherBilling: '$275'
        }
      ],
      viewMapping: {},
      product: [],
      isDataLoaded: false,
    };
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (!this.state.isDataLoaded) {
      this.setState({
        product: this.props.product,
        isDataLoaded: true
      });
    }
  }

  openProduct = (i: any, j: any) => {
    const { viewMapping, product } = this.state;
    let productView = viewMapping[i] ? viewMapping[i] : [];
    for (let m = 0; m < product[i].productList.length; m++) {
      if (j !== m) {
        const defaultView = productView[m] ? productView[m] : ViewMapping.BUSINESS_VIEW;
        const viewData = product[i].productList[m];
        viewData[defaultView].isOpen = false;
      }
    }
    const defaultView = productView[j] ? productView[j] : ViewMapping.BUSINESS_VIEW;
    const viewData = product[i].productList[j];
    viewData[defaultView].isOpen = !viewData[defaultView].isOpen;
    this.setState({
      product
    });
  }

  handleChangeViewOfProduct = (departmentIndex: any, productIndex: any) => {
    const { product, viewMapping } = this.state
    if (product[departmentIndex]) {
      const appliedView = viewMapping[departmentIndex] ? viewMapping[departmentIndex][productIndex] : ViewMapping.BUSINESS_VIEW;
      const newView = appliedView === ViewMapping.BUSINESS_VIEW ? ViewMapping.CLOUD_VIEW : ViewMapping.BUSINESS_VIEW;
      const newViewMap = viewMapping[departmentIndex] ? viewMapping[departmentIndex] : [];
      newViewMap[productIndex] = newView;
      viewMapping[departmentIndex] = newViewMap;
      this.setState({
        viewMapping: JSON.parse(JSON.stringify(viewMapping))
      });
    }
  }

  displayProductServices = () => {
    const { viewMapping, product } = this.state;
    let retData = [];
    if (product && product.length > 0) {
      for (let i = 0; i < product.length; i++) {
        let row = product[i];
        let productViewMapping = viewMapping[i] ? viewMapping[i] : [];
        retData.push(
          <div key={v4()} className="inner-table">
            <div className="thead">{row.title}</div>
            {row.productList && row.productList.map((viewData: any, index: any) => {
              const defaultView = productViewMapping[index] ? productViewMapping[index] : ViewMapping.BUSINESS_VIEW;
              const val = viewData[defaultView];
              return (
                <div className="tbody">
                  <div className="name" onClick={() => this.openProduct(i, index)}>
                    <span>{val.title}</span>
                    <i className={val.isOpen == true ? 'fa fa-chevron-up' : 'fa fa-chevron-down'} />
                  </div>
                  <div className="app-services">10</div>
                  <div className="data-services">5</div>
                  <div className="ou">Admin, Accounts Adminssion, Transport</div>
                  <div className="edit">
                    <button className="edit-btn">
                      <span></span>
                      <span></span>
                      <span></span>
                    </button>
                  </div>
                  {val.isOpen == true &&
                    <ServicesPerformance
                      handleChangeViewOfProduct={() => this.handleChangeViewOfProduct(i, index)}
                      product={val}
                    />}
                </div>
              )
            })
            }
          </div >
        );
      }
    }
    return retData;
  }

  render() {
    const { showRecentFilter, showAddNewFilter } = this.state;
    return (
      <div className="common-container department-fliters-container">
        <div className="selects-container">
          <SelectCloudFilter />
        </div>
        <div className="fliter-container">
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-12">
              <div className="row">
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="fliter">
                    <div
                      className="fliter-toggel"
                      onClick={() =>
                        this.setState({
                          showRecentFilter: !showRecentFilter,
                        })
                      }
                    >
                      <i className="fa fa-clock-o"></i>
                      <span>Recent</span>
                    </div>
                    <div className={showRecentFilter === true ? 'fliter-collapse active' : 'fliter-collapse'}>
                      <ul>
                        <li>
                          <Link to={`${PLUGIN_BASE_URL}/account-setup`}>
                            <span><img src={images.awsLogo} alt="" /></span>
                            <p>AWS (657907747545)</p>
                          </Link>
                        </li>
                        <li>
                          <Link to={`${PLUGIN_BASE_URL}/account-setup`}>
                            <span><img src={images.awsLogo} alt="" /></span>
                            <p>AWS (655668745458)</p>
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className={showRecentFilter === true ? "fliters-collapse-bg active" : "fliters-collapse-bg"} onClick={() => this.setState({ showRecentFilter: !showRecentFilter })}></div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="fliter">
                    <div
                      className="fliter-toggel"
                      onClick={() =>
                        this.setState({
                          showAddNewFilter: !showAddNewFilter,
                        })
                      }
                    >
                      <i className="fa fa-plus"></i>
                      <span>Add New Environment</span>
                    </div>
                    <div className={showAddNewFilter === true ? 'fliter-collapse active' : 'fliter-collapse'}>
                      <ul>
                        <li>
                          <Link to={`${PLUGIN_BASE_URL}/account-setup`}>
                            <span><img src={images.awsLogo} alt="" /></span>
                            <p>AWS Environment</p>
                          </Link>
                        </li>
                        <li>
                          <Link to={`${PLUGIN_BASE_URL}/account-setup`}>
                            <span><img src={images.microsoftAzureLogo} alt="" /></span>
                            <p>Azure Environment</p>
                          </Link>
                        </li>
                        <li>
                          <Link to={`${PLUGIN_BASE_URL}/account-setup`}>
                            <span><img src={images.gcpLogo} alt="" /></span>
                            <p>GCP Environment</p>
                          </Link>
                        </li>
                        <li>
                          <Link to={`${PLUGIN_BASE_URL}/account-setup`}>
                            <span><img src={images.KubernetesLogo} alt="" /></span>
                            <p>Kubernetes</p>
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className={showAddNewFilter === true ? "fliters-collapse-bg active" : "fliters-collapse-bg"} onClick={() => this.setState({ showAddNewFilter: !showAddNewFilter })}></div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="fliter">
                    <div className="fliter-toggel">
                      <i className="fa fa-sign-out"></i>
                      <span>Export</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
              <div className="form-group search-control m-b-0">
                <button className="btn btn-search">
                  <i className="fa fa-search"></i>
                </button>
                <input type="text" className="input-group-text" placeholder="Search" />
              </div>
            </div>
          </div>
        </div>
        <div className="data-table">
          <div className="thead">
            <div className="name">Name</div>
            <div className="app-services">App Services</div>
            <div className="data-services">Data Services</div>
            {/* <div className="ou">OU</div> */}
            <div className="edit">
              <button className="edit-btn">
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
          <div className="tbody">
            {this.displayProductServices()}
          </div>
        </div>
      </div>
    );
  }
}