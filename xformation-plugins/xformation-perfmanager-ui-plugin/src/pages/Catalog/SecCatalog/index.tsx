import React from 'react';
import { CompliancePolicies } from './CompliancePolicies';
import { ComplianceRules } from './ComplianceRules';
import { ConainerSecurityTemplates } from './ConainerSecurityTemplates';
import { DataSecurityTemplates } from './DataSecurityTemplates';
import { ComplianceAuditors } from './ComplianceAuditors';
import { CodeSecurityTemplates } from './CodeSecurityTemplets';

export class SecCatalogue extends React.Component<any, any>{
    config: any;
    tabMapping: any = [
        {
            name: "Code Security Templates",
            dataKey: 'codeSecurityTemplates',
            component: CodeSecurityTemplates
        },
        {
            name: "Compliance Policies",
            dataKey: 'compliancePolicies',
            component: CompliancePolicies
        },
        {
            name: "Compliance Rules",
            dataKey: 'complianceRules',
            component: ComplianceRules
        },
        {
            name: "Conainer Security Templates",
            dataKey: 'conainerSecurityTemplates',
            component: ConainerSecurityTemplates
        },
        {
            name: "Data Security Templates",
            dataKey: 'dataSecurityTemplates',
            component: DataSecurityTemplates
        },
        {
            name: "Compliance Auditors",
            dataKey: 'complianceAuditors',
            component: ComplianceAuditors
        },
    ];
    previewDashboardPopupRef: any;
    constructor(props: any) {
        super(props)
        this.state = {
            catalogData: this.props.data || {},
            activeTab: 0
        }
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
            this.setState({
                catalogData: this.props.data
            });
        }
    }

    setActiveTab = (activeTab: any) => {
        this.setState({
            activeTab
        });
    };

    render() {
        const { catalogData, activeTab } = this.state;
        return (
            <>
                <div className="catalogue-inner-tabs">
                    <ul>
                        {
                            this.tabMapping.map((tabData: any, index: any) => {
                                return (
                                    <li key={`ops-tab-${index}`}
                                        className={index === activeTab ? 'active' : ''}
                                        onClick={(e) => this.setActiveTab(index)}>
                                        {tabData.name}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                {
                    this.tabMapping.map((tabData: any, index: any) => {
                        if (index === activeTab) {
                            return <tabData.component data={catalogData[tabData.dataKey]} />
                        } else {
                            return <></>;
                        }

                    })
                }

            </>
        )
    }
}