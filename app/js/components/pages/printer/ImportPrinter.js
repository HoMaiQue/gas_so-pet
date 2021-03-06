import React, { Component } from "react";
import moment from "moment";
import "./style.scss";
import RenderListCylinder from "./RenderListCylinder";

export default class ImportPrinter extends React.Component {
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

			groupCYL50,
			groupCYL45,
			groupCYL12,
		} = this.state;

		// console.log('groupCYL', groupCYL50, groupCYL45, groupCYL12)
		console.log("dataPrint", dataForPrint);
		// let dateFormat = "";
		// if(dataPrint.length > 0) {
		//     dateFormat = moment(dataPrint[0].date).format('DD/MM/YYYY, h:mm:ss a');
		// }

		return (
			<div id="print">
				{dataForPrint.length > 0 ? (
					<div id="print-content">
						{/* Th??ng tin c??ng ty */}
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
						{/* ?????a ch??? giao h??ng */}
						<div className="print-address">
							<h2>BI??N B???N GIAO NH???N H??NG</h2>
							<p>
								<span>M?? kh??ch h??ng: {dataForPrint[0].customerCode}</span>
								<span>?????a ch???: {dataForPrint[0].address}</span>
							</p>
							<p>
								<span>T??n kh??ch h??ng: {dataForPrint[0].customerName}</span>
								<span>Ng??y gi???: {dataForPrint[0].dateFormat}</span>
							</p>
							<p>
								<span>M?? chi nh??nh: {dataForPrint[0].agencyCode}</span>
								<span>NV giao h??ng: {dataForPrint[0].driverName}</span>
							</p>
							<p>
								<span>T??n chi nh??nh: {dataForPrint[0].agencyName}</span>
								<span>S??? xe: {dataForPrint[0].licensePlate}</span>
							</p>
						</div>
						<div className="line"></div>
						{/* N???i dung ????n h??ng */}
						<div className="main-content">
							<h2>GIAO B??NH ?????Y (FULL CYLINDER)</h2>

							{/* G???i component ????? render list b??nh theo data truy???n v??o props */}
							<RenderListCylinder
								data={dataForPrint[0].groupCYL50}
								name="50kg"
							/>
							<RenderListCylinder
								data={dataForPrint[0].groupCYL45}
								name="45kg"
							/>
							<RenderListCylinder
								data={dataForPrint[0].groupCYL12}
								name="12kg"
							/>
						</div>
						<div className="line"></div>
						<p className="checked-title">
							???? ki???m tra an to??n v?? th??? r?? r???.
						</p>
						{/* {(dataForPrint[0].signature==="EX001" ||dataForPrint[0].signature==="Nh???p h??ng tr???c ti???p") && 
						(
							<p className="checked-title">
							Nh???p h??ng tr??n web
							</p>	
						)} */}
						
						<div className="signature">
							<p className="title-signature">
								<span>C??ng Ty Sopet Gas One</span>
								<span>?????i ??i???n Kh??ch H??ng</span>
							</p>
							<p>
								<span>K?? ghi r?? h??? t??n</span>
								<span>K?? ghi r?? h??? t??n</span>
							</p>
							{dataForPrint[0].signature!=="EX001" && dataForPrint[0].signature!=="Nh???p h??ng tr???c ti???p" &&
							(
								<img
								className="signature-image"
								src={"data:image/png;base64," + dataForPrint[0].signature}
							/>
							)}
							
						</div>
					</div>
				) : (
					""
				)}
			</div>
		);
	}
}
