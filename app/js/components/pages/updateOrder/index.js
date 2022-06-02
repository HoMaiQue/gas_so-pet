import React, { Component } from "react";
import { Row, Col, Form, Input, Select, Button, Table, Icon, Menu, Switch, Radio, DatePicker, message } from "antd";
//import './index.scss';
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import getAllUserApi from "getAllUserApi";
import getUserCookies from "getUserCookies";
import getDestinationUserAPI from "getDestinationUserAPI";
import Highlighter from "react-highlight-words";
import Constants from "Constants";
import { GETORDERFACTORY, UPDATEORDER } from "./../../../config/config";
import callApi from "./../../../util/apiCaller";
//import firebase from './../../../util/firebase';
import ImportDriverTypeCylinder from "../factory/ImportDriverTypeCylinder";
import PopupExportOrder from "./popupExportOrder"
import PopupDriverExportOrder from "./popupDriverExportOrder";
//import getOrderFactoryExcelAPI from "../../../../api/getOrderFactoryExcelAPI";
import {withNamespaces} from 'react-i18next';
// import ExportJsonExcel from 'js-export-excel';

import ReactHTMLTableToExcel from 'react-html-table-to-excel'; 
import TableUpdateOrderExcel from './TableUpdateOrderExcel';
import './order.scss';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ONE_DAY = 24 * 60 * 60 * 1000 // millisecond
const key = 'updatable'

class UpdateOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listAllOrder: [],
      idAPI: "",
      tokenAPI: "",
      // visibleModal: false,
      product_parse: [],
      selectedOrderIDs: [],
      selectedOrderInfor: [],
      //
      isLoading: false,
      data: [],
      enableFilter: false,
      warning: 'none',
      warningValue: 'none',
      startDate: '',
      endDate: '',
      selectedRowKeys: [],
      selectedRows: [],
      listTableExcel: [],
      excelToday: moment(new Date()).format("DD/MM/YYYY"),
      listDeliveryNow: [],
      listDeliveryOld: [],
      listDeliveryNowBegin: [],
      listDeliveryOldBegin: [],
      ShippingTextDetail: [],
      ShippingTextDetail1: [],
      message: []
    };
  }

  async componentDidMount() {
    let user_cookies = await getUserCookies();
    //console.log(user_cookies.user.id);
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    this.setState({
      idAPI: id,
      tokenAPI: token,
    });
    await this.getAllOrder(id, token);
    // const messaging=firebase.messaging();
    // messaging.requestPermission().then(()=>{
    //   console.log("Have Permission");
    //   return messaging.getToken();
    // }).then((tokenFirebase)=>{
    //   console.log(tokenFirebase);
    // })
    await this.handleButtonExportExcel();
  }

  getAllOrder = async (id, token) => {
    this.setState({isLoading: true})
    let parmas = {
      factoryId: id,
    };
    await callApi("POST", GETORDERFACTORY, parmas, token).then((res) => {
       //console.log('getAllOrder', res.data);
      let temp = [];
      let i = 0;
      console.log("ResDataaaaa", res.data.orderFactory);
      let stepAll = [];
     
      for (let item of res.data.orderFactory) {
        temp.push({
          key: i,
          id: item.id,
          orderCode: item.orderCode,
          orderId: item.id ? item.id : '',
          customerCodeBegin:item.customerId? item.customerId.customerCode:"",
          customerCode: item.customerId.id,
          customerName: item.customerId.name,
          agencyCode: item.agencyId?item.agencyId.agencyCode:"",
          agencyName: item.agencyId ? item.agencyId.name : '',
          listCylinder: item.listCylinder ? item.listCylinder : [],
          orderDate: item.createdAt ? item.createdAt : '__/__/____',
          expected_DeliveryDate: (item.status==="DELIVERED" || item.status==="COMPLETED") ? moment(item.orderHistories[0].createdAt).format("DD/MM/YYYY - HH:mm") : moment(item.deliveryDate).format("DD/MM/YYYY - HH:mm"),
          // expected_DeliveryTime: item.deliveryDate ? moment(item.deliveryDate).format("HH:mm") : '__:__',      
          deliveryDate: item.deliveryDate ? item.deliveryDate : '',
          note: item.note,
          createdAt: item.createdAt ? item.createdAt : '',
          // status: item.status === "INIT" ? "Khởi tạo"
          // : item.status === "CONFIRMED" ? "Đã xác nhận đơn hàng"
          // : item.status === "DELIVERING" ? "Đang vận chuyển"
          // : item.status === "DELIVERED" ? "Đã giao"
          // : item.status === "COMPLETED" ? "Đã hoàn thành"
          // : item.status === "CANCELLED" ? "Đã bị hủy"
          // : item.status,
          status: item.status ? item.status : '',
        });
        i++;
      }
       for (let items of res.data.orderFactory) {
        if(items.orderCode === 'DH080920-193509') {
          console.log("dataOrderCodeSuccess",items);
        }
      }
      let listDeliveryNowDay= [];
      let listDeliveryOldDay= [];
      temp.map((item,index)=>{
          // console.log("item[index]",item.deliveryDate);
          let createdAtDate=item.orderDate;
          let endDay=new Date().setHours(23, 59, 59, 999);
          let start =new Date().setHours(0, 0, 0, 0);
          if(Date.parse((createdAtDate))>=start){
              console.log("Date.parse((item[index].deliveryDate))",Date.parse((item.deliveryDate)));
              listDeliveryNowDay.push(item);
          }else if(Date.parse((createdAtDate))<start){
              listDeliveryOldDay.push(item);
          }
     
      }) 
      this.setState({
        listAllOrder: temp,
        isLoading: false,
        listDeliveryNow: listDeliveryNowDay,
        listDeliveryOld: listDeliveryOldDay,
        listDeliveryNowBegin: listDeliveryNowDay,
        listDeliveryOldBegin: listDeliveryOldDay
      });
    });
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
    this.state.searchText==="Khởi tạo"?record[dataIndex].toString().toLowerCase().includes(("INIT").toLowerCase()):
		this.state.searchText==="Đã xác nhận đơn hàng"?record[dataIndex].toString().toLowerCase().includes(("CONFIRMED").toLowerCase()):
		this.state.searchText==="Đang vận chuyển"?record[dataIndex].toString().toLowerCase().includes(("DELIVERING").toLowerCase()):
		this.state.searchText==="Đã giao"?record[dataIndex].toString().toLowerCase().includes(("DELIVERED").toLowerCase()):
		this.state.searchText==="Đã hoàn thành"?record[dataIndex].toString().toLowerCase().includes(("COMPLETED").toLowerCase()):
		this.state.searchText==="Đã bị hủy"?record[dataIndex].toString().toLowerCase().includes(("CANCELLED").toLowerCase()):
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

  onChangeStatusOK = async (id, status) => {
    message.loading({ content: 'Đang cập nhật...', key, duration: 5 });

    // this.setState({
    //   visibleModal: true,
    // });
    // console.log('visibleModal', this.state.visibleModal)
    let updateOrderStatus = {
      updatedBy: this.state.idAPI,
      orderStatus: status,
      orderId: id,
    }
    let parmas = {
      updateOrderStatus
    };
    
    await callApi("POST", UPDATEORDER, parmas, this.state.tokenAPI)
      .then(async (res) => {
        console.log('UPDATEORDER', res);

        if (res.data.status === true) {
          message.success({ content: 'Thành công!', key, duration: 2 });
        }
        else {
          message.error({ content: 'Lỗi: ' + res.data.message, key, duration: 3 });
        }
        await this.getAllOrder(this.state.idAPI, this.state.tokenAPI);
      })
      .catch()
      
  };

  // handleOk = () => {
  //   // this.setState({
  //   //   ModalText: 'The modal will be closed after two seconds',
  //   //   confirmLoading: true,
  //   // });
  //   setTimeout(() => {
  //     this.setState({
  //       visibleModal: false,
  //       //confirmLoading: false,
  //     });
  //   }, 2000);
  // };

  // handleCancel = () => {
  //   console.log('Clicked cancel button');
  //   this.setState({
  //     visibleModal: false,
  //   });
  // };

  expandedRowRender = (record, index) => {
    // console.log('expandedRowRender', record, index)
    const columnsNestedTables = [
      { title: 'Loại bình', dataIndex: 'cylinderType', key: 'cylinderType' },
      { title: 'Màu sắc', dataIndex: 'color', key: 'color' },
      { title: 'Loại van', dataIndex: 'valve', key: 'valve' },
      { title: 'Số lượng bình', dataIndex: 'numberCylinders', key: 'numberCylinders' },
    ];

    const data = [];
    const lengthListCylinder = record.listCylinder.length
    for (let i = 0; i < lengthListCylinder; i++) {
      data.push({
        key: i,
        cylinderType: record.listCylinder[i].cylinderType,
        color: record.listCylinder[i].color==="GRAY"? "Xám" :
                       record.listCylinder[i].color==="YELLOW" ? "Vàng":
                       record.listCylinder[i].color==="ORANGE" ?"Cam":
                       record.listCylinder[i].color==="RED" ?"Đỏ" :
                       record.listCylinder[i].color,
        valve: record.listCylinder[i].valve,
        numberCylinders: record.listCylinder[i].numberCylinders,
      });
    }
    return <Table columns={columnsNestedTables} dataSource={data} pagination={false} />;
  };

  getListProducts = (products) => {
    this.setState({ product_parse: products });
  }

  handleInputValue = (val) =>{
    this.setState({ ShippingTextDetail: val});
    console.log("handleInputValue",this.state.ShippingTextDetail)
    console.log("handleInputValuearr",val)
  }
  handleInputValue1 = (val) =>{
    this.setState({ ShippingTextDetail1: val});
    console.log("handleInputValue111111111111111111",this.state.ShippingTextDetail1)
    console.log("handleInputValuearr",val)
  }
  handleDataChange = enableFilter => {
    this.setState({ enableFilter });
  };

  handleWarningChange = e => {
    const { value } = e.target
    
    this.setState({
      warning: value === 'none' ? 'none' : { position: value },
      warningValue: value,
    }, this.filterData)
  };

  onChangeTime = (dates, dateStrings) => {
    // console.log('From: ', dates[0], ', to: ', dates[1]);
    // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);

    // console.log(moment(dates[0]).toDate())
    // console.log(moment(dates[0]).isValid())
    this.setState({
      startDate: dates[0] ? moment(dates[0]).toDate() : '',
      endDate: dates[0] ? moment(dates[1]).toDate() : ''
    }, this.filterData)
  }

  filterData = () => {
    const {
      startDate,
      endDate,
      listAllOrder,
      data,
      warningValue,
      listDeliveryNow,
      listDeliveryOld
    } = this.state

    let tempData = listDeliveryOld;
    let tempDataNow = listDeliveryNow;
    if(this.state.enableFilter === true){
      if (startDate && endDate) {
        // console.log('startDate && endDate', startDate, endDate)
        tempData = this.state.listDeliveryOldBegin;
          console.log('startDate && endDate', tempData)
         const data = tempData.filter((order) => {
           console.log("Date.parse((startDate))",Date.parse((startDate)));
           console.log("Date.parse((startDate))",Date.parse((endDate)));
           console.log("Date.parse((startDate))",Date.parse((order.deliveryDate)));
          return (
            Date.parse((startDate)) <= Date.parse((moment(order.deliveryDate))) && 
            Date.parse((moment(order.deliveryDate))) <= Date.parse((endDate)) 
           
          );
          });
           console.log("  ",data),

        this.setState({ listDeliveryOld: data });
      }

      // console.log('warning', warningValue)
      // console.log('listAllOrder', listAllOrder)
      if (warningValue === 'INIT') {
        tempData = this.state.listDeliveryOldBegin;
        // console.log('INIT')
        const data = tempData.filter(order => {
          return order.status === 'INIT'
        })
        // console.log('data', data)
        this.setState({ listDeliveryOld: data })
      }
      if (warningValue === 'CONFIRMED') {
        tempData = this.state.listDeliveryOldBegin;
        const data = tempData.filter(order => {
          return order.status === 'CONFIRMED'
        })
        this.setState({ listDeliveryOld: data })
      }
      if (warningValue === 'DELIVERING') {
        tempData = this.state.listDeliveryOldBegin;
        const data = tempData.filter(order => {
          return order.status === 'DELIVERING'
        })
        this.setState({ listDeliveryOld: data })
      }
      if (warningValue === 'COMPLETED') {
        tempData = this.state.listDeliveryOldBegin;
        const data = tempData.filter(order => {
          return (order.status === 'COMPLETED' || order.status === 'DELIVERED') 
        })
        this.setState({ listDeliveryOld: data })
      }
      if (warningValue === 'CANCELLED') {
        tempData = this.state.listDeliveryOldBegin;
        const data = tempData.filter(order => {
          return order.status === 'CANCELLED'
        })
        this.setState({ listDeliveryOld: data })
      }
      if (warningValue === 'DELIVERED') {
        tempData = this.state.listDeliveryOldBegin;
        const data = tempData.filter(order => {
          return order.status === 'DELIVERED'
        })
        this.setState({ listDeliveryOld: data })
      }      
    } else if(this.state.enableFilter === false){
      if (warningValue === 'INIT') {
        tempData = this.state.listDeliveryNowBegin;
        // console.log('INIT')
        const data = tempData.filter(order => {
          return order.status === 'INIT'
        })
        // console.log('data', data)
        this.setState({ listDeliveryNow: data })
      }
      if (warningValue === 'CONFIRMED') {
        tempData = this.state.listDeliveryNowBegin;
        const data = tempData.filter(order => {
          return order.status === 'CONFIRMED'
        })
        this.setState({ listDeliveryNow: data })
      }
      if (warningValue === 'DELIVERING') {
        tempData = this.state.listDeliveryNowBegin;
        const data = tempData.filter(order => {
          return order.status === 'DELIVERING'
        })
        this.setState({ listDeliveryNow: data })
      }
      if (warningValue === 'COMPLETED') {
        tempData = this.state.listDeliveryNowBegin;
        const data = tempData.filter(order => {
          return (order.status === 'COMPLETED' || order.status === 'DELIVERED')
        })
        this.setState({ listDeliveryNow: data })
      }
      if (warningValue === 'CANCELLED') {
        tempData = this.state.listDeliveryNowBegin;
        const data = tempData.filter(order => {
          return order.status === 'CANCELLED'
        })
        this.setState({ listDeliveryNow: data })
      }
      if (warningValue === 'DELIVERED') {
        tempData = this.state.listDeliveryNowBegin;
        const data = tempData.filter(order => {
          return order.status === 'DELIVERED'
        })
        this.setState({ listDeliveryNow: data })
      }  
    }

  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    // console.log('selectedRows changed: ', selectedRows);
    this.setState({ selectedRowKeys, selectedRows });
  };

  onSelectRowChange = (record, selected, selectedRows, nativeEvent) => {
    // console.log('onSelectChange_record: ', record);
    // console.log('onSelectChange_selected: ', selected);
    // console.log('onSelectChange_selectedRows: ', selectedRows);
    // console.log('onSelectChange_nativeEvent: ', nativeEvent);
    // this.setState({ selectedRowKeys });
  };

  //this.setState({selectedOrderIDs: [order.id]})
  createListOrderIDs = () => {
    const {
      selectedRows
    } = this.state

    if (selectedRows.length===0) {
      alert('Chưa chọn đơn hàng nào')
    }
    else {
      let orderIDs = []
      let selectedOrderInforBegin=[];
      selectedRows.forEach(row => {
        orderIDs.push(row.id)
      });
      let selectedRowsBegin=[]; 
      selectedRows.map((item,index)=>{
        selectedRowsBegin.push({
          agencyName: item.agencyName,
          createdAt: item.createdAt,
          customerCode: item.customerCode,
          customerName: item.customerName,
          deliveryDate: item.deliveryDate,
          expected_DeliveryDate: item.expected_DeliveryDate,
          id: item.id,
          key: item.key,
          listCylinder: item.listCylinder,
          note: item.note,
          orderCode: item.orderCode,
          orderDate: item.orderDate,
          orderId: item.orderId,
          status: item.status,
          provinceId:"",
        });

      })
      console.log("selectedRows",selectedRowsBegin);
      console.log("selectedRows",selectedRows);
      this.setState({selectedOrderIDs: orderIDs, selectedOrderInfor: selectedRowsBegin})
    }
  }
  handleButtonExportExcel = () => {
// console.log("this.state.listDeliveryNowBegin",this.state.listDeliveryNowBegin)
    const data = this.state.listDeliveryNowBegin.filter(order=>{
      console.log("order.status",order.status);
      return order.status==="INIT";
    });
    console.log("data1111111111", data)
    let dataTable = [];
    let binh12A = [];
    let binh45A = [];
    let binh50A = [];
    let binh12COA = [];

    //bình 50 
    let cylinders50POLGRAY=[];
    let cylinders50VANGRAY=[];
    //bình 45 
    let cylinders45POLGRAY=[];
    let cylinders452VANGRAY=[];
    //bình 12
    let cylinders12POLGRAY=[];
    let cylinders12POLRED=[];
    let cylinders12POLYELLOW=[];
    //bình 12CO
    let cylinders12COCOMPACTSHELL=[]
    let cylinders12COCOMPACTVT=[]
    let cylinders12COCOMPACTPETRO=[]
    let cylinders12COCOMPACTORANGE=[]
    if (data) {
      for (let item in data) {
        console.log("dataListOrderNow", data);
        for (let i = 0; i < data[item].listCylinder.length; i++) {
          console.log("data[item].listCylinder[i]", data[item].listCylinder[i]);
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
            if ((binh50A[i].valve === "POL" && binh50A[i].color === "GRAY")||binh50A[i].valve === "POL" && binh50A[i].color === "Xám") {
              count50POLGRAY += +binh50A[i].numberCylinders;
              cylinders50POLGRAY[0] = {
                color: binh50A[i].color,
                cylinderType: binh50A[i].cylinderType,
                numberCylinders: +binh50A[i].numberCylinders,
                valve: binh50A[i].valve,
              };
            } else if (
              (binh50A[i].valve === "2 VAN" &&
              binh50A[i].color === "GRAY") || (binh50A[i].valve === "2 VAN" &&
              binh50A[i].color === "Xám")
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
        console.log("count50", count50);
        console.log("binh50", binh50A);
        console.log("cylinders50VANGRAY", cylinders50VANGRAY);
        console.log("cylinders50POLGRAY", cylinders50POLGRAY);
        binh45A = data[item].listCylinder.filter((item) => {
          return item.cylinderType === "CYL45KG";
        });
        let count45 = 0;
        let count45POLGRAY = 0;
        let count452VANGRAY = 0;
        for (let i = 0; i < binh45A.length; i++) {
          count45 += +binh45A[i].numberCylinders;
          if (binh45A[i].cylinderType === "CYL45KG") {
            if ((binh45A[i].valve === "POL" && binh45A[i].color === "GRAY")||(binh45A[i].valve === "POL" && binh45A[i].color === "Xám")) {
              count45POLGRAY += +binh45A[i].numberCylinders;
              cylinders45POLGRAY.push({
                color: binh45A[i].color,
                cylinderType: binh45A[i].cylinderType,
                numberCylinders: binh45A[i].numberCylinders,
                valve: binh45A[i].valve,
              });
            } else if (
              (binh45A[i].valve === "2 VAN" &&
              binh45A[i].color === "GRAY") || (binh45A[i].valve === "2 VAN" &&
              binh45A[i].color === "Xám")
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
        console.log("count45", count45);
        console.log("binh45", binh45A);
        console.log("cylinders45VANGRAY", cylinders452VANGRAY);
        console.log("cylinders45VANGRAY", cylinders45POLGRAY);
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
            if ((binh12A[i].valve === "POL" && binh12A[i].color.trim() === "GRAY")||(binh12A[i].valve === "POL" && binh12A[i].color.trim() === "Xám")) {
              count12POLGRAY += +binh12A[i].numberCylinders;
              cylinders12POLGRAY.push({
                color: binh12A[i].color,
                cylinderType: binh12A[i].cylinderType,
                numberCylinders: binh12A[i].numberCylinders,
                valve: binh12A[i].valve,
              });
            } else if (
              (binh12A[i].valve === "POL" &&
              binh12A[i].color.trim() === "RED") || (binh12A[i].valve === "POL" &&
              binh12A[i].color.trim() === "Đỏ")
            ) {
              count12POLRED += +binh12A[i].numberCylinders;
              cylinders12POLRED.push({
                color: binh12A[i].color,
                cylinderType: binh12A[i].cylinderType,
                numberCylinders: binh12A[i].numberCylinders,
                valve: binh12A[i].valve,
              });
            } else if (
              (binh12A[i].valve === "POL" &&
              binh12A[i].color.trim() === "YELLOW") || (binh12A[i].valve === "POL" &&
              binh12A[i].color.trim() === "Vàng")
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
        console.log("count12", count12);
        console.log("binh12", binh12A);
        console.log("cylinders12POLYELLOW", cylinders12POLYELLOW);
        console.log("cylinders12POLRED", cylinders12POLRED);
        console.log("cylinders12POLGRAY", cylinders12POLGRAY);

        binh12COA = data[item].listCylinder.filter((item) => {
          return item.cylinderType === "CYL12KGCO";
        });
        console.log("binh12COA", binh12COA);
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
              binh12COA[i].valve === "COMPACT" &&
              binh12COA[i].color.trim() === "Petro"
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
              binh12COA[i].color.trim() === "ORANGE") ||(binh12COA[i].valve === "COMPACT" &&
              binh12COA[i].color.trim() === "Cam")
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
      let  dateBegin=moment(data[item].createdAt).format("DD/MM/YYYY");
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
            customerCode:data[item].customerCodeBegin,
            orderCode: data[item].orderCode,
            Provine: data[item].agencyName,
            name: data[item].customerName,
            numderDriver: "",
            deliveryDate: data[item].expected_DeliveryDate,
            // 'Số lượng bình': data[item].listCylinder[items].numberCylinders,
            binh12: count12 ,
            count12POLGRAY:count12POLGRAY,
            count12POLRED:count12POLRED,
            count12POLYELLOW:count12POLYELLOW,
            binh12CO:count12CO,
            count12COCOMPACTSHELL:count12COCOMPACTSHELL,
            count12COCOMPACTVT:count12COCOMPACTVT,
            count12COMPACTPETRO:count12COMPACTPETRO,
            count12COMPACTORANGE:count12COMPACTORANGE,
            binh45: count45,
            count45POLGRAY:count45POLGRAY,
            count452VANGRAY:count452VANGRAY,
            binh50: count50,
            count502VANGRAY:count502VANGRAY,
            count50POLGRAY:count50POLGRAY,
            ghiChu: data[item].note,
            status: statusBegin,
            agencyCode:data[item].agencyCode,
          };
          dataTable.push(obj);
        }
        console.log("dataTable",dataTable);
      }
      this.setState({
        listTableExcel: dataTable
      })
      console.log("listTableExcel", this.state.listTableExcel)
    }
    // option.fileName = 'Xem don hang';
    // option.datas = [
    //   {
    //     sheetData: dataTable,
    //     sheetName: 'Danh sách đơn hàng',
    //     sheetFilter:['No','Mã khách hàng','Provine', 'name', 'Số xe', 'Thời gian giao hàng', 'Số lượng bình 12', 'Số lượng bình 45', 'Số lượng bình 50', 'Ghi chú'],
    //     sheetHeader:['No','Mã khách hàng','Provine', 'name', 'Số xe', 'Thời gian giao hàng', 'Số lượng bình 12', 'Số lượng bình 45', 'Số lượng bình 50', 'Ghi chú'],
        
    //   }
    // ];
    // var toExcel = new ExportJsonExcel(option); 
    // toExcel.saveExcel();
  }



  render() {
    let {
      maDH,
      countOrder,
      listAllOrder,
      selectedRowKeys,
      //visibleModal,
      enableFilter,
      warning,
      data,
      //selectedRowKeys,
    } = this.state;
console.log("this.state.message",this.state.message)
    console.log('listAllOrder bắt đầu', listAllOrder);
        
    // if (listAllOrder.length > 0) {
    //   console.log('listAllOrder bắt đầu chỉnh sửa', listAllOrder)
    //   listAllOrder.forEach(order => {
    //     let totalNumberCylinders = 0
    //     if (order.hasOwnProperty('listCylinder') && order.listCylinder.length>0) {
    //       order.listCylinder.forEach(element => {
    //         totalNumberCylinders += element.numberCylinders
    //       });          
    //     }
    //     order.totalNumberCylinders = numberCylinders
    //   });
    //   console.log('listAllOrder sau khi chỉnh sửa', listAllOrder)
    // }

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelectRowChange,
    };
    

    const columns = [
      {
        title: this.props.t('ORDERED_CODE'),
        dataIndex: "orderCode",
        key: "orderCode",
        ...this.getColumnSearchProps("orderCode"),
        // fixed: 'left',
        // width: 150
      },
      {
        title: this.props.t('TIME_CREATE'),
        dataIndex: "orderDate",
        key: "orderDate",
        ...this.getColumnSearchProps("orderDate"),
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) =>  {
            return (moment(a.createdAt) - moment(b.createdAt))
        },
        render: (text) => {                    
            return (
                <div>{moment(text).format("DD/MM/YYYY - HH:mm")}</div>
            )
        }
      },
      // {
      //   title: "Mã khách hàng",
      //   dataIndex: "customerCode",
      //   key: "customerCode",
      //   ...this.getColumnSearchProps("customerCode"),
      // },
      {
        title: this.props.t('CUSTOMER'),
        dataIndex: "customerName",
        key: "customerName",
        ...this.getColumnSearchProps("customerName"),
      },
      // {
      //   title: "Mã chi nhánh",
      //   dataIndex: "agencyCode",
      //   key: "agencyCode",
      //   ...this.getColumnSearchProps("agencyCode"),
      // },
      {
        title: this.props.t('AGENCY_NAME'),
        dataIndex: "agencyName",
        key: "agencyName",
        ...this.getColumnSearchProps("agencyName"),
      },
      {
        title: this.props.t('DELIVERY_DATE'),
        dataIndex: "expected_DeliveryDate",
        key: "expected_DeliveryDate",
        ...this.getColumnSearchProps("expected_DeliveryDate"),
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => {
          return (moment(a.deliveryDate) - moment(b.deliveryDate))
        },
        // render: (text) => {
        //   return (
        //     <div>{moment(text).format("DD/MM/YYYY - HH:mm")}</div>
        //   )
        // }
      },
      // {
      //   title: "Thời gian",
      //   key: "expected_DeliveryTime",
      //   dataIndex: "expected_DeliveryTime",
      //   ...this.getColumnSearchProps("expected_DeliveryTime"),
      //   sortDirections: ['descend', 'ascend'],
      //   sorter: (a, b) => {
      //     return (moment(a.deliveryDate) - moment(b.deliveryDate))
      //   },
      //   // render: (text) => {
      //   //   return (
      //   //     <div>{moment(text).format("HH:mm")}</div>
      //   //   )
      //   // }
      // },
        // Thay đổi màu sắc của 1 cell trong table
        // render(text, record) {
        //   return {
        //     props: {
        //       style: { background: '#ddd' },
        //     },
        //     children: <div>{text}</div>,
        //   };
        // },
      
      // {
      //   title: "Ngày giao hàng",
      //   dataIndex: "expected_DeliveryDate",
      //   key: "expected_DeliveryDate",
      //   ...this.getColumnSearchProps("expected_DeliveryDate"),
      // },
      // {
      //   title: "Giờ giao",
      //   dataIndex: "expected_DeliveryTime",
      //   key: "expected_DeliveryTime",
      //   ...this.getColumnSearchProps("expected_DeliveryTime"),
      // },
      {
        title: this.props.t('NOTE'),
        dataIndex: "note",
        key: "note",
        ...this.getColumnSearchProps("note"),
      },
      {
        title: this.props.t('STATUS'),
        dataIndex: "status",
        key: "status",
        ...this.getColumnSearchProps("status"),
        render: (text) => {
          const txt = text === "INIT" ? "Khởi tạo"
              : text === "CONFIRMED" ? "Đã xác nhận đơn hàng"
                  : text === "DELIVERING" ? "Đang vận chuyển"
                      : text === "DELIVERED" ? "Đã hoàn thành"
                          : text === "COMPLETED" ? "Đã hoàn thành"
                              : text === "CANCELLED" ? "Đã bị hủy"
                                  : text
          return (
              <div>{txt}</div>
          )
      }
      },
      {
        title: this.props.t('UPDATE_STATUS'),
        align: "center",
        key: "updateOrder",
        fixed: 'right',
        width: 150,
        render: (order) => (
          <div>
            <Button
              style={{width: 100, marginBottom: 2}}
              type="primary"
              onClick={() => this.onChangeStatusOK(order.id, "CONFIRMED")}
            >
              {this.props.t('RECEIVED')}
            </Button>
            <Button
              type="danger"
              style={{width: 100, marginBottom: 2}}
              // onClick={() =>
              //   this.onChangeStatusOK(order.id, "DELIVERING")
              // }
              data-toggle="modal"
              data-target="#export-order-modal"
              onClick={() => this.setState({selectedOrderIDs: [order.id], selectedOrderInfor: [order]})}
            >
              {this.props.t('TRANSPORT')}
            </Button>
            <Button
              type="danger"
              style={{width: 100, marginBottom: 2}}
              onClick={() => this.onChangeStatusOK(order.id, "CANCELLED")}
            >
              {this.props.t('CANCEL')}
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
    ];
    //console.log(this.state.valueCompany);
    return (
      <div>
        <Row style={{ marginTop: 20 }}>
          <Col xs={1}></Col>
          <Col xs={22}>
            <h4>{this.props.t('VIEW_ORDER_RECEIVE')}</h4>
          </Col>
          <Col xs={1}></Col>
        </Row>
        <Row>
          <Col xs={1}></Col>
          <Col xs={2} style={{marginRight: "20px"}}>
            {/* <Button
              type="danger"
              onClick={() => this.handleButtonExportExcel()}
            >
              {this.props.t("EXCEL")}
            </Button> */}
            <ReactHTMLTableToExcel  
              className="btn btn-success"  
              table="emp"  
              filename="_Danh_Sach_Don_Hang_"  
              sheet="Danh sách đơn hàng"  
              buttonText={this.props.t("EXCEL")}
            /> 
          </Col>
          <Col xs={3}>
            <Button
              type="primary"
              data-toggle="modal"
              data-target="#export-order-modal"
              onClick={this.createListOrderIDs}
            >
              {this.props.t('TRANSPORT')}
            </Button>
          </Col>
          <Col xs={17}></Col>
        </Row>
        <Row>
          <Col xs={1}></Col>
          <Col xs={19}>
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
              <Form.Item label={this.props.t('FILTER')}>
                <Switch checked={enableFilter} onChange={this.handleDataChange} />
              </Form.Item>
              <Form.Item label={this.props.t('STATUS')}>
                <Radio.Group
                  value={warning ? warning.position : 'notConfirmed'}
                  onChange={this.handleWarningChange}
                >
                  {/* <Radio.Button value="notConfirmed">Chưa xác nhận</Radio.Button>
                            <Radio.Button value="notDelivered">Chưa được giao</Radio.Button> */}
                  <Radio.Button value="INIT">{this.props.t('INITIALIZATION')}</Radio.Button>
                  <Radio.Button value="CONFIRMED">{this.props.t('ACCEPT')}</Radio.Button>
                  <Radio.Button value="DELIVERING">{this.props.t('DELIVERY')}</Radio.Button>
                  <Radio.Button value="COMPLETED">{this.props.t("COMPLETED")}</Radio.Button>
                  {/* <Radio.Button value="DELIVERED">{this.props.t("DELIVERED")}</Radio.Button> */}
                  <Radio.Button value="CANCELLED">{this.props.t("CANCELLED")}</Radio.Button>

                </Radio.Group>
              </Form.Item>
              <Form.Item>
                <RangePicker
                  ranges={{
                    'Hôm nay': [moment().startOf('day'), moment().endOf('day')],
                    'Tháng hiện tại': [moment().startOf('month'), moment().endOf('month')],
                  }}
                  showTime={{ format: "HH:mm", defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')] }}
                  format="DD/MM/YYYY HH:mm"
                  onChange={this.onChangeTime}
                />
              </Form.Item>
            </Form>
          </Col>
          <Col xs={4}></Col>
        </Row>
        <Row>
          <Col xs={1}>
          <TableUpdateOrderExcel listTableExcel = {this.state.listTableExcel}>
          </TableUpdateOrderExcel>
          {/* <div hidden="true">
          <table id="emp" class="table">  
              <thead>
                <tr>
                  <th colspan="12">
                    <h1>LỆNH GIAO HÀNG</h1>
                  </th>
                </tr>
                <tr><th></th></tr>
                <tr><th></th></tr>
                <tr><th></th></tr>
                <tr><th></th></tr>
                <tr>
                  <th colspan="8"></th>
                  <th colspan="3">
                      D.O. No.: 
                  </th>                              
                </tr>
                <tr>
                  <th colspan="8"></th>
                  <th colspan="3">
                      Date: {this.state.excelToday}
                  </th>
                </tr>                             
                <tr>
                  <th colspan="11">
                    <h5>
                    Quý công ty vui lòng giao hàng lên phương tiện Vận tải được chỉ định bời Công ty TNHH GAS SOPET					
                    với các chi tiết sau:					
                    </h5>
                  </th>
                </tr>
                <tr>
                  <th rowSpan="2">No.</th>
                  <th rowSpan="2">Ngày nhận hàng</th>
                  <th rowSpan="2">Mã đơn hàng</th>
                  <th rowSpan="2">Provine</th>
                  <th rowSpan="2">Khách hàng</th>
                  <th rowSpan="2">Số xe</th>
                  <th rowSpan="2">Thời gian giao hàng</th>
                  <th colSpan="3" rowSpan="1">Số lượng bình</th>        
                  <th rowSpan="2">Trạng thái</th>
                  <th rowSpan="2">Ghi chú</th>
                </tr>
                <tr>
                   <th colSpan="1" rowSpan="1">Loại 50kg</th>
                  <th colSpan="1" rowSpan="1">Loại 45kg</th>
                  <th colSpan="1" rowSpan="1">Loại 12kg</th>                   
                </tr>
              </thead>  
              <tbody>
                {this.state.listTableExcel.map((p, index) => {
                  return <tr key={index}>  
                            <td>{index}</td>
                            <td></td>
                            <td>{p.maKH}</td>
                            <td>{p.Provine}</td>
                            <td>{p.ten}</td>
                            <td></td>
                            <td>{p.thoiGianGH}</td>
                            <td>{p.binh50 !== 0 ? p.binh50 : ''}</td>
                            <td>{p.binh45 !== 0 ? p.binh45 : ''}</td>
                            <td>{p.binh12 !== 0 ? p.binh12 : ''}</td>
                            <td>{p.status}</td>
                            <td></td>
                          </tr>                  
                })}
              </tbody>  
            </table>
            </div> */}
          </Col>
          <Col xs={22}>
            <Table
              //title = {() => 'Here is title'}
              scroll={{ x: 1500, y: 420 }}
              bordered
              columns={columns}
              dataSource={enableFilter ? this.state.listDeliveryOld : this.state.listDeliveryNow}
              expandedRowRender={(record, index) => this.expandedRowRender(record, index)}
              // rowClassName={(record, index) => ((moment(record.deliveryDate, "DD/MM/YYYY - HH:MM:SS") - (new Date)) < ONE_DAY ? "red" : "blue")}
              rowSelection={rowSelection}
              loading={this.state.isLoading}
            />
          </Col>
          <Col xs={1}></Col>
        </Row>   
        {/* <ImportDriverTypeCylinder
              // product_parse={this.state.product_parse}
              // typeExportCylinder={this.state.typeExportCylinder}
              // listUsersPartner={this.state.listUsersPartner}
              // listUserFixer={this.state.listUserFixer}
              // handleChangeTypeExportCylinderEmpty={() =>
              //   this.handleChangeTypeExportCylinderEmpty
              // }
        /> */}
        <PopupExportOrder
          getListProducts={this.getListProducts}
          selectedOrderInfor={this.state.selectedOrderInfor}         
          handleInput={this.handleInputValue}
          handleInput1={this.handleInputValue1}
          
        />
        
        <PopupDriverExportOrder
          product_parse={this.state.product_parse}
          selectedOrderIDs={this.state.selectedOrderIDs}
          selectedOrderInfor={this.state.selectedOrderInfor}
          ShippingTextDetail = {this.state.ShippingTextDetail}  
        />        
      </div>
    );
  }
}
export default withNamespaces()(UpdateOrder);