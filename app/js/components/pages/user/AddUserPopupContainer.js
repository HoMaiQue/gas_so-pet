import React from 'react';
import AddUserPopup from "./AddUserPopup";

import { push } from "react-router-redux";
import showToast from "showToast";
import { connect } from "react-redux";
import Constants from "Constants";

import getUserCookies from "getUserCookies";
import updateUserAPI from "updateUserAPI";
import addUserAPI from "addUserAPI";
import callApi from '../../../util/apiCaller';
import { ADDCUSTOMER } from '../../../config/config';
import openNotificationWithIcon from "../../../helpers/notification";

class AddUserPopupContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            company_profile: { images: [], featured_image_url: null },
            categories_list: [],
            listUsers: []
        };
    }

    async componentDidMount() {

    }


    /*async getAllUser() {
        //const jobMetaData = await this.getJobMetaData();

        const dataUsers = await getAllUserApi();
        if (dataUsers) {
            if(dataUsers.status===Constants.HTTP_SUCCESS_BODY)
            {
                this.setState({listUsers: dataUsers.data});
            }
            else
            {
                showToast(dataUsers.data.message?dataUsers.data.message:dataUsers.data.err_msg,2000);
            }

            //this.setState({image_link: profile.data.company_logo});
        }
        else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }

    }*/

    async addCustomer(name, email, invoiceName, invoiceAddress, customerType, customerCode, userType, userRole, createdBy, isChildOf, listAgency, LAT, LNG, groupCustomer) {
        let user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;
        let params = {
            "name": name,
            "email": email,
            "invoiceName": invoiceName,
            "invoiceAddress": invoiceAddress,
            "customerType": customerType,
            "customerCode": customerCode,
            "userType": userType,
            "userRole": userRole,
            "createdBy": createdBy,
            "isChildOf": isChildOf,
            "listAgency": listAgency,
            "LAT": LAT,
            "LNG": LNG,
            "groupCustomer": groupCustomer
        }
        this.setState({ isLoading: true });
        await callApi("POST", ADDCUSTOMER, params, token).then(res => {
            this.setState({ isLoading: false });
            if (res.data.success) {
                showToast('Tạo mới thành công!', 3000);
                $('#create-user').modal('hide');
                this.props.refresh();
                // window.location.reload();
                return true;
            }
            else {
                // showToast("Xảy ra lỗi trong quá trình tạo mới người dùng ");
                openNotificationWithIcon("error", res.data.message)
                return false;
            }

        })
    }

    async addUserFactoryChild(email, name, address, password, userType, child, userRole, owner, code, lat, lng, warehouseCode) {

        var user_cookies = await getUserCookies();
        let isChildOf = '';
        if (user_cookies) {
            isChildOf = user_cookies.user.id;
        }
        // Call api
        // Create user
        this.setState({ isLoading: true });
        const user = await addUserAPI(child, email, name, address, password, userType, userRole, (owner === false ? owner : user_cookies.user.id), code, lat, lng, "", warehouseCode);
        this.setState({ isLoading: false });
        //console.log('register',user);
        if (user) {
            if (user.status === Constants.HTTP_SUCCESS_CREATED) {
                showToast('Tạo mới thành công!', 3000);
                this.props.refresh();
                // window.location.reload();
                return true;
            }
            else if (user.status === 400) {
                showToast("Mã kho trùng, Vui lòng kiểm tra lại thông tin!");
                // console.log(user);
                const modal = $("create-user");
                modal.modal('open')
            }
            else {
                showToast(user.data.message ? user.data.message : user.data.err_msg, showToast('Email này đã tạo tài khoản rồi. Mời bạn nhập lại!', 2000));
               
                return false;
            }
        }
        else {
            showToast("Xảy ra lỗi trong quá trình tạo mới người dùng ");
            return false;
        }
        this.setState({ registerSuccessful: false });
    }

    async addUser(email, name, address, password, userType, child, userRole, owner, fixerCode, lat, lng, agencyCode = "") {

        var user_cookies = await getUserCookies();
        let isChildOf = '';
        if (user_cookies) {
            isChildOf = user_cookies.user.id;
        }
        // Call api
        // Create user
        // console.log('register', fixerCode);
        this.setState({ isLoading: true });
        const user = await addUserAPI(child, email, name, address, password, userType, userRole, (owner === false ? owner : user_cookies.user.id), fixerCode, lat, lng, "", "", agencyCode);
        this.setState({ isLoading: false });
        //console.log('register',user);
        if (user) {
            if (user.status === Constants.HTTP_SUCCESS_CREATED) {
                showToast('Tạo mới thành công!', 3000);
                this.props.refresh();
                // window.location.reload();
                return true;
            }
            else if (user.status === 400) {
                showToast("Vui lòng kiểm tra lại thông tin!");
                // console.log(user);
                const modal = $("create-user");
                modal.modal('open')
            }
            else {
                showToast(user.data.message ? user.data.message : user.data.err_msg, showToast('Email này đã tạo tài khoản rồi. Mời bạn nhập lại!', 2000));
                // showToast('dsdsds',3000);
                return false;
            }
        }
        else {
            showToast("Xảy ra lỗi trong quá trình tạo mới người dùng ");
            return false;
        }
        this.setState({ registerSuccessful: false });
    }

    async updateUser(id, name, password, address, warehouseCode, customerCode, invoiceAddress, groupCustomer, lat, lng, agencyCode,invoiceName) {

        var user_cookies = await getUserCookies();

        // Call api
        // Update user
        this.setState({ isLoading: true });
        const user = await updateUserAPI(id, name, password, address, warehouseCode, customerCode, invoiceAddress, groupCustomer, lat, lng, agencyCode,invoiceName);
        this.setState({ isLoading: false });
        //console.log('register',user);
        if (user) {
            // console.log("update user", user);
            if (user.status === Constants.HTTP_SUCCESS_BODY) {
                if (!!user.data.err_msg) {
                    showToast(user.data.message ? user.data.message : user.data.err_msg, 2000);
                    return false;

                }
                else {
                    showToast('Cập nhật thành công!', 3000);
                    this.props.refresh();
                    // window.location.reload();
                    return true;
                }
            } else {
                showToast(user.data.message ? user.data.message : user.data.err_msg, 2000);
                return false;
            }
        } else {
            showToast("Xảy ra lỗi trong quá trình tạo mới người dùng ");
            return false;
        }

        this.setState({ registerSuccessful: false });
    }

    async EditUser(email, name, address, password, userType, child, userRole, owner, code) {

    }

    render() {
        return (
            <AddUserPopup
                isFactoryChildPageNew={this.props.isFactoryChildPageNew}
                isEditForm={this.props.isEditForm}
                updateUser={this.updateUser.bind(this)}
                isAgencyPage={this.props.isAgencyPage}
                isStationPage={this.props.isStationPage}
                isGeneralPage={this.props.isGeneralPage}
                isIndustryPage={this.props.isIndustryPage}
                isRestaurantPage={this.props.isRestaurantPage}
                isFactoryPage={this.props.isFactoryPage}
                isFixerPage={this.props.isFixerPage}
                isInspectorPage={this.isInspectorPage}
                isFactoryChildPage={this.props.isFactoryChildPage}
                isDrivePage={this.props.isDrivePage}
                listProducts={this.props.listProducts}
                listUsers={this.state.listUsers}
                addUser={this.addUser.bind(this)}
                addUserFactoryChild={this.addUserFactoryChild.bind(this)}
                addCustomer={this.addCustomer.bind(this)}
                isCreateMode={this.props.isCreateMode}
                isCreateThanhtra={this.props.isCreateThanhtra}
                userType = {this.props.userType}

            />
        );
    }
}

export default connect()(AddUserPopupContainer);
