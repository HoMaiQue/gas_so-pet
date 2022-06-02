import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Button from "react-validation/build/button";
import required from "required";
import Constants from "Constants";
import showToast from "showToast";
import createHistoryAPI from "createHistoryAPI";
//import getAllPartner from "getPartner";
import SelectMulti from "react-select";

import { NAMEDRIVE, GETDRIVERIMPORTCYLINDER } from "./../../../config/config";
import callApi from "./../../../util/apiCaller";
import getUserCookies from "./../../../helpers/getUserCookies";
import { Select } from "antd";
import { withNamespaces } from "react-i18next";
import ReactCustomLoading from "ReactCustomLoading";

const Option = Select.Option;

class ImportDriverTypeFixer extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      content: "",
      listProducts: [],
      AgencyResults: [],
      GeneralResults: [],
      typeUser: [],
      ListUserSubmit: "",
      ListUserSubmitID: "",
      nameDriver: "",
      idDriver: "",
      listDriver: [],
      userTypeFixer: "",
      loading: false,
      listDriverBegin:[],
    };
  }

  async addHistory(
    driver,
    license_plate,
    cylinders,
    number_cylinder,
    idDriver,
    sign,
    fromId,
    cylinderImex,
    idImex,
    typeImex,
    flow
  ) {
    const { typeExportCylinder } = this.props;
    // Call api
    // console.log(this.state.ListUserSubmitID);
    //var toId = isFixer ? parentRoot : this.state.ListUserSubmitID
    // console.log('register:::: ', typeExportCylinder);
    this.setState({ isLoading: true });
    const user = await createHistoryAPI(
      driver,
      license_plate,
      cylinders,
      Constants.IMPORT_TYPE,
      this.state.ListUserSubmitID,
      "",
      number_cylinder,
      fromId,
      "",
      "",
      "",
      "",
      "",
      typeExportCylinder,
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
        showToast("Nhập hàng thành công!", 3000);
        this.props.handleChangeTypeExportCylinderEmpty();
        const modal = $("#import-driver-type-fixer");
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
      showToast("Xảy ra lỗi trong quá trình tạo bình ");
      return false;
    }

    //this.setState({registerSuccessful: false});
  }

  handleChangeGeneral = (langValue) => {
    this.setState({
      ListUserSubmit: langValue,
      ListUserSubmitID: langValue.id,
    });
  };

  handleChangeDriver = (value) => {
    this.setState({
      idDriver: value,
    });
  };

  async componentDidMount() {
    let user_cookie = await getUserCookies();
    let token = "Bearer " + user_cookie.token;
    this.setState({
      userTypeFixer: user_cookie.user.userType,
    });
    let params = {
      id:"5f73e7e146c35825907cc8ca",
      isChildOf: "5f73e7b046c35825907cc8c7",
    };
    await callApi("POST", GETDRIVERIMPORTCYLINDER, params, token).then(
      (res) => {
        if (res.data.data <= 0) {
          this.setState({
            listDriver: [
              {
                name: "Bạn chưa có tài xế",
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
      }
    );
  }
  async componentWillReceiveProps(nextProps) {
    let user_cookie = await getUserCookies();
    let token = "Bearer " + user_cookie.token;
    if (nextProps && nextProps.product_parse) {
      console.log("nextProps.product_parse[0].histories[0].idDriver",user_cookie.user.id);
      let id=nextProps.product_parse.length>0? nextProps.product_parse[0].current:"";
      let isChildOf="";  
      let params = {
        id:nextProps.product_parse[0].histories[0].idDriver===null ?user_cookie.user.id:id,
        isChildOf: isChildOf,
      };
      await callApi("POST", GETDRIVERIMPORTCYLINDER, params, token).then(
        (res) => {
          if (res.data.data <= 0) {
            this.setState({
              listDriver: [
                {
                  name: "Bạn chưa có tài xế",
                  id: "null",
                },
              ],
            });
          } else {
            //console.log(user_cookie.user.id+""+res.data.data);
            this.setState(
              {
                listDriverBegin: res.data.data,
              },
              () => console.log("aaaaaaaa",this.state.listDriverBegin)
            );
          }
        }
      );
    }
  }
  async submit(event) {
    this.setState({ loading: true });
    event.preventDefault();
    let { listDriver,listDriverBegin } = this.state;
    // let index = listDriver.findIndex((l) => l.id === this.state.idDriver);
    // let nameDriver = listDriver[index].name;
    let index = listDriverBegin.findIndex((l) => l.id === this.state.idDriver);
     let nameDriver = listDriverBegin[index].name;
    var cylinders = [];
    var cylinderImex = [];
    for (let i = 0; i < this.props.product_parse.length; i++) {
      cylinders.push(this.props.product_parse[i].id);
      cylinderImex.push({
        id: this.props.product_parse[i].id,
        status: "EMPTY",
        //emty
        condition: "NEW",
      });
    }

    let data = this.form.getValues();
    data.idDriver = listDriverBegin[index].id;
    let sign = "Web signature";
    let idImex = Date.now();
    let typeImex = "IN";
    let flow = "IMPORT_CELL";
    await this.addHistory(
      nameDriver,
      data.license_plate,
      cylinders,
      data.number_cylinder,
      data.idDriver,
      sign,
      this.props.product_parse[0].histories[0].from.id,
      cylinderImex,
      idImex,
      typeImex,
      flow
    );
    await this.setState({ loading: false });
    return;
  }
  handeload = () => {
    // window.location.reload();
  };
  render() {
    const nameExport = "Thương Nhân Sở Hữu";
    //console.log("this.props.product_parse",this.props.product_parse);
    return (
      <div className="modal fade" id="import-driver-type-fixer" tabIndex="-1">
        <ReactCustomLoading isLoading={this.state.loading} />
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Nhập bình - Bước 2 - Thông Tin Tài Xế
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={this.handeload}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form
                ref={(c) => {
                  this.form = c;
                }}
                className="card"
                onSubmit={(event) =>
                  this.submit(event, this.props.typeExportCylinder)
                }
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{this.props.t("NAME_DRIVER")}</label>
                        <Select
                          showSearch
                          style={{ width: "100%" }}
                          placeholder="Chọn tài xế..."
                          optionFilterProp="children"
                          onChange={this.handleChangeDriver}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.listDriverBegin.map((l, index) => {
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
                        <label>{this.props.t("LICENSE_PLATE")}</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="license_plate"
                          id="license_plate"
                          validations={[required]}
                        />
                      </div>
                    </div>
                    {this.state.userTypeFixer !== "Fixer" ? (
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>{nameExport}</label>
                          <SelectMulti.Creatable
                            multi={true}
                            options={
                              this.props.typeExportCylinder !== Constants.TO_FIX
                                ? this.props.listUsersPartner
                                : this.props.listUsersPartner
                            }
                            onChange={this.handleChangeGeneral.bind(this)}
                            placeholder={this.props.t("CHOOSE")}
                            value={this.state.ListUserSubmit}
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Số Lượng Bình Không Mã</label>
                        <Input
                          className="form-control"
                          type="number"
                          name="number_cylinder"
                          id="number_cylinder"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <footer className="card-footer text-center">
                  <Button className="btn btn-primary" type="submit">
                    {this.props.t("SAVE")}
                  </Button>
                  <button
                    className="btn btn-secondary"
                    type="reset"
                    data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
                    onClick={this.handeload}
                  >
                    {this.props.t("CLOSE")}
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

export default withNamespaces()(ImportDriverTypeFixer);
