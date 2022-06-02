import React from "react";
import { connect } from "react-redux";
import PopupLogOut from "./PopupLogOut";
import { getCookie, setCookie } from "redux-cookie";
import getReportByUserAPI from "getReportByUserAPI";
import getHistoryImportAPI from "getHistoryImportAPI";
import getCylinderByHistoryId from "getCylinderByHistoryId";
import moment from "moment";
import "moment/locale/vi";
import getUserCookies from "getUserCookies";
import UltiHelper from "UltiHelper";
import GetReportChartApi from "getReportChart";
import getReportPieChartAPI from "getReportPieChart";
import imexGetExport from "app/api/imexGetExport";
import imexGetStatistics from "app/api/imexGetStatistics";
import getStatisticsForGeneralAgency from "app/api/imexGetStatisticsForGeneralAgency";
import imexPieGetExport from "app/api/imexGetCurrentInventory";
import imexGetCurrentInventoryByItSelf from "app/api/imexGetCurrentInventoryByItSelf";
import getExportByItSelf from "app/api/getExportByItSelf";
import getSaleByItSelf from "app/api/getSaleByItSelf";
import historyGetHistoriesByType from "../../../../api/historyGetHistoriesByType";
import ShowPieChart from "./showPieChart";
import ShowBarChart from "./showBarChart";
import { withNamespaces } from "react-i18next";
import {
	urlSeeDetailDataExport,
	urlDetailHistoryImport,
	urlSeeDetailDataSaler
} from "./../../../config/config-reactjs";
import "./dashboard.scss";
//dai
import {
	Bar,
	LabelList,
	BarChart,
	CartesianGrid,
	Legend,
	Tooltip,
	XAxis,
	YAxis,
	PieChart,
	Pie,
	Sector,
	Cell,
	Text,
	ResponsiveContainer,
	Line,
} from "recharts";
import Select from "react-select";
import updateAllowReportApi from "updateUserAllowReportApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import YearPicker from "react-year-picker";
import showToast from "showToast";
import Switch from "react-switch";
import getReportChildsAPI from "getReportChilds";
import Constants from "Constants";
import TableDataInfo from "./tableDataInfo";
import getChildAndNumberImportAPI from "getChildAndNumberImport";
import apiReportTurnBackInfoAPI from "apiReportTurnBackInfo";
import callDataTurnBackInfoAPI from "callDataTurnBackInfo";
import { Row, Col, Table } from "antd";
import getReportExcelByTargetAndDateTimeAPI from "getReportExcelByTargetAndDateTimeAPI";
import callApi from "../../../util/apiCaller";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ImportHistoryAgency from "./ImportHistoryAgency";
import ExportHistoryAgency from "./exportHistoryAgency";
import TurnBackHistoryAgency from "./turnBackHistoryAgency";
import NumberOfCylinder from "./NumberOfCylinder";

import ReactCustomLoading from "ReactCustomLoading";
import DashBoardForAgentWarehouse from './dashBoardForAgentWarehouse/DashBoardForAgentWarehouse';
// import { TOPEXPORTCYLINDER } from "./../../../config/config";

moment.locale("vi");

let COLORS = [
	"#2568a7",
	"#d171ca",
	"#99915a",
	"#6b28a6",
	"#62e0f6",
	"#92b4b0",
	"#d22ac2",
	"#4a889c",
	"#40d3a6",
	"#71d892",
	"#b2e447",
	"#ee5592",
	"#4b79e6",
];
const defaultPageSize = {
	defaultPageSize: 5,
  };
const RADIAN = Math.PI / 180;

const data = [{ name: "Chưa có Data", value: 0 }];

let ACTION_REPORT_TYPE = [
	{ value: "IMPORT", label: "IMPORT_CYLINDER" },
	{ value: "EXPORT", label: "EXPORT" },
	{ value: "IMPORT_CELL", label: "IMPORT_EMPTY" },
	{ value: "EXPORT_CELL", label: "EXPORT_CYLINDER" },
	{ value: "TURN_BACK", label: "TURN_BACK" },
	{ value: "FIX", label: "FIX" },
	{ value: "CREATE", label: "CREATE" },
	{ value: "SYNTHESIS_REPORT_CREATE", label: "SYNTHESIS_REPORT_CREATE" },
	{ value: "SYNTHESIS_REPORT_DELIVERY", label: "SYNTHESIS_REPORT_DELIVERY" },
];
// const constrenderCustomizedLabelImex = ({
//   cx,
//   cy,
//   midAngle,
//   innerRadius,
//   outerRadius,
//   percent,
//   index,
// }) => {
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);
//   return (
//     <text
//       x={x}
//       y={y}
//       fill="white"
//       textAnchor={x > cx ? "start" : "end"}
//       dominantBaseline="central"
//     >
//       {`${(percent * 100).toFixed(0)}%`}
//       {/* {this.state.dataImexPieGetExport.length > 0 ? this.state.dataImexPieGetExport[index].value : ''} */}
//     </text>
//   );
// };

class DashBoard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visibleNumberOfCylinder:false,
			indexCylinders:[],
			current_input_type: "",
			current_input_role: "",
			valueReports: [],
			dataValueReports: null,
			actionTypeReportExcel: "",
			selectedId: "",
			user: null,
			resultImport: { reveneu: 0 },
			resultExport: {},
			user_current: { userType: "" },
			historyImport: [],
			historyExport: [],
			historyExportBegin:[],
			historySaler:[],
			dataPieChart: [],
			dataBarChart: [],
			dataImexBarGetExport: [],
			dataImexBarGetExportWarehouse: [],
			dataImexPieGetExport: [],
			dataimexGetStatistics: [],
			dataImexPieGetExportWareHouse: [],
			dataImexGetStatisticsTotal: null,
			dataImexGetStatisticsTotal_12kg: null,
			dataImexGetStatisticsTotal_45kg: null,
			dataImexGetStatisticsTotal_50kg: null,
			dataImexGetStatisticsInventoryCylinder_Total: null,
			dataImexGetStatisticsInventoryCylinder_Total_12kg: null,
			dataImexGetStatisticsInventoryCylinder_Total_45kg: null,
			dataImexGetStatisticsInventoryCylinder_Total_50kg: null,
			dataImexGetStatisticsOutCylinder_Total: null,
			dataImexGetStatisticsOutCylinder_Total_12kg: null,
			dataImexGetStatisticsOutCylinder_Total_45kg: null,
			dataImexGetStatisticsOutCylinder_Total_50kg: null,
			dataImexGetStatisticsTurnbackCylinder_Total: null,
			dataImexGetStatisticsTurnbackCylinder_Total_12kg: null,
			dataImexGetStatisticsTurnbackCylinder_Total_45kg: null,
			dataImexGetStatisticsTurnbackCylinder_Total_50kg: null,
			dataImexGetStatisticsImportCellCylinder_Total: null,
			dataImexGetStatisticsImportCellCylinder_Total_12kg: null,
			dataImexGetStatisticsImportCellCylinder_Total_45kg: null,
			dataImexGetStatisticsImportCellCylinder_Total_50kg: null,
			dataImexGetStatisticsSaleCylinder_Total:null,
			dataImexGetStatisticsSaleCylinder_Total_12kg:null,
			dataImexGetStatisticsSaleCylinder_Total_45kg:null,
			dataImexGetStatisticsSaleCylinder_Total_50kg:null,
			yearSubmit: "",
			dataArrYear: [],
			startDate: moment(),
			endDate: moment(),
			startDateSubmit: moment(new Date()).format("MM/DD/YYYY"),
			endDateSubmit: moment(new Date()).format("MM/DD/YYYY"),
			checkDataChart: [],
			valueCheckChart: false,
			namePopup: "",
			checked: true,
			objectData: [
				{ label: "CHOOSE", value: 0, name: "" },
				// { label: this.props.t("GENERAL"), value: 1, name: "General" },
				// { label: this.props.t("RETAIL"), value: 2, name: "Agency" },
				{ label: "FACTORY_CHILD", value: 3, name: "Factory" },
				{ label: "FIXER", value: 4, name: "Fixer" },
			],
			dataChild1: [],
			dataChild2: [],
			dataChild3: [],
			dataChild4: [],

			objectDataChild: [
				//{ label: "Chi nhánh trực thuộc", value: 0 },
				{ label: this.props.t("ALL"), value: 0, name: "All" },
				// { label: this.props.t("GENERAL"), value: 1, name: "General" },
				// { label: this.props.t("RETAIL"), value: 2, name: "Agency" },
				// { label: this.props.t("FIXER"), value: 4, name: "Fixer" },
			],
			objectDataExecelAgency: [
				{ label: "IMPORT_CYLINDER", value: 0 },
				{ label: "EXPORT", value: 1 },
				{ label: "TURN_BACK", value: 2 },
			],
			objectDataExecelAgencyValue: "",
			objectDataChildTNMBFAC: [
				 { label: "SELECT", value: 0 ,name: "All"},
				{ label: "RETAIL", value: 1, name: "Agency" },
			],
			//label: "Chi nhánh trực thuộc", value: 0
			dataObjectChecked: { label: this.props.t("CHOOSE"), value: 0 },
			dataObjectCheckedChild: { label:this.props.t("ALL"), value: 0 },
			checkRefresh:false,
			dataObjectCheckedGENARAL: {},

			dataObjectCheckedID: 0,
			dataObjectChecked1: "",
			dataObjectCheckedID1: "",

			dataObjectCheckedIDChild: 0,
			dataObjectCheckedTNMBFAC: "",
			dataObjectCheckedTNMBFACID: "",

			dataObjectCheckedGENARALID: "",
			dataObjectAgencyGeneral: "",
			dataObjectAgencyGeneralID: "",

			itemData: "",
			itemDataObject4: "",
			itemDataObject5: "",
			dataTableChart: "",
			infoReportTurnback: "",
			dataTurnBacks: [],
			allDataImport: [],
			allDataExport: [],
			listTopExportCylinder: [],
			userTypeCheck: "",
			historyImportExcel: [],
			historyExportExcel: [],
			historyTurnBackExcel: [],

			isLoading: false,
		};
		this.state.dataImexGetStatisticsTotal = this.state.dataImexGetStatisticsTotal;
	}

	resetData(step) {
		switch (step) {
			case 1:
				this.setState({
					ataObjectCheckedID: 0,
					dataObjectChecked1: "",
					dataObjectCheckedID1: "",

					dataObjectCheckedIDChild: 0,
					dataObjectCheckedTNMBFAC: "",
					dataObjectCheckedTNMBFACID: "",

					dataObjectCheckedGENARALID: "",
					dataObjectAgencyGeneral: "",
					dataObjectAgencyGeneralID: "",
					dataValueReports: "",
				});
				break;
			case 2:
				this.setState({
					dataObjectCheckedIDChild: 0,
					dataObjectCheckedTNMBFAC: "",
					dataObjectCheckedTNMBFACID: "",

					dataObjectCheckedGENARALID: "",
					dataObjectAgencyGeneralID: "",
					dataObjectAgencyGeneral: "",
					dataValueReports: "",
				});
				break;
			case 3:
				this.setState({
					dataObjectCheckedGENARALID: "",
					dataObjectAgencyGeneral: "",
					dataObjectAgencyGeneralID: "",
					dataValueReports: "",
				});
				break;
		}
	}

	_getRandomColor(index = 0) {
		let today = new Date();
		today.setDate(today.getDate() + index);
		const randomNumber = Math.random(today.getMilliseconds());
		const cc = "#" + ("000000" + randomNumber.toString(16)).substr(-6);
		return cc;
	}

	_getArrayColor(numberLength = 5) {
		let arrayColor = [];
		let i = 0;
		while (i < numberLength) {
			const color = this._getRandomColor(i);
			arrayColor.push(color);
			i++;
		}
		if (arrayColor.length > 0) {
			COLORS = arrayColor;
		}
	}

	translateReportChart = (item) => {
		let reportVN = "";
		switch (item) {
			case "inventoryAtMySelf":
				return (reportVN = this.props.t("IS_INVENTORY"));
			case "atResident":
				return (reportVN = this.props.t("SELL_GENERAL"));
			case "else":
				return (reportVN = this.props.t("IN_OTHER"));
			case "atFactoryChilds":
				return (reportVN = this.props.t("IN_CHILD_COMPANY"));
			case "atGeneralChilds":
				return (reportVN = this.props.t("IN_TRADER"));
			case "atAgencyChilds":
				return (reportVN = this.props.t("IN_AGENCY"));
			case "atPartners":
				return (reportVN = this.props.t("IN_PARTNER"));
			case "atFixer":
				return (reportVN = this.props.t("IN_FIXER"));
			case "totalFixer":
				return (reportVN = this.props.t("FIX_TITLE"));
			case "totalGeneral":
				return (reportVN = this.props.t("TRADER"));
			case "totalAgency":
				return (reportVN = this.props.t("AGENCY_CODE"));
			case "totalCompanyChild":
				return (reportVN = this.props.t("CHILD_CPN_TT"));
			case "totalBuyPartner":
				return (reportVN = this.props.t("PART_BUY"));
			case "totalRentPartner":
				return (reportVN = this.props.t("PART_HIRE"));
			default:
				return (reportVN = "");
		}
	};
	renderCustomizedLabel = ({
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		percent,
		index,
	}) => {
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);
		return (
			<text
				x={x}
				y={y}
				fill="white"
				textAnchor={x > cx ? "start" : "end"}
				dominantBaseline="central"
			>
				{this.state.dataImexPieGetExportWareHouse[index].value == 0
					? 1
					: this.state.dataImexPieGetExportWareHouse[index].value}
			</text>
		);
	};
	renderCustomizedLabelImex = ({
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		percent,
		index,
	}) => {
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);
		return (
			<text
				x={x}
				y={y}
				fill="white"
				textAnchor={x > cx ? "start" : "end"}
				dominantBaseline="central"
			>
				{/* {`${(percent * 100).toFixed(0)}%`} */}
				{this.state.dataImexPieGetExport[index].value === 0
					? ""
					: this.state.dataImexPieGetExport[index].value}
			</text>
		);
	};
	getImexStatistics = async () => {
		const data = await imexGetStatistics();
		// console.log("Bieu Do tron imexGetStatisticsAPI", data);
		console.log("dat.data.data", data.data.data);
		//Get genaral\
		this.setState({
			dataImexGetStatisticsTotal: data.data.data.createdCylinder.total,
			dataImexGetStatisticsTotal_12kg:
				data.data.data.createdCylinder.total_CYL12KG +
				data.data.data.createdCylinder.total_CYL12KGCO,
			dataImexGetStatisticsTotal_45Kg:
				data.data.data.createdCylinder.total_CYL45KG,
			dataImexGetStatisticsTotal_50Kg:
				data.data.data.createdCylinder.total_CYL50KG,
			dataImexGetStatisticsInventoryCylinder_Total:
				data.data.data.inventoryCylinder.total,
			dataImexGetStatisticsInventoryCylinder_Total_12kg:
				data.data.data.inventoryCylinder.total_CYL12KG +
				data.data.data.inventoryCylinder.total_CYL12KGCO,
			dataImexGetStatisticsInventoryCylinder_Total_45kg:
				data.data.data.inventoryCylinder.total_CYL45KG,
			dataImexGetStatisticsInventoryCylinder_Total_50kg:
				data.data.data.inventoryCylinder.total_CYL50KG,
			dataImexGetStatisticsOutCylinder_Total: data.data.data.outCylinder.total,
			dataImexGetStatisticsOutCylinder_Total_12kg:
				data.data.data.outCylinder.total_CYL12KG +
				data.data.data.outCylinder.total_CYL12KGCO,
			dataImexGetStatisticsOutCylinder_Total_45kg:
				data.data.data.outCylinder.total_CYL45KG,
			dataImexGetStatisticsOutCylinder_Total_50kg:
				data.data.data.outCylinder.total_CYL50KG,
			dataImexGetStatisticsTurnbackCylinder_Total:
				data.data.data.turnbackCylinder.total,
			dataImexGetStatisticsTurnbackCylinder_Total_12kg:
				data.data.data.turnbackCylinder.total_CYL12KG +
				data.data.data.turnbackCylinder.total_CYL12KGCO,
			dataImexGetStatisticsTurnbackCylinder_Total_45kg:
				data.data.data.turnbackCylinder.total_CYL45KG,
			dataImexGetStatisticsTurnbackCylinder_Total_50kg:
				data.data.data.turnbackCylinder.total_CYL50KG,
			dataImexGetStatisticsImportCellCylinder_Total: data.data.data
				.importCellCylinder.total
				? data.data.data.importCellCylinder.total
				: 0,
			dataImexGetStatisticsImportCellCylinder_Total_12kg:
				data.data.data.importCellCylinder.total_CYL12KG +
				data.data.data.importCellCylinder.total_CYL12KGCO,
			dataImexGetStatisticsImportCellCylinder_Total_45kg: data.data.data
				.importCellCylinder.total_CYL45KG
				? data.data.data.importCellCylinder.total_CYL45KG
				: 0,
			dataImexGetStatisticsImportCellCylinder_Total_50kg: data.data.data
				.importCellCylinder.total_CYL50KG
				? data.data.data.importCellCylinder.total_CYL50KG
				: 0,
		});
	};
	getStatisticsForGeneralAgency = async (  endDate = "",startDate = "",target="",statisticalType="") => {
		if (target === "" && startDate === "" && endDate === "") {
			startDate = this.state.startDate.toDate().setHours(0, 0, 0, 0);
			endDate = this.state.endDate.toDate().setHours(23, 59, 59, 999);
		}
		const data = await getStatisticsForGeneralAgency(endDate,startDate,target ,statisticalType);
		// console.log("Bieu Do tron imexGetStatisticsAPI", data);
		console.log("dat.data.data", data.data.data);
		//Get genaral\
		let inventoryCylinder=data.data.data.inventoryCylinder.total-data.data.data.saleCylinder.total;
		console.log("inventoryCylinder",inventoryCylinder);
		this.setState({
			dataImexGetStatisticsTotal: data.data.data.inCylinder.total,
			dataImexGetStatisticsTotal_12kg:
				data.data.data.inCylinder.total_CYL12KG +
				data.data.data.inCylinder.total_CYL12KGCO,
			dataImexGetStatisticsTotal_45Kg:
				data.data.data.inCylinder.total_CYL45KG,
			dataImexGetStatisticsTotal_50Kg:
				data.data.data.inCylinder.total_CYL50KG,
			dataImexGetStatisticsInventoryCylinder_Total:
				data.data.data.inventoryCylinder.total,
			dataImexGetStatisticsInventoryCylinder_Total_12kg:
				data.data.data.inventoryCylinder.total_CYL12KG +
				data.data.data.inventoryCylinder.total_CYL12KGCO,
			dataImexGetStatisticsInventoryCylinder_Total_45kg:
				data.data.data.inventoryCylinder.total_CYL45KG,
			dataImexGetStatisticsInventoryCylinder_Total_50kg:
				data.data.data.inventoryCylinder.total_CYL50KG,
			dataImexGetStatisticsOutCylinder_Total: data.data.data.outCylinder.total-data.data.data.saleCylinder.total,
			dataImexGetStatisticsOutCylinder_Total_12kg:
				data.data.data.outCylinder.total_CYL12KG +
				data.data.data.outCylinder.total_CYL12KGCO-data.data.data.saleCylinder.total_CYL12KG-data.data.data.saleCylinder.total_CYL12KGCO,
			dataImexGetStatisticsOutCylinder_Total_45kg:
				data.data.data.outCylinder.total_CYL45KG-data.data.data.saleCylinder.total_CYL45KG,
			dataImexGetStatisticsOutCylinder_Total_50kg:
				data.data.data.outCylinder.total_CYL50KG-data.data.data.saleCylinder.total_CYL50KG,
			dataImexGetStatisticsTurnbackCylinder_Total:
				data.data.data.turnbackCylinder.total,
			dataImexGetStatisticsTurnbackCylinder_Total_12kg:
				data.data.data.turnbackCylinder.total_CYL12KG +
				data.data.data.turnbackCylinder.total_CYL12KGCO,
			dataImexGetStatisticsTurnbackCylinder_Total_45kg:
				data.data.data.turnbackCylinder.total_CYL45KG,
			dataImexGetStatisticsTurnbackCylinder_Total_50kg:
				data.data.data.turnbackCylinder.total_CYL50KG,
			dataImexGetStatisticsSaleCylinder_Total:data.data.data.saleCylinder.total,
				dataImexGetStatisticsSaleCylinder_Total_12kg:
				data.data.data.saleCylinder.total_CYL12KG +
				data.data.data.saleCylinder.total_CYL12KGCO,
				dataImexGetStatisticsSaleCylinder_Total_45kg:
				data.data.data.saleCylinder.total_CYL45KG,
				dataImexGetStatisticsSaleCylinder_Total_50kg:
				data.data.data.saleCylinder.total_CYL50KG,
				isLoading:false
		});
	};
	getImexBarChart = async (userId = "", startDate = "", endDate = "") => {
		if (userId === "" && startDate === "" && endDate === "") {
			startDate = this.state.startDate.toDate().setHours(0, 0, 0, 0);
			endDate = this.state.endDate.toDate().setHours(23, 59, 59, 999);
		}
		//const data = await imexGetExport( userId ,(new Date(startDate)).toISOString(),(new Date(endDate)).toISOString());
		const data = await imexGetExport(userId, startDate, endDate);
		// console.log("data getImexBarChart", data);
		// if(!(this.state.user_current.userType === "Factory"
		// && this.state.user_current.userRole === "SuperAdmin")
		// && this.state.user_current.userType !== "Agency"
		// && this.state.user_current.userType !== "Fixer"){
		// const data = await getExportByItSelf( userId ,startDate,endDate);
		// console.log("Bieu Do tron imex Bar11111111111111111111111111111112222222",data);
		// }

		const barChart = [];
		for (let itemBarChart in data.data.data) {
			barChart.push({
				//Get genaral\
				name: data.data.data[itemBarChart].name,
				bình: data.data.data[itemBarChart].count,
			});
		}
		this.setState({
			dataImexBarGetExport: barChart,
		});
	};
	getImexBarChartWarehouse = async (
		userId = "",
		startDate = "",
		endDate = ""
	) => {
		if (userId === "" && startDate === "" && endDate === "") {
			startDate = this.state.startDate.toDate().setHours(0, 0, 0, 0);
			endDate = this.state.endDate.toDate().setHours(23, 59, 59, 999);
		}
		//const data = await imexGetExport( userId ,(new Date(startDate)).toISOString(),(new Date(endDate)).toISOString());
		const data = await getExportByItSelf(userId, startDate, endDate);
		// console.log("data getImexBarChartWarehouse1", data);
		

		const barChart = [];
		for (let itemBarChart in data.data.data) {
			// console.log("dat.data.data", data.data.data[2].count);
			barChart.push({
				//Get genaral\
				name: data.data.data[itemBarChart].name,
				"Xuất hàng": data.data.data[itemBarChart].count,
				"Bán hàng":""
			});
		}
		let barchar
		if(this.state.user_current.userType==="General" && this.state.user_current.userRole==="SuperAdmin"){
			const saleData= await getSaleByItSelf(userId, startDate, endDate);
			console.log("saleData",saleData);
			saleData.data.data.map((item,inex)=>{
				barChart.map(function(x){
					if(x.name===item.name){
						x["Bán hàng"]=item.count
						return x;
					}
				})
			})
		}
		console.log("barChart",barChart);
		this.setState({
			dataImexBarGetExportWarehouse: barChart,
		});
		// console.log(
		//   "dataImexBarGetExportWarehouse",
		//   this.state.dataImexBarGetExportWarehouse
		// );
	};
	getImexBarChart1 = async (userId, startDate, endDate) => {
		const data = await getExportByItSelf(userId, startDate, endDate);
		// console.log("Bieu Do tron imex Bar", data);
		const barChart = [];
		for (let itemBarChart in data.data.data) {
			// console.log("dat.data.data", data.data.data[2].count);
			barChart.push({
				//Get general\
				name: data.data.data[itemBarChart].name,
				bình: data.data.data[itemBarChart].count,
			});
		}
		this.setState({
			dataImexBarGetExport: barChart,
		});
	};

	getImexPieChart = async (target_id = "", endDate) => {
		// const data = await imexPieGetExport( target_id,(new Date(endDate)).toISOString());
		const data = await imexPieGetExport(target_id, endDate);
		// console.log("Bieu Do tron imex Pie11111111111111111111111111", data);
		const PieChart = [];
		for (let itemPieChart in data.data.data) {
			// console.log("dat.data.data", data.data.data[0].count);
			PieChart.push({
				//Get general\
				name:
					data.data.data[itemPieChart] <= 0
						? ""
						: data.data.data[itemPieChart].name,
				value:
					data.data.data[itemPieChart].count <= 0
						? 0
						: data.data.data[itemPieChart].count,
			});
		}
		// console.log("testBieuDo", Pie);
		this.setState({
			dataImexPieGetExport: PieChart,
		});
	};
	getImexPieChart1 = async (target_id, endDate) => {
		const data = await imexGetCurrentInventoryByItSelf(target_id, endDate);
		// console.log("Bieu Do tron imex Pie", data);
		const PieChart = [];
		for (let itemPieChart in data.data.data) {
			// console.log("dat.data.data", data.data.data[0].count);
			PieChart.push({
				//Get genaral\
				name:
					data.data.data[itemPieChart] < 0
						? ""
						: data.data.data[itemPieChart].name,
				value:
					data.data.data[itemPieChart].count < 0
						? 0
						: data.data.data[itemPieChart].count,
			});
		}
		this.setState({
			dataImexPieGetExport: PieChart,
		});
	};
	getImexPieChartWareHouse = async (target_id, endDate) => {
		const data = await imexGetCurrentInventoryByItSelf(target_id, endDate);
		// console.log("Bieu Do tron imex Pie", data);
		const PieChart = [];
		for (let itemPieChart in data.data.data) {
			// console.log("dat.data.data", data.data.data[0].count);
			PieChart.push({
				//Get genaral\
				name:
					data.data.data[itemPieChart] < 0
						? ""
						: data.data.data[itemPieChart].name,
				value:
					data.data.data[itemPieChart].count < 0
						? 0
						: data.data.data[itemPieChart].count,
			});
		}
		this.setState({
			dataImexPieGetExportWareHouse: PieChart,
		});
		// console.log(
		//   "getImexPieChartWareHouse",
		//   this.state.dataImexPieGetExportWareHouse
		// );
	};
	getReportPieChart = async () => {
		const data = await getReportPieChartAPI();
		// console.log("Bieu Do tron1", data);
		// const data1 = await imexGetCurrentInventoryByItSelf();
		// console.log("imexGetCurrentInventoryByItSelf",data1);
		// const data1 = await imexGetExport();
		// console.log("Bieu Do tron imex",data1);
		// alert(data1.userId);
		const arrPieChart = [];
		const checkArrChart = [];
		for (let itemPieChart in data.data) {
			arrPieChart.push({
				//Get genaral
				name: this.translateReportChart(itemPieChart),
				value: data.data[itemPieChart],
			});
		}
		arrPieChart.map(async (item) => {
			if (item.value === 0) {
				await checkArrChart.push(item);
			}
		});
		if (checkArrChart.length === arrPieChart.length) {
			this.setState({ checkDataChart: checkArrChart });
		}
		this.setState({
			dataPieChart: arrPieChart,
			dataTableChart: data.data,
		});
	};
	giveTop10DataExport = (dataExport) => {
		let top10DataExport = [];
		if (dataExport.length > 10) {
			for (let p = 0; p < 10; p++) {
				top10DataExport.push(dataExport[p]);
			}
		} else if (dataExport.length < 10) {
			for (let p = 0; p < dataExport.length; p++) {
				top10DataExport.push(dataExport[p]);
			}
		}
		return top10DataExport;
	};
	async componentDidMount() {
		// Get user from cookie "to",this.state.user_current.id,"", 'IMPORT',1, 10
		var user_cookies = await getUserCookies();
		this.getUser();
		this.getAllReports();
		this.getImportHistory();
		this.getReportPieChart();
		this.getImexBarChart();
		// this.getImexBarChart1();
		this.getImexBarChartWarehouse();
		this.getImexPieChart();
		this.getImexPieChartWareHouse();
		// this.getImexPieChart1();
		if((user_cookies.user.userType==="Factory" && user_cookies.user.userRole==="SuperAdmin") || (user_cookies.user.userType==="Factory" && user_cookies.user.userRole==="Owner")){
			this.getImexStatistics();
			
		}else {
			this.getStatisticsForGeneralAgency();
			this.getImexBarChartWarehouse();
			this.getImexPieChartWareHouse();
		}
		
		
		
		// console.log("123 cookies", user_cookies);
		this.setState({
			user_current: user_cookies.user,
			checked: user_cookies.user.allowReport,
			userTypeCheck: user_cookies.user.userType,
		});
		let token = "Bearer " + user_cookies.token;
		// console.log("token", token);
		let params = {
			id: user_cookies.user.id,
		};
		// setInterval(async () => {
		//   await callApi("POST", TOPEXPORTCYLINDER, params, token).then((res) => {
		//     const arrTopCylinder = [];
		//     //console.log(res.data.data.length);
		//     if (res.data.data.length < 5) {
		//       for (let i = 0; i < res.data.data.length; i++) {
		//         arrTopCylinder.push(res.data.data[i]);
		//       }
		//     } else {
		//       for (let i = 0; i < 5; i++) {
		//         arrTopCylinder.push(res.data.data[i]);
		//       }
		//     }
		//     // console.log("set interval", res.data.data);
		//     this.setState({
		//       listTopExportCylinder: arrTopCylinder,
		//     });
		//   });
		// }, 5000);

		//this.renderDataPieChart()
		//console.log(user_cookies);
		//await this.getReportChart()
		this.apiReportTurnBackInfoAPIFUC();
		this.getChildAndNumberImportFunc();

		this.setDefaultSelectBoxExcel();
	}

	async setDefaultSelectBoxExcel() {
		let { user_current } = this.state;
		this.setState({
			current_input_type: user_current.userType,
			current_input_role: user_current.userRole,
		});
		this.filterParamsSelect(user_current.userType, user_current.userRole);
	}

	async getSaleHistory() {
			let dataSaler = await historyGetHistoriesByType("from",this.state.user_current.id,"",'SALE',1,10);
		console.log("historySaler11111",dataSaler.data.data);
		let SalerDataBegin=[];
		dataSaler.data.data.map((item,index)=>{
			//console.log("item3011",item);
			SalerDataBegin.push(
				{
					amount:item.amount,
					createdAt:item.createdAt,
					createdBy:item.createdBy,
					customer:item.customer?item.customer:"",
					cylinders:item.cylinders?item.cylinders:"",
					cylindersWithoutSerial:item.cylindersWithoutSerial,
					driver:item.driver,
					exportByDriver:item.exportByDriver,
					exportByDriver: item.exportByDriver,
					from:item.from,
					id:item.id,
					idDriver:item.idDriver,
					license_plate:item.license_plate,
					numberArray:item.numberArray?item.numberArray:"",
					numberOfCylinder:item.numberOfCylinder,
					saler:item.saler?item.saler:"",
					signature:item.signature,
					turnbackByDriver:item.turnbackByDriver,
					type:item.type,
					typeForPartner:item.typeForPartner,
					numbers:++index
					}
			)
		})
		this.setState({
			historySaler:SalerDataBegin,
		});
	}
	async getImportHistory() {
		let historyImport = await getHistoryImportAPI("to", 0);
		const data = await historyGetHistoriesByType("to",this.state.user_current.id,"",'IMPORT,TURN_BACK',1,10);
		const dataExport = await historyGetHistoriesByType("from",this.state.user_current.id,"",'EXPORT,SALE',1,10);
		// console.log('dataExport', dataExport)
		this.getSaleHistory();
		let sortHistoryImportDecs = [];
		let j = 0;
		for (let i = historyImport.data.length - 1; i >= 0; i--) {
			sortHistoryImportDecs[j] = historyImport.data[i];
			j++;
		}
		let historyExport = await getHistoryImportAPI("from", 0);
		
		console.log("historyGetHistoriesByType",historyExport);
		let sortHistoryExportDecs = [];

		let n = 0;
		for (let m = historyExport.data.length - 1; m >= 0; m--) {
			sortHistoryExportDecs[n] = historyExport.data[m];
			n++;
		}
		let historyImportExcel = [];
		sortHistoryImportDecs.map((item, index) => {
			// console.log("item",item);
			let driverCreatedAt = item.idDriver ? item.idDriver.createdAt : "";
			let nameDriver = item.idDriver ? item.idDriver.name : "";
			let fromInvoiceName = item.from ? item.from.invoiceName : "";
			let address = item.idDriver ? item.idDriver.address : "";
			let status =
				item.cylinderImex.length !== 0 ? item.cylinderImex[0].status : "";
			let signature = item.signature ? item.signature : "";
			// console.log("driverCreatedAt",driverCreatedAt);
			// console.log("fromInvoiceName",fromInvoiceName);
			// console.log("license_plate",address);
			// console.log("nameDriver",nameDriver);
			// console.log("nameDriver",item.cylinderImex[0].status);
			//  console.log("signature",item.signature);
			item.cylinders.map((item1, index) => {
				// console.log("item1",item1);
				historyImportExcel.push({
					serial: item1.serial,
					color: item1.color,
					typeValue: item1.valve,
					checkedDate: item1.checkedDate,
					cylinderType: item1.cylinderType,
					weight: item1.weight,
					driverCreatedAt: driverCreatedAt,
					fromInvoiceName: fromInvoiceName,
					nameDriver: nameDriver,
					address: address,
					signature: signature,
					status: status,
				});
			});
		});
		let historyExportExcel = [];
		// console.log("sortHistoryExportDecs",sortHistoryExportDecs);
		sortHistoryExportDecs.map((item, index) => {
			// console.log("itemHistoryExportExcel",item);
			let address = item.saler ? item.saler.address : "";
			let name = item.saler ? item.saler.name : "";
			let createdAt = item.saler ? item.saler.createdAt : "";
			let signature = item.signature;
			item.cylinders.map((item1, index) => {
				// console.log("item1",item1);
				historyExportExcel.push({
					serial: item1.serial,
					color: item1.color,
					typeValue: item1.valve,
					checkedDate: createdAt,
					cylinderType: item1.cylinderType,
					weight: item1.weight,
					addressSaler: address,
					nameSaler: name,
					// "driverCreatedAt":driverCreatedAt,
					// "fromInvoiceName":fromInvoiceName,
					// "nameDriver": nameDriver,
					// "address":address,
					signature: signature,
					// "status":status,
				});
			});
		});
		let historyTurnBackExcel = [];
		sortHistoryExportDecs.map((item, index) => {
			// console.log("itemHistoryExportExcel",item.cylinderImex);
			let address = item.saler ? item.saler.address : "";
			let name = item.saler ? item.saler.name : "";
			let createdAt = item.saler ? item.saler.createdAt : "";
			let signature = item.signature;
			let cylinderImexId;
			item.cylinderImex.map((item2, index) => {
				// console.log("item2",item2)
				cylinderImexId = item2.cylinder;
				// console.log("cylinderImexId",cylinderImexId)
				item.cylinders.map((item1, index) => {
					if (cylinderImexId === item1.id) {
						// console.log("item1",item1);
						historyTurnBackExcel.push({
							serial: item1.serial,
							color: item1.color,
							typeValue: item1.valve,
							checkedDate: createdAt,
							cylinderType: item1.cylinderType,
							weight: item1.weight,
							addressSaler: address,
							nameSaler: name,
							// "driverCreatedAt":driverCreatedAt,
							// "fromInvoiceName":fromInvoiceName,
							// "nameDriver": nameDriver,
							// "address":address,
							signature: signature,
							// "status":status,
						});
					}
				});
			});
		});
		let historyExportBegin=[];
		let historySaler=[];
		sortHistoryExportDecs.map((item)=>{
			if(item.type==="SALE"){
				historySaler.push(item);
			}else{
				historyExportBegin.push(item);
			}
		})
		// let top10DataImport = await this.giveTop10DataExport(sortHistoryImportDecs);
		let top10DataExport = await this.giveTop10DataExport(sortHistoryExportDecs);
		let top10DataExportBegin = await this.giveTop10DataExport(historyExportBegin);
		// let top10DataSalerBegin = await this.giveTop10DataExport(historySaler);
		 //console.log("getHistoryImportAPI",top10DataExport);
		// console.log("historyTurnBackExcel",historyTurnBackExcel);
		// console.log("top10DataSalerBegin",top10DataSalerBegin);
		this.setState({
			allDataImport: sortHistoryImportDecs,
			allDataExport: sortHistoryExportDecs,
			historyExport: top10DataExport,
			historyExportBegin: dataExport.data.data,			
			historyImport: data.data.data,
			historyImportExcel: historyImportExcel,
			historyExportExcel: historyExportExcel,
			historyTurnBackExcel: historyTurnBackExcel,
		});
	}

	async getAllReports(
		startDate = this.state.startDateSubmit,
		endDate = this.state.endDateSubmit
	) {
		let resultImport = await getReportByUserAPI({ startDate, endDate });
		// console.log("resultImport",resultImport)
		if (resultImport.status === 200 || resultImport.status === 201) {
			if (resultImport.data.hasOwnProperty("err_msg")) {
				//let resultExport=await getReportByUserAPI("EXPORT");
				showToast(resultImport.data.err_msg);
			} else {
				this.setState({ resultImport: resultImport.data });
			}
		}
	}

	getChildAndNumberImportFunc = async (
		target_id = "",
		begin = this.state.startDate,
		end = this.state.endDate
	) => {
		const dataChart = await getChildAndNumberImportAPI(target_id, begin, end);
		const arr = [];
		if (dataChart.status === 200 || dataChart.status === 201) {
			if (dataChart.data.hasOwnProperty("err_msg")) {
				showToast(dataChart.data.err_msg);
			} else {
				for (let itemPieChart in dataChart.data) {
					arr.push({
						name: this.translateReportChart(itemPieChart),
						bình: dataChart.data[itemPieChart],
						amt: 1200,
					});
				}
				this.setState({ dataBarChart: arr });
			}
		}
		// console.log("getChildAndNumberImportFunc", data);
	};
	getTopExportCylinder = async () => {
		var user_cookies = await getUserCookies();
		let token = "Bearer " + user_cookies.token;
		let params = {
			id: user_cookies.user.id,
		};
		// await callApi("POST", TOPEXPORTCYLINDER, params, token).then((res) => {
		//   const arrTopCylinder = [];
		//   for (let i = 0; i < 10; i++) {
		//     arrTopCylinder.push(res.data.data[i]);
		//   }
		//   //  console.log("set interval:",arrTopCylinder);
		//   this.setState({
		//     listTopExportCylinder: arrTopCylinder,
		//   });
		// });
	};
	getUser() {
		const { dispatch } = this.props;
		const user = dispatch(getCookie("user"));
		if (typeof user !== "undefined") this.setState({ user: JSON.parse(user) });
	}

	handleChange = (date, params) => {
		let dateFormat = date.format("MM/DD/YYYY");

		const { endDate, startDate } = this.state;
		// console.log("aaaaaaaaaaaaa", date);
		// console.log("aaaaaaaaaaaaa11111111", startDate);

		if (params === 0) {
			if (date <= endDate || endDate === "") {
				this.setState(
					{
						startDate: date,
						startDateSubmit: dateFormat,
					},
					() => {
						this.handleButtonChangeCalendar();
						this.getAllReports(
							this.state.startDateSubmit,
							this.state.endDateSubmit
						);
					}
				);
				return;
			}
			showToast("Ngày bắt đầu không được lớn hơn ngày kết thúc");
			return false;
		} else {
			if (date >= startDate || startDate === "") {
				this.setState(
					{
						endDate: date,
						endDateSubmit: dateFormat,
					},
					() => {
						this.getAllReports(
							this.state.startDateSubmit,
							this.state.endDateSubmit
						);
						this.handleButtonChangeCalendar();
					}
				);
				return;
			}
			showToast("Ngày bắt đầu không được lớn hơn ngày kết thúc");
			return false;
		}
	};
	updateAllowReport = async (checked) => {
		const data = await updateAllowReportApi(checked);
		let user_cookies = await getUserCookies();
		const { dispatch } = this.props;
		user_cookies.user.allowReport = data.data.allowReport;
		await dispatch(setCookie("user", user_cookies));
		// console.log(data);
	};

	handleChangeReport = (checked) => {
		// console.log(checked);
		this.setState({ checked }, () => {
			this.updateAllowReport(this.state.checked);
		});
	};

	renderButtonIsPublic() {
		if (!!this.state.user) {
			if (
				this.state.user.user.owner ||
				(this.state.user.user.userType === "Factory" &&
					this.state.user.user.userRole === "SuperAdmin")
			) {
				return null;
			} else
				return (
					<div
						className="form-group"
						style={{
							alignItems: "center",
							display: "flex",
						}}
					>
						<label style={{ width: 150 }}>Mở cho TNSH xem</label>
						<Switch
							onChange={this.handleChangeReport}
							checked={this.state.checked}
						/>
					</div>
				);
		} else {
			return null;
		}
	}

	apiReportTurnBackInfoAPIFUC = async (
		target_id = "",
		factory_id = "",
		startDate = this.state.startDateSubmit,
		endDate = this.state.endDateSubmit
	) => {
		const data = await apiReportTurnBackInfoAPI(
			target_id,
			factory_id,
			startDate,
			endDate
		);
		this.setState({
			infoReportTurnback: data.data,
		});
		// console.log("apiReportTurnBackInfo", data.data);
	};
	getReportPieChartWhenClick = async (id, parentRoot, type) => {
		const data = await getReportPieChartAPI(id, parentRoot, type);
		// console.log("Data getReportPieChartAPI", data);
		const arrPieChart = [];
		const checkArrChart = [];
		// console.log("data.data11111111111111111111111", data.data.data);
		for (let itemPieChart in data.data) {
			arrPieChart.push({
				name: this.translateReportChart(itemPieChart),
				value: data.data[itemPieChart],
			});
		}
		arrPieChart.map(async (item) => {
			if (item.value === 0) {
				await checkArrChart.push(item);
			}
		});
		if (checkArrChart.length === arrPieChart.length) {
			this.setState({ checkDataChart: checkArrChart });
		} else {
			this.setState({ checkDataChart: [] });
		}
		// console.log("arrPieChart", arrPieChart);
		this.setState({
			dataPieChart: arrPieChart,
			dataTableChart: data.data,
		});
	};

	handleButtonChangeCalendar = async () => {
		if (this.state.user_current.userType === "General") {
			await this.apiReportTurnBackInfoAPIFUC(
				this.state.itemDataObject5.id,
				this.state.itemDataObject5.parentRoot,
				this.state.startDateSubmit,
				this.state.endDateSubmit
			);
		} else {
			if (this.state.dataObjectCheckedID1 === "") {
				await this.apiReportTurnBackInfoAPIFUC(
					this.state.user_current.id,
					this.state.user_current.parentRoot,
					this.state.startDateSubmit,
					this.state.endDateSubmit
				);
			} else if (this.state.dataObjectCheckedIDChild === 0) {
				await this.apiReportTurnBackInfoAPIFUC(
					this.state.itemData.id,
					this.state.itemData.parentRoot,
					this.state.startDateSubmit,
					this.state.endDateSubmit
				);
			} else if (this.state.dataObjectCheckedIDChild !== 0) {
				if (this.state.dataObjectCheckedTNMBFACID === "") {
					await this.apiReportTurnBackInfoAPIFUC(
						this.state.itemData.id,
						this.state.itemData.parentRoot,
						this.state.startDateSubmit,
						this.state.endDateSubmit
					);
				} else {
					if (this.state.dataObjectCheckedIDChild === 1) {
						if (
							this.state.dataObjectCheckedGENARALID === 0 ||
							this.state.dataObjectAgencyGeneralID === ""
						) {
							await this.apiReportTurnBackInfoAPIFUC(
								this.state.itemDataObject4.id,
								this.state.itemDataObject4.parentRoot,
								this.state.startDateSubmit,
								this.state.endDateSubmit
							);
						} else {
							await this.apiReportTurnBackInfoAPIFUC(
								this.state.itemDataObject5.id,
								this.state.itemDataObject5.parentRoot,
								this.state.startDateSubmit,
								this.state.endDateSubmit
							);
						}
					} else {
						await this.apiReportTurnBackInfoAPIFUC(
							this.state.itemDataObject4.id,
							this.state.itemDataObject4.parentRoot,
							this.state.startDateSubmit,
							this.state.endDateSubmit
						);
					}
				}
			}
		}
	};
	handleButtonFindDataChart = async () => {
		this.setState({ isLoading: true });
		let startDate = this.state.startDate.toDate().setHours(0, 0, 0, 0);
		let endDate = this.state.endDate.toDate().setHours(23, 59, 59, 999);
		//let target = this.state.objectData;
		// let target= this.state.dataObjectCheckedID1;
		// let statisticalType=this.state.dataObjectChecked.value===0?"byItsChildren" :"byItself";
		let statisticalType =
			this.state.dataObjectChecked.value === 0 &&
			this.state.user_current.userType === "Factory" &&
			this.state.user_current.userRole === "SuperAdmin"
				? "byItsChildren"
				: this.state.dataObjectChecked.value === 0 &&
				  this.state.user_current.userType === "Factory" &&
				  this.state.user_current.userRole === "Owner"
				? "byItself":
				(this.state.dataObjectCheckedGENARALID===1 && this.state.user_current.userType === "General")?"byItsChildren"
				: "byItself";
		// let data = await imexGetStatistics(endDate,startDate,target,statisticalType);
		// this.setState({
		//   dataImexGetStatisticsTotal:data.data.data.createdCylinder.total,
		//   dataImexGetStatisticsTotal_12kg:data.data.data.createdCylinder.total_CYL12KG+data.data.data.createdCylinder.total_CYL12KGCO,
		//   dataImexGetStatisticsTotal_45Kg:data.data.data.createdCylinder.total_CYL45KG,
		//   dataImexGetStatisticsTotal_50Kg:data.data.data.createdCylinder.total_CYL50KG,
		//   dataImexGetStatisticsInventoryCylinder_Total:data.data.data.inventoryCylinder.total,
		//   dataImexGetStatisticsInventoryCylinder_Total_12kg:data.data.data.inventoryCylinder.total_CYL12KG+data.data.data.inventoryCylinder.total_CYL12KGCO,
		//   dataImexGetStatisticsInventoryCylinder_Total_45kg:data.data.data.inventoryCylinder.total_CYL45KG,
		//   dataImexGetStatisticsInventoryCylinder_Total_50kg:data.data.data.inventoryCylinder.total_CYL50KG,
		//   dataImexGetStatisticsOutCylinder_Total :data.data.data.outCylinder.total,
		//   dataImexGetStatisticsOutCylinder_Total_12kg :data.data.data.outCylinder.total_CYL12KG+data.data.data.outCylinder.total_CYL12KGCO,
		//   dataImexGetStatisticsOutCylinder_Total_45kg :data.data.data.outCylinder.total_CYL45KG,
		//   dataImexGetStatisticsOutCylinder_Total_50kg :data.data.data.outCylinder.total_CYL50KG,
		//   dataImexGetStatisticsTurnbackCylinder_Total :data.data.data.turnbackCylinder.total,
		//   dataImexGetStatisticsTurnbackCylinder_Total_12kg :data.data.data.turnbackCylinder.total_CYL12KG+data.data.data.turnbackCylinder.total_CYL12KGCO,
		//   dataImexGetStatisticsTurnbackCylinder_Total_45kg :data.data.data.turnbackCylinder.total_CYL45KG,
		//   dataImexGetStatisticsTurnbackCylinder_Total_50kg :data.data.data.turnbackCylinder.total_CYL50KG,
		// });

		let data = "";
		//console.log("objectDataChildTNMBFAC",objectDataChildTNMBFAC);
		if (this.state.user_current.userType === "General") {
			this.getReportPieChartWhenClick(
				this.state.itemDataObject5.id,
				this.state.itemDataObject5.parentRoot,
				1
			);
			this.state.dataObjectChecked.value === 0
				? this.getImexBarChartWarehouse(
					this.state.user_current.id,
					startDate,
					endDate
			  )
				: this.getImexBarChart1(
						this.state.itemDataObject5.id,
						startDate,
						endDate
				  );
			// this.state.dataObjectChecked.value === 0

			//   ? await this.getImexPieChart(this.state.itemDataObject5.id, endDate)
			//   : await this.getImexPieChart1(this.state.itemDataObject5.id, endDate);

			this.state.dataObjectChecked.value === 0 &&
			this.state.user_current.userType === "Factory" &&
			this.state.user_current.userRole === "SuperAdmin"
				? this.getImexPieChartWareHouse(this.state.user_current.id, endDate)
				: this.state.dataObjectChecked.value !== 0 &&
				  this.state.user_current.userType === "Factory" &&
				  this.state.user_current.userRole === "SuperAdmin"
				? this.getImexPieChart1(this.state.user_current.id, endDate)
				: this.getImexPieChartWareHouse(this.state.user_current.id, endDate);
			this.getStatisticsForGeneralAgency(
				new Date(endDate).toISOString(),
				new Date(startDate).toISOString(),
				this.state.itemDataObject5.id,
				statisticalType
			);
		} else {
			if (this.state.dataObjectCheckedID === 0) {
				this.apiReportTurnBackInfoAPIFUC(
					this.state.user_current.id,
					this.state.user_current.parentRoot,
					this.state.startDateSubmit,
					this.state.endDateSubmit
				);
				this.getChildAndNumberImportFunc(
					this.state.user_current.id,
					this.state.startDate,
					this.state.endDate
				);

				this.state.dataObjectChecked.value === 0 &&
				this.state.user_current.userType === "Factory" &&
				this.state.user_current.userRole === "SuperAdmin"
					? this.getImexBarChart(this.state.user_current.id, startDate, endDate)
					: this.state.dataObjectChecked.value !== 0 &&
					  this.state.user_current.userType === "Factory" &&
					  this.state.user_current.userRole === "SuperAdmin"
					? this.getImexBarChart1(
							this.state.user_current.id,
							startDate,
							endDate
					  )
					: this.getImexBarChartWarehouse(
							this.state.user_current.id,
							startDate,
							endDate
					  );

				this.state.dataObjectChecked.value === 0 &&
				this.state.user_current.userType === "Factory" &&
				this.state.user_current.userRole === "SuperAdmin"
					? this.getImexPieChart(this.state.user_current.id, endDate)
					: this.state.dataObjectChecked.value !== 0 &&
					  this.state.user_current.userType === "Factory" &&
					  this.state.user_current.userRole === "SuperAdmin"
					? this.getImexPieChart1(this.state.user_current.id, endDate)
					: this.getImexPieChartWareHouse(this.state.user_current.id, endDate);
				// this.state.dataObjectChecked.value === 0
				//   ? await this.getImexPieChart(this.state.user_current.id, endDate)
				//   : await this.getImexPieChart1(this.state.user_current.id, endDate);
						if(this.state.user_current.userType === "Agency" &&
						this.state.user_current.userRole === "SuperAdmin"){
							this.getStatisticsForGeneralAgency(
								new Date(endDate).toISOString(),
								new Date(startDate).toISOString(),
								"",
								statisticalType
							);
							return;
						}else{
							data = await imexGetStatistics(
								new Date(endDate).toISOString(),
								new Date(startDate).toISOString(),
								this.state.user_current.id,
								statisticalType
							);
						}
					
			}
			if (this.state.dataObjectCheckedID1 === "") {
				//gọi chính nó đang đăng nhập
				this.getReportPieChartWhenClick(
					this.state.user_current.id,
					this.state.user_current.parentRoot,
					1
				);
				this.getChildAndNumberImportFunc(
					this.state.user_current.id,
					this.state.startDate,
					this.state.endDate
				);
				this.state.dataObjectChecked.value === 0 &&
				this.state.user_current.userType === "Factory" &&
				this.state.user_current.userRole === "SuperAdmin"
					? this.getImexBarChart(this.state.user_current.id, startDate, endDate)
					: this.state.dataObjectChecked.value !== 0 &&
					  this.state.user_current.userType === "Factory" &&
					  this.state.user_current.userRole === "SuperAdmin"
					? this.getImexBarChart1(
							this.state.user_current.id,
							startDate,
							endDate
					  )
					: this.getImexBarChartWarehouse(
							this.state.user_current.id,
							startDate,
							endDate
					  );

				this.state.dataObjectChecked.value === 0 &&
				this.state.user_current.userType === "Factory" &&
				this.state.user_current.userRole === "SuperAdmin"
					? this.getImexPieChart(this.state.user_current.id, endDate)
					: this.state.dataObjectChecked.value !== 0 &&
					  this.state.user_current.userType === "Factory" &&
					  this.state.user_current.userRole === "SuperAdmin"
					? this.getImexPieChart1(this.state.user_current.id, endDate)
					: this.getImexPieChartWareHouse(this.state.user_current.id, endDate);

				// this.state.dataObjectChecked.value === 0
				//   ? await this.getImexBarChart(this.state.user_current.id, startDate, endDate)
				//   : await this.getImexBarChart1(this.state.user_current.id, startDate, endDate);
				// this.state.dataObjectChecked.value === 0
				//   ? await this.getImexPieChart(this.state.user_current.id,endDate)
				//   : await this.getImexPieChart1(this.state.user_current.id, endDate);
				data = await imexGetStatistics(
					new Date(endDate).toISOString(),
					new Date(startDate).toISOString(),
					this.state.user_current.id,
					statisticalType
				);
			} else if (this.state.dataObjectCheckedIDChild === 0) {
				this.getReportPieChartWhenClick(
					this.state.itemData.id,
					this.state.itemData.parentRoot,
					1
				);
				this.getChildAndNumberImportFunc(
					this.state.itemData.id,
					this.state.startDate,
					this.state.endDate
				);

				this.state.dataObjectChecked.value === 0
					? this.getImexBarChart(this.state.itemData.id, startDate, endDate)
					: this.getImexBarChart1(this.state.itemData.id, startDate, endDate);
				this.state.dataObjectChecked.value === 0
					? this.getImexPieChart(this.state.itemData.id)
					: this.getImexPieChart1(this.state.itemData.id, endDate);

				data = await imexGetStatistics(
					new Date(endDate).toISOString(),
					new Date(startDate).toISOString(),
					this.state.itemData.id,
					statisticalType
				);
			} else if (this.state.dataObjectCheckedIDChild !== 0) {
				if (this.state.dataObjectCheckedTNMBFACID === "") {
					this.getReportPieChartWhenClick(
						this.state.itemData.id,
						this.state.itemData.parentRoot,
						1
					);
					this.getChildAndNumberImportFunc(
						this.state.itemData.id,
						this.state.startDate,
						this.state.endDate
					);

					this.state.dataObjectChecked.value === 0
						? this.getImexBarChart(this.state.itemData.id, startDate, endDate)
						: this.getImexBarChart1(this.state.itemData.id, startDate, endDate);
					this.state.dataObjectChecked.value === 0
						? this.getImexPieChart(this.state.itemData.id, endDate)
						: this.getImexPieChart1(this.state.itemData.id, endDate);

					data = await imexGetStatistics(
						new Date(endDate).toISOString(),
						new Date(startDate).toISOString(),
						this.state.itemData.id,
						statisticalType
					);
				} else {
					if (this.state.dataObjectCheckedIDChild === 1) {
						if (
							this.state.dataObjectCheckedGENARALID === 0 ||
							this.state.dataObjectAgencyGeneralID === ""
						) {
							this.getReportPieChartWhenClick(
								this.state.itemDataObject4.id,
								this.state.itemDataObject4.parentRoot,
								1
							);
							this.getChildAndNumberImportFunc(
								this.state.itemDataObject4.id,
								this.state.startDate,
								this.state.endDate
							);
							this.state.dataObjectChecked.value === 0
								? this.getImexBarChart(
										this.state.itemDataObject4.id,
										startDate,
										endDate
								  )
								: this.getImexBarChart1(
										this.state.itemDataObject4.id,
										startDate,
										endDate
								  );
							this.state.dataObjectChecked.value === 0
								? this.getImexPieChart(this.state.itemDataObject4.id, endDate)
								: this.getImexPieChart1(this.state.itemDataObject4.id, endDate);

							data = await imexGetStatistics(
								new Date(endDate).toISOString(),
								new Date(startDate).toISOString(),
								this.state.itemDataObject4.id,
								statisticalType
							);
						} else {
							this.getReportPieChartWhenClick(
								this.state.itemDataObject5.id,
								this.state.itemDataObject5.parentRoot,
								1
							);

							this.getChildAndNumberImportFunc(
								this.state.itemDataObject5.id,
								this.state.startDate,
								this.state.endDate
							);

							this.state.dataObjectChecked.value === 0
								? this.getImexBarChart(
										this.state.itemDataObject5.id,
										startDate,
										endDate
								  )
								: this.getImexBarChart1(
										this.state.itemDataObject5.id,
										startDate,
										endDate
								  );

							this.state.dataObjectChecked.value === 0
								? this.getImexPieChart(this.state.itemDataObject5.id, endDate)
								: this.getImexPieChart1(this.state.itemDataObject5.id, endDate);

							data = await imexGetStatistics(
								new Date(endDate).toISOString(),
								new Date(startDate).toISOString(),
								this.state.itemDataObject5.id,
								statisticalType
							);
						}
					} else {
						this.getReportPieChartWhenClick(
							this.state.itemDataObject4.id,
							this.state.itemDataObject4.parentRoot,
							1
						);
						this.getChildAndNumberImportFunc(
							this.state.itemDataObject4.id,
							this.state.startDate,
							this.state.endDate
						);
						this.state.dataObjectChecked.value === 0
							? this.getImexBarChart(
									this.state.itemDataObject4.id,
									startDate,
									endDate
							  )
							: this.getImexBarChart1(
									this.state.itemDataObject4.id,
									startDate,
									endDate
							  );

						this.state.dataObjectChecked.value === 0
							? this.getImexPieChart(this.state.itemDataObject4.id, endDate)
							: this.getImexPieChart1(this.state.itemDataObject4.id, endDate);

						data = await imexGetStatistics(
							new Date(endDate).toISOString(),
							new Date(startDate).toISOString(),
							this.state.itemDataObject4.id,
							statisticalType
						);
					}
				}
			}
		}
		//  console.log("this.state.startDate1111111111111111", data);
		if(this.state.user_current.userType === "General"){
			return;
		}else{
			this.setState({
				dataImexGetStatisticsTotal: data.data.data.createdCylinder.total,
				dataImexGetStatisticsTotal_12kg:
					data.data.data.createdCylinder.total_CYL12KG +
					data.data.data.createdCylinder.total_CYL12KGCO,
				dataImexGetStatisticsTotal_45Kg:
					data.data.data.createdCylinder.total_CYL45KG,
				dataImexGetStatisticsTotal_50Kg:
					data.data.data.createdCylinder.total_CYL50KG,
				dataImexGetStatisticsInventoryCylinder_Total:
					data.data.data.inventoryCylinder.total,
				dataImexGetStatisticsInventoryCylinder_Total_12kg:
					data.data.data.inventoryCylinder.total_CYL12KG +
					data.data.data.inventoryCylinder.total_CYL12KGCO,
				dataImexGetStatisticsInventoryCylinder_Total_45kg:
					data.data.data.inventoryCylinder.total_CYL45KG,
				dataImexGetStatisticsInventoryCylinder_Total_50kg:
					data.data.data.inventoryCylinder.total_CYL50KG,
				dataImexGetStatisticsOutCylinder_Total: data.data.data.outCylinder.total,
				dataImexGetStatisticsOutCylinder_Total_12kg:
					data.data.data.outCylinder.total_CYL12KG +
					data.data.data.outCylinder.total_CYL12KGCO,
				dataImexGetStatisticsOutCylinder_Total_45kg:
					data.data.data.outCylinder.total_CYL45KG,
				dataImexGetStatisticsOutCylinder_Total_50kg:
					data.data.data.outCylinder.total_CYL50KG,
				dataImexGetStatisticsTurnbackCylinder_Total:
					data.data.data.turnbackCylinder.total,
				dataImexGetStatisticsTurnbackCylinder_Total_12kg:
					data.data.data.turnbackCylinder.total_CYL12KG +
					data.data.data.turnbackCylinder.total_CYL12KGCO,
				dataImexGetStatisticsTurnbackCylinder_Total_45kg:
					data.data.data.turnbackCylinder.total_CYL45KG,
				dataImexGetStatisticsTurnbackCylinder_Total_50kg:
					data.data.data.turnbackCylinder.total_CYL50KG,
				dataImexGetStatisticsImportCellCylinder_Total:
					data.data.data.importCellCylinder.total,
				dataImexGetStatisticsImportCellCylinder_Total_12kg:
					data.data.data.importCellCylinder.total_CYL12KG,
				dataImexGetStatisticsImportCellCylinder_Total_45kg:
					data.data.data.importCellCylinder.total_CYL45KG,
				dataImexGetStatisticsImportCellCylinder_Total_50kg:
					data.data.data.importCellCylinder.total_CYL50KG,
				isLoading: false,
			});
		}
		
	};

	handleButtonExportExcel = async () => {
		let dataList = [];
		//console.log("this.state.dataObjectCheckedIDChild", this.state.dataObjectCheckedIDChild);
		let { dataValueReports } = this.state;
		if (!dataValueReports) {
			showToast("Vui Lòng Chọn Kiểu Xuất Excel!!");
			return;
		}
		// console.log("vaoday");

		if (this.state.user_current.userType === "General") {
			await getReportExcelByTargetAndDateTimeAPI(
				[this.state.itemDataObject5.id],
				this.state.dataValueReports,
				this.state.startDateSubmit,
				this.state.endDateSubmit
			);

			//await this.getReportPieChartWhenClick(this.state.itemDataObject5.id, this.state.itemDataObject5.parentRoot, 1)
		} else {
			if (this.state.dataObjectCheckedID === 0) {
				await getReportExcelByTargetAndDateTimeAPI(
					[this.state.user_current.id],
					this.state.dataValueReports,
					this.state.startDateSubmit,
					this.state.endDateSubmit
				);

				// console.log("data11111111",data);
				return;
			}
			if (this.state.dataObjectCheckedID1 === "") {
				//chưa chọn cấp 1
				dataList = this.state.dataChild1.map((item) => {
					if (item.value !== "") {
						return item.value;
					}
				});
				dataList = dataList.filter((x) => !!x);
				await getReportExcelByTargetAndDateTimeAPI(
					dataList,
					this.state.dataValueReports,
					this.state.startDateSubmit,
					this.state.endDateSubmit
				);
			} else if (this.state.dataObjectCheckedIDChild === 0) {
				//luc nay đã chọn cấp 1 và chọn cấp 2 tất cả
				await getReportExcelByTargetAndDateTimeAPI(
					[this.state.itemData.id],
					this.state.dataValueReports,
					this.state.startDateSubmit,
					this.state.endDateSubmit
				);
			} else if (this.state.dataObjectCheckedIDChild !== 0) {
				//luc nay da chon cap 1 va cap 2
				if (this.state.dataObjectCheckedTNMBFACID === "") {
					dataList = this.state.dataChild3.map((item) => {
						if (item.value !== "") {
							return item.value;
						}
					});
					dataList = dataList.filter((x) => !!x);
					await getReportExcelByTargetAndDateTimeAPI(
						dataList,
						this.state.dataValueReports,
						this.state.startDateSubmit,
						this.state.endDateSubmit
					);
				} else {
					if (this.state.dataObjectCheckedIDChild === 1) {
						//chon lien tnmb

						if (
							this.state.dataObjectCheckedGENARALID === 0 ||
							this.state.dataObjectCheckedGENARALID === ""
						) {
							await getReportExcelByTargetAndDateTimeAPI(
								[this.state.dataObjectCheckedTNMBFAC.value],
								this.state.dataValueReports,
								this.state.startDateSubmit,
								this.state.endDateSubmit
							);
						} else {
							if (this.state.dataObjectAgencyGeneralID === "") {
								dataList = this.state.dataChild4.map((item) => {
									if (item.value !== "") {
										return item.value;
									}
								});
								dataList = dataList.filter((x) => !!x);
								await getReportExcelByTargetAndDateTimeAPI(
									dataList,
									this.state.dataValueReports,
									this.state.startDateSubmit,
									this.state.endDateSubmit
								);
							} else
								await getReportExcelByTargetAndDateTimeAPI(
									[this.state.itemDataObject5.id],
									this.state.dataValueReports,
									this.state.startDateSubmit,
									this.state.endDateSubmit
								);
						}
					} else {
						if (
							this.state.dataObjectChecked1 === 0 ||
							this.state.dataObjectChecked1 === ""
						) {
							dataList = this.state.dataChild4.map((item) => {
								if (item.value !== "") {
									return item.value;
								}
							});
							dataList = dataList.filter((x) => !!x);
							await getReportExcelByTargetAndDateTimeAPI(
								dataList,
								this.state.dataValueReports,
								this.state.startDateSubmit,
								this.state.endDateSubmit
							);
						} else {
							await getReportExcelByTargetAndDateTimeAPI(
								[this.state.itemDataObject4.id],
								this.state.dataValueReports,
								this.state.startDateSubmit,
								this.state.endDateSubmit
							);
						}
					}
				}
			}
		}

		// //selectedId
		// console.log(this.state.selectedId);

		// //valueReports
		// console.log(this.state.dataValueReports);

		// //StartDate
		// console.log(this.state.startDateSubmit);
		// //EndDate

		// console.log(this.state.endDateSubmit);
	};

	//TODO đưa vào lúc select đối tượng.
	filterParamsSelect = async (userType, userRole = "") => {
		let valueReports = [];

		switch (userType) {
			case "Factory":
				if (userRole === "SuperAdmin") {
					valueReports = [...ACTION_REPORT_TYPE].filter(
						(x) =>
							[
								"IMPORT",
								"EXPORT",
								"IMPORT_CELL",
								"EXPORT_CELL",
								"TURN_BACK",
								"CREATE",
								"EXPORT_CELL",
								"SYNTHESIS_REPORT_CREATE",
								"SYNTHESIS_REPORT_DELIVERY",
							].includes(x.value) === true
					);
					// let ACTION_REPORT_TYPE = [
					//   { value: "IMPORT", label: "Nhập Hàng" },
					//   { value: "EXPORT", label: "Xuất Hàng" },
					//   { value: "IMPORT_CELL", label: "Nhập vỏ" },
					//   { value: "EXPORT_CELL", label: "Xuất Vỏ" },
					//   { value: "TURN_BACK", label: "Hồi Lưu" },
					//   { value: "FIX", label: "Xuất Sửa Chữa" },
					//   { value: "CREATE", label: "Bình Đã Tạo" },
					//   { value: "SYNTHESIS_REPORT_CREATE", label: "BCT bình đã tạo" },
					//   { value: "SYNTHESIS_REPORT_DELIVERY", label: "BCT giao nhận bình" },
					// ];
					// if (!!valueReports) {
					//   valueReports[0].label = "Nhập Vỏ1";
					// }
				} else {
					valueReports = ACTION_REPORT_TYPE.filter(
						(x) =>
							[
								"EXPORT",
								"IMPORT_CELL",
								"FIX",
								"TURN_BACK",
								"CREATE",
								"EXPORT_CELL",
							].includes(x.value) === true
					);
					valueReports = [...valueReports];
					if (!!valueReports) {
						valueReports[0].label = this.props.t("EXPORT");
						//valueReports[5].label="Xuất vỏ"
						valueReports.push(
							{
								value: "SYNTHESIS_REPORT_CREATE",
								label: "SYNTHESIS_REPORT_CREATE",
							},
							{
								value: "SYNTHESIS_REPORT_DELIVERY",
								label: "SYNTHESIS_REPORT_DELIVERY",
							}
						);
					}
				}
				break;
			case "General":
				valueReports = ACTION_REPORT_TYPE.filter(
					(x) => ["EXPORT", "IMPORT", "TURN_BACK"].includes(x.value) === true
				);
				valueReports = [...valueReports];
				valueReports[0].label = "Nhập Hàng";
				break;
			case "Agency":
				valueReports = ACTION_REPORT_TYPE.filter(
					(x) => ["EXPORT", "IMPORT", "TURN_BACK"].includes(x.value) === true
				);
				valueReports = [...valueReports];
				valueReports[0].label = "IMPORT_CYLINDER";
				break;
			case "Fixer":
				valueReports = ACTION_REPORT_TYPE.filter(
					(x) =>
						["EXPORT_CELL", "IMPORT", "TURN_BACK"].includes(x.value) === true
				);
				valueReports = [...valueReports];
				valueReports[0].label = "IMPORT_EMPTY";
				break;
			default:
				if (userRole === SuperAdmin) {
					valueReports = [...ACTION_REPORT_TYPE];
				} else {
					valueReports = ACTION_REPORT_TYPE.filter(
						(x) =>
							["EXPORT", "IMPORT", "FIX", "TURN_BACK"].includes(x.value) ===
							true
					);
				}
				break;
		}
		this.setState({ valueReports });
	};

	//đối tượng 1
	changeDataChoose1 = async (userType = "", user_id) => {
		//{ label: "Chi nhánh trực thuộc", value: "" }
		const arrData = [];
		const data = await getReportChildsAPI(userType, user_id);
		data.data.map((item) => {
			arrData.push({ label: item.name, value: item.id, itemData: item });
		});
		this.setState({ dataChild1: arrData });
		// console.log("33333333333333333333333333333333333333333333", data);
	};
	handleObjectPickTypeOfReportExcel = async (value) => {
		this.setState({
			actionTypeReportExcel: value.value,
			dataValueReports: value.value,
		});
	};
	handleObjectDataExecelAgency = async (value) => {
		this.setState({
			objectDataExecelAgencyValue: value,
		});
	};

	handleObjectData1 = async (langValue) => {
		this.resetData(2);
		this.setState(
			{
				dataObjectChecked1: langValue,
				dataObjectCheckedID1: langValue.value,
				itemData: langValue.itemData,
				dataObjectCheckedIDChild: 0,
				selectedId: langValue.value,
			},
			() => {
				!!this.state.dataObjectChecked1.itemData
					? this.filterParamsSelect(
							this.state.dataObjectChecked1.itemData.userType,
							this.state.dataObjectChecked1.itemData.userRole
					  )
					: "";
			}
		);
		//console.log("this.state.itemData",this.state.itemData);
	};
	handleObjectData = async (langValue) => {
		this.resetData(1);
		this.setState(
			{ dataObjectChecked: langValue, dataObjectCheckedID: langValue.value },
			() => {
				// console.log(this.state.dataObjectCheckedID);
				if (this.state.dataObjectCheckedID !== 0) {
					this.changeDataChoose1(langValue.name, this.state.user_current.id);

					this.filterParamsSelect(langValue.name, null);
				} else {
					this.getReportPieChartWhenClick("", "", 0);
					let { user_current } = this.state;
					this.filterParamsSelect(user_current.userType, user_current.userRole);
				}
			}
		);
	};

	handleObjectDataChild = async (langValue) => {
		this.resetData(3);
		this.setState(
			{
				dataObjectCheckedChild: langValue,
				dataObjectCheckedIDChild: langValue.value,
			},
			() => {
				this.changeDataChoose4(langValue.name, this.state.itemData.id);
				if (langValue.value === 0) {
					this.filterParamsSelect(
						!!this.state.dataObjectChecked
							? this.state.dataObjectChecked.name
							: "Factory",
						""
					);
				} else {
					this.filterParamsSelect(langValue.name, null);
				}
			}
		);
	};
	handleObjectDataChildCTC = async (langValue) => {
		this.resetData(2);
		this.setState(
			{
				dataObjectCheckedChild: langValue,
				dataObjectCheckedIDChild: langValue.value,
				//label: "Chi nhánh trực thuộc", value: 0
				dataObjectCheckedTNMBFAC: {},
			},
			() => {
				this.changeDataChoose4(langValue.name, this.state.user_current.id);
				if (langValue.value === 0) {
					let { user_current } = this.state;
					this.filterParamsSelect(user_current.userType, user_current.userRole);
				} else {
					this.filterParamsSelect(langValue.name, null);
				}
				//this.filterParamsSelect(langValue.name,null);
			}
		);
	};
	//đối tượng 4

	changeDataChoose4 = async (userType = "", user_id) => {
		//{ label: "Chi nhánh trực thuộc", value: "" }
		const arrData = [];
		const data = await getReportChildsAPI(userType, user_id);
		data.data.map((item) => {
			arrData.push({ label: item.name, value: item.id, itemData: item });
		});
		//dataChild3 cấp 3
		this.setState({ dataChild3: arrData });
	};
	handleObjectDataChildTNMB = async (langValue) => {
		this.resetData(3);
		this.setState(
			{
				dataObjectCheckedTNMBFAC: langValue,
				dataObjectCheckedTNMBFACID: langValue.value,
				itemDataObject4: langValue.itemData,
				selectedId: langValue.value,
			},
			() => {
				!!this.state.dataObjectCheckedTNMBFAC.itemData
					? this.filterParamsSelect(
							this.state.dataObjectCheckedTNMBFAC.itemData.userType,
							this.state.dataObjectCheckedTNMBFAC.itemData.userRole
					  )
					: "";
			}
		);
	};

	//handleObjectDataGENARALFAC
	handleObjectDataGENARALFAC = async (langValue) => {
		this.resetData(3);
		this.setState(
			{
				dataObjectCheckedGENARAL: langValue,
				dataObjectCheckedGENARALID: langValue.value,
			},
			() => {
				this.changeDataChoose5(
					langValue.name,
					this.state.dataObjectCheckedTNMBFACID
				);
				if (langValue.value === 0) {
					this.filterParamsSelect(
						!!this.state.dataObjectCheckedChild
							? this.state.dataObjectCheckedChild.name
							: "Factory",
						""
					);
				} else {
					this.filterParamsSelect(langValue.name, null);
				}
			}
		);
	};

	//Genaral login
	handleObjectDataGENARAL = async (langValue) => {
		this.resetData(3);
		this.setState(
			{
				dataObjectCheckedGENARAL: langValue,
				dataObjectCheckedGENARALID: langValue.value,
			},
			() => {
				this.changeDataChoose5(langValue.name, this.state.user_current.id);
				if (langValue.value === 0) {
					// this.filterParamsSelect(user_current.userType, user_current.userRole);
				} else {
					this.filterParamsSelect(langValue.name, null);
				}
			}
		);
	};
	changeDataChoose5 = async (userType = "", user_id) => {
		//{ label: "Chi nhánh trực thuộc", value: "" }
		const arrData = [];
		const data = await getReportChildsAPI(userType, user_id);
		data.data.map((item) => {
			arrData.push({ label: item.name, value: item.id, itemData: item });
		});
		//dataChild4 cấp 4
		this.setState({ dataChild4: arrData });
	};
	handleObjectDataAgencyGeneral = async (langValue) => {
		this.setState(
			{
				dataObjectAgencyGeneral: langValue,
				dataObjectAgencyGeneralID: langValue.value,
				itemDataObject5: langValue.itemData,
				selectedId: langValue.value,
				dataValueReports: "",
			},
			() => {
				!!this.state.dataObjectAgencyGeneral.itemData
					? this.filterParamsSelect(
							this.state.dataObjectAgencyGeneral.itemData.userType,
							this.state.dataObjectAgencyGeneral.itemData.userRole
					  )
					: "";
			}
		);
	};
	callDataTurnBackInfo = async (data) => {
		const dataTurnBack = await callDataTurnBackInfoAPI(data);
		if (dataTurnBack.status === 200 || dataTurnBack.status === 201) {
			this.setState({ dataTurnBacks: dataTurnBack.data });
		}
	};

	renderBarChart() {
		// console.log(
		//   "sdasdasd",
		//   this.state.itemData,
		//   this.state.itemDataObject4,
		//   this.state.itemDataObject5
		// );
		if (
			this.state.itemData.userType === Constants.AGENCY ||
			this.state.itemDataObject4.userType === Constants.AGENCY ||
			this.state.itemDataObject5.userType === Constants.AGENCY
		) {
			return null;
		} else {
			return (
				<div className="card card-body">
					{/* <ShowBarChart dataBarChart={this.state.dataImexBarGetExport} /> */}
					<ResponsiveContainer width="100%" height={500}>
						<BarChart
							height={500}
							data={this.state.dataImexBarGetExportWarehouse}
							margin={{
								top: 5,
								right: 0,
								left: 0,
								bottom: 10,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" label={<Text width={30} />} />
							<YAxis />
							<Tooltip />
							<Legend/>
							<Bar dataKey="Xuất hàng" barSize={15} fill="#1890FF" />
							{this.state.user_current.userType==="General" && this.state.user_current.userRole==="SuperAdmin" &&
							(
								<Bar dataKey="Bán hàng" barSize={15} fill="#ee5592" />
		
							)}
						</BarChart>
					</ResponsiveContainer>
					<div style={{ display: "flex", justifyContent: "center" }}>
						<label> {this.props.t("DELIVERY_CHART")} </label>
					</div>
				</div>
			);
		}
	}
	renderImexBarChart() {
		// console.log(
		//   "sdasdasd",
		//   this.state.itemData,
		//   this.state.itemDataObject4,
		//   this.state.itemDataObject5
		// );
		if (
			this.state.itemData.userType === Constants.AGENCY ||
			this.state.itemDataObject4.userType === Constants.AGENCY ||
			this.state.itemDataObject5.userType === Constants.AGENCY
		) {
			return null;
		} else {
			return (
				<div className="card card-body">
					{/* <ShowBarChart dataBarChart={this.state.dataImexBarGetExport} /> */}
					<ResponsiveContainer width="100%" height={500}>
						<BarChart
							height={500}
							data={this.state.dataImexBarGetExport}
							margin={{
								top: 5,
								right: 0,
								left: 0,
								bottom: 10,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" hide="true"></XAxis>
							<YAxis />
							<Tooltip />
							<Bar dataKey="bình" barSize={15} fill="#1890FF">
								<LabelList dataKey="name" position="bottom" />
							</Bar>
						</BarChart>
					</ResponsiveContainer>
					<div style={{ display: "flex", justifyContent: "center" }}>
						<label> {this.props.t("DELIVERY_CHART")} </label>
					</div>
				</div>
			);
		}
	}

	makeOptions(data) {		
		return data.map((item) => {
			return {
				value: item.value,
				label: this.props.t(item.label),
				name: item.name,
				itemData:item.itemData
			};
		});
	}
	
	handleChangeNumberOfCylinder = ()=>{
		this.setState({
			visibleNumberOfCylinder:true
		});
	
	}
	onClickNumberOfCylinder = (status) => {
		this.setState({
			visibleNumberOfCylinder: status,
		});
	};
	render() {
		// console.log("historySalerYen",this.state.index);
		const dataObjectChecked=this.state.dataObjectChecked;
		const dataObjectCheckedChild=this.state.dataObjectCheckedChild;
		const objectData = this.makeOptions(this.state.objectData);
		const objectDataExecelAgency = this.makeOptions(
			this.state.objectDataExecelAgency
		);
		const valueReports = this.makeOptions(this.state.valueReports);
		const objectDataChildTNMBFAC = this.makeOptions(
			this.state.objectDataChildTNMBFAC
		);
		const objectDataChild = this.makeOptions(this.state.objectDataChild);
		const dataChild1 = this.makeOptions(this.state.dataChild1);
		const dataChild4 = this.makeOptions(this.state.dataChild4);

		const { user_current, objectDataExecelAgencyValue} = this.state;
		const {
			resultImport,
			historyExport,
			historyImport,
			allDataImport,
			historyExportBegin,
			historySaler
		} = this.state;
		const columns=[
			{
				title: 'STT',
				render:(record,index)=>{
					return record.numbers 
				}
			},
			{
				title: 'Chi Nhánh',
				render: (text, record) => {		
					console.log("record",record);
					return(
						<div>
							{typeof record.saler !== "undefined" && record.saler !== null	? record.saler.name: ""}
		
						</div>
					)
				}
			},
			{
				title: 'Khách Hàng',
				render: (text, record) => {
					let to_dest="";
					if (
						typeof record.to !== "undefined" &&
						record.to !== null
					) {
						to_dest = record.to.name;
					} else {
							if (
								typeof record.customer !== "undefined" &&
								record.customer !== null
							) {
								to_dest =  record.customer.name;
							}
						
					}
					// console.log("record",record.saler);
					return(
						<div>
							{to_dest}
						</div>
					)
				}
			},
			{
				title: 'Loại',
				render: (text, record) => {
					return(
						<div>
							{record.type === "EXPORT"? this.props.t("EXPORT"): record.type === "SALE"? "Bán Hàng": ""}
						</div>
					)
				}
			},
			{
				title: 'Ngày Giờ',
				render: (text, record) => {
					return(
						<div>
							{moment(record.createdAt).format("DD/MM/YYYY HH:mm")}
						</div>
					)
				}
			},
			{
				title: 'Số Lượng Bình',
				render: (text, record,index) => {
					let a=record;
					// console.log("record",record);
					// console.log("record",index);
					return(
						<div className="text-success">
							<lable onClick={() =>{
								this.setState({indexCylinders :record.cylinders});
								this.handleChangeNumberOfCylinder(this.state.index);
								}}>
								{record.numberOfCylinder}{" "}{this.props.t("CYLINDER")}
							</lable>
						</div>
					)
				}
			},
			{ 
                title: 'Xuất Excel',
                render:(record,index)=>{
                    console.log("record",record)
                    return(
                        <div>
                            <a style={{ color: "white" }}
							className="btn btn-create"
							download
							onClick={async () => { await getCylinderByHistoryId(record.id,"Xuat_Hang_" + record.id);}}
							type="submit"
							>
							Xuất hàng	
							</a>       
                        </div>
                    )
                    
                }
            },
		]
		// console.log("lich su import1", historyImport);
		// console.log("allDataImport",allDataImport);
		// console.log("lich su export", historyExport);
		// console.log("lich su sale", historySaler);
		// console.log("lich su historyExportBegin", historyExportBegin);
		// console.log("ususer_currenter",this.state.user_current);
		// console.log("ususer_currenter11111111111",resultImport);
		// console.log("objectDataExecelAgencyValue",objectDataExecelAgencyValue)
		//this._getArrayColor(12)
		return (
			<React.Fragment>
			{this.state.user&&this.state.user.user.userType==="General_Warehouse"?<DashBoardForAgentWarehouse/>:
			<div>	
				<main className="main-container container" id="mainContent">
					<ReactCustomLoading isLoading={this.state.isLoading} />
					<div className="main-content">
						<div className="seednet-header-info allow__btn">
							{this.renderButtonIsPublic()}
						</div>

						<div className="row">
							<div className="card col-lg-12">
								<div className="card-title">
									<div className="flexbox">
										<h4> {this.props.t("STATISTICAL")} </h4>
									</div>
								</div>
								<div className="card-body">
									<div className="form-row">
										<div className="start-date-picker-dashboard date__block col-lg-6 form-group row">
											<label className="col-form-label start-day">
												{this.props.t("START_DATE")}
											</label>
											<DatePicker
												showPopperArrow={false}
												selected={this.state.startDate}
												onChange={(date) => this.handleChange(date, 0)}
												showMonthDropdown
												showYearDropdown
												dateFormat="DD/MM/YYYY"
												dropdownMode="select"
												locale="vi"
											/>
										</div>
										<div className="end-date-picker-dashboard date__block col-lg-6 form-group row">
											<label className="start-day col-form-label">
												{this.props.t("END_DATE")}
											</label>
											<DatePicker
												showPopperArrow={false}
												selected={this.state.endDate}
												onChange={(date) => this.handleChange(date, 1)}
												showMonthDropdown
												showYearDropdown
												// dateFormat="YYYY/MM/DD"
												dropdownMode="select"
											/>
										</div>
									</div>
									<div className="form-row ">
										{/* <label className="col-form-label">Đối tượng</label> */}
										<div
											className="col-lg-6 form-group select-dashboard-input-dashboard"
											style={{ padding: 0 }}
										>
											{user_current.userType === "Factory" &&
											user_current.userRole === "SuperAdmin" ? (
												// <div className="select-dashboard-input-dashboard pr-4">
												<div
													className="form-group row "
													style={{ marginLeft: "6px" }}
												>
													<label
														className="col-form-label"
														style={{ width: 84 }}
													>
														{this.props.t("OBJECT")}
													</label>
													<Select
														options={objectData}
														onChange={this.handleObjectData.bind(this)}
														placeholder={this.props.t("CHOOSE")}
														value={dataObjectChecked}
														style={{ marginLeft: "40px" }}
													/>
												</div>
											) : // </div>

											user_current.userType === "Factory" &&
											  user_current.userRole !== "SuperAdmin" ? (
												// < className="select-dashboard-input-dashboard pr-4">
												<div
													className="form-group row "
													style={{ marginLeft: "6px" }}
												>
													<label className=" col-form-label">
														{this.props.t("OBJECT")}
													</label>
													<Select
														options={objectDataChild}
														onChange={this.handleObjectDataChildCTC.bind(this)}
														placeholder={this.props.t("CHOOSE")}
														value={dataObjectCheckedChild}
														style={{ marginLeft: "58px" }}
													/>
												</div>
											) : null}

											{this.state.dataObjectCheckedID !== 0 ? (
												<div className="pr-4">
													<div
														className="form-group"
														style={{ marginLeft: "130px" }}
													>
														<label className="col-form-label">
															{this.props.t("OBJECT")}
														</label>
														<Select
															options={dataChild1}
															onChange={this.handleObjectData1.bind(this)}
															placeholder={this.props.t("CHOOSE")}
															value={this.state.dataObjectChecked1}
														/>
													</div>
												</div>
											) : null}
											{/* Chọn tên kho(3) và khách hàng(1): cho phép truy xuất xuống chi nhánh */}
											{(this.state.dataObjectCheckedID === 3 ||
												this.state.dataObjectCheckedID === 1) &&
											this.state.dataObjectCheckedID1 !== "" ? (
												<div className="pr-4">
													<div
														className="form-group"
														style={{ marginLeft: "130px" }}
													>
														{/* Delete Object  not .. */}
														{/*<label className="col-form-label">Đối tượng trực thuộc</label>*/}
														{/* <Select
                              options={this.state.objectDataChild}
                              onChange={this.handleObjectDataChild.bind(this)}
                              placeholder={this.props.t("CHOOSE")}
                              value={this.state.dataObjectCheckedChild}
                            /> */}
													</div>
												</div>
											) : null}
											{/* {this.state.dataObjectCheckedIDChild !== 0 ? (
                        <div className="pr-4">
                          <div
                            className="form-group"
                            style={{ marginLeft: "130px" }}
                          >
                            <label className="col-form-label">
                              Dữ liệu trực thuộc
                            </label>
                            <Select
                              options={this.state.dataChild3}
                              onChange={this.handleObjectDataChildTNMB.bind(
                                this
                              )}
                              placeholder={this.props.t("CHOOSE")}
                              value={this.state.dataObjectCheckedTNMBFAC}
                            />
                          </div>
                        </div>
                      ) : null} */}
											{this.state.dataObjectCheckedIDChild === 1 &&
											this.state.dataObjectCheckedTNMBFACID !== "" ? (
												<div className="pr-4">
													<div
														className="form-group"
														style={{ marginLeft: "130px" }}
													>
														{/*<label className="col-form-label">Lựa chọn đối tượng</label>*/}
														<Select
															options={objectDataChildTNMBFAC}
															onChange={this.handleObjectDataGENARALFAC.bind(
																this
															)}
															placeholder={this.props.t("CHOOSE")}
															value={this.state.dataObjectCheckedGENARAL}
														/>
													</div>
												</div>
											) : null}
											{user_current.userType === "General" ? (
												<div className="pr-4">
													<div
														className="form-group row "
														style={{ marginLeft: "6px" }}
													>
														{/* <label className="col-form-label">Đối tượng tnmb</label> */}
														<label className="col-form-label">
															{this.props.t("OBJECT")}
														</label>
														<Select
															options={objectDataChildTNMBFAC}
															onChange={this.handleObjectDataGENARAL.bind(this)}
															placeholder={this.props.t("CHOOSE")}
															value={this.state.dataObjectCheckedGENARAL}
															style={{ marginLeft: "56px" }}
														/>
													</div>
												</div>
											) : null}
											{this.state.dataObjectCheckedGENARALID !== "" ? (
												<div className="pr-4">
													<div
														className="form-group"
														style={{ marginLeft: "130px" }}
													>
														{/*<label className="col-form-label">Đối tượng trực thuộc</label>*/}
														<Select
															options={dataChild4}
															onChange={this.handleObjectDataAgencyGeneral.bind(
																this
															)}
															placeholder={this.props.t("CHOOSE")}
															value={this.state.dataObjectAgencyGeneral}
														/>
													</div>
												</div>
											) : null}
										</div>
									</div>
									<div className="form-row">
										<div className="col-lg-6 form-group select-dashboard-input-dashboard">
											{user_current.userType === "Agency" &&
											user_current.userRole === "SuperAdmin" ? (
												<div className="form-group row">
													<label className="col-form-label export-excel">
														{this.props.t("TYPE_EXCEL")}
													</label>
													<Select
														options={objectDataExecelAgency}
														onChange={this.handleObjectDataExecelAgency.bind(
															this
														)}
														placeholder={this.props.t("SELECT")}
														value={objectDataExecelAgencyValue}
													/>
												</div>
											) : (
												<div className="form-group row">
													<label className="col-form-label export-excel">
														{this.props.t("TYPE_EXCEL")}
													</label>
													<Select
														options={valueReports}
														onChange={this.handleObjectPickTypeOfReportExcel.bind(
															this
														)}
														placeholder={this.props.t("SELECT")}
														value={this.state.dataValueReports}
													/>
												</div>
											)}
										</div>
										<div className="col-lg-6 form-group select-dashboard-input-dashboard">
											<div className="form-row view__report">
												<button
													className="btn btn-primary"
													onClick={() => this.handleButtonFindDataChart()}
													type="submit"
												>
													{this.props.t("SEE_STATISTIC")}
												</button>
												{/* {
                          (user_current.userType === "Factory" && user_current.userRole === "SuperAdmin") ?
                            <button
                              className="btn btn-warning"
                              data-toggle="modal"
                              data-target="#shoe-piechart"
                            >
                            {this.props.t('SEE_REPORT')}
                        </button> : ""
                        } */}
												{user_current.userType === "Agency" &&
												user_current.userRole === "SuperAdmin" ? (
													<div className="row">
														<ReactHTMLTableToExcel
															className="btn btn-success"
															table={
																objectDataExecelAgencyValue.value === 0
																	? "importHistory"
																	: objectDataExecelAgencyValue.value === 1
																	? "exportHistory"
																	: "turnBackHistory"
															}
															filename="_Danh_Sach_Don_Hang_"
															sheet="Danh sách đơn hàng"
															buttonText={this.props.t("EXCEL")}
														/>
														<ImportHistoryAgency
															historyImportExcel={this.state.historyImportExcel}
														></ImportHistoryAgency>
														<ExportHistoryAgency
															historyExportExcel={this.state.historyExportExcel}
														></ExportHistoryAgency>
														<TurnBackHistoryAgency
															historyTurnBackExcel={
																this.state.historyTurnBackExcel
															}
														></TurnBackHistoryAgency>
													</div>
												) : (
													<button
														className="btn btn-success"
														onClick={() => this.handleButtonExportExcel()}
														type="submit"
													>
														{this.props.t("EXPORT_TO_EXCEL")}
													</button>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>

							{!(
								user_current.userType === "Factory" &&
								user_current.userRole === "SuperAdmin"
							) && (
								<div
									className="chart-dashboard col-lg-12 row"
									style={{ left: "15px" }}
								>
									{user_current.userType !== "Agency" &&
									user_current.userType !== "Fixer" ? (
										<div
											className="col-xs-12 col-lg-6"
											style={{ paddingLeft: 0 }}
										>
											{this.renderBarChart()}
										</div>
									) : null}
									{user_current.userType !== "Agency" &&
									user_current.userType !== "Fixer" ? (
										<div
											className="col-lg-6 block__pie_chart "
											style={{ paddingRight: 0 }}
										>
											<div className="card card-body fix-center">
												{/* <ShowPieChart
                          checkDataChart={this.state.checkDataChart}
                          dataPieChart={this.state.dataPieChart}
                          dataBarChart={this.state.dataBarChart}
                          data={data}
                          renderCustomizedLabel={this.renderCustomizedLabel}
                          COLORS={COLORS}
                          listTopExportCylinder={this.state.listTopExportCylinder}
                        /> */}
												<ResponsiveContainer height={500} width="100%">
													<PieChart>
														<Pie
															data={
																this.state.checkDataChart.length === 0
																	? this.state.dataImexPieGetExportWareHouse
																	: data
															}
															labelLine={false}
															label={this.renderCustomizedLabel}
															outerRadius={150}
															cx="50%"
															cy={180}
															fill="#8884d8"
															dataKey="value"
														>
															{this.state.checkDataChart.length === 0
																? // hide  Sell  Genaral.Here
																  this.state.dataImexPieGetExportWareHouse.map(
																		(entry, index) => (
																			<Cell
																				key={`cell-${index}`}
																				fill={COLORS[index % COLORS.length]}
																			/>
																		)
																  )
																: data.map((entry, index) => (
																		<Cell
																			key={`cell-${index}`}
																			fill={COLORS[index % COLORS.length]}
																		/>
																  ))}
														</Pie>
														<Tooltip />
														<Legend
															layout="horizontal"
															verticalAlign="bottom"
															align="center"
														/>
													</PieChart>
												</ResponsiveContainer>

												<div
													style={{ display: "flex", justifyContent: "center" }}
												>
													<label>{this.props.t("INVENTORY_CHART")}</label>
												</div>
											</div>
										</div>
									) : (
										""
									)}
								</div>
							)}
							{user_current.userType === "Factory" &&
								user_current.userRole === "SuperAdmin" && (
									<div
										className="chart-dashboard col-lg-12 row"
										style={{ left: "15px" }}
									>
										{user_current.userType !== "Agency" &&
										user_current.userType !== "Fixer" ? (
											<div
												className="col-xs-12 col-lg-6"
												style={{ paddingLeft: 0 }}
											>
												{this.renderImexBarChart()}
											</div>
										) : null}
										{user_current.userType !== "Agency" &&
										user_current.userType !== "Fixer" ? (
											<div
												className="col-lg-6 block__pie_chart "
												style={{ paddingRight: 0 }}
											>
												<div className="card card-body fix-center">
													{/* <ShowPieChart
                          checkDataChart={this.state.checkDataChart}
                          dataPieChart={this.state.dataPieChart}
                          // dataBarChart={this.state.dataBarChart}
                          data={data}
                          renderCustomizedLabel={this.renderCustomizedLabel}
                          COLORS={COLORS}
                          // listTopExportCylinder={this.state.listTopExportCylinder}
                        /> */}
													<ResponsiveContainer height={500} width="100%">
														<PieChart>
															<Pie
																data={
																	this.state.checkDataChart.length === 0
																		? this.state.dataImexPieGetExport
																		: this.state.dataImexPieGetExport
																}
																labelLine={false}
																label={this.renderCustomizedLabelImex}
																outerRadius={150}
																cx="50%"
																cy={180}
																fill="#8884d8"
																dataKey="value"
															>
																{this.state.checkDataChart.length === 0
																	? // hide  Sell  Genaral.Here
																	  this.state.dataImexPieGetExport.map(
																			(entry, index) => (
																				<Cell
																					key={`cell-${index}`}
																					fill={COLORS[index % COLORS.length]}
																				/>
																			)
																	  )
																	: this.state.dataImexPieGetExport.map(
																			(entry, index) => (
																				<Cell
																					key={`cell-${index}`}
																					fill={COLORS[index % COLORS.length]}
																				/>
																			)
																	  )}
															</Pie>
															<Tooltip />
															<Legend
																layout="horizontal"
																verticalAlign="bottom"
																align="center"
															/>
														</PieChart>
													</ResponsiveContainer>

													<div
														style={{
															display: "flex",
															justifyContent: "center",
														}}
													>
														<label>{this.props.t("INVENTORY_CHART")}</label>
													</div>
												</div>
											</div>
										) : (
											""
										)}
									</div>
								)}
						</div>
						<div className="row">
							<div className="row">
								{/*{user_current.userType === "Factory" && (<div className="col-lg-3">*/}
								{/*    <div className="card card-body">*/}
								{/*        <h6 className="text-uppercase-h6">*/}
								{/*            <span className="text-uppercase">Tổng số Trạm Chiết</span>*/}

								{/*        </h6>*/}
								{/*        <br />*/}
								{/*        <p className="fs-28 fw-100">{resultImport.totalStation}</p>*/}
								{/*        <div className="progress">*/}
								{/*            <div className="progress-bar bg-danger" role="progressbar"*/}
								{/*                style={{ width: "35%", height: "4px" }}></div>*/}
								{/*        </div>*/}
								{/*    </div>*/}
								{/*</div>)}*/}

								{/* Dữ liệu tổng số khách hàng đúng (xem ở công ty mẹ), nhưng tạm thời ẩn */}
								{/* { user_current.userType === "Factory" &&
                  user_current.userRole !== "SuperAdmin" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_CUSTOMER')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalGeneral}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: "65%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

								{/* {user_current.userType === "Factory" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_AGENCY')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">{resultImport.totalAgency}</p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-warning"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

								{/* Tạm thời ẩn */}
								{/* {user_current.userType === "Factory" && 
                 user_current.userRole !== "SuperAdmin" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_EX_CUS')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalExportToGeneral}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

								{/* {user_current.userType === "Factory" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_EX_AGENCY')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalExportToAgency}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

								{/* Tạm thời ẩn */}
								{/* Không cho hiện ở tài khoản mẹ SOPET */}
								{/* {user_current.userType === "Factory" &&
                 user_current.userRole !== "SuperAdmin" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_CYLINDER_CRE')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalCreatedCylinder}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

								{/* Tạm thời ẩn */}
								{/* {user_current.userType === "Factory" &&
                 user_current.userRole !== "SuperAdmin" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_CYL_RETURN')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalTurnBack}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

								{/* Không cho hiện ở tài khoản mẹ SOPET */}
								{/* {user_current.userType === "Factory" && user_current.userRole === "SuperAdmin" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_SELL_PARTNER')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalExportSale}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

								{/* Tạm thời ẩn */}
								{/* {user_current.userType === "Factory" &&
                 user_current.userRole !== "SuperAdmin" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_HIRE_PARTNER')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalExportRent}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

								{/* Tạm thời ẩn */}
								{/* {user_current.userType === "Factory" &&
                 user_current.userRole !== "SuperAdmin" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_BUY_PARTNER')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalImportSale}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

								{/* Tạm thời ẩn */}
								{/* {user_current.userType === "Factory" &&
                 user_current.userRole !== "SuperAdmin" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_HIRE_FROM_PART')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalImportRent}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

								{/* Tạm thời ẩn */}
								{/* {user_current.userType === "Factory" &&
                 user_current.userRole !== "SuperAdmin" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_IMPORT')}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalImportCylinder}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

								{/* Tạm thời ẩn */}
								{/* Không cho hiện ở tài khoản mẹ SOPET */}
								{/* {!(user_current.userType === "Factory" && user_current.userRole === "SuperAdmin") && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                        {this.props.t('SUM_IN_SOPET')}
                      </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalExportSale}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

								{/* {user_current.userType === "General" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                          {this.props.t("TOTAL_RETAIL_STORES")}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">{resultImport.totalAgency}</p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-warning"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}

								{/* {user_current.userType === "General" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                          Tổng Số Bình Xuất{" "}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalExports}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}
								{/* {user_current.userType === "General" && (
                  <div className="col-md-6 col-lg-3">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                          Tổng Số Bình Đã Nhập
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {resultImport.totalImportCylinder}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}
								{/* {user_current.userType === "Agency" &&
                  user_current.userRole === "SuperAdmin" && (
                    <div className="col-md-6 col-lg-3" hidden="false">
                      <div className="card card-body">
                        <h6 className="text-uppercase-h6">
                          <span className="text-uppercase">
                            Tổng Số Bình Nhập{" "}
                          </span>
                        </h6>
                        <br />
                        <p className="fs-28 fw-100">
                          {resultImport.totalImportCylinder}
                        </p>
                        <div className="progress">
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: "100%", height: "4px" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )} */}
								{/* {user_current.userType === "Agency" && (
                  <div className="col-md-6 col-lg-3" hidden="false">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                          Tổng Số Bình Xuất Bán Cho Người Dân{" "}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">{resultImport.totalSales}</p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}
								{/* {user_current.userType === "Agency" && (
                  <div className="col-md-6 col-lg-3" hidden="false">
                    <div className="card card-body">
                      <h6 className="text-uppercase-h6">
                        <span className="text-uppercase">
                          Tổng Doanh Thu Đã Bán Cho Người Dân{" "}
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">
                        {UltiHelper.formatNumber(resultImport.reveneu)}
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "100%", height: "4px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )} */}
								{/* {user_current.userType === "Agency" &&
                  (user_current.userRole === "SuperAdmin" ||
                    user_current.userRole === "Owner") && (
                    <div className="col-md-6 col-lg-3" hidden="false">
                      <div className="card card-body">
                        <h6 className="text-uppercase-h6">
                          <span className="text-uppercase">
                            Tổng Nhân Viên{" "}
                          </span>
                        </h6>
                        <br />
                        <p className="fs-28 fw-100">
                          {resultImport.totalAgency}
                        </p>
                        <div className="progress">
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: "100%", height: "4px" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )} */}

								{/*{user_current.userType === "Agency" && (<div className="col-md-6 col-lg-4">*/}
								{/*    <div className="card card-body">*/}
								{/*        <h6 className="text-uppercase-h6">*/}
								{/*            <span className="text-uppercase">Tổng Số Bình Đã Nhập</span>*/}

								{/*        </h6>*/}
								{/*        <br/>*/}
								{/*        <p className="fs-28 fw-100">{resultImport.totalImportCylinder}</p>*/}
								{/*        <div className="progress">*/}
								{/*            <div className="progress-bar bg-success" role="progressbar"*/}
								{/*                 style={{width: "100%", height: "4px"}}></div>*/}
								{/*        </div>*/}

								{/*    </div>*/}
								{/*</div>)}*/}

								{user_current.userType === "Agency" &&
									user_current.parentRoot === "" && (
										<div className="col-md-6 col-lg-3">
											<div className="card card-body">
												<h6 className="text-uppercase-h6">
													<span className="text-uppercase">
														Tổng Số Bình Đã Tạo
													</span>
												</h6>
												<br />
												<p className="fs-28 fw-100">{this.state.data}</p>
												<div className="progress">
													<div
														className="progress-bar bg-success"
														role="progressbar"
														style={{ width: "100%", height: "4px" }}
													></div>
												</div>
											</div>
										</div>
									)}
								{/* 4et_Tổng số bình đã tạo */}
								
									<div className="col-md-6 col-lg-3">
										<div className="card card-body">
											<h6 className="text-uppercase-h6">
												<span className="text-uppercase">
													{/* Tổng số bình đã tạo{" "} */}
													{(this.state.user_current.userType==="General" && this.state.user_current.userRole==="SuperAdmin") || (this.state.user_current.userType==="Agency" && this.state.user_current.userRole==="SuperAdmin")?"Tổng Số Bình đã nhập" : this.props.t("SUM_CYLINDER_CRE")}
												</span>
											</h6>
											<br />
											<p className="fs-28 fw-100">
												{this.state.dataImexGetStatisticsTotal}
											</p>
											<div className="progress">
												<div
													className="progress-bar bg-success"
													role="progressbar"
													style={{ width: "100%", height: "4px" }}
												></div>
											</div>
										</div>
									</div>
								
								{/* 4et_Loại bình 12KG */}
								
									<div className="col-md-6 col-lg-3">
										<div className="card card-body">
											<h6 className="text-uppercase-h6">
												<span className="text-uppercase">
													{/* Loại bình 12KG  */}
													{this.props.t("VASE_TYPE12")}
												</span>
											</h6>
											<br />
											<p className="fs-28 fw-100">
												{this.state.dataImexGetStatisticsTotal_12kg}
											</p>
											<div className="progress">
												<div
													className="progress-bar bg-success"
													role="progressbar"
													style={{ width: "100%", height: "4px" }}
												></div>
											</div>
										</div>
									</div>
								
								{/* 4et_Loại bình 45KG */}
								
									<div className="col-md-6 col-lg-3">
										<div className="card card-body">
											<h6 className="text-uppercase-h6">
												<span className="text-uppercase">
													{/* Loại bình 45KG  */}
													{this.props.t("VASE_TYPE45")}
												</span>
											</h6>
											<br />
											<p className="fs-28 fw-100">
												{this.state.dataImexGetStatisticsTotal_45Kg}
											</p>
											<div className="progress">
												<div
													className="progress-bar bg-success"
													role="progressbar"
													style={{ width: "100%", height: "4px" }}
												></div>
											</div>
										</div>
									</div>
								
								{/* 4et_Loại bình 50KG */}
								
									<div className="col-md-6 col-lg-3">
										<div className="card card-body">
											<h6 className="text-uppercase-h6">
												<span className="text-uppercase">
													{/* Loại bình 50KG  */}
													{this.props.t("VASE_TYPE50")}
												</span>
											</h6>
											<br />
											<p className="fs-28 fw-100">
												{this.state.dataImexGetStatisticsTotal_50Kg}
											</p>
											<div className="progress">
												<div
													className="progress-bar bg-success"
													role="progressbar"
													style={{ width: "100%", height: "4px" }}
												></div>
											</div>
										</div>
									</div>
								
								{/* 4et_Tổng số bình đã xuất */}
								{!(this.state.user_current.userType==="Agency" && this.state.user_current.userRole==="SuperAdmin")&&
								(
									<div className="col-md-6 col-lg-3">
									<div className="card card-body">
										<h6 className="text-uppercase-h6">
											<span className="text-uppercase">
												{/* Tổng số bình đã xuất{""}  */}
												{this.state.user_current.userType==="General" && this.state.user_current.userRole==="SuperAdmin"?"Tổng Số Bình xuất CHBL":this.props.t("TOTAL_CYLINDERS_EXPORTED")}
											</span>
										</h6>
										<br />
										<p className="fs-28 fw-100">
											{this.state.dataImexGetStatisticsOutCylinder_Total}
										</p>
										<div className="progress">
											<div
												className="progress-bar bg-success"
												role="progressbar"
												style={{ width: "100%", height: "4px" }}
											></div>
										</div>
									</div>
								</div>
								)}
								{/* 4et_Loại bình 12KG */}
								{!(this.state.user_current.userType==="Agency" && this.state.user_current.userRole==="SuperAdmin")&&
								(
									<div className="col-md-6 col-lg-3">
									<div className="card card-body">
										<h6 className="text-uppercase-h6">
											<span className="text-uppercase">
												{/* Loại bình 12KG  */}
												{this.props.t("VASE_TYPE12")}
											</span>
										</h6>
										<br />
										<p className="fs-28 fw-100">
											{this.state.dataImexGetStatisticsOutCylinder_Total_12kg}
										</p>
										<div className="progress">
											<div
												className="progress-bar bg-success"
												role="progressbar"
												style={{ width: "100%", height: "4px" }}
											></div>
										</div>
									</div>
								</div>
								)}
								
								{/* 4et_Loại bình 45KG */}
								{!(this.state.user_current.userType==="Agency" && this.state.user_current.userRole==="SuperAdmin")&& 
								(
								<div className="col-md-6 col-lg-3">
									<div className="card card-body">
										<h6 className="text-uppercase-h6">
											<span className="text-uppercase">
												{/* Loại bình 45KG  */}
												{this.props.t("VASE_TYPE45")}
											</span>
										</h6>
										<br />
										<p className="fs-28 fw-100">
											{this.state.dataImexGetStatisticsOutCylinder_Total_45kg}
										</p>
										<div className="progress">
											<div
												className="progress-bar bg-success"
												role="progressbar"
												style={{ width: "100%", height: "4px" }}
											></div>
										</div>
									</div>
								</div>
								)}
								{/* 4et_Loại bình 50KG */}
								{!(this.state.user_current.userType==="Agency" && this.state.user_current.userRole==="SuperAdmin")&&
								(
									<div className="col-md-6 col-lg-3">
									<div className="card card-body">
										<h6 className="text-uppercase-h6">
											<span className="text-uppercase">
												{/* Loại bình 50KG  */}
												{this.props.t("VASE_TYPE50")}
											</span>
										</h6>
										<br />
										<p className="fs-28 fw-100">
											{this.state.dataImexGetStatisticsOutCylinder_Total_50kg}
										</p>
										<div className="progress">
											<div
												className="progress-bar bg-success"
												role="progressbar"
												style={{ width: "100%", height: "4px" }}
											></div>
										</div>
									</div>
								</div>
								)}
								{((user_current.userType === "Agency" && user_current.userRole === "SuperAdmin") 
								||(user_current.userType === "General" && user_current.userRole === "SuperAdmin"))&&
								(
									<div className="col-md-6 col-lg-3">
									<div className="card card-body">
										<h6 className="text-uppercase-h6">
											<span className="text-uppercase">
												{/* Loại bình 50KG  */}
												TỔNG SỐ BÌNH ĐÃ BÁN Lẻ
											</span>
										</h6>
										<br />
										<p className="fs-28 fw-100">
											{this.state.dataImexGetStatisticsSaleCylinder_Total}
										</p>
										<div className="progress">
											<div
												className="progress-bar bg-success"
												role="progressbar"
												style={{ width: "100%", height: "4px" }}
											></div>
										</div>
									</div>
								</div>
								)}
								{((user_current.userType === "Agency" && user_current.userRole === "SuperAdmin") 
								||(user_current.userType === "General" && user_current.userRole === "SuperAdmin"))&&
								(
									<div className="col-md-6 col-lg-3">
									<div className="card card-body">
										<h6 className="text-uppercase-h6">
											<span className="text-uppercase">
												{/* Loại bình 50KG  */}
												{this.props.t("VASE_TYPE12")}
											</span>
										</h6>
										<br />
										<p className="fs-28 fw-100">
											{this.state.dataImexGetStatisticsSaleCylinder_Total_12kg}
										</p>
										<div className="progress">
											<div
												className="progress-bar bg-success"
												role="progressbar"
												style={{ width: "100%", height: "4px" }}
											></div>
										</div>
									</div>
								</div>
								)}
								{((user_current.userType === "Agency" && user_current.userRole === "SuperAdmin") 
								||(user_current.userType === "General" && user_current.userRole === "SuperAdmin"))&&
								(
									<div className="col-md-6 col-lg-3">
									<div className="card card-body">
										<h6 className="text-uppercase-h6">
											<span className="text-uppercase">
												{/* Loại bình 50KG  */}
												{this.props.t("VASE_TYPE45")}
											</span>
										</h6>
										<br />
										<p className="fs-28 fw-100">
											{this.state.dataImexGetStatisticsSaleCylinder_Total_45kg}
										</p>
										<div className="progress">
											<div
												className="progress-bar bg-success"
												role="progressbar"
												style={{ width: "100%", height: "4px" }}
											></div>
										</div>
									</div>
								</div>
								)}
								{((user_current.userType === "Agency" && user_current.userRole === "SuperAdmin") 
								||(user_current.userType === "General" && user_current.userRole === "SuperAdmin"))&&
								(
									<div className="col-md-6 col-lg-3">
									<div className="card card-body">
										<h6 className="text-uppercase-h6">
											<span className="text-uppercase">
												{/* Loại bình 50KG  */}
												{this.props.t("VASE_TYPE50")}
											</span>
										</h6>
										<br />
										<p className="fs-28 fw-100">
											{this.state.dataImexGetStatisticsSaleCylinder_Total_50kg}
										</p>
										<div className="progress">
											<div
												className="progress-bar bg-success"
												role="progressbar"
												style={{ width: "100%", height: "4px" }}
											></div>
										</div>
									</div>
								</div>
								)}
								
								{/* 4et_Tổng số bình hồi lưu */}
								{!((this.state.user_current.userType==="Agency" && this.state.user_current.userRole==="SuperAdmin")||(this.state.user_current.userType==="General" && this.state.user_current.userRole==="SuperAdmin")) &&
								(
								<div className="col-md-6 col-lg-3">
									<div className="card card-body">
										<h6 className="text-uppercase-h6">
											<span className="text-uppercase">
												{/* Tổng số bình hồi lưu{" "} */}
												{this.props.t("SUM_CYL_RETURN")}
											</span>
										</h6>
										<br />
										<p className="fs-28 fw-100">
											{this.state.dataImexGetStatisticsTurnbackCylinder_Total}
										</p>
										<div className="progress">
											<div
												className="progress-bar bg-success"
												role="progressbar"
												style={{ width: "100%", height: "4px" }}
											></div>
										</div>
									</div>
								</div>
								)}
								{/* 4et_Loại bình 12KG */}
								{!((this.state.user_current.userType==="Agency" && this.state.user_current.userRole==="SuperAdmin")||(this.state.user_current.userType==="General" && this.state.user_current.userRole==="SuperAdmin")) && 
								(
									<div className="col-md-6 col-lg-3">
									<div className="card card-body">
										<h6 className="text-uppercase-h6">
											<span className="text-uppercase">
												{/* Loại bình 12KG  */}
												{this.props.t("VASE_TYPE12")}
											</span>
										</h6>
										<br />
										<p className="fs-28 fw-100">
											{
												this.state
													.dataImexGetStatisticsTurnbackCylinder_Total_12kg
											}
										</p>
										<div className="progress">
											<div
												className="progress-bar bg-success"
												role="progressbar"
												style={{ width: "100%", height: "4px" }}
											></div>
										</div>
									</div>
								</div>
								)}
								{/* 4et_Loại bình 45KG */}
								{!((this.state.user_current.userType==="Agency" && this.state.user_current.userRole==="SuperAdmin")||(this.state.user_current.userType==="General" && this.state.user_current.userRole==="SuperAdmin")) &&
								(
									<div className="col-md-6 col-lg-3">
									<div className="card card-body">
										<h6 className="text-uppercase-h6">
											<span className="text-uppercase">
												{/* Loại bình 45KG  */}
												{this.props.t("VASE_TYPE45")}
											</span>
										</h6>
										<br />
										<p className="fs-28 fw-100">
											{
												this.state
													.dataImexGetStatisticsTurnbackCylinder_Total_45kg
											}
										</p>
										<div className="progress">
											<div
												className="progress-bar bg-success"
												role="progressbar"
												style={{ width: "100%", height: "4px" }}
											></div>
										</div>
									</div>
								</div>
								)}
								{/* 4et_Loại bình 50KG */}
								{!((this.state.user_current.userType==="Agency" && this.state.user_current.userRole==="SuperAdmin")||(this.state.user_current.userType==="General" && this.state.user_current.userRole==="SuperAdmin")) &&
								(
								<div className="col-md-6 col-lg-3">
									<div className="card card-body">
										<h6 className="text-uppercase-h6">
											<span className="text-uppercase">
												{/* Loại bình 50KG  */}
												{this.props.t("VASE_TYPE50")}
											</span>
										</h6>
										<br />
										<p className="fs-28 fw-100">
											{
												this.state
													.dataImexGetStatisticsTurnbackCylinder_Total_50kg
											}
										</p>
										<div className="progress">
											<div
												className="progress-bar bg-success"
												role="progressbar"
												style={{ width: "100%", height: "4px" }}
											></div>
										</div>
									</div>
								</div>
								)}
								{/* 4et_Tổng số vỏ đã nhập */}
								{(user_current.userType === "Factory" &&
									user_current.userRole === "SuperAdmin") ||
								(user_current.userType === "Factory" &&
									user_current.userRole === "Owner") ? (
									<div className="col-md-6 col-lg-3">
										<div className="card card-body">
											<h6 className="text-uppercase-h6">
												<span className="text-uppercase">
													{/* Tổng số vỏ đã nhập{" "} */}
													{this.props.t("TOTAL_SHELLS_IMPORTED")}
												</span>
											</h6>
											<br />
											<p className="fs-28 fw-100">
												{
													this.state
														.dataImexGetStatisticsImportCellCylinder_Total
												}
											</p>
											<div className="progress">
												<div
													className="progress-bar bg-success"
													role="progressbar"
													style={{ width: "100%", height: "4px" }}
												></div>
											</div>
										</div>
									</div>
								) : (
									""
								)}

								{/* 4et_Loại bình 12KG */}
								{(user_current.userType === "Factory" &&
									user_current.userRole === "SuperAdmin") ||
								(user_current.userType === "Factory" &&
									user_current.userRole === "Owner") ? (
									<div className="col-md-6 col-lg-3">
										<div className="card card-body">
											<h6 className="text-uppercase-h6">
												<span className="text-uppercase">
													{/* Loại bình 12KG  */}
													{this.props.t("VASE_TYPE12")}
												</span>
											</h6>
											<br />
											<p className="fs-28 fw-100">
												{
													this.state
														.dataImexGetStatisticsImportCellCylinder_Total_12kg
												}
											</p>
											<div className="progress">
												<div
													className="progress-bar bg-success"
													role="progressbar"
													style={{ width: "100%", height: "4px" }}
												></div>
											</div>
										</div>
									</div>
								) : (
									""
								)}

								{/* 4et_Loại bình 45KG */}
								{(user_current.userType === "Factory" &&
									user_current.userRole === "SuperAdmin") ||
								(user_current.userType === "Factory" &&
									user_current.userRole === "Owner") ? (
									<div className="col-md-6 col-lg-3">
										<div className="card card-body">
											<h6 className="text-uppercase-h6">
												<span className="text-uppercase">
													{/* Loại bình 45KG  */}
													{this.props.t("VASE_TYPE45")}
												</span>
											</h6>
											<br />
											<p className="fs-28 fw-100">
												{
													this.state
														.dataImexGetStatisticsImportCellCylinder_Total_45kg
												}
											</p>
											<div className="progress">
												<div
													className="progress-bar bg-success"
													role="progressbar"
													style={{ width: "100%", height: "4px" }}
												></div>
											</div>
										</div>
									</div>
								) : (
									""
								)}

								{/* 4et_Loại bình 50KG */}
								{(user_current.userType === "Factory" &&
									user_current.userRole === "SuperAdmin") ||
								(user_current.userType === "Factory" &&
									user_current.userRole === "Owner") ? (
									<div className="col-md-6 col-lg-3">
										<div className="card card-body">
											<h6 className="text-uppercase-h6">
												<span className="text-uppercase">
													{/* Loại bình 50KG  */}
													{this.props.t("VASE_TYPE50")}
												</span>
											</h6>
											<br />
											<p className="fs-28 fw-100">
												{
													this.state
														.dataImexGetStatisticsImportCellCylinder_Total_50kg
												}
											</p>
											<div className="progress">
												<div
													className="progress-bar bg-success"
													role="progressbar"
													style={{ width: "100%", height: "4px" }}
												></div>
											</div>
										</div>
									</div>
								) : (
									""
								)}

								{/* 4et_Tổng số bình tồn kho */}
								<div className="col-md-6 col-lg-3">
									<div className="card card-body">
										<h6 className="text-uppercase-h6">
											<span className="text-uppercase">
												{/* Tổng số bình tồn kho{" "} */}
												{this.props.t("TOTAL_CYLINDERS_INVENTORY")}
											</span>
										</h6>
										<br />
										<p className="fs-28 fw-100">
											{this.state.dataImexGetStatisticsInventoryCylinder_Total}
										</p>
										<div className="progress">
											<div
												className="progress-bar bg-success"
												role="progressbar"
												style={{ width: "100%", height: "4px" }}
											></div>
										</div>
									</div>
								</div>

								{/* 4et_Loại bình 12KG */}
								<div className="col-md-6 col-lg-3">
									<div className="card card-body">
										<h6 className="text-uppercase-h6">
											<span className="text-uppercase">
												{/* Loại bình 12KG  */}
												{this.props.t("VASE_TYPE12")}
											</span>
										</h6>
										<br />
										<p className="fs-28 fw-100">
											{
												this.state
													.dataImexGetStatisticsInventoryCylinder_Total_12kg
											}
										</p>
										<div className="progress">
											<div
												className="progress-bar bg-success"
												role="progressbar"
												style={{ width: "100%", height: "4px" }}
											></div>
										</div>
									</div>
								</div>
								{/* 4et_Loại bình 45KG */}
								<div className="col-md-6 col-lg-3">
									<div className="card card-body">
										<h6 className="text-uppercase-h6">
											<span className="text-uppercase">
												{/* Loại bình 45KG  */}
												{this.props.t("VASE_TYPE45")}
											</span>
										</h6>
										<br />
										<p className="fs-28 fw-100">
											{
												this.state
													.dataImexGetStatisticsInventoryCylinder_Total_45kg
											}
										</p>
										<div className="progress">
											<div
												className="progress-bar bg-success"
												role="progressbar"
												style={{ width: "100%", height: "4px" }}
											></div>
										</div>
									</div>
								</div>
								{/* 4et_Loại bình 50KG */}
								<div className="col-md-6 col-lg-3">
									<div className="card card-body">
										<h6 className="text-uppercase-h6">
											<span className="text-uppercase">
												{/* Loại bình 50KG  */}
												{this.props.t("VASE_TYPE50")}
											</span>
										</h6>
										<br />
										<p className="fs-28 fw-100">
											{
												this.state
													.dataImexGetStatisticsInventoryCylinder_Total_50kg
											}
										</p>
										<div className="progress">
											<div
												className="progress-bar bg-success"
												role="progressbar"
												style={{ width: "100%", height: "4px" }}
											></div>
										</div>
									</div>
								</div>

								<div className="col-lg-12">
									<div className="row">
										{/*Lịch sử nhập hàng trong các tài khoản khác cửa hàng bán lẻ*/}
										{/*Và ẩn ở tài khoản mẹ SOPET*/}
										{user_current.userType !== "Agency" &&
											!(
												user_current.userType === "Factory" &&
												user_current.userRole === "SuperAdmin"
											) && (
												<div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
													<div className="card">
														<div className="card-header">
															<h5 className="card-title">
																<strong> {this.props.t("HISTORY")} </strong>{" "}
																{this.props.t("IMPORT")}
															</h5>
														</div>

														<table className="table table-striped table-hover">
															<thead>
																<tr>
																	{/* Nhập từ bị lỗi API không lấy được nơi xuất */}
																	<th className="">{this.props.t("FROM")}</th>
																	<th className="">
																		{this.props.t("DATE_TIME")}
																	</th>
																	<th className="">{this.props.t("TYPE")}</th>
																	<th className="">
																		{this.props.t("NUM_CYLINDER")}
																	</th>
																	<th className="">
																		{this.props.t("EXPORT_TO_EXCEL")}
																	</th>
																</tr>
															</thead>
															<tbody>
																{historyImport.map((item) => {
																	return (
																		<tr>
																			{(item.from!==null ||item.from!=="undefined")&& 
																			(
																				<td className="text-muted">
																				{typeof item.from !== "undefined" &&
																				item.from !== null &&
																				item.from.userType === "Agency"
																					? item.from.name +
																					  "_" +
																					  item.from.isChildOf.name
																					: (typeof item.from !== "undefined" &&
																							item.from !== null &&
																							item.from.userType ===
																								"General") ||
																					  (typeof item.from !== "undefined" &&
																							item.from !== null &&
																							item.from.userType ===
																								"Factory" &&
																							item.from.userRole === "Owner") ||
																					  (typeof item.from !== "undefined" &&
																							item.from !== null &&
																							item.from.userType === "Fixer" &&
																							item.from.userRole ===
																								"SuperAdmin")
																					? item.from.name
																					: this.props.t("CITIZEN")}
																				{/* {typeof item.from !== "undefined" &&
																				item.from !== null
																					? item.from.name
																					: this.props.t("CITIZEN")} */}
																			</td>
																			)}
																			
																			<td className="text-muted">
																				{moment(item.createdAt).format(
																					"DD/MM/YYYY HH:mm"
																				)}
																			</td>
																			<td className="text-muted">
																				{item.type === "IMPORT"
																					? "Nhập Hàng"
																					: item.type === "TURN_BACK"
																					? this.props.t("ENTER_RETURN")
																					: ""}
																			</td>
																			<td className="text-success">
																				{item.numberOfCylinder}{" "}
																				{this.props.t("CYLINDER")}
																			</td>
																			<td className="text-muted">
																				<a
																					className="btn btn-primary"
																					style={{ color: "white" }}
																					download
																					onClick={async () => {
																						await getCylinderByHistoryId(
																							item.id,
																							"Nhap_Hang_" + item.id
																						);
																					}}
																					type="submit"
																				>
																					{this.props.t("DOWNLOAD")}
																				</a>
																			</td>
																		</tr>
																	);
																})}
															</tbody>
														</table>
														<a href={urlDetailHistoryImport}>
															{this.props.t("SEE_MORE")}
														</a>
													</div>
												</div>
											)}
										{/*Lịch sử xuât hàng trong các tài khoản khác cửa hàng bán lẻ*/}
										{/*Và ẩn ở tài khoản mẹ SOPET*/}
										{user_current.userType !== "Agency" &&
											!(
												user_current.userType === "Factory" &&
												user_current.userRole === "SuperAdmin"
											) && (
												<div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
													<div className="card">
														<div className="card-header">
															<h5 className="card-title">
																<strong>{this.props.t("HISTORY")}</strong>{" "}
																{this.props.t("EXPORT")}
															</h5>
														</div>

														<table className="table table-striped table-hover">
															<thead>
																<tr>
																	<th className="">
																		{this.props.t("DATE_TIME")}
																	</th>
																	<th className="">{this.props.t("TYPE")}</th>
																	<th className="">
																		{this.props.t("NUM_CYLINDER")}
																	</th>
																	<th className="">
																		{this.props.t("EXPORT_TO_EXCEL")}
																	</th>
																</tr>
															</thead>
															<tbody>
																{historyExportBegin.map((item) => {
																	//console.log("itemNha",item);
																	let to_dest = "";
																	if (
																		typeof item.to !== "undefined" &&
																		item.to !== null
																	) {
																		to_dest = item.to.name;
																	} else {
																		if (
																			typeof item.toArray !== "undefined" &&
																			item.toArray !== null &&
																			item.toArray.length > 0
																		) {
																			for (
																				let i = 0;
																				i < item.toArray.length;
																				i++
																			) {
																				to_dest +=
																					item.toArray[i].length > 0
																						? item.toArray[i].name +
																						  " " +
																						  item.numberArray[i] +
																						  " bình." +
																						  `\n`
																						: "";
																				// console.log("hahahah", to_dest);
																			}
																		} else {
																			if (
																				typeof item.customer !== "undefined" &&
																				item.customer !== null
																			) {
																				to_dest =
																					"Người Dân : " + item.customer.name;
																			}
																		}
																	}

																	return (
																		<tr>
																			{/*<td className="text-muted">{to_dest}</td>*/}
																			<td className="text-muted">
																				{moment(item.createdAt).format(
																					"DD/MM/YYYY HH:mm"
																				)}
																			</td>
																			<td className="text-muted">
																				{item.type === "EXPORT" && item.typeForPartner=== ""
																					? this.props.t("EXPORT")
																					:item.type === "EXPORT" && item.typeForPartner==="TO_FIX"?"Xuất vỏ"
																					:item.type === "EXPORT" && item.typeForPartner==="RENT"?"Xuất vỏ"
																					: item.type === "SALE"
																					? "Bán Hàng"
																					: ""}
																			</td>
																			<td className="text-success">
																				{item.numberOfCylinder}{" "}
																				{this.props.t("CYLINDER")}
																			</td>
																			<td className="text-muted">
																				<a
																					style={{ color: "white" }}
																					className="btn btn-create"
																					download
																					onClick={async () => {
																						await getCylinderByHistoryId(
																							item.id,
																							"Xuat_Hang_" + item.id
																						);
																					}}
																					type="submit"
																				>
																					{this.props.t("DOWNLOAD")}
																				</a>
																			</td>
																		</tr>
																	);
																})}
															</tbody>
														</table>
														<a href={urlSeeDetailDataSaler+"=export"}>
														{this.props.t("SEE_MORE")}
														</a>
													</div>
												</div>
											)}
									</div>
								</div>

								{user_current.userType === "Agency" && (
									<div className="col-lg-12">
										<div className="card">
											<div className="card-header">
												<h5 className="card-title">
													<strong> {this.props.t("HISTORY")} </strong>{" "}
													{this.props.t("IMPORT")}
												</h5>
											</div>

											<table
												id="nH"
												className="table table-striped table-hover"
											>
												<thead>
													{/*Lịch sử nhập hàng trong cửa hàng bán lẻ*/}
													<tr>
														<th className="">Nhập Từ</th>
														<th className="">Ngày Giờ</th>
														{/* <th className="">Loại</th> */}
														<th className="">Số Lượng Bình</th>
														<th className="">Xuất Excel</th>
													</tr>
												</thead>
												<tbody>
													{historyImport.map((item) => {
														let length_cylinder = 0;
														// for (let i = 0; i < item.cylinders.length; i++) {
														// 	length_cylinder++;
														// }

														return (
															<tr>
																<td className="text-muted">
																	{typeof item.from !== "undefined" &&
																	item.from !== null
																		? item.from.name
																		: this.props.t("CITIZEN")}
																</td>
																<td className="text-muted">
																	{moment(item.createdAt).format(
																		"DD/MM/YYYY HH:mm"
																	)}
																</td>
																{/* <td className="text-muted">
																	{item.type === "IMPORT"
                                      ? "Nhập Hàng"
                                      : item.type === "TURN_BACK"
                                      ? this.props.t("ENTER_RETURN")
                                      : ""}
																	{length_cylinder > 0
																		? item.cylinders[0].cylinderType
																		: ""}
																</td> */}
																<td className="text-success">
																	{item.numberOfCylinder}{" "}
																	{this.props.t("CYLINDER")}
																</td>
																<td className="text-muted">
																	<a
																		className="btn btn-primary"
																		style={{ color: "white" }}
																		download
																		onClick={async () => {
																			await getCylinderByHistoryId(
																				item.id,
																				"Nhap_Hang_" + item.id
																			);
																		}}
																		type="submit"
																	>
																		{this.props.t("DOWNLOAD")}
																	</a>
																</td>
															</tr>
														);
													})}
												</tbody>
											</table>
										</div>
									</div>
								)}
								{(user_current.userType === "Agency" ||(user_current.userType==="General" && user_current.customerType==="Distribution_Agency")) && (
									<div className="col-lg-12">
										<div className="card">
											<div className="card-header">
												<h5 className="card-title">Lịch Sử Bán Hàng</h5>
											</div>
											<Table
												dataSource={historySaler}
												columns={columns}
												pagination={defaultPageSize}
											>

											</Table>
											
											<a href={urlSeeDetailDataSaler+"=sale"}>
												{this.props.t("SEE_MORE")}
											</a>
										</div>
									</div>
								)}
								{!(
									(user_current.userType === "Factory" &&
										(user_current.userRole === "SuperAdmin" ||
											user_current.userRole === "Owner")) ||
									(user_current.userRole === "SuperAdmin" &&
										user_current.userType === "Agency")
								) && (
									<div className="col-lg-12">
										<div className="card">
											<div className="card-header">
												<h5 className="card-title">
													<strong>{this.props.t("INFO")}</strong>{" "}
													{this.props.t("IN_WARE")}
												</h5>
											</div>
											<table className="table table-striped table-hover">
												<thead>
													<tr>
														<th className="">
															{" "}
															{this.props.t("IS_INVENTORY")}{" "}
														</th>
														<th className="">{this.props.t("SELL_GENERAL")}</th>
														{/* {this.state.userTypeCheck !== "Agency" && <th className="">{this.props.t('IN_OTHER')}</th>} */}
														{this.state.userTypeCheck !== "Agency" && (
															<th className="">
																{this.props.t("IN_CHILD_COMPANY")}
															</th>
														)}
														{this.state.userTypeCheck !== "Agency" && (
															<th className="">{this.props.t("IN_TRADER")}</th>
														)}
														{/* {this.state.userTypeCheck !== "Agency" && <th className="">{this.props.t('IN_AGENCY')}</th>} */}
														{/* {this.state.userTypeCheck !== "Agency" && <th className="">{this.props.t('IN_PARTNER')}</th>} */}
														{this.state.userTypeCheck !== "Agency" && (
															<th className="">{this.props.t("IN_FIXER")}</th>
														)}
													</tr>
												</thead>
												<tbody>
													<tr>
														<td className="text-muted">
															{/* {this.state.dataTableChart.inventoryAtMySelf} */}
															{
																this.state
																	.dataImexGetStatisticsInventoryCylinder_Total
															}
														</td>
														<td className="text-muted">
															{
																this.state
																	.dataImexGetStatisticsOutCylinder_Total
															}
															{/* {this.state.dataTableChart.atResident} */}
														</td>
														{/* {this.state.userTypeCheck !== "Agency" &&
                            <td className="text-muted">
                              {this.state.dataTableChart.else}
                            </td>} */}
														{this.state.userTypeCheck !== "Agency" && (
															<td className="text-muted">
																{this.state.dataTableChart.atFactoryChilds}
															</td>
														)}

														{this.state.userTypeCheck !== "Agency" && (
															<td className="text-success">
																{this.state.dataTableChart.atGeneralChilds}
															</td>
														)}
														{/* {this.state.userTypeCheck !== "Agency" &&
                            <td className="text-success">
                              {this.state.dataTableChart.atAgencyChilds}
                            </td>} */}
														{/* {this.state.userTypeCheck !== "Agency" && <td className="text-success">
                            {this.state.dataTableChart.atPartners}
                          </td>} */}
														{this.state.userTypeCheck !== "Agency" && (
															<td className="text-success">
																{this.state.dataTableChart.atFixer}
															</td>
														)}
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								)}
							</div>
							{!(
								user_current.userType === "Factory" &&
								(user_current.userRole === "SuperAdmin" ||
									user_current.userRole === "Owner")
							) && (
								<div className="report__footer_block">
									{user_current.userType === "Factory" && (
										<div className="col-lg-3" style={{ paddingLeft: 0 }}>
											<div
												className="card card-body"
												data-toggle="modal"
												data-target="#table-data-info"
												onClick={() => {
													this.callDataTurnBackInfo(
														this.state.infoReportTurnback
															.listCylindersFromCustomer
													);
													this.setState({
														namePopup: this.props.t("RETURN_CUSTOMER"),
													});
												}}
											>
												<h6 className="text-uppercase-h6">
													<span className="text-uppercase">
														{this.props.t("RETURN_CUSTOMER")}
													</span>
												</h6>
												<br />
												<p className="fs-28 fw-100">
													{!!this.state.infoReportTurnback
														.listCylindersFromCustomer
														? this.state.infoReportTurnback
																.listCylindersFromCustomer.length
														: 0}
												</p>
												<div className="progress">
													<div
														className="progress-bar bg-danger"
														role="progressbar"
														style={{ width: "35%", height: "4px" }}
													></div>
												</div>
											</div>
										</div>
									)}
									{user_current.userType === "Factory" && (
										<div className="col-lg-3">
											<div
												className="card card-body"
												style={{ height: 185 }}
												data-toggle="modal"
												data-target="#table-data-info"
												onClick={() => {
													this.callDataTurnBackInfo(
														this.state.infoReportTurnback.listCylindersFromFixer
													);
													this.setState({
														namePopup: this.props.t("RETURN_FIXER"),
													});
												}}
											>
												<h6 className="text-uppercase-h6">
													<span className="text-uppercase">
														{this.props.t("RETURN_FIXER")}
													</span>
												</h6>
												<br />
												<p className="fs-28 fw-100">
													{!!this.state.infoReportTurnback
														.listCylindersFromFixer
														? this.state.infoReportTurnback
																.listCylindersFromFixer.length
														: 0}
												</p>
												<div className="progress">
													<div
														className="progress-bar bg-danger"
														role="progressbar"
														style={{ width: "35%", height: "4px" }}
													></div>
												</div>
											</div>
										</div>
									)}
									{user_current.userType === "Factory" && (
										<div className="col-lg-3">
											<div
												className="card card-body"
												style={{ height: 185 }}
												data-toggle="modal"
												data-target="#table-data-info"
												onClick={() => {
													this.callDataTurnBackInfo(
														this.state.infoReportTurnback.listCylindersFromRent
													);
													this.setState({
														namePopup: this.props.t("RETURN_HIRE"),
													});
												}}
											>
												<h6 className="text-uppercase-h6">
													<span className="text-uppercase">
														{this.props.t("RETURN_HIRE")}
													</span>
												</h6>
												<br />
												<p className="fs-28 fw-100">
													{!!this.state.infoReportTurnback.listCylindersFromRent
														? this.state.infoReportTurnback
																.listCylindersFromRent.length
														: 0}
												</p>
												<div className="progress">
													<div
														className="progress-bar bg-danger"
														role="progressbar"
														style={{ width: "35%", height: "4px" }}
													></div>
												</div>
											</div>
										</div>
									)}
									{user_current.userType === "Factory" && (
										<div className="col-lg-3" style={{ paddingRight: 0 }}>
											<div
												className="card card-body"
												style={{ height: 185 }}
												data-toggle="modal"
												data-target="#table-data-info"
												onClick={() => {
													this.callDataTurnBackInfo(
														this.state.infoReportTurnback.listCylindersFromSale
													);
													this.setState({
														namePopup: this.props.t("RETURN_SELL"),
													});
												}}
											>
												<h6 className="text-uppercase-h6">
													<span className="text-uppercase">
														{this.props.t("RETURN_SELL")}
													</span>
												</h6>
												<br />
												<p className="fs-28 fw-100">
													{!!this.state.infoReportTurnback.listCylindersFromSale
														? this.state.infoReportTurnback
																.listCylindersFromSale.length
														: 0}
												</p>
												<div className="progress">
													<div
														className="progress-bar bg-danger"
														role="progressbar"
														style={{ width: "35%", height: "4px" }}
													></div>
												</div>
											</div>
										</div>
									)}
								</div>
							)}
						</div>
						<TableDataInfo
							dataProducts={this.state.dataTurnBacks}
							name={this.state.namePopup}
						/>
							{this.state.visibleNumberOfCylinder===true && 
							(
								<NumberOfCylinder
								visibleNumberOfCylinder={this.state.visibleNumberOfCylinder}
								onClickNumberOfCylinder={(status) =>
									this.onClickNumberOfCylinder(status)
								}
								indexCylinders={this.state.indexCylinders}
							/>
							)
							}
					</div>
				</main>
				<PopupLogOut />
			</div>
			}
			</React.Fragment>
		);
	}
}

export default withNamespaces()(connect()(DashBoard));
