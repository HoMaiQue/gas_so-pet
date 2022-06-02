import React from "react";
import getListBranchAPI from "./../../../../api/getListBranchAPI";
import getAllProvince from "../../../../api/getAllProvince";
import PropType from "prop-types";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { NAMEDRIVE, GETTYPECUSTOMER, CREATEEXPORTORDERHISTORY } from "./../../../config/config";
//import Select from 'react-validation/build/select';
import Button from "react-validation/build/button";
import required from "required";
import Constant from "Constants";
import showToast from "showToast";
import { withNamespaces } from "react-i18next";

import createHistoryAPI from "createHistoryAPI";
// import { NAMEDRIVE } from "./../../../config/config";
import callApi from "./../../../util/apiCaller";
import getUserCookies from "./../../../helpers/getUserCookies";
import ReactCustomLoading from "ReactCustomLoading";
import { Select, Popconfirm, Checkbox, Table,Pagination } from "antd";
const Option = Select.Option;
const defaultPageSize = {
	defaultPageSize: 5,
  };
class TurnBackDriverFactoryPopup extends React.Component {
	constructor(props) {
		super(props);
		this.form = null;
		this.state = {
			content: "",
			listProducts: [],
			typeImport: "",
			nameDriver: "",
			idDriver: "",
			listDriver: [],
			loading: false,
			checkedINTurnBack: false,
			textDriver: "",
			GeneralResults: "",
			number_cylinder:0,
			customerType:[],
			product_parseType:[],
			listDistributionAgency:[],
			listBranch:[],
			childOfAgency:"",
			listRestaurant:[],
			listIndustry:[],
			userId:"",
			token:"",
			listProvince:[]
		};
	}

	handleChangeDriver = (value) => {
		this.setState({
			idDriver: value,
		});
	};

	async addHistory(
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
		customerid,
		from
	) {
		// Call api

		this.setState({ isLoading: true });
		// console.log(stationId);
		const user = await createHistoryAPI(
			driver,
			license_plate,
			cylinders,
			Constant.IMPORT_FACTORY,
			"",
			type,
			numberOfCylinder,
			from,
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			idDriver,
			sign,
			cylinderImex,
			idImex,
			typeImex,
			flow,
			customerid
		);
		this.setState({ isLoading: false });
		//console.log('register',user);
		if (user) {
			if (
				user.status === Constant.HTTP_SUCCESS_CREATED ||
				(user.status === Constant.HTTP_SUCCESS_BODY &&
					!user.data.hasOwnProperty("err_msg"))
			) {
				showToast("Nhập hàng thành công!", 3000);
				const modal = $("#turn-back-driver");
				modal.modal("hide");
				//this.props.refresh();
				return true;
			} else {
				showToast(
					user.data.message ? user.data.message : user.data.err_msg,
					2000
				);
				const modal = $("#turn-back-driver");
				modal.modal("hide");
				//this.props.refresh();
				return false;
			}
		} else {
			showToast("Xảy ra lỗi trong quá trình tạo bình ");
			return false;
		}
		//this.setState({registerSuccessful: false});
	}
	async componentWillReceiveProps(nextProps){
		if (nextProps && nextProps.product_parse.length>0) {
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
			console.log("nextProps.product_parse1111",nextProps.product_parse);
			let typeProduct_parse=[];
			let count=0;
			console.log("length",count);
			nextProps.product_parse.map((item,index)=>{
				console.log("item",item.histories);
				count++;
				let lengthItem =item.histories.length;
				console.log("item.histories[lengthItem-1]",item.histories[lengthItem-1])
				typeProduct_parse.push({
					STT:count,
					serial:item.serial,
					cylinderType:item.cylinderType,
					color:item.color,
					histories:[
						{
							customerType:item.histories[lengthItem-1].to !== null
							? item.histories[lengthItem-1].to.customerType
							: item.histories[lengthItem-1].toArray.length !== 0
								? item.histories[lengthItem-1].toArray[0].customerType
								: null,
							name: item.histories[lengthItem-1].to !== null
							? item.histories[lengthItem-1].to.name
							: item.histories[lengthItem-1].toArray.length !== 0
								? item.histories[lengthItem-1].toArray[0].name
								: null,
							id: item.histories[lengthItem-1].to !== null
							? item.histories[lengthItem-1].to.id
							: item.histories[lengthItem-1].toArray.length !== 0
								? item.histories[lengthItem-1].toArray[0].id
								: null,
							isChildOf: item.histories[lengthItem-1].to !== null
							? item.histories[lengthItem-1].to.isChildOf
							: item.histories[lengthItem-1].toArray.length !== 0
								? item.histories[lengthItem-1].toArray[0].isChildOf
								: null,
						}
					]
				});
			});
			let customerType=[];
			typeProduct_parse.map((item,index)=>{
				for(let i=0;i<item.histories.length;i++){
					customerType.push(item.histories[i].customerType);
				}
			});
			//console.log("typeProduct_parse",typeProduct_parse);
			//console.log("length",count);
			//console.log("typeCustomer",customerType);
			this.setState({
				number_cylinder:count,
				customerType:customerType,
				product_parseType:typeProduct_parse,
				GeneralResults: typeProduct_parse[0].histories[0].id,
			});
			if(this.state.customerType[0]==="Distribution_Agency"){
				await this.getDistributionAgencyCustomer(id, token);
				await this.getListBranch(this.state.GeneralResults);

			}else if(this.state.customerType[0]!=="Distribution_Agency"){
				await this.getRestaurantCustomer(id, token);
				await this.getIndustryCustomer(id, token);
				//console.log("typeProduct_parse[0].histories[0].id",typeProduct_parse[0].histories[0].isChildOf);
				let industryCustomer="";
				let idIndustry="";
				this.state.listIndustry.map((item,index)=>{
					if(typeProduct_parse[0].histories[0].isChildOf===item.value){
						industryCustomer="Industry";
						idIndustry=item.value;
					};
				});
				if(industryCustomer===""){
					this.state.listRestaurant.map((item,index)=>{
						if(typeProduct_parse[0].histories[0].isChildOf===item.value){
							industryCustomer="Restaurant_Apartment";
							idIndustry=item.value;
						};
					});
				};
				let array=[];
				array.push(industryCustomer);
				let data = await getAllProvince();
				this.setState({
					customerType:array,
					GeneralResults:idIndustry,
					childOfAgency:typeProduct_parse[0].histories[0].id,
					listProvince: data.data.Provinces
				});
				await this.getListBranch(this.state.GeneralResults);
				//console.log("listRestaurant",this.state.listRestaurant);
				//console.log("listRestaurant",this.state.listIndustry);
				//console.log("listRestaurant",industryCustomer);
				//console.log("listRestaurant",this.state.customerType);	
				//console.log("GeneralResults",this.state.GeneralResults);	
			}
		}
	}
	async getListBranch(id) {
		let listBranchTemp = [];
		const dataBranch = await getListBranchAPI(id);
		// console.log("data branch", dataBranch.data.data);
		if(dataBranch.data.data){
		for (let i = 0; i < dataBranch.data.data.length; i++) {
		  listBranchTemp.push({
			value: dataBranch.data.data[i].id,
			label: dataBranch.data.data[i].name,
			...dataBranch.data.data[i]
		  });
		}
		}
		this.setState({
		  listBranch: listBranchTemp
		});
		//console.log("listBranch",this.state.listBranch);
	  }
	async componentDidMount() {
		let user_cookie = await getUserCookies();
		let token = "Bearer " + user_cookie.token;
		let params = {
			id: user_cookie.user.id,
		};
		await callApi("POST", NAMEDRIVE, params, token).then((res) => {
			if (res.data.data <= 0) {
				this.setState({
					listDriver: [
						{
							name: "Bạn chưa có tài xế",
							id: "null",
						},
					],
				});
			} else {
				//console.log(user_cookie.user.id+""+res.data.data);
				this.setState(
					{
						listDriver: res.data.data,
					}
					// , () => console.log(this.state.listDriver)
				);
			}
		});
	}

	/*handleObjectDataChild = async (childValue) => {
        handleObjectDataChildCTC
    };*/

	async submit(event) {
		// console.log("data nhan lai",this.props.product_parse[0].histories[0].from.id);

		event.preventDefault();
		this.setState({
			loading: true,
		});
		let user_cookies = await getUserCookies();
		// var products=await this.getAllCylenders();
		//console.log("product_parse", this.props.product_parse);
		let { listDriver } = this.state;
		let length = this.props.product_parse[0].histories.length - 1;
		//console.log("product_parse", this.props.product_parse[0].histories[length]);
		// <Option value="Distribution_Agency">Đại lý phân phối</Option>
		// <Option value="Industry">Khách hàng công nghiệp</Option>
		// 	<Option value="Restaurant_Apartment"></Option>
		let from =
		(this.state.customerType[0]==="Distribution_Agency" && this.state.GeneralResults!=="" && this.state.childOfAgency==="")?
		this.state.GeneralResults
		:(this.state.customerType[0]==="Distribution_Agency" && this.state.GeneralResults!=="" && this.state.childOfAgency!=="")?this.state.GeneralResults:
		(this.state.customerType[0]==="Industry" && this.state.GeneralResults!=="" && this.state.childOfAgency!=="")?this.state.childOfAgency
		:(this.state.customerType[0]==="Restaurant_Apartment" && this.state.GeneralResults!=="" && this.state.childOfAgency!=="")?this.state.childOfAgency
		:null
		;
		//console.log("from",from);
		//console.log("from",this.state.customerType[0]);
		if(from===null){
			alert("Vui lòng nhập chi nhánh");
			return;
		}
		let index = listDriver.findIndex((l) => l.id === this.state.idDriver);
		let nameDriver =
			this.state.checkedINTurnBack === false
				? listDriver[index].name
				: this.state.textDriver;
		var cylinders = [];
		var cylinderImex = [];
		for (let i = 0; i < this.props.product_parse.length; i++) {
			cylinders.push(this.props.product_parse[i].id);
			cylinderImex.push({
				id: this.props.product_parse[i].id,
				status: "EMPTY",
				//emty
				condition: "NEW",
			});
		}

		let data = this.form.getValues();
		//console.log("this.state.textDriver", this.state.textDriver);
		data.idDriver =
			this.state.checkedINTurnBack === false ? listDriver[index].id : "";
		let sign = "Web signature";
		let idImex = Date.now();
		let typeImex = "IN";
		let flow = "TURN_BACK";
		await this.addHistory(
			nameDriver,
			data.license_plate,
			cylinders,
			Constant.TURN_BACK_TYPE,
			data.station,
			data.number_cylinder,
			data.idDriver,
			sign,
			cylinderImex,
			idImex,
			typeImex,
			flow,
			user_cookies.user.id,
			from
		);
		// if (this.state.position.length === 0) {
		//     showToast('Chưa chọn vị trí!', 3000);
		//     return;
		// }
		/*  let data= this.form.getValues();
          let result= await this.props.addUser(data.email,data.name,data.address,"",USERROLE_ENUM[parseInt(data.userRole)].key);
          if(result)
          {
              const modal = $("#create-staff");
              modal.modal('hide');

          }
  */
		this.setState({
			loading: false,
		});
		return;
	}

	async submitTextFile(event) {
		/* if (!file) showToast('Vui lòng chọn file!', 3000);
         this.setState({isLoading: true});
         const result = await importProductsFromExcelAPI(file);
         this.setState({isLoading: false});
         console.log(result);
         if (result && result.status === 200) {
             if (typeof (result) !== 'undefined') {
                 showToast('Đưa vào thành công!', 3000);
                 this.props.refresh();
             }
             else {
                 //showToast("Xảy ra lỗi trong quá trình đăng ký",2000);
             }
             return;
         } else {
             showToast("Xảy ra lỗi trong quá trình import. Vui lòng kiểm tra lại dữ liệu", 2000);
         }
         return;
         $("#import-product").modal('hide');
         return;*/
	}

	/*async handleChangeTypeImport(event) {

        this.setState({ typeImport: event.target.value })
    }*/
	handleConfirm = async (e) => {
		await this.setState({
			checkedINTurnBack: true,
		});
	};
	handleCancel = async (e) => {
		await this.setState({
			checkedINTurnBack: false,
		});
	};
	handleOnChangeCheck = async (e) => {
		await this.setState({
			checkedINTurnBack: e.target.checked,
		});
	};
	handleTextDriver = (e) => {
		this.setState({
			textDriver: e.target.value,
			idDriver: "",
		});
	};
	async getDistributionAgencyCustomer(id, token) {
		//console.log("this.state.customerType",this.state.customerType);
		let reqListCustomer = {
		  isChildOf: id,
		  customerType: this.state.customerType
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
			  });
			 // console.log("listDistributionAgencyTemp",this.state.listDistributionAgency);
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
	  handleChangeGeneral = async (e) => {
		await this.setState({
		  GeneralResults: e.target.value
		});
	
		// console.log("id general", this.state.GeneralResults);
		await this.getListBranch(this.state.GeneralResults);
	  };
	  handleChangeBranchBegin = (langValue) => {
		 //console.log("!!!!", langValue);
		
		  this.setState({ 
			childOfAgency: langValue
		   });
		
		//console.log("BranchResults",this.state.childOfAgency);
	  };
	 idCustomer = async (e) => {
		let user_cookies = await getUserCookies();
    	let id;
    	let token = "Bearer " + user_cookies.token;
    // console.log("user cookieess999", user_cookies.user);
		if (user_cookies.user.userType === "Factory" && user_cookies.user.userRole === "Owner") {
		id = user_cookies.user.isChildOf
		}
	  	else {
		id = user_cookies.user.id;
		 }
		this.setState({
			userId:id,
			token:token
		})
	}
	  handleChangeTypeCustomer = async(langValue) => {
		//console.log("!!!!", langValue);
	   let arrayCustomerType=[];
	   arrayCustomerType.push(langValue);
		await this.idCustomer();
	   if(langValue==="Distribution_Agency"){
		
		this.setState({ 
			customerType: arrayCustomerType,
			GeneralResults:"",
			childOfAgency:""
		});
		await this.getDistributionAgencyCustomer(this.state.userId, this.state.token)
	   }else if(langValue==="Industry"){
			this.setState({ 
				customerType: arrayCustomerType,
				GeneralResults:"",
				childOfAgency:""
			});
			await this.getIndustryCustomer(this.state.userId, this.state.token);
	   }else if(langValue==="Restaurant_Apartment"){
		this.setState({ 
			customerType: arrayCustomerType,
			GeneralResults:"",
			childOfAgency:""
		});
		await this.getRestaurantCustomer(this.state.userId, this.state.token);
   		}	 
	  // console.log("listDistributionAgency",this.state.listDistributionAgency);
	 };
	 handleChangeCustomer = async(langValue) => {	
		// console.log("langValue",langValue);
		this.setState({ 
			GeneralResults:langValue,
			childOfAgency:""
		});
		await this.getListBranch(langValue);
	 };
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
	  
	render() {
		const columns=[
				{	
				title: 'STT',
				render: ( record, index) => {
					return(
					<div>
						
					</div>
					) 						
				}
				},
				{
					title: 'Số serial',
					render: ( record, index) => {
						return(
						<div>
							{record.serial}
						</div>
						) 						
					}
				},
				{
					title: 'Loại bình',
					render: ( record, index) => {
						return(
						<div>
							{record.cylinderType}
						</div>
						) 						
					}
				},
				{
					title: 'Màu sắc',
					render: ( record, index) => {
						return(
						<div>
							{record.color}
						</div>
						) 						
					}
				},
				{
					title: 'Nơi hồi lưu',
					dataIndex: '',
					key: '',
					render: (value, row, index) => {
						const obj = {
						   children:
						   <div>
                            <div className="form-group">
								<label >
                                	Khách hàng
                              	</label>
									<Select
										showSearch
										style={{ width: "100%" }}
										placeholder="Chọn khách hàng..."
										value={this.state.GeneralResults}
										onChange={(event)=>this.handleChangeCustomer(event)}		
									>
										<Option value=''>{this.props.t("CHOOSE")}</Option>
										{this.state.customerType[0]==="Distribution_Agency" && this.state.listDistributionAgency.map((l, index) => {
											return (
												<Option key={index} value={l.id}>
													{l.name}
												</Option>
											);
										})}
										{this.state.customerType[0]==="Industry" && this.state.listIndustry.map((l, index) => {
											return (
												<Option key={index} value={l.id}>
													{l.name}
												</Option>
											);
										})}
										{this.state.customerType[0]==="Restaurant_Apartment" && this.state.listRestaurant.map((l, index) => {
											return (
												<Option key={index} value={l.id}>
													{l.name}
												</Option>
											);
										})}
									</Select>
							</div>
							<div className="form-group">
								<label >
                                	Chi nhánh
                            	</label>
								<Select
								showSearch
								style={{ width: "100%" }}
								placeholder="Chọn khách hàng..."
								value={this.state.childOfAgency}
								onChange={(event)=>this.handleChangeBranchBegin(event)}
								>
								{this.state.customerType[0]!=="Distribution_Agency" && this.state.listBranch.map((l, index) => {
									return (
										<Option key={index} value={l.id}>
											{l.name}
										</Option>
									);
								})}
								{this.state.customerType[0]=="Distribution_Agency" && this.state.listProvince.map((l, index) => {
									return (
										<Option key={index} value={l.id}>
											{l.nameProvince}
										</Option>
									);
								})}
							</Select>
						</div> 
					</div> 
						   ,
						  props: {},
						};
						
						if (index % 5 === 0) {
							obj.props.rowSpan = 5;
						  } else {
							obj.props.rowSpan = 0;
						  }
						  return obj;
					  },
				},
			
		];
		// console.log("columns",columns);
		return (
			<div className="modal fade" id="turn-back-driver" tabIndex="-1">
				<ReactCustomLoading isLoading={this.state.loading} />
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">
								Nhập Hồi Lưu - Bước 2 - Thông Tin Tài Xế
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
								<div className="card-body">
									{/* <Popconfirm
                                        title={this.state.checkedINTurnBack === false ? "Bạn có muốn xóa lệnh nhập kho?" : "Bạn có muốn chọn lệnh nhập kho?"}
                                        onConfirm={this.handleConfirm}
                                        onCancel={this.handleCancel}
                                        okText={this.state.checkedINTurnBack === false ? "không" : "có"}
                                        cancelText={this.state.checkedINTurnBack === false ? "có" : "không"}
                                    > */}
									<Checkbox
										className="text-align-left"
										name="checkCarOut"
										id="checkCarOut"
										checked={this.state.checkedINTurnBack}
										onChange={this.handleOnChangeCheck}
									>
										<label>Xe ngoài</label>
									</Checkbox>
									{/* </Popconfirm> */}
									<div className="row">
										<div className="row">
											<div className="col-md-6">
												{this.state.checkedINTurnBack === false && (
													<div className="form-group">
														<label>{this.props.t("NAME_DRIVER")}</label>
														<Select
															showSearch
															style={{ width: "100%" }}
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
													</div>
												)}
												{this.state.checkedINTurnBack === true && (
													<div className="form-group">
														<label>{this.props.t("NAME_DRIVER")}</label>
														<Input
															className="form-control"
															type="text"
															placeholder="Nhập tài xế..."
															value={this.state.textDriver}
															onChange={this.handleTextDriver}
															style={{ width: "100%" }}
														/>
													</div>
												)}
											</div>
											<div className="col-md-6">
												<div className="form-group">
													<label>{this.props.t("LICENSE_PLATE")}</label>
													<Input
														className="form-control"
														type="text"
														name="license_plate"
														id="license_plate"
														validations={[required]}
													/>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group">
													<label>{this.props.t("NUMBER_CYLINDER")}</label>
													<Input
														className="form-control"
														type="text"
														disabled={true}
														name="number_cylinder"
														id="number_cylinder"
														value={this.state.number_cylinder}
													/>
												</div>
											</div>
											{/*{this.state.typeImport === Constant.IMPORT_TYPE ?<div className="col-md-6">*/}
											{/*    <label>Trạm chiết</label>*/}
											{/*    <Select className="form-control"*/}
											{/*            name="station"*/}
											{/*            validations={[required]}>*/}
											{/*        <option value="">-- Chọn --</option>*/}
											{/*        {this.props.listTurnBackStations.map((item) => <option value={item.id}>{item.name}</option>)}*/}

											{/*    </Select>*/}
											{/*</div> :null}*/}
											<div className="col-md-6">
												<div className="form-group">
													<div className="form-group">
														<label>Loại khách hàng</label>
														<Select
															style={{ width: "100%" }}
															placeholder="Chọn loại khách hàng..."
															onChange={this.handleChangeTypeCustomer}
															value={this.state.customerType[0]}
															>
															<Option value="Distribution_Agency">Đại lý phân phối</Option>
															<Option value="Industry">Khách hàng công nghiệp</Option>
															<Option value="Restaurant_Apartment">Nhà hàng, tòa nhà</Option>
														</Select>
													</div>

												</div>
											</div>
											
										</div>						
									</div>
									<div className="row">
											<div className="col-md-12">
												<Table 
													dataSource={this.state.product_parseType}
													columns ={columns}
													bordered={true}
													pagination={defaultPageSize}	
												>
												</Table>
											</div>														
									</div>
								</div>

								<footer className="card-footer text-center">
									<Button className="btn btn-primary" type="submit">
										Lưu
									</Button>
									<button
										className="btn btn-secondary"
										type="reset"
										data-dismiss="modal"
										style={{ marginLeft: "10px" }}
									>
										{this.props.t("CLOSE")}
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

export default withNamespaces()(TurnBackDriverFactoryPopup);
