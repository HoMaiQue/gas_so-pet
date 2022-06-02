import React, { Component } from "react";
import moment from "moment";
import RenderListCylinderTurnBack from "./RenderListCylinderTurnback";
import "./style.scss";

export default class importPrinterTurnback extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataForPrint: [],
			dataPrint: [],
			groupCYL50: [],
			groupCYL45: [],
			groupCYL12: [],
		};
	}

	componentDidUpdate = async (prevProps) => {
		// Typical usage (don't forget to compare props):
		if (this.props.dataPrint !== prevProps.dataPrint) {
			this.setState({ dataPrint: this.props.dataPrint }, () =>
				this.classifyCylinder()
			);
		}
	};

	classifyCylinder = async () => {
		const { dataPrint } = this.state;

		console.log("classifyCylinder", dataPrint);
		if (dataPrint.length > 0) {
			let _data = [];

			dataPrint.map((data) => {
				const cylinders = data.cylinders;
				const length = cylinders.length;

				const dateFormat = moment(data.date).format("DD/MM/YYYY, h:mm:ss a");

				let groupCYL50 = [];
				let groupCYL45 = [];
				let groupCYL12 = [];

				for (let i = 0; i < length; i++) {
					if (cylinders[i].typeCylinder === "CYL50KG") {
						groupCYL50.push(cylinders[i]);
					} else if (cylinders[i].typeCylinder === "CYL45KG") {
						groupCYL45.push(cylinders[i]);
					} else {
						groupCYL12.push(cylinders[i]);
					}
				}

				_data.push({
					orderCode: data.orderCode,
					customerCode: data.customerCode,
					customerName: data.customerName,
					agencyCode: data.agencyCode,
					agencyName: data.agencyName,
					address: data.address,
					driverName: data.driverName,
					licensePlate: data.licensePlate,
					dateFormat,
					signature: data.signature,
					groupCYL50,
					groupCYL45,
					groupCYL12,
				});
			});

			this.setState({ dataForPrint: _data });
		}
	};

	render() {
		const {
			dataForPrint,
			dataPrint,
			groupCYL50,
			groupCYL45,
			groupCYL12,
		} = this.state;

		// console.log('groupCYL', groupCYL50, groupCYL45, groupCYL12)
		console.log("dataPrin1t1111", dataPrint);
		// let dateFormat = "";

		// if(dataPrint.length > 0) {
		//     dateFormat = moment(dataPrint[0].date).format('DD/MM/YYYY, h:mm:ss a');
		// }

		return (
			<div id="print">
				{dataForPrint.length > 0 ? (
					<div id="print-content">
						{/* Thông tin công ty */}
						<div className="print-header">
							<div className="logo left">
								<img
									src="./../../../assets/img/printer/logo1.jpg"
									alt="logo left"
								/>
							</div>
							<div className="header-content center">
								<h1>SOPET Gas One COMPANY LIMITED</h1>
								<p>
									Hamlet 2, Phuoc Khanh Com., Nhon Trach Dist., Dong Nai,
									Vietnam
								</p>
								<p>
									Office: 8rd Floor, Paragon Sai Gon, 3 Nguyen Luong Bang, Phu
									My Hung, Dist.7, HCM City, Vietnam
								</p>
							</div>
							<div className="logo right">
								<img
									src="./../../../assets/img/printer/logo2.JPG"
									alt="logo left"
								/>
							</div>
						</div>
						{/* Địa chỉ giao hàng */}
						<div className="print-address">
							<h2>BIÊN BẢN GIAO NHẬN HÀNG</h2>
							<p>
								<span>Mã khách hàng: {dataForPrint[0].customerCode}</span>
								<span>Địa chỉ: {dataForPrint[0].address}</span>
							</p>
							<p>
								<span>Tên khách hàng: {dataForPrint[0].customerName}</span>
								<span>Ngày giờ: {dataForPrint[0].dateFormat}</span>
							</p>
							<p>
								<span>Mã chi nhánh: {dataForPrint[0].agencyCode}</span>
								<span>NV giao hàng: {dataForPrint[0].driverName}</span>
							</p>
							<p>
								<span>Tên chi nhánh: {dataForPrint[0].agencyName}</span>
								<span>Số xe: {dataForPrint[0].licensePlate}</span>
							</p>
						</div>
						<div className="line"></div>
						{/* Nội dung đơn hàng */}
						<div className="main-content">
							<h2>NHẬN BÌNH RỖNG (ECYLINDER)</h2>

							{/* Gọi component để render list bình theo data truyền vào props */}
							<RenderListCylinderTurnBack
								data={dataForPrint[0].groupCYL50}
								name="50kg"
							/>
							<RenderListCylinderTurnBack
								data={dataForPrint[0].groupCYL45}
								name="45kg"
							/>
							<RenderListCylinderTurnBack
								data={dataForPrint[0].groupCYL12}
								name="12kg"
							/>
						</div>
						<div className="line"></div>
						<p className="checked-title">
							{/* Đã kiểm tra an toàn và thu hồi bằng bình xịt xà phòng */}
						</p>
						<div className="signature">
							<p className="title-signature">
								<span>Công Ty Sopet Gas One</span>
								<span>Đại Điện Khách Hàng</span>
							</p>
							<p>
								<span>Ký ghi rõ họ tên</span>
								<span>Ký ghi rõ họ tên</span>
							</p>
							<img
								className="signature-image"
								src={"data:image/png;base64," + dataForPrint[0].signature}
							/>
						</div>
					</div>
				) : (
					""
				)}
			</div>
		);
	}
}
