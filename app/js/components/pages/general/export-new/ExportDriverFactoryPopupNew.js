import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
//import Select from "react-select";
import SelectMulti from "react-select";
import Button from "react-validation/build/button";
import required from "required";
import Constants from "Constants";
import showToast from "showToast";
//import TagAutocomplete from "TagAutoComplete";
import getUserCookies from "../../../../helpers/getUserCookies";
import getAllUserApi from "getAllUserApi";
import { NAMEDRIVE } from "../../../../config/config";
import { GETTYPECUSTOMER } from "../../../../config/config";
import callApi from "../../../../util/apiCaller";
import createHistoryAPI from "createHistoryAPI";
import { Select } from "antd";
import getListBranchAPI from "../../../../../api/getListBranchAPI";
import { withNamespaces } from "react-i18next";
import ReactCustomLoading from "ReactCustomLoading";
import getListGeneralWarehouse from "../../../../../api/getListGeneralWarehouse";
const Option = Select.Option;

//var user_cookie = await getUserCookies();
//let token="Bearer " + user_cookie.token,
//"email": user_cookie.user.email,
class ExportDriverFactoryPopupNew extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      content: "",
      listProducts: [],
      isShowNumber: false,
      AgencyResults: [],
      GeneralResults: "",
      GeneralRessulsList: [],
      listExportPlaceData: "",
      listExportPlaceDataID: "",
      driverName: "",
      idDriver: "",
      listDriver: [],
      listDistributionAgency: [],
      listIndustry: [],
      listRestaurant: [],
      typeCustomer: "",
      listCustomer: [],
      CustomerResults: [],
      listBranch: [],
      BranchResults: [],
      loading: false,
    };
  }

  handleChangeGeneral = async (e) => {
    await this.setState({
      GeneralResults: e.target.value,
    });
    console.log("Generalresult", this.state.GeneralResultsList);
    // console.log("id general", this.state.GeneralResults);
    await this.getListGeneralWH(this.state.GeneralResults);
  };

  handleChangeBranch = (langValue) => {
    // console.log("!!!!", langValue);
    this.setState({ BranchResults: langValue });
    console.log("BranchResult", this.state.BranchResults);
  };

  handleChangeCustomer = (langValue) => {
      console.log('Chon KH: ', langValue)
    this.setState({ CustomerResults: langValue });
  };

  handleChangeAgency = (langValue) => {
    this.setState({ AgencyResults: langValue });
    // console.log("id agency", this.state.AgencyResults);
  };

  handleChangeDriver = (value) => {
    this.setState({
      idDriver: value,
    });
  };

  handleChangeTypeCustomer = (value) => {
    this.setState({
      typeCustomer: value,
    });
  };

  async getAllCustomer() {
    const dataUsers = await getAllUserApi(Constants.GENERAL);
    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        let listCustomerTemp = [];
        for (let i = 0; i < dataUsers.data.length; i++) {
          listCustomerTemp.push({
            value: dataUsers.data[i].id,
            label: dataUsers.data[i].name,
            ...dataUsers.data[i],
          });
        }
        this.setState({
          listCustomer: listCustomerTemp,
        });
      } else {
        showToast(
          dataUsers.data.message
            ? dataUsers.data.message
            : dataUsers.data.err_msg,
          2000
        );
      }
    } else {
      showToast("X???y ra l???i trong qu?? tr??nh l???y d??? li???u");
    }
  }

  async getDistributionAgencyCustomer(id, token) {
    let reqListCustomer = {
      isChildOf: id,
      customerType: "Distribution_Agency",
    };
    let params = {
      reqListCustomer,
    };
    await callApi("POST", GETTYPECUSTOMER, params, token).then((res) => {
      console.log("khach hang dai ly", res.data);
      if (res.data) {
        if (res.data.success === true) {
          let listDistributionAgencyTemp = [];
          for (let i = 0; i < res.data.data.length; i++) {
            listDistributionAgencyTemp.push({
              value: res.data.data[i].id,
              label: res.data.data[i].name,
              ...res.data.data[i],
            });
          }
          this.setState({
            listDistributionAgency: listDistributionAgencyTemp,
          });
        } else {
          showToast(
            res.data.message ? res.data.message : res.data.err_msg,
            2000
          );
          return false;
        }
      } else {
        showToast("X???y ra l???i trong qu?? tr??nh l???y d??? li???u");
      }
    });
  }

  async getIndustryCustomer(id, token) {
    let reqListCustomer = {
      isChildOf: id,
      customerType: "Industry",
    };
    let params = {
      reqListCustomer,
    };
    await callApi("POST", GETTYPECUSTOMER, params, token).then((res) => {
      // console.log("khach hang cong nghiep", res.data);
      if (res.data) {
        if (res.data.success === true) {
          let listIndustryTemp = [];
          for (let i = 0; i < res.data.data.length; i++) {
            listIndustryTemp.push({
              value: res.data.data[i].id,
              label: res.data.data[i].name,
              ...res.data.data[i],
            });
          }
          this.setState({
            listIndustry: listIndustryTemp,
          });
        } else {
          showToast(
            res.data.message ? res.data.message : res.data.err_msg,
            2000
          );
          return false;
        }
      } else {
        showToast("X???y ra l???i trong qu?? tr??nh l???y d??? li???u");
      }
    });
  }

  async getRestaurantCustomer(id, token) {
    let reqListCustomer = {
      isChildOf: id,
      customerType: "Restaurant_Apartment",
    };
    let params = {
      reqListCustomer,
    };
    await callApi("POST", GETTYPECUSTOMER, params, token).then((res) => {
      // console.log("khach hang nha hang", res.data);
      if (res.data) {
        if (res.data.success === true) {
          let listRestaurantTemp = [];
          for (let i = 0; i < res.data.data.length; i++) {
            listRestaurantTemp.push({
              value: res.data.data[i].id,
              label: res.data.data[i].name,
              ...res.data.data[i],
            });
          }
          this.setState({
            listRestaurant: listRestaurantTemp,
          });
        } else {
          showToast(
            res.data.message ? res.data.message : res.data.err_msg,
            2000
          );
          return false;
        }
      } else {
        showToast("X???y ra l???i trong qu?? tr??nh l???y d??? li???u");
      }
    });
  }

  async getListBranch(id) {
    let listBranchTemp = [];
    const dataBranch = await getListBranchAPI(id);
    // console.log("data branch", dataBranch.data.data);
    for (let i = 0; i < dataBranch.data.data.length; i++) {
      listBranchTemp.push({
        value: dataBranch.data.data[i].id,
        label: dataBranch.data.data[i].name,
        ...dataBranch.data.data[i],
      });
    }
    this.setState({
      listBranch: listBranchTemp,
    });
  }

  // Lay danh sach kho cua Dai Ly
  async getListGeneralWH(id) {
    let listBranchTemp = [];
    const dataBranch = await getListGeneralWarehouse(id);
    // console.log("data branch", dataBranch.data.data);
    for (let i = 0; i < dataBranch.data.data.length; i++) {
      listBranchTemp.push({
        value: dataBranch.data.data[i].id,
        label: dataBranch.data.data[i].name,
        ...dataBranch.data.data[i],
      });
    }
    this.setState({
      listBranch: listBranchTemp,
    });
  }

  async addHistory(
    driverName,
    license_plate,
    cylinders,
    to_array,
    number_array,
    idDriver,
    sign,
    cylinderImex,
    idImex,
    typeImex,
    flow
  ) {
    // Call api
    this.setState({ isLoading: true });
    const user = await createHistoryAPI(
      driverName,
      license_plate,
      cylinders,
      Constants.EXPORT_FACTORY,
      "",
      "",
      "",
      "",
      to_array,
      number_array,
      "",
      "",
      "",
      "",
      "",
      idDriver,
      sign,
      cylinderImex,
      idImex,
      typeImex,
      flow
    );
    this.setState({ isLoading: false });
    //console.log('register',user);
    if (user) {
      if (
        user.status === Constants.HTTP_SUCCESS_CREATED ||
        user.status === Constants.HTTP_SUCCESS_BODY
      ) {
        showToast("Xu???t h??ng th??nh c??ng!", 3000);
        const modal = $("#export-driver1");
        modal.modal("hide");
        //this.props.refresh();
        return true;
      } else {
        showToast(
          user.data.message ? user.data.message : user.data.err_msg,
          2000
        );
        return false;
      }
    } else {
      showToast("X???y ra l???i trong qu?? tr??nh t???o b??nh ");
      return false;
    }

    //this.setState({registerSuccessful: false});
  }

  async componentDidMount() {
    let user_cookies = await getUserCookies();
    let id;
    let token = "Bearer " + user_cookies.token;
    // console.log("user cookieess999", user_cookies.user);
    let params = {
      id: user_cookies.user.id,
    };
    if (
      user_cookies.user.userType === "Factory" &&
      user_cookies.user.userRole === "Owner"
    ) {
      id = user_cookies.user.isChildOf;
    } else {
      id = user_cookies.user.id;
    }

    await callApi("POST", NAMEDRIVE, params, token).then((res) => {
      if (res.data.data <= 0) {
        this.setState({
          listDriver: [
            {
              name: "B???n ch??a c?? t??i x???",
              id: "null",
            },
          ],
        });
      } else {
        //console.log(user_cookie.user.id+""+res.data.data);
        this.setState(
          {
            listDriver: res.data.data,
          },
          () => console.log(this.state.listDriver)
        );
      }
    });
    await this.getAllCustomer();
    await this.getDistributionAgencyCustomer(id, token);
    await this.getIndustryCustomer(id, token);
    await this.getRestaurantCustomer(id, token);
  }

  async submit(event) {
    this.setState({ loading: true });
    event.preventDefault();
    let { listDriver } = this.state;
    let index = listDriver.findIndex((l) => l.id === this.state.idDriver);
    let nameDriver = listDriver[index].name;
    //// var products=await this.getAllCylenders();
    var cylinders = [];
    let cylinderImex = [];
    for (let i = 0; i < this.props.product_parse.length; i++) {
      cylinders.push(this.props.product_parse[i].id);
      cylinderImex.push({
        id: this.props.product_parse[i].id,
        status: "FULL",
        condition: "NEW",
      });
    }

    let data = this.form.getValues();
    // console.log(data["numberGeneral1"]);
    let toArray = [];
    let numberArray = [];
    let generalList = [];
    generalList = this.state.GeneralResults;
    let branchList = this.state.BranchResults;
    let customerList = this.state.CustomerResults;
    console.log("customerList", customerList);
    let agencyList = this.state.AgencyResults;
    let idImex = Date.now();
    let typeImex = "OUT";
    let flow = "EXPORT";
    if (
      customerList.length === 0 &&
      generalList.length === 0 &&
      agencyList.length === 0
    ) {
      this.setState({ loading: false });
      showToast("H??y ch???n n??i c???n xu???t b??nh");
      return;
    } else {
      for (let i = 0; i < branchList.length; i++) {
        toArray.push(branchList[i].value);
        if (data["numberGeneral" + i])
          numberArray.push(data["numberGeneral" + i]);
        else numberArray.push(0);
      }
      for (let i = 0; i < agencyList.length; i++) {
        toArray.push(agencyList[i].value);
        if (data["numberAgency" + i])
          numberArray.push(data["numberAgency" + i]);
        else numberArray.push(0);
      }
      for (let i = 0; i < customerList.length; i++) {
        toArray.push(customerList[i].value);
        if (data["CustomerResults" + i])
          numberArray.push(data["CustomerResults" + i]);
        else numberArray.push(0);
      }
    }
    await this.addHistory(
      nameDriver,
      data.license_plate,
      cylinders,
      toArray,
      numberArray,
      this.state.idDriver,
      "Xuat hang tren Web",
      cylinderImex,
      idImex,
      typeImex,
      flow
    );
    await this.setState({ loading: false });

    return;
  }

  async submitTextFile(event) {
    // /* if (!file) showToast('Vui l??ng ch???n file!', 3000);
    //      this.setState({isLoading: true});
    //      const result = await importProductsFromExcelAPI(file);
    //      this.setState({isLoading: false});
    //      console.log(result);
    //      if (result && result.status === 200) {
    //          if (typeof (result) !== 'undefined') {
    //              showToast('????a v??o th??nh c??ng!', 3000);
    //              this.props.refresh();
    //          }
    //          else {
    //              //showToast("X???y ra l???i trong qu?? tr??nh ????ng k??",2000);
    //          }
    //          return;
    //      } else {
    //          showToast("X???y ra l???i trong qu?? tr??nh import. Vui l??ng ki???m tra l???i d??? li???u", 2000);
    //      }
    //      return;
    //      $("#import-product").modal('hide');
    //      return;*/
  }

  handleChangeExportType = (langValue) => {
    this.setState({
      listExportPlaceData: langValue,
      listExportPlaceDataID: langValue.id,
    });
  };

  render() {
    //console.log("hahahhahaha", this.props.userRole);
    //console.log("hahahhahaha", this.props.userType);
    return (
      <div
        className="modal fade"
        id="export-driver1"
        tabIndex="-1"
        style={{ overflowY: "auto" }}
      >
        {" "}
        <ReactCustomLoading isLoading={this.state.loading} />
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
              {this.props.t("EXPORT_DRIVER_STEP2")}
              </h5>{" "}
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form
                ref={(c) => {
                  this.form = c;
                }}
                className="card"
                onSubmit={(event) => this.submit(event)}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>T??n t??i x???</label>
                        <Select
                          showSearch
                          style={{ width: "100%" }}
                          placeholder="Ch???n t??i x???..."
                          optionFilterProp="children"
                          onChange={this.handleChangeDriver}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.listDriver.map((l, index) => {
                            return (
                              <Option key={index} value={l.id}>
                                {l.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Bi???n s??? xe</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="license_plate"
                          id="license_plate"
                          validations={[required]}
                        />
                      </div>
                    </div>

                    {/*<div className="col-md-12">*/}
                    {/*    <div className="form-group">*/}
                    {/*        <label>Lo???i xu???t </label>*/}
                    {/*        <Select onClick={() => {*/}
                    {/*            this.setState({isShowDropdown: this.form.getValues().type_export})*/}
                    {/*        }} className="form-control"*/}
                    {/*                name="type_export"*/}
                    {/*                validations={[required]}>*/}
                    {/*            <option value="0">-- Ch???n --</option>*/}
                    {/*            <option value="2">Xu???t cho th????ng nh??n mua b??n</option>*/}
                    {/*            <option value="3">Xu???t cho c???a h??ng b??n l???</option>*/}
                    {/*        </Select>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*{this.props.userType === Constant.FACTORY && (*/}
                    {/*    <div className="col-md-12">*/}
                    {/*        <div className="form-group">*/}
                    {/*            <label>"?????a ??i???m xu???t b??nh"</label>*/}
                    {/*            <Select*/}
                    {/*                options={this.props.listExportPlace}*/}
                    {/*                onChange={this.handleChangeExportType.bind(this)}*/}
                    {/*                placeholder="Ch???n..."*/}
                    {/*                value={this.state.listExportPlaceData}*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                    {this.props.userType === Constants.GENERAL ? (
                      ""
                    ) : (
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Ch???n lo???i kh??ch h??ng</label>
                          <Select
                            style={{ width: "100%" }}
                            placeholder="Ch???n lo???i kh??ch h??ng..."
                            onChange={this.handleChangeTypeCustomer}
                          >
                            <Option value="Distribution_Agency">
                              ?????i l?? ph??n ph???i
                            </Option>
                            <Option value="Industry">
                              Kh??ch h??ng c??ng nghi???p
                            </Option>
                            <Option value="Restaurant_Apartment">
                              Nh?? h??ng, t??a nh??
                            </Option>
                          </Select>
                        </div>
                        {/* {this.state.typeCustomer === "Distribution_Agency" && (
                          <div className="form-group">
                            <label>Ch???n c??c kh??ch h??ng</label>
                            <SelectMulti.Creatable
                              multi={true}
                              options={this.state.listDistributionAgency}
                              onChange={this.handleChangeCustomer.bind(this)}
                              placeholder={this.props.t("CHOOSE")}
                              value={this.state.CustomerResults}
                              promptTextCreator={() => {
                                return;
                              }}
                            />
                          </div>
                        )} */}
                        {(
                          <div className="form-group">
                            <label>Ch???n kh??ch h??ng</label>
                            <select
                              className="form-control"
                              style={{ width: "100%" }}
                              placeholder="Ch???n kh??ch h??ng..."
                              onChange={(e) => this.handleChangeGeneral(e)}
                              value={this.state.GeneralResults}
                            >
                              <option value="">Ch???n kh??ch h??ng...</option>
                              {this.state.typeCustomer ===
                                "Distribution_Agency" &&
                                this.state.listDistributionAgency.map(
                                  (l, index) => {
                                    return (
                                      <option key={index} value={l.id}>
                                        {l.name}
                                      </option>
                                    );
                                  }
                                )}
                              {this.state.typeCustomer === "Industry" &&
                                this.state.listIndustry.map((l, index) => {
                                  return (
                                    <option key={index} value={l.id}>
                                      {l.name}
                                    </option>
                                  );
                                })}
                              {this.state.typeCustomer ===
                                "Restaurant_Apartment" &&
                                this.state.listRestaurant.map((l, index) => {
                                  return (
                                    <option key={index} value={l.id}>
                                      {l.name}
                                    </option>
                                  );
                                })}
                            </select>
                          </div>
                        )}

                        <div className="form-group">
                          <label>Ch???n c??c kho</label>
                          <SelectMulti.Creatable
                            multi={true}
                            options={this.state.listBranch}
                            onChange={this.handleChangeBranch.bind(this)}
                            placeholder={this.props.t("CHOOSE")}
                            value={this.state.BranchResults}
                            promptTextCreator={() => {
                              return;
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="col-md-6">
                      {(this.props.userRole!=="Owner"&&this.props.userRole!=="Factory")&&
                      (
                        <div className="form-group">
                        {/* <label>Ch???n c??c kh??ch h??ng</label>
                          <SelectMulti.Creatable
                            multi={true}
                            options={this.state.listCustomer}
                            onChange={this.handleChangeCustomer.bind(this)}
                            placeholder={this.props.t('CHOOSE')}
                            value={this.state.CustomerResults}
                            promptTextCreator={() => {
                              return;
                            }}
                          /> */}

                        <label>Chi nh??nh</label>

                        <SelectMulti.Creatable
                          multi={true}
                          options={this.props.listFactoryExports.filter(
                            (x) => x.userType === Constants.AGENCY
                          )}
                          onChange={this.handleChangeAgency.bind(this)}
                          placeholder="Ch???n..."
                          value={this.state.AgencyResults}
                          promptTextCreator={() => {
                            return;
                          }}
                        />
                      </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <table
                        className="table table-striped table-bordered seednet-table-keep-column-width"
                        cellSpacing="0"
                      >
                        <tbody className="display-block display-tbody">
                          {this.state.CustomerResults.map((store, index) => {
                            return (
                              <tr key={index}>
                                <td scope="row" className="text-center">
                                  {store.name}
                                </td>
                                <td scope="row" className="text-center">
                                  <Input
                                    name={"CustomerResults" + index}
                                    placeholder={"Nh???p s??? l?????ng"}
                                    className="form-control"
                                    type="number"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {this.props.userType === Constants.GENERAL ? (
                      ""
                    ) : (
                      <div className="col-md-6">
                        <table
                          className="table table-striped table-bordered seednet-table-keep-column-width"
                          cellSpacing="0"
                        >
                          {}
                          <tbody className="display-block display-tbody">
                            {this.state.BranchResults.map((store, index) => {
                              return (
                                <tr key={index}>
                                  <td scope="row" className="text-center">
                                    {store.name}
                                  </td>
                                  <td scope="row" className="text-center">
                                    <Input
                                      name={"numberGeneral" + index}
                                      placeholder={"Nh???p s??? l?????ng"}
                                      //validations={[required]}
                                      className="form-control"
                                      type="number"
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* {this.state.isShowDropdown==='1' && (<div className="col-md-6">
                                            <div className="form-group">
                                                <label>Tr???m chi???t n???p</label>
                                                <Select className="form-control"
                                                        name="station"
                                                        validations={[required]}>
                                                    <option value="">-- Ch???n --</option>
                                                    {this.props.listStationUser.map((item, index) => <option value={item.id}>{item.name}</option>)}
                                                </Select>
                                            </div>
                                        </div>)} */}
                  </div>
                </div>

                <footer className="card-footer text-center">
                  <Button className="btn btn-primary" type="submit">
                    L??u
                  </Button>
                  <button
                    className="btn btn-secondary"
                    type="reset"
                    data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
                  >
                    ????ng
                  </button>
                </footer>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(ExportDriverFactoryPopupNew);
