import React, { Component } from 'react';
import "./PrinterRecordDelivery.scss";
import Moment from 'moment';
class PrinterRecordDelivery extends Component {
    render() {
        const {inspectorGetChecklist,listInformation} =this.props;
        console.log("inspectorGetChecklist",inspectorGetChecklist,'------',listInformation)
        return (
            <div id ='PrinterRecordDelivery'>
                    {/* Thông tin công ty */}
                <div className="print-header">
                    <div className="logo left">
                        <img
                            src="./../../../assets/img/printer/logo1.jpg"
                            alt="logo left"
                        />
                    </div>
                    <div className="header-content center">
                        <h4>SOPET Gas One COMPANY LIMITED</h4>
                        <p>
                        Office: 8rd Floor, Paragon Sai Gon, 3 Nguyen Luong Bang, Phu
                        My Hung, Dist.7, HCM City, Vietnam
                        </p>
                        <p>
                        Tel:(28) 54135 497  <span>Fax:(28) 5413 5467</span>
                        </p>
                        <p>
                        Terminal: Hamlet 2, Phuoc Khanh Com., Nhon Trach Dist., Dong Nai,
                            Vietnam
                        </p>
                        <p>
                        Tel:(251) 3577 096  <span>Fax:(251) 3576 526</span>
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
                    <h3>CHECKLIST FOR USING SYSTEM OF CYLINDER</h3>
                    <h4>(DANH MỤC KIỂM TRA HỆ THỐNG SỬ DỤNG GAS BÌNH)</h4>
                    <p><span></span><span className="coppy2">Coppy2: Customer (Liên 2: Khách hàng)</span></p>
                    <p className="bt">
                    <span className="bold">Company name (Tên công ty):</span>{listInformation?listInformation.nameCompany:""}
                        
                    
                    </p>
                    <p>
                        <span><span className="bold">Date (Ngày kiểm tra):</span>{listInformation?listInformation.maintenanceDate:""}</span>
                        <span className="checked"><span className="bold">Checked by (Kiểm tra bởi):</span>{listInformation?listInformation.idInspector:""} </span>
                    </p>
                    <p className="bt">
                    <span className="bold"> Location (Địa chỉ):</span>{listInformation?listInformation.location:""} 
                    
                    </p>
                
                </div>
                {/* in bảng dữ liệu*/}
                <div className="print-table">
                        <h3>ITEM CHECKING - CÁC HẠNG MỤC KIỂM TRA</h3>
                        {inspectorGetChecklist.checklistdetail?inspectorGetChecklist.checklistdetail.map((data,index)=>{
                            return(
                        <table className="table table-bordered" key={index} >
                            <tbody>
                                <tr>
                                    <th rowSpan="3" scope="rowgroup"  className="cot1">1</th>
                                    <th rowSpan="3" scope="rowgroup"  className="cot2">  CYLINDER BANK AREA(KHU VỰC CHỨA BÌNH GAS)</th>
                                    <th scope="row">Combustive material (Các vật dễ cháy):<span className="result">{data.combustiveMaterial==="true"?"Có":"Không"}</span></th>
                                </tr>
                                <tr>
                                    <th scope="row">Waring signs (Biển cảnh báo):<span className="result">{data.warningSigns==="true"?"Có":"Không"}</span></th>
                                </tr>
                                <tr>
                                    <th scope="row">Fire extinguisher (Bình chữa cháy):<span className="result">{data.fireExtinguisher==="true"?"Có":"Không"}</span></th>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <th rowSpan="3" scope="rowgroup" className="cot1">2</th>
                                    <th rowSpan="3" scope="rowgroup" className="cot2">  CYLINDER (CÁC BÌNH CHỨA GAS)</th>
                                    <th scope="row">Appearance (Tình trạng bên ngoài):<span className="result">{data.appearance}</span></th>
                                </tr>
                                <tr>
                                    <th scope="row">Other (Các lý do khác):<span className="result">{data.cylindersOthers}</span></th>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <th rowSpan="3" scope="rowgroup" className="cot1">3</th>
                                    <th rowSpan="3" scope="rowgroup" className="cot2">PIG TAILS (CÁC ỐNG MỀM TỪ BÌNH GAS VÀO ỐNG GÓP)</th>
                                    <th scope="row">Type (Chủng loại):<span className="result">{data.pigTails_Type}</span></th>
                                </tr>
                                <tr>
                                    <th scope="row">Appearance (Tình trạng bên ngoài):<span className="result">{data.pigTails_Appearance}</span></th>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <th rowSpan="3" scope="rowgroup" className="cot1">4</th>
                                    <th rowSpan="3" scope="rowgroup" className="cot2">PIPING FROM CYLINDER TO 1st REGULATOR (ỐNG GÓP TRƯỚC VAN ĐIỀU ÁP CẤP 1)</th>
                                    <th scope="row">Leakage (Rò rỉ):<span className="result">{data.pipingBefore_1stRegulator_Leakage==="true"?"Có":"Không"}</span></th>
                                </tr>
                                <tr>
                                    <th scope="row">Other (Các lý do khác):<span className="result">{data.pipingBefore_1stRegulator_Others}</span></th>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <th rowSpan="3" scope="rowgroup" className="cot1">5</th>
                                    <th rowSpan="3" scope="rowgroup" className="cot2">PIPING AFTER 1st REGULATOR (ỐNG GÓP TRƯỚC VAN ĐIỀU ÁP CẤP 1)</th>
                                    <th scope="row">Leakage (Rò rỉ):<span className="result">{data.pipingAfter_1stRegulator_Leakage==="true"?"Có":"Không"}</span></th>
                                </tr>
                                <tr>
                                    <th scope="row">Other (Các lý do khác):<span className="result">{data.pipingAfter_1stRegulator_Others}</span></th>
                                </tr>
                            </tbody>
                            <tbody style={{width:"50%"}}>
                                <tr>
                                    <th rowSpan="3" scope="rowgroup" className="cot1">6</th>
                                    <th rowSpan="3" scope="rowgroup" className="cot2">ALL THE VALES ON PIPING (HỆ THỐNG VAN TRÊN ỐNG GÓP)</th>
                                    <th scope="row">Leakage (Rò rỉ):<span className="result">{data.valesOnPiping_Leakage==="true"?"Có":"Không"}</span></th>
                                </tr>
                                <tr>
                                    <th scope="row">Other (Các lý do khác):<span className="result">{data.valesOnPiping_Others}</span></th>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <th rowSpan="3" scope="rowgroup" className="cot1">7</th>
                                    <th rowSpan="3" scope="rowgroup" className="cot2">HOSE CONNECT TO APPLIANCES (CÁC ỐNG MỀM TỪ ỐNG GÓP VÀO THIẾT BỊ ĐỐT)</th>
                                    <th scope="row">Type (Chủng loại):<span className="result">{data.hoseConnect_Type}</span></th>
                                </tr>
                                <tr>
                                    <th scope="row">Appearance (Tình trạng bên ngoài):<span className="result">{data.hoseConnect_Appearance}</span></th>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <th rowSpan="3" scope="rowgroup" className="cot1">8</th>
                                    <th rowSpan="3" scope="rowgroup" className="cot2">PERIODICAL INSPECTION DEVICES WHICH LAW REQUIRED TO INSPECT (CÁC THIẾT BỊ CÓ YÊU CẦU KIỂM ĐỊNH ĐỊNH KỲ THEO QUY ĐỊNH)</th>
                                    {/*<th rowSpan="3" scope="rowgroup ">Van an toàn: <span className="result">{data.periodicalInspection_Devices}</span></th>*/}
                                    <th scope="row">Van an toàn:<span className="result">{data.inspectionDate_pipingSystem?Moment(data.inspectionDate_pipingSystem).format('DD/MM/YYYY'):data.inspectionDate_pipingSystem}</span></th>
                                </tr>
                                <tr>
                                    <th scope="row">Đồng hồ áp:<span className="result">{data.inspectionDate_safetyValve?Moment(data.inspectionDate_safetyValve).format('DD/MM/YYYY'):data.inspectionDate_safetyValve}</span></th>
                                </tr>
                                <tr>
                                    <th scope="row">Đường ống:<span className="result">{data.inspectionDate_pressureGauges?Moment(data.inspectionDate_pressureGauges).format('DD/MM/YYYY'):data.inspectionDate_pressureGauges}</span></th>
                                </tr>
                            </tbody>
                        </table>
                        )}):""}
                </div>
                <div className="notes">
                    <h5>NOTES (NHẬN XÉT VÀ ĐỀ XUẤT)</h5>
                    <p>{inspectorGetChecklist.note}</p>
                </div>
                <div className="signature">
                    <p>
                        <span>Checked by</span>
                        <span>Verified by</span>
                    </p>
                    <p>
                    <span>Kiểm tra bởi</span>
                    <span>Xác nhận việc thực hiện kiểm tra</span>
                    </p>
                    <p>
                    <span>
                    <img src={"data:image/png;base64,"+inspectorGetChecklist.signature_CheckedBy} alt={inspectorGetChecklist.signature_CheckedBy} width="40%"/>
                    </span>
                    <span> <img src={"data:image/png;base64,"+inspectorGetChecklist.signature_VerifiedBy} alt={inspectorGetChecklist.signature_VerifiedBy} width="40%"/></span>
                    </p>
                    <p>
                        <span>{inspectorGetChecklist.name_CheckedBy}</span>
                        <span>{inspectorGetChecklist.name_VerifiedBy}</span>
                    </p>
                </div>
            </div>
        );
    }
}

export default PrinterRecordDelivery;
