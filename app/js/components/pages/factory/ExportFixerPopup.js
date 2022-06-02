import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Button from "react-validation/build/button";
import required from "required";
import Constants from "Constants";
import showToast from "showToast";
import createHistoryAPI from "createHistoryAPI";
import SelectMulti from "react-select";
import { NAMEDRIVE } from "./../../../config/config";
import getUserCookies from "./../../../helpers/getUserCookies";
import callApi from "./../../../util/apiCaller";
import { Select } from "antd";
import { withNamespaces } from "react-i18next";
import ReactCustomLoading from "ReactCustomLoading";

const Option = Select.Option;

class ExportFixerPopup extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      content: "",
      listProducts: [],
      AgencyResults: [],
      GeneralResults: [],
      typeUser: [],
      ListUserSubmit: [],
      ListUserSubmitID: "",
      driverName: "",
      idDriver: "",
      listDriver: [],
      loading: false,
    };
  }
  handleChangeDriver = (value) => {
    this.setState({
      idDriver: value,
    });
  };

  async addHistory(
    driver,
    license_plate,
    cylinders,
    number_array,
    toArray,
    idDriver,
    sign
  ) {
    this.setState({ isLoading: true });
    const { typeExportCylinder } = this.props;
    const { ListUserSubmitID } = this.state;
    // Call api
    // console.log(this.state.ListUserSubmitID);
    // console.log('register:::: ', typeExportCylinder);
    this.setState({ isLoading: true });
    const user = await createHistoryAPI(
      driver,
      license_plate,
      cylinders,
      Constants.EXPORT_TYPE,
      ListUserSubmitID,
      "",
      "",
      "",
      toArray,
      number_array,
      "",
      "",
      "",
      typeExportCylinder,
      "",
      idDriver,
      sign
    );
    this.setState({ isLoading: false });
    //console.log('register',user);
    if (user) {
      if (
        user.status === Constants.HTTP_SUCCESS_CREATED ||
        user.status === Constants.HTTP_SUCCESS_BODY
      ) {
        showToast("Xuất hàng thành công!", 3000);
        this.props.handleChangeTypeExportCylinderEmpty();
        const modal = $("#export_fixer_popup");
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

  async componentDidMount() {
    let user_cookie = await getUserCookies();
    let token = "Bearer " + user_cookie.token;
    let params = {
      id: user_cookie.user.id,
    };
    await callApi("POST", NAMEDRIVE, params, token).then((res) => {
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
    });
  }

  handleChangeGeneral = (langValue) => {
    this.setState({
      ListUserSubmit: langValue,
      ListUserSubmitID: langValue.id,
    });
  };

  async submit(event) {
    this.setState({ loading: true });
    event.preventDefault();
    let { listDriver } = this.state;
    let index = listDriver.findIndex((l) => l.id === this.state.idDriver);
    let nameDriver = listDriver[index].name;
    let cylinders = [];
    for (let i = 0; i < this.props.product_parse.length; i++) {
      cylinders.push(this.props.product_parse[i].id);
    }
    let data = this.form.getValues();
    data.idDriver = listDriver[index].id;
    let sign = "Web signature";
    let toArray = [];
    let numberArray = [];
    let listUserSubmit = this.state.ListUserSubmit;
    if (listUserSubmit.length === 0) {
      showToast("Hãy chọn nơi cần xuất bình");
      return;
    } else {
      for (let i = 0; i < listUserSubmit.length; i++) {
        toArray.push(listUserSubmit[i].value);
        numberArray.push(data["numberGeneral" + i]);
      }
    }
    await this.addHistory(
      nameDriver,
      data.license_plate,
      cylinders,
      numberArray,
      toArray,
      data.idDriver,
      sign
    );
    await this.setState({ loading: false });
    return;
  }

  render() {
    //console.log("hahaha",this.props.typeExportCylinder);
    const nameExport = "Kho Trực Thuộc SOPET";
    return (
      <div className="modal fade" id="export_fixer_popup" tabIndex="-1">
        <ReactCustomLoading isLoading={this.state.loading} />
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{this.props.t("EXP_2_DRIVER")}</h5>
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
                onSubmit={(event) =>
                  this.submit(event, this.props.typeExportCylinder)
                }
              >
                <div className="card-body custom-scroll-table">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{this.props.t("NAME_DRIVER")}</label>
                        <Select
                          showSearch
                          style={{ width: "100%" }}
                          placeholder={this.props.t("CHOOSE")}
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
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{nameExport}</label>
                        <SelectMulti.Creatable
                          multi={true}
                          options={this.props.listUsersPartner}
                          onChange={this.handleChangeGeneral.bind(this)}
                          placeholder={this.props.t("CHOOSE")}
                          value={this.state.ListUserSubmit}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <table
                        className="table table-striped table-bordered seednet-table-keep-column-width"
                        cellSpacing="0"
                      >
                        <tbody className="display-block display-tbody">
                          {this.state.ListUserSubmit.map((store, index) => {
                            return (
                              <tr key={index}>
                                <td scope="row" className="text-center">
                                  {store.name}
                                </td>
                                <td scope="row" className="text-center">
                                  <Input
                                    name={"numberGeneral" + index}
                                    placeholder={this.props.t("INPUT_NUM")}
                                    validations={[required]}
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

export default withNamespaces()(ExportFixerPopup);
