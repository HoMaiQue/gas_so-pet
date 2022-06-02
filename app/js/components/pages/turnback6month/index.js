import React, { Component } from "react";
import ExportExcel6Month from "../../../../api/exportExcel6Month";
import ExportExcel6MonthOverView from "../../../../api/exportExcel6MonthOverView";
import {
	Row,
	Col,
	Form,
	Input,
	Select,
	Button,
	Table,
	Icon,
	Menu,
	Switch,
	Radio,
	DatePicker,
	message,
	Tabs,
} from "antd";
import getDestinationUserAPI from "../../../../api/getDestinationUserAPI";
const { TabPane } = Tabs;
//import './index.scss';
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import getUserCookies from "getUserCookies";
import Highlighter from "react-highlight-words";
import Constants from "Constants";
import callApi from "./../../../util/apiCaller";
import {REPORTDETAIL,SYNTHESIS} from "./../../../config/config";
import { withNamespaces } from "react-i18next";
import showToast from "showToast";


const { RangePicker } = DatePicker;
const { Option } = Select;
class Turnback6Month extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listUserFixer: [],
			froms: "",
			token:'',
			listDataReport:[],
			listSynthesis:[],
			loading:false,
		};
		this.onSeeReport_Detail = this.onSeeReport_Detail.bind(this);
		this.onSeeSynthesis = this.onSeeSynthesis.bind(this)
	}

	async componentDidMount() {
		let data = this.getListFixer();
		console.log("this.getListFixer()", data);
		var user_cookies = await getUserCookies();
		var token ="Bearer "+user_cookies.token;
		this.setState({
			token
		})
		// console.log("token",token)
	}
	
	async getDataReport_Detail(id,token){
		this.setState({
			loading:true
		})
		let api= REPORTDETAIL+"?from="+id;
		await callApi("GET",api,'',token).then(res=>{
			if(res.status ===200){
				if(res.data.status){
					this.setState({
						listDataReport:res.data.data,
						loading:false
					})
				}else{
					showToast(res.data.message);
					this.setState({
						loading:false
					})
					return false;
				}
			}else{
				showToast("Lỗi khi lấy dữ liệu");
				this.setState({
					loading:false
				})
				return false;
			}
		})
	}
	async getDataSynthesis(id,token){
		this.setState({
			loading:true
		})
		let api = SYNTHESIS+"?from="+id;
		await callApi("GET",api,'',token).then(res=>{
			if(res.status ===200){
				if(res.data.status){
					this.setState({
						listSynthesis:res.data.data,
						loading:false,
					})
				}else{
					showToast(res.data.message);
					this.setState({
						loading:false
					})
					return false;
				}
			}else{
				showToast("Lỗi khi lấy dữ liệu");
				this.setState({
					loading:false
				})
				return false;
			}
		})
	}
	async getListFixer() {
		const dataUsers = await getDestinationUserAPI(
			Constants.FACTORY,
			"",
			Constants.OWNER
		);
		if (dataUsers) {
			if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
				// console.log(dataUsers);
				let listFactoryBacks = [];
				for (let i = 0; i < dataUsers.data.length; i++) {
					listFactoryBacks.push({
						value: dataUsers.data[i].id,
						label: dataUsers.data[i].name,
						...dataUsers.data[i],
					});
				}

				this.setState({ listUserFixer: listFactoryBacks });
				console.log("this.state.listUserFixer, ", this.state.listUserFixer);
			} else {
				showToast(
					dataUsers.data.message
						? dataUsers.data.message
						: dataUsers.data.err_msg,
					2000
				);
			}

			//this.setState({image_link: profile.data.company_logo});
		} else {
			showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
		}
	}
	async onhandleChange(e) {
		console.log("onhandleChange11", e);
		await this.setState({
			froms: e,
		});
		// console.log("this.state.froms", this.state.froms);
		
	}
	handleExcel1 = async () => {
		let data = await ExportExcel6MonthOverView(this.state.froms);
	};
	handleExcel2 = async () => {
		console.log("this.state.id", this.state.froms);
		let data = await ExportExcel6Month(this.state.froms);
	};

	async onSeeReport_Detail(){
		if(this.state.froms !== ''){
			await this.getDataReport_Detail(this.state.froms,this.state.token);
		}else{
			showToast("Chọn kho để xem thông tin",2000);
		}
	}
	async onSeeSynthesis(){
		if(this.state.froms !== ''){
			await this.getDataSynthesis(this.state.froms,this.state.token);
		}else{
			showToast("Chọn kho để xem thông tin",2000);
		}	
	}
	render() {	
		const colums=[
			{
				title: "Số Serial",
        		dataIndex: "serial",
        		key: "serial",
        		
			},
			{
				title: "Màu sắc",
        		dataIndex: "color",
        		key: "color",
        	
			},
			{
				title: "Hạn kiểm định",
        		dataIndex: "checkedDate",
        		key: "checkedDate",
        		
			},
			{
				title: "Loại van",
        		dataIndex: "valve",
        		key: "valve",
        		
			},
			{
				title: "Loại bình",
        		dataIndex: "cylinderType",
        		key: "cylinderType",
        	
			},
			{
				title: "Ngày giao hàng",
        		dataIndex: "deliverDate",
        		key: "deliverDate",
        		
			},
			{
				title: "Mã khách hàng",
        		dataIndex: "customerCode",
        		key: "customerCode",
        		
			},
			{
				title: "Tên khách hàng",
        		dataIndex: "customerName",
        		key: "customerName",
        	
			},
			{
				title: "Mã chi nhánh",
        		dataIndex: "agencyCode",
        		key: "agencyCode",
        		
			},
			{
				title: "Tên chi nhánh",
        		dataIndex: "agencyName",
        		key: "agencyName",
        		
			},
			{
				title: "Số tháng chưa hồi lưu",
        		dataIndex: "dateNotTurnBack",
        		key: "dateNotTurnBack",
        		
			},
		];
		const columsSynthesis=[
			{
				title: "Loại bình",
        		dataIndex: "cylinderType",
        		key: "cylinderType",
        		
			},
			{
				title: "Số lượng",
        		dataIndex: "numberCylinders",
        		key: "numberCylinders",
        	
			},
			{
				title: "Ngày xuất hàng",
        		dataIndex: "deliverDate",
        		key: "deliverDate",
        	
			},
			{
				title: "Mã khách hàng",
        		dataIndex: "customerCode",
        		key: "customerCode",
        		
			},
			{
				title: "Tên khách hàng",
        		dataIndex: "customerName",
        		key: "customerName",
        	
			},
			{
				title: "Mã chi nhánh",
        		dataIndex: "agencyCode",
        		key: "agencyCode",
        		
			},
			{
				title: "Tên chi nhánh",
        		dataIndex: "agencyName",
        		key: "agencyName",
        		
			},
			{
				title: "Số tháng chưa hồi lưu",
        		dataIndex: "dateNotTurnBack",
        		key: "dateNotTurnBack",
        		
			},
		]
		return (
			<div className="main-content">
				<div className="card">
					<div className="card-title">
						<div className="flexbox">
							<h4>{this.props.t("TURNBACK6MONTH")}</h4>
							<Select
								placeholder={this.props.t("SELECT")}
								showSearch
								optionFilterProp="children"
								filterOption={(input, option) =>
									option.props.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
								onChange={(e) => this.onhandleChange(e)}
								style={{ width: "250px" }}
								//disabled={this.state.disabledDrive}
								//value={idDriver}
							>
								{this.state.listUserFixer.map((store, index) => {
									return (
										<Option key={index} value={store.value}>
											{store.label}
										</Option>
									);
								})}
							</Select>
						</div>
					</div>
					<div className="card-body">
						<Tabs defaultActiveKey="1">
							<TabPane tab={this.props.t("REPORT_DETAIL")} key="1">
								<button
									onClick={this.handleExcel2}
									className="btn btn-success mb-2"
								>
									{this.props.t("EXCEL")}
								</button>
								<button
								style={{marginLeft:5}}
									onClick={this.onSeeReport_Detail}
									className="btn btn-success mb-2"
								>
									Xem báo cáo
								</button>
								<div className="table-responsive-xl">
									<div className="dataTables_wrapper container-fluid dt-bootstrap4">
										<div className="row">
											<div className="col-sm-12">	
												<Table
												columns={colums}
												dataSource={this.state.listDataReport}
												bordered
												loading={this.state.loading}
												pagination={{ pageSize: 5, hideOnSinglePage: true }}
												/>
											</div>	
										</div>
									</div>
								</div>
							</TabPane>
							<TabPane tab={this.props.t("REPORT_OVERVIEW")} key="2">
								<button
									onClick={this.handleExcel1}
									className="btn btn-success mb-2"
								>
									{this.props.t("EXCEL")}
								</button>
								<button
								style={{marginLeft:5}}
									onClick={this.onSeeSynthesis}
									className="btn btn-success mb-2"
								>
									Xem báo cáo
								</button>
								<div className="table-responsive-xl">
									<div className="dataTables_wrapper container-fluid dt-bootstrap4">
										<div className="row">
											<div className="col-sm-12">
												<Table
												columns={columsSynthesis}
												dataSource={this.state.listSynthesis}
												bordered
												loading={this.state.loading}
												pagination={{ pageSize: 5, hideOnSinglePage: true }}
												/>
											</div>
										</div>
									</div>
								</div>
							</TabPane>
						</Tabs>
					</div>
				</div>
			</div>
		);
	}
}
export default withNamespaces()(Turnback6Month);
