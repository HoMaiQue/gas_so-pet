import React from 'react';
import {withNamespaces} from 'react-i18next';
import { Table, Button, Row, Col,Modal,Input,Tooltip,Switch} from 'antd';
import moment from "moment";
const defaultPageSize = {
	defaultPageSize: 5,
  };
class NumberOfCylinder extends React.Component {

    constructor(props) {
        super(props);
        this.form = null;
        this.state = 
        {
        }
    }
    setOkNumberOfCylinder=()=>{
        this.props.onClickNumberOfCylinder(false);
     }
     setCancelNumberOfCylinder=()=>{
         this.props.onClickNumberOfCylinder(false);
     }
    render(){
        console.log("this.props.visibleNumberOfCylinder",this.props.visibleNumberOfCylinder);
        console.log("this.props.visibleNumberOfCylinder",this.props.indexCylinders);
        const columns=[
            { 
                title: 'Serial',
                render:(record,index)=>{
                    console.log("record",record)
                    return(
                        <div>
                            {record.serial}       
                        </div>
                    )
                    
                }
            },
            { 
                title: 'Loại bình',
                render:(record,index)=>{
                    console.log("record",record)
                    return(
                        <div>
                            {record.cylinderType}    
                        </div>
                    )
                    
                }
            },
            { 
                title: 'Màu sắc',
                render:(record,index)=>{
                    console.log("record",record)
                    return(
                        <div>
                            {record.color}       
                        </div>
                    )
                    
                }
            },
            { 
                title: 'Hạn kiểm định',
                render:(record,index)=>{
                    console.log("record",record)
                    return(
                        <div>
                            {moment(record.checkedDate).format("DD/MM/YYYY HH:mm")}    
                        </div>
                    )
                    
                }
            },
            { 
                title: 'Trọng lượng',
                render:(record,index)=>{
                    console.log("record",record)
                    return(
                        <div>
                            {record.weight}    
                        </div>
                    )
                    
                }
            },
            
        ];
        return(
            <div className="row">
                    <Modal
                        title="Chi Tiết bình"
                        centered
                         visible={this.props.visibleNumberOfCylinder}
                        onOk={(e) => this.setOkNumberOfCylinder(e)}
                        onCancel={(e) => this.setCancelNumberOfCylinder(e)}
                        width={1000}
                    >
                        <Table 
                        dataSource={this.props.indexCylinders} 
                        columns={columns}
                        bordered={true}
						pagination={defaultPageSize}
                         />
                    </Modal>
            </div>
        )
    }
}
export default withNamespaces()(NumberOfCylinder);     