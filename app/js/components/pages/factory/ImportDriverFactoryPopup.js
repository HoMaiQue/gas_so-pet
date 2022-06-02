import React from "react";
import PropType from "prop-types";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
//import Select from 'react-validation/build/select';
import Button from "react-validation/build/button";
import required from "required";
import Constant from "Constants";
import showToast from "showToast";
import { withNamespaces } from "react-i18next";

import createHistoryAPI from "createHistoryAPI";
import { NAMEDRIVE, GETDRIVERIMPORTCYLINDER } from "./../../../config/config";
import callApi from "./../../../util/apiCaller";
import getUserCookies from "./../../../helpers/getUserCookies";
import { Select } from "antd";
import ReactCustomLoading from "ReactCustomLoading";
const Option = Select.Option;

class ImportDriverFactoryPopup extends React.Component {
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
		};
	}

	async addHistory(
		driver,
		license_plate,
		cylinders,
		type,
		stationId,
		idDriver,
		sign,
		fromId,
		cylinderImex,
		idImex,
		typeImex,
		flow,
		to
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
			stationId,
			fromId,
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
			to
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
				const modal = $("#import-driver");
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

		//this.setState({registerSuccessful: false});
	}

	handleChangeDriver = (value) => {
		this.setState({
			idDriver: value,
		});
	};

	async componentDidUpdate(prevProps) {
		if (this.props.product_parse !== prevProps.product_parse) {
			// console.log("did update");
			let user_cookie = await getUserCookies();
			let token = "Bearer " + user_cookie.token;
			let params = {
				id: this.props.product_parse[0].histories[
					this.props.product_parse[0].histories.length - 1
				].from.id,
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
					this.setState(
						{
							listDriver: res.data.data,
						},
						() => console.log(this.state.listDriver)
					);
				}
			});
		}
	}

	async componentDidMount() {
		// let user_cookie = await getUserCookies();
		// let token = "Bearer " + user_cookie.token;
		// let params = {
		//   "id": user_cookie.user.id,
		//   "isChildOf": user_cookie.user.isChildOf
		// }
		// await callApi("POST", GETDRIVERIMPORTCYLINDER, params, token).then(res => {
		//   if (res.data.data <= 0) {
		//     this.setState({
		//       listDriver: [{
		//         name: "Bạn chưa có tài xế",
		//         id: 'null'
		//       }]
		//     })
		//   }
		//   else {
		//     //console.log(user_cookie.user.id+""+res.data.data);
		//     this.setState({
		//       listDriver: res.data.data
		//     },
		//      () => console.log(this.state.listDriver))
		//   }
		// })
	}

	async submit(event) {
		event.preventDefault();
		// console.log("data nhan lai",this.props.product_parse[0].histories[0].from.id);
		let { listDriver } = this.state;
		this.setState({
			loading: true,
		});
		let index = listDriver.findIndex((l) => l.id === this.state.idDriver);
		let nameDriver = listDriver[index].name;
		let user_cookies = await getUserCookies();
		// var products=await this.getAllCylenders();
		var cylinders = [];
		var cylinderImex = [];
		for (let i = 0; i < this.props.product_parse.length; i++) {
			cylinders.push(this.props.product_parse[i].id);
			cylinderImex.push({
				id: this.props.product_parse[i].id,
				status: "FULL",
				//emty
				condition: "NEW",
			});
		}

		let data = this.form.getValues();
		data.idDriver = listDriver[index].id;
		let sign = "Web signature";
		let idImex = Date.now();
		let typeImex = "IN";
		let flow = "IMPORT";
		console.log(
			"this.props.product_parse[0].histories[this.props.product_parse[0].histories.length-1].from.id",
			this.props.product_parse[0].histories[
				this.props.product_parse[0].histories.length - 1
			].from.id
		);
		await this.addHistory(
			nameDriver,
			data.license_plate,
			cylinders,
			Constant.IMPORT_TYPE,
			data.station,
			data.idDriver,
			sign,
			this.props.product_parse[0].histories[
				this.props.product_parse[0].histories.length - 1
			].from.id,
			cylinderImex,
			idImex,
			typeImex,
			flow,
			user_cookies.user.id
		);
		//no
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

	async handleChangeTypeImport(event) {
		this.setState({ typeImport: event.target.value });
	}

	render() {
		return (
			<div className="modal fade" id="import-driver" tabIndex="-1">
				<ReactCustomLoading isLoading={this.state.loading} />
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">
								Nhập Bình - Bước 2 - Thông Tin Tài Xế
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
									<div className="row">
										<div className="col-md-6">
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
										{/*<div className="col-md-6">*/}
										{/*    <div className="form-group">*/}
										{/*        <label>Loại nhập</label>*/}
										{/*        <Select className="form-control"*/}
										{/*                name="import_type"*/}
										{/*                onChange={(event) => this.handleChangeTypeImport(event)}*/}
										{/*                validations={[required]}>*/}
										{/*            <option value="">-- Chọn --</option>*/}
										{/*            <option value={Constant.TURN_BACK_TYPE}>Nhập hồi lưu</option>*/}
										{/*            <option value={Constant.IMPORT_TYPE}>Nhập từ trạm chiết</option>*/}
										{/*        </Select>*/}
										{/*    </div>*/}

										{/*</div>*/}
										{/*{this.props.typeImport === Constant.IMPORT_TYPE ? <div className="col-md-6">*/}
										{/*    <label>Trạm chiết</label>*/}
										{/*    <Select className="form-control"*/}
										{/*            name="station"*/}
										{/*            validations={[required]}>*/}
										{/*        <option value="">-- Chọn --</option>*/}
										{/*        {this.props.listTurnBackStations.map((item) => <option*/}
										{/*            value={item.id}>{item.name}</option>)}*/}

										{/*    </Select>*/}
										{/*</div> : null}*/}
									</div>
								</div>
								<footer className="card-footer text-center">
									<Button className="btn btn-primary" type="submit">
										{this.props.t("SAVE")}
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

export default withNamespaces()(ImportDriverFactoryPopup);
