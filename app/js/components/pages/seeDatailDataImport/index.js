import React, { Component } from "react";
import getHistoryImportAPI from "./../../../../api/getHistoryImportAPI";
import getCylinderByHistoryId from "getCylinderByHistoryId";
import historyGetHistoriesByType from "../../../../api/historyGetHistoriesByType";
import{Pagination,Divider } from "antd";
import getUserCookies from "getUserCookies";
import './index.scss';
import {Icon} from 'antd';
import moment from "moment";
export default class DatailHistoryDataImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyImport: [],
      searchKeyValue: "",
      keyword:'',
      itemsPerPages:10,
      numberPages:1,
      user:{},
    };
  }
  async getImportHistory() {
    var user_cookies = await getUserCookies();
    this.setState(
      {
        user:user_cookies.user
      }
    )
    let historyImport = await historyGetHistoriesByType("to",this.state.user.id,"",'IMPORT,TURN_BACK',1,10);
    let historyImportLeght = historyImport.data.count;
     console.log("lich su import1", historyImport)
    let sortHistoryImportDecs = [];
    // console.log(historyImport);
    let n = 0;
    for (let m = historyImport.data.data.length - 1; m >= 0; m--) {
      sortHistoryImportDecs[n] = historyImport.data.data[m];
      n++;
    }

    this.setState({
      historyImport: historyImport.data.data,
      numberPages:  Math.ceil(
        historyImportLeght/ this.state.itemsPerPages) 
    });
  }
  onChangeKeyValue = (e) => {
    this.setState({
      searchKeyValue: e.target.value,
    });
  };
  onGiveKeyValue = () => {
     let {searchKeyValue}=this.state;
    this.setState({
      keyword:searchKeyValue
    })
  };
  componentDidMount() {
    this.getImportHistory();
    window.scrollTo(0, 0);
  }
  async handleChangePage(event){
    console.log("evnt1",event);
    
    let historyImport = await historyGetHistoriesByType("to",this.state.user.id,"",'IMPORT,TURN_BACK',event,10);
    this.setState({
      historyImport: historyImport.data.data,
    });
  }
  render() {
    let { historyImport,keyword } = this.state;
    if (keyword) {
      historyImport = historyImport.filter((data) => {
        return (
          moment(data.createdAt)
            .format("DD/MM/YYYY HH:mm")
            .toLowerCase()
            .indexOf(keyword) !== -1
        );
      });
    }
    return (
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">
            <strong>Lịch Sử</strong> Nhập Hàng
          </h5>
          <div class="input-group md-form form-sm form-2 pl-0">
            <input
              class="form-control my-0 py-1 amber-border"
              type="text"
              placeholder="Search"
              aria-label="Search"
              name="searchKeyValue"
              onChange={this.onChangeKeyValue}
            />
            <div class="input-group-append">
              <span
                class="input-group-text amber lighten-3"
                id="basic-text1"
                onClick={this.onGiveKeyValue}
              >
                <Icon type="search" />
              </span>
            </div>
          </div>
        </div>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th className="">Nhập Từ</th>
              <th className="">Ngày Giờ</th>
              <th className="">Loại</th>
              <th className="">Số Lượng Bình</th>
              <th className="">Xuất Excel</th>
            </tr>
          </thead>
          <tbody>
            {historyImport.map((item) => {
              if(typeof item.from !== "undefined" && item.from !== null){
              console.log("Aaaaaaaaaaaaaa",item)
            }
              return (
                <tr>
                  <td className="text-muted">
                    {(typeof item.from !== "undefined" && item.from !== null) && item.from.userType==="Agency"? item.from.name+"_"+item.from.isChildOf.name
                      :
                      ((typeof item.from !== "undefined" && item.from !== null && item.from.userType==="General") ||(typeof item.from !== "undefined" && item.from !== null && item.from.userType==="Factory" && item.from.userRole==="Owner") ||(typeof item.from !== "undefined" && item.from !== null && item.from.userType==="Fixer" && item.from.userRole==="SuperAdmin"))? item.from.name:"Người Dân"}
                  </td>
                  <td className="text-muted">
                    {moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
                  </td>
                  <td className="text-muted">
                    {item.type === "IMPORT"
                      ? "Nhập Hàng"
                      : item.type === "TURN_BACK"
                      ? "Nhập Hồi Lưu"
                      : ""}
                  </td>
                  <td className="text-success">{item.numberOfCylinder} bình</td>
                  <td className="text-muted">
                    <a
                      className="btn btn-primary"
                      style={{ color: "white" }}
                      download
                      onClick={async () => {
                        await getCylinderByHistoryId(
                          item.id,
                          "Nhap_Hang_" + item.id
                        );
                      }}
                      type="submit"
                    >
                      Tải
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="card">
        <Divider orientation="center">
          <Pagination
            defaultCurrent={1}
            defaultPageSize={this.state.itemsPerPages}
            total={this.state.numberPages * this.state.itemsPerPages}
            onChange={(onPage) => this.handleChangePage(onPage)}
          // this.setState({ currentPage: onPage})
          />
        </Divider>
        </div>
      </div>
    );
  }
}
