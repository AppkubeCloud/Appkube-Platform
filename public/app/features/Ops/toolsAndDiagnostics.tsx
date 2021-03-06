import React from 'react';
class ToolsAndDiagnostics extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      tableData: [
        {
          id: 14,
          category: 'Change Manager',
          info: 'sampleText',
          icon: '/public/img/tools-diagnostics/change_manager.svg',
        },
        {
          id: 13,
          category: 'Explorer',
          info: 'sampleText',
          icon: '/public/img/tools-diagnostics/explorer.svg',
        },
        {
          id: 12,
          category: 'RCA',
          info: 'sampleText',
          icon: '/public/img/tools-diagnostics/rca.svg',
        },
        {
          id: 11,
          category: 'Script Manager',
          info: 'sampleText',
          icon: '/public/img/tools-diagnostics/script_manager.svg',
        },
        {
          id: 10,
          category: 'Optimiser',
          info: 'sampleText',
          icon: '/public/img/tools-diagnostics/optimiser.svg',
        },
        {
          id: 19,
          category: 'Migration Management',
          info: 'sampleText',
          icon: '/public/img/tools-diagnostics/migration_management.svg',
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
          <h2 className="heading">Tools & Diagnostics</h2>
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
                        <span>
                          <img src="/public/img/Explore-icon.png" alt="image" />
                        </span>
                        <a href="#">
                          Explore <i className="fa fa-caret-right" aria-hidden="true"></i>
                        </a>
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
export default ToolsAndDiagnostics;
