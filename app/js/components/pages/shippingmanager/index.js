import React, { Component } from "react";
import { Row, Col, Pagination, Divider, Switch,DatePicker,Table,Button,Icon,Input
 } from "antd";
import Form from "react-validation/build/form";
import Highlighter from "react-highlight-words";
import moment from "moment";
// import Input from "react-validation/build/input";
import { withNamespaces } from "react-i18next";
import "./shipmanager.scss";
import Constants from "Constants";
import showToast from "showToast";
import PopupShippingDetail from "./popupShippingDetail";
import PopupShippingEdit from "./popupShippingEdit";
import PopupShippingDetailBegin from "./popupShippingDetailBegin";

import getUserCookies from "getUserCookies";
import callApi from "./../../../util/apiCaller";
import { GETALLSHIPPINGORDER } from "./../../../config/config";
import getShippingOrder from "../../../../api/getShippingOrder";
const { RangePicker } = DatePicker;
class ShippingManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listAllDriveShip: [],
      listDriveShipDetail: "",
      listCustomerDetail: [],
      listDriver: [],
      nameDriver: "",
      licensePlate: "",
      listShippingText: [],
      listShippingCustomer: [],
      listShippingOrder: [],
      listShippingDriver: [],
      idShippingOrder: "",
      orderCode: "",
      orderId: "",
      noteOrder: "",
      shippingOrderDetail:[],
      count:0,
      idDriverBegin:"",
      enableFilter:false,
      listAllDriveShipBeginNowDay:[],
      listAllDriveShipBeginOldDay:[],
      listAllDriveShipBeginOldDayBegin:[],
      startDate: "",
      endDate: "",
      statusTime:false,

      /*
Đặt biến để phân trang (Pagination)
*/
      currentPage: 1,
      numberPages: 1,
      itemsPerPages: 10,
      numberPagesOldBegin:1,
      numberPagesOld:1,
      numberPagesNow:1,
      size: "default",
      isLoading:false,
      bordered:true,
      defaultPageSize: 10,
      searchText:"",
      searchedColumn:""
    };
  }
  async componentDidMount() {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    console.log("idhoa",id);
    console.log("tokenhoa",token);
    await this.getAllShippingOrder(id, token);
  }
  async handleonClick(id) {
    console.log("data1016", id);
    let data = await getShippingOrder(id);
     console.log("data1016", id);
    this.setState({
        nameDriver: data.data.ShippingOrder.nameDriver,
        licensePlate: data.data.ShippingOrder.licensePlate,
        idShippingOrder: data.data.ShippingOrder[0].id,
        noteOrder: data.data.ShippingOrder.note,
        shippingOrderDetail:data.data.shippingOrderDetail,
        idDriverBegin :id
    });
    //console.log("data1016", this.state.idShippingOrder);
    let count=data.data.shippingTextDetail[0].length;
    this.setState({
      listShippingDriver: data.data.ShippingOrder,
      listShippingText: data.data.shippingTextDetail,
      listShippingCustomer: data.data.ShippingCustomerDetail,
      count:count,
    });
    // console.log("hoadata.data.shippingOrderDetail", data.data.shippingOrderDetail);
    let arr = [];
    
    data.data.shippingOrderDetail.map((v, i) => {
      v.map((m) => {
        // m.orderId.listCylinder.map((n) => {
          //console.log("m.orderId.listCylinder[i]",m.orderId.listCylinder[i]);
          //console.log("m.orderId.listCylinder[i]",m);
          let total = 0;
          for(let i=0;i<m.orderId.listCylinder.length;i++){
            total += parseInt(m.orderId.listCylinder[i].numberCylinders);
          }
          // console.log("numberrCylinderrrs", total)
          arr.push({
            numberCylinders: total,
            id: m.orderId.orderCode,
            agencyId: m.orderId.agencyId,
            deliveryDate: m.orderId.deliveryDate,
            orderId: m.orderId.id,
            namekh:m.namekh,
            provinceId:m.provinceId===null?"":m.provinceId,
          });

          this.setState({
            orderCode: m.orderId.orderCode,
            orderId: m.id,
          });
        // });
      });
    });
    //console.log("arr1111",arr);
    this.setState({
      listShippingOrder: arr,
    });
    // console.log("listshippingOrderrrr1", this.state.listShippingOrder);
  }
  async getAllShippingOrder(id, token) {
    let params = {
      userId: id,
    };
    await callApi("GET", GETALLSHIPPINGORDER+id,'',token).then((res) => {
      // console.log('getAllShippingOrder_', res)
      this.setState({
        listAllDriveShip: res.data.ShippingOrder,
        numberPages: Math.ceil(
          res.data.ShippingOrder.length / this.state.itemsPerPages
        ),
      });
      });
      let listAllDriveShipBeginNowDay=[];
      let listAllDriveShipBeginOldDay=[];
      let indexOf=1;
      this.state.listAllDriveShip.map((item,index)=>{
      //  console.log("item[index]",Date.parse((item.createdAt)));
       let createdAtDate=item.createdAt;
     
       let endDay=new Date().setHours(23, 59, 59, 999);
       let start =new Date().setHours(0, 0, 0, 0);
       if(Date.parse((createdAtDate))>=start){
        listAllDriveShipBeginNowDay.push({
          createdAt: item.createdAt,
            createdBy: item.createdBy,
            deletedAt: item.deletedAt,
            deletedBy: item.deletedBy,
            deliveryDate: item.deliveryDate,
            deliveryHours: item.deliveryHours,
            driverId: item.driverId,
            id: item.id,
            isDeleted: item.isDeleted,
            licensePlate: item.licensePlate,
            nameDriver: item.nameDriver,
            note: item.note,
            numbercylinder: item.numbercylinder,
            updatedAt: item.updatedAt,
            updatedBy: item.updatedBy,
            sTT:indexOf++
        });
       }else if(Date.parse((createdAtDate))<start){
        listAllDriveShipBeginOldDay.push({
            createdAt: item.createdAt,
            createdBy: item.createdBy,
            deletedAt: item.deletedAt,
            deletedBy: item.deletedBy,
            deliveryDate: item.deliveryDate,
            deliveryHours: item.deliveryHours,
            driverId: item.driverId,
            id: item.id,
            isDeleted: item.isDeleted,
            licensePlate: item.licensePlate,
            nameDriver: item.nameDriver,
            note: item.note,
            numbercylinder: item.numbercylinder,
            updatedAt: item.updatedAt,
            updatedBy: item.updatedBy,
            sTT:indexOf++
        });
       }
      });
         console.log("listAllDriveShipBeginOldDay",listAllDriveShipBeginOldDay)
      this.setState({
        listAllDriveShipBeginOldDay:listAllDriveShipBeginOldDay,
        listAllDriveShipBeginNowDay:listAllDriveShipBeginNowDay,
        numberPagesNow: Math.ceil(
          listAllDriveShipBeginNowDay.length / this.state.itemsPerPages
        ),
        numberPagesOld: Math.ceil(
          listAllDriveShipBeginOldDay.length / this.state.itemsPerPages
        ),
      })
    // console.log("listDriveShipDetail111", this.state.listAllDriveShip);
    // console.log("listAllDriveShipBeginNowDay",listAllDriveShipBeginNowDay);
    // console.log("listAllDriveShipBeginNowDay",this.state.numberPagesNow);    
    // console.log("listAllDriveShipBeginNowDay",listAllDriveShipBeginOldDay);
    // console.log("listAllDriveShipBeginNowDay",this.state.numberPagesOld);
    // console.log("listDriveShipDetail111",(new Date("10/07/2020")).format("DD/MM/YYYY"));
  }
  handleDataChange = enableFilter => {
    this.setState(
      {
         enableFilter,
         
         }
      );
    console.log("Nha");
      if(this.state.enableFilter===false){
        this.setState({
          statusTime:false
        })
      }

  };
  onChangeTime = (dates, dateStrings) => {
    // console.log("dates",dates);
    // console.log("dates",dateStrings);
    this.setState(
      {
        startDate: dates[0] ? moment(dates[0]).toDate() : "",
        endDate: dates[0] ? moment(dates[1]).toDate() : "",
      },
    this.filterData(dates, dateStrings)
    );
  }
  filterData = (dates, dateStrings) =>  {
    const{listAllDriveShipBeginOldDay,listAllDriveShipBeginOldDayBegin,numberPagesOldBegin}=this.state;
    let startDate= dates[0] ? moment(dates[0]).toDate() : "";
    let endDate=dates[1] ? moment(dates[1]).toDate() : "";
    // console.log("dateStrings1",dateStrings);
    //  console.log("dateStrings1",startDate);
    //  console.log("dateStrings1",Date.parse((endDate)));
    if (startDate && endDate) {
      console.log('startDate && endDate',listAllDriveShipBeginOldDay);
      let  data=listAllDriveShipBeginOldDay;
      let tempData = data.filter((order) => {
        // console.log("tartDate && endDate",Date.parse((endDate)));
        // console.log("tartDate && endDate",Date.parse((moment(order.createdAt))));
        return (
          Date.parse((startDate)) <= Date.parse((moment(order.createdAt))) && 
          Date.parse((moment(order.createdAt))) <= Date.parse((endDate)) 
         
        );
      });
      // console.log("dateStrings1",tempData);
      this.setState({
        listAllDriveShipBeginOldDayBegin:tempData,
        statusTime:true,
      });
      console.log("listAllDriveShipBeginOldDay1111",listAllDriveShipBeginOldDayBegin,numberPagesOldBegin);
    }
  };
  getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
		}) =>(
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
    const{enableFilter,listAllDriveShipBeginOldDay,isLoading,bordered,size,defaultPageSize,statusTime,listAllDriveShipBeginOldDayBegin}=this.state;
    console.log("listAllDriveShipBeginOldDay",listAllDriveShipBeginOldDay) 
    const columns=[
      {
				title: "STT",
				dataIndex: "sTT",
				key: "sTT",
			    // ...this.getColumnSearchProps("keyy"),
				// fixed: 'left',
				 width: 70
			},
      {
				title: this.props.t("DRIVER"),
				dataIndex: "nameDriver",
				key: "nameDriver",
			  ...this.getColumnSearchProps("nameDriver"),
				// fixed: 'left',
				// width: 125
			},
      {
				title: this.props.t("LICENSE_PLATE"),
				dataIndex: "licensePlate",
				key: "licensePlate",
			  ...this.getColumnSearchProps("licensePlate"),
				// fixed: 'left',
				// width: 125
      },
      {
				title: this.props.t("NUM_CYLINDER"),
				dataIndex: "numbercylinder",
				key: "numbercylinder",
			  ...this.getColumnSearchProps("numbercylinder"),
				// fixed: 'left',
				// width: 125
      },
      {
				title: this.props.t("DELIVERY_DATE"),
				dataIndex: "deliveryDate",
				key: "deliveryDate",
			  ...this.getColumnSearchProps("deliveryDate"),
				// fixed: 'left',
				// width: 125
      },
      {
				title: this.props.t("DELIVERY_NOTE"),
				dataIndex: "note",
				key: "note",
			  ...this.getColumnSearchProps("note"),
				// fixed: 'left',
				// width: 125
      },
      {
				title: this.props.t("ACTION"),
				align: "center",
        key: "updateOrder",
        fixed: 'right',
        width: 150,
        render: (order) => (
          <div>
            <Button
              style={{width: 100, marginBottom: 2}}
              type="primary"
              style={{width: 100, marginBottom: 2}}
              onClick={() => {
                this.handleonClick(order.id);
              }}
              data-toggle="modal"
              data-target="#shipping-edit-modal"
            >
              {this.props.t("MODIFY")}
            </Button>
            <Button
              type="danger"
              style={{width: 100, marginBottom: 2}}
              // onClick={() =>
              //   this.onChangeStatusOK(order.id, "DELIVERING")
              // }
              data-toggle="modal"
              data-target="#shipping-detail-modal"
              onClick={() => {
                this.handleonClick(order.id);
              }}
            >
              {this.props.t('VIEW')}
            </Button>           
            {/* <button
              className="btn btn-sm btn-primary"
              data-toggle="modal"
              data-target="#export-order-modal"
              style={{ backgroundColor: "#ED383C" }}
              onClick={() => this.setState({selectedOrderId: order.id})}
            >
              Export
            </button> */}
          </div>
        ),
      },
    ]
    // console.log("listDriveShipDetail", this.state.listDriveShipDetail);
    // console.log("getAllShippingOrder", this.state.listAllDriveShip);
    return (
      <div>
        <Row style={{ marginTop: 20 }}>
          <Col md={1}></Col>
          <Col md={22}>
            <h4>{this.props.t("SHIPPING_MANAGER")}</h4>
          </Col>
          <Col md={1}></Col>
        </Row>
        <Row>
         <Col md={1}></Col>
          <Col md={2}>
            <h5>{this.props.t('FILTER')}</h5>            
          </Col>
          <Col md={2}>
          <Switch checked={enableFilter} onChange={this.handleDataChange} />            
          </Col>
          <Col md={8}>
          </Col>
          <Col md={10}>
          {enableFilter===true && (
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
         <Col md={1}></Col>             
         </Row>
        <Row>
          <Col md={1}></Col>
          <Col md={22}>
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
                enableFilter===true && statusTime===false ? this.state.listAllDriveShipBeginOldDay :
                enableFilter===true && statusTime===true?listAllDriveShipBeginOldDayBegin:
                 this.state.listAllDriveShipBeginNowDay
							}
							pagination={defaultPageSize}
						/>
          </Col>
          <Col md={1}></Col>
        </Row>
        <PopupShippingDetailBegin
        noteOrder = {this.state.noteOrder}
        orderId = {this.state.orderId}
        orderCode = {this.state.orderCode}
        idShippingOrder = {this.state.idShippingOrder}
        licensePlate = {this.state.licensePlate}
        nameDriver = {this.state.nameDriver}
        listShippingDriver = {this.state.listShippingDriver}
        listShippingCustomer = {this.state.listShippingCustomer}
        listShippingOrder = {this.state.listShippingOrder}
        listShippingText = {this.state.listShippingText}
        >         
        </PopupShippingDetailBegin>
        <PopupShippingEdit
          count={this.state.count}
          noteOrder = {this.state.noteOrder}
          orderId = {this.state.orderId}
          orderCode = {this.state.orderCode}
          idShippingOrder = {this.state.idShippingOrder}
          licensePlate = {this.state.licensePlate}
          nameDriver = {this.state.nameDriver}
          listShippingDriver = {this.state.listShippingDriver}
          listShippingCustomer = {this.state.listShippingCustomer}
          listShippingOrder = {this.state.listShippingOrder}
          listShippingText = {this.state.listShippingText}
          shippingOrderDetail={this.state.shippingOrderDetail}
          handleonClick={(id)=>this.handleonClick(id)}
          idDriverBegin={this.state.idDriverBegin}
        />
        
      </div>
    );
  }
}

export default withNamespaces()(ShippingManager);