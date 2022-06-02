import React from 'react';
import PropType from "prop-types";
import getAllCylinderAPI from 'getAllCylinderAPI';
import getAllUserApi from "getAllUserApi";

import showToast from 'showToast';
import Constants from 'Constants';
import getAllReportAPI from 'getAllReportAPI';
import UltiHelper from "UltiHelper";
import getListCustomerAPI from "getListCustomer";
import {withNamespaces} from 'react-i18next';
// import AddReportPopupContainer from "./AddReportPopupContainer";
// import ViewReportPopup from "./ViewReportPopup";


class Report extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataCustomer: [],
            dataReports: [],
            currentSkip: 0,
            isDisabledNext: false,
            isHasNext:true
        }
    }

    async getListCustomer() {
        const dataCustomer = await getListCustomerAPI(this.state.currentSkip);
        if (dataCustomer) {
            // console.log(dataCustomer.data.hasOwnProperty("err_msg"));
            if (dataCustomer.status === Constants.HTTP_SUCCESS_BODY && !dataCustomer.data.hasOwnProperty("err_msg")) {
                this.setState({dataCustomer: dataCustomer.data.data});
                if (dataCustomer.data.length === 0) {
                    this.setState({isDisabledNext: true,isHasNext: dataCustomer.data.isHasNext});
                } else {
                    this.setState({isDisabledNext: false,isHasNext: dataCustomer.data.isHasNext});
                }
            } else {
                showToast( dataCustomer.data.err_msg );
            }

            //this.setState({image_link: profile.data.company_logo});
        } else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }
    }

    handleClickNextOrPreButton(type) {
        let {currentSkip} = this.state;
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
        this.setState({currentSkip}, () => {
            this.getListCustomer();
        })


    }

    async componentDidMount() {
        //const jobMetaData = await this.getJobMetaData();
        // console.log(this.state.currentSkip);
        await this.setState({currentSkip: 1})
        // console.log(this.state.currentSkip);
        this.getListCustomer();
    }

    render() {
        return (
            <div className="main-content">
                <div className="card">
                    <div className="card-title">
                        <div className="flexbox">
                            <h4>{Constants.CUSTOMER_TITLE}</h4>
                            {/*<div className="row">*/}
                            {/*    <button style={{marginLeft:'20px'}} className="btn btn-sm btn-primary" data-toggle="modal"*/}
                            {/*            data-target="#create-report">Tạo Báo Cáo*/}
                            {/*    </button>*/}
                            {/*</div>*/}

                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive-xl">
                            <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <table
                                            className="table table-striped table-bordered seednet-table-keep-column-width"
                                            cellSpacing="0">
                                            <thead className="table__head">
                                            <tr>
                                                <th className="text-center w-50px align-middle">{this.props.t('ID_NUMBER')}</th>
                                                <th className="w-120px text-center align-middle">Tên</th>
                                                {/* <th className="w-70px text-center align-middle">TN sở hữu</th>
                                                <th className="w-70px text-center align-middle">TN mua bán</th>
                                                <th className="w-70px text-center align-middle">Cửa hàng</th>*/}
                                                <th className="w-120px text-center align-middle">Số điện thoại</th>
                                                <th className="w-70px text-center align-middle">Địa chỉ</th>
                                                {/*<th className="w-100px align-middle">Vị trí</th>*/}
                                                {/*<th className="w-100px text-center align-middle">Thao tác</th>*/}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.dataCustomer.map((store, index) => {
                                                return (<tr key={index}>
                                                    <td scope="row" className="text-center">{index + 1}</td>
                                                    <td scope="row" className="text-center">{store.name}</td>
                                                    <td scope="row" className="text-center">{store.phone}</td>
                                                    <td scope="row" className="text-center">{store.address}</td>
                                                </tr>)


                                            })}


                                            </tbody>
                                        </table>

                                    </div>

                                </div>

                            </div>
                            <div style={{alignItems: 'center', position: 'absolute', left: '50%'}}>
                                <a href="#"
                                   disabled={this.state.currentSkip === 1}
                                   onClick={() => {
                                    this.handleClickNextOrPreButton(0)
                                }} className="previous round">&#8249;</a>
                                <a href="#"
                                   disabled={!this.state.isHasNext}
                                   onClick={() => {
                                    this.handleClickNextOrPreButton(1)
                                }} className="next round">&#8250;</a>
                            </div>
                        </div>

                    </div>
                </div>
                {/*<AddReportPopupContainer listProducts={this.state.dataProducts} refresh={this.refresh.bind(this)}/>*/}
                {/*<ViewReportPopup content={this.state.content} user={this.state.user} cylinder={this.state.cylinder} />*/}
            </div>
        );
    }
}


export default withNamespaces()( Report);