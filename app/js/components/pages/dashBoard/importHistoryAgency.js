import { extend } from 'lodash';
import React, { Component } from 'react';
import {withNamespaces} from 'react-i18next';
class ImportHistoryAgency extends Component
{
    render() {
        return (
            <div hidden={true}>
            <table id="importHistory" >
                <thead>
                    <tr>
                        <th colSpan="11">
                            <h1>Thông tin nhập hàng</h1>
                        </th>
                    </tr>
                    <tr>
                        <th colSpan="8"></th>
                        <th colSpan="3">
                            D.O. No.:
                        </th>
                    </tr>
                    <tr>
                        <th colSpan="8"></th>
                        <th colSpan="3">
                            Date: 
                        </th>
                    </tr>
                    <tr>
                        <th colSpan="8">
                            <h5>
                                Quý công ty vui lòng giao hàng lên phương tiện Vận tải được chỉ định bời Công ty TNHH GAS SOPET
                                với các chi tiết sau:
                            </h5>
                        </th>
                    </tr>
                    <tr>
                        <th rowSpan="2" colSpan="1">No.</th>
                        <th rowSpan="2" colSpan="1">Ngày nhập hàng</th>
                        <th rowSpan="2" colSpan="1">Số Serial</th>
                        <th rowSpan="2" colSpan="1">Màu sắc</th>
                        <th rowSpan="2">Tên tài xế</th>
                        <th rowSpan="2">Số xe</th>
                        <th rowSpan="2">Thời gian kiểm định</th>
                        <th colSpan="3" rowSpan="1">Thông tin của bình</th>
                    </tr>
                    <tr>
                        <th colSpan="1" rowSpan="1">Loại Van</th>
                        <th colSpan="1" rowSpan="1">Loại bình</th>
                        <th colSpan="1" rowSpan="1">Cân nặng</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.historyImportExcel.map((p, index) => {
                        const moment = require('moment');
                        const isCorrectFormat = (dateString, format) => {
                            return moment(dateString, format, true).isValid()
                        }
                        return <tr key={index}>
                            <td>{index}+1</td>
                            <td>{isCorrectFormat(p.driverCreatedAt,'DD/MM/YYYY')===true?p.driverCreatedAt:moment(p.driverCreatedAt).format("DD/MM/YYYY")}</td>
                            <td>{p.serial}</td>
                            <td>{p.color}</td>
                            <td>{p.nameDriver}</td>
                            <td>{p.address}</td>
                            <td>{p.checkedDate}</td>
                            <td>{p.typeValue}</td>
                            <td>{p.cylinderType}</td>
                            <td>{p.weight !== 0 ? p.weight : ''}</td>
                        </tr>
                    })}
                </tbody>
                <tr><td></td></tr>
                <tr><td></td></tr>
                <tr>
                    <td colSpan="8">
                        <h5>
                            Quý công ty vui lòng xác nhận Số phương tiện vận tải và thông báo với chúng tôi Ngay trong
                            trường hợp không thể giao hàng
                            Mọi thông tin xin vui lòng liên hệ: Ms. Nguyen Thi My Linh (0907 278 499) hoặc                            
                        </h5>
                    </td>
                </tr>
            </table>
            </div>
        )
    }
}

export default withNamespaces()(ImportHistoryAgency);