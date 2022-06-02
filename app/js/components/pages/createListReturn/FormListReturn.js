import React, { Component } from "react";
import {
	Button,
	Table,
	Tooltip,
	Row,
	Col,
	Form,
	Switch,
	DatePicker,
	Input,
	Icon,
} from "antd";
import Highlighter from "react-highlight-words";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import getUserCookies from "getUserCookies";
import getDestinationUserAPI from "getDestinationUserAPI";
import Constants from "Constants";
import { withNamespaces } from "react-i18next";
import ReactToPrint from "react-to-print";
import ImportPrinterTurnback from "./importPrinterTurnback";
import ImportAllPrinterTurnback from "./importAllPrinterTurnback";
import getDataAction from "../../../../api/getDataAction";
import getTurnbacktDataPrint from "../../../../api/getTurnbacktDataPrint";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import getTurnbacktDataPrintByDate from "../../../../api/getTurnbacktDataPrintByDate"
import getListWarehouse from "../../../../api/getListWarehouse"
import showToast from "showToast";
const { RangePicker } = DatePicker;
class formListReturn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			size: "default",
			exportDataPrint: [],
			dataGetAction: [],
			listBrand: [],
			customerId: "",
			TurnBackDataPrint: [],
			editingKey: "",
			text: "AAA",
			ListTurnBackBeginNowDay: [],
			ListTurnBackBeginOldDay: [],
			listAllDriveShipBeginOldDayBegin: [],
			enableFilter: false,
			statusTime: false,
			startDate: "",
			endDate: "",
			titlePrint: "",
			searchText: "",
			searchedColumn: "",
			turnbackAllDataPrint: [],
			check: true,
			id: ""
		};
	}
	async componentDidMount() {
		let st = [];
		var user_cookies = await getUserCookies();
		let listIdWareHouse = await this.getListFixer();
		let result = await getListWarehouse(user_cookies.user.id)
		if (result.data.success === true) {
			for (let i = 0; i < result.data.data.length; i++) {
				st.push(result.data.data[i].id)

			}
		}
		this.setState({
			id: st.toString()
		})
		console.log("listIdWareHouse", listIdWareHouse);

		// await this.getDataPrint();
	}
	async getListFixer() {
		var user_cookies = await getUserCookies();
		let actionType = "TURN_BACK";
		let endDate = "";
		let startDate = "";
		let page = 1;
		let limit = 10;
		let ListTurnBack = [];
		const dataUsers = await getDestinationUserAPI(
			Constants.FACTORY,
			"",
			Constants.OWNER
		);
		console.log("dataUsers", dataUsers.data);
		for (let i = 0; i < dataUsers.data.length; i++) {
			console.log("dataUsers", dataUsers.data[i].id);
			if (dataUsers.data[i].id) {
				let targets = dataUsers.data[i].id;
				let data = await getDataAction(
					targets,
					actionType,
					page,
					limit,
					startDate,
					endDate
				);
				let key = 1;
				data.data.data.map((item, index) => {
					console.log("item", item);
					ListTurnBack.push({
						date: item.date,
						idTurnback: item.idTurnback,
						nameAgency: item.nameAgency,
						nameCustomer: item.nameCustomer,
						nameWarehouse: item.nameWarehouse,
						numberCylinder: item.numberCylinder,
					});
				});
			}
		}
		let key = 1;
		let ListTurnBackBegin = [];
		ListTurnBack.map((item, index) => {
			ListTurnBackBegin.push({
				key: key++,
				date: item.date,
				idTurnback: item.idTurnback,
				nameAgency: item.nameAgency,
				nameCustomer: item.nameCustomer,
				nameWarehouse: item.nameWarehouse,
				numberCylinder: item.numberCylinder,
			});
		});
		console.log("ListTurnBack", ListTurnBackBegin);
		let ListTurnBackBeginNowDay = [];
		let ListTurnBackBeginOldDay = [];
		ListTurnBackBegin.map((item, index) => {
			console.log("item[index]", Date.parse(item.date));
			let createdAtDate = item.date;
			let endDay = new Date().setHours(23, 59, 59, 999);
			let start = new Date().setHours(0, 0, 0, 0);
			if (Date.parse(createdAtDate) >= start) {
				ListTurnBackBeginNowDay.push(item);
			} else if (Date.parse(createdAtDate) < start) {
				ListTurnBackBeginOldDay.push(item);
			}
		});
		this.setState({
			ListTurnBack: ListTurnBackBegin,
			ListTurnBackBeginOldDay: ListTurnBackBeginOldDay,
			ListTurnBackBeginNowDay: ListTurnBackBeginNowDay,
		});
	}
	getDataPrint = async (record, key) => {
		console.log("record", record);
		console.log("record", key);
		const result = await getTurnbacktDataPrint(record.idTurnback);
		console.log("result", result.data.data);
		//  console.log("orderId",orderId);
		//  let text=result.data.data[0].customerName;
		//  let date = result.data.data[0].date;
		if (result.status === 200) {
			let text = "_" + result.data.data[0].customerName;
			let agencyCode = key.agencyCode === "ZZZ" ? "" : "";
			let agencyName = key.nameAgency !== "" ? "_" + key.nameAgency : "";
			let date = result.data.data[0].date;
			let data =
				moment(date).format("DD/MM/YYYY") +
				text +
				agencyName +
				agencyCode +
				"_RET";
			this.setState({
				// enablePrint: true,
				editingKey: key.key,
				TurnBackDataPrint: result.data.data,
				titlePrint: data,
			});
		}
	};
	handleDataChange = (enableFilter) => {
		this.setState({ enableFilter });
		if (this.state.enableFilter === false) {
			this.setState({
				statusTime: false,
			});
		}
	};
	isEditing = (record) => record.key === this.state.editingKey;

	onClickPrint = async () => {
		let result = await getTurnbacktDataPrintByDate(this.state.endDate, this.state.startDate, this.state.id)
		if (result.data.status === true) {
			this.setState({
				check: false,
				turnbackAllDataPrint: result.data.data
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
		// console.log("dates",dates);
		// console.log("dates",dateStrings);
		this.setState(
			{
				startDate: dates[0] ? moment(dates[0]).toDate() : "",
				endDate: dates[0] ? moment(dates[1]).toDate() : "",
				check: true
			},
			this.filterData(dates, dateStrings)
		);
	};
	filterData = (dates, dateStrings) => {
		const { ListTurnBackBeginOldDay } = this.state;
		let startDate = dates[0] ? moment(dates[0]).toDate() : "";
		let endDate = dates[1] ? moment(dates[1]).toDate() : "";
		if (startDate && endDate) {
			console.log("startDate && endDate", ListTurnBackBeginOldDay);
			let data = ListTurnBackBeginOldDay;
			let tempData = data.filter((order) => {
				// console.log("tartDate && endDate",Date.parse((endDate)));
				// console.log("tartDate && endDate",Date.parse((moment(order.createdAt))));
				return (
					Date.parse(startDate) <= Date.parse(moment(order.date)) &&
					Date.parse(moment(order.date)) <= Date.parse(endDate)
				);
			});
			this.setState({
				listAllDriveShipBeginOldDayBegin: tempData,
				numberPagesOldBegin: Math.ceil(
					tempData.length / this.state.itemsPerPages
				),
				statusTime: true,
			});
			console.log("tempData", tempData);
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
	})
	handleReset = (clearFilters) => {
		clearFilters();
		this.setState({ searchText: "" });
	};
	handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		this.setState({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex,
		});
	};
	render() {
		const {
			size,
			ListTurnBack,
			enableFilter,
			ListTurnBackBeginNowDay,
			ListTurnBackBeginOldDay,
			statusTime,
			listAllDriveShipBeginOldDayBegin,
			// enablePrint
		} = this.state;
		const defaultPageSize = {
			defaultPageSize: 10,
		};
		const columns = [
			{
				title: this.props.t("ID_NUMBER"),
				dataIndex: "key",
				key: "key",
				...this.getColumnSearchProps("key"),
				// fixed: 'left',
				// width: 125
			},
			{
				title: this.props.t("NAME_WAREHOUSE"),
				dataIndex: "nameWarehouse",
				key: "nameWarehouse",
				...this.getColumnSearchProps("nameWarehouse"),
				// fixed: 'left',
				// width: 125
			},
			{
				title: this.props.t("DATE"),
				dataIndex: "date",
				key: "date",
				// ...this.getColumnSearchProps("createdAt"),
				sortDirections: ["descend", "ascend"],
				sorter: (a, b) => {
					return moment(a.date) - moment(b.date);
				},
				render: (text) => {
					return <div>{moment(text).format("DD/MM/YYYY - HH:mm")}</div>;
				},
			},
			{
				title: this.props.t("CUSTOMER"),
				dataIndex: "nameCustomer",
				key: "nameCustomer",
				...this.getColumnSearchProps("nameCustomer"),
			},
			{
				title: this.props.t("AGENCY_NAME"),
				dataIndex: "nameAgency",
				key: "nameAgency",
				...this.getColumnSearchProps("nameAgency"),
			},
			{
				title: this.props.t("NUMBER_CYLINDER"),
				dataIndex: "numberCylinder",
				key: "numberCylinder",
				...this.getColumnSearchProps("numberCylinder"),
			},
			{
				title: this.props.t("ACTION"),
				key: "operation",
				width: 150,
				align: "center",
				fixed: "right",
				render: (record, index) => {
					const editable = this.isEditing(record);
					return (
						<div title="">
							{editable ? (
								<Tooltip title={this.props.t("PRINT")}>
									<ReactToPrint
										style={{ marginLeft: 5 }}
										copyStyles={true}
										documentTitle={this.state.titlePrint}
										// onBeforeGetContent={this.handleOnBeforeGetContent}
										trigger={() => <Button type="primary" icon="printer" />}
										content={() => this.componentRef}
									/>
								</Tooltip>
							) : (
									""
								)}
							{!editable ? (
								<Tooltip title={this.props.t("DOWNLOAD")}>
									<Button
										type="primary"
										style={{ marginRight: 5 }}
										onClick={() => this.getDataPrint(record, record)}
										icon="download"
									/>
								</Tooltip>
							) : (
									""
								)}
						</div>
					);
				},
			},
		];
		return (
			<div>
				<Row style={{ marginTop: 20 }}>
					<Col xs={1}></Col>
					<Col xs={22}>
						<h4>{this.props.t("LIST_RETURN")}</h4>
					</Col>
					<Col xs={1}></Col>
				</Row>
				<Row>
					<Col xs={1}></Col>
					<Col xs={2}>
						<Form.Item label={this.props.t("FILTER")}>
							<Switch checked={enableFilter} onChange={this.handleDataChange} />
						</Form.Item>
					</Col>
					<Col xs={8}>
						<Form.Item>
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
					</Col>
					<Col xs={12}>
						{enableFilter === true && (
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
						)}
					</Col>
					<Col xs={1}></Col>

					{/*  */}
				</Row>
				<Row>
					<Col xs={1}></Col>
					<Col xs={22}>
						<Table
							//className="components-table-demo-nested"
							scroll={{ x: 1500, y: 420 }}
							// loading={isLoading}
							bordered={true}
							size={size}
							columns={columns.map((col) => {
								return {
									...col,
									onCell: (record) => ({
										key: record.idTurnback,
										dataIndex: col.dataIndex,
										title: col.title,
									}),
								};
							})}
							dataSource={
								enableFilter === false && statusTime === false
									? ListTurnBackBeginNowDay
									: enableFilter === true && statusTime === true
										? listAllDriveShipBeginOldDayBegin
										: ListTurnBackBeginOldDay
								// enableFilter ? this.state.listOrderOld : this.state.listOrderNow
							}
							pagination={defaultPageSize}
						// expandedRowRender={(record, index) =>
						//   this.expandedRowRender(record, index)
						// }
						// onRow={(record, index) => (
						// //     console.log('record, index', record, index)
						//     // this.setState('')
						//   )}
						/>
					</Col>
					<Col xs={1}></Col>

					<ImportPrinterTurnback
						ref={(el) => (this.componentRef = el)}
						dataPrint={this.state.TurnBackDataPrint}
						text={this.state.text}
					/>
					<ImportAllPrinterTurnback
						ref={(el) => (this.componentRefAll = el)}
						dataPrint={this.state.turnbackAllDataPrint}
						text={this.state.text}
					/>
				</Row>
			</div>
		);
	}
}
export default withNamespaces()(formListReturn);
