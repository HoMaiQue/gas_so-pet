import React from 'react';
import AddProductPopup from "./AddProductPopup";

import getAllUserApi from 'getAllUserApi';
import { push } from "react-router-redux";
import showToast from "showToast";
import addProductAPI from "addProductAPI";
import { connect } from "react-redux";
import Constants from "Constants";
import getAllManufacturer from "getAllManufacturer";


class AddProductPopupContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            company_profile: { images: [], featured_image_url: null },
            categories_list: [],
            uploadLogoResult: false,
            image_link: null,
            listUsers: [],
            listFactoryUser: [],
            listGeneralUser: [],
            listAgencyUser: [],
            listManufacturers: [],

        };
    }

    componentDidMount() {
        this.getAllUser();
        this.getAllManufacturer();
    }

    async getAllManufacturer() {
        const dataUsers = await getAllManufacturer(Constants.GENERAL);
        if (dataUsers) {
            if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
                this.setState({ listManufacturers: dataUsers.data });
            }
            else {
                showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
            }

            //this.setState({image_link: profile.data.company_logo});
        }
        else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }
    }

    async getAllUser() {
        //const jobMetaData = await this.getJobMetaData();

        const dataUsers = await getAllUserApi();
        if (dataUsers) {
            if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
                let userLists = dataUsers.data;
                let userFactory = dataUsers.data.filter(x => x.userType === Constants.FACTORY);
                let userAgency = dataUsers.data.filter(x => x.userType === Constants.AGENCY);
                let userGeneral = dataUsers.data.filter(x => x.userType === Constants.GENERAL);
                this.setState({ listUsers: userLists, listFactoryUser: userFactory, listGeneralUser: userGeneral, listAgencyUser: userAgency });
                //filter 3 type

            }
            else {
                showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
            }

            //this.setState({image_link: profile.data.company_logo});
        }
        else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }

    }


    async addProduct(serial, color, checkedDate, weight, placeStatus, status, /*currentImportPrice*/cylinderType, manufacture, valve, listconttycon, assetType, rentalPartner) {

        // Call api
        this.setState({ isLoading: true });
        const product = await addProductAPI(serial, color, checkedDate, weight, placeStatus, status, /*currentImportPrice*/cylinderType, manufacture, valve, listconttycon, assetType, rentalPartner);
        this.setState({ isLoading: false });
        let index = this.state.listUsers.findIndex((l) => l.serial === serial);

        //console.log('register',user);
        if (product) {
            if (product.status === Constants.HTTP_SUCCESS_CREATED) {
                showToast('Tạo mới thành công!', 3000);
                this.props.refresh();
                // window.location.reload();
            } else if (index === -1) {
                alert("Mã bình đã tồn tại. Vui lòng nhập mã khác!");
                const modal = $("#create-product");
                modal.modal('open');
            }
            else {
                showToast(product.data.message ? product.data.message : product.data.err_msg, 2000);
            }
        }
        else {
            showToast("Xảy ra lỗi trong quá trình tạo bình ");
        }
        return;
        //this.setState({registerSuccessful: false});
    }


    render() {
        return (
            <AddProductPopup
                listUsers={this.state.listUsers}
                listFactory={this.state.listFactoryUser}
                listGeneral={this.state.listGeneralUser}
                listAgency={this.state.listAgencyUser}
                addProduct={this.addProduct.bind(this)}
                listManufacturers={this.state.listManufacturers}
            />
        );
    }
}

export default connect()(AddProductPopupContainer);;