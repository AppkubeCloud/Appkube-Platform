import React from 'react';
import { Link } from 'react-router-dom';

class SecCenteral extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      tableData: [
        {
          id: 14,
          category: 'RBAC/Multitenancy',
          info: 'sampleText',
          icon: '/public/img/sec-central/rbac_multitenancy.svg',
        },
        {
          id: 13,
          category: 'Cloud Env Security',
          info: 'sampleText',
          icon: '/public/img/sec-central/cloud_env_security.svg',
        },
        {
          id: 12,
          category: 'Infra Security',
          info: 'sampleText',
          icon: '/public/img/sec-central/infra_security.svg',
        },
        {
          id: 11,
          category: 'Container Security',
          info: 'sampleText',
          icon: '/public/img/sec-central/container_security.svg',
        },
        {
          id: 10,
          category: 'Kubernetes Security',
          info: 'sampleText',
          icon: '/public/img/sec-central/kubernetes_security.svg',
        },
        {
          id: 19,
          category: 'Code Security - SAST/DAST',
          info: 'sampleText',
          icon: '/public/img/sec-central/code_security_sastdast.svg',
        },
        {
          id: 24,
          category: 'Secrets Vaults',
          info: 'sampleText',
          icon: '/public/img/sec-central/secrets_vaults.svg',
        },
        {
          id: 22,
          category: 'App Security',
          info: 'sampleText',
          icon: '/public/img/sec-central/app_security.svg',
        },
        {
          id: 25,
          category: 'Data Security',
          info: 'sampleText',
          icon: '/public/img/sec-central/data_security.svg',
        },
        {
          id: 26,
          category: 'Cloud Compiance',
          info: 'sampleText',
          icon: '/public/img/sec-central/cloud_compiance.svg',
          link: '/a/xformation-compliancemanager-ui-plugin/dashboard',
        },
      ],
      duplicateTableData: [],
    };
  }

  componentDidMount() {
    const { tableData } = this.state;
    this.setState({ duplicateTableData: tableData });
  }

  handelFilter = (e: any) => {
    const { value } = e.target;
    const { tableData, duplicateTableData } = this.state;
    if (value.length >= 0) {
      let data = [];
      for (let i = 0; i < duplicateTableData.length; i++) {
        if (duplicateTableData[i].category.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
          data.push(duplicateTableData[i]);
        }
      }
      this.setState({ tableData: data });
    } else {
      this.setState({ tableData: tableData });
    }
  };
  render() {
    const { tableData } = this.state;
    return (
      <div className="ops-central-container">
        <div className="ops-central-header">
          <h2 className="heading">Sec Centeral</h2>
          <div className="central-header-content">
            <div className="recent-text">
              <i className="fa fa-clock-o" aria-hidden="true"></i>
              <p>Recent</p>
            </div>
            <div className="recent-text">
              <i className="fa fa-retweet" aria-hidden="true"></i>
              <p>Sort</p>
            </div>
            <div className="search-bar">
              <input type="text" className="control-form" placeholder="search" onChange={(e) => this.handelFilter(e)} />
              <i className="fa fa-search" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <div className="ops-container">
          <div className="row">
            {tableData && tableData.length > 0 ? (
              tableData.map((value: any) => {
                return (
                  <div className="col-lg-3 col-md-3 col-sm-6" key={value.id}>
                    <div className="ops-box">
                      <div className="ops-box-inner">
                        <div className="ops-image">
                          <img src={value.icon} alt="image" className="icon" />
                        </div>
                        <div className="ops-content">
                          <div className="ops-tittle"> {value.category} </div>
                          <div className="ops-text"> {value.info} </div>
                        </div>
                      </div>
                      <div className="explore-content">
                        {value.link ? (
                          <>
                            <span>
                              <img src="/public/img/Explore-icon.png" alt="image" />
                            </span>
                            <Link to={value.link}>
                              Explore <i className="fa fa-caret-right" aria-hidden="true"></i>
                            </Link>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <>No Data Avalable</>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default SecCenteral;
