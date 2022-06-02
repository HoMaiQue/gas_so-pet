import React from 'react';
import getUserCookies from "getUserCookies";
import { withNamespaces } from 'react-i18next';
import { Table, Button, Row, Col, Modal, Input, Tooltip, Switch, Tabs } from 'antd';
import required from 'required';
import showToast from 'showToast';
import { data } from 'jquery';
import { isUndefined } from 'lodash';

const { TabPane } = Tabs;
const { TextArea } = Input;
const dataSource1 = [
  {
    id: 1,
    hangmuc: 'Kiểm tra tổng quan bằng mắt. (General visual checking)',
    visualChecking_BeforeMaintenance: '',
    visualChecking_AfterMaintenance: '',
    visualChecking_Results: '',

  },
  {
    id: 2,
    hangmuc: 'Kiểm tra các dấu hiệu ăn mòn bên ngoài của bồn và khu vực bồn,chân móng bồn đường ống. (External corrosion on the tank or tank foundation)',
    corrosionTank_BeforeMaintenance: '',
    corrosionTank_AfterMaintenance: '',
    corrosionTank_Results: ''
  },
  {
    id: 3,
    hangmuc: 'Kiểm tra các các vật liệu dễ gây cháy nổ trong khu vực bồn chứa Gas. (Is there combustive materials in the tank area)',
    combustiveMaterials_BeforeMaintenance: '',
    combustiveMaterials_AfterMaintenance: '',
    combustiveMaterials_Results: ''
  },
  {
    id: 4,
    hangmuc: 'Kiểm tra các biển cấm, các biển báo hướng dẫn. (Warning signs, instruction notice situation)',
    warningSigns_BeforeMaintenance: '',
    warningSigns_AfterMaintenance: '',
    warningSigns_Results: ''
  },
  {
    id: 5,
    hangmuc: 'Kiểm tra rò rỉ của các thiết bị gắn vào bồn. (Leaking test on tanks equipment)',
    leakingTest_BeforeMaintenance: '',
    leakingTest_AfterMaintenance: '',
    leakingTest_Results: ''
  }
];
const dataSource2 = [
  {
    id: 1,
    hangmuc: 'Kiểm tra tình trạng hoạt động của van đóng khẩn cấp. (Test the operation of emergency shut off valve)',
    emergencyShutValve_BeforeMaintenance: '',
    emergencyShutValve_AfterMaintenance: '',
    emergencyShutValve_Results: ''
  },
  {
    id: 2,
    hangmuc: 'Kiểm tra tình trạng hoạt động của van cầu. (Test the operation of globe valves)',
    globeValve_BeforeMaintenance: '',
    globeValve_AfterMaintenance: '',
    globeValve_Results: ''
  },
  {
    id: 3,
    hangmuc: 'Kiểm tra tình trạng hoạt động của van bi. (Test the operation of ball valves)',
    ballValve_BeforeMaintenance: '',
    ballValve_AfterMaintenance: '',
    ballValve_Results: ''
  },
  {
    id: 4,
    hangmuc: 'Kiểm tra tình trạng hoạt động của van xả nước. (Test the operation of drain valves)',
    drainValve_BeforeMaintenance: '',
    drainValve_AfterMaintenance: '',
    drainValve_Results: ''
  },
  {
    id: 5,
    hangmuc: 'Kiểm tra tình trạng hoạt động của van điện tử. (Test the opreration of electriccal valves)',
    electricalValve_BeforeMaintenance: '',
    electricalValve_AfterMaintenance: '',
    electricalValve_Results: ''
  },
  {
    id: 6,
    hangmuc: 'Kiểm tra tình trạng hoạt động của van điều áp cấp 1. (Check the operation of the fist stage regulator)',
    stStageRegulator_BeforeMaintenance: '',
    stStageRegulator_AfterMaintenance: '',
    stStageRegulator_Results: ''
  },
  {
    id: 7,
    hangmuc: 'Kiểm tra ăn mòn của đường ống và các khớp nối. (Visual check the pipe supports, corrosion at the contact point of pipe)',
    pipeCorrosion_BeforeMaintenance: '',
    pipeCorrosion_AfterMaintenance: '',
    pipeCorrosion_Results: ''
  },
  {
    id: 8,
    hangmuc: 'Xả nước và cặn trong đường ống. (Drain of accumulated substance inside the pipeline)',
    drainInsidePipeline_BeforeMaintenance: '',
    drainInsidePipeline_AfterMaintenance: '',
    drainInsidePipeline_Results: ''
  },
  {
    id: 9,
    hangmuc: 'Kiểm tra rò rỉ tại các mối nối, van, lọc... (Check gas leakage on welded joints,flanges,valves,strainers...)',
    checkGasLeakage_BeforeMaintenance: '',
    checkGasLeakage_AfterMaintenance: '',
    checkGasLeakage_Results: ''
  },
];
const dataSource3 = [
  {
    id: 1,
    hangmuc: 'Kiểm tra hệ thống điều khiển, mạch điện. (Checking operation of the control system, electrical circuit)',
    chkCtrlSystem_BeforeMaintenance: '',
    chkCtrlSystem_AfterMaintenance: '',
    chkCtrlSystem_Results: ''

  },
  {
    id: 2,
    hangmuc: 'Kiểm tra khu vực nồi hóa h i. (Check vaporizer area)',
    chkVapoArea_BeforeMaintenance: '',
    chkVapoArea_AfterMaintenance: '',
    chkVapoArea_Results: ''
  },
  {
    id: 3,
    hangmuc: 'Xả những chất cặn trong nước của bộ hóa h i. (Drain out the residue in the water of vaporizer)',
    drainVapo_BeforeMaintenance: '',
    drainVapo_AfterMaintenance: '',
    drainVapo_Results: ''
  },
  {
    id: 4,
    hangmuc: 'h i theo chỉ dẫn của nhà sản xuất. (Top up the water to the right level of vaporizer as request from manufacturer)',
    topUpWater_BeforeMaintenance: '',
    topUpWater_AfterMaintenance: '',
    topUpWater_Results: ''
  },
  {
    id: 5,
    hangmuc: 'Kiểm tra mức nước của bầu hóa h i và bổ sung kịp thời. (Check water level)',
    chkWaterLev_BeforeMaintenance: '',
    chkWaterLev_AfterMaintenance: '',
    chkWaterLev_Results: ''
  },
  {
    id: 6,
    hangmuc: 'Kiểm tra rò rỉ tại các khớp nối. (Leak test all joints)',
    leakTest_BeforeMaintenance: '',
    leakTest_AfterMaintenance: '',
    leakTest_Results: ''
  },
  {
    id: 7,
    hangmuc: 'Kiểm tra nguồn điện. (Check its power source)',
    chkPower_BeforeMaintenance: '',
    chkPower_AfterMaintenance: '',
    chkPower_Results: ''
  },
  {
    id: 8,
    hangmuc: 'Kiểm tra các thiết bị của bộ hóa h i. (General check the vaporizers componets)',
    chkVapoComp_BeforeMaintenance: '',
    chkVapoComp_AfterMaintenance: '',
    chkVapoComp_Results: ''
  }
];
const dataSource4 = [
  {
    id: 1,
    hangmuc: 'Kiểm tra điện trở đất. (Earth resistance test)',
    earthResisTest_BeforeMaintenance: '',
    earthResisTest_AfterMaintenance: '',
    earthResisTest_Results: ''
  },
  {
    id: 2,
    hangmuc: 'Kiểm tra các điểm nối tiếp đất của điện trở đất. (Check for connection of earth points to LPG tanks)',
    chkConnEarthPoint_BeforeMaintenance: '',
    chkConnEarthPoint_AfterMaintenance: '',
    chkConnEarthPoint_Results: ''
  }
];
const dataSource5 = [
  {
    id: 1,
    hangmuc: 'Kiểm tra hoạt động của hệ thống làm mát tại khu vực bồn. (Test the operation of cooling system at LPG tanks)',
    testCoolingSys_BeforeMaintenance: '',
    testCoolingSys_AfterMaintenance: '',
    testCoolingSys_Results: ''
  },
  {
    id: 2,
    hangmuc: 'Kiểm tra nguồn nước cứu hỏa. (Checking water supply)',
    chkWaterSupl_BeforeMaintenance: '',
    chkWaterSupl_AfterMaintenance: '',
    chkWaterSupl_Results: ''
  },
  {
    id: 3,
    hangmuc: 'Kiểm tra thiết bị cứu hỏa xách tay. Số lượng - Chất lượng. (Checking for portable equipments. Quality-Qantity)',
    chkPortableEqm_BeforeMaintenance: '',
    chkPortableEqm_AfterMaintenance: '',
    chkPortableEqm_Results: ''
  }
];
class checkGasTank extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      
    }
  }
  async componentDidMount() {
   
  }
  async componentWillReceiveProps(nextProps) {
    console.log("nextPropsnextProps", nextProps)
    this.setState({
      visible: nextProps.visible,
      
    })
  }

  handleCancel = async () => {
   await this.props.onClickGasTankCallBack(false);
  }
  render() {
    console.log("this.props.inspectorList", this.props.inspectorList)
    // let {tankCheckingRecord} = this.props.inspectorList.tankCheckingRecord
    // let {valveFlangeRecord} = this.props.inspectorList.valveFlangeRecord
    // let {vaporizerCheckingRecord} = this.props.inspectorList.vaporizerCheckingRecord
    // let {earthSysRecord} = this.props.inspectorList.earthSysRecord
    // let {fireFightingRecord} = this.props.inspectorList.fireFightingRecord
    if (this.props.inspectorList.length != 0) {
      //KIỂM TRA BỒN CHỨA LPG
      let tankCheckingRecord = this.props.inspectorList.tankCheckingRecord;
      tankCheckingRecord.map((v) => {
        console.log("vvvvv", v)
        for (let i = 0; i < dataSource1.length; i++) {
          {
            dataSource1[i].visualChecking_BeforeMaintenance = v.visualChecking_BeforeMaintenance;
            dataSource1[i].visualChecking_AfterMaintenance = v.visualChecking_AfterMaintenance;
            dataSource1[i].visualChecking_Results = v.visualChecking_Results;
          }
      
          {
            dataSource1[i].corrosionTank_BeforeMaintenance = v.corrosionTank_BeforeMaintenance;
            dataSource1[i].corrosionTank_AfterMaintenance = v.corrosionTank_AfterMaintenance;
            dataSource1[i].corrosionTank_Results = v.corrosionTank_Results;
          }
         
          {
            dataSource1[i].combustiveMaterials_BeforeMaintenance = v.combustiveMaterials_BeforeMaintenance;
            dataSource1[i].combustiveMaterials_AfterMaintenance = v.combustiveMaterials_AfterMaintenance;
            dataSource1[i].combustiveMaterials_Results = v.combustiveMaterials_Results;
          }
         
          {
            dataSource1[i].warningSigns_BeforeMaintenance = v.warningSigns_BeforeMaintenance;
            dataSource1[i].warningSigns_AfterMaintenance = v.warningSigns_AfterMaintenance;
            dataSource1[i].warningSigns_Results = v.warningSigns_Results;
          }
      
          {
            dataSource1[i].leakingTest_BeforeMaintenance = v.leakingTest_BeforeMaintenance;
            dataSource1[i].leakingTest_AfterMaintenance = v.leakingTest_AfterMaintenance;
            dataSource1[i].leakingTest_Results = v.leakingTest_Results;
          }
        }
      })
      //KIỂM TRA VAN, ĐƯỜNG ỐNG VÀ CÁC THIẾT BỊ TRÊN ĐƯỜNG ỐNG
      let valveFlangeRecord = this.props.inspectorList.valveFlangeRecord;
      valveFlangeRecord.map((v) => {
        console.log("vvvvv1", v)
        for (let i = 0; i < dataSource2.length; i++) {
        
          {
            dataSource2[i].emergencyShutValve_BeforeMaintenance = v.emergencyShutValve_BeforeMaintenance;
            dataSource2[i].emergencyShutValve_AfterMaintenance = v.emergencyShutValve_AfterMaintenance;
            dataSource2[i].emergencyShutValve_Results = v.emergencyShutValve_Results;
          }
        
          {
            dataSource2[i].globeValve_BeforeMaintenance = v.globeValve_BeforeMaintenance;
            dataSource2[i].globeValve_AfterMaintenance = v.globeValve_AfterMaintenance;
            dataSource2[i].globeValve_Results = v.globeValve_Results;
          }
         
          {
            dataSource2[i].ballValve_BeforeMaintenance = v.ballValve_BeforeMaintenance;
            dataSource2[i].ballValve_AfterMaintenance = v.ballValve_AfterMaintenance;
            dataSource2[i].ballValve_Results = v.ballValve_Results;
          }
          
          {
            dataSource2[i].drainValve_BeforeMaintenance = v.drainValve_BeforeMaintenance;
            dataSource2[i].drainValve_AfterMaintenance = v.drainValve_AfterMaintenance;
            dataSource2[i].drainValve_Results = v.drainValve_Results;
          }
          
          {
            dataSource2[i].electricalValve_BeforeMaintenance = v.electricalValve_BeforeMaintenance;
            dataSource2[i].electricalValve_AfterMaintenance = v.electricalValve_AfterMaintenance;
            dataSource2[i].electricalValve_Results = v.electricalValve_Results;
          }
          
          {
            dataSource2[i].stStageRegulator_BeforeMaintenance = v.stStageRegulator_BeforeMaintenance;
            dataSource2[i].stStageRegulator_AfterMaintenance = v.stStageRegulator_AfterMaintenance;
            dataSource2[i].stStageRegulator_Results = v.stStageRegulator_Results;
          }
          
          {
            dataSource2[i].pipeCorrosion_BeforeMaintenance = v.pipeCorrosion_BeforeMaintenance;
            dataSource2[i].pipeCorrosion_AfterMaintenance = v.pipeCorrosion_AfterMaintenance;
            dataSource2[i].pipeCorrosion_Results = v.pipeCorrosion_Results;
          }
          
          {
            dataSource2[i].drainInsidePipeline_BeforeMaintenance = v.drainInsidePipeline_BeforeMaintenance;
            dataSource2[i].drainInsidePipeline_AfterMaintenance = v.drainInsidePipeline_AfterMaintenance;
            dataSource2[i].drainInsidePipeline_Results = v.drainInsidePipeline_Results;
          }
         
          {
            dataSource2[i].checkGasLeakage_BeforeMaintenance = v.checkGasLeakage_BeforeMaintenance;
            dataSource2[i].checkGasLeakage_AfterMaintenance = v.checkGasLeakage_AfterMaintenance;
            dataSource2[i].checkGasLeakage_Results = v.checkGasLeakage_Results;
          }
        }
      })
      //KIỂM TRA NỒI HÓA H I
      let vaporizerCheckingRecord = this.props.inspectorList.vaporizerCheckingRecord;
      vaporizerCheckingRecord.map((v) => {
        console.log("vvvvv2", v)
        for (let i = 0; i < dataSource3.length; i++) {
          
          {
            dataSource3[i].chkCtrlSystem_BeforeMaintenance = v.chkCtrlSystem_BeforeMaintenance;
            dataSource3[i].chkCtrlSystem_AfterMaintenance = v.chkCtrlSystem_AfterMaintenance;
            dataSource3[i].chkCtrlSystem_Results = v.chkCtrlSystem_Results;
          }
          
          {
            dataSource3[i].chkVapoArea_BeforeMaintenance = v.chkVapoArea_BeforeMaintenance;
            dataSource3[i].chkVapoArea_AfterMaintenance = v.chkVapoArea_AfterMaintenance;
            dataSource3[i].chkVapoArea_Results = v.chkVapoArea_Results;
          }
           
          {
            dataSource3[i].drainVapo_BeforeMaintenance = v.drainVapo_BeforeMaintenance;
            dataSource3[i].drainVapo_AfterMaintenance = v.drainVapo_AfterMaintenance;
            dataSource3[i].drainVapo_Results = v.drainVapo_Results;
          }
           
          {
            dataSource3[i].topUpWater_BeforeMaintenance = v.topUpWater_BeforeMaintenance;
            dataSource3[i].topUpWater_AfterMaintenance = v.topUpWater_AfterMaintenance;
            dataSource3[i].topUpWater_Results = v.topUpWater_Results;
          }
           
          {
            dataSource3[i].chkWaterLev_BeforeMaintenance = v.chkWaterLev_BeforeMaintenance;
            dataSource3[i].chkWaterLev_AfterMaintenance = v.chkWaterLev_AfterMaintenance;
            dataSource3[i].chkWaterLev_Results = v.chkWaterLev_Results;
          }
           
          {
            dataSource3[i].leakTest_BeforeMaintenance = v.leakTest_BeforeMaintenance;
            dataSource3[i].leakTest_AfterMaintenance = v.leakTest_AfterMaintenance;
            dataSource3[i].leakTest_Results = v.leakTest_Results;
          }
           
          {
            dataSource3[i].chkPower_BeforeMaintenance = v.chkPower_BeforeMaintenance;
            dataSource3[i].chkPower_AfterMaintenance = v.chkPower_AfterMaintenance;
            dataSource3[i].chkPower_Results = v.chkPower_Results;
          }
           
          {
            dataSource3[i].chkVapoComp_BeforeMaintenance = v.chkVapoComp_BeforeMaintenance;
            dataSource3[i].chkVapoComp_AfterMaintenance = v.chkVapoComp_AfterMaintenance;
            dataSource3[i].chkVapoComp_Results = v.chkVapoComp_Results;
          }
        }
      })
      //KIỂM TRA HỆ THỐNG ĐẤT
      let earthSysRecord = this.props.inspectorList.earthSysRecord;
      earthSysRecord.map((v) => {
        console.log("vvvvv3", v)
        for (let i = 0; i < dataSource4.length; i++) {
           
          {
            dataSource4[i].earthResisTest_BeforeMaintenance = v.earthResisTest_BeforeMaintenance;
            dataSource4[i].earthResisTest_AfterMaintenance = v.earthResisTest_AfterMaintenance;
            dataSource4[i].earthResisTest_Results = v.earthResisTest_Results;
          }
           
          {
            dataSource4[i].chkConnEarthPoint_BeforeMaintenance = v.chkConnEarthPoint_BeforeMaintenance;
            dataSource4[i].chkConnEarthPoint_AfterMaintenance = v.chkConnEarthPoint_AfterMaintenance;
            dataSource4[i].chkConnEarthPoint_Results = v.chkConnEarthPoint_Results;
          }

        }
      })
      //KIỂM TRA HỆ THỐNG PCCC
      let fireFightingRecord = this.props.inspectorList.fireFightingRecord;
      fireFightingRecord.map((v) => {
        console.log("vvvvv4", v)
        for (let i = 0; i < dataSource5.length; i++) {
           
          {
            dataSource5[i].testCoolingSys_BeforeMaintenance = v.testCoolingSys_BeforeMaintenance;
            dataSource5[i].testCoolingSys_AfterMaintenance = v.testCoolingSys_AfterMaintenance;
            dataSource5[i].testCoolingSys_Results = v.testCoolingSys_Results;
          }
           
          {
            dataSource5[i].chkWaterSupl_BeforeMaintenance = v.chkWaterSupl_BeforeMaintenance;
            dataSource5[i].chkWaterSupl_AfterMaintenance = v.chkWaterSupl_AfterMaintenance;
            dataSource5[i].chkWaterSupl_Results = v.chkWaterSupl_Results;
          }
           
          {
            dataSource5[i].chkPortableEqm_BeforeMaintenance = v.chkPortableEqm_BeforeMaintenance;
            dataSource5[i].chkPortableEqm_AfterMaintenance = v.chkPortableEqm_AfterMaintenance;
            dataSource5[i].chkPortableEqm_Results = v.chkPortableEqm_Results;
          }
        }
      })
    }
    return (
      <Modal
        style={{ top: 0 }}
        title={this.props.t("MONTHLY_CHECKLIST")}
        onCancel={(e) => this.handleCancel(e)}
        okText={isUndefined}
        cancelText={this.props.t("CLOSE")}
        visible={this.state.visible}
        width={1300}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab={this.props.t("TANK_CHECKING_RECORD")} key="1">
            <table class="table table-bordered seednet-table-keep-column-width">
              <thead className="table__head">
                <tr>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("STT")}</p></th>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("ITEM")}</p></th>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("STATUS_BEFORE_MAITENANCE")}</p></th>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("WORKS_BEING_CARIED_BY_MAINTENANCE")}</p></th>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("RESULTS_&_RECOMMENDATION")}</p></th>
                </tr>
              </thead>
              <tbody>
                {dataSource1.map((data, index) => {
                  console.log("dataSource1", dataSource1)
                  console.log("index1", index)
                  return <tr className="table-light">
                    <td style={{ textAlign: 'center', alignItems: 'center' }}>{data.id}</td>
                    <td style={{ textAlign: 'center', alignItems: 'center' }}><p>{data.hangmuc}</p></td>
                    <td style={{ textAlign: 'center', alignItems: 'center' }}>
                      {index === 0 ? data.visualChecking_BeforeMaintenance :
                        (index === 1 ? data.corrosionTank_BeforeMaintenance :
                          (index === 2 ? data.combustiveMaterials_BeforeMaintenance :
                            (index === 3 ? data.warningSigns_BeforeMaintenance :
                              (index === 4 ? data.leakingTest_BeforeMaintenance : ""))))}
                    </td>
                    <td style={{ textAlign: 'center', alignItems: 'center' }}>
                      {index === 0 ? data.visualChecking_AfterMaintenance :
                        (index === 1 ? data.corrosionTank_AfterMaintenance :
                          (index === 2 ? data.combustiveMaterials_AfterMaintenance :
                            (index === 3 ? data.warningSigns_AfterMaintenance :
                              (index === 4 ? data.leakingTest_AfterMaintenance : ""))))}
                    </td>
                    <td style={{ textAlign: 'center', alignItems: 'center' }}>
                      {index === 0 ? data.visualChecking_Results :
                        (index === 1 ? data.corrosionTank_Results :
                          (index === 2 ? data.combustiveMaterials_Results :
                            (index === 3 ? data.warningSigns_Results :
                              (index == 4 ? data.leakingTest_Results : ''))))}
                    </td>
                  </tr>
                })}

              </tbody>
            </table>
          </TabPane>
          <TabPane tab={this.props.t("VALVE_FLANGE_AND_COMPONENTS_ON_PIPELINE_RECORD")} key="2">
            <table class="table table-bordered seednet-table-keep-column-width">
              <thead className="table__head">
                <tr>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("STT")}</p></th>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("ITEM")}</p></th>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("STATUS_BEFORE_MAITENANCE")}</p></th>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("WORKS_BEING_CARIED_BY_MAINTENANCE")}</p></th>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("RESULTS_&_RECOMMENDATION")}</p></th>
                </tr>
              </thead>
              <tbody>
                {dataSource2.map((data, index) => {
                  console.log("dataSource2", dataSource2)
                  return <tr className="table-light">
                    <td style={{ textAlign: 'center', alignItems: 'center' }}>{data.id}</td>
                    <td style={{ textAlign: 'center', alignItems: 'center' }}><p>{data.hangmuc}</p></td>
                    <td style={{ textAlign: 'center', alignItems: 'center' }}>
                      {index === 0 ? data.emergencyShutValve_BeforeMaintenance :
                        (index === 1 ? data.globeValve_BeforeMaintenance :
                          (index === 2 ? data.ballValve_BeforeMaintenance :
                            (index === 3 ? data.drainValve_BeforeMaintenance :
                              (index === 4 ? data.electricalValve_BeforeMaintenance :
                                (index === 5 ? data.stStageRegulator_BeforeMaintenance :
                                  (index === 6 ? data.pipeCorrosion_BeforeMaintenance :
                                    (index === 7 ? data.drainInsidePipeline_BeforeMaintenance :
                                      (index === 8 ? data.checkGasLeakage_BeforeMaintenance : ""))))))))}
                    </td>
                    <td style={{ textAlign: 'center', alignItems: 'center' }}>
                      {index === 0 ? data.emergencyShutValve_AfterMaintenance :
                        (index === 1 ? data.globeValve_AfterMaintenance :
                          (index === 2 ? data.ballValve_AfterMaintenance :
                            (index === 3 ? data.drainValve_AfterMaintenance :
                              (index === 4 ? data.electricalValve_AfterMaintenance :
                                (index === 5 ? data.stStageRegulator_AfterMaintenance :
                                  (index === 6 ? data.pipeCorrosion_AfterMaintenance :
                                    (index === 7 ? data.drainInsidePipeline_AfterMaintenance :
                                      (index === 8 ? data.checkGasLeakage_AfterMaintenance : ""))))))))}
                    </td>
                    <td style={{ textAlign: 'center', alignItems: 'center' }}>
                      {index === 0 ? data.emergencyShutValve_Results :
                        (index === 1 ? data.globeValve_Results :
                          (index === 2 ? data.ballValve_Results :
                            (index === 3 ? data.drainValve_Results :
                              (index === 4 ? data.electricalValve_Results :
                                (index === 5 ? data.stStageRegulator_Results :
                                  (index === 6 ? data.pipeCorrosion_Results :
                                    (index === 7 ? data.drainInsidePipeline_Results :
                                      (index === 8 ? data.checkGasLeakage_Results : ""))))))))}
                    </td>
                  </tr>
                })}

              </tbody>
            </table>
          </TabPane>
          <TabPane tab={this.props.t("VAPORIZER_CHECKING_RECORD")} key="3">
            <table class="table table-bordered seednet-table-keep-column-width">
              <thead className="table__head">
                <tr>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("STT")}</p></th>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("ITEM")}</p></th>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("STATUS_BEFORE_MAITENANCE")}</p></th>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("WORKS_BEING_CARIED_BY_MAINTENANCE")}</p></th>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("RESULTS_&_RECOMMENDATION")}</p></th>
                </tr>
              </thead>
              <tbody>
                {dataSource3.map((data, index) => {
                  console.log("dataSource3", data)
                  return <tr className="table-light">
                    <td style={{ textAlign: 'center', alignItems: 'center' }}>{data.id}</td>
                    <td style={{ textAlign: 'center', alignItems: 'center' }}><p>{data.hangmuc}</p></td>
                    <td style={{ textAlign: 'center', alignItems: 'center' }}>
                      {index === 0 ? data.chkCtrlSystem_BeforeMaintenance :
                        (index === 1 ? data.chkVapoArea_BeforeMaintenance :
                          (index === 2 ? data.drainVapo_BeforeMaintenance :
                            (index === 3 ? data.topUpWater_BeforeMaintenance :
                              (index === 4 ? data.chkWaterLev_BeforeMaintenance :
                                (index === 5 ? data.leakTest_BeforeMaintenance :
                                  (index === 6 ? data.chkPower_BeforeMaintenance :
                                    (index === 7 ? data.chkVapoComp_BeforeMaintenance : '')))))))}
                    </td>
                    <td style={{ textAlign: 'center', alignItems: 'center' }}>
                      {index === 0 ? data.chkCtrlSystem_AfterMaintenance :
                        (index === 1 ? data.chkVapoArea_AfterMaintenance :
                          (index === 2 ? data.drainVapo_AfterMaintenance :
                            (index === 3 ? data.topUpWater_AfterMaintenance :
                              (index === 4 ? data.chkWaterLev_AfterMaintenance :
                                (index === 5 ? data.leakTest_AfterMaintenance :
                                  (index === 6 ? data.chkPower_AfterMaintenance :
                                    (index === 7 ? data.chkVapoComp_AfterMaintenance : '')))))))}
                    </td>
                    <td style={{ textAlign: 'center', alignItems: 'center' }}>
                      {index === 0 ? data.chkCtrlSystem_Results :
                        (index === 1 ? data.chkVapoArea_Results :
                          (index === 2 ? data.drainVapo_Results :
                            (index === 3 ? data.topUpWater_Results :
                              (index === 4 ? data.chkWaterLev_Results :
                                (index === 5 ? data.leakTest_Results :
                                  (index === 6 ? data.chkPower_Results :
                                    (index === 7 ? data.chkVapoComp_Results : '')))))))}
                    </td>
                  </tr>
                })}

              </tbody>
            </table>
          </TabPane>
          <TabPane tab={this.props.t("EARTHING_SYSTEM_CHECKING_RECORD")} key="4">
            <table class="table table-bordered seednet-table-keep-column-width">
              <thead className="table__head">
                <tr>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("STT")}</p></th>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("ITEM")}</p></th>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("STATUS_BEFORE_MAITENANCE")}</p></th>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("WORKS_BEING_CARIED_BY_MAINTENANCE")}</p></th>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("RESULTS_&_RECOMMENDATION")}</p></th>
                </tr>
              </thead>
              <tbody>
                {dataSource4.map((data, index) => {
                  return <tr className="table-light">
                    <td style={{ textAlign: 'center', alignItems: 'center' }}>{data.id}</td>
                    <td style={{ textAlign: 'center', alignItems: 'center' }}><p>{data.hangmuc}</p></td>
                    <td style={{ textAlign: 'center', alignItems: 'center' }}>
                      {index === 0 ? data.earthResisTest_BeforeMaintenance :
                        (index === 1 ? data.chkConnEarthPoint_BeforeMaintenance : '')}
                    </td>
                    <td style={{ textAlign: 'center', alignItems: 'center' }}>
                      {index === 0 ? data.earthResisTest_AfterMaintenance :
                        (index === 1 ? data.chkConnEarthPoint_AfterMaintenance : '')}
                    </td>
                    <td style={{ textAlign: 'center', alignItems: 'center' }}>
                      {index === 0 ? data.earthResisTest_Results :
                        (index === 1 ? data.chkConnEarthPoint_Results : '')}
                    </td>
                  </tr>
                })}

              </tbody>
            </table>
          </TabPane>
          <TabPane tab={this.props.t("FIRE_FIGHTING_CHECKING_RECORD")} key="5">
            <table class="table table-bordered seednet-table-keep-column-width">
              <thead className="table__head">
                <tr>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("STT")}</p></th>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("ITEM")}</p></th>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("STATUS_BEFORE_MAITENANCE")}</p></th>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("WORKS_BEING_CARIED_BY_MAINTENANCE")}</p></th>
                  <th style={{ textAlign: 'center', alignItems: 'center' }}><p>{this.props.t("RESULTS_&_RECOMMENDATION")}</p></th>
                </tr>
              </thead>
              <tbody>
                {dataSource5.map((data, index) => {
                  return <tr className="table-light">
                    <td style={{ textAlign: 'center', alignItems: 'center' }}>{data.id}</td>
                    <td style={{ textAlign: 'center', alignItems: 'center' }}><p>{data.hangmuc}</p></td>
                    <td style={{ textAlign: 'center', alignItems: 'center' }}>
                      {index === 0 ? data.testCoolingSys_BeforeMaintenance :
                        (index === 1 ? data.chkWaterSupl_BeforeMaintenance :
                          (index === 2 ? data.chkPortableEqm_BeforeMaintenance : ''))}
                    </td>
                    <td style={{ textAlign: 'center', alignItems: 'center' }}>
                      {index === 0 ? data.testCoolingSys_AfterMaintenance :
                        (index === 1 ? data.chkWaterSupl_AfterMaintenance :
                          (index === 2 ? data.chkPortableEqm_AfterMaintenance : ''))}
                    </td>
                    <td style={{ textAlign: 'center', alignItems: 'center' }}>
                      {index === 0 ? data.testCoolingSys_Results :
                        (index === 1 ? data.chkWaterSupl_Results :
                          (index === 2 ? data.chkPortableEqm_Results : ''))}
                    </td>
                  </tr>
                })}

              </tbody>
            </table>

          </TabPane>

        </Tabs>
        <div className="row">
          <h3>{this.props.t("NOTES")}</h3>
          <TextArea rows={4} value={this.props.inspectorList.note} />
        </div>
        <div className="row">
          <div className="col-6">
            <div className="row justify-content-center"><h5>Người kiểm tra</h5></div>
            <div className="row justify-content-center">
              <img style={{ width: 200, height: 150 }} src={'data:image/png;base64,' + this.props.inspectorList.signature_CheckedBy + ''} />
            </div>
          </div>
          <div className="col-6">
            <div className="row justify-content-center"><h5>Xác nhận của đại diện công ty</h5></div>
            <div className="row justify-content-center">
              <img style={{ width: 200, height: 150 }} src={'data:image/png;base64,' + this.props.inspectorList.signature_VerifiedBy + ''} />
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
export default withNamespaces()(checkGasTank);        