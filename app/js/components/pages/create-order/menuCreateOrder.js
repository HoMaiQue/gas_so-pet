import React, { Component } from "react";
import {
	CREATEORDER,
	GETALLORDER,
	GETORDERHISTORIES,
	DELETE_ORDER,
} from "./../../../config/config";
import {
	Row,
	Col,
	Input,
	Button,
	Table,
	Icon,
	Dropdown,
	Badge,
	Menu,
	Switch,
	Radio,
	Form,
	DatePicker,
	Tooltip,
} from "antd";
import "./index.scss";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import getAllUserApi from "getAllUserApi";
import getUserCookies from "getUserCookies";
import getDestinationUserAPI from "getDestinationUserAPI";
import Highlighter from "react-highlight-words";
import Constants from "Constants";
import callApi from "./../../../util/apiCaller";
import required from "required";
import { GETTYPECUSTOMER } from "../../../config/config";
import getListBranchAPI from "./../../../../api/getListBranchAPI";
import ViewOrderHistories from "./viewOrderHistories";
import EditOrder from "./editOrder";
import openNotificationWithIcon from "./../../../helpers/notification";
import { withNamespaces } from "react-i18next";
import ReactToPrint from "react-to-print";
import ImportPrinter from "./../printer/ImportPrinter";
import ImportAllPrinter from "./../printer/ImportAllPrinter";
import getExportDataPrint from "../../../../api/getExportDataPrint";
import getDetailExportOrderAPI from "../../../../api/getDetailExportOrderAPI";
import MenuCreateOrderExcel from "./menuCreateOrderExcel";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { contains, param } from "jquery";
import { any } from "prop-types";
import deleteOrderAPI from "../../../../api/deleteOrderAPI";
import showToast from "showToast";
import getTurnbackDataPrint from "../../../../api/getTurnbackDataPrint"
import getExportDataPrintByDate from "../../../../api/getExportDataPrintByDate"
const { RangePicker } = DatePicker;

const menu = (
	<Menu>
		<Menu.Item>Action 1</Menu.Item>
		<Menu.Item>Action 2</Menu.Item>
	</Menu>
);

class MenuCreateOrder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//
			data: [],
			isLoading: false,
			isLoadingViewOrderHistories: false,
			isLoadingViewEditOrder: false,
			viewingRecord: "",
			//
			listOrderNow: [],
			listOrderOld: [],
			listOrderOldBegin: [],
			listOrderNowBegin: [],
			listMenuCreateOrderTableExcel: [],
			selectedRowKeys: [],
			selectedRows: [],
			titlePrint: "",
			//
			listAllOrder: [],
			orderHistories: [],

			//
			bordered: true,
			enableFilter: false,
			size: "default",
			warning: "none",
			warningValue: "none",
			startDate: "",
			endDate: "",

			// Print
			text: "AAA",
			// enablePrint: false,
			editingKey: "",
			exportDataPrint: [],
			exportAllDataPrint: [],
			// detailExportData
			detailDataExport: [],
			dataSource: [],
			check: true
		};
	}

	isEditing = (record) => record.key === this.state.editingKey;

	edit(key) {
		// // console.log('key', key)
		this.setState({ editingKey: key });
	}

	getAllOrder = async (id, token) => {
		this.setState({ isLoading: true });
		let user_cookies = await getUserCookies();
		let parmas = {
			orderCreatedBy: user_cookies.user.id,
		};
		try {
			await callApi("POST", GETALLORDER, parmas, token).then((res) => {
				let temp = [];
				console.log("data order", res.data);
				let i = 0;
				for (let item of res.data.order) {
					temp.push({
						key: i,
						orderId: item.id ? item.id : "",
						customerCode: item.customerId ? item.customerId.customerCode : "",
						orderCode: item.orderCode ? item.orderCode : "",
						customerId: item.customerId ? item.customerId.name : "",
						agencyId: item.agencyId ? item.agencyId.name : "",
						agencyCode: item.agencyId ? item.agencyId.agencyCode : "",

						// warehouseId: item.warehouseId
						//valve: item.valve ? item.valve : '',
						//color: item.color ? item.color : '',
						// time: moment(item.time).format("HH:mm:ss"),
						//cylinderType: item.cylinderType ? item.cylinderType.name : '',
						// listCylinder: item.listCylinder,
						// listCylinder: item.listCylinder,
						note: item.note ? item.note : "",
						// status: item.status === "INIT" ? '' : item.status,

						// idCustomer: item.idCustomer.name,
						// idBranch: item.idBranch.name,
						// numberCylinders: item.numberCylinders ? item.numberCylinders : 0,
						listCylinder: item.listCylinder ? item.listCylinder : [],
						warehouseId: item.warehouseId ? item.warehouseId.name : "",
						// warehouseCode:item.warehouseId?item.warehouseId.warehouseCode:"",
						// date: moment(item.orderDate).format("DD/MM/YYYY"),
						// expected_DeliveryDate: item.expected_DeliveryDate,
						createdAt: item.createdAt ? item.createdAt : "",
						expected_DeliveryDate: moment(item.deliveryDate).format(
							"DD/MM/YYYY"
						),
						expected_DeliveryTime: (item.status === "DELIVERED" || item.status === "COMPLETED") ? moment(item.orderHistories[0].createdAt).format("HH:mm") : moment(item.deliveryDate).format("HH:mm"),
						deliveryDate: item.deliveryDate ? item.deliveryDate : "",
						// status: item.status === "INIT" ? "Khởi tạo"
						// : item.status === "CONFIRMED" ? "Đã xác nhận đơn hàng"
						// : item.status === "DELIVERING" ? "Đang vận chuyển"
						// : item.status === "DELIVERED" ? "Đã giao"
						// : item.status === "COMPLETED" ? "Đã hoàn thành"
						// : item.status === "CANCELLED" ? "Đã bị hủy"
						// : item.status,
						status: item.status ? item.status : "",
					});
					i++;
				}

				//console.log("tempTest",Date.parse((temp[1].deliveryDate)));
				let listOrderNowDay = [];
				let listOrderOldDay = [];
				temp.map((item, index) => {
					// // console.log("item[index]",item.deliveryDate);
					let createdAtDate = item.createdAt;
					let endDay = new Date().setHours(23, 59, 59, 999);
					let start = new Date().setHours(0, 0, 0, 0);
					if (Date.parse(createdAtDate) >= start) {
						// console.log("Date.parse((item[index].deliveryDate))",Date.parse((item.deliveryDate)));
						listOrderNowDay.push(item);
					} else if (Date.parse(createdAtDate) < start) {
						listOrderOldDay.push(item);
					}
				});
				// console.log("listOrderNowDay",listOrderNowDay);
				// console.log("listOrderNowDay", listOrderOldDay);
				// console.log("listAllOrder11111111111",this.state.listAllOrder);
				// console.log("resres", res);
				// console.log("listOrderNowBegin", listOrderNowDay);
				console.log("listOrderOldDay", listOrderOldDay);
				this.setState({
					listAllOrder: temp,
					isLoading: false,
					listOrderNow: listOrderNowDay,
					listOrderOld: listOrderOldDay,
					listOrderOldBegin: listOrderOldDay,
					listOrderNowBegin: listOrderNowDay,
				});
			});
		} catch (err) {
			console.log(err);
		}
	};
	refresh() {
		this.forceUpdate(async () => {
			await this.getAllOrder();
		});
	}
	async deleteOrderAPI(record) {
		let answer = window.confirm(this.props.t("CHECK_DELETE"));
		let order;
		if (answer) {
			order = await deleteOrderAPI(record);
			if (order) {
				if (order.data.success === true) {
					showToast(this.props.t("DELETE_SUCCESS"), 3000);
					this.refresh();
					return true;
				} else {
					showToast(this.props.t("DELETE_UN_SUCCESS"), 3000);
					return false;
				}
			} else {
				showToast("Xảy ra lỗi trong quá trình xóa đơn hàng ");
				return false;
			}
		}
	}

	handleButtonExportExcel = () => {

		const data = this.state.listOrderNow.filter((order) => {
			// console.log("order.status",order.status);
			return order.status === "INIT";
		});
		console.log("data1111111111", data);
		let dataTable = [];
		let binh12A = [];
		let binh45A = [];
		let binh50A = [];
		let binh12COA = [];

		//bình 50
		let cylinders50POLGRAY = [];
		let cylinders50VANGRAY = [];
		//bình 45
		let cylinders45POLGRAY = [];
		let cylinders452VANGRAY = [];
		//bình 12
		let cylinders12POLGRAY = [];
		let cylinders12POLRED = [];
		let cylinders12POLYELLOW = [];
		//bình 12CO
		let cylinders12COCOMPACTSHELL = [];
		let cylinders12COCOMPACTVT = [];
		let cylinders12COCOMPACTPETRO = [];
		let cylinders12COCOMPACTORANGE = [];
		if (data) {
			for (let item in data) {
				// console.log("dataListOrderNow", data);
				for (let i = 0; i < data[item].listCylinder.length; i++) {
					// console.log("data[item].listCylinder[i]", data[item].listCylinder[i]);
					if (data[item].listCylinder[i].cylinderType === "CYL50KG") {
						binh50A += parseInt(data[item].listCylinder[i].numberCylinders, 10);
					}
					// }if (data[item].listCylinder.cylinderType === "CYL45KG") {
					//     binh45A = binh45A + parseInt(data[item].listCylinder[i].numberCylinders,10);
					// } else  {
					//       binh12A = binh12A + parseInt(data[item].listCylinder[i].numberCylinders,10);
					// }
				}
				binh50A = data[item].listCylinder.filter((item) => {
					return item.cylinderType === "CYL50KG";
				});
				let count50 = 0;
				let count50POLGRAY = 0;
				let count502VANGRAY = 0;
				for (let i = 0; i < binh50A.length; i++) {
					count50 += +binh50A[i].numberCylinders;
					if (binh50A[i].cylinderType === "CYL50KG") {
						if (
							(binh50A[i].valve === "POL" && binh50A[i].color === "GRAY") ||
							(binh50A[i].valve === "POL" && binh50A[i].color === "Xám")
						) {
							count50POLGRAY += +binh50A[i].numberCylinders;
							cylinders50POLGRAY[0] = {
								color: binh50A[i].color,
								cylinderType: binh50A[i].cylinderType,
								numberCylinders: +binh50A[i].numberCylinders,
								valve: binh50A[i].valve,
							};
						} else if (
							(binh50A[i].valve === "2 VAN" && binh50A[i].color === "GRAY") ||
							(binh50A[i].valve === "2 VAN" && binh50A[i].color === "Xám")
						) {
							count502VANGRAY += +binh50A[i].numberCylinders;
							cylinders50VANGRAY.push({
								color: binh50A[i].color,
								cylinderType: binh50A[i].cylinderType,
								numberCylinders: binh50A[i].numberCylinders,
								valve: binh50A[i].valve,
							});
						}
					}
				}
				// console.log("count50", count50);
				// console.log("binh50", binh50A);
				// console.log("cylinders50VANGRAY", cylinders50VANGRAY);
				// console.log("cylinders50POLGRAY", cylinders50POLGRAY);
				binh45A = data[item].listCylinder.filter((item) => {
					return item.cylinderType === "CYL45KG";
				});
				let count45 = 0;
				let count45POLGRAY = 0;
				let count452VANGRAY = 0;
				for (let i = 0; i < binh45A.length; i++) {
					count45 += +binh45A[i].numberCylinders;
					if (binh45A[i].cylinderType === "CYL45KG") {
						if (
							(binh45A[i].valve === "POL" && binh45A[i].color === "GRAY") ||
							(binh45A[i].valve === "POL" && binh45A[i].color === "Xám")
						) {
							count45POLGRAY += +binh45A[i].numberCylinders;
							cylinders45POLGRAY.push({
								color: binh45A[i].color,
								cylinderType: binh45A[i].cylinderType,
								numberCylinders: binh45A[i].numberCylinders,
								valve: binh45A[i].valve,
							});
						} else if (
							(binh45A[i].valve === "2 VAN" && binh45A[i].color === "GRAY") ||
							(binh45A[i].valve === "2 VAN" && binh45A[i].color === "Xám")
						) {
							count452VANGRAY += +binh45A[i].numberCylinders;
							cylinders452VANGRAY.push({
								color: binh45A[i].color,
								cylinderType: binh45A[i].cylinderType,
								numberCylinders: binh45A[i].numberCylinders,
								valve: binh45A[i].valve,
							});
						}
					}
				}
				// console.log("count45", count45);
				// console.log("binh45", binh45A);
				// console.log("cylinders45VANGRAY", cylinders452VANGRAY);
				// console.log("cylinders45VANGRAY", cylinders45POLGRAY);
				binh12A = data[item].listCylinder.filter((item) => {
					return item.cylinderType === "CYL12KG";
				});
				let count12 = 0;
				let count12POLGRAY = 0;
				let count12POLYELLOW = 0;
				let count12POLRED = 0;
				for (let i = 0; i < binh12A.length; i++) {
					count12 += +binh12A[i].numberCylinders;
					if (binh12A[i].cylinderType === "CYL12KG") {
						if (
							(binh12A[i].valve === "POL" && binh12A[i].color === "GRAY") ||
							(binh12A[i].valve === "POL" && binh12A[i].color === "Xám")
						) {
							count12POLGRAY += +binh12A[i].numberCylinders;
							cylinders12POLGRAY.push({
								color: binh12A[i].color,
								cylinderType: binh12A[i].cylinderType,
								numberCylinders: binh12A[i].numberCylinders,
								valve: binh12A[i].valve,
							});
						} else if (
							(binh12A[i].valve === "POL" && binh12A[i].color.trim() === "RED") ||
							(binh12A[i].valve === "POL" && binh12A[i].color.trim() === "Đỏ")
						) {
							count12POLRED += +binh12A[i].numberCylinders;
							cylinders12POLRED.push({
								color: binh12A[i].color,
								cylinderType: binh12A[i].cylinderType,
								numberCylinders: binh12A[i].numberCylinders,
								valve: binh12A[i].valve,
							});
						} else if (
							(binh12A[i].valve === "POL" && binh12A[i].color.trim() === "YELLOW") ||
							(binh12A[i].valve === "POL" && binh12A[i].color.trim() === "Vàng")
						) {
							count12POLYELLOW += +binh12A[i].numberCylinders;
							cylinders12POLYELLOW.push({
								color: binh12A[i].color,
								cylinderType: binh12A[i].cylinderType,
								numberCylinders: binh12A[i].numberCylinders,
								valve: binh12A[i].valve,
							});
						}
					}
				}
				// console.log("count12", count12);
				// console.log("binh12", binh12A);
				// console.log("cylinders12POLYELLOW", cylinders12POLYELLOW);
				// console.log("cylinders12POLRED", cylinders12POLRED);
				// console.log("cylinders12POLGRAY", cylinders12POLGRAY);

				binh12COA = data[item].listCylinder.filter((item) => {
					return item.cylinderType === "CYL12KGCO";
				});
				// console.log("binh12COA", binh12COA);
				let count12CO = 0;
				let count12COCOMPACTSHELL = 0;
				let count12COCOMPACTVT = 0;
				let count12COMPACTPETRO = 0;
				let count12COMPACTORANGE = 0;
				for (let i = 0; i < binh12COA.length; i++) {
					count12CO += +binh12COA[i].numberCylinders;
					if (binh12COA[i].cylinderType === "CYL12KGCO") {
						if (
							binh12COA[i].valve === "COMPACT" &&
							binh12COA[i].color.trim() === "Shell"
						) {
							count12COCOMPACTSHELL += +binh12COA[i].numberCylinders;
							cylinders12COCOMPACTSHELL.push({
								color: binh12COA[i].color,
								cylinderType: binh12COA[i].cylinderType,
								numberCylinders: binh12COA[i].numberCylinders,
								valve: binh12COA[i].valve,
							});
						} else if (
							binh12COA[i].valve === "COMPACT" &&
							binh12COA[i].color.trim() === "VT"
						) {
							count12COCOMPACTVT += +binh12COA[i].numberCylinders;
							cylinders12COCOMPACTVT.push({
								color: binh12COA[i].color,
								cylinderType: binh12COA[i].cylinderType,
								numberCylinders: binh12COA[i].numberCylinders,
								valve: binh12COA[i].valve,
							});
						} else if (
							(binh12COA[i].valve === "COMPACT" &&
								binh12COA[i].color.trim() === "Petro")
						) {
							count12COMPACTPETRO += +binh12COA[i].numberCylinders;
							cylinders12COCOMPACTPETRO.push({
								color: binh12COA[i].color,
								cylinderType: binh12COA[i].cylinderType,
								numberCylinders: binh12COA[i].numberCylinders,
								valve: binh12COA[i].valve,
							});
						} else if (
							(binh12COA[i].valve === "COMPACT" &&
								binh12COA[i].color.trim() === "ORANGE") ||
							(binh12COA[i].valve.trim() === "COMPACT" && binh12COA[i].color.trim() === "Cam")
						) {
							count12COMPACTORANGE += +binh12COA[i].numberCylinders;
							cylinders12COCOMPACTORANGE.push({
								color: binh12COA[i].color,
								cylinderType: binh12COA[i].cylinderType,
								numberCylinders: binh12COA[i].numberCylinders,
								valve: binh12COA[i].valve,
							});
						}
					}
				}
				// console.log("count12", count12CO)
				// console.log("binh12", binh12COA);
				// console.log("cylinders12COCOMPACTORANGE",cylinders12COCOMPACTORANGE);
				// console.log("cylinders12COCOMPACTPETRO",cylinders12COCOMPACTPETRO);
				// console.log("cylinders12COCOMPACTSHELL",cylinders12COCOMPACTSHELL);
				// console.log("cylinders12COCOMPACTVT",cylinders12COCOMPACTVT);

				// console.log("Bình 12", binh12A);
				// console.log("Bình 12", count12POLGRAY);
				// console.log("Bình 12", count12POLRED);
				// console.log("Bình 12", count12POLYELLOW);
				// console.log("Bình 12CO", binh12COA);
				// console.log("Bình 12CO", count12COMPACTORANGE);
				// console.log("Bình 12CO", count12COMPACTPETRO);
				// console.log("Bình 12CO", count12COCOMPACTSHELL);
				// console.log("Bình 12CO", count12COCOMPACTVT);
				// console.log("Bình 45", binh45A);
				// console.log("Bình 45", count452VANGRAY);
				// console.log("Bình 45", count45POLGRAY);
				// console.log("Bình 50", binh50A);
				// console.log("Bình 50", count502VANGRAY);
				// console.log("Bình 50", count50POLGRAY);

				// console.log("data[item].expected_DeliveryDate",moment(data[item].createdAt).format("DD/MM/YYYY"));
				let dateBegin = moment(data[item].createdAt).format("DD/MM/YYYY");
				const statusBegin =
					data[item].status === "INIT"
						? "Khởi tạo"
						: data[item].status === "CONFIRMED"
							? "Đã xác nhận đơn hàng"
							: data[item].status === "DELIVERING"
								? "Đang vận chuyển"
								: data[item].status === "DELIVERED"
									? "Đã giao"
									: data[item].status === "COMPLETED"
										? "Đã hoàn thành"
										: data[item].status === "CANCELLED"
											? "Đã bị hủy"
											: data[item].status;
				if (data) {
					let obj = {
						No: item,
						createdAt: dateBegin,
						customerCode: data[item].customerCode,
						orderCode: data[item].orderCode,
						Provine: data[item].agencyId,
						name: data[item].customerId,
						numderDriver: "",
						deliveryDate:
							data[item].expected_DeliveryTime === "00:00"
								? data[item].expected_DeliveryDate
								: data[item].expected_DeliveryDate +
								" - " +
								data[item].expected_DeliveryTime,

						// 'Số lượng bình': data[item].listCylinder[items].numberCylinders,
						binh12: count12,
						count12POLGRAY: count12POLGRAY,
						count12POLRED: count12POLRED,
						count12POLYELLOW: count12POLYELLOW,
						binh12CO: count12CO,
						count12COCOMPACTSHELL: count12COCOMPACTSHELL,
						count12COCOMPACTVT: count12COCOMPACTVT,
						count12COMPACTPETRO: count12COMPACTPETRO,
						count12COMPACTORANGE: count12COMPACTORANGE,
						binh45: count45,
						count45POLGRAY: count45POLGRAY,
						count452VANGRAY: count452VANGRAY,
						binh50: count50,
						count502VANGRAY: count502VANGRAY,
						count50POLGRAY: count50POLGRAY,
						ghiChu: data[item].note,
						status: statusBegin,
						agencyCode: data[item].agencyCode,
					};
					dataTable.push(obj);
				}
			}
		}
		console.log("dataTable2222", dataTable);
		console.log("order.status", this.state.listOrderNow);
		this.setState({
			listMenuCreateOrderTableExcel: dataTable,
		});
	};
	async componentDidMount() {
		// await this.getAllUser();
		let user_cookies = await getUserCookies();
		//console.log(user_cookies.user.id);
		let token = "Bearer " + user_cookies.token;
		let id = user_cookies.user.id;
		this.setState({
			user_type: user_cookies.user.userType,
			tokenAPI: token,
			idAccount: id,
		});
		await this.getAllOrder(id, token);
		await this.handleButtonExportExcel();
	}

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
			this.state.searchText === "Khởi tạo" ? record[dataIndex].toString().toLowerCase().includes(("INIT").toLowerCase()) :
				this.state.searchText === "Đã xác nhận đơn hàng" ? record[dataIndex].toString().toLowerCase().includes(("CONFIRMED").toLowerCase()) :
					this.state.searchText === "Đang vận chuyển" ? record[dataIndex].toString().toLowerCase().includes(("DELIVERING").toLowerCase()) :
						this.state.searchText === "Đã giao" ? record[dataIndex].toString().toLowerCase().includes(("DELIVERED").toLowerCase()) :
							this.state.searchText === "Đã hoàn thành" ? record[dataIndex].toString().toLowerCase().includes(("COMPLETED").toLowerCase()) :
								this.state.searchText === "Đã bị hủy" ? record[dataIndex].toString().toLowerCase().includes(("CANCELLED").toLowerCase()) :
									record[dataIndex].toString().toLowerCase().includes((this.state.searchText).toLowerCase()),
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

	getOrderHistories = async (record, index) => {
		// // console.log('getOrderHistories record', record)
		// // console.log('getOrderHistories index', index)
		this.setState({
			isLoadingViewOrderHistories: true,
			viewingRecord: record.orderId,
		});

		let user_cookies = await getUserCookies();
		let token = "Bearer " + user_cookies.token;

		let params = {
			orderId: record.orderId,
		};
		await callApi("POST", GETORDERHISTORIES, params, token).then((res) => {
			if (res.data.status && res.data.resCode === "SUCCESS-00003") {
				let temp = [];
				let i = 0;
				for (let item of res.data.orderHistories) {
					temp.push({
						key: i,
						status:
							item.status === "INIT"
								? "Khởi tạo"
								: item.status === "CONFIRMED"
									? "Đã xác nhận đơn hàng"
									: item.status === "DELIVERING"
										? "Đang vận chuyển"
										: item.status === "DELIVERED"
											? "Đã giao"
											: item.status === "COMPLETED"
												? "Đã hoàn thành"
												: item.status === "CANCELLED"
													? "Đã bị hủy"
													: item.status,
						content: item.content ? item.content : "",
						createdBy: item.createdBy ? item.createdBy.name : "",
						createdAt: item.createdAt
							? moment(item.createdAt).format("DD/MM/YYYY - HH:mm")
							: "",
					});
					i++;
				}

				this.setState({
					orderHistories: temp,
					isLoadingViewOrderHistories: false,
				});
			} else {
				// openNotificationWithIcon("error","Đã có lỗi xảy ra")
				this.setState({ isLoadingViewOrderHistories: false });
				openNotificationWithIcon("error", res.data.message);
			}
		});
	};

	expandedRowRender = (record, index) => {
		// // console.log('expandedRowRender', record, index)
		const columnsNestedTables = [
			{ title: "Loại bình", dataIndex: "cylinderType", key: "cylinderType" },
			{ title: "Màu sắc", dataIndex: "color", key: "color" },
			{ title: "Loại van", dataIndex: "valve", key: "valve" },
			{
				title: "Số lượng bình",
				dataIndex: "numberCylinders",
				key: "numberCylinders",
			},
			// { title: 'Đã giao', /* dataIndex: 'numberCylinders', key: 'numberCylinders' */ },
		];

		const data = [];
		const lengthListCylinder = record.listCylinder.length;
		// console.log("record.listCylinder",record.listCylinder)
		for (let i = 0; i < lengthListCylinder; i++) {
			data.push({
				key: i,
				cylinderType: record.listCylinder[i].cylinderType,
				color:
					record.listCylinder[i].color === "GRAY"
						? this.props.t("GRAY")
						: record.listCylinder[i].color === "YELLOW"
							? this.props.t("YELLOW")
							: record.listCylinder[i].color === "ORANGE"
								? this.props.t("ORANGE")
								: record.listCylinder[i].color === "RED"
									? this.props.t("RED")
									: record.listCylinder[i].color,
				valve: record.listCylinder[i].valve,
				numberCylinders: record.listCylinder[i].numberCylinders,
			});
		}
		//set biến height để style expand column
		document.documentElement.style.setProperty(
			`--height`,
			`${data.length * 54 + 56}px`
		);
		return (
			<div class="ant-table-body">
				<table class="">
					<thead class="ant-table-thead">
						<tr>
							<th class="">
								<span class="ant-table-header-column">
									<div>
										<span class="ant-table-column-title">
											{this.props.t("CYLINDER_TYPE")}
										</span>
										<span class="ant-table-column-sorter"></span>
									</div>
								</span>
							</th>
							<th class="">
								<span class="ant-table-header-column">
									<div>
										<span class="ant-table-column-title">
											{this.props.t("COLOR")}
										</span>
										<span class="ant-table-column-sorter"></span>
									</div>
								</span>
							</th>
							<th class="">
								<span class="ant-table-header-column">
									<div>
										<span class="ant-table-column-title">
											{this.props.t("VALVE_TYPE")}
										</span>
										<span class="ant-table-column-sorter"></span>
									</div>
								</span>
							</th>
							<th class="ant-table-row-cell-last">
								<span class="ant-table-header-column">
									<div>
										<span class="ant-table-column-title">
											{this.props.t("NUMBER_CYLINDERS")}
										</span>
										<span class="ant-table-column-sorter"></span>
									</div>
								</span>
							</th>
						</tr>
					</thead>
					<tbody class="ant-table-tbody">
						{data.map((item) => {
							return (
								<tr
									class="ant-table-row ant-table-row-level-0"
									data-row-key="0"
								>
									<td class="">{item.cylinderType}</td>
									<td class="">{item.color}</td>
									<td class="">{item.valve}</td>
									<td class="">{item.numberCylinders}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	};

	handleToggle = (prop) => (enable) => {
		this.setState({ [prop]: enable });
	};

	handleSizeChange = (e) => {
		this.setState({ size: e.target.value });
	};

	handleDataChange = (enableFilter) => {
		this.setState({ enableFilter });
	};

	handleWarningChange = (e) => {
		const { value } = e.target;
		// const { listAllOrder, tempData } = this.state
		// // console.log('warning', value)
		// // console.log('listAllOrder', listAllOrder)
		// if (value==='INIT') {
		// //     // console.log('notConfirmed')
		//     const data = listAllOrder.filter(order=> {
		//         return order.status === 'INIT'
		//     })
		// //     // console.log('data', data)
		//     this.setState({data: data})
		// }
		// if (value==='CONFIRMED') {
		//     const data = listAllOrder.filter(order=> {
		//         return order.status === 'CONFIRMED'
		//     })
		//     this.setState({data: data})
		// }
		// if (value==='DELIVERING') {
		//     const data = listAllOrder.filter(order=> {
		//         return order.status === 'DELIVERING'
		//     })
		//     this.setState({data: data})
		// }

		this.setState(
			{
				warning: value === "none" ? "none" : { position: value },
				warningValue: value,
			},
			this.filterData
		);

		//this.filterData()
	};
	onClickPrint = async () =>{
		let result = await getExportDataPrintByDate(this.state.endDate, this.state.startDate)
		if (result.data.status === true) {
			this.setState({
				check: false,
				exportAllDataPrint: result.data
			})
		}
		else {
			this.setState({
				check: true
			})
		}
		showToast(result.data.message)
	}
	onChangeTime = async (dates, dateStrings) => {
		
		// // console.log('From: ', dates[0], ', to: ', dates[1]);
		// // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);

		// // console.log(moment(dates[0]).toDate())
		// // console.log(moment(dates[0]).isValid())
		this.setState(
			{
				check: true,
				startDate: dates[0] ? moment(dates[0]).toDate() : "",
				endDate: dates[0] ? moment(dates[1]).toDate() : "",
			},
			this.filterData
		);

	};

	filterData = () => {
		const {
			startDate,
			endDate,
			listAllOrder,
			data,
			listOrderOld,
			listOrderNow,
			warningValue,
		} = this.state;

		// // console.log('filterData')

		// if (enableFilter) {
		//     let tempData = listAllOrder

		//     // --- Lọc theo thời gian ---
		//     // if (startDate && endDate) {
		//     //     tempData =
		//     // }

		//     // --- Lọc theo trạng thái đơn hàng ---
		//     if (warningValue === 'INIT') {
		// //         // console.log('notConfirmed')
		//         const data = listAllOrder.filter(order => {
		//             return order.status === 'INIT'
		//         })
		// //         // console.log('data', data)
		//         this.setState({ data: data })
		//     }
		//     if (warningValue === 'CONFIRMED') {
		//         const data = listAllOrder.filter(order => {
		//             return order.status === 'CONFIRMED'
		//         })
		//         this.setState({ data: data })
		//     }
		//     if (warningValue === 'DELIVERING') {
		//         const data = listAllOrder.filter(order => {
		//             return order.status === 'DELIVERING'
		//         })
		//         this.setState({ data: data })
		//     }

		//     return data
		// }
		// else {
		//     return listAllOrder
		// }

		let tempData = listOrderOld;
		let tempDataNow = listOrderNow;
		if (this.state.enableFilter === true) {
			if (startDate && endDate) {
				tempData = this.state.listOrderOldBegin;
				//  console.log('startDate && endDate', tempData)
				const data = tempData.filter((order) => {
					// console.log("Date.parse((startDate))",Date.parse((startDate)));
					// console.log("Date.parse((startDate))",Date.parse((endDate)));
					// console.log("Date.parse((startDate))",Date.parse((order.deliveryDate)));
					return (
						Date.parse(startDate) <= Date.parse(moment(order.deliveryDate)) &&
						Date.parse(moment(order.deliveryDate)) <= Date.parse(endDate)
					);
				});
				// console.log("data",data),

				this.setState({ listOrderOld: data });
			}
			// console.log("tempData",listOrderOld);

			// // console.log('warning', value)
			// // console.log('listAllOrder', listAllOrder)
			if (warningValue === "INIT") {
				tempData = this.state.listOrderOldBegin;
				// console.log("listOrderOld1",this.state.listOrderOldBegin);
				// // console.log('INIT')
				const data = tempData.filter((order) => {
					return order.status === "INIT";
				});
				//console.log('data', data)
				this.setState({ listOrderOld: data });
			} else if (warningValue === "CONFIRMED") {
				tempData = this.state.listOrderOldBegin;
				const data = tempData.filter((order) => {
					return order.status === "CONFIRMED";
				});
				this.setState({ listOrderOld: data });
			} else if (warningValue === "DELIVERING") {
				tempData = this.state.listOrderOldBegin;
				const data = tempData.filter((order) => {
					return order.status === "DELIVERING";
				});
				this.setState({ listOrderOld: data });
			} else if (warningValue === "COMPLETED") {
				tempData = this.state.listOrderOldBegin;
				const data = tempData.filter((order) => {
					return (order.status === "COMPLETED" || order.status === "DELIVERED");
				});
				this.setState({ listOrderOld: data });
			} else if (warningValue === "CANCELLED") {
				tempData = this.state.listOrderOldBegin;
				const data = tempData.filter((order) => {
					return order.status === "CANCELLED";
				});
				this.setState({ listOrderOld: data });
			} else if (warningValue === "DELIVERED") {
				tempData = this.state.listOrderOldBegin;
				const data = tempData.filter((order) => {
					return order.status === "DELIVERED";
				});
				this.setState({ listOrderOld: data });
			}

		} else if (this.state.enableFilter === false) {
			// if (startDate && endDate) {
			// //     // console.log('startDate && endDate', startDate, endDate)
			//     tempDataNow =  tempDataNow.filter(order=>{
			//         return (startDate<=moment(order.deliveryDate) && moment(order.deliveryDate)<=endDate)
			//     })
			// }

			// // console.log('warning', value)
			// // console.log('listAllOrder', listAllOrder)
			if (warningValue === "INIT") {
				tempDataNow = this.state.listOrderNowBegin;
				// console.log("listOrderOld1",this.state.listOrderOldBegin);
				// // console.log('INIT')
				const data = tempDataNow.filter((order) => {
					return order.status === "INIT";
				});
				// // console.log('data', data)
				this.setState({ listOrderNow: data });
			} else if (warningValue === "CONFIRMED") {
				tempDataNow = this.state.listOrderNowBegin;
				const data = tempDataNow.filter((order) => {
					return order.status === "CONFIRMED";
				});
				this.setState({ listOrderNow: data });
			} else if (warningValue === "DELIVERING") {
				tempDataNow = this.state.listOrderNowBegin;
				const data = tempDataNow.filter((order) => {
					return order.status === "DELIVERING";
				});
				this.setState({ listOrderNow: data });
			} else if (warningValue === "COMPLETED") {
				tempDataNow = this.state.listOrderNowBegin;
				const data = tempDataNow.filter((order) => {
					return (order.status === "COMPLETED" || order.status === "DELIVERED");
				});
				this.setState({ listOrderNow: data });
			} else if (warningValue === "DELIVERED") {
				tempDataNow = this.state.listOrderNowBegin;
				const data = tempDataNow.filter((order) => {
					return order.status === "DELIVERED";
				});
				this.setState({ listOrderNow: data });
			} else if (warningValue === "CANCELLED") {
				tempDataNow = this.state.listOrderNowBegin;
				const data = tempDataNow.filter((order) => {
					return order.status === "CANCELLED";
				});
				this.setState({ listOrderNow: data });
			}
		}
	};

	handleOnBeforeGetContent = () => {
		// console.log("`onBeforeGetContent` called"); // tslint:disable-line no-console
		this.setState({ text: "Loading new text..." /* , isLoading: true */ });

		return new Promise((resolve) => {
			// setTimeout(() => {
			//     this.setState({ text: "New, Updated Text!"/* , isLoading: false */ }, resolve);
			// }, 2000);
			this.setState(
				{
					text:
						"New, Updated Text!" /* , isLoading: false */ /* , exportDataPrint: 'CUONG' */,
				},
				resolve
			);
		});
	};

	getAllDataPrint = async () => {
		let result = await getTurnbackDataPrint()

		if (result.status === 200) {
			this.setState({
				// enablePrint: true,

				exportAllDataPrint: result.data,

			});
		}
	}
	getDataPrint = async (orderId, key) => {
		console.log("orderId", orderId);
		console.log("orderId", key);
		const result = await getExportDataPrint(orderId);
		// console.log("result", result.data);
		// console.log("result", result.data[0].agencyName);
		if (result.status === true) {
			// console.log("orderId",orderId);
			let text = "_" + result.data[0].customerName;
			let agencyCode = key.agencyCode === "ZZZ" ? "" : "";
			let agencyName = key.agencyId !== "" ? "_" + key.agencyId : "";
			let date = result.data[0].date;
			let data =
				moment(date).format("DD/MM/YYYY") +
				text +
				agencyName +
				agencyCode +
				"_DEV";
			// console.log("text1",moment(text1).format("DD/MM/YYYY"));
			this.setState({
				// enablePrint: true,
				editingKey: key.key,
				exportDataPrint: result.data,
				titlePrint: data,
			});
		}
	};

	getDetailExportOrder = async () => {
		// console.log('clicked getDetailExportOrder', this.state.viewingRecord)
		const result = await getDetailExportOrderAPI(this.state.viewingRecord);
		if (result.status === true) {
			let data = [];
			if (result.data.exportHistory) {
				const cylinders = result.data.exportHistory.cylinders;
				const lengthListCylinder = cylinders.length;
				for (let i = 0; i < lengthListCylinder; i++) {
					data.push({
						key: i,
						serial: cylinders[i].serial,
						color: cylinders[i].color,
						valve: cylinders[i].valve,
						weight: cylinders[i].weight,
						status: "STATUS",
					});
				}
			}
			this.setState({ dataSource: data });
			// this.setState({
			//     // enablePrint: true,
			//     // editingKey: key,
			//     detailDataExport: result.data
			// })
		}
	};
	onSelectChange = (selectedRowKeys, selectedRows) => {
		// console.log('selectedRowKeys changed: ', selectedRowKeys);
		// console.log('selectedRows changed: ', selectedRows);
		this.setState({ selectedRowKeys, selectedRows });
	};
	render() {
		console.log(this.props.t("ORDER_ID"));
		// console.log("this.componentRef", this.componentRef);
		// console.log("this.componentRef", this.state.text);
		const {
			bordered,
			enableFilter,
			size,
			selectedRowKeys
			// enablePrint
		} = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
			// onSelect: this.onSelectRowChange,
		};
		const defaultPageSize = {
			defaultPageSize: 10,
		};
		// console.log("listAllOrderTest",this.state.listAllOrder);
		// console.log("listAllOrderdata",this.state.data);
		// console.log("(typeof cylinder.weightCylinder) % 1", 15.9 % 1)
		// const columns = [
		//     {
		//         title: this.props.t("ORDER_ID"),
		//         dataIndex: "orderCode",
		//         key: "orderCode",
		//         ...this.getColumnSearchProps("orderCode"),
		//     },
		//     {
		//         title:this.props.t("CREATE_DATE") ,
		//         dataIndex: "createdAt",
		//         key: "createdAt",
		//         ...this.getColumnSearchProps("createdAt"),
		//         sortDirections: ['descend', 'ascend'],
		//         sorter: (a, b) =>  {
		//             return (moment(a.createdAt) - moment(b.createdAt))
		//         },
		//         render: (text) => {
		//             return (
		//                 <div>{moment(text).format("DD/MM/YYYY - HH:mm:ss")}</div>
		//             )
		//         }
		//     },
		//     {
		//         title: this.props.t("CUSTOMER_ID"),
		//         dataIndex: "customerId",
		//         key: "customerId",
		//         ...this.getColumnSearchProps("customerId"),
		//     },
		//     {
		//         title: this.props.t("AGENCY_ID"),
		//         dataIndex: "agencyId",
		//         key: "agencyId",
		//         ...this.getColumnSearchProps("agencyId"),
		//     },
		//     {
		//         title: this.props.t("EXPORT_WAREHOUSE_ID"),
		//         dataIndex: "warehouseId",
		//         key: "warehouseId",
		//         ...this.getColumnSearchProps("warehouseId"),
		//     },
		//     {
		//         title: this.props.t("DELIVERY_DATE"),
		//         dataIndex: "expected_DeliveryDate",
		//         key: "expected_DeliveryDate",
		//         ...this.getColumnSearchProps("expected_DeliveryDate"),
		//         // defaultSortOrder: 'descend',
		//         sortDirections: ['descend', 'ascend'],
		//         sorter: (a, b) =>  {
		//             return (moment(a.deliveryDate) - moment(b.deliveryDate))
		//         },
		//         // render: (text) => {
		//         //     return (
		//         //         <div>{moment(text).format("DD/MM/YYYY")}</div>
		//         //     )
		//         // }
		//     },
		//     {
		//         title:this.props.t("DELIVERY_TIME"),
		//         dataIndex: "expected_DeliveryTime",
		//         key: "expected_DeliveryTime",
		//         ...this.getColumnSearchProps("expected_DeliveryTime"),
		//         // render: (text) => {
		//         //     return (
		//         //         <div>{moment(text).format("HH:mm:ss")}</div>
		//         //     )
		//         // }
		//     },
		//     {
		//         title:this.props.t("STATUS"),
		//         dataIndex: "status",
		//         key: "status",
		//         ...this.getColumnSearchProps("status"),
		//         render: (text) => {
		//             const txt = text === "INIT" ? "Khởi tạo"
		//                 : text === "CONFIRMED" ? "Đã xác nhận đơn hàng"
		//                     : text === "DELIVERING" ? "Đang vận chuyển"
		//                         : text === "DELIVERED" ? "Đã giao"
		//                             : text === "COMPLETED" ? "Đã hoàn thành"
		//                                 : text === "CANCELLED" ? "Đã bị hủy"
		//                                     : text
		//             return (
		//                 <div>{txt}</div>
		//             )
		//         }
		//     },
		//     {
		//         title:this.props.t("NOTE"),
		//         dataIndex: "note",
		//         key: "note",
		//         ...this.getColumnSearchProps("note"),
		//     },
		//     {
		//         title:this.props.t("ACTION"),
		//         key: 'operation',
		//         width: 120,
		//         align: 'center',
		//         render: (record, index) => (
		//             <div>
		//                 <Button
		//                     type="primary"
		//                     style={{ marginRight: 5 }}
		//                     data-toggle="modal"
		//                     data-target="#view-order-histories-modal"
		//                     onClick={() => this.getOrderHistories(record, index)}
		//                     icon='history'
		//                 />
		//                 {
		//                     !enablePrint ?
		//                         <Button
		//                             type="primary"
		//                             // style={{ marginRight: 5 }}
		//                             onClick={() => this.getDataPrint(record.orderId)}
		//                             icon='download'
		//                         />
		//                         : ''
		//                 }
		//                 {
		//                     enablePrint ?
		//                         <ReactToPrint
		//                             style={{ marginLeft: 5 }}
		//                             copyStyles={true}
		//                             onBeforeGetContent={this.handleOnBeforeGetContent}
		//                             trigger={() => <Button type="primary" icon="printer" />}
		//                             content={() => this.componentRef}
		//                         />
		//                         : ''
		//                 }
		//                 <ImportPrinter ref={el => (this.componentRef = el)} data={record} text={this.state.text}/>
		//             </div>
		//         )
		//     },
		// ];
		const columns = [
			{
				title: this.props.t("ORDER_ID"),
				dataIndex: "orderCode",
				key: "orderCode",
				...this.getColumnSearchProps("orderCode"),
				// fixed: 'left',
				// width: 125
			},
			{
				title: this.props.t("CREATE_DATE"),
				dataIndex: "createdAt",
				key: "createdAt",
				...this.getColumnSearchProps("createdAt"),
				sortDirections: ["descend", "ascend"],
				sorter: (a, b) => {
					return moment(a.createdAt) - moment(b.createdAt);
				},
				render: (text) => {
					return <div>{moment(text).format("DD/MM/YYYY - HH:mm")}</div>;
				},
			},
			{
				title: this.props.t("CUSTOMER"),
				dataIndex: "customerId",
				key: "customerId",
				...this.getColumnSearchProps("customerId"),
			},
			{
				title: this.props.t("AGENCY_NAME"),
				dataIndex: "agencyId",
				key: "agencyId",
				...this.getColumnSearchProps("agencyId"),
			},
			{
				title: this.props.t("EXPORT_WAREHOUSE"),
				dataIndex: "warehouseId",
				key: "warehouseId",
				...this.getColumnSearchProps("warehouseId"),
			},
			{
				title: this.props.t("DELIVERY_DATE"),
				dataIndex: "expected_DeliveryDate",
				key: "expected_DeliveryDate",
				...this.getColumnSearchProps("expected_DeliveryDate"),
				// defaultSortOrder: 'descend',
				sortDirections: ["descend", "ascend"],
				sorter: (a, b) => {
					return moment(a.deliveryDate) - moment(b.deliveryDate);
				},
				// render: (text) => {
				//     return (
				//         <div>{moment(text).format("DD/MM/YYYY")}</div>
				//     )
				// }
			},
			{
				title: this.props.t("DELIVERY_TIME"),
				dataIndex: "expected_DeliveryTime",
				key: "expected_DeliveryTime",
				...this.getColumnSearchProps("expected_DeliveryTime"),
				// render: (text) => {
				//     return (
				//         <div>{moment(text).format("HH:mm:ss")}</div>
				//     )
				// }
			},
			{
				title: this.props.t("STATUS"),
				dataIndex: "status",
				key: "status",
				...this.getColumnSearchProps("status"),
				render: (text) => {
					const txt =
						text === "INIT"
							? "Khởi tạo"
							: text === "CONFIRMED"
								? "Đã xác nhận đơn hàng"
								: text === "DELIVERING"
									? "Đang vận chuyển"
									: text === "DELIVERED"
										? "Đã hoàn thành"
										: text === "COMPLETED"
											? "Đã hoàn thành"
											: text === "CANCELLED"
												? "Đã bị hủy"
												: text;
					return <div>{txt}</div>;
				},
			},
			{
				title: this.props.t("NOTE"),
				dataIndex: "note",
				key: "note",
				...this.getColumnSearchProps("note"),
			},
			{
				title: this.props.t("ACTION"),
				key: "operation",
				width: 150,
				align: "center",
				fixed: "right",
				render: (record, index) => {
					// const { enablePrint } = this.state;
					const editable = this.isEditing(record);
					console.log("Aaaaa", editable)
					return (
						<div title="">
							<Tooltip title={this.props.t("HISTORY")}>
								<Button
									type="primary"
									style={{ marginRight: 5 }}
									data-toggle="modal"
									data-target="#view-order-histories-modal"
									onClick={() => this.getOrderHistories(record, index)}
									icon="history"
								/>
							</Tooltip>

							{!editable ? (
								<Tooltip title={this.props.t("DOWNLOAD")}>
									<Button
										type="primary"
										style={{ marginRight: 5 }}
										onClick={() => this.getDataPrint(record.orderId, record)}
										icon="download"
									/>
								</Tooltip>
							) : (
									""
								)}
							{editable ? (
								<Tooltip title={this.props.t("PRINT")}>
									<ReactToPrint
										style={{ marginLeft: 5 }}
										copyStyles={true}
										documentTitle={this.state.titlePrint}
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
							) : (
									""
								)}
							<Tooltip title={this.props.t("DELETE")}>
								<Button
									type="primary"
									onClick={() => {
										this.deleteOrderAPI(record);
									}}
									icon="delete"
								/>
							</Tooltip>
						</div>
					);
				},
			},
		];

		console.log(columns);

		let {
			listAllOrder,
			orderHistories,
			data,
			warning,
			isLoading,
			isLoadingViewOrderHistories,
			isLoadingViewEditOrder,
			viewingRecord,
			dataSource,
		} = this.state;
		return (
			<div>
				{/* <label style={{ color: 'red', fontSize: '24px', marginLeft: '530px' }}>Danh sách đơn hàng</label> */}
				<Row style={{ marginTop: 20 }}>
					<Col xs={1}></Col>
					<Col xs={22}>
						<h4>{this.props.t("LIST_ORDER")}</h4>
					</Col>
					<Col xs={1}></Col>
				</Row>
				<Row>
					<Col xs={1}></Col>
					<Col xs={22}>
						<Form
							layout="inline"
							// className="components-table-demo-control-bar"
							style={{ marginBottom: 16 }}
						>
							{/* <Form.Item label="Bordered">
                                <Switch checked={bordered} onChange={this.handleToggle('bordered')} />
                            </Form.Item>
                            <Form.Item label="Size">
                                <Radio.Group value={size} onChange={this.handleSizeChange}>
                                    <Radio.Button value="default">Default</Radio.Button>
                                    <Radio.Button value="middle">Middle</Radio.Button>
                                    <Radio.Button value="small">Small</Radio.Button>
                                </Radio.Group>
                            </Form.Item> */}
							<Form.Item label={this.props.t("FILTER")}>
								<Switch
									checked={enableFilter}
									onChange={this.handleDataChange}
								/>
							</Form.Item>
							<Form.Item label={this.props.t("STATUS")}>
								<Radio.Group
									value={warning ? warning.position : "notConfirmed"}
									onChange={this.handleWarningChange}
								>
									{/* <Radio.Button value="notConfirmed">Chưa xác nhận</Radio.Button>
                            <Radio.Button value="notDelivered">Chưa được giao</Radio.Button> */}
									<Radio.Button value="INIT">
										{this.props.t("INITIALIZATION")}
									</Radio.Button>
									<Radio.Button value="CONFIRMED">
										{this.props.t("CONFIRM")}
									</Radio.Button>
									<Radio.Button value="DELIVERING">
										{this.props.t("DELIVERY")}
									</Radio.Button>
									<Radio.Button value="COMPLETED">
										{this.props.t("COMPLETED")}
									</Radio.Button>
									{/* <Radio.Button value="DELIVERED">
										{this.props.t("DELIVERED")}
									</Radio.Button> */}
									<Radio.Button value="CANCELLED">
										{this.props.t("CANCELLED")}
									</Radio.Button>
								</Radio.Group>
							</Form.Item>
							<Form.Item>
								<RangePicker
									ranges={{
										"Hôm nay": [moment().startOf("day"), moment().endOf("day")],
										"Tháng hiện tại": [
											moment().startOf("month"),
											moment().endOf("month"),
										],
									}}
									showTime={{
										format: "HH:mm",
										defaultValue: [
											moment("00:00", "HH:mm"),
											moment("23:59", "HH:mm"),
										],
									}}
									format="DD/MM/YYYY HH:mm"
									onChange={this.onChangeTime}
								/>
							</Form.Item>
							<Form.Item>
								<ReactHTMLTableToExcel
									className="btn btn-success ml-2"
									table="listOrder"
									filename="_Danh_Sach_Don_Hang_"
									sheet="Danh sách đơn hàng"
									buttonText={this.props.t("EXCEL")}
								/>
								{this.state.check === true ? (
									<Button
										className="ml-2"
										type="primary"
										icon="download"
										size={size}
										onClick={this.onClickPrint}
									>
										In biên bản
									</Button>

								) : (
										<Tooltip title={this.props.t("PRINT")}>
											<ReactToPrint
												style={{ marginLeft: 5 }}
												copyStyles={true}
												documentTitle={this.state.titlePrint}
												// onBeforeGetContent={this.handleOnBeforeGetContent}
												trigger={() => (
													<Button
														style={{ marginLeft: 5 }}
														type="primary"
														icon="printer"
													/>
												)}
												content={() => this.componentRefAll}
											// pageStyle="@page"
											/>
										</Tooltip>
									)}
							</Form.Item>

						</Form>
					</Col>
					<Col xs={1}></Col>
				</Row>
				<Row>
					<Col xs={1}>
						<MenuCreateOrderExcel
							listMenuCreateOrderTableExcel={
								this.state.listMenuCreateOrderTableExcel
							}
						></MenuCreateOrderExcel>
					</Col>
					<Col xs={22}>
						<Table
							//className="components-table-demo-nested"
							scroll={{ x: 1500, y: 1000 }}
							loading={isLoading}
							bordered={bordered}
							size={size}
							columns={columns.map((col) => {
								return {
									...col,
									onCell: (record) => ({
										record,
										dataIndex: col.dataIndex,
										title: col.title,
									}),
								};
							})}
							dataSource={
								enableFilter ? this.state.listOrderOld : this.state.listOrderNow
							}
							pagination={defaultPageSize}
							expandedRowRender={(record, index) =>
								this.expandedRowRender(record, index)
							}
							rowSelection={rowSelection}
						// onRow={(record, index) => (
						// //     console.log('record, index', record, index)
						//     // this.setState('')
						//   )}
						/>
					</Col>
					<Col xs={1}></Col>
				</Row>
				<ViewOrderHistories
					orderHistories={orderHistories}
					isLoadingViewOrderHistories={isLoadingViewOrderHistories}
					getDetailExportOrder={this.getDetailExportOrder}
				/>
				<EditOrder
					isLoadingViewEditOrder={isLoadingViewEditOrder}
					dataSource={dataSource}
				/>
				<ImportPrinter
					ref={(el) => (this.componentRef = el)}
					dataPrint={this.state.exportDataPrint}
					text={this.state.text}
				/>
				<ImportAllPrinter
					ref={(el) => (this.componentRefAll = el)}
					dataPrint={this.state.exportAllDataPrint}
					text={this.state.text}
				/>
			</div>
		);
	}
}

export default withNamespaces()(MenuCreateOrder);
