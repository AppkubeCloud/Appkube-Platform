import * as React from 'react';
import { Breadcrumbs } from '../Breadcrumbs';
import headerIcon from '../../img/header-icon.png';
import resourcesUserImg from '../../img/resources-user-img.png';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
// import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { Link } from 'react-router-dom';

export class ProjectWise extends React.Component<any, any> {
	breadCrumbs: any;
	createStreamRef: any;
	newStreamRef: any;
	manageOutputRef: any;
	allEventRef: any;
	constructor(props: any) {
		super(props);
		this.state = {
			tcpInputs: [],
			openCreateMenu: false,
			streamTableData: [],
			indexSets: []
		};
		this.breadCrumbs = [
			{
				label: 'Home',
				route: `/`
			},
			{
				label: 'Kubernetes | Overview',
				isCurrentPage: true
			}
		];
	}

	render() {
		return (
			<div className="owrkflow-project-wise-container">
				<Breadcrumbs breadcrumbs={this.breadCrumbs} pageTitle="WORKFLOW MANAGEMENT" />
				<div className="project-wise-page-container">
					<div className="project-wise-page-heading">
						<div className="row">
							<div className="col-lg-10">
								<div className="heading-content-left">
									<div className="heading-icon">
										<img src={headerIcon} alt="" />
									</div>
									<div className="heading-content">
										<h3>Xformation Platform</h3>
										<span>Last updated by Siddhesh D 24 min ago</span>
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
											tempor incididunt ut laboreet dolore magna aliqua. Ut enim ad minim, quis
											nostrud exercitation ullamco laboris nisi...
										</p>
									</div>
								</div>
							</div>
							<div className="col-lg-2">
								<div className="heading-content-right">
									<span>
										<i className="fa fa-times" aria-hidden="true" />
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className="project-wise-status">
						<div className="status-fliter">
							<div className="row d-flex align-items-center justify-content-center">
								<div className="col-lg-4">
									<div className="project-status-heading">Project Status</div>
								</div>
								<div className="col-lg-4">
									<div className="filler-search">
										<select>
											<option>Sort by</option>
											<option>Sort by 1</option>
											<option>Sort by 2</option>
											<option>Sort by 3</option>
										</select>
									</div>
								</div>
								<div className="col-lg-4">
									<div className="search-bar">
										<input type="text" className="control-form" placeholder="Search Usecase" />
										<i className="fa fa-search" aria-hidden="true" />
									</div>
								</div>
							</div>
						</div>
						<div className="project-wise-table">
							<div className="table">
								<div className="thead">
									<div className="th">Usecase </div>
									<div className="th">Requirements</div>
									<div className="th">Mock Development</div>
									<div className="th">Actual Development</div>
									<div className="th">CI/CD Test</div>
									<div className="th">Staging/Release</div>
									<div className="th last">Publish/Operate</div>
								</div>
								<div className="tbody">
									<div className="tr">
										<div className="td">
											<Link to="/a/xformation-workflow-engine/procurement-detail">Usecase 1</Link>
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check orange" aria-hidden="true" />
										</div>
										<div className="td" />
										<div className="td" />
										<div className="td" />
									</div>
									<div className="tr">
										<div className="td">
											<Link to="/a/xformation-workflow-engine/procurement-detail">Usecase 2</Link>
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check orange" aria-hidden="true" />
										</div>
										<div className="td" />
										<div className="td" />
									</div>
									<div className="tr">
										<div className="td">
											<Link to="/a/xformation-workflow-engine/procurement-detail">Usecase 3</Link>
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check orange" aria-hidden="true" />
										</div>
										<div className="td" />
										<div className="td" />
									</div>
									<div className="tr">
										<div className="td">
											<Link to="/a/xformation-workflow-engine/procurement-detail">Usecase 4</Link>
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check orange" aria-hidden="true" />
										</div>
									</div>
									<div className="tr">
										<div className="td">
											<Link to="/a/xformation-workflow-engine/procurement-detail">Usecase 5</Link>
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
									</div>
									<div className="tr">
										<div className="td">
											<Link to="/a/xformation-workflow-engine/procurement-detail">Usecase 6</Link>
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check orange" aria-hidden="true" />
										</div>
										<div className="td" />
									</div>
									<div className="tr">
										<div className="td">
											<Link to="/a/xformation-workflow-engine/procurement-detail">Usecase 7</Link>
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
									</div>
									<div className="tr">
										<div className="td">
											<Link to="/a/xformation-workflow-engine/procurement-detail">Usecase 8</Link>
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
										<div className="td">
											<i className="fa fa-check green" aria-hidden="true" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="project-wise-resources">
						<div className="project-resources-heading">Project Resources</div>
						<div className="project-resources-section">
							<div className="project-resources-inner">
								<div className="project-resources-box">
									<div className="user-content">
										<div className="user-img">
											<img src={resourcesUserImg} alt="" />
										</div>
										<div className="user-text">
											<span>Angela Moss</span>
											<p>Project Manager</p>
										</div>
									</div>
									<div className="resources-progress-heading">
										<h4>Current Task-User Document</h4>
										<span>Total Task- 10</span>
									</div>
									<div className="project-progressbar text-center">
										<CircularProgressbar
											value={66}
											text={`80%`}
											strokeWidth={15}
											styles={buildStyles({
												strokeLinecap: {},
												trailColor: '#E5E7E9',
												pathColor: '#6317c2',
												textColor: 'black'
											})}
										/>
										<p>Task Completed</p>
									</div>
								</div>
								<div className="project-resources-box">
									<div className="user-content">
										<div className="user-img">
											<img src={resourcesUserImg} alt="" />
										</div>
										<div className="user-text">
											<span>Angela Moss</span>
											<p>Project Manager</p>
										</div>
									</div>
									<div className="resources-progress-heading">
										<h4>Current Task-User Document</h4>
										<span>Total Task- 10</span>
									</div>
									<div className="project-progressbar text-center">
										<CircularProgressbar
											value={66}
											text={`80%`}
											strokeWidth={15}
											styles={buildStyles({
												strokeLinecap: {},
												trailColor: '#E5E7E9',
												pathColor: '#6317c2',
												textColor: 'black'
											})}
										/>
										<p>Task Completed</p>
									</div>
								</div>
								<div className="project-resources-box">
									<div className="user-content">
										<div className="user-img">
											<img src={resourcesUserImg} alt="" />
										</div>
										<div className="user-text">
											<span>Angela Moss</span>
											<p>Project Manager</p>
										</div>
									</div>
									<div className="resources-progress-heading">
										<h4>Current Task-User Document</h4>
										<span>Total Task- 10</span>
									</div>
									<div className="project-progressbar text-center">
										<CircularProgressbar
											value={66}
											text={`80%`}
											strokeWidth={15}
											styles={buildStyles({
												strokeLinecap: {},
												trailColor: '#E5E7E9',
												pathColor: '#6317c2',
												textColor: 'black'
											})}
										/>
										<p>Task Completed</p>
									</div>
								</div>
								<div className="project-resources-box">
									<div className="user-content">
										<div className="user-img">
											<img src={resourcesUserImg} alt="" />
										</div>
										<div className="user-text">
											<span>Angela Moss</span>
											<p>Project Manager</p>
										</div>
									</div>
									<div className="resources-progress-heading">
										<h4>Current Task-User Document</h4>
										<span>Total Task- 10</span>
									</div>
									<div className="project-progressbar text-center">
										<CircularProgressbar
											value={66}
											text={`80%`}
											strokeWidth={15}
											styles={buildStyles({
												strokeLinecap: {},
												trailColor: '#E5E7E9',
												pathColor: '#6317c2',
												textColor: 'black'
											})}
										/>
										<p>Task Completed</p>
									</div>
								</div>
								<div className="project-resources-box">
									<div className="user-content">
										<div className="user-img">
											<img src={resourcesUserImg} alt="" />
										</div>
										<div className="user-text">
											<span>Angela Moss</span>
											<p>Project Manager</p>
										</div>
									</div>
									<div className="resources-progress-heading">
										<h4>Current Task-User Document</h4>
										<span>Total Task- 10</span>
									</div>
									<div className="project-progressbar text-center">
										<CircularProgressbar
											value={66}
											text={`80%`}
											strokeWidth={15}
											styles={buildStyles({
												strokeLinecap: {},
												trailColor: '#E5E7E9',
												pathColor: '#6317c2',
												textColor: 'black'
											})}
										/>
										<p>Task Completed</p>
									</div>
								</div>
								<div className="project-resources-box">
									<div className="user-content">
										<div className="user-img">
											<img src={resourcesUserImg} alt="" />
										</div>
										<div className="user-text">
											<span>Angela Moss</span>
											<p>Project Manager</p>
										</div>
									</div>
									<div className="resources-progress-heading">
										<h4>Current Task-User Document</h4>
										<span>Total Task- 10</span>
									</div>
									<div className="project-progressbar text-center">
										<CircularProgressbar
											value={66}
											text={`80%`}
											strokeWidth={15}
											styles={buildStyles({
												strokeLinecap: {},
												trailColor: '#E5E7E9',
												pathColor: '#6317c2',
												textColor: 'black'
											})}
										/>
										<p>Task Completed</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
