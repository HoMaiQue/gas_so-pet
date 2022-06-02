import { extend } from 'lodash';
import React, { Component } from 'react';
import {withNamespaces} from 'react-i18next';
class TurnBackHistoryAgency extends Component
{
    render() {
        return (
            <div hidden={true}>
            <table id="turnBackHistory" >
                <thead>
                    <tr>
                        <th colSpan="11">
                            <h1>Thông tin nhập hồi lưu</h1>
                        </th>
                    </tr>
                    <tr><th></th></tr>
                    <tr><th></th></tr>
                    <tr><th></th></tr>
                    <tr><th></th></tr>
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
                        <th rowSpan="2">Trạng thái</th>
                        <th rowSpan="2">Ghi chú</th>
                    </tr>
                    <tr>
                        <th colSpan="1" rowSpan="1">Loại Val</th>
                        <th colSpan="1" rowSpan="1">Loại bình</th>
                        <th colSpan="1" rowSpan="1">Cân nặng</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.historyTurnBackExcel.map((p, index) => {
                        return <tr key={index}>
                            <td>{index}+1</td>
                            <td>{p.checkedDate}</td>
                            <td>{p.serial}</td>
                            <td>{p.color}</td>
                            <td>{p.nameDriver}</td>
                            <td>{p.address}</td>
                            <td>{p.driverCreatedAt}</td>
                            <td>{p.typeValue}</td>
                            <td>{p.cylinderType}</td>
                            <td>{p.weight !== 0 ? p.weight : ''}</td>
                            <td>{p.status}</td>
                            <td>{p.signature}</td>
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

export default withNamespaces()(TurnBackHistoryAgency);