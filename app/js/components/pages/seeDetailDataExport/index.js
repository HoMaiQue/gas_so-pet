import React, { Component } from "react";
import getHistoryImportAPI from "./../../../../api/getHistoryImportAPI";
import getCylinderByHistoryId from "getCylinderByHistoryId";
import historyGetHistoriesByType from "../../../../api/historyGetHistoriesByType";
import getUserCookies from "getUserCookies";
import{Pagination,Divider } from "antd";
import "./index.scss";
import { Icon } from "antd";
import moment from "moment";
export default class DetailDataExport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyExport: [],
      searchKeyValue: "",
      keyword:'',
      nametext:false,
      user:"",
      numberPages:1,
      itemsPerPages:10,
      // historyExportLeght:0
    };
  }
  async getImportHistory() {
    var user_cookies = await getUserCookies();
    this.setState(
      {
        user:user_cookies.user
      }
    );
    // let historyExport = await getHistoryImportAPI("from", 0);
    // let historyExportBegin=[];
   if(this.props.params.id===":id=sale"){
    //  console.log("this.props.params.id",this.props.params.id);
     let historySale = await historyGetHistoriesByType("from",this.state.user.id,"",'SALE',1,10);
     console.log("historySale",historySale.data.data);
     let historyExportLeght = historySale.data.count;
    this.setState({
      historyExport: historySale.data.data,
      nametext:false,
      numberPages:Math.ceil(
      historyExportLeght/ this.state.itemsPerPages)
    });
    // }if(this.props.params.id===":id=export"){
    //   console.log("this.props.params.id",this.props.params.id);
    //  historyExport.data.map(item=>{
    //    if ("EXPORT" === item.type) {
    //      historyExportBegin.push(item);
    //    }
    //  });
    //  let sortHistoryExportDecs = [];
    //  let n = 0;
    //  for (let m = historyExportBegin.length - 1; m >= 0; m--) {
    //    sortHistoryExportDecs[n] = historyExportBegin[m];
    //    n++;
    //  }
    //  this.setState({
    //    historyExport: sortHistoryExportDecs,
    //  });
    //  }
  }else{
    if(this.props.params.id===":id=export"){
      // console.log("this.props.params.id",this.props.params.id);
      let historyExport = await historyGetHistoriesByType("from",this.state.user.id,"",'EXPORT',1,10);
      // console.log("historyImport",historyExport.data.data);
      let historyExportLeght = historyExport.data.count;
      // console.log("historyExportLeght",historyExportLeght);
     this.setState({
       historyExport: historyExport.data.data,
       nametext:true,
       numberPages:Math.ceil(
        historyExportLeght/ this.state.itemsPerPages)
     });
     }else{
      let historyExport = await historyGetHistoriesByType("from",this.state.user.id,"",'EXPORT',1,10);
      let historyExportLeght = historyExport.data.count;
      // console.log("historyExportLeght",historyExportLeght);
      this.setState({
        historyExport: historyExport.data.data,
        nametext:true,
        numberPages:Math.ceil(
          historyExportLeght.data.data.length/ this.state.itemsPerPages)
      });
      } 
     }
      
    // console.log("lich su export", historyExport);
  }
  componentDidMount() {
    this.getImportHistory();
    window.scrollTo(0, 0);
    // console.log("paramater",this.props.params);
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
  async handleChangePage(event){
    // console.log("evnt1",event);
    if(this.state.nametext===false){
      let historySale = await historyGetHistoriesByType("from",this.state.user.id,"",'SALE',event,10);
      this.setState({
        historyExport: historySale.data.data,
      });  
    }else{
    let historyImport = await historyGetHistoriesByType("from",this.state.user.id,"",'EXPORT',event,10);
    this.setState({
      historyExport: historyImport.data.data,
    });
    }
    
  }
  render() {
    let { historyExport, keyword } = this.state;
    console.log("historyExport",historyExport)
    if (keyword) {
      historyExport = historyExport.filter((data) => {
        return (
          moment(data.createdAt)
            .format("DD/MM/YYYY HH:mm")
            .toLowerCase()
            .indexOf(keyword) !== -1
        );
      });
    }
    return (
      <div className="col-lg-12 col-md-12">
        <div className="card">
          <div className="card-header">
            {this.state.nametext===true && (
              <h5 className="card-title">
              <strong>Lịch Sử</strong> Xuất Hàng
              </h5>
            )}
            {this.state.nametext===false && (
              <h5 className="card-title">
              <strong>Lịch Sử</strong> Bán Hàng
              </h5>
            )}
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
                <th className="">Ngày Giờ</th>
                <th className="">Loại</th>
                <th className="">Số Lượng Bình</th>
                <th className="">Xuất Excel</th>
              </tr>
            </thead>
            <tbody>
              {historyExport.map((item) => {
                let to_dest = "";
                if (typeof item.to !== "undefined" && item.to !== null) {
                  to_dest = item.to.name;
                } else {
                  if (
                    typeof item.toArray !== "undefined" &&
                    item.toArray !== null &&
                    item.toArray.length > 0
                  ) {
                    for (let i = 0; i < item.toArray.length; i++) {
                      to_dest +=
                        item.toArray[i].length > 0
                          ? item.toArray[i].name +
                            " " +
                            item.numberArray[i] +
                            " bình." +
                            `\n`
                          : "";
                      // console.log("hahahah", to_dest);
                    }
                  } else {
                    if (
                      typeof item.customer !== "undefined" &&
                      item.customer !== null
                    ) {
                      to_dest = "Người Dân : " + item.customer.name;
                    }
                  }
                }

                return (
                  <tr>
                    {/*<td className="text-muted">{to_dest}</td>*/}
                    <td className="text-muted">
                      {moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
                    </td>
                    <td className="text-muted">
                      {item.type === "EXPORT"&& item.typeForPartner===""
                        ? "Xuất Hàng"
                        :item.type === "EXPORT" && item.typeForPartner==="TO_FIX"?"Xuất vỏ"
												:item.type === "EXPORT" && item.typeForPartner==="RENT"?"Xuất vỏ"
                        : item.type === "SALE"
                        ? "Bán Hàng"

                        : ""}
                    </td>
                    <td className="text-success">
                      {item.numberOfCylinder} bình
                    </td>
                    <td className="text-muted">
                      <a
                        style={{ color: "white" }}
                        className="btn btn-create"
                        download
                        onClick={async () => {
                          await getCylinderByHistoryId(
                            item.id,
                            "Xuat_Hang_" + item.id
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
        
      </div>
    );
  }
}
