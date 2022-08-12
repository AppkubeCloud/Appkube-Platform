import * as React from 'react';
// import { threadId } from 'worker_threads';
// import { AwsHelper } from '../AwsHelpers';
// import { Link } from 'react-router-dom';
import WorkFlow from '../../components/WorkFlowCommonComponent'
export class WorkFlowView extends React.Component<any, any> {
	awsHelper: any;
	constructor(props: any) {
		super(props);
		this.state = {
			activeStage: 0,
			stageList: [
				{
					name: 'Requirements',
					stepList: [
						{
							name: 'Create Usecase Document',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 0,
							endDate: '01/05/2022',
							endDeviation: 0
						},
						{
							name: 'Create Screen Design',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 1,
							endDate: '01/05/2022',
							endDeviation: 1
						},
						{
							name: 'Updating Usecase in Netlifi',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 0,
							endDate: '01/05/2022',
							endDeviation: 0
						}
					]
				},
				{
					name: 'Mock Development',
					stepList: [
						{
							name: 'Create API Spec',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 1,
							endDate: '01/05/2022',
							endDeviation: 1
						},
						{
							name: 'Create Postman Test',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 0,
							endDate: '01/05/2022',
							endDeviation: 0
						},
						{
							name: 'Create UI Screen with Mock API',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 1,
							endDate: '01/05/2022',
							endDeviation: 1
						},
						{
							name: 'Create Test API',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 0,
							endDate: '01/05/2022',
							endDeviation: 0
						}
					]
				},
				{
					name: 'Actual Development',
					stepList: [
						{
							name: 'Data Design GitHub Page',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 1,
							endDate: '01/05/2022',
							endDeviation: 1
						},
						{
							name: 'API Source Code in GitHub',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 0,
							endDate: '01/05/2022',
							endDeviation: 0
						},
						{
							name: 'Populate Test data in GitHub',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 1,
							endDate: '01/05/2022',
							endDeviation: 1
						},
						{
							name: 'Junit5 Test in GitHub',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 0,
							endDate: '01/05/2022',
							endDeviation: 0
						},
						{
							name: 'Cucumber BDD tests in GitHub',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 1,
							endDate: '01/05/2022',
							endDeviation: 1
						},
						{
							name: 'Gatling Performance',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 0,
							endDate: '01/05/2022',
							endDeviation: 0
						},
						{
							name: 'Code Review with Tech Lead',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 1,
							endDate: '01/05/2022',
							endDeviation: 1
						},
						{
							name: 'Actual UI-API Integration',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 0,
							endDate: '01/05/2022',
							endDeviation: 0
						},
						{
							name: 'Branch Merge after Review',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 1,
							endDate: '01/05/2022',
							endDeviation: 1
						}
					]
				},
				{
					name: 'CI/CD Test',
					stepList: [
						{
							name: 'Create CI/CD Pipeline',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 1,
							endDate: '01/05/2022',
							endDeviation: 1
						},
						{
							name: 'Create Kubernetes Operator',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 0,
							endDate: '01/05/2022',
							endDeviation: 0
						},
						{
							name: 'Link API with GitHub and Netlifi',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 1,
							endDate: '01/05/2022',
							endDeviation: 1
						},
						{
							name: 'Upload Test results in S3 Website',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 0,
							endDate: '01/05/2022',
							endDeviation: 0
						},
						{
							name: 'Upload Test env URL in Netlifi site',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 1,
							endDate: '01/05/2022',
							endDeviation: 1
						},
						{
							name: 'Stage after review',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 0,
							endDate: '01/05/2022',
							endDeviation: 0
						}
					]
				},
				{
					name: 'Stage Release',
					stepList: [
						{
							name: 'Stage Test and Review',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 1,
							endDate: '01/05/2022',
							endDeviation: 1
						},
						{
							name: 'Promote to Prod',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 0,
							endDate: '01/05/2022',
							endDeviation: 0
						},
						{
							name: 'API Security Test in Prod',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 1,
							endDate: '01/05/2022',
							endDeviation: 1
						},
						{
							name: 'Create/Update Release Note',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 0,
							endDate: '01/05/2022',
							endDeviation: 0
						}
					]
				},
				{
					name: 'Publish and Operate',
					stepList: [
						{
							name: 'Security & Operation Readiness',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 1,
							endDate: '01/05/2022',
							endDeviation: 1
						},
						{
							name: 'Release Note',
							assignTo: 'Team member',
							startDate: '01/05/2022',
							startDeviation: 0,
							endDate: '01/05/2022',
							endDeviation: 0
						}
					]
				}
			],
			useCase: {},
			usecaseData: {},
			userList: [
				{ name: 'John', id: '1' },
				{ name: 'Smith', id: '2' },
				{ name: 'Rado', id: '3' },
				{ name: 'Smyten', id: '4' },
				{ name: 'Oliver', id: '5' },
				{ name: 'Harry', id: '6' },
				{ name: 'George', id: '7' },
				{ name: 'Jack', id: '8' }
			],
		};
	}

	setUseCaseData = (data: any) => {
		if (data && data.stepInput && data.stepInput.S && data.stepInput.S.stages && data.stepInput.S.stages.length > 0) {
			
			console.log(data,'data');
			this.setState({
				useCase: data,
				usecaseData: data
			});
		}
	}

	// getUsecaseStageData = (data: any, index: any) => {
	// 	this.setState({
	// 		activeStage: index
	// 	});
	// };


	// displayWorkflowStage = () => {
	// 	const { usecaseData, activeStage } = this.state;
	// 	let retData = [];
	// 	if (usecaseData && usecaseData && usecaseData.length > 0) {
	// 		for (let i = 0; i < usecaseData.length; i++) {
	// 			let row = usecaseData[i];
	// 			let count =0;
	// 			if (row && row.workflowCheckList) {
	// 				for (let i = 0; i < row.workflowCheckList.length; i++) {
	// 					if (row.workflowCheckList[i].checked) {
	// 						count++;
	// 					}
	// 				}
	// 			}
	// 			if (count == row.workflowCheckList.length) {
	// 				row['status'] = 'completed';
	// 			} else if (count < row.workflowCheckList.length) {
	// 				row['status'] = 'inprogress';
	// 			} else if (count == 0) {
	// 				row['status'] = '';
	// 			}
	// 			retData.push(
	// 				<li
	// 					onClick={() => this.getUsecaseStageData(row, i)}
	// 					className={
	// 						row.status == 'completed' ? 'completed' : row.status == 'inprogress' ? 'inprosseg' : ''
	// 					}
	// 				>
	// 					<span>{i + 1}</span>
	// 					<div className={i == activeStage ? 'active form-control' : 'form-control'}>
	// 						<input
	// 							type="text"
	// 							value={row.name}
	// 							name="name"
	// 							onChange={(e) => this.handleStageChange(e, i)}
	// 							readOnly
	// 						/>
	// 					</div>
	// 				</li>
	// 			);
	// 		}
	// 	}
	// 	return retData;
	// };


	// handleStageChange = (e: any, index: any) => {
	// 	const { usecaseData } = this.state;
	// 	const { name, value } = e.target;
	// 	let stages: any = usecaseData.stages;
	// 	if (usecaseData.stages) {
	// 		stages[index][name] = value;
	// 	}
	// };

	// handleStateChange = (event: any, parentIndex: any, childIndex: any) => {
	// 	const { usecaseData, activeStage } = this.state;
	// 	const { name, value } = event.target;
	// 	const workflowDetail = usecaseData[activeStage];
	// 	if (workflowDetail && workflowDetail.details) {
	// 		if (workflowDetail.details[parentIndex].data && workflowDetail.details[parentIndex].data.length > 0) {
	// 			workflowDetail.details[parentIndex].data[childIndex][name] = value;
	// 		}
	// 	}
	// 	this.setState({
	// 		usecaseData
	// 	});
	// };

	// handleStateChangeCheckList = (e: any, index: any) => {
	// 	const { checked } = e.target;
	// 	const { usecaseData, activeStage } = this.state;
	// 	let count = 0;
	// 	const workflowDetail: any = usecaseData[activeStage];
	// 	if (workflowDetail.workflowCheckList) {
	// 		workflowDetail.workflowCheckList[index]['checked'] = checked;
	// 		for (let i = 0; i < workflowDetail.workflowCheckList.length; i++) {
	// 			if (workflowDetail.workflowCheckList[i].checked) {
	// 				count++;
	// 			}
	// 		}
	// 	}
	// 	if (count == workflowDetail.workflowCheckList.length) {
	// 		usecaseData[activeStage]['status'] = 'completed';
	// 	} else if (count < workflowDetail.workflowCheckList.length) {
	// 		usecaseData[activeStage]['status'] = 'inprogress';
	// 	} else if (count == 0) {
	// 		usecaseData[activeStage]['status'] = '';
	// 	}
	// 	this.setState({
	// 		usecaseData
	// 	});
	// 	this.updateStep();
	// };

	updateStep = (usecaseData:any) => {
		let {useCase}=this.state;
		console.log(useCase.usecaseName.S)
		
		let useCases = {
			name: usecaseData.stepInput.S.name,
			description: usecaseData.stepInput.S.description,
			assignTo: usecaseData.stepInput.S.assignTo,
			stages: usecaseData.stepInput.S.stages
		}
		console.log( useCase)
		this.props.updateWorkflowInput(useCase.usecaseName.S , JSON.stringify(useCases))
	};

	// moveToNextPage = (type: any) => {
	// 	const { usecaseData, activeStage } = this.state;
	// 	if (type == 'next') {
	// 		if (usecaseData && usecaseData.length > 0) {
	// 			this.setState({
	// 				activeStage: activeStage + 1
	// 			});
	// 		}
	// 	} else {
	// 		if (usecaseData && usecaseData.length > 0) {
	// 			let index = activeStage - 1;
	// 			this.setState({
	// 				activeStage: index
	// 			});
	// 		}
	// 	}
	// };

	// displayStageList = () => {
	// 	const { usecaseData, userList } = this.state;
	// 	let retData = [];
	// 	if (usecaseData && usecaseData.length > 0) {
	// 		for (let i = 0; i < usecaseData.length; i++) {
	// 			let stepJSXList = [];
	// 			let stage = usecaseData[i];
	// 			if (stage && stage.details && stage.details.length > 0) {
	// 				for (let j = 0; j < stage.details.length; j++) {
	// 					let step = stage.details[j];
	// 					let userName = '';
	// 					for (const users of userList) {
	// 						if (users.id == step.assignto) {
	// 							userName = users.name;
	// 						}
	// 					}
	// 					stepJSXList.push(
	// 						<tr className="workflow-inner-table">
	// 							<td><span>{step.subStageName}</span></td>
	// 							<td>{userName}</td>
	// 							<td>{step.startDate}</td>
	// 							<td>1</td>
	// 							<td>{step.endDate}</td>
	// 							<td>0</td>
	// 						</tr>
	// 					);
	// 				}
	// 			}
	// 			retData.push(
	// 				<>
	// 					<tr className="workflow-inner-table-head">
	// 						<td colSpan={6}><strong>{stage.name}</strong></td>
	// 					</tr>
	// 					{stepJSXList}
	// 				</>
	// 			);
	// 		}
	// 	}
	// 	return retData;
	// };

	render() {
		const { usecaseData, } = this.state;
		console.log(usecaseData)
		return (<React.Fragment>
			<div className="workflow-content">
				<WorkFlow usecaseData={usecaseData}  editFormData={false} updateStep={this.updateStep} />

			</div>
		</React.Fragment>
		);
	}
}

export default WorkFlowView;
