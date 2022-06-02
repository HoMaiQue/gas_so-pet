import React, { Component } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Table,
  Icon,
  TimePicker,
  Radio,
  Switch,
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
import { CREATEORDER, GETALLORDER } from "./../../../config/config";
import callApi from "./../../../util/apiCaller";
import required from "required";
import { GETTYPECUSTOMER } from "../../../config/config";
// import { GETTYPECUSTOMER } from '../../../config/config';
import getListBranchAPI from "./../../../../api/getListBranchAPI";
import { withNamespaces } from "react-i18next";
const { Option } = Select;
const provinceData = ["CYL12KG", "CYL12KGCO", "CYL45KG", "CYL50KG"];
const colorData = {
  CYL12KG: ["GRAY", "RED", "YELLOW"],
  CYL12KGCO: ["Shell", "VT", "Petro", "ORANGE"],
  CYL45KG: ["GRAY"],
  CYL50KG: ["GRAY"],
};
const vandata = {
  CYL12KG: ["POL"],
  CYL12KGCO: ["COMPACT"],
  CYL45KG: ["POL","2 VAN"],
  CYL50KG: ["POL", "2 VAN"],
};
class CreateOrder extends Component {
  constructor(props) {
    super(props);
    this.options = [];
    this.state = {
      Loading: false,
      arrayLength: 1,
      options: [],
      options3: [],
      options1: [],
      options2: [],
      cities1: colorData[provinceData[0]],
      cities2: vandata[provinceData[0]],
      color: colorData[provinceData[0]][0],
      valve: vandata[provinceData[0]][0],
      checkDeliveryTime: false,
      // secondCity1: '',
      name: "",
      agencyId: "",
      customerId: "",
      invoiceAddress: "",
      cylinderType: "",
      listUsers: [],
      open: false,
      checkCongtyCon: 1,
      // value: 1,
      listconttycon: "",
      distributionAgent: "",
      restaurantBuilding: "",
      industrialCustomers: "",
      listBrand: [],
      startHour: new Date(),
      startDate: new Date(),
      listUsersGeneral: [],
      listUsersAgency: [],
      listCompany: [],
      listUserFixer: [],
      // listUserFixer: [],
      valueCompany: "",
      expected_DeliveryTime: "",
      // expected_DeliveryDate: '',
      // valueColor:"",
      color: "",
      valve: "",
      maDH: "",
      countOrder: 0,
      tokenAPI: "",
      statusOrder: "init",
      idAccount: "",
      searchText: "",
      searchedColumn: "",
      listAllOrder: [],
      idCustomer: "",
      idBranch: "",
      option: [],
      option1: [],
      option2: [],
      // listCylinder: '',
      note: "",
      customerCode: "",
      agencyCode: "",
      warehouseId: "",
      orderId: "",
      orderCode: "",
      date: "",
      time: "",
      listUserCustomer: [],
      listUsersAgencyCustomer: [],
      listUsersRestaurantCustomer: [],
      valueCompeny: "",
      // secondCity2: '',
      listCylinder: [
        {
          cylinderType: "",
          valve: "",
          color: "",
          numberCylinders: "",
        },
      ],
      isSelectedDistribution: false,
      agencyIdCheck:false,
      handleChangeHourCheck: false,
    };
  }

  handleProvinceChange = (value, index) => {
    const val = [...this.state.listCylinder];
    (val[index].cylinderType = value),
      // console.log('sds', value)
      this.setState({
        cities1: colorData[value],
        cities2: vandata[value],
        color: colorData[value][1],
        valve: vandata[value][1],
        cylinderType: value,
      });
  };

  handleAgencyChange = (e, index) => {
    const val = [...this.state.listCylinder];
    // if (e.target.name === "cylinderType") {
    //   val[index].cylinderType = e.target.value;
    // }
    // else if (e.target.name === "valve") {
    //   val[index].valve = e.target.value;
    // }
    // else if (e.target.name === "color") {
    //   val[index].color = e.target.value;
    // }
    // else {
    val[index].numberCylinders = e.target.value;
    // }
    this.setState({
      listCylinder: val,
      // color: value,
      // valve: value,
      // cities1: colorData[value],
      // cities2: vandata[value],
      // color: colorData[value][1],
      // valve: vandata[value][1],
      // cylinderType: value,
      countOrder: e.target.value,
    });
  };
  onSecondCityChange1 = (value, index) => {
    const val = [...this.state.listCylinder];
    //console.log("citt1",this.state.cities1);
    //console.log("citt1",this.state.cities2);
    (val[index].color = value),
      // console.log('color', value)
      this.setState({
        color: value,
        listCylinder: val,
      });

  };
  onSecondCityChange2 = (value, index) => {
    const val = [...this.state.listCylinder];
    val[index].valve = value;
    // val[index].valve = value,
    // console.log('valve', value)

    this.setState({
      valve: value,
      listCylinder: val,
    });
  };
  handleAddClick = (e) => {
    this.setState(
      {
        listCylinder: [
          ...this.state.listCylinder,
          { cylinderType: "", valve: "", color: "", numberCylinders: "" },
        ],
      },
      () => {
        // console.log('minh', this.state.listCylinder)
      }
    );
  };
  handleDelClick = (e) => {
    // const emptyListCylinder = (item) => {
    //   if (
    //     item.numberCylinders !== "" ||
    //     item.color !== "" ||
    //     item.valve !== "" ||
    //     item.cylinderType !== ""
    //   ) {
    //     console.log("item",item.numberCylinders);
    //     return true;
    //   }
    // };
    // console.log("emptyListCylinder",emptyListCylinder);
		const listCylinder1 = {
			color: "",
			cylinderType: "",
			numberCylinders: "",
			valve: "",
		};
    console.log("emptyListCylinder",this.state.listCylinder);
    // const filterListCylinder = this.state.listCylinder.filter(
    //   listCylinder1
    // );
    const data = this.state.listCylinder;
    // filter(order => {
    //   return order.color === '' && order.cylinderType==='' && order.valve==='' && order.numberCylinders==''
    // })
    data.splice(data.length-1, 1);
    this.setState({
      listCylinder: data,
    });
  };
  onChangeCurrent = async (e) => {
    // console.log('radio checked', e.target.value);
    e.preventDefault();
    // await this.getListBr("");
    
    await this.setState(
      {
        value: e.target.value,
        customerId: "",
        listBrand :[],
				agencyId: "",
      },
      () => {
        // console.log('duc', this.state.value)
      }
    );
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
        // listconttycon: '',
        // doitac: '',
        distributionAgent: "",
        restaurantBuilding: "",
        industrialCustomers: "",
        isSelectedDistribution: false,
        idCustomer: "",
      });
    }
  };

  handleOpenChange = (open) => {
    this.setState({ open });
  };

  handleClose = () => this.setState({ open: false });

  refresh() {
    this.forceUpdate(async () => {
      await this.getAllUser();
      //this.setState({userEdit:{}});
    });
  }
  async componentDidMount() {
    // await this.getAllUserGeneral();
    // await this.getAllUserAGENCY();
    await this.getListFixer();
    await this.onChangeTitle();
    // await this.getAllUser();
    let user_cookies = await getUserCookies();
    //console.log(user_cookies.user.id);
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    this.setState({
      listCompany: [
        // ...this.state.listUsersGeneral,
        // ...this.state.listUsersAgency,
        ...this.state.listUserFixer,
      ],

      user_type: user_cookies.user.userType,
      tokenAPI: token,
      idAccount: id,
    });
    this.getAllOrder(id, token);
    this.getRestaurantCustomer(id, token);
    this.getDistributionAgencyCustomer(id, token);
    this.getIndustryCustomer(id, token);
  }

  // async getAllUserGeneral() {
  //   const dataUsers = await getAllUserApi(Constants.GENERAL);
  //   if (dataUsers) {
  //     if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
  //       this.setState({ listUsersGeneral: dataUsers.data });
  //     } else {
  //       showToast(
  //         dataUsers.data.message
  //           ? dataUsers.data.message
  //           : dataUsers.data.err_msg,
  //         2000
  //       );
  //     }

  //     //this.setState({image_link: profile.data.company_logo});
  //   } else {
  //     showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
  //   }
  // }
  // async getAllUserAGENCY() {
  //   const dataUsers = await getAllUserApi(Constants.AGENCY);
  //   if (dataUsers) {
  //     if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
  //       this.setState({ listUsersAgency: dataUsers.data });
  //     } else {
  //       showToast(
  //         dataUsers.data.message
  //           ? dataUsers.data.message
  //           : dataUsers.data.err_msg,
  //         2000
  //       );
  //     }

  //     //this.setState({image_link: profile.data.company_logo});
  //   } else {
  //     showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
  //   }
  // }
  // async getListFixer() {
  //   const dataUsers = await getDestinationUserAPI(
  //     Constants.FACTORY,
  //     "",
  //     Constants.OWNER
  //   );
  //   console.log('ssd', dataUsers)
  //   if (dataUsers) {
  //     console.log('sdusdsd', listUserFixer)
  //     if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
  //       this.setState({ listUserFixer: dataUsers.data });
  //     } else {
  //       showToast(
  //         dataUsers.data.message
  //           ? dataUsers.data.message
  //           : dataUsers.data.err_msg,
  //         2000
  //       );
  //     }

  //     //this.setState({image_link: profile.data.company_logo});
  //   } else {
  //     showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
  //   }
  // }
  getAllOrder = async (id, token) => {
    let user_cookies = await getUserCookies();
    let parmas = {
      orderCreatedBy: user_cookies.user.id,
    };
    await callApi("POST", GETALLORDER, parmas, token).then((res) => {
      let temp = [];
      // console.log("data order", res.data);
      let i = 0;
      for (let item of res.data.order) {
        temp.push({
          key: i,
          orderCode: item.orderCode,
          customerId: item.customerId ? item.customerId : "no name",
          agencyId: item.agencyId,
          // warehouseId: item.warehouseId
          valve: item.valve ? item.valve : "no name",
          color: item.color ? item.color : "no name",
          // time: moment(item.time).format("HH:mm:ss"),
          cylinderType: item.cylinderType ? item.cylinderType : "no name",
          // listCylinder: item.listCylinder,
          // listCylinder: item.listCylinder,
          note: item.note,
          status: item.status === "INIT" ? "Khởi tạo" : item.status,

          // idCustomer: item.idCustomer.name,
          // idBranch: item.idBranch.name,
          numberCylinders: item.numberCylinders,
          warehouseId: item.warehouseId ? item.warehouseId : "no name",
          // date: moment(item.orderDate).format("DD/MM/YYYY"),
          expected_DeliveryDate: item.expected_DeliveryDate,
          // expected_DeliveryDate: moment(item.expected_DeliveryDate).format("DD/MM/YYYY"),
          expected_DeliveryTime: moment(item.expected_DeliveryTime).format(
            "HH:mm:ss"
          ),
          // status: item.status === "INIT" ? "Khởi tạo" : item.status,
        });
        i++;
      }
      this.setState({
        listAllOrder: temp,
      });
    });
  };
  onChangeCompany = async (value) => {
    // console.log(this.state.warehouseId)
    this.setState(
      {
        warehouseId: value,
      }
      // () => {
      //   let index = this.state.listCompany.findIndex(
      //     (company) => company.id === this.state.valueCompany
      //   );
      //   this.setState({
      //     address: this.state.listCompany[index].address,
      //   });
      // }
    );
  };
  onChangeCompanyFilterProp = async (value) => {
    // console.log(this.state.warehouseId)
    
    this.setState(
      {
        customerId: value,
      }
      // () => {
      //   let index = this.state.listCompany.findIndex(
      //     (company) => company.id === this.state.valueCompany
      //   );
      //   this.setState({
      //     address: this.state.listCompany[index].address,
      //   });
      // }
    );
    await this.getListBr(value);
    console.log("dang test cho nay: ", this.state.listCompany)
  };

  selectOptionHandler = (e) => {
    // console.log('duc', e.target.value)
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]: value,
    });
  };

  onChangeTitle = (e) => {
    // console.log('madonhang', e.target.value)
    let date = new Date();
    let formattedDate = moment(date).format("DDMMYYYY");
    let dateString1 = formattedDate.toString().slice(0, 4);
    let dateString2 = formattedDate.toString().slice(6, 8);
    let dateString=dateString1+dateString2;
    let dateNowString = Date.now().toString().slice(7, 13);
    let madonhang = ("DH" + dateString + "-" + dateNowString).toString();
    this.setState({
      maDH: madonhang,
    });
  };

  // onChangeCountOrder = (e) => {
  //   console.log('sssd', e.target.value)
  //   this.setState({
  //     countOrder: e.target.value,
  //   });
  // };

  onChangeCommon = (e) => {
    // console.log('note', e.target.value)
    this.setState({
      // listCylinder: e.target.value
      note: e.target.value,
    });
  };
  getList() {
    return new Promise(function (resolve) {
      setTimeout(() => resolve([1, 2, 3]), 3000);
    });
  }
  onCreate = async (e) => {
    // alert('sdssd')
    // console.log('onsubmit', this.state)
    let user_cookies = await getUserCookies();
    e.preventDefault();
    let {
      maDH,

      // valueCompany,

      valueCompany,
      // cylinderType,
      idCustomer,
      countOrder,
      note,
      startDate,
      startHour,
      idAccount,
      listAllOrder,
      invoiceAddress,
      customerId,
      agencyId,
      warehouseId,
      orderId,
      orderCode,
      date,
      time,
      idBranch,

      cylinderType,
      valve,
      color,

      userId,
      sumnumber,
      numberCylinder,
      listCylinder,
    } = this.state;

    let dateNow = new Date();
    let dateChose = startDate;
    let d1 = Date.parse(dateNow);
    let d2 = Date.parse(dateChose);
    // console.log('madon', maDH);
    // console.log('sds', customerId)
    // console.log('valuecompu', valueCompany);
    // console.log('nemuber', countOrder);
    // console.log('gio', startDate);
    // console.log('common', note);
    // console.log('agencyiD', agencyId);
    // console.log('cylinderType', cylinderType);
    // console.log('valve', valve);
    // console.log('color', color)
    // console.log('starthours', startHour)
    // if (!maDH || !valueCompany  || !startDate || !cylinderType || !note || !agencyCode ||  !valve || !color || !startHour || !customerCode) {
    // if (!maDH || !valueCompany || !listCylinder || startDate || !sumnumber || !note || !agencyCode || !startHour || !customerCode) {

    //   alert("Vui lòng nhập đầy đủ thông tin");
    // }
    // else
    //console.log('sds')
    // if (maDH && valueCompany && startDate && listCylinder && sumnumber && note && agencyCode && startHour && customerCode)
    // // if (maDH && valueCompany && countOrder && cylinderType && listCylinder && startDate && agencyCode && startHour && numberCylinder && orderHour && color && valve && countOrder && comment && customerCode)
    // {
    console.log("valve", valve);
    console.log("color", color);
    console.log("cylinderType", cylinderType);
    console.log("countOrder", countOrder);

		if (
			!valve ||
			!color ||
			cylinderType === "" ||
			!countOrder ||
			customerId === this.props.t("CHOOSE") ||
			customerId === "" ||
			warehouseId === ""
		) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return false;
    }

    let index = await listAllOrder.findIndex(
      (order) => order.orderCode === maDH
    );
    // console.log('sdsere', index)
    if (moment(d2).format("YYYY-MM-DD") < moment(d1).format("YYYY-MM-DD")) {
      alert("Ngày bạn chọn phải lớn hơn hoặc bằng ngày hiện tại");
    } else if (
      moment(d2).format("YYYY-MM-DD") >= moment(d1).format("YYYY-MM-DD")
    ) {
      console.log("new Date(startHour.toISOString()",startDate);
      let date = moment(startDate).format("YYYY-MM-DD");
      // console.log("date", date);
      //       console.log("new Date(startHour.toISOString()",new Date(startHour.toISOString()));

      if (index === -1) {
        if(this.state.handleChangeHourCheck===true){
					let _time =
						this.state.checkDeliveryTime === false ? " " : this.state.startHour;
          // console.log("time2222222",typeof this.state.startHour);
          this.setState({
						startHour: _time,
          });
          // const _time = this.state.checkDeliveryTime === false? " " : new Date(startHour.toISOString());           
					console.log("time2222222", _time);
          // const hour =
          //   this.state.checkDeliveryTime === false ? "" : _time.getHours();
          // const minute =
          //   this.state.checkDeliveryTime === false ? "" : _time.getMinutes();
        }else if(this.state.handleChangeHourCheck===false){
					const _time =
						this.state.checkDeliveryTime === false ? " " : this.state.startHour;
					console.log("time2222222", _time);
					const hour =
           this.state.checkDeliveryTime === false ? "" : _time.getHours();
          const minute =
           this.state.checkDeliveryTime === false ? "" : _time.getMinutes();
					let startHourBegin =
						this.state.checkDeliveryTime === false ? "" : hour + ":" + minute;
       
          this.setState({
						startHour: startHourBegin,
          });
        }
        this.setState({
          handleChangeHourCheck:false,
        });

        let createOrder = {
          // invoiceAddress: invoiceAddress,
          orderCode: maDH,
          agencyId: agencyId,
          // warehouseId: warehouseId,
          // time: time,

          customerId: customerId,
          warehouseId: warehouseId,
          // listCylinder: listCylinder,
          // Typecylinder: cylinderType,

          note: note,

          listCylinder: listCylinder,

          // status: status,
          // numberCylinders: numberCylinders,
          // nameCopany: nameCopany,

          expected_DeliveryDate: date,
          expected_DeliveryTime: this.state.startHour,
          // createdBy: idAccount,startHour
        };

        console.log("creatde", createOrder);
        console.log("time", this.state.startHour);

        let parmas = {
          createOrder,
          userId: user_cookies.user.id,
        };
        this.setState({ Loading: true });
        //console.log('ca;;', callApi)
        await callApi("POST", CREATEORDER, parmas, this.state.tokenAPI)
          .then(
            // console.log('ca;;', callApi),
            (res) => {
              console.log("Tao don hang", res);
              // console.log('CREATEORDER', res)
              if (res.data.success === true) {
                this.setState({ 
                  Loading: false,
                  note : "",
                  color:"",
                  listCylinder: [
										{
											color: "",
											cylinderType: "",
											numberCylinders: "",
											valve: "",
										},
									],
                  startDate: new Date(),
                  startHour: new Date(),
                  agencyId :"", 
									checkDeliveryTime: false,
                 });            
                alert("Tạo thành công");
                this.getAllOrder(this.state.idAccount, this.state.tokenAPI);
              } else {
                alert("Tạo thất bại: " + res.data.message);
              }

              // this.getAllOrder(this.state.idAccount, this.state.tokenAPI);
              // window.location.reload()
            }
          )
          .catch((err) => {
            console.log(err);
            alert("Gặp lỗi khi tạo đơn hàng");
          });
      } else {
        alert("Mã đơn hàng đã bị trùng vui lòng nhập lại");
      }
    } else {
      alert("Mã đơn hàng đã bị trùng vui lòng nhập lại");
    }
    // }
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
  handleChangeDate = (date) => {
    // console.log('ngày', date)
    this.setState({
      startDate: date,
    });
  };

  handleChangeHour = (time) => {
    console.log("gio", time);
    const _time = new Date(time.toISOString());
    const hour = _time.getHours();
    const minute = _time.getMinutes();
    
    this.setState({
      startHour: hour + ":" + minute,
      handleChangeHourCheck: true,
    });
  };

  async getListFixer() {
    const dataUsers = await getDestinationUserAPI(
      Constants.FACTORY,
      "",
      Constants.OWNER
    );
    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        // console.log('getListFixer', dataUsers);
        let listFactoryBacks = [];
        for (let i = 0; i < dataUsers.data.length; i++) {
          listFactoryBacks.push({
            value: dataUsers.data[i].id,
            label: dataUsers.data[i].name,
            ...dataUsers.data[i],
          });
        }

        this.setState({ listUserFixer: listFactoryBacks });
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

  async getListBr(id) {
    // console.log(" vao getlistbr");
    // console.log("id ", id);
    const dataApi = await getListBranchAPI(id);
    // console.log("data", dataApi);
    if (dataApi.data.success) {
      this.setState({
        listBrand: dataApi.data.data,
        customerId: id,
      });
    } else {
      this.setState({
        customerId: id,
      });
    }
  }

  onhandClick = async (e) => {
    // alert('sdsdsd');
    // console.log(e.target)

    await this.getListBr(e.target.value);
    await this.setState({
      // distributionAgent: e.target.value,
      // restaurantBuilding: e.target.value,
      // industrialCustomers: e.target.value,
      // customerId: id
    });
  };

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
                name:user.name,
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
                name:user.name,
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
      // console.log("khach hang dai ly", res.data);
      if (res.data) {
        // console.log("khach hang dai ly", res.data);
        if (res.data.success === true) {
          // console.log("khach hang dai ly", res.data);
          this.setState({
            options2: res.data.data.map((user) => {
              return {
                value: user.id,
                label: user.customerCode,
                name:user.name,
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

  // async getAllUser() {
  //   //const jobMetaData = await this.getJobMetaData();
  //   const dataUsers = await getAllUserApi(Constants.GENERAL);
  //   if (dataUsers) {
  //     console.log('sdd', dataUsers)
  //     if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
  //       this.setState({
  //         listUsers: dataUsers.data,
  //         listUsersBackUp: dataUsers.data
  //       });
  //       this.setState({
  //         options1: dataUsers.data.map((user) => {
  //           return {
  //             value: user.id,
  //             label: user.customerCode,
  //           }
  //         })
  //       })
  //     } else {
  //       showToast(
  //         dataUsers.data.message
  //           ? dataUsers.data.message
  //           : dataUsers.data.err_msg,
  //         2000
  //       );
  //     }
  //     //this.setState({image_link: profile.data.company_logo});
  //   } else {
  //     showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
  //   }
  // }

  onradioChange = (e) => {
    e.preventDefault();
    this.setState({
      distributionAgent: e.target.value,
      restaurantBuilding: e.target.value,
      industrialCustomers: e.target.value,
    });
  };
  onChangeIdBranch = (e) => {
    e.preventDefault();
    this.setState({
      idBranch: e.target.value,
    });
  };
  onChangeChinhanh = (e) => {
    // console.log('mchinhanh', e.target.value)
    this.setState({
      agencyId: e.target.value,
    });
  };
  handleDataChange = (checkDeliveryTime) => {
    this.setState({ checkDeliveryTime: checkDeliveryTime });
  };
  render() {
    const { loadings,Loading } = this.state;
    let {
      name,
      listCylinder,
      agencyId,
      note,
      invoiceAddress,
      cities1,
      customerId,
      cities2,
      maDH,
      idCustomer,
      idBranch,
      maCN,
      maKh,
      countOrder,
      comment,
      listAllOrder,
      selectedRowKeys,
      isSelectedDistribution,
    } = this.state;
    const defaultPageSize = {
      defaultPageSize: 10,
    };
    const columns = [
      {
        title: "Mã ĐH",
        dataIndex: "orderCode",
        key: "orderCode",
        ...this.getColumnSearchProps("orderCode"),
      },
      {
        title: "Mã khách hàng",
        dataIndex: "customerId",
        key: "customerId",
        ...this.getColumnSearchProps("customerId"),
      },
      {
        title: this.props.t("AGENCY_ID"),
        dataIndex: "agencyId",
        key: "agencyId",
        ...this.getColumnSearchProps("agencyId"),
      },
      {
        title: "Số lượng",
        dataIndex: "numberCylinders",
        key: "numberCylinders",
        ...this.getColumnSearchProps("numberCylinders"),
      },
      {
        title: "Mã kho",
        dataIndex: "warehouseId",
        key: "warehouseId",
        ...this.getColumnSearchProps("warehouseId"),
      },
      // {
      //   title: "Ngày bảo trì",
      //   dataIndex: "maintenanceDate",
      //   key: "maintenanceDate",
      //   ...this.getColumnSearchProps("maintenanceDate"),
      // },
      {
        title: "Ngày giao hàng",
        dataIndex: "expected_DeliveryDate",
        key: "expected_DeliveryDate",
        ...this.getColumnSearchProps("expected_DeliveryDate"),
      },
      {
        title: "Giờ giao",
        dataIndex: "expected_DeliveryTime",
        key: "expected_DeliveryTime",
        ...this.getColumnSearchProps("expected_DeliveryTime"),
      },
      // {
      //   title: "Loại bình",
      //   dataIndex: "cylinderType",
      //   key: "cylinderType",
      //   ...this.getColumnSearchProps("cylinderType")
      // },
      // {
      //   title: "Màu Sắc",
      //   dataIndex: "color",
      //   key: "color",
      //   ...this.getColumnSearchProps("color")
      // },
      // {
      //   title: "Loại van",
      //   dataIndex: "valve",
      //   key: "valve",
      //   ...this.getColumnSearchProps("valve")
      // },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        ...this.getColumnSearchProps("status"),
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
        ...this.getColumnSearchProps("note"),
      },
    ];
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };
    const { value } = this.state;
    //console.log(this.state.valueCompany);
    return (
      <div className="main-content">
        <div className="card">
          <div className="card-title">
            <h4>{this.props.t("CREATE_NEW_ORDER")}</h4>
          </div>
          <div>
            <Row>
              <Col xs={1}></Col>
              <Col xs={22}>
								<Form id="create-course-form">
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
                            width: "300px",
                            height: "170px",
                          }}
                        >
                          <Radio.Group
                            onChange={this.onChangeCurrent}
                            className=""
                            style={{
                              width: "400px",
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
                                  width:"100%"
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
                    <Col xs={4}></Col>
                    <Col xs={14} md={6}>
											{Loading === false ? (
                        <Form.Item
                        label={this.props.t("AGENCY_ID")}
                        style={{ display: "block", width: "200px" }}
                        onChange={this.onChangeChinhanh}
                      >
                        <select
                          className="custom-select"
                          // onChange={this.onChangeIdBranch}
                          disabled={isSelectedDistribution}
                          id="agencyId"
                          name="agencyId"
                          onChange={this.onChangeChinhanh}
                          value={agencyId}
                        >
                          <option selected>{this.props.t("CHOOSE")}</option>
                          {
                            // console.log('this.state.listBrand', this.state.listBrand),
                            this.state.listBrand.length > 0
                              ? this.state.listBrand.map((one, index) => {
                                  return (
                                    <option key={index} value={one.id}>
                                      {one.agencyCode}
                                    </option>
                                  );
                                })
                              : ""
                            // this.state.listBrand.map((one, index) => {
                            //   <option key={index} value={one.address}>{one.address}</option>
                            // })
                          }
                        </select>
                        {/* <Input value={invoiceAddress} /> */}
                        {/* <Select
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
                    </Select> */}
                        {/* <Input onChange={this.onChangeChiNhanh} value={maCN} /> */}
                      </Form.Item>
											) : (
                        <Form.Item
                        label={this.props.t("AGENCY_ID")}
                        style={{ display: "block", width: "200px" }}
                      >
                      <Input
                              className="input"
                              value=""
                            // onChange={this.onChangeCountOrder}
                      />
                      </Form.Item>
                      )}
                    </Col>
                    <Col xs={2}></Col>
                    <Col xs={14} md={6}>
                      {Loading===false?(
                        <Form.Item
                        label={this.props.t("EXPORT_WAREHOUSE")}
                        style={{ display: "block", width: "200px" }}
                      >
                        <Select
                          placeholder={this.props.t("CHOOSE")}
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
                      ):(
                        <Form.Item
                        label={this.props.t("EXPORT_WAREHOUSE")}
                        style={{ display: "block", width: "200px" }}
                      >
                        <Select
                          placeholder={this.props.t("CHOOSE")}
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
                      )}
                    </Col>
                  </Row>

                  {/* <Col xs={2}></Col>
                  <Col xs={24} md={11}>
                  <Form.Item label="Ngày tạo" style={{ display: "block" }}>
                    <DatePicker
                      selected={moment(this.state.startDate)}
                      onChange={this.handleChangeDate}
                      dateFormat="DD/MM/YYYY"
                      // readOnly={true}
                    />
                  </Form.Item>
                  </Col> */}
                  {/* </Row> */}

                  <Row style={{ paddingTop: "20px" }}>
                    {/* <Col xs={2}></Col> */}
                    <Col xs={14} md={5}>
                      <Form.Item
                        label={this.props.t("ORDER_ID")}
                        style={{ display: "block", width: "200px" }}
                      >
                        <Input onChange={this.onChangeTitle} value={maDH} />
                      </Form.Item>
                    </Col>
                    <Col xs={2}></Col>
                    <Col xs={14} md={5}>
                      <Form.Item
                        label={this.props.t("DELIVERY_DATE")}
                        style={{ width: "200px" }}
                      >
                        {Loading === false ? (
                          <DatePicker
                            // selected={moment(this.state.startDate)}
                            defaultValue={moment()}
                            onChange={this.handleChangeDate}
                            //dateFormat="DD/MM/YYYY"
                            format="DD/MM/YYYY"
                            style={{ width: "260px" }}
                          // readOnly={true}
                          />
                        ) : (
													<Input className="input" value=""></Input>
                          )}

                        {/* <div className="input-group"
                          style={{ display: "flex", flexWrap: "nowrap" }}
                        >
                          <Input style={{ width: '80px' }} ref={this.expiration_dateRef} type="text"
                            className="form-control"
                            // value={this.state.checkedDate}
                            // autocomplete="off"
                            selected={moment(this.state.startDate)}
                            defaultValue={moment()}
                            onChange={this.handleChangeDate}
                            dateFormat="DD/MM/YYYY"
                            // format="DD/MM/YYYY"
                            className="date"
                            validations={[required]}
                            name="checkedDate" id="checkedDate"
                            data-date-format="dd/mm/yyyy"
                            data-provide="datepicker" />
                          <div className="input-group-append">
                            <span className="input-group-text">
                              <i className="fa fa-calendar"></i>
                            </span>
                          </div>
                        </div> */}
                      </Form.Item>
                    </Col>
                    <Col xs={2}></Col>
                    <Col xs={14} md={8}>
                      <Form.Item label={this.props.t("DELIVERY_TIME")}>
                        <Row>
                          <Col md={4}>
                            <Switch
                              checked={this.state.checkDeliveryTime}
                              onChange={this.handleDataChange}
                            />
                          </Col>
                          <Col md={12}>
                            {this.state.checkDeliveryTime === false ? (
                              ""
                            ) : (
                              <TimePicker
                                open={this.state.open}
                                selected={moment(this.state.startHour)}
                                defaultValue={moment()}
                                onChange={this.handleChangeHour}
                                format="HH:mm"
                                minuteStep={1}
                                onOpenChange={this.handleOpenChange}
                                className="time"
                                style={{ width: "200px", fontWeight: "bold" }}
                                renderExtraFooter={() => (
                                  <Button
                                    size="small"
                                    type="primary"
                                    onClick={this.handleClose}
                                  >
                                    Ok
                                  </Button>
                                )}
                              />
                            )}
                          </Col>
                        </Row>
                      </Form.Item>
                    </Col>
                  </Row>
                  <div className="border_form">
                    {listCylinder.map((item, index) => (
                      <div className="chon" id="modal_form" key={index}>
                        <Row>
                          <Col xs={14} md={5}>
                            {Loading===false?(
                              <Form.Item
                              label={this.props.t("CYLINDER_TYPE")}
                              style={{ display: "block", width: "200px" }}
                            >
                              <Select
                                class="custom-select custom-select-lg mb-3"
                                name="cylinderType"
                                id="cylinderType"
                                placeholder={this.props.t("CHOOSE")}
                                onChange={(e) =>
                                  this.handleProvinceChange(e, index)
                                }
                                validations={[required]}
                              >
                                <Option
                                  value=""
																		style={{
																			color: "rgba(125, 125, 125, 0.7)",
																		}}
                                >
                                  Bỏ chọn
                                </Option>
                                {provinceData.map((province) => (
                                  <Option key={province}>{province}</Option>
                                ))}
                              </Select>
                            </Form.Item>
                            ):(
                              <Form.Item
                              label={this.props.t("CYLINDER_TYPE")}
                              style={{ display: "block", width: "200px" }}
                            >
																<Input className="input" value=""></Input>
                            </Form.Item>
                            )}
                          </Col>

                          <Col
                            xs={12}
                            md={5}
                            style={{ display: "block", width: "200px" }}
                          >
                            {Loading===false ?(
                              <Form.Item
                              label={this.props.t("VALVE_TYPE")}
                              style={{ display: "block", width: "200px" }}
                            >
                              <Select
                                class="custom-select custom-select-lg mb-3"
                                name="valve"
                                id="valve"
                                placeholder={this.props.t("CHOOSE")}
                                onChange={(e) =>
                                  this.onSecondCityChange2(e, index)
                                }
                                // onChange={this.onSecondCityChange2}

                                validations={[required]}
                              >
                                <Option
                                  value=""
																		style={{
																			color: "rgba(125, 125, 125, 0.7)",
																		}}
                                >
                                  Bỏ chọn
                                </Option>
                                {cities2.map((city) => (
                                  <Option key={city}>{city}</Option>
                                ))}
                              </Select>
                            </Form.Item>
                            ):(
                              <Form.Item
                              label={this.props.t("VALVE_TYPE")}
                              style={{ display: "block", width: "200px" }}
                            >
                              <Input
                                className="input"
                                value=""
                                // onChange={this.onChangeCountOrder}
                              />
                            </Form.Item>
                            )}
                          </Col>
                          <Col xs={2}></Col>
                          <Col xs={12} md={5}>
                          {Loading===false?(
                            <Form.Item label={this.props.t("COLOR")}>
                            <Select
                              class="custom-select custom-select-lg mb-3"
                              name="color"
                              id="color"
                              placeholder={this.props.t("CHOOSE")}
                              // value={color}
                              onChange={(e) =>
                                this.onSecondCityChange1(e, index)
                              }
                              // onChange={this.onSecondCityChange1}

                              validations={[required]}
                              style={{ width: "200px" }}
                            >
                              <Option
                                value=""
																		style={{
																			color: "rgba(125, 125, 125, 0.7)",
																		}}
                              >
                                Bỏ chọn
                              </Option>
                              {cities1.map((city) => (
																		<Option key={city}>
																			{this.props.t(city)}
																		</Option>
                              ))}
                            </Select>
                          </Form.Item>
                          ):(
															<Form.Item label={this.props.t("COLOR")}>
                              <Input
                                className="input"
                                value=""
                                // onChange={this.onChangeCountOrder}
                              />
                            </Form.Item>
                          )}                              
                          </Col>
                          
                          <Col xs={12} md={5}>
                          {Loading===false ? (
                            <div className="form-group">
                            <Form.Item
                              label={this.props.t("NUMBER_CYLINDERS")}
                              style={{ display: "block", width: "200px" }}
                            >
                              <Input
                                className="input"
                                type="number"
                                id="countOrder"
                                name="countOrder"
                                // value={item.countOrder}
                                // onChange={this.onChangeCountOrder}
                                onChange={(e) =>
                                  this.handleAgencyChange(e, index)
                                }
                              />
                            </Form.Item>
                          </div>
                            ):(
                              <div className="form-group">
                            <Form.Item
                              label={this.props.t("NUMBER_CYLINDERS")}
                              style={{ display: "block", width: "200px" }}
                            >
                              <Input
                                className="input"
                                type="number"
                                id="countOrder"
                                name="countOrder"
                                value=""
                                // onChange={this.onChangeCountOrder}
                              />
                            </Form.Item>
                          </div>
                            )}                            
                          </Col>
                          {/* <Col>
                          <div className="">
                          <a className="btn btn-danger del" id="duy"
                              onClick={
                                (e) => {
                                  this.handleDelClick(e, index)
                                }
                              }
                            ><i className="fa fa-minus"></i></a>
                          </div>
                        </Col> */}
                        </Row>
                      </div>
                    ))}
                    {/* <div className="form-group">
                        <button
                          style={{ marginRight: "5px" }}
                          type="button"
                          class="btn btn-success"
                          onClick={e => this.handleAddClick(e)}
                        >Thêm chi nhánh
                                  </button>
                      </div> */}
                    {/* <FormCreate  
                  /> */}
                    {/* ahihiiiiiiiii */}
                    <div className="widthAdd">
                      <a
                        className="btn btn-danger long"
                        id="duy"
                        onClick={(e) => {
                          // this.handleAddClick(e)
                          // this.setState({
                          //   arrayLength: this.state.arrayLength + 1,
                          // listCylinder: [...this.state.listCylinder, { cylinderType: "", valve: "", color: "", numberCylinder: "" }]
                          this.handleAddClick(e);
                          // });
                          // this.gethandclick
                        }}
                      >
                        <i className="fa fa-plus"></i>
                      </a>
                      <a
                        className="btn btn-danger del"
                        id="duy"
                        onClick={(e) => {
                          this.handleDelClick(e);
                        }}
                      >
                        <i className="fa fa-minus"></i>
                      </a>
                      <span style={{ color: "rgb(255,99,71)" }}>
                        {this.props.t("PLEASE_CHOOSE_FOR_DEL")}
                      </span>
                    </div>
                  </div>
                  {/* ahihiiiiiiiii */}

                  <Row>
                    <Col xs={1} md={8}></Col>
                    <Col xs={22} md={8}>
                     {Loading===false ? (
                      <Form.Item label={this.props.t("NOTE")}>
                        <div class="form-group">
                          <textarea
                            class="form-control"
                            rows="2"
                            id="comment"
                            value={note}
                            name="comment"
                            onChange={this.onChangeCommon}
                          ></textarea>

                          {/* <textarea class="form-control" rows="2" id="comment" value={common} onChange={this.onChangeCommon} name="common"></textarea> */}
                        </div>
                      </Form.Item> 
                     ):(
                      <Form.Item label={this.props.t("NOTE")}>
                        <div class="form-group">
                          <textarea
                            class="form-control"
                            rows="2"
                            id="comment"
                            value={note}
                            name="comment"
                          ></textarea>
                          {/* <textarea class="form-control" rows="2" id="comment" value={common} onChange={this.onChangeCommon} name="common"></textarea> */}
                        </div>
                      </Form.Item>
                     )}                       
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={1} md={8}></Col>
                    <Col xs={22} md={8}>
                      <Form.Item>
                        <Button
                          style={{ width: "100%", backgroundColor: "#ED383C" }}
                          type="primary"
                          htmlType="submit"
                          className="login-form-button"
                          onClick={this.onCreate}
                          disabled={this.state.Loading}
                        >
                          {this.state.Loading === true
                            ? "Loading..."
                            : this.props.t("CREATE_ORDER")}
                          {/* {this.props.t("CREATE_ORDER")} */}
                        </Button>
                      </Form.Item>
                    </Col>
                    <Col xs={1} md={8}></Col>
                  </Row>
                  <Row>
                    <Col xs={1}></Col>
                    <Col xs={22}>
                      {/* <Table columns={columns} dataSource={listAllOrder} pagination={defaultPageSize} /> */}
                    </Col>
                    <Col xs={1}></Col>
                  </Row>
                </Form>
              </Col>
              <Col xs={1}></Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
export default withNamespaces()(CreateOrder);
