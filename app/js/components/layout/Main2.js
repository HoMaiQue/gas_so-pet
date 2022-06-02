import React from "react";
import { getCookie } from "redux-cookie";
import { connect } from "react-redux";
import { Link } from "react-router";
import PopupLogOut from "app/js/components/pages/dashBoard/PopupLogOut.js";
import Constant from "Constants";
import { Icon } from "antd";
import {
	urlChangePass,
	urlChangInformationUser,
} from "./../../config/config-reactjs";
import { GETAVATARUSER, URLSERVERIMAGE } from "./../../config/config";
//import getUserCookies from './../../helpers/getUserCookies';
import callApi from "./../../util/apiCaller";
import history from "history";
import "./main2.scss";
import i18n from "../../helpers/i18n";
import { withNamespaces } from "react-i18next";
import iconMenu from "../../../icon/menu.svg";

class Main2 extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isSubsidiary: false,
			userRole: "",
			userType: "",
			user: { data: { avatar_url: "" }, initLoad: false },
			isMenuIndex: this.detectMenu(),
			title_notification: "",
			time_notification: "",
			description_notification: "",
			isShowMenu: [
				true,
				true,
				true,
				true,
				true,
				true,
				true,
				true,
				true,
				true,
				true,
				true,
				true,
				true,
				true,
				true,
			],
			avatar: "",
			nameUser: "",
			isShowDriver: false,
			isShowGoogleMap: false,
			isShowThanhtra: false,
			isShowCalender: false,
			isOrder: false,
			isShowCreateOrder: false,
			isShowUpdateOrder: false,
			isShowShippingManager: false,
			isShowRentalPartner: false,
			isShowDistributionAgency: false,
			isShowIndustry: false,
			isShowRestaurant: false,
			isShowCar: false,
			isShowMenuCreateOrder: false,
			products: true,
			isShowKinhDoanh: false,
			isShowListReturn: false,
			isShowTurnBack: false,

			// Khai báo biến điều khiển icon + -
			isShowSubMenuBusiness: false,
			isShowSubMenuOrder: false,
			isShowSubMenuManager: false,
		};
	}

	// Hàm togglePlus onclick ở các dòng 428 592 693 để thay đổi value của các biến điều khiển icon + -.
	togglePlus(index) {
		switch (index) {
			case 20: {
				this.state.isShowSubMenuBusiness = !this.state.isShowSubMenuBusiness;
				this.state.isShowSubMenuOrder = false;
				this.state.isShowSubMenuManager = false;
				break;
			}
			case 28: {
				this.state.isShowSubMenuBusiness = false;
				this.state.isShowSubMenuOrder = !this.state.isShowSubMenuOrder;
				this.state.isShowSubMenuManager = false;
				break;
			}
			case 26: {
				this.state.isShowSubMenuBusiness = false;
				this.state.isShowSubMenuOrder = false;
				this.state.isShowSubMenuManager = !this.state.isShowSubMenuManager;
				break;
			}
			default: {
				this.state.isShowSubMenuBusiness = false;
				this.state.isShowSubMenuOrder = false;
				this.state.isShowSubMenuManager = false;
			}
		}
	}

	detectMenu() {
		const menu = {
			"/dashboard": 7,
			// '/user': 6,
			"/factory": 1,
			"/general": 2,
			"/distributionAgency": 21,
			"/industry": 22,
			"/restaurant": 23,
			"/agency": 4,
			"/product": 3,
			"/manufacturer": 9,
			"/report": 5,
			// '/staff': 8,
			"/customer": 10,
			"/partner": 11,
			"/fixer": 12,
			"/factory-child": 13,
			"/googlemap": 14,
			"/driver": 15,
			"/thanh-tra": 16,
			"/createCalenderInspector": 17,
			"/createOrder": 18,
			"/updateOrder": 19,
			"/kinhdoanh": 20,
			"/rentPartner": 24,
			"/car": 25,
			"/quanly": 26,
			"/menuCreateOrder": 27,
			"/listReturn": 30,
			"/shippingmanager": 31,
			"/turnback6month": 32,
		};
		let path = this.props.location.pathname;

		let index = menu[path] ? menu[path] : 3;

		return index;

		// console.log(index);
	}

	updateInfoNotification = (title, time, description) => {
		this.setState({
			title_notification: title,
			time_notification: time,
			description_notification: description,
		});
	};

	addScript(src, myClass) {
		const newScript = document.createElement("script");
		newScript.setAttribute("class", myClass);
		newScript.setAttribute("src", src + "?n=" + Math.random().toString());
		newScript.setAttribute("type", "text/javascript");
		newScript.async = false;

		const getScript = document.querySelector("." + myClass);
		if (getScript !== null) {
			// getScript.parentNode.replaceChild(newScript, getScript);
			return;
		}

		document.getElementsByTagName("body")[0].appendChild(newScript);
	}

	async getUser() {
		const { dispatch } = this.props;
		const user = await dispatch(getCookie("user"));
		//console.log(user.user);
		if (typeof user !== "undefined") {
			this.setState({ user: JSON.parse(user) });
			//console.log(this.state.user.user.email)
			//console.log(this.state.user.token);
			let token = "Bearer " + this.state.user.token;
			let params = {
				email: this.state.user.user.email,
			};
			await callApi("POST", GETAVATARUSER, params, token).then((res) => {
				this.setState({
					avatar: res.data.data ? URLSERVERIMAGE + res.data.data : "",
				});
			});
			// console.log(this.state.user.user.userType === Constant.FACTORY);
			if (
				this.state.user.user.userType === Constant.SUPERADMIN ||
				this.state.user.user.userType === Constant.GOVERMENT
			) {
				this.setState({
					isShowMenu: [
						true,
						true,
						true,
						true,
						true,
						true,
						true,
						true,
						true,
						true,
						true,
						false,
						true,
						true,
						true,
						true,
					],
					isShowDriver: true,
					isShowGoogleMap: true,
					isShowThanhtra: true,
					isShowCalender: true,
					isShowUpdateOrder: true,
					isShowShippingManager: true,
					isShowRentalPartner: true,
					isShowDistributionAgency: true,
					isShowIndustry: true,
					isShowRestaurant: true,
					isShowCar: true,
					isOrder: true,
					isShowKinhDoanh: true,
				});
			} else if (
				this.state.user.user.userType === Constant.FACTORY &&
				this.state.user.user.userRole !== "Deliver" &&
				this.state.user.user.userRole !== "Inspector"
			) {
				if (this.state.user.user.userRole === "SuperAdmin") {
					this.setState({
						isShowMenu: [
							true,
							false,
							false,
							true,
							true,
							false,
							true,
							true,
							false,
							true,
							false,
							false,
							true,
							true,
						],
						isShowDriver: true,
						isShowGoogleMap: true,
						isShowThanhtra: true,
						isShowCalender: true,
						isShowCreateOrder: true,
						isShowRentalPartner: true,
						isShowDistributionAgency: true,
						isShowIndustry: true,
						isShowRestaurant: true,
						isShowCar: true,
						isOrder: true,
						isShowKinhDoanh: true,
						isShowTurnBack: true,
					});
				} else {
					this.setState({
						isShowMenu: [
							true,
							false,
							false,
							true,
							true,
							false,
							true,
							true,
							false,
							false,
							false,
							false,
							false,
							false,
						],

						// isShowMenu: [true, false, false, true, true, true, true, true, false, true, false, false, true, false],
						isShowDriver: true,
						isShowGoogleMap: true,
						isShowThanhtra: false,
						isShowCalender: false,
						isShowCreateOrder: false,
						isShowUpdateOrder: true,
						isShowShippingManager: true,
						isShowRentalPartner: false,
						isShowCar: true,
						isOrder: false,
						isShowKinhDoanh: false,
					});
				}
			} else if (
				this.state.user.user.userType === Constant.STATION &&
				this.state.user.user.userRole !== "Deliver" &&
				this.state.user.user.userRole !== "Inspector"
			) {
				this.setState({
					isShowMenu: [
						true,
						false,
						false,
						false,
						false,
						false,
						true,
						false,
						false,
						false,
					],
					isShowDriver: true,
					isShowGoogleMap: true,
					isShowThanhtra: false,
					isShowCalender: true,
					isShowCreateOrder: false,
					isShowUpdateOrder: true,
					isShowShippingManager: true,
					isShowRentalPartner: false,
					isShowDistributionAgency: false,
					isShowIndustry: false,
					isShowRestaurant: false,
					isShowCar: false,
					isOrder: false,
					isShowKinhDoanh: true,
				});
			} else if (
				this.state.user.user.userType === Constant.GENERAL &&
				this.state.user.user.userRole !== "Deliver" &&
				this.state.user.user.userRole !== "Inspector" 
			) {
				let defaultIsOrder = false, defaultIsShowCreateOrder = false;
				let isShowMenu = [
					true,
					false,
					false,
					false,
					false,
					true,
					true,
					false,
					false,
					false,
				];
				// Mở tab khách hàng, kho trực thuộc cho tk đại lý
				if(this.state.user.user.userRole === "SuperAdmin"){
					isShowMenu[4] = true;
					isShowMenu[13] = false;
					defaultIsOrder = !defaultIsOrder;
					defaultIsShowCreateOrder = !defaultIsShowCreateOrder;
				}
				this.setState({
					isShowMenu,
					isShowDriver: true,
					isShowGoogleMap: false,
					isShowThanhtra: false,
					isShowCalender: false,
					isShowCreateOrder: defaultIsShowCreateOrder,
					isShowUpdateOrder: true,
					isShowShippingManager: true,
					isShowRentalPartner: false,
					isShowDistributionAgency: false,
					isShowIndustry: false,
					isShowRestaurant: false,
					isShowCar: false,
					isOrder: defaultIsOrder,
					isShowKinhDoanh: true,
				});
			} 
			
			else if (
				this.state.user.user.userType === 'General_Warehouse' &&
				this.state.user.user.userRole === "SuperAdmin"
			) {
				let defaultIsOrder = false, defaultIsShowCreateOrder = false;
				let isShowMenu = [
					true,
					false,
					false,
					false,
					false,
					true,
					true,
					true,
					false,
					false,
				];
				if(this.state.user.user.userRole === "SuperAdmin"){
					isShowMenu[4] = true;
					isShowMenu[13] = true;
					defaultIsShowCreateOrder = !defaultIsShowCreateOrder;
				}
				this.setState({
					isShowMenu,
					isShowDriver: true,
					isShowGoogleMap: true,
					isShowThanhtra: false,
					isShowCalender: false,
					isShowCreateOrder: defaultIsShowCreateOrder,
					isShowUpdateOrder: true,
					isShowShippingManager: true,
					isShowRentalPartner: false,
					isShowDistributionAgency: false,
					isShowIndustry: false,
					isShowRestaurant: false,
					isShowCar: true,
					isOrder: defaultIsOrder,
					isShowKinhDoanh: false,
				});
			}

			 else if (
				this.state.user.user.userType === Constant.FIXER &&
				this.state.user.user.userRole !== "Deliver" &&
				this.state.user.user.userRole !== "Inspector"
			) {
				this.setState({
					isShowMenu: [
						false,
						false,
						false,
						false,
						false,
						false,
						true,
						false,
						false,
						false,
					],
					isShowDriver: true,
					isShowGoogleMap: false,
					isShowThanhtra: false,
					isShowCalender: false,
					isShowCreateOrder: false,
					isShowUpdateOrder: true,
					isShowShippingManager: true,
					isShowRentalPartner: false,
					isShowDistributionAgency: false,
					isShowIndustry: false,
					isShowRestaurant: false,
					isShowCar: false,
					isOrder: false,
					isShowKinhDoanh: false,
				});
			} else if (
				this.state.user.user.userType === Constant.AGENCY &&
				this.state.user.user.userRole !== "Deliver" &&
				this.state.user.user.userRole !== "Inspector"
			) {
				if (this.state.user.user.parentRoot === "")
					this.setState({
						isShowMenu: [
							true,
							false,
							false,
							false,
							false,
							false,
							true,
							false,
							true,
							true,
							true,
						],
						isShowDriver: true,
						isShowGoogleMap: false,
						isShowThanhtra: false,
						isShowCalender: false,
						isShowCreateOrder: false,
						isShowUpdateOrder: false,
						isShowShippingManager: false,
						isShowRentalPartner: false,
						isShowDistributionAgency: false,
						isShowIndustry: false,
						isShowRestaurant: false,
						isShowCar: false,
						isOrder: false,
						isShowKinhDoanh: true,
					});
				else
					this.setState({
						isShowMenu: [
							true,
							false,
							false,
							false,
							false,
							false,
							true,
							false,
							false,
							false,
							false,
						],
						isShowDriver: true,
						isShowGoogleMap: false,
						isShowThanhtra: false,
						isShowCalender: false,
						isShowCreateOrder: false,
						isShowUpdateOrder: false,
						isShowShippingManager: true,
						isShowRentalPartner: false,
						isShowDistributionAgency: false,
						isShowIndustry: false,
						isShowRestaurant: false,
						isShowCar: false,
						isOrder: false,
						isShowKinhDoanh: false,
					});
			} else if (
				this.state.user.user.userType === Constant.NORMAL &&
				this.state.user.user.userRole !== "Deliver" &&
				this.state.user.user.userRole !== "Inspector"
			) {
				this.setState({
					isShowMenu: [
						true,
						true,
						true,
						true,
						true,
						true,
						true,
						true,
						true,
						false,
					],
					isShowDriver: true,
					isShowGoogleMap: true,
					isShowThanhtra: false,
					isShowCalender: false,
					isShowCreateOrder: false,
					isShowUpdateOrder: true,
					isShowShippingManager: true,
					isShowRentalPartner: false,
					isShowDistributionAgency: false,
					isShowIndustry: false,
					isShowRestaurant: false,
					isShowCar: false,
					isOrder: false,
				});
			} else if (
				this.state.user.user.userRole === "Deliver" ||
				this.state.user.user.userRole === "Inspector"
			) {
				this.setState({
					isShowMenu: [
						false,
						false,
						false,
						false,
						false,
						false,
						false,
						false,
						false,
						false,
						false,
						false,
						false,
						false,
					],
					isShowDriver: false,
					isShowGoogleMap: false,
					isShowThanhtra: false,
					isShowCalender: false,
					isShowCreateOrder: false,
					isShowUpdateOrder: false,
					isShowShippingManager: false,
					isShowRentalPartner: false,
					isShowDistributionAgency: false,
					isShowIndustry: false,
					isShowRestaurant: false,
					isShowCar: false,
					isOrder: false,
				});
			}
		}
	}
	async componentDidMount() {
		await this.getUser();
		let userRole = this.state.user.user.userRole;
		let userType = this.state.user.user.userType;
		let isSubsidiary = this.state.user.user.isSubsidiary;
		this.setState({
			userRole: userRole,
			userType: userType,
			isSubsidiary: isSubsidiary
		});
		console.log("this.state.user.user.userRole", this.state.user.user);
		// this.addScript("assets/js/core.min.js", "core");
		this.addScript("assets/js/app.js", "app");
		this.addScript("assets/js/script.js", "script");
		this.addScript("assets/js/index.js", "index");
		//console.log(this.state.user.user.name);
	}

	setNotificationLoad() {
		var currentState = false;
		this.setState({ initLoad: !currentState });
	}

	Notes = ({ history, location, notes }) => {
		let redirectedFlashMessage = {};
		const { pathname, search, state } = location;

		if (state && state.flashMessage) {
			redirectedFlashMessage = state.flashMessage;

			// copy state cũ
			const clonedState = { ...state };
			// xóa flashMessage từ state được copy
			delete clonedState.flashMessage;
			// thay thế location hiện tại bằng location mới
			// với pathname, search từ location hiện tại
			// và state đã xóa flashMessage
			history.replace({ pathname, search, state: clonedState });
		}
	};

	reloadPage() {
		// window.location.reload();
	}

	// onChangeCurrent = async e => {
	//     e.preventDefault();
	//     if (this.state.isMenuIndex === 3) {
	//         // document.getElementById('sanpham').style.display = "block";
	//         document.getElementById('manager').style.display = 'none'
	//     }
	//     if (this.state.isMenuIndex === 26) {
	//         document.getElementById('manager').style.display = 'block'
	//     }
	// }

	render() {
		console.log("this.state.userRole", this.state.userRole);
		console.log("this.state.userType", this.state.userType);
		const changeLanguage = (lng) => {
			i18n.changeLanguage(lng);
		};
		return (
			<div>
				<aside
					className="sidebar sidebar-icons-right sidebar-icons-boxed sidebar-expand-lg"
					style={{ backgroundColor: "#3454a5" }}
				>
					<header className="sidebar-header">
						<a className="logo-icon" /*href="../index.html"*/>
							<img
								src="assets/img/sopet-logo.jpg"
								alt="logo icon"
								onClick={() => this.reloadPage()}
							/>
						</a>
					</header>

					<nav className="sidebar-navigation" style={{ overflow: "auto" }}>
						<ul className="menu">
							<li
								data-toggle="collapse"
								data-target="#products"
								// onClick={this.onChangeCurrent}
								//class="collapsed menu-item active"
								style={!this.state.isShowKinhDoanh ? { display: "none" } : {}}
								className={
									this.state.isMenuIndex === 20
										? "menu-item active"
										: "menu-item"
								}
							>
								<Link
									onClick={() => {
										this.setState({ isMenuIndex: 20 });
										this.togglePlus(20);
									}}
									className="menu-link "
								>
									<i className="fa fa-suitcase" aria-hidden="true"></i>
									<span className="kinhdoanh">
										{this.props.t("BUSINESS")}{" "}
									</span>
									<i
										class={
											this.state.isShowSubMenuBusiness == false
												? "fa fa-plus"
												: "fa fa-minus"
										}
									></i>
								</Link>
							</li>

							<div
								className={
									this.state.isMenuIndex === 3 ||
									this.state.isMenuIndex === 5 ||
									this.state.isMenuIndex === 7 ||
									this.state.isMenuIndex === 18 ||
									this.state.isMenuIndex === 14 ||
									this.state.isMenuIndex === 15 ||
									this.state.isMenuIndex === 16 ||
									this.state.isMenuIndex === 17 ||
									this.state.isMenuIndex === 18 ||
									this.state.isMenuIndex === 19 ||
									this.state.isMenuIndex === 25 ||
									this.state.isMenuIndex === 27 ||
									this.state.isMenuIndex === 28 ||
									this.state.isMenuIndex === 26 ||
									this.state.isMenuIndex === 30 ||
									this.state.isMenuIndex === 31 ||
									this.state.isMenuIndex === 32 ||
									this.state.isMenuIndex === 5
										? "sub-menu collapse"
										: "sub-menu collapse show"
								}
								id="products"
							>
								<li
									style={!this.state.isShowMenu[9] ? { display: "none" } : {}}
									className={
										this.state.isMenuIndex === 9
											? "menu-item active1"
											: "menu-item"
									}
								>
									<Link
										onClick={() => this.setState({ isMenuIndex: 9 })}
										to="/manufacturer"
										className="menu-link "
									>
										<i className="fa fa-diamond" aria-hidden="true"></i>
										<span className="title">
											{this.props.t(Constant.MANUFACTURER_TITLE)}
										</span>
									</Link>
								</li>

								<li
									style={!this.state.isShowMenu[13] ? { display: "none" } : {}}
									className={
										this.state.isMenuIndex === 13
											? "menu-item active1"
											: "menu-item"
									}
								>
									<Link
										onClick={() => this.setState({ isMenuIndex: 13 })}
										to="/factory-child"
										className="menu-link"
									>
										<i className="fa fa-building" aria-hidden="true"></i>
										<span className="title">
											{this.state.user.user&&this.state.user.user.userType === "General" && this.state.user.user.userRole === "SuperAdmin"? this.props.t(Constant.GENERAL_CHILD):this.props.t(Constant.FACTORY_CHILD)}
										</span>
									</Link>
								</li>

								<li
									style={!(this.state.userType === 'General' && this.state.userRole === 'SuperAdmin' && this.state.isSubsidiary) ? { display: "none" } : {}}
									className={
										this.state.isMenuIndex === 13
											? "menu-item active1"
											: "menu-item"
									}
								>
									<Link
										onClick={() => this.setState({ isMenuIndex: 13 })}
										to="/general-factory-child"
										className="menu-link"
									>
										<i className="fa fa-building" aria-hidden="true"></i>
										<span className="title">
											{this.props.t(Constant.GENERAL_CHILD)}
										</span>
									</Link>
								</li>

								<li
									style={!this.state.isShowMenu[11] ? { display: "none" } : {}}
									className={
										this.state.isMenuIndex === 11
											? "menu-item active1"
											: "menu-item"
									}
								>
									<Link
										onClick={() => this.setState({ isMenuIndex: 11 })}
										to="/partner"
										className="menu-link"
									>
										<i className="fa fa-handshake-o" aria-hidden="true"></i>
										<span className="title">
											{this.props.t(Constant.PARTNER)}
										</span>
									</Link>
								</li>

								<li
									style={
										!this.state.isShowRentalPartner ? { display: "none" } : {}
									}
									className={
										this.state.isMenuIndex === 24
											? "menu-item active1"
											: "menu-item"
									}
								>
									<Link
										onClick={() => this.setState({ isMenuIndex: 24 })}
										to="/rentPartner"
										className="menu-link"
									>
										<i className="fa fa-handshake-o" aria-hidden="true"></i>
										<span className="title">
											{this.props.t(Constant.RENTALPARTNER)}
										</span>
									</Link>
								</li>

								<li
									style={!this.state.isShowMenu[12] ? { display: "none" } : {}}
									className={
										this.state.isMenuIndex === 12
											? "menu-item active1"
											: "menu-item"
									}
								>
									<Link
										onClick={() => this.setState({ isMenuIndex: 12 })}
										to="/fixer"
										className="menu-link"
									>
										<i className="fa fa-cogs" aria-hidden="true"></i>
										<span className="title">
											{this.props.t(Constant.FIX_TITLE)}
										</span>
									</Link>
								</li>

								<li
									style={!this.state.isShowMenu[2] ? { display: "none" } : {}}
									className={
										this.state.isMenuIndex === 1
											? "menu-item active1"
											: "menu-item"
									}
								>
									<Link
										onClick={() => this.setState({ isMenuIndex: 1 })}
										to="/factory"
										className="menu-link"
									>
										<i className="fa fa-user-plus" aria-hidden="true"></i>
										<span className="title">
											{this.props.t(Constant.FACTORY_TITLE)}
										</span>
									</Link>
								</li>
								{/*<li style={!this.state.isShowMenu[3] ? {display: "none"} : {}}*/}
								{/*    className={this.state.isMenuIndex === 7 ? "menu-item active" : "menu-item"}>*/}
								{/*    <Link onClick={() => this.setState({isMenuIndex: 7})} to="/station"*/}
								{/*          className="menu-link">*/}

								{/*        <span className="title">{Constant.STATION_TITLE}</span>*/}

								{/*    </Link>*/}
								{/*</li>*/}
								{/* Hide  menu GENERAL when Click menu VIEW_ORDER */}
								<li
									style={
										!this.state.isShowMenu[4] || this.state.isMenuIndex === 19
											? { display: "none" }
											: {}
									}
									className={
										this.state.isMenuIndex === 2
											? "menu-item collapsed active"
											: "menu-item collapsed active"
									}
									data-toggle="collapse"
									data-target="#sub-general"
								>
									<Link
										onClick={() => this.setState({ isMenuIndex: 2 })}
										className="menu-link"
									>
										<i className="fa fa-users" aria-hidden="true"></i>
										<div>
											<span className="title">
												{this.props.t(Constant.GENERAL_TITLE)}{" "}
											</span>
										</div>

										<i
											className="fa fa-angle-down"
											style={{ fontSize: "20px" }}
											aria-hidden="true"
										></i>
									</Link>
								</li>
								<div className="sub-menu collapse" id="sub-general">
									<div className="duc">
										<li
											className={
												this.state.isMenuIndex === 21
													? "menu-item active1"
													: "menu-item"
											}
										>
											<Link
												onClick={() => this.setState({ isMenuIndex: 21 })}
												to="/distributionAgency"
												className="menu-link"
											>
												<i className="fa fa-truck" aria-hidden="true"></i>
												<span className="title">
													{" "}
													{this.props.t("DISTRIBUTOR")}{" "}
												</span>
											</Link>
										</li>
										<li
											className={
												this.state.isMenuIndex === 22
													? "menu-item active1"
													: "menu-item"
											}
										>
											<Link
												onClick={() => this.setState({ isMenuIndex: 22 })}
												to="/industry"
												className="menu-link"
											>
												<i className="fa fa-industry" aria-hidden="true"></i>
												<span className="title">
													{" "}
													{this.props.t("INDUSTRIAL")}{" "}
												</span>
											</Link>
										</li>
										<li
											className={
												this.state.isMenuIndex === 23
													? "menu-item active1"
													: "menu-item"
											}
										>
											<Link
												onClick={() => this.setState({ isMenuIndex: 23 })}
												to="/restaurant"
												className="menu-link"
											>
												<i className="fa fa-cutlery" aria-hidden="true"></i>
												<span className="title">
													{" "}
													{this.props.t("RESTAURANT")}{" "}
												</span>
											</Link>
										</li>
									</div>
								</div>

								{
									// ***
								}
								<li
									style={!this.state.isShowMenu[5] ? { display: "none" } : {}}
									className={
										this.state.isMenuIndex === 4
											? "menu-item active1"
											: "menu-item"
									}
								>
									<Link
										onClick={() => this.setState({ isMenuIndex: 4 })}
										to="/agency"
										className="menu-link "
									>
										<i className="fa fa-cart-plus" aria-hidden="true"></i>
										<span className="title">
											{this.props.t(Constant.AGENCY_TITLE)}
										</span>
									</Link>
								</li>
							</div>

							<li
								style={!this.state.isShowMenu[6] ? { display: "none" } : {}}
								className={
									this.state.isMenuIndex === 3
										? "menu-item active"
										: "menu-item"
								}
								// id="sanpham" onClick={this.onChangeCurrent}
								value={1}
							>
								<Link
									onClick={() => {
										this.setState({ isMenuIndex: 3 });
										this.togglePlus(-1);
									}}
									to="/product"
									className="menu-link "
								>
									<i className="fa fa-free-code-camp" aria-hidden="true"></i>
									<span className="title">
										{this.props.t(Constant.PRODUCT_TITLE)}
									</span>
								</Link>
							</li>

							<li
								style={!this.state.isShowMenu[0] ? { display: "none" } : {}}
								className={
									this.state.isMenuIndex === 7
										? "menu-item active"
										: "menu-item"
								}
							>
								<Link
									onClick={() => {
										this.setState({ isMenuIndex: 7 });
										this.togglePlus(-1);
									}}
									to="/dashboard"
									className="menu-link"
								>
									<i className="fa fa-bar-chart" aria-hidden="true"></i>
									<span className="title">
										{this.props.t(Constant.DASHBOARD_TITLE)}
									</span>
								</Link>
							</li>

							<li
								style={!this.state.isShowGoogleMap ? { display: "none" } : {}}
								className={
									this.state.isMenuIndex === 14
										? "menu-item active"
										: "menu-item"
								}
							>
								<Link
									onClick={() => {
										this.setState({ isMenuIndex: 14 });
										this.togglePlus(-1);
									}}
									to="/googlemap"
									className="menu-link"
								>
									<Icon type="global" className="fa" />
									<span className="title">{this.props.t("MAP")}</span>
								</Link>
							</li>
							<li
								data-toggle="collapse"
								data-target={this.state.isOrder ? "#menuOrder" : ""}
								//class="collapsed menu-item active"
								style={!this.state.isOrder ? { display: "none" } : {}}
								className={
									this.state.isMenuIndex === 28
										? "menu-item active"
										: "menu-item"
								}
							>
								<Link
									onClick={() => {
										this.setState({ isMenuIndex: 28 });
										this.togglePlus(28);
									}}
									className="menu-link "
								>
									<i className="fa fa-suitcase" aria-hidden="true"></i>
									<span className="kinhdoanh">{this.props.t("ORDER")}</span>
									<i
										class={
											this.state.isShowSubMenuOrder == false
												? "fa fa-plus"
												: "fa fa-minus"
										}
									></i>{" "}
								</Link>
							</li>

							<div
								className={
									this.state.isMenuIndex === 3 ||
									this.state.isMenuIndex === 5 ||
									this.state.isMenuIndex === 7 ||
									this.state.isMenuIndex === 9 ||
									this.state.isMenuIndex === 12 ||
									this.state.isMenuIndex === 13 ||
									this.state.isMenuIndex === 14 ||
									this.state.isMenuIndex === 15 ||
									this.state.isMenuIndex === 16 ||
									this.state.isMenuIndex === 17 ||
									this.state.isMenuIndex === 20 ||
									this.state.isMenuIndex === 21 ||
									this.state.isMenuIndex === 22 ||
									this.state.isMenuIndex === 23 ||
									this.state.isMenuIndex === 24 ||
									this.state.isMenuIndex === 25 ||
									this.state.isMenuIndex === 26 ||
									this.state.isMenuIndex === 2 ||
									this.state.isMenuIndex === 32 ||
									this.state.isMenuIndex === 5 ||
									this.state.isMenuIndex === 31 ||
									!this.state.isOrder 
										? "sub-menu collapse"
										: "sub-menu collapse show"
								}
								id="menuOrder"
								style={{ backgroundColor: "#f0f2f3" }}
							>
								<li
									style={
										!this.state.isShowCreateOrder ? { display: "none" } : {}
									}
									className={
										this.state.isMenuIndex === 18
											? "menu-item active"
											: "menu-item"
									}
								>
							
									<Link
										onClick={() => this.setState({ isMenuIndex: 18 })}
										to={this.state.userRole === "SuperAdmin" && this.state.userType === "General" ?
										 "/createOrderAgent" : "/createOrder" }
										className="menu-link"
									>
										<Icon type="shopping-cart" className="fa" />
										
										<span
											className="title"
											style={{
												fontFamily: "roboto",
												textTransform: "capitalize",
											}}
										>
											{" "}
											{this.props.t("CREATE_ORDER")}{" "} 
										</span>
										
									</Link> 
									
								</li>
								<li
									style={
										!this.state.isShowCreateOrder ? { display: "none" } : {}
									}
									className={
										this.state.isMenuIndex === 27
											? "menu-item active"
											: "menu-item"
									}
								>
									<Link
										onClick={() => this.setState({ isMenuIndex: 27 })}
										to={this.state.userRole === "SuperAdmin" && this.state.userType === "General" ?
										 "/menuCreateOrderAgent" : "/menuCreateOrder" }
										className="menu-link"
									>
										<i class="fa fa-bars"></i>
										<span
											className="title"
											style={{
												fontFamily: "roboto",
												textTransform: "capitalize",
											}}
										>
											{" "}
											{this.props.t("MENU_ORDER")}{" "}
										</span>
									</Link>
								</li>

								<li
									style={
										!this.state.isShowCreateOrder ? { display: "none" } : {}
									}
									className={
										this.state.isMenuIndex === 30
											? "menu-item active"
											: "menu-item"
									}
								>
									<Link
										onClick={() => this.setState({ isMenuIndex: 30 })}
										to={this.state.userRole === "SuperAdmin" && this.state.userType === "General" ?
										 "/listReturnAgent" : "/listReturn" }
										className="menu-link"
									>
										<i class="fa fa-bars"></i>
										<span
											className="title"
											style={{
												fontFamily: "roboto",
												textTransform: "capitalize",
											}}
										>
											{this.props.t("LIST_RETURN")}
										</span>
									</Link>
								</li>
							</div>

							{/* <li style={!this.state.isShowMenu[1] ? { display: "none" } : {}}
                                className={this.state.isMenuIndex === 6 ? "menu-item active" : "menu-item"}>
                                <Link onClick={() => this.setState({ isMenuIndex: 6 })} to="/user"
                                    className="menu-link">

                                    <span className="title">{Constant.USER_TITLE}</span>

                                </Link>
                            </li> */}

							{/* <li style={!this.state.isShowMenu[8] ? { display: "none" } : {}}
                                className={this.state.isMenuIndex === 8 ? "menu-item active" : "menu-item"}>
                                <Link onClick={() => this.setState({ isMenuIndex: 8 })} to='/staff'
                                    className="menu-link ">
                                    <i className="fa fa-handshake-o" aria-hidden="true"></i>
                                    <span className="title">{Constant.STAFF_TITLE}</span>

                                </Link>
                            </li> */}
							<li
								style={!this.state.isShowTurnBack ? { display: "none" } : {}}
								className={
									this.state.isMenuIndex === 32
										? "menu-item active"
										: "menu-item"
								}
							>
								<Link
									onClick={() => {
										this.setState({ isMenuIndex: 32 });
										this.togglePlus(-1);
									}}
									to="/turnback6month"
									className="menu-link"
								>
									<Icon type="plus" className="fa" />
									<span className="title">{this.props.t("TURNBACK > 6")}</span>
								</Link>
							</li>

							<li
								style={!this.state.isShowMenu[10] ? { display: "none" } : {}}
								className={
									this.state.isMenuIndex === 10
										? "menu-item active"
										: "menu-item"
								}
							>
								<Link
									onClick={() => this.setState({ isMenuIndex: 10 })}
									to="/customer"
									className="menu-link "
								>
									<i className="fa fa-address-book" aria-hidden="true"></i>
									<span className="title">{Constant.CUSTOMER_TITLE}</span>
								</Link>
							</li>
							{!(
								(this.state.userType === "Agency" &&
									this.state.userRole === "SuperAdmin") ||
								(this.state.userType === "General" &&
									this.state.userRole === "SuperAdmin") ||
								(this.state.userType === "Factory" &&
									this.state.userRole === "SuperAdmin")
							) && (
								<li
									className={
										this.state.isMenuIndex === 19
											? "menu-item active"
											: "menu-item"
									}
								>
									<Link
										onClick={() => this.setState({ isMenuIndex: 19 })}
										to="/updateOrder"
										className="menu-link"
									>
										{/* <Icon type="thanh-tra" /> */}
										<Icon type="shopping-cart" className="fa" />
										<span
											style={{
												fontFamily: "roboto",
												textTransform: "capitalize",
											}}
										>
											{this.props.t("VIEW_ORDER")}{" "}
										</span>
									</Link>
								</li>
							)}
							{!(
								(this.state.userType === "Agency" &&
									this.state.userRole === "SuperAdmin") ||
								(this.state.userType === "General" &&
									this.state.userRole === "SuperAdmin")
							) && (
								<li
									style={
										!this.state.isShowShippingManager ? { display: "none" } : {}
									}
									className={
										this.state.isMenuIndex === 31
											? "menu-item active"
											: "menu-item"
									}
								>
									<Link
										onClick={() => {
											this.setState({ isMenuIndex: 31 });
											this.togglePlus(31);
										}}
										to="/shippingmanager"
										className="menu-link"
									>
										<i className="fa fa-truck" aria-hidden="true"></i>
										<span
											style={{
												fontFamily: "roboto",
												textTransform: "capitalize",
											}}
										>
											{this.props.t("SHIPPING_MANAGER")}{" "}
										</span>
									</Link>
								</li>
							)}
							{/* {!((this.state.userType==="Factory" && this.state.userRole==="SuperAdmin")) && (
                <li 
                className={
                  this.state.isMenuIndex === 31
                    ? "menu-item active"
                    : "menu-item"
                }
              >
                <Link 
                  onClick={() => this.setState({ isMenuIndex: 31 })}
                  to="/shippingmanager"
                  className="menu-link"
                >
                  <i className="fa fa-truck"></i>
                  <span
                    style={{
                      fontFamily: "roboto",
                      textTransform: "capitalize",
                    }}
                  >
                    {this.props.t("SHIPPING_MANAGER")}{" "}
                  </span>                
                </Link>
              </li>

            )}  
               */}
							<li
								data-toggle="collapse"
								data-target="#manager"
								className="collapsed menu-item active"
								//style={!this.state.isShowMenu[20] ? { display: "none" } : {}}
								// onClick={this.onChangeCurrent}
								className={
									this.state.isMenuIndex === 26
										? "menu-item active"
										: "menu-item"
								}
							>
								<Link
									onClick={() => {
										this.setState({ isMenuIndex: 26 });
										this.togglePlus(26);
									}}
									className="menu-link "
								>
									<i class="fa fa-archive"></i>
									<span className="kinhdoanh">
										{" "}
										{(this.state.userType === "Factory" && this.state.userRole === "SuperAdmin")? this.props.t("MANAGEMENT"):this.props.t("MANAGEMENTTypeOfChild")}{" "}
									</span>
									<i
										class={
											this.state.isShowSubMenuManager == false
												? "fa fa-plus"
												: "fa fa-minus"
										}
									></i>{" "}
								</Link>
							</li>

							<div
								className={
									this.state.isMenuIndex === 2 ||
									this.state.isMenuIndex === 4 ||
									this.state.isMenuIndex === 3 ||
									this.state.isMenuIndex === 7 ||
									this.state.isMenuIndex === 9 ||
									this.state.isMenuIndex === 12 ||
									this.state.isMenuIndex === 13 ||
									this.state.isMenuIndex === 14 ||
									this.state.isMenuIndex === 18 ||
									this.state.isMenuIndex === 19 ||
									this.state.isMenuIndex === 20 ||
									this.state.isMenuIndex === 21 ||
									this.state.isMenuIndex === 22 ||
									this.state.isMenuIndex === 23 ||
									this.state.isMenuIndex === 24 ||
									this.state.isMenuIndex === 27 ||
									this.state.isMenuIndex === 28 ||
									this.state.isMenuIndex === 30 ||
									this.state.isMenuIndex === 31 ||
									this.state.isMenuIndex === 32 ||
									this.state.isMenuIndex === 5 
										? "sub-menu collapse"
										: "sub-menu collapse show"
								}
								id="manager"
							>
								{this.state.userType === "Factory" &&
								this.state.userRole === "SuperAdmin" ? (
									""
								) : (
									<li
										style={!this.state.isShowDriver ? { display: "none" } : {}}
										className={
											this.state.isMenuIndex === 15
												? "menu-item active1"
												: "menu-item"
										}
									>
										<Link
											onClick={() => this.setState({ isMenuIndex: 15 })}
											to="/driver"
											className="menu-link"
										>
											<i className="fa fa-id-card"></i>
											<span className="title"> {this.props.t("DRIVER")} </span>
										</Link>
									</li>
								)}
								{this.state.userType === "Factory" &&
								this.state.userRole === "SuperAdmin" ? (
									""
								) : (
									<li
										style={!this.state.isShowCar ? { display: "none" } : {}}
										className={
											this.state.isMenuIndex === 25
												? "menu-item active1"
												: "menu-item"
										}
									>
										<Link
											onClick={() => this.setState({ isMenuIndex: 25 })}
											to="/car"
											className="menu-link"
										>
											<Icon type="car" className="fa" />
											<span className="title"> {this.props.t("CAR")} </span>
										</Link>
									</li>
								)}

								<li
									style={!this.state.isShowThanhtra ? { display: "none" } : {}}
									className={
										this.state.isMenuIndex === 16
											? "menu-item active1"
											: "menu-item"
									}
								>
									<Link
										onClick={() => this.setState({ isMenuIndex: 16 })}
										to="/thanh-tra"
										className="menu-link"
									>
										{/* <Icon type="thanh-tra" /> */}
										<i className="fa fa-bug"></i>
										<span
											className="title"
											style={{
												fontFamily: "roboto",
												textTransform: "capitalize",
												color: "black",
											}}
										>
											{" "}
											{this.props.t("CHECK_MAINTAIN")}{" "}
										</span>
									</Link>
								</li>
								<li
									style={!this.state.isShowCalender ? { display: "none" } : {}}
									className={
										this.state.isMenuIndex === 17
											? "menu-item active1"
											: "menu-item"
									}
								>
									<Link
										onClick={() => this.setState({ isMenuIndex: 17 })}
										to="/createCalenderInspector"
										className="menu-link"
									>
										{/* <Icon type="thanh-tra" /> */}
										<Icon type="calendar" className="fa" />
										<span
											className="title"
											style={{
												fontFamily: "roboto",
												textTransform: "capitalize",
												color: "black",
											}}
										>
											{" "}
											{this.props.t("MAINTENANCE_SCHEDULE")}{" "}
										</span>
									</Link>
								</li>
							</div>
							<li
								style={!this.state.isShowMenu[7] ? { display: "none" } : {}}
								className={
									this.state.isMenuIndex === 5
										? "menu-item active1"
										: "menu-item"
								}
							>
								<Link
									onClick={() => this.setState({ isMenuIndex: 5 })}
									to="/report"
									className="menu-link "
								>
									<i className="fa fa-comments" aria-hidden="true"></i>
									<span className="title">
										{this.props.t(Constant.REPORT_TITLE)}
									</span>
								</Link>
							</li>
						</ul>
					</nav>
				</aside>
				<header className="topbar">
					<div className="topbar-left">
						<span className="topbar-btn sidebar-toggler">
							<a className="logo-icon" style={{ display: "none" }}>
								<img class="iconMenu" src={iconMenu} alt="icon-menu" />
								<span className="fs-16 seednet-mobile-none">SeedNET</span>
							</a>
						</span>
						<div className="d-none d-md-block topbar-menu">
							<nav
								className="topbar-navigation ps-container ps-theme-default"
								data-ps-id="dd6e876c-e9c9-a4f2-6dfd-1a320277e825"
							>
								<ul className="menu">
									{/* <li style={!this.state.isShowMenu[0] ? {display: "none"} : {}}*/}
									{/*    className={this.state.isMenuIndex === 0 ? "menu-item active" : "menu-item"}>*/}
									{/*    <Link onClick={() => this.setState({isMenuIndex: 0})} to="/dashboard"*/}
									{/*          className="menu-link">*/}

									{/*        <i className="fa fa-bar-chart" aria-hidden="true"></i>*/}
									{/*        <span className="title">{Constant.DASHBOARD_TITLE}</span>*/}

									{/*    </Link>*/}
									{/*</li>*/}
									{/*<li style={!this.state.isShowMenu[1] ? {display: "none"} : {}}*/}
									{/*    className={this.state.isMenuIndex === 6 ? "menu-item active" : "menu-item"}>*/}
									{/*    <Link onClick={() => this.setState({isMenuIndex: 6})} to="/user"*/}
									{/*          className="menu-link">*/}

									{/*        <span className="title">{Constant.USER_TITLE}</span>*/}

									{/*    </Link>*/}
									{/*</li>*/}

									{/*<li style={!this.state.isShowMenu[2] ? {display: "none"} : {}}*/}
									{/*    className={this.state.isMenuIndex === 1 ? "menu-item active" : "menu-item"}>*/}
									{/*    <Link onClick={() => this.setState({isMenuIndex: 1})} to="/factory"*/}
									{/*          className="menu-link">*/}
									{/*<i className="fa fa-user-plus" aria-hidden="true"></i>*/}
									{/*        <span className="title">{Constant.FACTORY_TITLE}</span>*/}

									{/*    </Link>*/}
									{/*</li>*/}
									{/*/!*<li style={!this.state.isShowMenu[3] ? {display: "none"} : {}}*!/*/}
									{/*/!*    className={this.state.isMenuIndex === 7 ? "menu-item active" : "menu-item"}>*!/*/}
									{/*/!*    <Link onClick={() => this.setState({isMenuIndex: 7})} to="/station"*!/*/}
									{/*/!*          className="menu-link">*!/*/}

									{/*/!*        <span className="title">{Constant.STATION_TITLE}</span>*!/*/}

									{/*/!*    </Link>*!/*/}
									{/*/!*</li>*!/*/}

									{/*<li style={!this.state.isShowMenu[4] ? {display: "none"} : {}}*/}
									{/*    className={this.state.isMenuIndex === 2 ? "menu-item active" : "menu-item"}>*/}
									{/*    <Link onClick={() => this.setState({isMenuIndex: 2})} to="/general"*/}
									{/*          className="menu-link">*/}
									{/*<i className="fa fa-users" aria-hidden="true"></i>*/}
									{/*        <span className="title">{Constant.GENERAL_TITLE}</span>*/}
									{/*    </Link>*/}
									{/*</li>*/}

									{/*<li style={!this.state.isShowMenu[5] ? {display: "none"} : {}}*/}
									{/*    className={this.state.isMenuIndex === 4 ? "menu-item active" : "menu-item"}>*/}
									{/*    <Link onClick={() => this.setState({isMenuIndex: 4})} to="/agency"*/}
									{/*          className="menu-link ">*/}
									{/*<i className="fa fa-cart-plus" aria-hidden="true"></i>*/}
									{/*        <span className="title">{Constant.AGENCY_TITLE}</span>*/}

									{/*    </Link>*/}
									{/*</li>*/}

									{/*<li style={!this.state.isShowMenu[6] ? {display: "none"} : {}}*/}
									{/*    className={this.state.isMenuIndex === 3 ? "menu-item active" : "menu-item"}>*/}
									{/*    <Link onClick={() => this.setState({isMenuIndex: 3})} to='/product'*/}
									{/*          className="menu-link ">*/}
									{/*<i className="fa fa-free-code-camp" aria-hidden="true"></i>*/}
									{/*        <span className="title">{Constant.PRODUCT_TITLE}</span>*/}

									{/*    </Link>*/}
									{/*</li>*/}
									{/*<li style={!this.state.isShowMenu[7] ? {display: "none"} : {}}*/}
									{/*    className={this.state.isMenuIndex === 5 ? "menu-item active" : "menu-item"}>*/}
									{/*    <Link onClick={() => this.setState({isMenuIndex: 5})} to='/report'*/}
									{/*          className="menu-link ">*/}
									{/*        <span className="title">{Constant.REPORT_TITLE}</span>*/}

									{/*    </Link>*/}
									{/*</li>*/}
									{/*<li style={!this.state.isShowMenu[8] ? {display: "none"} : {}}*/}
									{/*    className={this.state.isMenuIndex === 8 ? "menu-item active" : "menu-item"}>*/}
									{/*    <Link onClick={() => this.setState({isMenuIndex: 8})} to='/staff'*/}
									{/*          className="menu-link ">*/}

									{/*        <span className="title">{Constant.STAFF_TITLE}</span>*/}

									{/*    </Link>*/}
									{/*</li>*/}
									{/*<li style={!this.state.isShowMenu[9] ? {display: "none"} : {}}*/}
									{/*    className={this.state.isMenuIndex === 9 ? "menu-item active" : "menu-item"}>*/}
									{/*    <Link onClick={() => this.setState({isMenuIndex: 9})} to='/manufacturer'*/}
									{/*          className="menu-link ">*/}
									{/*<i className="fa fa-diamond" aria-hidden="true"></i>*/}
									{/*        <span className="title">{Constant.MANUFACTURER_TITLE}</span>*/}

									{/*    </Link>*/}
									{/*</li>*/}
									{/*<li style={!this.state.isShowMenu[10] ? {display: "none"} : {}}*/}
									{/*    className={this.state.isMenuIndex === 10 ? "menu-item active" : "menu-item"}>*/}
									{/*    <Link onClick={() => this.setState({isMenuIndex: 10})} to='/customer'*/}
									{/*          className="menu-link ">*/}
									{/*<i className="fa fa-address-book" aria-hidden="true"></i>*/}
									{/*        <span className="title">{Constant.CUSTOMER_TITLE}</span>*/}

									{/*    </Link>*/}
									{/*</li>*/}
									{/*<li style={!this.state.isShowMenu[11] ? {display: "none"} : {}}*/}
									{/*    className={this.state.isMenuIndex === 11 ? "menu-item active" : "menu-item"}>*/}
									{/*    <Link onClick={() => this.setState({isMenuIndex: 11})} to="/partner"*/}
									{/*          className="menu-link">*/}

									{/*        <span className="title">{Constant.PARTNER}</span>*/}
									{/*    </Link>*/}
									{/*</li>*/}
									{/*<li style={!this.state.isShowMenu[12] ? {display: "none"} : {}}*/}
									{/*    className={this.state.isMenuIndex === 12 ? "menu-item active" : "menu-item"}>*/}
									{/*    <Link onClick={() => this.setState({isMenuIndex: 12})} to="/fixer"*/}
									{/*          className="menu-link">*/}

									{/*        <span className="title">{Constant.FIX_TITLE}</span>*/}
									{/*    </Link>*/}
									{/*</li>*/}
									{/*<li style={!this.state.isShowMenu[13] ? {display: "none"} : {}}*/}
									{/*    className={this.state.isMenuIndex === 13 ? "menu-item active" : "menu-item"}>*/}
									{/*    <Link onClick={() => this.setState({isMenuIndex: 13})} to="/factory-child"*/}
									{/*          className="menu-link">*/}
									{/*        <span className="title">{Constant.FACTORY_CHILD}</span>*/}
									{/*    </Link>*/}
									{/*</li>*/}
								</ul>
							</nav>
						</div>
					</div>
					<div className="col-md-8">
						<ul className="nav nav-primary nav-dotted nav-dot-separated justify-content-center justify-content-md-end">
							<li className="nav-item">
								{/* <img
                  onClick={() => changeLanguage("en")}
                  style={{ height: 20, width: 30, margin: 5 }}
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/Us_flag_large_38_stars.png/1200px-Us_flag_large_38_stars.png"
                  alt="English"
                /> */}
							</li>
							<li className="nav-item">
								{/* <img
                  onClick={() => changeLanguage("vi")}
                  style={{ height: 20, width: 30, margin: 5 }}
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1280px-Flag_of_Vietnam.svg.png"
                  alt="Vietnamese"
                /> */}
							</li>
						</ul>
					</div>
					<div className="topbar-right">
						<ul className="topbar-btns">
							<li className="dropdown">
								<span className="topbar-btn" data-toggle="dropdown">
									<img className="avatar" src={this.state.avatar} alt="..." />
									<span
										className="seednet-mobile-none"
										style={{ marginLeft: "5px" }}
									>
										<span className="fs-16">
											<label style={{ color: "#1E429B" }}>
												{(this.state.user.user && (this.state.userType === "Factory" && this.state.userRole === "SuperAdmin")) ? this.props.t('NAME_OF_ADMIN') 
												: (this.state.user.user && !(this.state.userType === "Factory" && this.state.userRole === "SuperAdmin"))?this.state.user.user.name:
												""}
											</label>
											<i
												className="fa fa-angle-down"
												style={{ marginLeft: "5px", color: "#1E429B" }}
											></i>
										</span>
									</span>
								</span>
								<div className="dropdown-menu dropdown-menu-right">
									{/*     <Link to="/profile-staff?type=2" className="dropdown-item"><i
                                        className="ti-lock"></i> Đổi mật khẩu </Link>*/}
									<a
										className="dropdown-item"
										href="javascript:void(0);"
										data-toggle="modal"
										data-target="#modal-small"
									>
										<i className="ti-power-off"></i> {this.props.t("LOGOUT")}
									</a>
									<a className="dropdown-item" href={urlChangePass}>
										<Icon type="edit" /> {this.props.t("CHANGE_PASS")}
									</a>
									<a className="dropdown-item" href={urlChangInformationUser}>
										<Icon type="edit" /> {this.props.t("UPDATE_INFO")}
									</a>
								</div>
							</li>

							{/* <li className="d-md-block w-30px">
                                <a href="#qv-messages-notification" data-toggle="quickview"
                                  onClick={() => this.setNotificationLoad()} className="topbar-btn has-new"><i
                                    className="ti-bell"></i></a>
                            </li> */}
						</ul>
					</div>
				</header>

				<main className="main-container" id="mainContent">
					{this.props.children}
					{/* <NotificationContainer updateInfoNotification={this.updateInfoNotification.bind(this)}
                                          initialLoadNoti={this.state.initLoad}/>*/}
				</main>

				{/* <footer className="site-footer seednet-footer">
					<div className="row">
						<div className="col-md-6">
							<p className="text-center text-md-left">Copyright © 2018
                                        <a href="http://thetheme.io/theadmin"> GasTracking</a>. All rights reserved.</p>
						</div>
					</div>
				</footer> */}

				<div
					id="qv-global"
					className="quickview"
					data-url="../assets/data/quickview-notification.html"
				>
					<div className="spinner-linear">
						<div className="line"></div>
					</div>
				</div>

				<PopupLogOut />
				{/*  <Pricing/>
                <PopupNotification title_notification={this.state.title_notification}
                                   time_notification={this.state.time_notification}
                                   description_notification={this.state.description_notification}*/}
				{/* /> */}
				
			</div>
		);
	}
}

export default withNamespaces()(connect()(Main2));
