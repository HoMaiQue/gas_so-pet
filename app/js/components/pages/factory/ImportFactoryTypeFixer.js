import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Button from "react-validation/build/button";
import required from "required";
import Constants from "Constants";
import showToast from "showToast";
import createHistoryAPI from "createHistoryAPI";
import SelectMulti from "react-select";
import { withNamespaces } from "react-i18next";

import { NAMEDRIVE, GETDRIVERIMPORTCYLINDER } from "./../../../config/config";
import callApi from "./../../../util/apiCaller";
import getUserCookies from "./../../../helpers/getUserCookies";
import { Select } from "antd";
import ReactCustomLoading from "ReactCustomLoading";

const Option = Select.Option;

class ImportDriverTypeCylinder extends React.Component {
	constructor(props) {
		super(props);
		this.form = null;
		this.state = {
			content: "",
			listProducts: [],
			AgencyResults: [],
			GeneralResults: [],
			typeUser: [],
			ListUserSubmit: "",
			ListUserSubmitID: "",
			nameDriver: "",
			idDriver: "",
			listDriver: [],
		};
	}

	async addHistory(
		driver,
		license_plate,
		cylinders,
		number_cylinder,
		idDriver,
		sign,
		fromId,
		cylinderImex,
		idImex,
		typeImex,
		flow
	) {
		const { typeExportCylinder } = this.props;
		// Call api
		// console.log(this.state.ListUserSubmitID);
		//var toId = isFixer ? parentRoot : this.state.ListUserSubmitID
		// console.log('register:::: ', typeExportCylinder);
		this.setState({ isLoading: true });
		const user = await createHistoryAPI(
			driver,
			license_plate,
			cylinders,
			Constants.IMPORT_TYPE,
			this.state.ListUserSubmitID,
			"",
			"",
			fromId,
			"",
			number_cylinder,
			"",
			"",
			"",
			typeExportCylinder,
			"",
			idDriver,
			sign,
			cylinderImex,
			idImex,
			typeImex,
			flow
		);
		this.setState({ isLoading: false });
		//console.log('register',user);
		if (user) {
			if (
				user.status === Constants.HTTP_SUCCESS_CREATED ||
				user.status === Constants.HTTP_SUCCESS_BODY
			) {
				showToast("Nhập hàng thành công!", 3000);
				this.props.handleChangeTypeExportCylinderEmpty();
				const modal = $("#import_factory_fixer");
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

	handleChangeGeneral = (langValue) => {
		this.setState({
			ListUserSubmit: langValue,
			ListUserSubmitID: langValue.id,
		});
	};

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
		/*console.log("data full",this.state.productInfo);
        let user_cookie = await getUserCookies();
        console.log("cookie 123",user_cookie);
        let token = "Bearer " + user_cookie.token;
        let params = {
          "id": user_cookie.user.id,
          "isChildOf": user_cookie.user.isChildOf,
          //"idFixer": 
        }
        await callApi("POST", GETDRIVERIMPORTCYLINDER, params, token).then(res => {
          if (res.data.data <= 0) {
            this.setState({
              listDriver: [{
                name: "Bạn chưa có tài xế",
                id: 'null'
              }]
            })
          }
          else {
            //console.log(user_cookie.user.id+""+res.data.data);
            this.setState({
              listDriver: res.data.data
            }, () => console.log(this.state.listDriver))
          }
        })*/
	}

	async submit(event) {
		this.setState({ loading: true });

		event.preventDefault();
		// console.log("data full",this.props.product_parse);
		// console.log("data nhan lai",this.props.product_parse[0].histories[this.props.product_parse[0].histories.length-1].from.id);
		let { listDriver } = this.state;
		let index = listDriver.findIndex((l) => l.id === this.state.idDriver);
		let nameDriver = listDriver[index].name;
		var cylinders = [];
		let cylinderImex = [];
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
		data.idDriver = listDriver[index].id;
		let sign = "Web signature";
		let idImex = Date.now();
		let typeImex = "IN";
		let flow = "IMPORT_CELL";

		await this.addHistory(
			nameDriver,
			data.license_plate,
			cylinders,
			data.number_cylinder,
			data.idDriver,
			sign,
			this.props.product_parse[0].histories[0].toArray[0].id,
			cylinderImex,
			idImex,
			typeImex,
			flow
		);
		await this.setState({ loading: false });
		return;
	}
	render() {
		const { listUserFixer } = this.props;
		const nameExport = "Sửa Chữa";
		//console.log("this.props.product_parse",this.props.product_parse);
		return (
			<div className="modal fade" id="import_factory_fixer" tabIndex="-1">
				<ReactCustomLoading isLoading={this.state.loading} />
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">
								Nhập bình - Bước 2 - Thông Tin Tài Xế
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
								onSubmit={(event) =>
									this.submit(event, this.props.typeExportCylinder)
								}
							>
								<div className="card-body custom-scroll-table">
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
												<label>{this.props.t("LICENSE_PLATE")} </label>
												<Input
													className="form-control"
													type="text"
													name="license_plate"
													id="license_plate"
													validations={[required]}
												/>
											</div>
										</div>
										{/*  <div className="col-md-6">
                                            <div className="form-group">
                                                <label>{nameExport}</label>
                                                <SelectMulti.Creatable
                                                    multi={true}
                                                    options={listUserFixer}
                                                    onChange={this.handleChangeGeneral.bind(this)}
                                                    placeholder="Chọn..."
                                                    value={this.state.ListUserSubmit}
                                                />
                                            </div>
                                        </div>*/}

										{/*<div className="col-md-6">*/}
										{/*    <div className="form-group">*/}
										{/*        <label>Số lượng bình không mã</label>*/}
										{/*        <Input className="form-control" type="text" name="number_cylinder"*/}
										{/*               id="number_cylinder"/>*/}
										{/*    </div>*/}
										{/*</div>*/}
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

export default withNamespaces()(ImportDriverTypeCylinder);
