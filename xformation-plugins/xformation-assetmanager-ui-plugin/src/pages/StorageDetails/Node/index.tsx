import * as React from 'react';
import { images } from '../../../img';
import { WebServiceWizard } from './WebServiceWizard';
import { Monitor } from './Monitor';
import { CommonService } from '../../_common/common';

export class Node extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentStep: 0,
      accountId: '',
      serviceData: props.serviceData,
      steps: [
        {
          name: "Performance",
          component: Monitor,
          apiKey: 'performance'
        },
        {
          name: "Availability",
          component: Monitor,
          apiKey: 'availability'
        },
        {
          name: "Reliability",
          component: Monitor,
          apiKey: 'reliability'
        },
        {
          name: "End Usage",
          component: Monitor,
          apiKey: 'endUsage'
        },
        {
          name: "Security",
          component: Monitor,
          apiKey: 'security'
        },
        {
          name: "Compliance",
          component: Monitor,
          apiKey: 'compliance'
        },
        {
          name: "Alerts",
          component: Monitor,
          apiKey: 'alerts'
        },
      ],
    };
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (JSON.stringify(prevProps.serviceData) !== JSON.stringify(this.props.serviceData)) {
      this.setState({
        currentStep: 0,
        serviceData: this.props.serviceData,
      });
    }
  }

  componentDidMount() {
    const accountId = CommonService.getParameterByName("accountId", window.location.href);
    if (accountId) {
      this.setState({
        accountId
      });
    }
  }

  displaylist = (list: any) => {
    let retData = [];
    for (let i = 0; i < list.length; i++) {
      retData.push(
        <li>
          <i className="fa fa-angle-right" aria-hidden="true"></i>
          {list[i].name}
        </li>
      );
    }
    return retData;
  };

  render() {
    const { accountId, serviceData, steps } = this.state;
    return (
      <div className="inner">
        <div className="heading">
          <h3>
            <span>
              <img src={images.awsLogo} alt="" />
            </span>
            Amazon Web Services
            {/* {serviceData.name} */}
          </h3>
          <div className="breadcrumbs">
            <ul>
              <li>
                Account Number - <span>AWS-({accountId})</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="account-box">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="breadcrumbs">
                <ul>
                  <li>
                    <span>AWS-({accountId})</span>
                  </li>
                  &nbsp;{'>'}&nbsp;{serviceData.labelText}
                </ul>
              </div>
            </div>
            {/* <div className="col-lg-5 col-md-5 col-sm-12">
              <div className="search-box form-group">
                <input
                  type="text"
                  className="control-form"
                  placeholder="Search"
                  value=""
                />
                <button>
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </div> */}
          </div>
        </div>
        <div className="displayed-here">
          <p>Node details will be displayed here</p>
        </div>
        <WebServiceWizard steps={steps} {...this.props} />
      </div>
    );
  }
}
