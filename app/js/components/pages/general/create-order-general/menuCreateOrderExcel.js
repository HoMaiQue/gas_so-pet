import React, { Component } from 'react';
import {withNamespaces} from 'react-i18next';

class MenuCreateOrderExcel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index:11,
            indexCount12COCOMPACTSHELL:0,
            indexCount12COCOMPACTVT:0,
            indexCount12COMPACTORANGE:0,
            indexCount12COMPACTPETRO:0,
            indexCount12POLGRAY:0,
            indexCount12POLYELLOW:0,
            indexCount12POLRED:0,
            indexCount45POLGRAY:0,
            indexCount50POLGRAY:0,
            indexCount452VANGRAY:0,
            indexCount502VANGRAY:0,
            listTableExcelLength:0,
        }
    }
    async componentWillReceiveProps(nextProps) {
        console.log ("nextProps.listTableExcel",nextProps.listMenuCreateOrderTableExcel);
        if(nextProps.listMenuCreateOrderTableExcel.length >0){
            let index=0;
            
            let indexCount12COCOMPACTSHELL=nextProps.listMenuCreateOrderTableExcel.length;
            let indexCount12COCOMPACTVT=nextProps.listMenuCreateOrderTableExcel.length;
            let indexCount12COMPACTORANGE=nextProps.listMenuCreateOrderTableExcel.length;
            let indexCount12COMPACTPETRO=nextProps.listMenuCreateOrderTableExcel.length;
            let indexCount12POLGRAY=nextProps.listMenuCreateOrderTableExcel.length;
            let indexCount12POLYELLOW=nextProps.listMenuCreateOrderTableExcel.length;
            let indexCount12POLRED=nextProps.listMenuCreateOrderTableExcel.length;
            let indexCount45POLGRAY=nextProps.listMenuCreateOrderTableExcel.length;
            let indexCount50POLGRAY=nextProps.listMenuCreateOrderTableExcel.length;
            let indexCount452VANGRAY=nextProps.listMenuCreateOrderTableExcel.length;
            let indexCount502VANGRAY=nextProps.listMenuCreateOrderTableExcel.length;
            let item=nextProps.listMenuCreateOrderTableExcel;
            for(let i=0;i<item.length;i++){
                if(item[i].count12COCOMPACTSHELL!==0){
                    indexCount12COCOMPACTSHELL--;
                }if(item[i].count12COCOMPACTVT!==0){
                    indexCount12COCOMPACTVT--;
                }if(item[i].count12COMPACTORANGE!==0){
                    indexCount12COMPACTORANGE--;
                }if(item[i].count12COMPACTPETRO!==0){
                    indexCount12COMPACTPETRO--;
                }if(item[i].count12POLGRAY!==0){
                    indexCount12POLGRAY--;
                }if(item[i].count12POLYELLOW!==0){
                    indexCount12POLYELLOW--;
                }if(item[i].count12POLRED!==0){
                    indexCount12POLRED--;
                }if(item[i].count45POLGRAY!==0){
                    indexCount45POLGRAY--;
                }if(item[i].count50POLGRAY!==0){
                    indexCount50POLGRAY--;
                }if(item[i].count452VANGRAY!==0){
                    indexCount452VANGRAY--;
                }if(item[i].count502VANGRAY!==0){
                    indexCount502VANGRAY--;
                }
                
            }
            let row1 = indexCount12COCOMPACTSHELL === nextProps.listMenuCreateOrderTableExcel.length ? 1 : 0;
            let row2 = indexCount12COCOMPACTVT === nextProps.listMenuCreateOrderTableExcel.length ? 1 : 0;
            let row3 = indexCount12COMPACTORANGE === nextProps.listMenuCreateOrderTableExcel.length ? 1 : 0;
            let row4 = indexCount12COMPACTPETRO === nextProps.listMenuCreateOrderTableExcel.length ? 1 : 0;
            let row5 = indexCount12POLGRAY === nextProps.listMenuCreateOrderTableExcel.length ? 1 : 0;
            let row6 = indexCount12POLYELLOW === nextProps.listMenuCreateOrderTableExcel.length ? 1 : 0;
            let row7 = indexCount12POLRED === nextProps.listMenuCreateOrderTableExcel.length ? 1 : 0;
            let row8 = indexCount45POLGRAY === nextProps.listMenuCreateOrderTableExcel.length ? 1 : 0;
            let row9 = indexCount50POLGRAY === nextProps.listMenuCreateOrderTableExcel.length ? 1 : 0;
            let row10 = indexCount452VANGRAY === nextProps.listMenuCreateOrderTableExcel.length ? 1 : 0;
            let row11 = indexCount502VANGRAY === nextProps.listMenuCreateOrderTableExcel.length ? 1 : 0;
        this.setState({
            index:11-row11-row10-row9-row8-row7-row6-row5-row4-row3-row2-row1,
            indexCount12COCOMPACTSHELL:indexCount12COCOMPACTSHELL,
            indexCount12COCOMPACTVT:indexCount12COCOMPACTVT,
            indexCount12COMPACTORANGE:indexCount12COMPACTORANGE,
            indexCount12COMPACTPETRO:indexCount12COMPACTPETRO,
            indexCount12POLGRAY:indexCount12POLGRAY,
            indexCount12POLYELLOW:indexCount12POLYELLOW,
            indexCount12POLRED:indexCount12POLRED,
            indexCount45POLGRAY:indexCount45POLGRAY,
            indexCount50POLGRAY:indexCount50POLGRAY,
            indexCount452VANGRAY:indexCount452VANGRAY,
            indexCount502VANGRAY:indexCount502VANGRAY,
            listTableExcelLength:nextProps.listMenuCreateOrderTableExcel.length,
        });
            // console.log("indexCount12COCOMPACTSHELLIndex",this.state.index);
            // console.log("indexCount12COCOMPACTSHELL",indexCount12COCOMPACTSHELL);
            // console.log("indexCount12COCOMPACTVT",indexCount12COCOMPACTVT)
            // console.log("indexCount12COMPACTORANGE",indexCount12COMPACTORANGE)
            // console.log("indexCount12COMPACTPETRO",indexCount12COMPACTPETRO);
            // console.log("indexCount12POLGRAY",indexCount12POLGRAY);
            // console.log("indexCount12POLYELLOW",indexCount12POLYELLOW);
            // console.log("indexCount12POLRED",indexCount12POLRED);
            // console.log("indexCount45POLGRAY",indexCount45POLGRAY);
            // console.log("indexCount50POLGRAY",indexCount50POLGRAY);
            // console.log("indexCount452VANGRAY",indexCount452VANGRAY);
            // console.log("indexCount502VANGRAY",indexCount502VANGRAY);
        
        }        
    }
    render(){
        const{index,
            indexCount12COCOMPACTSHELL,
            indexCount12COCOMPACTVT,
            indexCount12COMPACTORANGE,
            indexCount12COMPACTPETRO,
            indexCount12POLGRAY,
            indexCount12POLYELLOW,
            indexCount12POLRED,
            indexCount45POLGRAY,
            indexCount50POLGRAY,
            indexCount452VANGRAY,
            indexCount502VANGRAY,
            listTableExcelLength}=this.state;
        return (
            <div hidden={true}>
                <table id="listOrder" 
                    class="table">
                    <thead>
                        <tr>
                            <th colSpan="11">
                                <h1>LỆNH GIAO HÀNG</h1>
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
                            {/* {this.props.excelToday} */}
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
                            <th rowSpan="2" colSpan="1">Ngày tạo đơn hàng</th>
                            <th rowSpan="2" colSpan="1">Mã đơn hàng</th>
                            <th rowSpan="2" colSpan="1">Mã khách hàng</th>
                            <th rowSpan="2" colSpan="1">Mã chi nhánh</th>
                            <th rowSpan="2" colSpan="1">Provine</th>
                            <th rowSpan="2">Khách hàng</th>
                            <th rowSpan="2">Số xe</th>
                            <th rowSpan="2">Tài xế</th>
                            <th rowSpan="2">Thời gian giao hàng</th>
                            <th colSpan={index} rowSpan="1">Số lượng bình</th>
                            {/* <th colSpan="4" rowSpan="1">Tổng số lượng bình</th> */}
                            <th rowSpan="2">Trạng thái</th>
                            <th rowSpan="2">Ghi chú</th>
                        </tr>
                        <tr>
                            {indexCount50POLGRAY!==listTableExcelLength &&<th colSpan="1" rowSpan="1">Loại 50kg - POL - Xám</th>}
                            {indexCount502VANGRAY!==listTableExcelLength && <th colSpan="1" rowSpan="1">Loại 50kg - 2 VAN - Xám</th>}
                            {indexCount45POLGRAY!==listTableExcelLength && <th colSpan="1" rowSpan="1">Loại 45kg - POL - Xám</th>}
                            {indexCount452VANGRAY!==listTableExcelLength &&<th colSpan="1" rowSpan="1">Loại 45kg - 2VAN - Xám</th>}
                            {indexCount12POLGRAY!==listTableExcelLength && <th colSpan="1" rowSpan="1">Loại 12Kg - POL - Xám</th>} 
                            {indexCount12POLRED!==listTableExcelLength &&<th colSpan="1" rowSpan="1">Loại 12Kg - POL - Đỏ</th>}
                            {indexCount12POLYELLOW!==listTableExcelLength && <th colSpan="1" rowSpan="1">Loại 12Kg - POL - Vàng</th>}
                            {indexCount12COCOMPACTSHELL!==listTableExcelLength && <th colSpan="1" rowSpan="1">Loại 12COkg -COM - Shell</th>} 
                            {indexCount12COCOMPACTVT!==listTableExcelLength && <th colSpan="1" rowSpan="1">Loại 12COkg -COM - VT</th>}
                            {indexCount12COMPACTPETRO!==listTableExcelLength && <th colSpan="1" rowSpan="1">Loại 12COkg -COM - PETRO</th>}
                            {indexCount12COMPACTORANGE!==listTableExcelLength && <th colSpan="1" rowSpan="1">Loại 12COkg -COM - Cam</th>}

                            {/* <th colSpan="1" rowSpan="1">Loại 12kg</th>
                            <th colSpan="1" rowSpan="1">Loại 12COkg</th>
                            <th colSpan="1" rowSpan="1">Loại 45kg</th>
                            <th colSpan="1" rowSpan="1">Loại 50kg</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.listMenuCreateOrderTableExcel.map((p, index) => {
                            return <tr key={index}>
                                <td>{index +1}</td>
                                <td>{p.createdAt}</td>
                                <td>{p.orderCode}</td>
                                <td>{p.customerCode}</td>
                                <td>{p.agencyCode}</td>
                                <td>{p.Provine}</td>
                                {p.Provine !==""?(
                                    <td>{p.name}, {p.Provine}</td>
                                ):(
                                    <td>{p.name}</td>
                                )}
                                <td></td>
                                <td></td>
                                <td>{p.deliveryDate}</td>

                            {indexCount50POLGRAY!==listTableExcelLength && <td>{ p.count50POLGRAY===0 ?"" :p.count50POLGRAY }</td>}
                            {indexCount502VANGRAY!==listTableExcelLength && <td>{ p.count502VANGRAY===0?"": p.count502VANGRAY}</td>}
                            {indexCount45POLGRAY!==listTableExcelLength && <td>{ p.count45POLGRAY ===0?"":p.count45POLGRAY }</td>}
                            {indexCount452VANGRAY!==listTableExcelLength &&<td>{ p.count452VANGRAY ===0?"":p.count452VANGRAY}</td>}
                            {indexCount12POLGRAY!==listTableExcelLength && <td>{ p.count12POLGRAY===0 ?"" :p.count12POLGRAY }</td>} 
                            {indexCount12POLRED!==listTableExcelLength &&<td>{ p.count12POLRED===0?"": p.count12POLRED}</td>}
                            {indexCount12POLYELLOW!==listTableExcelLength && <td>{ p.count12POLYELLOW===0?"": p.count12POLYELLOW}</td>}
                            {indexCount12COCOMPACTSHELL!==listTableExcelLength && <td>{ p.count12COCOMPACTSHELL ===0?"":p.count12COCOMPACTSHELL}</td>} 
                            {indexCount12COCOMPACTVT!==listTableExcelLength &&  <td>{ p.count12COCOMPACTVT===0 ?"" :p.count12COCOMPACTVT }</td>}
                            {indexCount12COMPACTPETRO!==listTableExcelLength && <td>{ p.count12COMPACTPETRO===0?"": p.count12COMPACTPETRO}</td>}
                            {indexCount12COMPACTORANGE!==listTableExcelLength && <td>{ p.count12COMPACTORANGE ===0?"":p.count12COMPACTORANGE }</td>}
                                {/* <td>{ p.binh12===0?"": p.binh12}</td>
                                <td>{ p.binh12CO===0?"": p.binh12CO}</td>
                                <td>{ p.binh45===0?"": p.binh45}</td>
                                <td>{ p.binh50===0?"": p.binh50}</td> */}
                                <td>{p.status}</td>
                                <td>{p.ghiChu}</td>
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
                                <br></br>
                                Mọi thông tin xin vui lòng liên hệ: Ms. Nguyen Thi My Linh (0907 278 499) hoặc                            
                            </h5>
                        </td>
                    </tr>
                </table>
            </div>
        );
    }

}
export default withNamespaces() (MenuCreateOrderExcel);
