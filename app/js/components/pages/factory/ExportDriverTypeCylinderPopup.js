// Xuất Vỏ Bình - Bước 2
import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Button from "react-validation/build/button";
import required from "required";
import Constants from "Constants";
import showToast from "showToast";
import createHistoryAPI from "createHistoryAPI";
import SelectMulti from "react-select";
import getAllPartnerAPI from "getPartnerAPI";
import getDestinationUserAPI from "getDestinationUserAPI";

import { NAMEDRIVE } from "./../../../config/config";
import callApi from "./../../../util/apiCaller";
import getUserCookies from "./../../../helpers/getUserCookies";
import { Select } from "antd";
import { GETRENTALPARTNER } from "./../../../config/config";
import { withNamespaces } from "react-i18next";
import ReactCustomLoading from "ReactCustomLoading";

const Option = Select.Option;

class ExportDriverTypeCylinderPopup extends React.Component {
	constructor(props) {
		super(props);
		this.form = null;
		this.state = {
			content: "",
			listProducts: [],
			AgencyResults: [],
			GeneralResults: [],
			typeUser: [],
			ListUserSubmit: [],
			ListUserSubmitID: "",
			nameDriver: "",
			idDriver: "",
			listDriver: [],
			listFixerExportCell: [],
			listRenterExportCell: [],
			loading: false,
			isOutside: false,
			dataListDriver: [],
		};
	}

	async addHistory(
		driver,
		license_plate,
		typeExportCylinder,
		number_array,
		toArray,
		cylindersWithoutSerial,
		cylinders,
		idDriver,
		sign,
		cylinderImex,
		idImex,
		typeImex,
		flow
	) {
		this.setState({ isLoading: true });
		const user = await createHistoryAPI(
			driver,
			license_plate,
			cylinders,
			Constants.EXPORT_TYPE,
			this.state.ListUserSubmitID,
			"",
			cylindersWithoutSerial,
			"",
			toArray,
			number_array,
			"",
			"",
			"",
			this.props.typeExportCylinder,
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
				showToast(this.props.t("EXP_COMPLETE"), 3000);
				this.props.handleChangeTypeExportCylinderEmpty();
				const modal = $("#export-driver-type-cylinder");
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
			showToast(this.props.t("ERROR_CREATE_CYLINDER"));
			return false;
		}
		this.setState({ ListUserSubmit: [] });
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

	async componentDidMount() {
		let user_cookie = await getUserCookies();
		let token = "Bearer " + user_cookie.token;
		let id = user_cookie.user.id;
		let params = {
			id: user_cookie.user.id,
		};

		await callApi("POST", NAMEDRIVE, params, token).then((res) => {
			if (res.data.data <= 0) {
				this.setState({
					listDriver: [
						{
							name: this.props.t("NO_DRIVER"),
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

		await this.getAllRentalPartner(id, token);
	}

	componentDidUpdate(prevProps) {
		// Typical usage (don't forget to compare props):
		if (this.props.listFixerExportCell !== prevProps.listFixerExportCell) {
			this.setState({ listFixerExportCell: this.props.listFixerExportCell });
		}
		if (this.props.listRenterExportCell !== prevProps.listRenterExportCell) {
			this.setState({ listRenterExportCell: this.props.listRenterExportCell });
		}
	}

	async getAllRentalPartner(id, token) {
		//const jobMetaData = await this.getJobMetaData();
		let params = {
			id: id,
		};

		await callApi("POST", GETRENTALPARTNER, params, token).then((res) => {
			// console.log("rent partner", res.data);
			if (res.data) {
				if (res.data.status === true) {
					this.setState({ listUsers: res.data.data });
				} else {
					showToast(
						res.data.message ? res.data.message : res.data.err_msg,
						2000
					);
					return false;
				}
			} else {
				showToast(this.props.t("ERROR_GET_DATA"));
			}
		});
	}

	async submit(event) {
		this.setState({ loading: true });
		event.preventDefault();
		let data = this.form.getValues();
		let { listDriver } = this.state;
		let index, nameDriver;
		if (this.state.isOutside === false) {
			index = listDriver.findIndex((l) => l.id === this.state.idDriver);
			nameDriver = listDriver[index].name;
			data.idDriver = listDriver[index].id;
		} else {
			index = "";
			nameDriver = data.name_driver;
			data.idDriver = "";
		}

		var cylinders = [];
		let cylinderImex = [];
		for (let i = 0; i < this.props.product_parse.length; i++) {
			cylinders.push(this.props.product_parse[i].id);
			cylinderImex.push({
				id: this.props.product_parse[i].id,
				status: "EMPTY",
				//empty
				condition: "NEW",
			});
		}
		let idImex = Date.now();
		let typeImex = "OUT";

		let sign = "Web signature";
		// console.log(data);
		let toArray = [];
		let numberArray = [];
		let flow = "EXPORT_CELL";
		let listUserSubmit = this.state.ListUserSubmit;
		if (listUserSubmit.length === 0) {
			this.setState({ loading: false });
			showToast(this.props.t("CHOOSE_PLACE_EXPORT"));
			return;
		} else {
			for (let i = 0; i < listUserSubmit.length; i++) {
				toArray.push(listUserSubmit[i].value);
				numberArray.push(data["numberGeneral" + i]);
			}
		}
		await this.addHistory(
			nameDriver,
			data.license_plate,
			"",
			numberArray,
			toArray,
			data.number_cylinder,
			cylinders,
			data.idDriver,
			sign,
			cylinderImex,
			idImex,
			typeImex,
			flow
		);
		await this.setState({ loading: false });
		return;
	}

	handleChangeTypeDrive = () => {
		this.setState({ isOutside: !this.state.isOutside });
	};
	render() {
		const nameExport =
			this.props.typeExportCylinder === Constants.RENT
				? this.props.t("PART_RENT")
				: this.props.typeExportCylinder === Constants.BUY
				? this.props.t("PART_BUY_SOPET")
				: this.props.typeExportCylinder === Constants.RETURN_CYLINDER
				? this.props.t("EXP_RETURN")
				: this.props.t("FIX_TITLE");
		const { listFixerExportCell, listRenterExportCell } = this.state;
		console.log("Test state", this.state.listDriver);
		return (
			<div
				className="modal fade"
				id="export-driver-type-cylinder"
				tabIndex="-1"
			>
				<ReactCustomLoading isLoading={this.state.loading} />
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">{this.props.t("EXP_2_DRIVER")}</h5>
							<button
								type="button"
								className="close"
								data-dismiss="modal"
								onClick={() => this.setState({ ListUserSubmit: [] })}
							>
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
								<div className="card-body">
									<div className="row">
										<div className="col-md-12">
											<label style={{ fontSize: "16px" }}>
												{this.props.t("USE_CAR_OUTSIDE")}
											</label>

											<input
												type="checkbox"
												name="site_name"
												value={this.state.isOutside}
												onChange={this.handleChangeTypeDrive}
												style={{ margin: "0 0.5rem" }}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-6">
											<div className="form-group">
												<label>{this.props.t("NAME_DRIVER")}</label>

												{!this.state.isOutside ? (
													<Select
														showSearch
														style={{ width: "100%" }}
														placeholder={this.props.t("CHOOSE")}
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
												) : (
													<Input
														className="form-control"
														type="text"
														name="name_driver"
														id="name_driver"
														validations={[required]}
													/>
												)}
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
										<div className="col-md-6">
											<div className="form-group">
												<label>{nameExport}</label>
												<SelectMulti.Creatable
													multi={true}
													options={
														// this.props.typeExportCylinder !== Constants.TO_FIX ? this.props.allChildOf : this.props.listUsersPartner
														this.props.typeExportCylinder === Constants.TO_FIX
															? listFixerExportCell
															: this.props.typeExportCylinder === Constants.RENT
															? listRenterExportCell
															: this.props.listUsersPartner
													}
													onChange={this.handleChangeGeneral.bind(this)}
													placeholder={this.props.t("CHOOSE")}
													value={this.state.ListUserSubmit}
												/>
											</div>
										</div>
										{this.props.typeExportCylinder !==
										Constants.TO_FIX ? null : (
											<div className="col-md-6">
												<div className="form-group">
													<label>{this.props.t("NUM_CYL_NO_CODE")}</label>
													<Input
														className="form-control"
														type="number"
														name="number_cylinder"
														id="number_cylinder"
														//validations={[required]}
													/>
												</div>
											</div>
										)}

										<div className="col-md-6">
											<table
												className="table table-striped table-bordered seednet-table-keep-column-width"
												cellSpacing="0"
											>
												<tbody className="display-block display-tbody">
													{this.state.ListUserSubmit.map((store, index) => {
														return (
															<tr key={index}>
																<td scope="row" className="text-center">
																	{store.name}
																</td>
																<td scope="row" className="text-center">
																	<Input
																		name={"numberGeneral" + index}
																		placeholder={this.props.t("INPUT_NUM")}
																		validations={[required]}
																		className="form-control"
																		type="number"
																	/>
																</td>
															</tr>
														);
													})}
												</tbody>
											</table>
										</div>
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
										onClick={() => this.setState({ ListUserSubmit: [] })}
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

export default withNamespaces()(ExportDriverTypeCylinderPopup);
