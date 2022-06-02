import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
//import Select from "react-select";
import SelectMulti from "react-select";

import Button from "react-validation/build/button";
import required from "required";
import Constant from "Constants";
import showToast from "showToast";
//import TagAutocomplete from "TagAutoComplete";
import getUserCookies from "./../../../helpers/getUserCookies";
import getAllUserApi from "getAllUserApi";
import { NAMEDRIVE, GETTYPECUSTOMER, CREATEEXPORTORDERHISTORY } from "./../../../config/config";
// import { GETTYPECUSTOMER } from '../../../config/config';
import callApi from './../../../util/apiCaller';
import { Select, Checkbox, Popconfirm, message,Table } from "antd";
import createHistoryAPI from "createHistoryAPI";
import getListBranchAPI from "./../../../../api/getListBranchAPI";
import openNotificationWithIcon from "./../../../helpers/notification";
import { withNamespaces } from 'react-i18next';
import createShippingOrder from "../../../../api/createShippingOrder"
import getAllProvince from "../../../../api/getAllProvince";
import ReactCustomLoading from "ReactCustomLoading";

const Option = Select.Option;


//var user_cookie = await getUserCookies();
//let token="Bearer " + user_cookie.token,
//"email": user_cookie.user.email,
class PopupDriverExportOrder extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      content: "",
      listProducts: [],
      isShowNumber: false,
      AgencyResults: [],
      GeneralResults: "",
      listExportPlaceData: "",
      listExportPlaceDataID: "",
      driverName: "",
      idDriver: "",
      listDriver: [],
      listDistributionAgency: [],
      listIndustry: [],
      listRestaurant: [],
      typeCustomer: "",
      listCustomer: [],
      CustomerResults: [],
      listIndustryResults:[],
      listBranch: [],
      BranchResults: [],
      display: true,
      checked: false,
      checkedIN: false,
      textDriver: '',
      deliveryDate: "",
      selectedOrderIDs: [],
      customerCode: [],
      listProvince: [

      ],
      dataWarmings: [],
      provinceCode: "",
      idCustomer: "",
      loading: false,
      countProduct:[],
      countProductCustomer:[],
      inputPopconfirm:false,
      inputPopconfirmCustomer:false,
      listDelivery:[],
      sumListDelivery:0,
      countProductParse:0
    };
  }

  handleChangeGeneral = async (e) => {
    await this.setState({
      GeneralResults: e.target.value
    });

    // console.log("id general", this.state.GeneralResults);
    await this.getListBranch(this.state.GeneralResults);
  };

  handleChangeBranch = (langValue) => {
    // console.log("!!!!", langValue);
    this.setState({ BranchResults: langValue });
  };
  handleChangeBranchBegin = (langValue) => {
    // console.log("!!!!", langValue);
    console.log("product_parse",this.props.product_parse);
    let countProduct=this.props.product_parse.length;
    console.log("handleChangeBranchBegin",this.state.checked)
    if (this.state.BranchResults.length >= 1) {
      showToast("Chỉ được chọn một điểm đến!", 3000);
      this.setState({ 
        BranchResults: []
       });
    }
    else {
      this.setState({ 
        BranchResults: langValue,
        countProduct:countProduct
       });
    }
    console.log("product_parse",this.state.countProduct);
  };


  handleChangeCustomer = (langValue) => {
    console.log("product_parse",langValue);
    this.setState({ CustomerResults: langValue });
  };
  handleChangeCustomer1 = (langValue) => {
    if (this.state.CustomerResults.length >= 1) {
      showToast("Chỉ được chọn một tài xế!", 3000);
      this.setState({ CustomerResults: [] });
    }
    else {
      this.setState({ CustomerResults: langValue });
    }

  }
  handleChangeCustomerBegin = (langValue) => {
    let countProduct=this.props.product_parse.length;
    if (this.state.CustomerResults.length >= 1) {
      showToast("Chỉ được chọn một tài xế!", 3000);
      this.setState({ 
        CustomerResults: []
       });
    }
    else {
      this.setState({ 
        CustomerResults: langValue,
        countProductCustomer:countProduct
       });
    }

  }
  
  handleChangeAgency = (langValue) => {
    this.setState({ AgencyResults: langValue });
    // console.log("id agency", this.state.AgencyResults);
  };

  handleChangeDriver = (value) => {
    this.setState({
      idDriver: value,
    });
    console.log("hahaha", value)
  };
  handleTextDriver = (e) => {
    this.setState({
      textDriver: e.target.value,
      idDriver: ''
    })
    console.log("textDriver")
  }
  handleChangeTypeCustomer = (value) => {
    this.setState({
      typeCustomer: value,
    });   
    if( this.state.checked==true && this.state.checkedIN==true && this.state.CustomerResults.length>=0    
       ){
      this.setState({
        CustomerResults:[],
        BranchResults:[],
        GeneralResults:[],
        inputPopconfirm:false,
        inputPopconfirmCustomer:false
      })
    } else if( this.state.checked==true && this.state.checkedIN==true && this.state.BranchResults.length>=0 
      ||this.state.checked==true && this.state.checkedIN==false && this.state.BranchResults.length>=0
      ){
      this.setState({
        BranchResults:[]
      })
    } else if( this.state.checked==true && this.state.checkedIN==true && this.state.GeneralResults.length>=0 
      ||this.state.checked==true && this.state.checkedIN==false && this.state.GeneralResults.length>=0
      ){
      this.setState({
        GeneralResults:[]
      })
    }

  };
  handleChangeListProvince = (value) => {

    this.setState({
      provinceCode: value,
    });
    console.log("handleChangeListProvince", value)

  };

  async getAllCustomer() {
    const dataUsers = await getAllUserApi(Constant.GENERAL);
    if (dataUsers) {
      if (dataUsers.status === Constant.HTTP_SUCCESS_BODY) {
        let listCustomerTemp = [];
        for (let i = 0; i < dataUsers.data.length; i++) {
          listCustomerTemp.push({
            value: dataUsers.data[i].id,
            label: dataUsers.data[i].name,
            ...dataUsers.data[i],
          })
        }
        this.setState({
          listCustomer: listCustomerTemp
        })
      }
      else {
        showToast(
          dataUsers.data.message
            ? dataUsers.data.message
            : dataUsers.data.err_msg,
          2000
        );
      }
    }
    else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  }

  async getDistributionAgencyCustomer(id, token) {
    let reqListCustomer = {
      isChildOf: id,
      customerType: "Distribution_Agency"
    };
    let params = {
      reqListCustomer
    };
    await callApi("POST", GETTYPECUSTOMER, params, token).then(res => {
      // console.log("khach hang dai ly", res.data);
      if (res.data) {
        if (res.data.success === true) {
          let listDistributionAgencyTemp = [];
          for (let i = 0; i < res.data.data.length; i++) {
            listDistributionAgencyTemp.push({
              value: res.data.data[i].id,
              label: res.data.data[i].name,
              ...res.data.data[i]
            })
          }
          this.setState({
            listDistributionAgency: listDistributionAgencyTemp
          })
        }
        else {
          showToast(
            res.data.message
              ? res.data.message
              : res.data.err_msg,
            2000
          );
          return false;
        }
      }
      else {
        showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
      }
    });
  }

  async getIndustryCustomer(id, token) {
    let reqListCustomer = {
      isChildOf: id,
      customerType: "Industry"
    };
    let params = {
      reqListCustomer
    };
    await callApi("POST", GETTYPECUSTOMER, params, token).then(res => {
      // console.log("khach hang cong nghiep", res.data);
      if (res.data) {
        if (res.data.success === true) {
          let listIndustryTemp = [];
          for (let i = 0; i < res.data.data.length; i++) {
            listIndustryTemp.push({
              value: res.data.data[i].id,
              label: res.data.data[i].name,
              ...res.data.data[i]
            })
          }
          this.setState({
            listIndustry: listIndustryTemp
          })
        }
        else {
          showToast(
            res.data.message
              ? res.data.message
              : res.data.err_msg,
            2000
          );
          return false;
        }
      }
      else {
        showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
      }
    });
  }

  async getRestaurantCustomer(id, token) {
    let reqListCustomer = {
      isChildOf: id,
      customerType: "Restaurant_Apartment"
    };
    let params = {
      reqListCustomer
    };
    await callApi("POST", GETTYPECUSTOMER, params, token).then(res => {
      // console.log("khach hang nha hang", res.data);
      if (res.data) {
        if (res.data.success === true) {
          let listRestaurantTemp = [];
          for (let i = 0; i < res.data.data.length; i++) {
            listRestaurantTemp.push({
              value: res.data.data[i].id,
              label: res.data.data[i].name,
              ...res.data.data[i]
            })
          }
          this.setState({
            listRestaurant: listRestaurantTemp
          })
        }
        else {
          showToast(
            res.data.message
              ? res.data.message
              : res.data.err_msg,
            2000
          );
          return false;
        }
      }
      else {
        showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
      }
    });
  }
  
  async getListBranch(id) {
    console.log(id)
    let listBranchTemp = [];
    const dataBranch = await getListBranchAPI(id);
    // console.log("data branch", dataBranch.data.data);
    for (let i = 0; i < dataBranch.data.data.length; i++) {
      listBranchTemp.push({
        value: dataBranch.data.data[i].id,
        label: dataBranch.data.data[i].name,
        ...dataBranch.data.data[i]
      })
    }
    this.setState({
      listBranch: listBranchTemp
    })
  }
  async addHistoryTurnBack(
    driver,
    license_plate,
    cylinders,
    type,
    stationId,
    numberOfCylinder,
    idDriver,
    sign,
    cylinderImex,
    idImex,
    typeImex,
    flow,
    idCustomer
  ) {
    this.setState({ isLoading: true });
    let user_cookies = await getUserCookies();
    // console.log(stationId);
    const user = await createHistoryAPI(
      driver,
      license_plate,
      cylinders,
      Constant.IMPORT_FACTORY,
      '',
      type,
      numberOfCylinder,
      user_cookies.user.id,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      idDriver,
      sign,
      cylinderImex,
      idImex,
      typeImex,
      flow,
      idCustomer
    );
    this.setState({
      isLoading: false,
      dataWarmings: user
    });
    //console.log('register',user);
    if (user) {
      if (user.status === Constant.HTTP_SUCCESS_CREATED || user.status === Constant.HTTP_SUCCESS_BODY && !user.data.hasOwnProperty("err_msg")) {
        // showToast('Nhập hàng thành công!', 3000);
        // const modal = $("#export-driver-order");
        // modal.modal('hide');
        //this.props.refresh();
        return {
          success: true,
          message: 'SUCCESS'
        }
      }
      else {
        openNotificationWithIcon('error', 'Nhập hàng thất bại')
        // const modal = $("#export-driver-order");
        // modal.modal('hide');
        //this.props.refresh();
        return {
          success: false,
          message: 'FALSE'
        }
      }
    }
    else {
      openNotificationWithIcon('error', 'Xảy ra lỗi trong quá trình nhập hàng');
      return {
        success: false,
        message: 'FALSE'
      }
    }
    //this.setState({registerSuccessful: false});

  };
  async addHistory(
    driverName,
    license_plate,
    cylinders,
    to_array,
    number_array,
    idDriver,
    sign,
    cylinderImex,
    idImex,
    typeImex,
    flow
  ) {
    // Call api
    /* this.setState({ isLoading: true });
    const user = await createHistoryAPI(
      driverName,
      license_plate,
      cylinders,
      Constants.EXPORT_FACTORY,
      "",
      "",
      "",
      "",
      to_array,
      number_array,
      "",
      "",
      "",
      "",
      "",
      idDriver,
      sign
    );
    this.setState({ isLoading: false });
    //console.log('register',user);
    if (user) {
      if (
        user.status === Constants.HTTP_SUCCESS_CREATED ||
        user.status === Constants.HTTP_SUCCESS_BODY
      ) {
        showToast("Xuất hàng thành công!", 3000);
        const modal = $("#export-driver");
        modal.modal("hide");
        //this.props.refresh();
        return true;
      } else {
        showToast(
          user.data.message ? user.data.message : user.data.err_msg,
          2000
        );
        return false;
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình tạo bình ");
      return false;
    }
 */

    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;

    let params = {
      userId: user_cookies.user.id,

      // Chi tiết export
      type: 'EXPORT',
      driver: driverName,
      license_plate,
      from: user_cookies.user.id,
      toArray: to_array,
      numberArray: number_array,
      cylinders,
      idDriver,
      signature: sign,
      cylinderImex,
      idImex,
      typeImex,
      flow,

      // Đơn hàng
      orderId: this.props.selectedOrderIDs,
    };


    const result = await callApi("POST", CREATEEXPORTORDERHISTORY, params, token).then((res) => {
      console.log('check_cylidners_for_order', res.data)
      const resData = res.data
      // const modal = $("#export-driver-order");
      // modal.modal("hide");
      if (resData.status && resData.resCode === 'SUCCESS-00002') {
        return {
          success: true,
          message: 'SUCCESS'
        }
      }
      else {
        openNotificationWithIcon("error", 'Xuất hàng thất bại')
        return {
          success: false,
          message: 'FALSE'
        }
      }
    }).catch(function (error) {
      openNotificationWithIcon("error", 'Lỗi xuất hàng')
      return {
        success: false,
        message: error
      }
    });

    if (result.success) {
      return {
        success: true,
        message: result.message
      }
    }
    else {
      return {
        success: false,
        message: result.message
      }
    }

  }

  async componentDidMount() {
    let user_cookies = await getUserCookies();
    let id;
    let token = "Bearer " + user_cookies.token;
    // console.log("user cookieess999", user_cookies.user);
    let params = {
      id: user_cookies.user.id,
    };
    if (user_cookies.user.userType === "Factory" && user_cookies.user.userRole === "Owner") {
      id = user_cookies.user.isChildOf
    }
    else {
      id = user_cookies.user.id;
    }

    await callApi("POST", NAMEDRIVE, params, token).then((res) => {
      if (res.data.data <= 0) {
        this.setState({
          listDriver: [{
            name: "Bạn chưa có tài xế",
            id: "null"
          }],
        });
      }
      else {
        //console.log(user_cookie.user.id+""+res.data.data);
        this.setState(
          {
            listDriver: res.data.data,
          },
          () => console.log(this.state.listDriver)
        );
      }
    });
    await this.getAllCustomer();
    await this.getDistributionAgencyCustomer(id, token);
    await this.getIndustryCustomer(id, token);
    await this.getRestaurantCustomer(id, token);
    let data = await getAllProvince();
    this.setState({
      listProvince: data.data.Provinces
    });
  }
async componentWillReceiveProps(nextProps) {
  if(nextProps.selectedOrderInfor.length>0){
    let listDelivery=[];
    let sumListDelivery=0;
    let countProduct_Parse=0;
    let nameProvince="";
    if(this.props.product_parse.length>0){
      countProduct_Parse=this.props.product_parse.length;
    }
    console.log("selectedOrderInforNha",nextProps.selectedOrderInfor);
    console.log("this.props.product_parse",this.props.product_parse);  
    nextProps.selectedOrderInfor.map((item,index)=>{  
      let lengthListCylinder=item.listCylinder.length;
      let count=0;
      for(let i=0;i<lengthListCylinder;i++){
        count += +(item.listCylinder[i].numberCylinders)
      };
      for(let i=0;i<this.state.listProvince.length;i++){
        if(this.state.listProvince[i].id===item.provinceId){
          nameProvince=this.state.listProvince[i].nameProvince
        }
      }
      sumListDelivery+=count;
      console.log("count",count);
      listDelivery.push({
        number:++index,
        provinceId:item.provinceId,
        customerName:item.customerName,
        numberCylinders:count,
        agencyName:item.agencyName,
        nameProvince:nameProvince,
        customerCode:item.customerCode,
      });
      nameProvince="";
    });
    console.log("listDelivery",listDelivery);
    console.log("sumListDelivery",sumListDelivery);
    this.setState({
      listDelivery:listDelivery,
      sumListDelivery:sumListDelivery,
      countProductParse:countProduct_Parse
    });
  } 
  
}
  submit = async (event) => {

    event.preventDefault();
    // console.log('submit event')
    let user_cookies = await getUserCookies();
    // console.log("handleChangeListProvince1", this.state.provinceCode)
    this.setState(
      {
        loading: true
      }
    );
    // console.log("this.props.selectedOrderInfor112", this.props.selectedOrderInfor)
    // console.log("this.props.ShippingTextDetail112", this.props.ShippingTextDetail)
    let data = this.form.getValues();
    let ShippingCustomerDetail = []
    let { listDriver, textDriver } = this.state;
    if (this.state.checked === false) {
      var index = listDriver.findIndex((l) => l.id === this.state.idDriver);
      var nameDriver = listDriver[index].name;
    }
    else if (this.state.checked === true) {
      var textDrivers = textDriver;
    }

    //// var products=await this.getAllCylenders();
    var cylinders = [];
    let cylinderImex = [];
    let cylinderImexTurnBack = [];
    for (let i = 0; i < this.props.product_parse.length; i++) {
      cylinders.push(this.props.product_parse[i].id);
      cylinderImex.push(
        {
          id: this.props.product_parse[i].id,
          status: "FULL",
          condition: "NEW"
        }
      )
      cylinderImexTurnBack.push(
        {
          id: this.props.product_parse[i].id,
          status: "FULL",
          condition: "NEW"
        }
      )
    }


    // console.log("data checkbox", this.state.checked);
    // console.log("data", data);
    // console.log("numberGeneral0", data.numberGeneral0);branchResults
    // console.log(data["numberGeneral1"]);
    // if(this.state.listIndustryResults.length>0){
    //   this.state.listIndustryResults.map((item,index)=>{
    //     this.state.BranchResults.push({
    //       name : item.name,
    //       value : item.value,
    //       count:item.count,
    //       label :item.label
    //     });
    //   });
    // }
    let id;
    let token = "Bearer " + user_cookies.token;
    // console.log("user cookieess999", user_cookies.user);
    if (
      // Kho cua cong ty me
      (user_cookies.user.userType === "Factory" && user_cookies.user.userRole === "Owner")
      ||
      // Kho cua dai ly
      (user_cookies.user.userType === 'General_Warehouse' && user_cookies.user.userRole === "SuperAdmin")
      ) {
      id = user_cookies.user.isChildOf
    }
    else {
      id = user_cookies.user.id;
    }

    await this.getDistributionAgencyCustomer(id, token);
    await this.getRestaurantCustomer(id, token);
    await this.getIndustryCustomer(id, token);
    console.log("this.state.listIndustry",this.state.listIndustry);
    console.log("this.state.listDistributionAgency",this.state.listDistributionAgency);
    console.log("listRestaurant",this.state.listRestaurant);
    let toArray = [];
    let numberArray = [];
    let generalList = this.state.GeneralResults;
    let branchList = this.state.BranchResults;    
    let customerList = this.state.CustomerResults;
    let customerResults=[];
    let listIndustryResults=[];
    let branchResults=[];
    let list=[];
    this.state.listDelivery.map((item,index)=>{
      for(let i=0;i<this.state.listDistributionAgency.length;i++){
        if(item.customerCode===this.state.listDistributionAgency[i].value){
          customerResults.push({
            name : item.customerName,
            value : item.customerCode,
            count:item.numberCylinders,
            label :item.customerName
          });
        }
      }
      for(let i=0;i<this.state.listIndustry.length;i++){
        console.log("item",item);
        console.log("item",this.state.listIndustry[i].name);
        if(item.customerCode===this.state.listIndustry[i].value){
              listIndustryResults.push({
                name : item.agencyName,
                value : item.customerCode,
                count:item.numberCylinders,
                label :item.agencyName
              });          
            }
      }
      for(let i=0;i<this.state.listRestaurant.length;i++){
        if(item.customerCode===this.state.listRestaurant[i].value){
              listIndustryResults.push({
                name : item.agencyName,
                value : item.customerCode,
                count:item.numberCylinders,
                label :item.agencyName
              });  
          
        }
      }
    });
    // branchResults.map((item,index)=>{
    //   listIndustryResults.push({
    //     name : item.name,
    //     value : item.value,
    //     count:item.count,
    //     label :item.label
    //   });
    // });
    console.log("listIndustryResults",listIndustryResults);
    for(let i =0;i<listIndustryResults.length;i++){
      let id=listIndustryResults[i].value;
      await this.getListBranch(id);
        
      console.log("this.state.lisband",this.state.listBranch);
      for(let j =0;j<this.state.listBranch.length;j++){
        if(listIndustryResults[i].name===this.state.listBranch[j].name){
          list.push({
            name : listIndustryResults[i].name,
            value : this.state.listBranch[j].value,
            count:listIndustryResults[i].count,
            label :listIndustryResults[i].name
          });
        }
      }
    }
    console.log("list",list);
    customerList=customerResults;

    branchList=list;
    console.log("customerList",customerList);
    console.log("branchList",branchList);
    let idImex = Date.now();
    let typeImex = "OUT";
    let flow = "EXPORT";
    let typeImexTurnBack = "IN";
    let flowTurnBack = "IMPORT";
    //let agencyList = this.state.AgencyResults;
    if (this.state.listDelivery.length === 0) {
      showToast("Hãy chọn nơi cần xuất bình");
      return;
    } else {
      // console.log(branchList)
      // console.log(customerList)
      for (let i = 0; i < branchList.length; i++) {
        toArray.push(branchList[i].value);
        // if (data["numberGeneral" + i])
        // {
        //   numberArray.push(data["numberGeneral" + i]);

        // }
        if (branchList[i].count) {

          numberArray.push(branchList[i].count);
          ShippingCustomerDetail.push({
            "numberCylinder": branchList[i].count,
            "customerId": branchList[i].value
          })
          // console.log(ShippingCustomerDetail)
        }
        else {
          numberArray.push(0);
        }

      }
      // console.log("numberArrray", numberArray)
      // console.log("ShippingCustomerDetail11", ShippingCustomerDetail)

      for (let i = 0; i < customerList.length; i++) {
        toArray.push(customerList[i].value);

        if (customerList[i].count) {
          numberArray.push(customerList[i].count);

          ShippingCustomerDetail.push({
            "numberCylinder": customerList[i].count,
            "customerId": customerList[i].value
          })


        }
        else
          numberArray.push(0);

      }
      // console.log(ShippingCustomerDetail)
      console.log('this is ShippingCustomerDetail', ShippingCustomerDetail)
      ShippingCustomerDetail.map(v => {
        this.setState({
          idCustomer: v.customerId
        })
      })
    }

    // let ShippingCustomerDetail = []

    this.props.selectedOrderInfor.map(v => {
      // v.listCylinder.map(value=>{
      //   ShippingCustomerDetail.push({
      //     "customerId": v.customerCode,
      //      "numberCylinder": value.numberCylinders
      //   })
      // })

      // console.log("selectedOrderInfor12345", v)
      this.setState({
        deliveryDate: v.deliveryDate,

      })
    })
    // this.setState({
    //   ShippingCustomerDetail: ShippingCustomerDetail
    // })

    // console.log("this.state.deliveryDate", this.state.deliveryDate, this.props.selectedOrderIDs, this.state.customerId)
    let selectedOrderIDs = []
    this.props.selectedOrderInfor.map((item, index) => {

      this.props.selectedOrderIDs.map(v => {
        if (item.id === v) {
          selectedOrderIDs.push({
            "orderId": v,
            "provinceId": this.state.checked === true? "":item.provinceId,
          });
        }
      });
    });
    console.log("selectedOrderIDs", selectedOrderIDs);
    console.log("this.props.selectedOrderInfor112", this.props.selectedOrderInfor);
    this.setState({
      selectedOrderIDs: selectedOrderIDs
    })
    console.log("selectedOrderIDs", selectedOrderIDs);
    //lấy ngày
    let date = new Date(this.state.deliveryDate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }
    let deliverydate = dt + '/' + month + '/' + year
    // console.log(year + '-' + month + '-' + dt);
    //lấy giờ
    const _time = (new Date(this.state.deliveryDate));
    let startHour
    let hour = _time.getHours();
    let minute = _time.getMinutes();
    if (hour < 7) {
      hour = hour + 17
      startHour = hour + ":" + minute;
    } else {
      hour = hour - 7
      startHour = "0" + hour + ":" + minute;
    }
    // console.log(deliverydate, startHour)
    let ShippingOrder
    // console.log(this.state.checked, nameDriver, textDrivers)
    ShippingOrder = {
      "driverId": nameDriver !== undefined ? this.state.idDriver : null,
      "nameDriver": nameDriver == undefined ? textDrivers : nameDriver,
      "licensePlate": data.license_plate,
      "deliveryDate": deliverydate,
      "deliveryHours": startHour,
      // "provinceId": this.state.checked === true ? null : this.state.provinceCode,
      "createdBy": user_cookies.user.id

    }

    // this.state.selectedOrderIDs
    // console.log("ShippingOrderDetail", this.state.selectedOrderIDs)
 

    if (this.state.checked === false && this.state.checkedIN === false) {
      await this.addHistory(
        nameDriver,
        data.license_plate,
        cylinders,
        toArray,
        numberArray,
        this.state.idDriver,
        "Xuất đơn hàng trên WEB",
        cylinderImex,
        idImex,
        typeImex,
        flow
      );

      await createShippingOrder(ShippingOrder, this.state.selectedOrderIDs, ShippingCustomerDetail, this.props.ShippingTextDetail);
      this.setState({
        loading: false
      });
      $("#export-driver-order").modal("hide");

    } else if (this.state.checked === false && this.state.checkedIN === true) {
      try {
        const resultExportIN = await this.addHistory(
          nameDriver,
          data.license_plate,
          cylinders,
          toArray,
          numberArray,
          this.state.idDriver,
          "Xuất đơn hàng trên WEB",
          cylinderImex,
          idImex,
          typeImex,
          flow
        );

        if (resultExportIN.success) {
          let data = await createShippingOrder(ShippingOrder, this.state.selectedOrderIDs, ShippingCustomerDetail, this.props.ShippingTextDetail);
          console.log("data", data);
        } if (this.state.dataWarmings !== "") {
          this.addHistoryTurnBack(
            nameDriver,
            data.license_plate,
            cylinders,
            Constant.IMPORT_TYPE,
            data.station,
            numberArray,
            this.state.idDriver,
            "Nhập hàng trực tiếp",
            cylinderImexTurnBack,
            idImex,
            typeImexTurnBack,
            flowTurnBack,
            this.state.idCustomer
          );
          this.setState({
            loading: false
          });
          $("#export-driver-order").modal("hide");
        } else {
          openNotificationWithIcon('error', resultImportIN.message)
        }
      } catch (error) {
        // console.log('LOOI', err.message)
        openNotificationWithIcon('error', error)
      }

    }

    else if (this.state.checked === true && this.state.checkedIN === false) {
      try {
        const resultExport = await this.addHistory(
          textDrivers,
          data.license_plate,
          cylinders,
          toArray,
          numberArray,
          this.state.idDriver,
          "Xuất đơn hàng trên WEB",
          cylinderImex,
          idImex,
          typeImex,
          flow
        )
        if (resultExport.success) {
          await createShippingOrder(ShippingOrder, this.state.selectedOrderIDs, ShippingCustomerDetail, this.props.ShippingTextDetail)
          this.setState({
            loading: false
          });
          $("#export-driver-order").modal("hide");
        }
        else {
          openNotificationWithIcon('error', resultExport.message)
        }
        // console.log('xong addHistoryTurnBack');
      }
      catch (error) {
        // console.log('LOOI', err.message)
        openNotificationWithIcon('error', error)
      }

    }
    else if (this.state.checked === true && this.state.checkedIN === true) {

      try {


        // console.log('vao day roi ne xe ngoai this.state.idCustomer', this.state.idCustomer);
        // await Promise.all([
        //   this.addHistory(
        //     textDrivers,
        //     data.license_plate,
        //     cylinders,
        //     toArray,
        //     numberArray,
        //     this.state.idDriver,
        //     "Xuất đơn hàng trên WEB",
        //     cylinderImex,
        //     idImex,
        //     typeImex,
        //     flow
        //   ),
        //   //console.log('xong addHistory');
        //   this.addHistoryTurnBack(
        //     textDrivers,
        //     data.license_plate,
        //     cylinders,
        //     Constant.IMPORT_TYPE,
        //     data.station,
        //     numberArray,
        //     this.state.idDriver,
        //     "Nhập hàng trực tiếp",
        //     cylinderImexTurnBack,
        //     idImex,
        //     typeImexTurnBack,
        //     flowTurnBack,
        //     this.state.idCustomer

        //   ),
        //   createShippingOrder(ShippingOrder, this.state.selectedOrderIDs, ShippingCustomerDetail, this.props.ShippingTextDetail)

        // ])

        const resultExport = await this.addHistory(
          textDrivers,
          data.license_plate,
          cylinders,
          toArray,
          numberArray,
          this.state.idDriver,
          "Xuất đơn hàng trên WEB",
          cylinderImex,
          idImex,
          typeImex,
          flow
        )

        if (resultExport.success) {
          // openNotificationWithIcon('success', 'OK 11')
          const resultImport = await this.addHistoryTurnBack(
            textDrivers,
            data.license_plate,
            cylinders,
            Constant.IMPORT_TYPE,
            data.station,
            numberArray,
            this.state.idDriver,
            "Nhập hàng trực tiếp",
            cylinderImexTurnBack,
            idImex,
            typeImexTurnBack,
            flowTurnBack,
            this.state.idCustomer

          )

          if (resultImport.success) {
            // openNotificationWithIcon('success', 'OK 2222')
            await createShippingOrder(ShippingOrder, this.state.selectedOrderIDs, ShippingCustomerDetail, this.props.ShippingTextDetail)
            this.setState({
              loading: false
            });
            $("#export-driver-order").modal("hide");
          }
          else {
            openNotificationWithIcon('error', resultImport.message)
          }
        }
        else {
          openNotificationWithIcon('error', resultExport.message)
        }



        // console.log('xong addHistoryTurnBack');
      }
      catch (error) {
        // console.log('LOOI', err.message)
        openNotificationWithIcon('error', error)
      }
    }

    //console.log("shipping", shipping)

    // return;
  }

  async submitTextFile(event) {
    // /* if (!file) showToast('Vui lòng chọn file!', 3000);
    //      this.setState({isLoading: true});
    //      const result = await importProductsFromExcelAPI(file);
    //      this.setState({isLoading: false});
    //      console.log(result);
    //      if (result && result.status === 200) {
    //          if (typeof (result) !== 'undefined') {
    //              showToast('Đưa vào thành công!', 3000);
    //              this.props.refresh();
    //          }
    //          else {
    //              //showToast("Xảy ra lỗi trong quá trình đăng ký",2000);
    //          }
    //          return;
    //      } else {
    //          showToast("Xảy ra lỗi trong quá trình import. Vui lòng kiểm tra lại dữ liệu", 2000);
    //      }
    //      return;
    //      $("#import-product").modal('hide');
    //      return;*/
  }

  handleChangeExportType = (langValue) => {
    this.setState({
      listExportPlaceData: langValue,
      listExportPlaceDataID: langValue.id,
    });
  };
  // handleClickOutCar = (e) => {
  //   this.setState({
  //     display: !this.state.display,
  //     checked: !this.state.checked
  //   })
  // }
  handleConfirm = async (e) =>{
   await this.setState({
      checkedIN: true
    })
  }
  handleCancel = async (e) => {
   await this.setState({
      checkedIN: false
    })
  }
  handleConfirmInput = async (e) =>{
    await this.setState({
       inputPopconfirm: true
     })
   }
   handleCancelInput = async (e) => {
    await this.setState({
      inputPopconfirm: false
     })
   }
   handleConfirmInputCustomer = async (e) =>{
    console.log("inputPopconfirmCustomer",this.state.inputPopconfirmCustomer);
    await this.setState({
       inputPopconfirmCustomer: true
     });
     console.log("inputPopconfirmCustomer",this.state.inputPopconfirmCustomer);
   }
   handleCancelInputCustomer = async (e) => {
    await this.setState({
      inputPopconfirmCustomer: false
     })
   }
  handleOnChangeCheck = async (e) => {
    await this.setState({
      checked: e.target.checked
    })
  }
  handleOnChangeCheckIN = async (e) => {
    await this.setState({
      checkedIN: e.target.checked
    })
  }
  handleChanceProduct= async (e)=>{
    console.log("handleChanceProduct",e.value);
  }
  // resetForm() {
  //   this.form.reset()
  // }
  render() {
    console.log("selectedOrderIDs1111111111111111111", this.props.selectedOrderInfor);
    //console.log("hahahhahaha", this.props.listExportPlace);
    const display = this.state.display ? 'none' : '' // toggle css display: none
    const checked = this.state.checked ? true : false;// toggle checked
    const {checkedIN,inputPopconfirm} =this.state;
    let ar = [];
    
    const columns = [
      {
        title: "STT",
        dataIndex: "number",
        key: "number",
        // ...this.getColumnSearchProps("orderCode"),
        // fixed: 'left',
        // width: 150
      },
      {
        title: "Thông tin khách hàng",
        dataIndex: "customerName",
        key: "customerName",
        // ...this.getColumnSearchProps("orderCode"),
        // fixed: 'left',
        // width: 150
      },
      {
        title: "Chi nhánh",
        dataIndex: "agencyName",
        key: "agencyName",
        // ...this.getColumnSearchProps("orderCode"),
        // fixed: 'left',
        // width: 150
      },
      {
        title: "Nơi giao hàng",
        dataIndex: "nameProvince",
        key: "nameProvince",
        // ...this.getColumnSearchProps("orderCode"),
        // fixed: 'left',
        // width: 150
        // render: (text, record) => {
        //   console.log("Nharecord",record);
        //   return (
        //     <div>
        //       <div className="form-group">
        //         <Select
        //           style={{ width: "100%" }}
        //           id="customerNameBoss"
        //           name="customerNameBoss"
        //           placeholder="Chọn nơi giao hàng"
        //         >
        //           {/* {this.state.listProvince.map((l, index) => {
        //             // console.log("Provinces", record);
        //             return (
        //               <Option key={record.id} value={l.id}>
        //                 {l.nameProvince}
        //               </Option>
        //             );
        //           })} */}
        //         </Select>
        //       </div>
        //     </div>
        //   );
        // },
      },
      {
        title: "Số lượng",
        dataIndex: "numberCylinders",
        key: "numberCylinders",
        // ...this.getColumnSearchProps("orderCode"),
        // fixed: 'left',
        // width: 150
      },
      
    ]
    // for(let i=0;i<this.state.CustomerResults.length;i++){
    //   ar.push(this.state.CustomerResults[i].id);
    // }
    // console.log(this.state.CustomerResults[0]);
    // let dri = [];
    // for(let i=0;i<this.state.listDriver.length;i++){
    //   dri.push(this.state.listDriver[i].name);
    // }
    // console.log("listDriver", this.props.ShippingTextDetail);
    // console.log("textdri", this.state.textDriver);
    return (
      <div
        className="modal fade"
        id="export-driver-order"
        tabIndex="-1"
        style={{ overflowY: "auto" }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Đơn Hàng: Xuất Bình - Bước 2 - Thông Tin Tài Xế
              </h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form
                ref={(c) => {
                  this.form = c;
                }}
                className="card"
                onSubmit={(event) => this.submit(event)}
              >
                <ReactCustomLoading isLoading={this.state.loading} />
                <div className="card-body">
                  <div className="row">
                    <div className="row col-12">
                      <h6 style={{ color: "rgb(255,99,71)" }}>*Lưu ý : Nếu chọn tạo phiếu nhập: số lượng không được nhập khác số bình</h6>
                    </div>
                    <div className="row col-12">
                      <div className="col-md-2">
                        <div className="form-group d-flex justify-content-between">
                          <Popconfirm
                            title="Bạn có muốn chọn lệnh nhập kho?"
                            onConfirm={this.handleConfirm}
                            onCancel={this.handleCancel}
                            okText="Có"
                            cancelText="Không"
                          >
                            <Checkbox className="text-align-left"
                              name="checkCarOut"
                              id="checkCarOut"
                              checked={this.state.checked}
                              onChange={this.handleOnChangeCheck}

                            >
                              <label>Xe ngoài</label>
                            </Checkbox>
                          </Popconfirm>

                          {/* <Checkbox className="text-align-right" 
                                  style={{display: display}}
                        >
                          <label>Tạo lệnh nhập kho</label>
                        </Checkbox> */}
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="form-group d-flex justify-content-between">
                          <Checkbox className="text-align-left"
                            name="checkCarOut"
                            id="checkCarOut"
                            checked={this.state.checkedIN}
                            onChange={this.handleOnChangeCheckIN}

                          >
                            <label>Lệnh nhập kho</label>
                          </Checkbox>
                          {/* <Checkbox className="text-align-right" 
                                  style={{display: display}}
                        >
                          <label>Tạo lệnh nhập kho</label>
                        </Checkbox> */}
                        </div>
                      </div>
                      {/* {this.props.userType === Constant.GENERAL || this.state.checked == true
                        ? ""
                        :
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>Mã giao hàng</label>
                            <Select
                              style={{ width: "100%" }}
                              placeholder="Chọn mã giao hàng"
                              onChange={this.handleChangeListProvince}
                            >
                              {this.state.listProvince.map((l, index) => {
                                console.log("Provinces", l)
                                return (
                                  <Option key={index} value={l.id}>
                                    {l.nameProvince}
                                  </Option>
                                );
                              })}
                            </Select>
                          </div>
                        </div>

                      } */}
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Tên tài xế</label>
                        {this.state.checked === true ? (
                          <Input
                            className="form-control"
                            type="text"
                            placeholder="Nhập tài xế..."
                            value={this.state.textDriver}
                            onChange={this.handleTextDriver}
                            style={{ width: "100%" }}
                          />
                        ) : <Select
                          showSearch
                          style={{ width: "100%", display: this.state.display }}
                          placeholder="Chọn tài xế..."
                          optionFilterProp="children"
                          onChange={this.handleChangeDriver}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                            {this.state.listDriver.map((l, index) => {
                              return (
                                <Option key={index} value={l.id}>
                                  {l.name}
                                </Option>
                              );
                            })}
                          </Select>
                        }
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Biển số xe</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="license_plate"
                          id="license_plate"
                          validations={[required]}
                        />
                        {/* <Select
                          showSearch
                          style={{ width: "100%" }}
                          placeholder="Chọn xe..."
                          optionFilterProp="children"
                          onChange={this.handleChangeDriver}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.listDriver.map((l, index) => {
                            return (
                              <Option key={index} value={l.id}>
                                {l.name}
                              </Option>
                            );
                          })}
                        </Select> */}
                      </div>
                    </div>

                    {/*<div className="col-md-12">*/}
                    {/*    <div className="form-group">*/}
                    {/*        <label>Loại xuất </label>*/}
                    {/*        <Select onClick={() => {*/}
                    {/*            this.setState({isShowDropdown: this.form.getValues().type_export})*/}
                    {/*        }} className="form-control"*/}
                    {/*                name="type_export"*/}
                    {/*                validations={[required]}>*/}
                    {/*            <option value="0">-- Chọn --</option>*/}
                    {/*            <option value="2">Xuất cho thương nhân mua bán</option>*/}
                    {/*            <option value="3">Xuất cho cửa hàng bán lẻ</option>*/}
                    {/*        </Select>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*{this.props.userType === Constant.FACTORY && (*/}
                    {/*    <div className="col-md-12">*/}
                    {/*        <div className="form-group">*/}
                    {/*            <label>"Địa điểm xuất bình"</label>*/}
                    {/*            <Select*/}
                    {/*                options={this.props.listExportPlace}*/}
                    {/*                onChange={this.handleChangeExportType.bind(this)}*/}
                    {/*                placeholder="Chọn..."*/}
                    {/*                value={this.state.listExportPlaceData}*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                    {this.props.userType === Constant.GENERAL
                      ? ("")
                      : (
                        <div className="col-md-12">
                          {/* <div className="form-group">
                            <label>Chọn loại khách hàng</label>
                            <Select
                              style={{ width: "100%" }}
                              placeholder="Chọn loại khách hàng..."
                              onChange={this.handleChangeTypeCustomer}
                            >
                              <Option value="Distribution_Agency">Đại lý phân phối</Option>
                              <Option value="Industry">Khách hàng công nghiệp</Option>
                              <Option value="Restaurant_Apartment">Nhà hàng, tòa nhà</Option>
                            </Select>
                          </div> */}

                          {/* {this.state.typeCustomer !== "Distribution_Agency" &&
                            <div className="form-group">
                              <label>Chọn khách hàng</label>
                              <select
                                className="form-control"
                                style={{ width: "100%" }}
                                placeholder="Chọn khách hàng..."
                                onChange={e => this.handleChangeGeneral(e)}
                                value={this.state.GeneralResults}
                              >
                                <option value="">Chọn khách hàng...</option>
                                {this.state.typeCustomer === "Distribution_Agency" && 
                              this.state.listDistributionAgency.map((l, index) => {
                                return (
                                  <option key={index} value={l.id}>
                                    {l.name}
                                  </option>
                                );
                              })
                            }
                                {this.state.typeCustomer === "Industry" &&
                                  this.state.listIndustry.map((l, index) => {
                                    return (
                                      <option key={index} value={l.id}>
                                        {l.name}
                                      </option>
                                    );
                                  })
                                }
                                {this.state.typeCustomer === "Restaurant_Apartment" &&
                                  this.state.listRestaurant.map((l, index) => {
                                    return (
                                      <option key={index} value={l.id}>
                                        {l.name}
                                      </option>
                                    );
                                  })
                                }
                              </select>
                            </div>

                          } */}


                          {/* {this.state.typeCustomer !== "Distribution_Agency" &&
                            <div className="form-group">
                              <label>Chọn các chi nhánh</label>
                              <SelectMulti.Creatable
                                multi={true}
                                options={this.state.listBranch}
                                onChange={checked===true && checkedIN===true ?
                                this.handleChangeBranchBegin.bind(this)
                                :
                                this.handleChangeBranch.bind(this)}
                                placeholder={this.props.t('CHOOSE')}
                                value={this.state.BranchResults}
                                promptTextCreator={() => {
                                  return;
                                }}
                              />
                            </div>} */}
                          {/* {this.state.typeCustomer === "Distribution_Agency" &&
                            <div className="form-group">
                              <label>Chọn các khách hàng1</label>
                              <SelectMulti.Creatable
                                multi={true}
                                options={this.state.listDistributionAgency}
                                onChange={checked ===true && checkedIN===false  ?
                                   this.handleChangeCustomer1.bind(this) :
                                   checked===true && checkedIN===true? 
                                   this.handleChangeCustomerBegin.bind(this):
                                    this.handleChangeCustomer.bind(this)}
                                placeholder={this.props.t('CHOOSE')}
                                value={this.state.CustomerResults}
                                promptTextCreator={() => {
                                  return;
                                }}
                              />
                            </div>} */}
                        </div>
                      )}
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Tổng số bình xuất</label>
                                <Input
                                    disabled={true}
                                  className="form-control"
                                  type="text"
                                  value={this.state.countProductParse} 
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Tổng số  bình theo đơn hàng</label>
                                <Input
                                   disabled={true}
                                  className="form-control"
                                  type="text"
                                  value={this.state.sumListDelivery}
                                />
                              </div>
                            </div>
                            </div>        
                    </div>  
                    <div className="col-md-12">
                        <Table
                          //title = {() => 'Here is title'}
                          bordered
                          columns={columns}
                          dataSource={this.state.listDelivery}
                          // expandedRowRender={(record, index) => this.expandedRowRender(record, index)}
                          // rowClassName={(record, index) => ((moment(record.deliveryDate, "DD/MM/YYYY - HH:MM:SS") - (new Date)) < ONE_DAY ? "red" : "blue")}
                          //   rowSelection={rowSelection}
                          //   loading={this.state.isLoading}
                        />
                    </div>
                  </div>  
                </div>

                <footer className="card-footer text-center">
                  {this.state.loading === false ?
                    (
                      <Button className="btn btn-primary" type="submit">
                        Lưu
                      </Button>
                    )
                    :
                    (
                      <Button className="btn btn-primary">
                        Loading
                      </Button>
                    )}

                  <button
                    className="btn btn-secondary"
                    type="reset"
                    data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
                  >
                    Đóng
                  </button>
                </footer>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(PopupDriverExportOrder);
