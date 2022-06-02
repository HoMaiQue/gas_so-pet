import React, { Component } from "react";
import {
	Checkbox,
	Row,
	Col,
	Form,
	Input,
	Select,
	Button,
	Table,
	Icon,
	DatePicker,
	Radio,
	Tooltip,
} from "antd";
import Highlighter from "react-highlight-words";
//import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import getAllUserApi from "getAllUserApi";
import getUserCookies from "getUserCookies";
import getDestinationUserAPI from "getDestinationUserAPI";
import getListBranchAPI from "./../../../../api/getListBranchAPI";
import getInspectorCheckList from "./../../../../api/getInspectorCheckList";

import Constants from "Constants";
import ViewScedulESHistories from "./viewScedulESHistories";
import CheckGasTank from "./checkGasTank";
import "./index.scss";
import { withNamespaces } from "react-i18next";
import {
	GETSTAFF,
	GETINSPECTOR,
	CREATECALENDERINSPECTOR,
	GETCOMPANYTOFIX,
	GETLISTSCHEDULE,
	GETTYPECUSTOMER,
} from "./../../../config/config";
import callApi from "./../../../util/apiCaller";
import TableBinhGas from "./tableBinhGas";
import TableBonGas from "./tableBonGas";
import getAllPartnerAPI from "getPartnerAPI";
import getInspector from "../../../../api/getInspector";
import RecordDelivery from "./RecordDelivery";
import PrinterRecordDelivery from './PrinterRecordDelivery';
import ReactToPrint from "react-to-print";

const { Option } = Select;
class CreateCalenderInspector extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startDate: new Date(),
			listUsersGeneral: [],
			listUsersAgency: [],
			listCompany: [],
			listUserFixer: [],
			valueCompany: "",
			listStaff: [],
			listInspector: [],
			address: "",
			title: "",
			staff: "",
			distributionAgent: "",
			restaurantBuilding: "",
			industrialCustomers: "",
			customerId: "",
			agencyId: "",
			isSelectedDistribution: false,
			Loading: false,
			inspector: [],
			styleFix: "",
			tokenAPI: "",
			listPartner: [],
			listUserFixerMachince: [],
			createdId: "",
			listCreateCalenderInspector1: [],
			listCreateCalenderInspector2: [],
			listCompany: [],
			options1: [],
			options2: [],
			options3: [],
			customer: "",
			option: [],
			gas: "",
			dataoption: [{ name: "SOPET GAS ONE" }],
			visibleHistory: false,
			visiblegastank: false,
			inspectorGetChecklist: [],
			inspectorList: [],
			filter: "",
			statusDataSource: false,
			listInformation:{},
			editingKey:'',
		};
	}

	async componentDidMount() {
		// await this.getListFixer();
		await this.getAllPartner();
		// await this.getListFixerMachince();
		let user_cookies = await getUserCookies();
		//console.log(user_cookies.user.id);
		let token = "Bearer " + user_cookies.token;
		let id = user_cookies.user.id;
		// await this.getAllCompanyToFix(id, token);
		await this.getAllStaff(id, token);
		await this.getAllInspector(id, token);
		this.getListSchedule(id, token);
		this.setState({
			tokenAPI: token,
			createdId: user_cookies.user.id,
		});
		await this.getAllUser();
	}

	getListSchedule = async (id, token) => {
		let params = {
			id: id,
		};
		await this.getIndustryCustomer(id, token);
		await this.getRestaurantCustomer(id, token);
		await this.getDistributionAgencyCustomer(id, token);
		await callApi("POST", GETLISTSCHEDULE, params, token).then((res) => {
			let arr1 = [];
			let arr2 = [];
			// alert("tao day nek")
			console.log("lichbaotri", res.data);
			for (let i = 0; i < res.data.data.length; i++) {
				let nameCustomer="";
				if (res.data.data[i].maintenanceType === "00") { 
					if(res.data.data[i].idCheckingAt.userRole==="SuperAdmin" && res.data.data[i].idCheckingAt.userType==="General"){
						nameCustomer=res.data.data[i].idCheckingAt.name;
					}
					if(res.data.data[i].idCheckingAt.userRole==="SuperAdmin" && res.data.data[i].idCheckingAt.userType==="Agency"){
						this.state.options1.map((item,index)=>{
							if(item.value===res.data.data[i].idCheckingAt.isChildOf){
								nameCustomer=item.name
							}
						});
						this.state.options3.map((item,index)=>{
							if(item.value===res.data.data[i].idCheckingAt.isChildOf){
								nameCustomer=item.name
							}
						});
					}
					// console.log("this.state.options1",this.state.options1);
					// console.log("this.state.options1",this.state.options2);
					// console.log("this.state.options1",this.state.options3);
					arr1.push({
						key: res.data.data[i].id,
						tittle: res.data.data[i].tittle,
						nameCompany: nameCustomer,
						idStaff: res.data.data[i].idStaff,
						idInspector: res.data.data[i].idInspector.name,
						location: res.data.data[i].location,
						maintenanceType:
							res.data.data[i].maintenanceType === "00" ? "Bình gas" : "",
						maintenanceDate: res.data.data[i].maintenanceDate,
						isDone: res.data.data[i].isDone,
					});
				} else {
					if(res.data.data[i].idCheckingAt.userRole==="SuperAdmin" && res.data.data[i].idCheckingAt.userType==="General"){
						nameCustomer=res.data.data[i].idCheckingAt.name;
					}
					if(res.data.data[i].idCheckingAt.userRole==="SuperAdmin" && res.data.data[i].idCheckingAt.userType==="Agency"){
						this.state.options1.map((item,index)=>{
							if(item.value===res.data.data[i].idCheckingAt.isChildOf){
								nameCustomer=item.name
							}
						});
						this.state.options3.map((item,index)=>{
							if(item.value===res.data.data[i].idCheckingAt.isChildOf){
								nameCustomer=item.name
							}
						});
					}
					arr2.push({
						key: res.data.data[i].id,
						tittle: res.data.data[i].tittle,
						nameCompany: nameCustomer,
						idStaff: res.data.data[i].idStaff,
						idInspector: res.data.data[i].idInspector.name,
						location: res.data.data[i].location,
						maintenanceType:
							res.data.data[i].maintenanceType === "01" ? "Bồn gas" : "",
						maintenanceDate: res.data.data[i].maintenanceDate,
						isDone: res.data.data[i].isDone,
					});
				}
			}
			
			let sortArr1=[];
			let sortArr2=[];
			if(arr1){
			let n = 0;
			for (let m = arr1.length - 1; m >= 0; m--) {
				sortArr1[n] = arr1[m];
				n++;
			}
			}
			if(arr2){
				let n = 0;
				for (let m = arr2.length - 1; m >= 0; m--) {
					sortArr2[n] = arr2[m];
					n++;
				}
					
			}
			this.setState(
				{
					listCreateCalenderInspector1: sortArr1,
					listCreateCalenderInspector2: sortArr2,
				},
				() =>
					console.log(
						"this.state.listCreateCalenderInspector",
						this.state.listCreateCalenderInspector2
					)
			);
		});
	};

	async getRestaurantCustomer(id, token) {
		let reqListCustomer = {
			isChildOf: id,
			customerType: "Restaurant_Apartment",
		};
		let params = {
			reqListCustomer,
		};
		await callApi("POST", GETTYPECUSTOMER, params, token).then((res) => {
			this.setState({
				listUsersRestaurantCustomer: res.data.data,
			});
			//  console.log("khach hang nha hang", res.data);
			if (res.data) {
				if (res.data.success === true) {
					this.setState({
						options3: res.data.data.map((user) => {
							return {
								value: user.id,
								label: user.customerCode,
								name: user.name,
							};
						}),
					});
				} else {
					showToast(
						res.data.message ? res.data.message : res.data.err_msg,
						2000
					);
					return false;
				}
			} else {
				showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
			}
		});
	}

	async getDistributionAgencyCustomer(id, token) {
		let reqListCustomer = {
			isChildOf: id,
			customerType: "Distribution_Agency",
		};
		let params = {
			reqListCustomer,
		};
		await callApi("POST", GETTYPECUSTOMER, params, token).then((res) => {
			if (res.data) {
				if (res.data.success === true) {
					this.setState({
						options2: res.data.data.map((user) => {
							return {
								value: user.id,
								label: user.customerCode,
								name: user.name,
								address: user.invoiceAddress,
							};
						}),
					});
				} else {
					showToast(
						res.data.message ? res.data.message : res.data.err_msg,
						2000
					);
					return false;
				}
			} else {
				showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
			}
		});
	}

	async getIndustryCustomer(id, token) {
		let reqListCustomer = {
			isChildOf: id,
			customerType: "Industry",
		};
		let params = {
			reqListCustomer,
		};
		await callApi("POST", GETTYPECUSTOMER, params, token).then((res) => {
			//  console.log("khach hang cong nghiep", res.data);
			if (res.data) {
				if (res.data.success === true) {
					// this.setState({ listUsers: res.data.data });
					this.setState({
						options1: res.data.data.map((user) => {
							return {
								value: user.id,
								label: user.customerCode,
								name: user.name,
							};
						}),
					});
				} else {
					showToast(
						res.data.message ? res.data.message : res.data.err_msg,
						2000
					);
					return false;
				}
			} else {
				showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
			}
		});
	}
	async getAllCompanyToFix(id, token) {
		let params = {
			id: id,
		};
		await callApi("POST", GETCOMPANYTOFIX, params, token).then((res) => {
			// console.log(res.data.data);
			this.setState({
				listCompany: res.data.data,
			});
		});
	}
	async getAllUserGeneral() {
		const dataUsers = await getAllUserApi(Constants.GENERAL);
		if (dataUsers) {
			if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
				this.setState({ listUsersGeneral: dataUsers.data });
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
	async getAllUserAGENCY() {
		const dataUsers = await getAllUserApi(Constants.AGENCY);
		if (dataUsers) {
			if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
				this.setState({ listUsersAgency: dataUsers.data });
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
	//nhà máy sửa chữa
	async getListFixerMachince() {
		const dataUsers = await getDestinationUserAPI(Constants.FIXER);
		if (dataUsers) {
			if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
				this.setState({
					listUserFixerMachince: dataUsers.data,
				});
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
	//cong ty con
	async getListFixer() {
		const dataUsers = await getDestinationUserAPI(
			Constants.FACTORY,
			"",
			Constants.OWNER
		);
		if (dataUsers) {
			if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
				this.setState({ listUserFixer: dataUsers.data });
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
	//lấy đối tác
	async getAllPartner() {
		//const jobMetaData = await this.getJobMetaData();
		const arr = [];
		const dataUserRelation = await getAllPartnerAPI();
		if (dataUserRelation) {
			this.setState(
				{
					listPartner: dataUserRelation.data,
				},
				() => console.log("đối tac là:", this.state.listPartner)
			);

			//this.setState({image_link: profile.data.company_logo});
		} else {
			showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
		}
	}

	async getAllStaff(id, token) {
		//const jobMetaData = await this.getJobMetaData();
		let prams = {
			id: id,
		};
		await callApi("POST", GETSTAFF, prams, token).then((res) => {
			this.setState({
				listStaff: res.data.data,
			});
		});

		//showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
	}
	async getAllInspector(id, token) {
		//const jobMetaData = await this.getJobMetaData();
		let prams = {
			id: id,
		};
		await callApi("POST", GETINSPECTOR, prams, token).then((res) => {
			this.setState(
				{
					listInspector: res.data.data,
				},
				() => console.log(this.state.listInspector)
			);
		});

		//showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
	}

	// onChangeCompany = (e) => {
	//   this.setState({
	//     agencyId: e.target.value,
	//   });
	// };
	onChangeOption2 = (value) => {
		this.setState(
			{
				valueCompany: value,
			},
			() => {
				this.state.options2.map((v) => {
					if (v.value === this.state.valueCompany) {
						this.setState({
							address: v.address,
						});
					}
				});
			}
		);
	};
	onChangeCompany = (e) => {
		this.setState(
			{
				valueCompany: e.target.value,
			},
			() => {
				let index = this.state.listCompany.findIndex(
					(company) => company.id === this.state.valueCompany
				);
				this.setState({
					address: this.state.listCompany[index].address,
				});
				console.log("index", index);
			}
		);
	};
	handleFilter = async (e) => {
		console.log("eeeee", e.target.value);
		await this.setState({
			filter: e.target.value,
		});
	};
	onChangeCurrent = async (e) => {
		// console.log('radio checked', e.target.value);
		e.preventDefault();
		// await this.getListBr("");

		await this.setState({
			value: e.target.value,
			customerId: "",
			listCompany: [],
		});
		// else
		if (e.target.value === 3) {
			document.getElementById("industrialCustomers").style.display = "block";
			document.getElementById("distributionAgent").style.display = "none";
			document.getElementById("restaurantBuilding").style.display = "none";
			this.setState({ isSelectedDistribution: true });
			console.log("isSelectedDistribution3", this.state.isSelectedDistribution);
		} else if (e.target.value === 2) {
			document.getElementById("restaurantBuilding").style.display = "block";
			document.getElementById("distributionAgent").style.display = "none";
			document.getElementById("industrialCustomers").style.display = "none";
			this.setState({ isSelectedDistribution: false });
			console.log("isSelectedDistribution2", this.state.isSelectedDistribution);
		} else if (e.target.value === 1) {
			document.getElementById("distributionAgent").style.display = "block";
			document.getElementById("restaurantBuilding").style.display = "none";
			document.getElementById("industrialCustomers").style.display = "none";
			console.log("isSelectedDistribution", this.state.isSelectedDistribution);
			await this.setState({
				distributionAgent: "",
				restaurantBuilding: "",
				industrialCustomers: "",
				isSelectedDistribution: false,
				idCustomer: "",
			});
		}
	};
	handleChangeStaff = (value) => {
		let stringStaff = "";
		for (let i = 0; i < value.length; i++) {
			stringStaff += value[i];
			if (i < value.length - 1) {
				stringStaff += ",";
			} else if (i === value.length - 1) {
				stringStaff += "";
			}
		}
		this.setState({
			staff: stringStaff,
		});
	};

	handleChangeDate = (date) => {
		this.setState({
			startDate: date,
		});
	};

	onChange = (e) => {
		let target = e.target;
		let name = target.name;
		let value = target.value;
		this.setState({
			[name]: value,
		});
	};

	handleChangeInspector = (value) => {
		let stringInspector = "";
		for (let i = 0; i < value.length; i++) {
			stringInspector += value[i];
			if (i < value.length - 1) {
				stringInspector += ",";
			} else if (i === value.length - 1) {
				stringInspector += "";
			}
		}
		this.setState({
			inspector: stringInspector,
		});
	};
	onChangeCustomer = (e) => {
		// let stringCustomer = "";
		// for (let i = 0; i < value.length; i++) {
		//   stringCustomer += value[i];
		//   if (i < value.length - 1) {
		//     stringCustomer += ",";
		//   } else if (i === value.length - 1) {
		//     stringCustomer += "";
		//   }
		// }
		// console.log('duc', e.target.value)
		// this.setState({
		//   title: stringCustomer,
		// })
		// console.log('duc', e.target.value)
		e.preventDefault();
		this.setState({
			title: e.target.value,
		});
	};
	onChangeAddress = (e) => {
		let target = e.target;
		let name = target.name;
		let value = target.value;
		this.setState({
			[name]: value,
		});
	};

	onChangeStyleFix = (value) => {
		this.setState({
			styleFix: value,
		});
	};

	onCreate = async (e) => {
		e.preventDefault();
		let {
			address,
			// title,
			staff,
			inspector,
			styleFix,
			startDate,
			valueCompany,
			// customer,
		} = this.state;
		let dateNow = new Date();
		let dateChose = startDate;
		let d1 = Date.parse(dateNow);
		let d2 = Date.parse(dateChose);
		let el = document.querySelector("#area");

		console.log("el71",el.value);
		if (
			!address ||
			// !title ||
			!staff ||
			!inspector ||
			!styleFix ||
			!startDate ||
			!valueCompany
			// !customer
		) {
			alert(this.props.t("INFOR_PROVIDER"));
		}
		if (
			address &&
			// title &&
			staff &&
			inspector &&
			styleFix &&
			startDate &&
			valueCompany
			// customer
		) {
			if (moment(d2).format("YYYY-MM-DD") < moment(d1).format("YYYY-MM-DD")) {
				alert("Ngày bạn chọn phải lớn hơn hoặc bằng ngày hiện tạis");
			} else if (
				moment(d2).format("YYYY-MM-DD") >= moment(d1).format("YYYY-MM-DD")
			) {
				let date = moment(startDate).format("YYYY-MM-DD");
				let params = {
					tittle: "Thông báo mới",
					unitTesting: staff,
					idCheckingAt: valueCompany,
					idStaff: staff,
					idInspector: inspector,
					location: address,
					maintenanceType: styleFix,
					maintenanceDate: date,
					createdBy: this.state.createdId,
					area:el.value
				};
				await callApi(
					"POST",
					CREATECALENDERINSPECTOR,
					params,
					this.state.tokenAPI
				).then((res) => {
					// console.log("bao tri", res.data);
					if (res.data.success === true) {
						alert("Tạo thành công");
						window.location.reload(false);
					} else {
						alert("Đã có lỗi khi tạo");
						return false;
					}
				});
			}
		}
	};
	getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
		}) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={(node) => {
						this.searchInput = node;
					}}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() =>
						this.handleSearch(selectedKeys, confirm, dataIndex)
					}
					style={{ width: 188, marginBottom: 8, display: "block" }}
				/>
				<Button
					type="primary"
					onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
					icon="search"
					size="small"
					style={{ width: 90, marginRight: 8 }}
				>
					Search
				</Button>
				<Button
					onClick={() => this.handleReset(clearFilters)}
					size="small"
					style={{ width: 90 }}
				>
					Reset
				</Button>
			</div>
		),
		filterIcon: (filtered) => (
			<Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
		onFilterDropdownVisibleChange: (visible) => {
			if (visible) {
				setTimeout(() => this.searchInput.select());
			}
		},
		render: (text) =>
			this.state.searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
					searchWords={[this.state.searchText]}
					autoEscape
					textToHighlight={text.toString()}
				/>
			) : (
				text
			),
	});

	handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		this.setState({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex,
		});
	};

	handleReset = (clearFilters) => {
		clearFilters();
		this.setState({ searchText: "" });
	};

	async getListBr(id) {
		const dataApi = await getListBranchAPI(id);
		console.log("data", dataApi);
		if (dataApi.data.success) {
			this.setState({
				listCompany: dataApi.data.data,
				customerId: id,
			});
		} else {
			this.setState({
				customerId: id,
			});
		}
	}

	async getAllUser() {
		//const jobMetaData = await this.getJobMetaData();
		const dataUsers = await getAllUserApi(Constants.GENERAL);
		// console.log("ducvidai", dataUsers);
		if (dataUsers) {
			if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
				// this.setState({ listUsers: dataUsers.data });
				this.setState({
					option: dataUsers.data.map((user) => {
						return {
							value: user.id,
							label: user.name,
						};
					}),
				});
			} else {
				// showToast(
				//   dataUsers.data.message
				//     ? dataUsers.data.message
				//     : dataUsers.data.err_msg,
				//   2000
				// );
			}
			//this.setState({image_link: profile.data.company_logo});
		} else {
			// showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
		}
	}

	onChangeCompanyFilterProp = async (value) => {
		// console.log(this.state.warehouseId)
		this.setState({
			customerId: value,
		});
		await this.getListBr(value);
		console.log("this.state.customerId", value);
	};

	onChangeGas = (e) => {
		e.preventDefault();
		// console.log('minh', e.target.value)
		this.setState({
			staff: e.target.value,
		});
	};
	onClickHistory = async (index) => {
		console.log("index111", index);
		let data = await getInspectorCheckList(index.key);
		console.log("data111111111", data);
		this.setState({
			// visibleHistory: true,
			listInformation:index,
			inspectorGetChecklist: data.data.data,
		});
	};
	onClickHistoryEmty = () => {
		alert("Đơn chưa hoàn thành nên không có lịch sử");
	};
	onClickHistorys = async (e) => {
		let data = await getInspector(e.key);
		// console.log("dataaaaaa", data);
		//e.preventDefault();
		// console.log("eeeeeee", e);
		this.setState({
			inspectorList: data.data.data,
			visiblegastank: true,
		});
	};
	onClickHistoryCallBack = (status) => {
		this.setState({
			visibleHistory: status,
			statusDataSource: true,
		});
	};
	onClickGasTankCallBack = (status) => {
		this.setState({
			visiblegastank: status,
			statusDataSource: true,
		});
	};
	isEditing = (record) => record.key === this.state.editingKey;
	edit(key) {
		// // console.log('key', key)
		this.setState({ editingKey: key });
	}
	onClickHistory1=async(index)=>{
		console.log("index111", index);
		let data = await getInspectorCheckList(index.key);
		console.log("data111111111", data);
		this.setState({
			editingKey:index.key,
			listInformation:index,
			inspectorGetChecklist: data.data.data,
		});
	}
	render() {
		let {
			address,
			title,
			staff,
			inspector,
			styleFix,
			startDate,
			valueCompany,
			customer,
			isSelectedDistribution,
			customerId,
			Loading,
			agencyId,
		} = this.state;
		// console.log("listCompany", this.state.listCompany);
		// console.log("option", this.state.options2);
		const radioStyle = {
			display: "block",
			height: "30px",
			lineHeight: "30px",
		};
		const columns = [
			{
				title: this.props.t("STATUS"),
				dataIndex: "isDone",
				key: "isDone",
				...this.getColumnSearchProps("isDone"),
				render(record, index) {
					return (
						<Checkbox defaultChecked={record} disabled>
							{record === true ? "Đã kiếm tra" : "Chưa kiểm tra"}
						</Checkbox>
					);
				},
			},
			{
				title: this.props.t("CREATE_DATE_MAIN"),
				dataIndex: "maintenanceDate",
				key: "maintenanceDate",
				...this.getColumnSearchProps("maintenanceDate"),
				sortDirections: ["descend", "ascend"],
				sorter: (a, b) => {
					return moment(a.maintenanceDate) - moment(b.maintenanceDate);
				},
			},
			{
				title: this.props.t("CREATE_CHECK_TEAM"),
				dataIndex: "idStaff",
				key: "idStaff",
				width: '200px',
				...this.getColumnSearchProps("idStaff"),
			},

			// {
			//   title: "Tên khách hàng",
			//   dataIndex: "nameCompany",
			//   key: "nameCompany",
			//   ...this.getColumnSearchProps("nameCompany"),
			// },
			{
				title: this.props.t("CUSTOMER"),
				dataIndex: "nameCompany",
				key: "nameCompany",
				...this.getColumnSearchProps("nameCompany"),
			},
			{
				title: this.props.t("CHECK_BY"),
				dataIndex: "idInspector",
				key: "idInspector",
				...this.getColumnSearchProps("idInspector"),
			},

			{
				title: this.props.t("TYPE_MAINTAINCES"),
				dataIndex: "maintenanceType",
				key: "maintenanceType",
				...this.getColumnSearchProps("maintenanceType"),
			},
			{
				title: this.props.t("ADDRESS"),
				dataIndex: "location",
				key: "location",
				...this.getColumnSearchProps("location"),
			},
			{
				title: this.props.t("ACTION"),
				key: "operation",
				width: 150,
				align: "center",
				fixed: "right",
				render: (record, index) => {
					// const { enablePrint } = this.state;
					console.log("index1111", index.maintenanceType);
					console.log("index2", record,'index',index);
					const editable = this.isEditing(record);
					console.log("Aaaaa", editable)
					return (
						<div title="">
							{record.maintenanceType === "Bình gas" &&
							record.isDone === true ? (
								<div>
									<Tooltip title={this.props.t("HISTORY")}>
										<Button
											type="primary"
											style={{ marginRight: 5 }}
											onClick={() => this.onClickHistory(index)}
											icon="history"
											data-toggle="modal" 
											data-target="#record-delivery"
										/>
									</Tooltip>
									{!editable?(
										<Tooltip title={'Tải xuống'}>
										<Button
											type="primary"
											style={{ marginRight: 5 }}
											onClick={() => this.onClickHistory1(index)}
											icon="download"
											
										/>
									</Tooltip>
									):''}
									{editable?(
									<Tooltip title={'In'}>
										<ReactToPrint
											style={{ marginLeft: 5 }}
											copyStyles={true}
											// documentTitle={this.state.titlePrint}
											// onBeforeGetContent={this.handleOnBeforeGetContent}
											trigger={() => (
												<Button
													style={{ marginRight: 5 }}
													type="primary"
													icon="printer"
													
												/>
											)}
											content={() => this.componentRef}
										// pageStyle="@page"
										/>
									</Tooltip>
									):''}
								</div>
							) : record.maintenanceType === "Bồn gas" &&
							  record.isDone === true ? (
								<Tooltip title={this.props.t("HISTORY")}>
									<Button
										type="primary"
										style={{ marginRight: 5 }}
										onClick={(e) => this.onClickHistorys(record)}
										icon="history"
									/>
								</Tooltip>
							) : (
								<Tooltip title={this.props.t("HISTORY")}>
									<Button
										type="primary"
										style={{ marginRight: 5 }}
										onClick={() => this.onClickHistoryEmty()}
										icon="history"
									/>
								</Tooltip>
							)}
						</div>
					);
				},
			},
		];
		//console.log(this.state.valueCompany);

		return (
			<div className="main-content">
				<div className="card">
					<div className="card-title">
						<h4>{this.props.t("CREATE_SCEDULES")}</h4>
					</div>
					<div>
						<Row>
							<Col xs={1}></Col>
							<Col xs={22}>
								<Form>
									{/* <Row style={{ marginTop: 20 }}>
                <Col>
                 
                </Col>
              </Row> */}
									<Row>
										<Col xs={14} md={6}>
											<div className="form-group group">
												<Form.Item
													label={this.props.t("CUSTOMER_ID")}
													style={{
														display: "block",
														width: "200px",
														height: "170px",
													}}
												>
													<Radio.Group
														onChange={this.onChangeCurrent}
														className=""
														style={{
															width: "320px",
														  }}
													>
														<Radio
															style={radioStyle}
															value={1}
															onChange={this.onChangeCurrent}
															// value={customerCode}
														>
															<label className="group1">
																{this.props.t("INDUSTRIAL_CUSTOMERS")}
															</label>
															<Select
																showSearch
																placeholder="Select a person"
																className="form-control control1"
																id="distributionAgent"
																name="distributionAgent"
																style={{
																	display: "none",
																	position: "absolute",
																	top: "100px",
																}}
																// onChange={this.onradioChange}
																optionFilterProp="children"
																filterOption={true}
																onChange={this.onChangeCompanyFilterProp}
																// filterOption={(inputValue, option) =>
																//   option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
																// onChange={e => this.onhandClick(e)}
																value={customerId}
															>
																<Option value="">
																	{this.props.t("CHOOSE")}
																</Option>
																{this.state.options1.map((item, index) => (
																	<Option value={item.value} key={index}>
																		{item.label} - {item.name}
																	</Option>
																))}
															</Select>
														</Radio>
														<Radio
															style={radioStyle}
															value={2}
															onChange={this.onChangeCurrent}
														>
															<label className="group1">
																{this.props.t("APARTMENT")}
															</label>
															<Select
																showSearch
																className="form-control control1"
																id="restaurantBuilding"
																name="restaurantBuilding"
																style={{
																	top: "70px",
																	position: "absolute",
																	display: "none",
																}}
																// onChange={this.onradioChange}
																optionFilterProp="children"
																filterOption={true}
																onChange={this.onChangeCompanyFilterProp}
																value={customerId}
															>
																<Option value="">
																	{this.props.t("CHOOSE")}
																</Option>
																{this.state.options3.map((item, index) => (
																	<Option value={item.value} key={index}>
																		{item.label} - {item.name}
																	</Option>
																))}
															</Select>
														</Radio>

														<Radio
															style={radioStyle}
															value={3}
															onChange={this.onChangeCurrent}
														>
															<label className="group1">
																{this.props.t("DISTRIBUTOR")}
															</label>
															<Select
																showSearch
																className="form-control control1"
																id="industrialCustomers"
																name="industrialCustomers"
																style={{
																	display: "none",
																	position: "absolute",
																	top: "40px",
																}}
																// onChange={this.onradioChange}
																optionFilterProp="children"
																filterOption={true}
																onChange={this.onChangeOption2}
															>
																<Option value="">
																	{this.props.t("CHOOSE")}
																</Option>
																{this.state.options2.map((item, index) => (
																	<Option value={item.value} key={index}>
																		{item.label}-{item.name}
																	</Option>
																))}
															</Select>
														</Radio>
													</Radio.Group>
												</Form.Item>
											</div>
										</Col>
										<Col xs={2}></Col>
										<Col xs={14} md={6}>
											{Loading === false ? (
												<Form.Item
													label={this.props.t("AGENCY_ID")}
													style={{ display: "block", width: "200px" }}
												>
													<select
														className="custom-select"
														disabled={isSelectedDistribution}
														id="agencyId"
														name="agencyId"
														onChange={this.onChangeCompany}
													>
														<option selected>{this.props.t("CHOOSE")}</option>
														{this.state.listCompany.length > 0
															? this.state.listCompany.map((one, index) => {
																	return (
																		<option key={index} value={one.id}>
																			{one.name}
																		</option>
																	);
															  })
															: ""}
													</select>
												</Form.Item>
											) : (
												<Form.Item
													label={this.props.t("AGENCY_ID")}
													style={{ display: "block", width: "200px" }}
												>
													<Input className="input" value="" />
												</Form.Item>
											)}
										</Col>
										<Col xs={2}></Col>
										{/* <Col xs={14} md={6}>
                      <Form.Item label={this.props.t('CUSTOMER')}>
                        <Select
                          showSearch
                          optionFilterProp="children"
                          onChange={this.onChangeCompany}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.listCompany.map((company, index) => {
                            return (
                              <Option key={index} value={company.id}>
                                {company.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={2}></Col> */}
										<Col xs={14} md={6}>
											<Form.Item
												label={this.props.t("ADDRESS")}
												style={{ display: "block" }}
											>
												<Input
													value={address}
													onChange={this.onChangeAddress}
													className="form-control"
													type="text"
													name="address"
													id="address"
												/>
											</Form.Item>
										</Col>
										<Col xs={2}></Col>
										
									</Row>
									<Row>
										<Col xs={14} md={12}>
												<Form.Item
													label={this.props.t("CREATE_CHECK_TEAM")}
													style={{ display: "block" }}
												>
													<select
														className="custom-select "
														id="staff"
														// name="gas"
														onChange={this.onChangeGas}
														name="staff"
														filterOption={(input, option) =>
															option.props.children
																.toLowerCase()
																.indexOf(input.toLowerCase()) >= 0
														}
														style={{ width: "274px" }}
													>
														<option selected>{this.props.t("SELECT")}</option>
														{this.state.dataoption.map((item, index) => {
															return (
																<option key={index} value={item.id}>
																	{item.name}{" "}
																</option>
															);
														})}
														{/* <Input onChange={this.onChange} name="staff" value={staff} /> */}
													</select>
												</Form.Item>
										</Col>
										<Col xs={14} md={12}>
												<Form.Item
													label={this.props.t("INSPECTION_AREA")}
													style={{ display: "block" }}
												>
													<Input id="area" placeholder={this.props.t("INSPECTION_AREA")} />
												</Form.Item>
										</Col>
									</Row>
									<Row>
										<Col xs={14} md={6}>
											<Form.Item label={this.props.t("CHECK_BY")}>
												<Select
													mode="tags"
													style={{ width: "100%" }}
													onChange={this.handleChangeInspector}
													filterOption={(input, option) =>
														option.props.children
															.toLowerCase()
															.indexOf(input.toLowerCase()) >= 0
													}
													//tokenSeparators={[","]}
												>
													{this.state.listInspector.map((inspector, index) => {
														return (
															<Option key={index} value={inspector.id}>
																{inspector.name}
															</Option>
														);
													})}
												</Select>
											</Form.Item>
										</Col>
										<Col xs={2}></Col>
										<Col xs={14} md={6}>
											<Form.Item
												label={this.props.t("TN_AND_DATE")}
												style={{ display: "block" }}
											>
												<DatePicker
													//selected={moment(this.state.startDate)}
													defaultValue={moment()}
													onChange={this.handleChangeDate}
													//dateFormat="DD/MM/YYYY"
													format="DD/MM/YYYY"
													style={{ width: "260px" }}
												/>
											</Form.Item>
										</Col>

										<Col xs={2}></Col>
										<Col xs={14} md={6}>
											<Form.Item label={this.props.t("TYPE_MAINTAINCES")}>
												<Select
													showSearch
													optionFilterProp="children"
													onChange={this.onChangeStyleFix}
													filterOption={(input, option) =>
														option.props.children
															.toLowerCase()
															.indexOf(input.toLowerCase()) >= 0
													}
												>
													<Option value="00">Hệ thống Bình gas</Option>
													<Option value="01">Hệ thống Bồn gas</Option>
												</Select>
											</Form.Item>
										</Col>
									</Row>
								</Form>
							</Col>
							<Col xs={1}></Col>
						</Row>

						{styleFix === "00" ? <TableBinhGas /> : ""}
						{styleFix === "01" ? <TableBonGas /> : ""}
						<Row>
							<Col xs={1} md={4}></Col>
							<Col xs={22} md={16}>
								<Form.Item>
									<Button
										style={{ width: "100%" }}
										type="primary"
										htmlType="submit"
										className="login-form-button"
										onClick={this.onCreate}
									>
										{this.props.t("CREATE_MAINTENANCE")}
									</Button>
								</Form.Item>
							</Col>
							<Col xs={1} md={4}></Col>
						</Row>
						<Row style={{ marginLeft: 50 }}>
							<Form.Item label={this.props.t("FILTER")}>
								<Radio.Group defaultValue="GASCYLINDER"
									//value={warning ? warning.position : "notConfirmed"}
									onChange={this.handleFilter}
								>
									<Radio.Button value="GASCYLINDER">
										{this.props.t("GAS")}
									</Radio.Button>
									<Radio.Button value="GASTANK">
										{this.props.t("GASTANK")}
									</Radio.Button>
									
								</Radio.Group>
							</Form.Item>
						</Row>
						<Row>
							<Col xs={1}></Col>
							<Col xs={22}>
								<Table
									columns={columns}
									dataSource={
										this.state.filter === "GASTANK"
											? this.state.listCreateCalenderInspector2
											: this.state.listCreateCalenderInspector1
									}
									scroll={{ x: 1300 }}
								/>
							</Col>
							<Col xs={1}></Col>
						</Row>
					</div>
				</div>

				{/*<ViewScedulESHistories
					statusDataSource={this.state.statusDataSource}
					inspectorGetChecklist={this.state.inspectorGetChecklist}
					visibleHistory={this.state.visibleHistory}
					onClickHistoryCallBack={(status) =>
						this.onClickHistoryCallBack(status)
					}
				/>*/}
				<CheckGasTank
					visible={this.state.visiblegastank}
					inspectorList={this.state.inspectorList}
					onClickGasTankCallBack={(status) =>
						this.onClickGasTankCallBack(status)
					}
				/>
				<RecordDelivery 
				inspectorGetChecklist={this.state.inspectorGetChecklist} 
				listInformation={this.state.listInformation}/>


			
					<PrinterRecordDelivery 
							ref={(el) => (this.componentRef = el)} 
							inspectorGetChecklist={this.state.inspectorGetChecklist} 
							listInformation={this.state.listInformation}
					/>
				
			</div>
		);
	}
}
export default withNamespaces()(CreateCalenderInspector);
