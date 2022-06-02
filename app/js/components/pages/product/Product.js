import React from "react";
import "./product.scss";
import AddProductPopupContainer from "./AddProductPopupContainer";

import EditProductPopupContainer from "./EditProductPopupContainer";

import AddProductExcelPopup from "./AddProductExcelPopup";
import AddProductExcelWarehousePopup from "./AddProductExcelWarehousePopup";
import { Row, Col } from "antd";

import showToast from "showToast";
import Constants from "Constants";
import Constant from "Constants";
import searchAllCylinderBySerialAPI from "searchAllCylinderBySerialAPI";
import searchCylinderAPI from "searchCylinder";
import listHistoryPriceApi from "listPriceHistory";
import ExportStationPopup from "../station/ExportStationPopup";
import ImportStationPopup from "../station/ImportStationPopup";
import ImportDriverStationPopup from "../station/ImportDriverStationPopup";
import ExportDriverFactoryPopup from "../factory/ExportDriverFactoryPopup";
import ExportDriverFactoryPopupNew from "../general/export-new/ExportDriverFactoryPopupNew";
import ExportFactoryPopup from "../factory/ExportFactoryPopup";
import ExportFactoryPopupNew from "../general/export-new/ExportFactoryPopupNew";
import ImportFactoryPopup from "../factory/ImportFactoryPopup";
import ImportDriverFactoryPopup from "../factory/ImportDriverFactoryPopup";
import TurnBackDriverFactoryPopup from "../factory/TurnBackDriverFactoryPopup";
import TurnBackFactoryPopup from "../factory/TurnbackFactoryPopup";
import TypeTurnBackPopup from "../factory/TypeTurnBackPopup";
import TurnBackDriverInCustomer from "../factory/TurnBackDriverInCustomer";
import HistoryPricePopup from "./HistoryPricePopup";
import TypeExportCylinderPopup from "../factory/TypeExportCylinderPopup";
import getUserCookies from "getUserCookies";
import ExportFactoryStationPopup from "../factory/ExportFactoryStationPopup";
import ExportCylinderInformation from "../factory/ExportCylinderInformation";
import ImportCylinderInformation from "../factory/ImportCylinderInformation";
import getListFixerPartnerApi from "getListFixerPartner";
//import ExportDriverFactoryStationPopup from "../factory/ExportDriverFactoryStationPopup";
import required from "required";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import SelectMulti from "react-select";
import Button from "react-validation/build/button";
import createHistoryAPI from "createHistoryAPI";
import deleteProductAPI from "deleteProductAPI";
import getDestinationUserAPI from "getDestinationUserAPI";
import getExportPlaceAPI from "getExportPlace";
import UltiHelper from "UltiHelper";
import ExportBackFactoryPopup from "../factory/ExportBackFactoryPopup";
import ExporBackDriverFactoryPopup from "../factory/ExporBackDriverFactoryPopup";
import ExportTypeCylinderPopup from "../factory/ExportTypeCylinderPopup";
import ExportDriverTypeCylinderPopup from "../factory/ExportDriverTypeCylinderPopup";
import ExportCylinderToFactoryPopup from "../Fixer/ExportCylinderToFactoryPopup";
import ImportCylinderForFixer from "../Fixer/ImportCylinderForFixer";
import TypeForPartnerPopup from "../factory/TypeForPartnerPopup";
import updatePriceAPI from "updatePriceAPI";
import debounce from "debounce";
import getAllPartnerAPI from "getPartnerAPI";
import ImportDriverTypeCylinder from "../factory/ImportDriverTypeCylinder";
import ImportDriverTypeFixer from "../factory/ImportDriverTypeFixer";
import ImportFactoryTypeFixer from "../factory/ImportFactoryTypeFixer";
import ExportFixerPopup from "../factory/ExportFixerPopup";
import UpdateDateCylinders from "../Fixer/updateDateCylinders";
import PaginationComponent from "../../PaginationComponent";
import RequestExcel from "./../../sen-request-create-lpg/index";
import ListRequest from "./../list-request-create-lpg/index";
import { GETALLCHILD } from "./../../../config/config";
import callApi from "./../../../util/apiCaller";
import checkPosition from "./helper";
import { withNamespaces } from "react-i18next";
import getAllFixer_ExportCellAPI from "../../../../api/getAllFixer_ExportCellAPI";
import getAllRenter_ExportCellAPI from "../../../../api/getAllRenter_ExportCellAPI";
import ReactCustomLoading from "ReactCustomLoading";

class Product extends React.Component {
	constructor(props) {
		super(props);
		this.formUpdatePrice = null;
		this.formBuyCylinder = null;
		this.state = {
			formone: false,
			dataProducts: [],
			product_id: null,
			product_parse: [],
			user_type: "",
			user_role: "",
			parentRoot: "",
			store: "",
			productResult: [],
			pickProduct: { serial: "", currentImportPrice: 0, status: "FULL" },
			searchKey: "",
			currentSkip: 0,
			isDisabledNext: false,
			listTurnBackStations: [],
			listExportStations: [],
			listFactoryExports: [],
			listStationImports: [],
			listFactoryBacks: [],
			searchString: "",
			dataSearchProducts: [],
			pageLast: true,
			typeImport: "",
			typeExportCylinder: "",
			listUsersPartner: [],
			listUserFixer: [],
			listExportPlace: [],
			total: 0,
			activePage: 1,
			user_cookies: "",
			circleCount: 0,
			allChildOf: [],
			// togglePopup: false,
			listFixerExportCell: [],
			listRenterExportCell: [],
			loading: false,
		};
	}

	// async getListFixer() {
	//     const dataUsers = await getDestinationUserAPI(Constants.FIXER);
	//     if (dataUsers) {
	//         if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
	//             let listFactoryBacks = [];
	//             for (let i = 0; i < dataUsers.data.length; i++) {
	//                 listFactoryBacks.push({
	//                     value: dataUsers.data[i].id,
	//                     label: dataUsers.data[i].name, ...dataUsers.data[i]
	//                 })
	//             }
	//
	//             this.setState({listUserFixer: listFactoryBacks});
	//         } else {
	//             showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
	//         }
	//
	//         //this.setState({image_link: profile.data.company_logo});
	//     } else {
	//         showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
	//     }
	// }
	async getListFixer() {
		const dataUsers = await getDestinationUserAPI(Constants.FIXER);
		if (dataUsers) {
			if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
				let listFactoryBacks = [];
				// console.log("dataUsers.data", dataUsers.data);
				for (let i = 0; i < dataUsers.data.length; i++) {
					listFactoryBacks.push({
						value: dataUsers.data[i].id,
						label: dataUsers.data[i].name,
						...dataUsers.data[i],
					});
				}

				this.setState({ listUserFixer: listFactoryBacks });
			} else {
				// showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
			}

			//this.setState({image_link: profile.data.company_logo});
		} else {
			showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
		}
	}

	// Lấy danh sách nhà máy sửa chữa cho chức năng xuất vỏ
	getUserByType_ExportCell = async () => {
		// let that = this
		// console.log('getUserByType_ExportCell')
		const { typeExportCylinder } = this.state;
		if (typeExportCylinder === "TO_FIX") {
			const dataUsers = await getAllFixer_ExportCellAPI();
			// if (dataUsers) {
			if (dataUsers.status === true) {
				let listFactoryBacks = [];
				// console.log("dataUsers.data", dataUsers.data);
				for (let i = 0; i < dataUsers.data.length; i++) {
					listFactoryBacks.push({
						value: dataUsers.data[i].id,
						label: dataUsers.data[i].name,
						// ...dataUsers.data[i],
					});
				}

				// console.log('listFactoryBacks', listFactoryBacks)
				this.setState({ listFixerExportCell: listFactoryBacks });
			} else {
				// showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
				console.log("getListFixer: ", dataUsers.message);
			}
			// } else {
			//   showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
			// }
		}
		if (typeExportCylinder === "RENT") {
			const dataUsers = await getAllRenter_ExportCellAPI();
			// if (dataUsers) {
			if (dataUsers.status === true) {
				let listFactoryBacks = [];
				// console.log("dataUsers.data", dataUsers.data);
				for (let i = 0; i < dataUsers.data.length; i++) {
					listFactoryBacks.push({
						value: dataUsers.data[i].id,
						label: dataUsers.data[i].name,
						// ...dataUsers.data[i],
					});
				}

				// console.log('listFactoryBacks', listFactoryBacks)
				this.setState({ listRenterExportCell: listFactoryBacks });
			} else {
				// showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
				console.log("getListRenter: ", dataUsers.message);
			}
			// } else {
			//   showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
			// }
		}
	};

	async getAllChildOf(isChildOf, token) {
		let param = {
			isChildOf: isChildOf,
		};
		await callApi("POST", GETALLCHILD, param, token).then((res) => {
			const temp = [];
			for (let i = 0; i < res.data.childCompany.length; i++) {
				temp.push({
					value: res.data.childCompany[i].id,
					label: res.data.childCompany[i].name,
					...res.data.childCompany[i],
				});
			}
			this.setState({
				allChildOf: temp ? temp : ["no result"],
			});
		});
		//console.log("data fixer test",dataUsers.data.childCompany);
	}

	async getAllPartner() {
		//const jobMetaData = await this.getJobMetaData();
		const dataUserRelation = await getAllPartnerAPI("Owner");
		if (dataUserRelation) {
			if (dataUserRelation.status === Constants.HTTP_SUCCESS_BODY) {
				let listFactoryExports = [];
				for (let i = 0; i < dataUserRelation.data.length; i++) {
					listFactoryExports.push({
						value: !!dataUserRelation.data[i]
							? dataUserRelation.data[i].id
							: "",
						label: !!dataUserRelation.data[i]
							? dataUserRelation.data[i].name
							: "",
						...dataUserRelation.data[i],
					});
				}
				this.setState({ listUsersPartner: listFactoryExports });
			} else {
				showToast(
					dataUserRelation.data.message
						? dataUserRelation.data.message
						: dataUserRelation.data.err_msg,
					2000
				);
			}

			//this.setState({image_link: profile.data.company_logo});
		} else {
			showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
		}
	}

	handleChangeProducts = (langValue) => {
		this.setState({ productResult: langValue });
	};

	handleChangeTypeExportCylinder(data) {
		this.setState({ typeExportCylinder: data });
	}

	handleChangeTypeExportCylinderEmpty() {
		this.setState({ typeExportCylinder: "" });
	}

	refresh() {
		this.forceUpdate(async () => {
			this.setState({ product_id: null });
			if (
				typeof this.search_keyRef !== "undefined" &&
				this.search_keyRef !== null &&
				this.search_keyRef.value !== ""
			) {
				this.searchCylinder(this.search_keyRef.value, 1);
			}
			await this.getListFixer();
		});
	}

	async onUpdatePrice(e) {
		e.preventDefault();
		let data = this.formUpdatePrice.getValues();

		let resultUpdate = await updatePriceAPI(
			this.state.pickProduct.id,
			data.price_buy
		);

		if (resultUpdate) {
			const modal = $("#edit-price");
			modal.modal("hide");
			if (
				typeof this.search_keyRef !== "undefined" &&
				this.search_keyRef !== null &&
				this.search_keyRef.value !== ""
			) {
				this.searchCylinder(this.search_keyRef.value, 0);
			}
			showToast(
				"Cập nhật giá cho bình " +
					this.state.pickProduct.serial +
					" thành công."
			);
		} else {
			showToast("Cập nhật giá thất bại. Liên hệ quản trị viên");
		}
	}

	onNextStepBuyCylinder(e) {
		e.preventDefault();
	}

	async submitBuyCylinder(e) {
		e.preventDefault();
		const driver = "DRIVER",
			license_plate = "DRIVER_CAR";
		const listCylinders = this.state.productResult;
		this.setState({
			loading: true,
		});
		// console.log(listCylinders);
		// Call api

		let cylinderImex = [];
		let cylinders = [];
		for (let i = 0; i < listCylinders.length; i++) {
			cylinders.push(listCylinders[i].id);
			cylinderImex.push({
				id: listCylinders[i].id,
				status: "FULL",
				condition: "NEW",
			});
		}
		let idImex = Date.now();
		let typeImex = "OUT";
		let flow = "SALE";

		const data = this.formBuyCylinder.getValues();
		const user = await createHistoryAPI(
			driver,
			license_plate,
			cylinders,
			Constant.SALE_TYPE,
			"",
			"",
			"",
			undefined,
			"",
			"",
			data.phoneCustomer,
			data.nameCustomer,
			data.addressCustomer,
			"",
			"",
			null,
			"Bán cho người dân",
			cylinderImex,
			idImex,
			typeImex,
			flow
		);

		//console.log('register',user);
		if (user) {
			if (
				user.status === Constant.HTTP_SUCCESS_CREATED ||
				(user.status === Constant.HTTP_SUCCESS_BODY &&
					!user.data.hasOwnProperty("err_msg"))
			) {
				showToast("Đã bán hàng thành công", 2000);
				// this.props.refresh('color');
				// const modal = $("#buy-cylinder");
				// modal.modal('open');
				const modal = $("#customer-info");
				this.setState({
					loading: false,
				});
				modal.modal("hide");
				// window.location.reload();
			} else {
				showToast(
					user.data.message ? user.data.message : user.data.err_msg,
					2000
				);
				if (user.data.err_msg) {
					const modal = $("#buy-cylinder");
					modal.modal("show");
					const modal2 = $("#customer-info");
					this.setState({
						loading: false,
					});
					modal2.modal("hide");
				}
			}
			// const modaL2 = $("#customer-info");
			// modal.modal2('hide');
			const modal = $("#buy-cylinder");
			this.setState({
				loading: false,
			});
			modal.modal("hide");
		} else {
			showToast("Xảy ra lỗi trong quá trình tạo bình ");
			const modal = $("#customer-info");
			this.setState({
				loading: false,
			});
			modal.modal("hide");
			return false;
		}
		//this.setState({registerSuccessful: false});
	}

	async deleteProduct(id) {
		const productResult = await deleteProductAPI(id);

		//console.log('register',user);
		if (productResult) {
			if (productResult.status === Constants.HTTP_SUCCESS_BODY) {
				showToast("Xóa Thành Công!", 3000);
				this.searchCylinder(this.search_keyRef.value, 0);
				return true;
			} else {
				showToast(
					productResult.data.message
						? productResult.data.message
						: productResult.data.err_msg,
					2000
				);
				return false;
			}
		} else {
			showToast("Xảy ra lỗi trong quá trình xóa người dùng ");
			return false;
		}
	}

	async componentDidMount() {
		//const jobMetaData = await this.getJobMetaData();

		//this.searchCylinder("123123");

		let user_cookies = await getUserCookies();
		this.setState({
			user_cookies: user_cookies,
			user_type: user_cookies.user.userType,
			user_role: user_cookies.user.userRole,
			parentRoot: user_cookies.user.parentRoot,
		});
		// console.log("cookie truyen vao", this.state.user_cookies)

		// await this.getDestination("General", "TURN_BACK");
		// await this.getDestinationStationExport("General", "EXPORT");
		await this.getDestination("Station", "TURN_BACK");
		await this.getDestinationStationExport("Station", "EXPORT");
		if (
			(user_cookies.user.userType === "Factory" &&
				user_cookies.user.userRole !== "Deliver" &&
				this.state.user_role !== "Inspector") ||
			(user_cookies.user.userType === "General" &&
				user_cookies.user.userRole !== "Deliver")
		) {
			await this.getDestinationExport("", "EXPORT");
		} else if (
			user_cookies.user.userType === "Station" &&
			this.state.user_role !== "Deliver" &&
			this.state.user_role !== "Inspector"
		) {
			await this.getDestinationEXPORTPARENTCHILDStation(
				"",
				"EXPORT_PARENT_CHILD"
			);
		}

		await this.getDestinationImportStation("", "IMPORT");
		await this.getDestinationBackFactory("", "EXPORT");
		await this.getListFixer();
		await this.getAllPartner();
		await this.getExportPlace();
		// await this.getUserByType_ExportCell();
		let token = "Bearer " + user_cookies.token;
		await this.getAllChildOf(user_cookies.user.isChildOf, token);
	}

	async getExportPlace() {
		const data = await getExportPlaceAPI();
		if (data) {
			if (data.status === Constants.HTTP_SUCCESS_BODY) {
				let listExportPlace = [];
				for (let i = 0; i < data.data.length; i++) {
					listExportPlace.push({
						value: data.data[i].id,
						label: data.data[i].name,
						...data.data[i],
					});
				}

				this.setState({ listExportPlace: listExportPlace });
			} else {
				//chọn
				showToast(
					data.data.message ? data.data.message : data.data.err_msg,
					2000
				);
			}

			//this.setState({image_link: profile.data.company_logo});
		} else {
			showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
		}
	}

	async getDestinationBackFactory(user_type, action_type) {
		const dataUsers = await getDestinationUserAPI(user_type, action_type);

		if (dataUsers) {
			if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
				let listFactoryBacks = [];
				for (let i = 0; i < dataUsers.data.length; i++) {
					listFactoryBacks.push({
						value: dataUsers.data[i].id,
						label: dataUsers.data[i].name,
						...dataUsers.data[i],
					});
				}

				this.setState({ listFactoryBacks: listFactoryBacks });
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

	async getDestinationEXPORTPARENTCHILDStation(user_type, action_type) {
		const dataUsers = await getDestinationUserAPI(user_type, action_type);
		if (dataUsers) {
			if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
				let listFactoryExports = [];
				for (let i = 0; i < dataUsers.data.length; i++) {
					listFactoryExports.push({
						value: dataUsers.data[i].id,
						label: dataUsers.data[i].name,
						...dataUsers.data[i],
					});
				}

				this.setState({ listFactoryExports: listFactoryExports });
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

	async getDestinationImportStation(user_type, action_type) {
		const dataUsers = await getDestinationUserAPI(user_type, action_type);

		if (dataUsers) {
			if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
				let listStationImports = [];
				for (let i = 0; i < dataUsers.data.length; i++) {
					listStationImports.push({
						value: dataUsers.data[i].id,
						label: dataUsers.data[i].name,
						...dataUsers.data[i],
					});
				}

				this.setState({ listStationImports: listStationImports });
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

	async getDestinationExport(user_type, action_type) {
		const dataUsers = await getDestinationUserAPI(user_type, action_type);

		if (dataUsers) {
			if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
				let listFactoryExports = [];
				for (let i = 0; i < dataUsers.data.length; i++) {
					listFactoryExports.push({
						value: dataUsers.data[i].id,
						label: dataUsers.data[i].name,
						...dataUsers.data[i],
					});
				}

				this.setState({ listFactoryExports: listFactoryExports });
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

	async getDestination(user_type, action_type) {
		const dataUsers = await getDestinationUserAPI(user_type, action_type);

		if (dataUsers) {
			if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
				let listTurnBackStations = [];
				for (let i = 0; i < dataUsers.data.length; i++) {
					listTurnBackStations.push({
						value: dataUsers.data[i].id,
						label: dataUsers.data[i].name,
						...dataUsers.data[i],
					});
				}

				this.setState({ listTurnBackStations: listTurnBackStations });
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

	async getDestinationStationExport(user_type, action_type) {
		const dataUsers = await getDestinationUserAPI(user_type, action_type);

		if (dataUsers) {
			if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
				let listExportStations = [];
				for (let i = 0; i < dataUsers.data.length; i++) {
					listExportStations.push({
						value: dataUsers.data[i].id,
						label: dataUsers.data[i].name,
						...dataUsers.data[i],
					});
				}

				this.setState({ listExportStations: listExportStations });
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

	handleClickNextOrPreButton(type) {
		let { currentSkip, searchKey } = this.state;
		if (searchKey !== "") {
			if (type === 0) {
				currentSkip--;
				if (currentSkip < 0) {
					currentSkip = 0;
				}
			} else {
				if (!this.state.isDisabledNext) {
					currentSkip++;
				}
			}
			this.setState({ currentSkip });
			this.searchCylinder(searchKey, currentSkip);
		}
	}

	async handleClickSearch(page = this.state.activePage) {
		this.setState({
			loading: true,
		});
		if (this.search_keyRef.value === "") {
			showToast("Hãy nhập mã serial để quét");
		} else {
			await this.setState({
				searchKey: this.search_keyRef.value,
				currentSkip: 1,
			});
			await this.searchCylinder(this.search_keyRef.value, page);
		}
	}

	searchCylinderForBuyProduct = debounce(async (serial, page) => {
		//showToast(serial);
		if (serial !== "") {
			const dataSearchProducts = await searchAllCylinderBySerialAPI(
				serial,
				page
			);
			//console.log("dataSearchProducts",dataSearchProducts);
			if (dataSearchProducts) {
				if (dataSearchProducts.status === Constants.HTTP_SUCCESS_BODY) {
					for (let i = 0; i < dataSearchProducts.data.length; i++) {
						dataSearchProducts.data[i].value = dataSearchProducts.data[i].id;
						dataSearchProducts.data[i].label =
							dataSearchProducts.data[i].serial;
					}
					this.setState({ dataSearchProducts: dataSearchProducts.data });
				} else {
					showToast(
						dataSearchProducts.data.message
							? dataSearchProducts.data.message
							: dataSearchProducts.data.err_msg,
						2000
					);
				}

				//this.setState({image_link: profile.data.company_logo});
			} else {
				showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
			}
		}
	}, 100);

	async searchCylinder(serial, page) {
		//showToast(serial);

		const dataProducts = await listHistoryPriceApi(serial, page);
		// console.log("du lieu tim kiem",dataProducts);
		if (dataProducts) {
			if (
				dataProducts.status === Constants.HTTP_SUCCESS_BODY &&
				!dataProducts.data.hasOwnProperty("err_msg")
			) {
				this.setState({
					dataProducts: dataProducts.data.data,
					total: dataProducts.data.totalItem,
					loading: false,
				});
			} else {
				showToast(
					dataProducts.data.message
						? dataProducts.data.message
						: dataProducts.data.err_msg,
					2000
				);
				this.setState({
					loading: false,
				});
			}

			//this.setState({image_link: profile.data.company_logo});
		} else {
			showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
		}
	}

	async resetProductId() {
		this.setState({ product_id: null });
	}

	getListProducts(products) {
		this.setState({ product_parse: products });
	}

	handleAction() {
		if (
			(this.state.user_type === "Station" &&
				this.state.user_role !== "Deliver" &&
				this.state.user_role !== "Inspector") ||
			(this.state.user_type === "Agency" &&
				this.state.user_role !== "Deliver" &&
				this.state.user_role !== "Inspector" &&
				this.state.parentRoot !== "") ||
			(this.state.user_type === "Factory" &&
				this.state.user_role === "Owner") ||
			this.state.user_type === "Fixer" ||
			this.state.user_type === "General"
		) {
			return null;
		}
		return (
			<th className="w-100px text-center  align-middle">
				{this.props.t("ACTION")}
			</th>
		);
	}

	handleActionTable(store) {
		if (
			(this.state.user_type === "Station" &&
				this.state.user_role !== "Deliver" &&
				this.state.user_role !== "Inspector") ||
			(this.state.user_type === "Agency" &&
				this.state.user_role !== "Deliver" &&
				this.state.user_role !== "Inspector" &&
				this.state.parentRoot !== "") ||
			(this.state.user_type === "Factory" &&
				this.state.user_role === "Owner") ||
			this.state.user_type === "Fixer" ||
			this.state.user_type === "General"
		) {
			return null;
		}
		return (
			<td className="text-center table-actions">
				<a
					className="table-action hover-primary"
					data-toggle="modal"
					data-target="#edit-product"
					onClick={() => {
						this.setState({ product_id: store.id, store });
					}}
				>
					<i className="ti-pencil"></i>
				</a>
				{/* <a className="table-action hover-primary" data-toggle="modal"
                                                           data-target="#edit-price"
                                                           onClick={() => {
                                                               this.setState({product_id: store.id, pickProduct: store})
                                                           }}>
                                                            <i className="ti-check"></i></a> */}
				{/* {(this.state.user_type === "Factory" &&
          this.state.user_role !== "Deliver" &&
          this.state.user_role !== "Inspector") ||
          (this.state.user_type === "General" &&
            this.state.user_role !== "Deliver" &&
            this.state.user_role !== "Inspector") ||
          (this.state.user_type === "Agency" &&
            this.state.user_role !== "Deliver" &&
            this.state.user_role !== "Inspector" &&
            (this.state.user_role !== "SuperAdmin" ||
              this.state.user_role !== "Owner")) ? (
            <a
              className="table-action hover-primary"
              data-toggle="modal"
              data-target="#history-price"
              onClick={() => {
                this.setState({
                  product_id: store.id,
                  store,
                });
              }}
            >
              <i className="ti-eye"></i>
            </a>
          ) : null} */}
			</td>
		);
	}

	// togglePopup = () => {
	//   console.log('togglePopup clicked')
	//   const {
	//     _togglePopup
	//   } = this.state
	//   this.setState({_togglePopup: !_togglePopup})
	//   console.log('this.state._togglePopup', this.state._togglePopup)
	// }

	render() {
		console.log("userType", this.state.user_type);
		console.log("user_role", this.state.user_role);
		return (
			<div className="main-content">
				<ReactCustomLoading isLoading={this.state.loading} />
				<div className="card">
					<div className="card-title-product">
						<div className="card-product-left-product">
							<h4>{this.props.t("PRODUCT")}</h4>
							{this.state.user_role !== "Deliver" &&
								this.state.user_role !== "Inspector" && (
									<div className="input-group-product">
										<input
											ref={(re) => (this.search_keyRef = re)}
											type="text"
											placeholder={this.props.t("INPUT_CODE")}
										/>
										<button
											onClick={() => this.handleClickSearch()}
											className="btn btn-dark"
										>
											{this.props.t("SEARCH")}
										</button>
									</div>
								)}
						</div>

						<div className="card-product-right-product">
							{this.renderTurnbackButton()}
							{this.renderImportButton()}
							{this.renderExportButton()}
							{this.renderExportStationButton()}
							{this.state.user_type === "Station" &&
								this.state.user_role !== "Deliver" &&
								this.state.user_role !== "Inspector" && (
									<button
										className="btn btn-sm btn-create kiemdinh"
										data-toggle="modal"
										data-target="#export-modal"
									>
										Xuất Hàng
									</button>
								)}
							{((this.state.user_type === "Factory" &&
								this.state.user_role !== "Deliver" &&
								this.state.user_role !== "Inspector") ||
								// this.state.user_role === "SuperAdmin")
								(this.state.user_type === "Agency" &&
									this.state.user_role !== "Deliver" &&
									this.state.user_role !== "Inspector" &&
									this.state.parentRoot === "")) && (
								<button
									className="btn btn-sm btn-create excell kiemdinh"
									data-toggle="modal"
									data-target="#create-product"
									style={{ backgroundColor: "#ED383C" }}
								>
									{this.props.t("CREATE_NEW")}
								</button>
							)}
							{this.state.user_type === "Factory" &&
								this.state.user_role !== "Deliver" &&
								this.state.user_role !== "Inspector" &&
								this.state.user_role === "SuperAdmin" && (
									<button
										className="btn btn-sm btn-create excell kiemdinh"
										data-toggle="modal"
										data-target="#import-product"
										style={{ backgroundColor: "#ED383C" }}
									>
										{this.props.t("IMPORT_EXCEL")}
									</button>
								)}
								
							{this.state.user_type === "Factory" &&
								this.state.user_role === "Owner" && (
									<button
										className="btn btn-sm btn-create excell kiemdinh"
										data-toggle="modal"
										data-target="#import-product-warehouse"
										style={{ backgroundColor: "#ED383C" }}
									>
										{this.props.t("IMPORT_EXCEL")}
									</button>
								)}
							{this.renderExportFixerButton()}

							{/* {Bỏ chức năng 'yêu cầu tạo bình từ kho, nhà máy'} */}
							{/* {((this.state.user_type === "Factory" && this.state.user_role === "Owner") 
                  || this.state.user_type === "Fixer") && (
                      <button
                        className="btn btn-sm btn-success kiemdinh"
                        data-toggle="modal"
                        data-target="#create-request-excel"
                        // onClick={this.togglePopup}
                      >
                        Tạo bình bằng file excel
                      </button>
                    )} */}
							{/* {Bỏ chức năng 'Xác nhận yêu cầu tạo bình'} */}
							{/* {this.state.user_type === "Factory" &&
                    this.state.user_role === "SuperAdmin" && (
                      <button
                        className="btn btn-sm btn-warning kiemdinh"
                        data-toggle="modal"
                        data-target="#list-request"
                        style={{ backgroundColor: "#3454a5" }}
                      >
                        {this.props.t('REQUIRES')}
                      </button>
                    )} */}{
						this.state.user_type === "Factory" &&
				this.state.user_role === "Owner" &&
								 (
									 
									<button
										className="btn btn-sm btn-create kiemdinh"
										data-toggle="modal"
										data-target="#export-modal1"
									>
									Xuất hàng theo đại lý
									</button>
								)}
							{this.state.user_type !== Constants.FIXER &&
								this.state.user_type !== Constant.FACTORY &&
								this.state.user_role !== "Deliver" &&
								this.state.user_role !== "Inspector" && (
									<button
										className="btn btn-sm btn-warning kiemdinh"
										data-toggle="modal"
										data-target="#buy-cylinder"
									>
										Bán Hàng
									</button>
								)}
								{/* {this.state.user_type !== Constants.FIXER &&
								this.state.user_type !== Constant.FACTORY &&
								this.state.user_role !== "Deliver" &&
								this.state.user_role !== "Inspector" && (
									<button
										className="btn btn-sm btn-warning kiemdinh"
										data-toggle="modal"
										data-target="#buy-cylinder"
									>
										Bán Hàng
									</button>
								)} */}
							
						</div>
					</div>
					<div className="card-body">
						<div className="table-responsive-xl">
							<div className="dataTables_wrapper container-fluid dt-bootstrap4">
								<div className="row">
									<div className="col-sm-12">
										<table
											className="table table-striped table-bordered seednet-table-keep-column-width"
											cellSpacing="0"
										>
											<thead className="table__head">
												<tr>
													<th className="text-center w-70px align-middle">
														{this.props.t("ID_NUMBER")}
													</th>
													<th className="w-70px text-center align-middle">
														{this.props.t("CYLINDER_CODE")}
													</th>
													{/* <th className="w-70px text-center align-middle">TN sở hữu</th>
                                                <th className="w-70px text-center align-middle">TN mua bán</th>
                                                <th className="w-70px text-center align-middle">Cửa hàng</th>*/}
													<th className="w-70px text-center align-middle">
														{this.props.t("TYPE_CYLINDER")}
													</th>
													<th className="w-70px text-center align-middle">
														{this.props.t("COLOR")}
													</th>
													<th className="w-70px text-center align-middle">
														{this.props.t("TYPE_VALVE")}
													</th>
													<th className="w-70px text-center align-middle">
														{this.props.t("WEIGHT")}
													</th>
													<th className="w-70px text-center align-middle">
														{this.props.t("VERIFY_DATE")}
													</th>
													<th className="w-70px text-center align-middle">
														{this.props.t("NUM_LIFE_CYCLE")}
													</th>
													<th className="w-70px text-center align-middle">
														{this.props.t("LOCATION")}
													</th>
													{/*<th className="w-70px text-center align-middle">Trạng thái bình</th>*/}
													{/* <th className="w-70px text-center align-middle">Giá tham khảo</th>
                          <th className="w-70px text-center align-middle">Giá bán</th> */}
													<th className="w-70px text-center align-middle">
														{this.props.t("BRANCH")}
													</th>
													{/*<th className="w-100px align-middle">Vị trí</th>*/}
													{this.handleAction()}
												</tr>
											</thead>
											<tbody>
												{this.state.dataProducts.map((store, index) => {
													const moment = require("moment");

													const isCorrectFormat = (dateString, format) => {
														return moment(dateString, format).isValid();
													};
													// console.log(
													// 	"isCorrectFormat",
													// 	isCorrectFormat(
													// 		store.checkedDate,
													// 		"MM/DD/YYYY HH:mm:ss.SSS"
													// 	)
													// );

													return (
														<tr key={index}>
															<td scope="row" className="text-center">
																{index + 1}
															</td>
															<td scope="row" className="text-center">
																{store.serial}
															</td>
															<td scope="row" className="text-center">
																{store.cylinderType}
															</td>
															{/*<td scope="row" className="text-center">{store.factory?store.factory.name:''}</td>
                                                    <td scope="row" className="text-center">{store.general?store.general.name:''}</td>
                                                    <td scope="row" className="text-center">{store.agency?store.agency.name:''}</td>*/}
															<td scope="row" className="text-center">
																{store.color !== undefined ? store.color : ""}
															</td>
															<td scope="row" className="text-center">
																{store.valve}
															</td>
															<td scope="row" className="text-center">
																{store.weight}
															</td>
															<td scope="row" className="text-center">
																{/* moment(store.checkedDate).format("MM/DD/YYYY") */}
																{isCorrectFormat(
																	store.checkedDate,
																	"DD/MM/YYYY"
																) === true
																	? store.checkedDate
																	: moment(store.checkedDate).format(
																			"DD/MM/YYYY"
																	  )}
															</td>
															<td scope="row" className="text-center">
																{store.circleCount}
															</td>
															<td scope="row" className="text-center">
																{checkPosition(
																	Constant.PLACESTATUS_ENUM,
																	store,
																	this.state.user_cookies.user.id
																)}
															</td>
															{/*<td scope="row"*/}
															{/*    className="text-center">{Constant.STATUS_ENUM.find(o => o.key === store.status) !== undefined*/}
															{/*    ? Constants.STATUS_ENUM.find(o => o.key === store.status).value*/}
															{/*    : ""}</td>*/}
															{/*<th className="w-100px text-center">{UltiHelper.formatNumber(store.currentImportPrice)}</th>*/}

															{/* <th className="w-100px text-center">
                                {store.currentImportPrice !== 0
                                  ? UltiHelper.formatNumber(
                                    store.currentImportPrice
                                  )
                                  : UltiHelper.formatNumber(
                                    store.currentImportPrice
                                  )}
                              </th>
                              <th className="w-100px text-center">
                                {store.currentSalePrice !== 0
                                  ? UltiHelper.formatNumber(
                                    store.currentSalePrice
                                  )
                                  : UltiHelper.formatNumber(
                                    store.currentSalePrice
                                  )}
                              </th> */}
															<th className="w-100px text-center">
																{typeof store.manufacture !== "undefined" &&
																store.manufacture !== null
																	? store.manufacture.name
																	: ""}
															</th>
															{/*<td>{this.props.itemStore.name}</td>
                                                    <td>{this.props.itemStore.address}</td>
                                                    <td>{this.props.itemStore.address}, {this.props.itemStore.ward_name}, {this.props.itemStore.district_name}, {this.props.city_name} </td>
                                                    <td>{this.props.itemStore.job_title_names.map((title) => {
                                                    return title + " ";
                                                    })}</td>*/}
															{this.handleActionTable(store)}
														</tr>
													);
												})}
											</tbody>
										</table>
									</div>
								</div>
							</div>
							<PaginationComponent
								total={this.state.total}
								getDataPage={(page, search) =>
									this.handleClickSearch(page, search)
								}
							/>
							{/*<div style={{alignItems: 'center', position: 'absolute', left: '50%'}}>*/}
							{/*    <a disabled={this.state.currentSkip === 1 ? true : false} href="#" onClick={() => {*/}
							{/*        this.handleClickNextOrPreButton(0)*/}
							{/*    }} className="previous round">&#8249;</a>*/}
							{/*    <a href="#"*/}
							{/*       disabled={!this.state.pageLast}*/}
							{/*       onClick={() => {*/}
							{/*           this.handleClickNextOrPreButton(1)*/}
							{/*       }} className="next round">&#8250;</a>*/}
							{/*</div>*/}
						</div>
					</div>
				</div>
				<AddProductPopupContainer refresh={this.refresh.bind(this)} />

				<EditProductPopupContainer
					product_id={this.state.product_id}
					parentRoot={this.state.parentRoot}
					store={this.state.store}
					refresh={this.refresh.bind(this)}
				/>

				<AddProductExcelPopup
					refresh={this.refresh.bind(this)}
					listUserFixer={this.state.listUserFixer}
					listUsersPartner={this.state.listUsersPartner}
				/>

				<AddProductExcelWarehousePopup
					refresh={this.refresh.bind(this)}
					listUserFixer={this.state.listUserFixer}
					listUsersPartner={this.state.listUsersPartner}
				/>

				{/*{this.state.user_type === 'Station' && (<ExportDriverFactoryPopup*/}
				{/*    listFactoryExports={this.state.listFactoryExports}*/}
				{/*    product_parse={this.state.product_parse}*/}
				{/*/>)}*/}
				{/*{this.state.user_type === 'Station' && (<ExporBackDriverFactoryPopup*/}
				{/*    listFactoryBacks={this.state.listFactoryBacks}*/}
				{/*    product_parse={this.state.product_parse}*/}
				{/*/>)}*/}

				{/*{this.state.user_type === 'Station' && (<ExportStationPopup*/}
				{/*    getListProducts={(products) => this.getListProducts(products)}*/}

				{/*/>)}*/}
				{/*{this.state.user_type === 'Station' && (<ImportStationPopup*/}
				{/*    getListProducts={(products) => this.getListProducts(products)}*/}

				{/*/>)}*/}
				{/*{this.state.user_type === 'Station' && (<ImportDriverStationPopup*/}
				{/*    listStationImports={this.state.listStationImports}*/}
				{/*    product_parse={this.state.product_parse}/>)}*/}
				{/*{this.state.user_type === 'Station' && (<ExportBackFactoryPopup*/}
				{/*    getListProducts={(products) => this.getListProducts(products)}*/}

				{/*/>)}*/}
				<HistoryPricePopup
					product_id={this.state.product_id}
					getListProducts={(products) => this.getListProducts(products)}
				/>

				{((this.state.user_type === "Factory" &&
					this.state.user_role !== "Deliver" &&
					this.state.user_role !== "Inspector") ||
					(this.state.user_type === "General" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector")) && (
					<ExportDriverFactoryPopup
						listFactoryExports={this.state.listFactoryExports}
						product_parse={this.state.product_parse}
						listExportPlace={this.state.listExportPlace}
						userType={this.state.user_type}
						userRole={this.state.user_role}
					/>
				)}
				{((this.state.user_type === "Factory" &&
					this.state.user_role !== "Deliver" &&
					this.state.user_role !== "Inspector") ||
					(this.state.user_type === "General" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector")) && (
					<ExportDriverFactoryPopupNew
						listFactoryExports={this.state.listFactoryExports}
						product_parse={this.state.product_parse}
						listExportPlace={this.state.listExportPlace}
						userType={this.state.user_type}
						userRole={this.state.user_role}
					/>
				)}
				{((this.state.user_type === "Factory" &&
					this.state.user_role !== "Deliver" &&
					this.state.user_role !== "Inspector") ||
					(this.state.user_type === "General" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector")) && (
					<ExportFactoryPopup
						getListProducts={(products) => this.getListProducts(products)}
					/>
				)}
				{((this.state.user_type === "Factory" &&
					this.state.user_role !== "Deliver" &&
					this.state.user_role !== "Inspector") ||
					(this.state.user_type === "General" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector")) && (
					<ExportFactoryPopupNew
						getListProducts={(products) => this.getListProducts(products)}
					/>
				)}
				{((this.state.user_type === "Factory" &&
					this.state.user_role !== "Deliver" &&
					this.state.user_role !== "Inspector") ||
					(this.state.user_type === "General" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector")) && (
					<TypeExportCylinderPopup
						handleChangeTypeExportCylinder={(data) =>
							this.handleChangeTypeExportCylinder(data)
						}
						getListProducts={(products) => this.getListProducts(products)}
					/>
				)}
				{((this.state.user_type === "Factory" &&
					this.state.user_role !== "Deliver" &&
					this.state.user_role !== "Inspector") ||
					(this.state.user_type === "General" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector")) && (
					<ExportCylinderInformation
						getListProducts={(products) => this.getListProducts(products)}
						typeExportCylinder={this.state.typeExportCylinder}
						handleChangeTypeExportCylinderEmpty={() =>
							this.handleChangeTypeExportCylinderEmpty
						}
						getUserByType_ExportCell={this.getUserByType_ExportCell}
					/>
				)}
				{((this.state.user_type === "Factory" &&
					this.state.user_role !== "Deliver" &&
					this.state.user_role !== "Inspector") ||
					(this.state.user_type === "General" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector")) && (
					<ImportCylinderInformation
						getListProducts={(products) => this.getListProducts(products)}
						isFactory
						typeExportCylinder={this.state.typeExportCylinder}
						handleChangeTypeExportCylinderEmpty={() =>
							this.handleChangeTypeExportCylinderEmpty
						}
					/>
				)}
				{((this.state.user_type === "Factory" &&
					this.state.user_role !== "Deliver" &&
					this.state.user_role !== "Inspector") ||
					(this.state.user_type === "Agency" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector") ||
					(this.state.user_type === "General" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector") || 
						(this.state.user_role === "SuperAdmin") && 
						(this.state.user_type === "General_Warehouse")) && (
					<ImportFactoryPopup
						getListProducts={(products) => this.getListProducts(products)}
					/>
				)}
				{((this.state.user_type === "Factory" &&
					this.state.user_role !== "Deliver" &&
					this.state.user_role !== "Inspector") ||
					(this.state.user_type === "General" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector")) && (
					<TurnBackFactoryPopup
						getListProducts={(products) => this.getListProducts(products)}
					/>
				)}
				{((this.state.user_type === "Factory" &&
					this.state.user_role !== "Deliver" &&
					this.state.user_role !== "Inspector") ||
					(this.state.user_type === "General" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector")) && (
					<TurnBackDriverInCustomer
						getListProducts={(products) => this.getListProducts(products)}
						listUsersPartner={this.state.listUsersPartner}
						listUserFixer={this.state.listUserFixer}
						typeExportCylinder={this.state.typeExportCylinder}
						handleChangeTypeExportCylinderEmpty={() =>
							this.handleChangeTypeExportCylinderEmpty
						}
					/>
				)}
				{(this.state.user_type === "Fixer" ||
					(this.state.user_type === "Factory" &&
						this.state.user_role !== "Deliver")) && <UpdateDateCylinders />}
				{(this.state.user_type === "Factory" ||
					(this.state.user_type === "Agency" &&
						this.state.user_role !== "Deliver") ||
					(this.state.user_type === "General" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector") || 
						(this.state.user_type  === "General_Warehouse") &&
						this.state.user_role === "SuperAdmin") && (
					<ImportDriverFactoryPopup
						typeImport={this.state.typeImport}
						product_parse={this.state.product_parse}
						listTurnBackStations={this.state.listTurnBackStations}
					/>
				)}
				{((this.state.user_type === "Factory" &&
					this.state.user_role !== "Deliver") ||
					(this.state.user_type === "General" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector") ||
					(this.state.user_type === "Agency" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector")) && (
					<TurnBackDriverFactoryPopup
						product_parse={this.state.product_parse}
						listTurnBackStations={this.state.listTurnBackStations}
						typeExportCylinder={this.state.typeExportCylinder}
					/>
				)}
				{((this.state.user_type === "Factory" &&
					this.state.user_role !== "Deliver") ||
					(this.state.user_type === "General" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector")) && (
					<TypeTurnBackPopup
						product_parse={this.state.product_parse}
						listTurnBackStations={this.state.listTurnBackStations}
					/>
				)}
				{((this.state.user_type === "Factory" &&
					this.state.user_role !== "Deliver" &&
					this.state.user_role !== "Inspector") ||
					(this.state.user_type === "General" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector")) && (
					<ExportFactoryStationPopup
						getListProducts={(products) => this.getListProducts(products)}
					/>
				)}
				{((this.state.user_type === "Factory" &&
					this.state.user_role !== "Deliver" &&
					this.state.user_role !== "Inspector") ||
					(this.state.user_type === "General" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector")) && (
					<ExportTypeCylinderPopup
						getListProducts={(products) => this.getListProducts(products)}
					/>
				)}
				{((this.state.user_type === "Factory" &&
					this.state.user_role !== "Deliver" &&
					this.state.user_role !== "Inspector") ||
					(this.state.user_type === "General" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector")) && (
					<ExportDriverTypeCylinderPopup
						product_parse={this.state.product_parse}
						typeExportCylinder={this.state.typeExportCylinder}
						listUsersPartner={this.state.listUsersPartner}
						listUserFixer={this.state.listUserFixer}
						allChildOf={this.state.allChildOf}
						handleChangeTypeExportCylinderEmpty={() =>
							this.handleChangeTypeExportCylinderEmpty
						}
						listFixerExportCell={this.state.listFixerExportCell}
						listRenterExportCell={this.state.listRenterExportCell}
					/>
				)}
				{((this.state.user_type === Constants.FACTORY &&
					this.state.user_role !== "Deliver" &&
					this.state.user_role !== "Inspector") ||
					(this.state.user_type === "General" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector")) && (
					<ImportFactoryTypeFixer
						product_parse={this.state.product_parse}
						typeExportCylinder={this.state.typeExportCylinder}
						listUsersPartner={this.state.listUsersPartner}
						listUserFixer={this.state.listUserFixer}
						handleChangeTypeExportCylinderEmpty={() =>
							this.handleChangeTypeExportCylinderEmpty
						}
					/>
				)}
				{this.state.user_type === Constants.FIXER && (
					<ImportDriverTypeFixer
						product_parse={this.state.product_parse}
						typeExportCylinder={this.state.typeExportCylinder}
						listUsersPartner={this.state.listUsersPartner}
						listUserFixer={this.state.listUserFixer}
						handleChangeTypeExportCylinderEmpty={() =>
							this.handleChangeTypeExportCylinderEmpty
						}
					/>
				)}
				{((this.state.user_type === Constant.FACTORY &&
					this.state.user_role !== "Deliver" &&
					this.state.user_role !== "Inspector") ||
					(this.state.user_type === "General" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector")) && (
					<ImportDriverTypeCylinder
						product_parse={this.state.product_parse}
						typeExportCylinder={this.state.typeExportCylinder}
						listUsersPartner={this.state.listUsersPartner}
						listUserFixer={this.state.listUserFixer}
						handleChangeTypeExportCylinderEmpty={() =>
							this.handleChangeTypeExportCylinderEmpty
						}
					/>
				)}
				{this.state.user_type === Constants.FIXER && (
					<ImportCylinderInformation
						getListProducts={(products) => this.getListProducts(products)}
						typeExportCylinder={this.state.typeExportCylinder}
						handleChangeTypeExportCylinderEmpty={() =>
							this.handleChangeTypeExportCylinderEmpty
						}
					/>
				)}
				{this.state.user_type === Constants.FIXER && (
					<ExportCylinderToFactoryPopup
						product_parse={this.state.product_parse}
						typeExportCylinder={this.state.typeExportCylinder}
						getListProducts={(products) => this.getListProducts(products)}
					/>
				)}
				{this.state.user_type === Constants.FIXER && (
					<ImportCylinderForFixer
						product_parse={this.state.product_parse}
						typeExportCylinder={this.state.typeImport}
						getListProducts={(products) => this.getListProducts(products)}
					/>
				)}
				{this.state.user_type === Constants.FIXER && (
					<ExportFixerPopup
						product_parse={this.state.product_parse}
						typeExportCylinder={this.state.typeExportCylinder}
						parentRoot={this.state.parentRoot}
						listUsersPartner={this.state.listUsersPartner}
						handleChangeTypeExportCylinderEmpty={() =>
							this.handleChangeTypeExportCylinderEmpty
						}
					/>
				)}
				{((this.state.user_type === "Factory" &&
					this.state.user_role !== "Deliver" &&
					this.state.user_role !== "Inspector") ||
					(this.state.user_type === "General" &&
						this.state.user_role !== "Deliver" &&
						this.state.user_role !== "Inspector")) && (
					<TypeForPartnerPopup
						handleChangeTypeExportCylinder={(data) =>
							this.handleChangeTypeExportCylinder(data)
						}
						getListProducts={(products) => this.getListProducts(products)}
					/>
				)}
				{((this.state.user_type === "Factory" &&
					this.state.user_role === "Owner") ||
					this.state.user_type === "Fixer") && (
					<RequestExcel /* togglePopup={this.togglePopup} _togglePopup={this.state.togglePopup} */
					/>
				)}
				{this.state.user_type === "Factory" &&
					this.state.user_role === "SuperAdmin" && <ListRequest />}
				{/*{this.state.user_type === 'Factory' && (<ExportDriverFactoryStationPopup*/}
				{/*    listFactoryExports={this.state.listFactoryExports}*/}
				{/*    listExportStations={this.state.listExportStations}*/}
				{/*    product_parse={this.state.product_parse}/>)}*/}

				{/* //need remove */}
				<div className="modal fade" id="edit-price" tabIndex="-1">
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Cập Nhật Giá Bán</h5>
								<button type="button" className="close" data-dismiss="modal">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<Form
									ref={(c) => {
										this.formUpdatePrice = c;
									}}
									className="card"
									onSubmit={(event) => this.onUpdatePrice(event)}
								>
									<div className="card-body">
										<div className="row">
											<div className="col-md-6">
												<div className="form-group">
													<label>{this.props.t("CYLINDER_CODE")}</label>
													<Input
														disabled={true}
														value={this.state.pickProduct.serial}
														className="form-control"
														type="text"
														name="cylinder_id"
														validations={[required]}
													/>
												</div>
											</div>
											{/*<div className="col-md-6">*/}
											{/*    <div className="form-group">*/}
											{/*        <label>Trạng Thái Bình</label>*/}
											{/*        <Input disabled={true}*/}
											{/*               value={Constant.STATUS_ENUM.find(o => o.key === this.state.pickProduct.status) !== undefined*/}
											{/*                   ? Constants.STATUS_ENUM.find(o => o.key === this.state.pickProduct.status).value*/}
											{/*                   : ""} className="form-control" type="text"*/}
											{/*               name="cylinder_id" validations={[required]}/>*/}
											{/*    </div>*/}

											{/*</div>*/}
											<div className="col-md-6">
												<div className="form-group">
													<label>{this.props.t("PRICE_REF")}</label>
													<Input
														disabled={true}
														className="form-control"
														value={this.state.pickProduct.currentImportPrice}
														type="text"
														name="price_view"
														id="price_view"
														validations={[required]}
													/>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group">
													<label>{this.props.t("PRICE")}</label>
													<Input
														className="form-control"
														value={
															this.state.pickProduct.currentSalePrice !== 0
																? this.state.pickProduct.currentSalePrice
																: this.state.pickProduct.currentImportPrice
														}
														type="number"
														name="price_buy"
														id="price_buy"
														validations={[required]}
													/>
												</div>
											</div>
										</div>
									</div>

									<footer className="card-footer text-center">
										<Button className="btn btn-primary">
											{this.props.t("SAVE")}1
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

				<div className="modal fade" id="buy-cylinder" tabIndex="-1">
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">{this.props.t("SELL_1_INFO")}</h5>
								<button type="button" className="close" data-dismiss="modal">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<Form
									ref={(c) => {
										this.form = c;
									}}
									className="card color"
									onSubmit={(event) => this.onNextStepBuyCylinder(event)}
								>
									<div className="card-body">
										<div className="row">
											<div className="col-md-12">
												<div className="form-group">
													<label>{this.props.t("PLS_SELECT_CYL")}</label>
													<SelectMulti
														multi={true}
														inputValue={this.state.searchString}
														options={this.state.dataSearchProducts}
														onChange={this.handleChangeProducts.bind(this)}
														placeholder="Chọn Bình..."
														onInputChange={(newText) => {
															this.searchCylinderForBuyProduct(newText, 0);
														}}
														value={this.state.productResult}
														promptTextCreator={() => {
															return;
														}}
													/>
												</div>
											</div>
											<table
												className="table table-striped table-bordered seednet-table-keep-column-width"
												cellSpacing="0"
											>
												{/* <thead className="table__head display-block">
                                                <tr>
                                                    <th className="text-center w-70px">#STT</th>
                                                    <th className="w-120px text-center">Id</th>
                                                    <th className="w-120px text-center">Nơi Đến</th>
                                                    <th className="w-120px text-center">Số Lượng</th>
                                                </tr>
                                                </thead>*/}
												<tbody className="">
													{this.state.productResult.map((store, index) => {
														return (
															<tr key={index}>
																{/* <td scope="row" className="text-center">{index + 1}</td>*/}

																{/*  <td scope="row" className="text-center">{store.id}</td>*/}
																<td scope="row" className="text-center">
																	{store.serial}
																</td>
																<td scope="row" className="text-center">
																	{store.manufacture !== null
																		? store.manufacture.name
																		: ""}
																</td>
																{/*<td>{this.props.itemStore.name}</td>
                                                    <td>{this.props.itemStore.address}</td>
                                                    <td>{this.props.itemStore.address}, {this.props.itemStore.ward_name}, {this.props.itemStore.district_name}, {this.props.city_name} </td>
                                                    <td>{this.props.itemStore.job_title_names.map((title) => {
                                                    return title + " ";
                                                    })}</td>*/}
																{/* <td className="text-center table-actions">

                                                        <a className="table-action hover-primary" data-toggle="modal" data-target="#view-report"
                                                           onClick={()=>{this.setState({content:store.description,user:store.user?store.user.name:'',cylinder:store.cylinder?store.cylinder.serial:''})}}>
                                                            <i className="ti-eye"></i></a>

                                                    </td>*/}
															</tr>
														);
													})}
												</tbody>
											</table>
										</div>
									</div>

									<footer className="card-footer text-center">
										<button
											className="btn btn-primary"
											disabled={this.state.productResult.length === 0}
											onClick={() => {
												const modal = $("#buy-cylinder");
												modal.modal("hide");
											}}
											type="submit"
											data-toggle="modal"
											data-target="#customer-info"
										>
											{this.props.t("NEXT")}
										</button>
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
				<div className="modal fade" id="customer-info" tabIndex="-1">
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">{this.props.t("SELL_2_CUS")}</h5>
								<button type="button" className="close" data-dismiss="modal">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<Form
									ref={(c) => {
										this.formBuyCylinder = c;
									}}
									className="card"
									onSubmit={(event) => this.submitBuyCylinder(event)}
								>
									<ReactCustomLoading
										isLoading={this.state.loading}
									></ReactCustomLoading>
									<div className="card-body">
										<div className="row">
											<div className="col-md-6">
												<div className="form-group">
													<label>{this.props.t("CUSTOMER")}</label>
													<Input
														className="form-control"
														type="text"
														name="nameCustomer"
														autocomplete="off"
														validations={[required]}
													/>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group">
													<label>{this.props.t("PHONE")}</label>
													<Input
														className="form-control"
														type="number"
														name="phoneCustomer"
														autocomplete="off"
														validations={[required]}
													/>
												</div>
											</div>
											<div className="col-md-12">
												<div className="form-group">
													<label>{this.props.t("ADDRESS")}</label>
													<Input
														className="form-control"
														type="text"
														name="addressCustomer"
														id="addressCustomer"
														autocomplete="off"
														validations={[required]}
													/>
												</div>
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
			</div>
		);
	}

	renderTurnbackButton() {
		if (
			this.state.user_type === "Factory" &&
			this.state.user_role !== "Deliver" &&
			this.state.user_role !== "Inspector"
		) {
			return (
				<button
					className="btn btn-sm btn-create kiemdinh"
					data-toggle="modal"
					data-target="#type-import-cylinder-modal-data"
					style={{ backgroundColor: "#3454a5" }}
				>
					{this.props.t("ENTER_RETURN")}
				</button>
			);
		} else return "";
	}

	//dk của factory nếu cần thì thêm vào
	// || this.state.user_type === 'Factory' General Agency
	renderImportButton() {
		if (
			this.state.user_type === "Agency" ||
			(this.state.user_type === "General" &&
				this.state.user_role !== "Deliver" &&
				this.state.user_role !== "Inspector") 
				||
				(this.state.user_role === "SuperAdmin" && 
				(this.state.user_type === "General_Warehouse")) 
		) {
			return (
				<button
					onClick={() => this.setState({ typeImport: Constants.IMPORT_TYPE })}
					className="btn btn-sm btn-create kiemdinh"
					data-toggle="modal"
					data-target="#import-modal"
				>
					{this.props.t("IMPORT_CYLINDER")}
				</button>
			);
		} else if (this.state.user_type === "Fixer") {
			return (
				<button
					onClick={() =>
						this.setState({
							typeImport: Constants.IMPORT_TYPE,
							typeExportCylinder: Constant.TO_FIX,
						})
					}
					className="btn btn-sm btn-create"
					data-toggle="modal"
					data-target="#import-cylinder-information"
				>
					{this.props.t("IMP_FIX")}
				</button>
			);
		} else return "";
	}

	renderExportButton() {
		if (
			this.state.user_type === "Station" &&
			this.state.user_role !== "Deliver" &&
			this.state.user_role !== "Inspector"
		) {
			//return "";
			return (
				<button
					className="btn btn-sm btn-danger"
					data-toggle="modal"
					data-target="#export-modal-back-factory"
				>
					{this.props.t("EXP_RETURN")}
				</button>
			);
		} else if (
			(this.state.user_type === "Factory" &&
				this.state.user_role !== "Deliver" &&
				this.state.user_role !== "Inspector") ||
			(this.state.user_type === "General" &&
				this.state.user_role !== "Deliver" &&
				this.state.user_role !== "Inspector")
		) {
			return (
				<button
					className="btn btn-sm btn-create kiemdinh"
					data-toggle="modal"
					data-target="#export-modal"
					style={{ backgroundColor: "#3454a5" }}
				>
					{this.props.t("EXPORT")}
				</button>
			);
		} else return "";
	}

	renderExportStationButton() {
		if (
			this.state.user_type === "Factory" &&
			this.state.user_role !== "Deliver" &&
			this.state.user_role !== "Inspector"
		) {
			return (
				<button
					className="btn btn-sm btn-create kiemdinh"
					data-toggle="modal"
					data-target="#type-export-cylinder-modal-data"
					style={{ backgroundColor: "#3454a5" }}
				>
					{this.props.t("EXPORT_CYLINDER")}
				</button>
			);
		}
	}

	renderExportFixerButton() {
		if (
			this.state.user_type === "Fixer" ||
			(this.state.user_type === "Fixer" &&
				this.state.user_role === "SuperAdmin")
		) {
			return (
				<div>
					<button
						onClick={() =>
							this.setState({
								typeImport: Constants.EXPORT_TYPE,
								typeExportCylinder: Constant.TO_FIX,
							})
						}
						className="btn btn-sm btn-danger"
						data-toggle="modal"
						data-target="#export-from-fixer-to-factory"
						style={{ backgroundColor: "#ED383C" }}
					>
						{this.props.t("EXP_TNSH")}
					</button>
					<button
						className="btn btn-sm btn-create"
						data-toggle="modal"
						data-target="#update-cylinder-information"
						style={{ backgroundColor: "#ED383C" }}
					>
						{this.props.t("UPDATE_CYLINDER")}
					</button>
				</div>
			);
		} else if (
			this.state.user_type === "Fixer" &&
			this.state.user_role !== "SuperAdmin"
		) {
			return (
				<button
					onClick={() =>
						this.setState({
							typeImport: Constants.EXPORT_TYPE,
							typeExportCylinder: Constant.TO_FIX,
						})
					}
					className="btn btn-sm btn-danger "
					data-toggle="modal"
					data-target="#export-from-fixer-to-factory"
					style={{ backgroundColor: "#ED383C" }}
				>
					{this.props.t("EXP_TNSH")}
				</button>
			);
		} else if (
			this.state.user_type === "Factory" &&
			this.state.user_role !== "Deliver" &&
			this.state.user_role !== "Inspector"
		) {
			return (
				<button
					className="btn btn-sm btn-create kiemdinh"
					data-toggle="modal"
					data-target="#update-cylinder-information"
					style={{ backgroundColor: "#ED383C" }}
					// style={{wordWrap: 'break-word',width:'26%' }}
				>
					{this.props.t("UPDATE_CYLINDER")}
				</button>
			);
		}
	}
}

export default withNamespaces()(Product);
