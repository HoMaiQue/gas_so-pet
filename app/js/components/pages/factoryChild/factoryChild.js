import React from "react";
import PropType from "prop-types";
import Constants from "Constants";
import showToast from "showToast";
import deleteUserAPI from "deleteUserAPI";
import getAllFactoryAPI from "getAllFactoryAPI";
import getAllPartnerAPI from "getPartnerAPI";
import createPartnerAPI from "createPartnerAPI";
import getDestinationUserAPI from "getDestinationUserAPI";
import AddUserPopupContainer from "../user/AddUserPopupContainer";
import getUserCookies from "getUserCookies";
import getListWarehouseExcelAPI from './../../../../api/getListWarehouseExcelAPI';
import {withNamespaces} from 'react-i18next';
import { Tooltip } from "antd";

class Staff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listUsers: [],
      selectedAll: false,
      selected: false,
      listUsersRelation: [],
      listUserFinal: [],
      listIDChecked: [],
      listUserFixer: [],
      user_type: "",
      userEdit: {},
      isCreateMode: true,
    };
  }

  async componentDidMount() {
    this.getListFixer();
    let user_cookies = await getUserCookies();
    this.setState({ user_type: user_cookies.user.userType });
  }

  refresh() {
    this.forceUpdate(() => {
      this.getListFixer();
      //this.setState({userEdit:{}});
    });
  }

  async editUser(userEdit) {
    await this.setState({ userEdit });
    await this.setState({
      isCreateMode: false,
    });
  }

  newForm = async () => {
    await this.setState({
      userEdit: null,
    });
    await this.setState({
      isCreateMode: true,
    });
  };
  async deleteUser(id) {
    const user = await deleteUserAPI(id);

    //console.log('register',user);
    if (user) {
      if (
        user.status === Constants.HTTP_SUCCESS_BODY &&
        !user.data.hasOwnProperty("err_msg")
      ) {
        showToast("Xóa Thành Công!", 3000);
        this.refresh();
        return true;
      } else {
        showToast(
          user.data.message ? user.data.message : user.data.err_msg,
          2000
        );
        return false;
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình xóa người dùng ");
      return false;
    }
  }

  async getListFixer() {
    const dataUsers = await getDestinationUserAPI(
      Constants.FACTORY,
      "",
      Constants.OWNER
    );
    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        // console.log(dataUsers);
        let listFactoryBacks = [];
        for (let i = 0; i < dataUsers.data.length; i++) {
          listFactoryBacks.push({
            value: dataUsers.data[i].id,
            label: dataUsers.data[i].name,
            ...dataUsers.data[i],
          });
        }

        this.setState({ listUserFixer: listFactoryBacks });
      } else {
        showToast(
          dataUsers.data.message
            ? dataUsers.data.message
            : dataUsers.data.err_msg,
          2000
        );
      }

      //this.setState({image_link: profile.data.company_logo});
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  }

  // change all select

  handleButtonListExcel = async () => {
    let user_cookies = await getUserCookies();
    let id = user_cookies.user.id;
    
    await getListWarehouseExcelAPI(id);
  }

  render() {
    //console.log(this.state.listIDChecked);
    return (
      <div className="main-content">
        <div className="card">
          <div className="card-title">
            <div className="flexbox">
              <h4> {this.state.user_type === "General"?this.props.t('GENERAL_CHILD'):this.props.t('FACTORY_CHILD')} </h4>
              <div className="row">
                <button
                  // onClick={()=>this.setState({userEdit:{},isCreateMode:true})}
                  //onClick={}
                  style={{ marginLeft: "20px" }}
                  className="btn btn-sm btn-success"
                  // data-toggle="modal"
                  // data-target=""
                  onClick={this.handleButtonListExcel}
                >
                  {this.props.t('EXPORT_EXCEL')}
                </button>
                <button
                  // onClick={()=>this.setState({userEdit:{},isCreateMode:true})}
                  onClick={this.newForm}
                  style={{ marginLeft: "20px" }}
                  className="btn btn-sm btn-create"
                  data-toggle="modal"
                  data-target="#create-user"
                >
                  {this.state.user_type === "General"?this.props.t('CREATE_EXPORT_GOV'):this.props.t('CREATE_EXPORT_SOPET')}
                </button>
                {/*   <button style={{marginLeft:'20px'}} className="btn btn-sm btn-primary" data-toggle="modal"
                                        data-target="#create-location-store">Tạo mới
                                </button>*/}
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive-xl">
              <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                <div className="row">
                  <div className="col-sm-12">
                    <table
                      className="table table-striped table-bordered seednet-table-keep-column-width"
                      cellSpacing="0"
                    >
                      <thead className="table__head">
                        <tr>
                          <th className="text-center w-50px align-middle"> {this.props.t('ID_NUMBER')} </th>
                          <th className="w-70px text-center align-middle"> {this.props.t('CODE_CHILD')} </th>
                          <th className="w-150px text-center align-middle"> {this.props.t('EMAIL')} </th>
                          <th className="w-150px text-center align-middle"> {this.props.t('NAME')} </th>
                          <th className="w-200px text-center align-middle"> {this.props.t('ADDRESS')} </th>
                          <th className="w-100px text-center align-middle"> {this.props.t('ACTION')} </th>
                          {/*<th className="w-120px text-center align-middle">Loại</th>*/}
                          {/*<th className="w-100px text-center align-middle">Thao tác</th>*/}
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.listUserFixer.map((store, index) => {
                          return (
                            <tr>
                              <td scope="row" className="text-center">
                                {index + 1}
                              </td>
                              <td scope="row" className="text-center">
                                {store.warehouseCode}
                              </td>
                              <td scope="row" className="text-center">
                                {store.email}
                              </td>
                              <td scope="row" className="text-center">
                                {store.name}
                              </td>
                              <td scope="row" className="text-center">
                                {store.address}
                              </td>
                              <td className="text-center table-actions">
                                {this.state.user_type === "SuperAdmin" && (
                                  <Tooltip title={this.props.t("DELETE")}>
                                  <a
                                    className="table-action hover-primary"
                                    data-toggle="modal"
                                    data-target="#view-report"
                                    onClick={() => {
                                      this.deleteUser(store.id);
                                    }}
                                  >
                                    <i className="ti-trash"></i>
                                  </a></Tooltip>
                                )}
                                
                                <Tooltip title={this.props.t("EDIT_INFO")}>
                                <a
                                  className="table-action hover-primary"
                                  data-toggle="modal"
                                  data-target="#create-user"
                                  onClick={() => {
                                    this.editUser(store);
                                  }}
                                >
                                  <i className="ti-pencil"></i>
                                  
                                </a>
                                </Tooltip>
                              </td>
                              {/*<td scope="row" className="text-center">{USERROLE_ENUM.find(o => o.key === store.userRole)!==undefined*/}
                              {/*    ? USERROLE_ENUM.find(o => o.key === store.userRole).value*/}
                              {/*    :""}</td>*/}

                              {/*<td>{this.props.itemStore.name}</td>
                                                        <td>{this.props.itemStore.address}</td>
                                                        <td>{this.props.itemStore.address}, {this.props.itemStore.ward_name}, {this.props.itemStore.district_name}, {this.props.city_name} </td>
                                                        <td>{this.props.itemStore.job_title_names.map((title) => {
                                                        return title + " ";
                                                        })}</td>*/}
                              {/*<td className="text-center table-actions">*/}

                              {/*    <a className="table-action hover-primary" data-toggle="modal" data-target="#view-report"*/}
                              {/*       onClick={()=>{this.deleteUser(store.id)}}>*/}
                              {/*        <i className="ti-trash"></i></a>*/}
                              {/*</td>*/}
                            </tr>
                          );
                        })}
                      </tbody>
                      <AddUserPopupContainer
                        isCreateMode={this.state.isCreateMode}
                        isEditForm={this.state.userEdit}
                        isFactoryChildPage={true}
                        isFactoryChildPageNew={true}
                        userType = {this.state.user_type}
                        refresh={this.refresh.bind(this)}
                      />
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(Staff);
