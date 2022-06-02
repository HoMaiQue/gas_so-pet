import React from 'react';
import getUserCookies from "getUserCookies";
import {withNamespaces} from 'react-i18next';
import { Table, Button, Row, Col,Modal,Input,Tooltip,Switch} from 'antd';
import required from 'required';
import showToast from 'showToast';
import { data } from 'jquery';

const dataSource = [
    {
      id:1,
      name:'CYLINDER BANK AREA(KHU VỰC CHỨA BÌNH GAS)',
      description1:'Combustive meterial (Các vật dễ cháy)',
      description2:'Warning signs (Biển cảnh báo)',
      description3:'Fire extinguisher (Bình chữa cháy)',
      stt:2,
      combustiveMaterial:"",
      fireExtinguisher:"",
      warningSigns:""
    },
    {
      id:2,
      name:'CYLINDER (CÁC BÌNH CHỨA GAS)',
      description1:'Appearance (Tình trạng bên ngoài)',
      description2:'Others (Các lí do khác)',
      cylindersOthers:"",
      appearance:"",
      description3:'',
      stt:2
    },
    {
      id:3,
      name:'PIG TAILS (CÁC ỐNG MỀM TỪ BÌNH GAS VÀO ỐNG GÓP)',
      description1:'Type (Chủng loại)',
      description2:'Appearance (Tình trạng bên ngoài)',
      description3:'',
      pigTails_Type:"",
      pigTails_Appearance:"",
      stt:2
    },
    {
      id:4,
      name:'PIPING (ỐNG GÓP TRƯỚC VAN ĐIỀU ÁP CẤP 1)',
      description1:'Leakage (Rò rỉ)',
      description2:'Others (Các lí do khác)',
      description3:'',
      pipingBefore_1stRegulator_Others:"",
      pipingBefore_1stRegulator_Leakage:"",
      stt:2
    },
    {
      id:5,
      name:'PIPING AFTER 1st REGULATOR (ỐNG GÓP SAU VAN ĐIỀU ÁP CẤP 1)',
      description1:'Leakage (Rò rỉ)',
      description2:'Others (Các lí do khác)',
      description3:'',
      pipingAfter_1stRegulator_Others:"",
      pipingAfter_1stRegulator_Leakage:"",
      stt:2
    },
    {
      id:6,
      name:'ALL THE VALSE ON PIPING (HỆ THỐNG VAN TRÊN ỐNG GÓP)',
      description1:'Leakage (Rò rỉ)',
      description2:'Others (Các lí do khác)',
      description3:'',
      valesOnPiping_Leakage:"",
      valesOnPiping_Others:"",
      stt:2
    },
    {
      id:7,
      name:'HOSE CONNECT TO APPLIANCES (CÁC ỐNG MỀM TỪ ỐNG GÓP VÀO THIẾT BỊ ĐỐT)',
      description1:'Leakage (Rò rỉ)',
      description2:'Others (Các lí do khác)',
      description3:'',
      hoseConnect_Type:"",
      hoseConnect_Appearance:"",
      stt:2
    },
    {
      id:8,
      name:'PERIODICAL INSPECTION DEVICES WHICH LAW REQUIRED TO INSPECT (CÁC THIẾT BỊ CÓ YÊU CẦU KIỂM ĐỊNH THEO DỊNH KY THEO QUY ĐỊNH)',
      description1:'Type (Chủng loại)',
      description2:'Appearance (Tình trạng bên ngoài)',
      description3:'',
      periodicalInspection_Devices:"",
      stt:2
    },
  ];
class ViewScedulESHistories extends React.Component {

    constructor(props) {
        super(props);
        this.form = null;
        this.state = 
        {
        }
    }
    setOkVisibleHistory=()=>{
       this.props.onClickHistoryCallBack(false);
    }
    setCancelVisibleHistory=()=>{
        this.props.onClickHistoryCallBack(false);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.inspectorGetChecklist.length!== 0){
            let data=nextProps.inspectorGetChecklist.checklistdetail;
                console.log("data111111",data);     
                //console.log("data1111112",nextProps.inspectorGetChecklist);       
                data.map((item,index)=>{
                    if(nextProps.statusDataSource===false){
                        for(let i=0;i<dataSource.length;i++){
                            if(dataSource[i].combustiveMaterial==="" && dataSource[i].fireExtinguisher==="" && dataSource[i].warningSigns===""){
                                // console.log("item.combustiveMaterial1",item.combustiveMaterial);
                                dataSource[i].combustiveMaterial =item.combustiveMaterial;
                                dataSource[i].fireExtinguisher=item.fireExtinguisher;
                                dataSource[i].warningSigns=item.warningSigns;
                                continue;
                            }else if(dataSource[i].cylindersOthers==="" || dataSource[i].appearance===""){
                                dataSource[i].cylindersOthers=item.cylindersOthers;
                                dataSource[i].appearance=item.appearance;
                                continue;
                            }else if(dataSource[i].pigTails_Appearance==="" && dataSource[i].pigTails_Type===""){
                                dataSource[i].pigTails_Appearance=item.pigTails_Appearance;
                                dataSource[i].pigTails_Type=item.pigTails_Type;
                                continue;
                            }else if(dataSource[i].pipingBefore_1stRegulator_Leakage==="" && dataSource[i].pipingBefore_1stRegulator_Others===""){
                                dataSource[i].pipingBefore_1stRegulator_Leakage=item.pipingBefore_1stRegulator_Leakage;
                                dataSource[i].pipingBefore_1stRegulator_Others=item.pipingBefore_1stRegulator_Others;
                                continue;    
                            }else if(dataSource[i].pipingAfter_1stRegulator_Leakage==="" && dataSource[i].pipingAfter_1stRegulator_Others==="" ){
                                dataSource[i].pipingAfter_1stRegulator_Leakage=item.pipingAfter_1stRegulator_Leakage;
                                dataSource[i].pipingAfter_1stRegulator_Others=item.pipingAfter_1stRegulator_Others;
                                continue;   
                            }else if(dataSource[i].valesOnPiping_Leakage==="" && dataSource[i].valesOnPiping_Others===""){
                                dataSource[i].valesOnPiping_Leakage=item.valesOnPiping_Leakage;
                                dataSource[i].valesOnPiping_Others=item.valesOnPiping_Others;
                                continue;
                            }else if(dataSource[i].hoseConnect_Appearance==="" && dataSource[i].hoseConnect_Type===""){
                                dataSource[i].hoseConnect_Appearance =item.hoseConnect_Appearance;
                                dataSource[i].hoseConnect_Type=item.hoseConnect_Type;
                                continue;
                            }else if(dataSource[i].periodicalInspection_Devices==="" ){
                                dataSource[i].hoseConnect_Appearance =item.periodicalInspection_Devices;
                                continue;
                            }
                        }
                    }else if(nextProps.statusDataSource===true){
                        for (let i = 0; i < dataSource.length; i++) {
                            if (dataSource[i].combustiveMaterial && dataSource[i].fireExtinguisher && dataSource[i].warningSigns) {
                                // console.log("item.combustiveMaterial1",item.combustiveMaterial);
                                dataSource[i].combustiveMaterial = item.combustiveMaterial;
                                dataSource[i].fireExtinguisher = item.fireExtinguisher;
                                dataSource[i].warningSigns = item.warningSigns;
                            } else if (dataSource[i].cylindersOthers && dataSource[i].appearance) {
                                dataSource[i].cylindersOthers = item.cylindersOthers;
                                dataSource[i].appearance = item.appearance;
                            } else if (dataSource[i].pigTails_Appearance && dataSource[i].pigTails_Type) {
                                dataSource[i].pigTails_Appearance = item.pigTails_Appearance;
                                dataSource[i].pigTails_Type = item.pigTails_Type;
                            } else if (dataSource[i].pipingBefore_1stRegulator_Leakage && dataSource[i].pipingBefore_1stRegulator_Others) {
                                dataSource[i].pipingBefore_1stRegulator_Leakage = item.pipingBefore_1stRegulator_Leakage;
                                dataSource[i].pipingBefore_1stRegulator_Others = item.pipingBefore_1stRegulator_Others;
                            } else if (dataSource[i].pipingAfter_1stRegulator_Leakage && dataSource[i].pipingAfter_1stRegulator_Others) {
                                dataSource[i].pipingAfter_1stRegulator_Leakage = item.pipingAfter_1stRegulator_Leakage;
                                dataSource[i].pipingAfter_1stRegulator_Others = item.pipingAfter_1stRegulator_Others;
                            } else if (dataSource[i].valesOnPiping_Leakage && dataSource[i].valesOnPiping_Others) {
                                dataSource[i].valesOnPiping_Leakage = item.valesOnPiping_Leakage;
                                dataSource[i].valesOnPiping_Others = item.valesOnPiping_Others;
                            } else if (dataSource[i].hoseConnect_Appearance && dataSource[i].hoseConnect_Type) {
                                dataSource[i].hoseConnect_Appearance = item.hoseConnect_Appearance;
                                dataSource[i].hoseConnect_Type = item.hoseConnect_Type;
                            } else if (dataSource[i].periodicalInspection_Devices) {
                                dataSource[i].hoseConnect_Appearance = item.periodicalInspection_Devices;
                            }
                        }
                           
                    }

                    
                })
               
                console.log("dataSourceNha",dataSource);
               
               
                
        }
    }    
    render() {
        // console.log("this.state.inspectorGetChecklist",this.props.inspectorGetChecklist)
        //console.log("dataSourceNha", this.props.inspectorGetChecklist);
        const columns = [
            {
              
              dataIndex: 'id',
              key: 'id',
            },
            {
              
              dataIndex: 'name',
              key: 'name',
              width: 300,
            },
            {
                
                dataIndex: 'description1',
                key: 'description1',
            
                render: (record, index) => {
                    return (
                        <div className="row">
                            <div className="col-md-6">
                            <ul>
                                <li style={{ listStyleType: 'none' }}>{index.description1}
                                </li>
                                <br></br>
                                <li style={{ listStyleType: 'none' }}>{index.description2}
                                </li>
                                <br></br>
                                <li style={{ listStyleType: 'none' }}>{index.description3}
                                </li>
                            </ul>
                            </div>
                            <div className="col-md-6">
                            <ul>
                                <li style={{ listStyleType: 'none' }}>
                                    <div className="row">
                                    {index.id===1 &&(
                                        <div className="col-md-6">
                                            {index.combustiveMaterial==="true"?"Có":"Không"}
                                        </div>
                                    )}
                                    {index.id===2 &&(
                                        <div className="col-md-6">
                                            {index.cylindersOthers}
                                        </div>
                                    )}
                                    {index.id===3 &&(
                                        <div className="col-md-6">
                                            {index.pigTails_Type}
                                        </div>
                                    )}
                                    {index.id===4 &&(
                                        <div className="col-md-6">
                                            {index.pipingBefore_1stRegulator_Leakage==="true"?"Có":"Không"}
                                        </div>
                                    )}
                                      {index.id===5 &&(
                                        <div className="col-md-6">
                                            {index.pipingAfter_1stRegulator_Leakage==="true"?"Có":"Không"}
                                        </div>
                                    )}
                                    {index.id===6 &&(
                                        <div className="col-md-6">
                                            {index.valesOnPiping_Leakage==="true"?"Có":"Không"}
                                        </div>
                                    )}
                                    {index.id===7 &&(
                                        <div className="col-md-6">
                                            {index.hoseConnect_Appearance}
                                        </div>
                                    )}
                                     {index.id===8 &&(
                                        <div className="col-md-6">
                                            {index.hoseConnect_Appearance}
                                        </div>
                                    )}
                                    {/* {(index.id===1 &&index.combustiveMaterial=="true") ||
                                    index.id===4 && index.pipingBefore_1stRegulator_Leakage==="true" ||
                                    index.id===5 && index.pipingAfter_1stRegulator_Leakage==="true"||
                                    index.id===6 && index.valesOnPiping_Leakage==="true"?(
                                        <div className="col-md-6"> 
                                        <Switch
                                        checked={true}/></div>  
                                    ):
                                    index.id===1 &&index.combustiveMaterial=="false" ||
                                    index.id===4 && index.pipingBefore_1stRegulator_Leakage==="false" ||
                                    index.id===5 && index.pipingAfter_1stRegulator_Leakage==="false" ||
                                    index.id===6 && index.valesOnPiping_Leakage==="false"?(
                                    <div className="col-md-6"> 
                                    <Switch
                                    checked={false}/></div>
                                    ):
                                    ("")} */}
                                 </div>   
                                </li>
                                <br></br>
                                <li style={{ listStyleType: 'none' }}>
                                    <div className="row">
                                    {index.id===1 &&(
                                        <div className="col-md-6">
                                            {index.warningSigns==="true"?"Có":"Không"}
                                        </div>
                                    )}
                                    {index.id===2 &&(
                                        <div className="col-md-6">
                                            {index.appearance}
                                        </div>
                                    )}
                                     {index.id===3 &&(
                                        <div className="col-md-6">
                                            {index.pigTails_Appearance}
                                        </div>
                                    )}
                                    {index.id===4 &&(
                                        <div className="col-md-6">
                                            {index.pipingBefore_1stRegulator_Others}
                                        </div>
                                    )}
                                      {index.id===5 &&(
                                        <div className="col-md-6">
                                            {index.pipingAfter_1stRegulator_Others}
                                        </div>
                                    )}
                                     {index.id===6 &&(
                                        <div className="col-md-6">
                                            {index.valesOnPiping_Others}
                                        </div>
                                    )}
                                    {index.id===7 &&(
                                        <div className="col-md-6">
                                            {index.hoseConnect_Type}
                                        </div>
                                    )}
                                    {/* {index.id===1 &&index.warningSigns=="true"?(
                                        <div className="col-md-6"> 
                                        <Switch
                                        checked={true}/></div>
                                        
                                    ):index.id===1 &&index.warningSigns=="false"?
                                    (
                                    <div className="col-md-6"> 
                                    <Switch
                                    checked={false}/></div>
                 
                                    ):
                                    ("")} */}
                                    </div>
                                </li>
                                <br></br>
                                {index.description3!=="" && (
                                    <li style={{ listStyleType: 'none' }}>
                                        <div className="row">
                                        {index.id===1 &&(
                                        <div className="col-md-6">
                                            {index.fireExtinguisher==="true"?"Có":"Không"}
                                        </div>
                                        )}
                                        {/* {index.id===1 &&index.fireExtinguisher=="true"?(
                                        <div className="col-md-6"> 
                                        <Switch
                                        checked={true}/></div>
                                        
                                    ):(
                                    <div className="col-md-6"> 
                                    <Switch
                                    checked={false}/></div>
                 
                                    )} */}
                                        </div>
                                    </li>
                                )}
                                
                            </ul>
                            </div>
                            
                        </div>  
                    )
                }
            },
          ];
        return (
            <div className="row">
               
                    <Modal
                        title="ITEM CHECKING- CÁC HẠNG MỤC KIỂM TRA"
                        centered
                        visible={this.props.visibleHistory}
                        onOk={(e) => this.setOkVisibleHistory(e)}
                        onCancel={(e) => this.setCancelVisibleHistory(e)}
                        width={1000}
                    >
                        <Row>
                        <Table dataSource={dataSource} columns={columns} />
                        </Row>
                        <Row>
                        <h6>NHẬN XÉT VÀ ĐỀ XUẤT</h6>
                        <h5>{"     "+this.props.inspectorGetChecklist.note}.</h5>
                        </Row>
                        <Row>
                            <Col  xs={7}>
                                <Row>
                                    <Col  xs={12}>
                                    <h8>Checked by</h8>
                                    <br></br>
                                    <h9>Kiểm tra bởi</h9>      
                      <img src={'data:image/png;base64,'+this.props.inspectorGetChecklist.signature_CheckedBy+''} alt="this is car image" />
                                    </Col>
                                    <Col  xs={12}>

                                     </Col>
                                </Row>
                            </Col>
                            <Col  xs={10}></Col>
                            <Col xs={6}>
                            <Row>
                                    <Col  xs={20}>
                                    <h8>Verified by</h8>
                                    <br></br>
                                    <h9>Xác nhận việc thực hiện kiểm tra</h9>
                                    <img src={'data:image/png;base64,'+this.props.inspectorGetChecklist.signature_VerifiedBy+''} alt="this is car image"/>
                                    </Col>
                                    <Col  xs={4}>
                           
                                     </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Modal>
               
            </div>
        );
    }
}
export default withNamespaces()(ViewScedulESHistories);        