import React, { Component } from 'react';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import SelectMulti from "react-select";
import Button from "react-validation/build/button";
import required from "required";
import showToast from "showToast";
import { Select } from "antd";
import { withNamespaces } from 'react-i18next';
import getShippingOrder from "../../../../api/getShippingOrder"

const Option = Select.Option;

class PopupShippingDetail extends Component {
    constructor(props) {

        super(props);
    }

    render() {
        console.log("this.props", this.props)
        return (
            <div className="modal fade" id="shipping-detail-modal" tabIndex="-1" style={{ overflowY: "auto" }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.t('VIEW')}</h5>
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
                            >
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">

                                                <label>Tài xế</label>
                                                <Input
                                                    className="form-control"
                                                    type="text"
                                                    value={this.props.nameDriver}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Biển số xe</label>
                                                <Input
                                                    className="form-control"
                                                    type="text"
                                                    value={this.props.licensePlate}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="form-group">
                                                <table
                                                    className="table table-hover text-center table-striped table-bordered seednet-table-keep-column-width"
                                                    cellSpacing="0"
                                                >
                                                    <thead className="table__head">
                                                        <tr>
                                                            <th scope="col">Loại khách hàng</th>
                                                            <th scope="col">Khách hàng</th>
                                                            <th scope="col">Mã chi nhánh</th>
                                                            <th scope="col">Số lượng bình</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            this.props.listShippingCustomer.map((store, index) => {
                                                                return store.map((v, i) => {
                                                                    return (<tr key={i}>
                                                                        <td scope="row" className="text-center"></td>
                                                                        <td>{v.customerId.name}</td>
                                                                        <td>{v.customerId.id}</td>

                                                                        <td scope="row" className="text-center">{v.numberCylinder}</td>
                                                                    </tr>)
                                                                })

                                                            })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <table
                                                    className="table table-hover text-center table-striped table-bordered seednet-table-keep-column-width"
                                                    cellSpacing="0"
                                                >
                                                    <thead className="table__head">
                                                        <tr>
                                                            <th scope="col">STT</th>
                                                            <th scope="col">Mã bình</th>
                                                            <th scope="col">Tên File</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.props.listShippingText.map((store, index) => {
                                                            return store.map((v, i) => {
                                                                return (<tr key={i}>
                                                                    <td scope="row" className="text-center">{i + 1}</td>
                                                                    <td scope="row" className="text-center">{v.serial}</td>
                                                                    <td scope="row" className="text-center">{v.fileName}</td>
                                                                </tr>)
                                                            })

                                                        })}

                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <table
                                                    className="table table-hover text-center table-striped table-bordered seednet-table-keep-column-width"
                                                    cellSpacing="0"
                                                >
                                                    <thead className="table__head">
                                                        <tr>
                                                            <th scope="col">Mã đơn hàng</th>
                                                            <th scope="col">Khách hàng</th>
                                                            <th scope="col">Mã chi nhánh</th>
                                                            <th scope="col">Ngày giao hàng</th>
                                                            <th scope="col">Số lượng bình</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            this.props.listShippingOrder.map((store, index) => {

                                                                return (<tr key={index}>
                                                                    <td scope="row" className="text-center">{store.id}</td>
                                                                    <td></td>
                                                                    <td>{store.agencyId}</td>
                                                                    <td>{store.deliveryDate}</td>
                                                                    <td scope="row" className="text-center">{store.numberCylinders}</td>
                                                                </tr>)
                                                            })

                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default withNamespaces()(PopupShippingDetail);