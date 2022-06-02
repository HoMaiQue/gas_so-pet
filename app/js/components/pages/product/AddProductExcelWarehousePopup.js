import React from "react";
import AddProductPopup from "./AddProductPopup";

import getAllUserApi from "getAllUserApi";
import { push } from "react-router-redux";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Button from "react-validation/build/button";
import showToast from "showToast";
import importProductsWarehouseFromExcelAPI from "./../../../../api/importProductsWarehouseFromExcelAPI";
import { connect } from "react-redux";
import required from "required";
import Select from "react-select";
//import Select2 from 'react-validation/build/select';
import Constants from "Constants";
import getDestinationUserAPI from "getDestinationUserAPI";
import getUserCookies from "getUserCookies";
import { GETRENTALPARTNER } from "./../../../config/config";
import { GETLISTMANUFACTURE } from "./../../../config/config";
import callApi from "./../../../util/apiCaller";
import { Radio } from "antd";
import { withNamespaces } from "react-i18next";
import ReactCustomLoading from "ReactCustomLoading";

//import './product.scss'

import { lang } from "moment";

let file = null;

const options = [
  { value: "CYL12KG", label: "Bình 12 KG Thường" },
  { value: "CYL12KGCO", label: "Bình 12 KG Compact" },
  { value: "CYL45KG", label: "Bình 45 KG" },
  { value: "CYL50KG", label: "Bình 50 KG" },
];

class AddProductExcelWarehousePopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      messageErr: "",
      chooseType: [
        {
          value: 0,
          label: "Tại thương nhân sở hữu",
          name: "Thương nhân sở hữu",
        },
        { value: 1, label: "Tại sửa chữa", name: "Sửa chữa" },
        {
          value: 2,
          label: "Tại kho trực thuộc SOPET",
          name: "Kho Trực Thuộc SOPET",
        },
      ],
      dataChoose: 0,
      ListUserSubmitID: "",
      ListCtyCon: "",
      ListChildCompany: "",
      cylinderType: "",
      manufacture: "",
      listManufacturers: [],
      usingType: "00",
      optionUsingType: [],
      listPartner: [],
      rentalPartner: "",
      statusHideSelect: false,
      loading: false,
    };
  }

  async componentDidMount() {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.isChildOf;
    let param = {
      isChildOf: user_cookies.user.isChildOf,
    };
    await callApi("POST", GETLISTMANUFACTURE, param, token).then((res) => {
      // console.log("ressss", res.data);
      if (res.data) {
        if (res.data.status === true) {
          // console.log("Lay thuong hieu thanh cong1!");
          let listArrManufacture = [];
          for (let i = 0; i < res.data.data.length; i++) {
            listArrManufacture.push({
              value: res.data.data[i].id,
              label: res.data.data[i].name,
              ...res.data.data[i],
            });
          }
          this.setState({
            listManufacturers: listArrManufacture,
          });
        } else {
          showToast(
            res.data.data.message
              ? res.data.data.message
              : res.data.data.err_msg,
            2000
          );
        }
        //this.setState({image_link: profile.data.company_logo});
      } else {
        showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
      }
    });
    await this.getListRentalPartner(id, token);
  }

  async handleFileUpload(event) {
    file = event.target.files[0];
  }

  handleChangeGeneral = (langValue) => {
    this.setState({
      dataChoose: langValue.value,
      ListUserSubmitID: "",
    });
  };

  handleChangeFixer = (langValue) => {
    this.setState({
      ListUserSubmit: langValue,
      ListUserSubmitID: langValue.id,
    });
  };

  handleChangeCty = (langValue) => {
    this.setState({
      ListCtyCon: langValue,
      ListChildCompany: langValue.id,
    });
  };

  handleCylinderTypeChange = (langValue) => {
    this.setState({ cylinderType: langValue });
  };

  handleChangeManufacture = (langValue) => {
    this.setState({
      manufacture: langValue,
    });
  };

  // async getAllManufacturer() {
  //     const dataUsers = await getAllManufacturer(Constants.GENERAL);
  //     // console.log("them product excel", dataUsers);
  //     // console.log("them product excel LL", dataUsers.data.length);
  //     if (dataUsers) {
  //         if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
  //             let listArrManufacture = [];
  //             for (let i = 0; i < dataUsers.data.length; i++) {
  //                 listArrManufacture.push({
  //                     value: dataUsers.data[i].id,
  //                     label: dataUsers.data[i].name,
  //                     ...dataUsers.data[i],
  //                 })
  //             }
  //             this.setState({
  //                 listManufacturers: listArrManufacture
  //             })
  //         }
  //         else {
  //             showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
  //         }
  //         //this.setState({image_link: profile.data.company_logo});
  //     }
  //     else {
  //         showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
  //     }
  // }

  onChangeRadioUsingType = (langValue) => {
    this.setState({
      rentalPartner: langValue,
    });
  };

  onChangeUsingType = async (e) => {
    e.preventDefault();
    await this.setState({
      usingType: e.target.value,
    });
    if (e.target.value === "00") {
      //document.getElementById('rentalPartner').style.display = "none";
      this.setState({ statusHideSelect: false });
    } else {
      //document.getElementById('rentalPartner').style.display = "block";
      this.setState({ statusHideSelect: true });
    }
  };

  async getListRentalPartner(id, token) {
    let params = {
      id: id,
    };
    await callApi("POST", GETRENTALPARTNER, params, token).then((res) => {
      this.setState({
        listPartner: res.data,
      });
      //  console.log("thue vo excel", res.data);
    });

    //  console.log("thue vo excel1", this.state.listPartner);
    if (this.state.listPartner) {
      if (this.state.listPartner.status === true) {
        this.setState({
          optionUsingType: this.state.listPartner.data.map((user) => {
            return {
              value: user.id,
              label: user.name,
            };
          }),
        });
      } else {
        showToast(
          this.state.listPartner.data.message
            ? this.state.listPartner.data.message
            : this.state.listPartner.data.err_msg,
          2000
        );
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  }

  async submit(event) {
    this.setState({ loading: true });
    event.preventDefault();
    if (!file) showToast("Vui lòng chọn file!", 3000);
    this.setState({ isLoading: true });
    // console.log("cyyyy", this.state.cylinderType);
    const result = await importProductsWarehouseFromExcelAPI(
      file,
      this.state.cylinderType.value,
      this.state.manufacture.id,
      this.state.usingType,
      this.state.usingType === "00" ? "" : this.state.rentalPartner.value
    );
    this.setState({
      isLoading: false,
    });
    //  console.log(result);
    if (result && result.status === 200) {
      if (result.data.status === false && result.data.err !== "") {
        const dataErr = result.data.err.replace(/;/g, "\n");
        this.setState({ loading: false, messageErr: dataErr });
        //showToast(dataErr, 3000);
      } else {
        this.setState({
          loading: false,
          message: "Tất cả mã nhập vào hệ thống đều thành công",
        });
        //showToast('Tất cả mã nhập vào hệ thống đều thành công', 3000);
        this.props.refresh();
      }
      // window.location.reload();
      return;
    } else {
      this.setState({ loading: false });
      showToast(
        "Xảy ra lỗi trong quá trình import. Vui lòng kiểm tra lại dữ liệu",
        2000
      );
    }
    $("#import-product-warehouse").modal("hide");
    return;
  }

  onreload = () => {
    // window.location.reload();
  };

  render() {
    return (
      <div className="modal fade" id="import-product-warehouse" tabIndex="-1">
        <ReactCustomLoading isLoading={this.state.loading} />

        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Đưa Sản Phẩm Vào Bằng File Excel</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={this.onreload}
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
                onSubmit={(event) => this.submit(event)}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>File</label>
                        <div style={{ display: "flex" }}>
                          <Input
                            className="form-control"
                            type="file"
                            name="upload_file"
                            onChange={(e) => this.handleFileUpload(e)}
                            validations={[required]}
                          />
                          <input
                            type="reset"
                            style={{ height: "100%", padding: "8px" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{this.props.t("CYLINDER_TYPE")}</label>
                        <Select
                          name="cylinderType"
                          id="cylinderType"
                          placeholder={this.props.t("CHOOSE")}
                          onChange={this.handleCylinderTypeChange.bind(this)}
                          options={options}
                          value={this.state.cylinderType}
                        ></Select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Thương hiệu</label>
                        <div className="form-group">
                          <Select
                            onChange={this.handleChangeManufacture.bind(this)}
                            placeholder={this.props.t("CHOOSE")}
                            options={this.state.listManufacturers}
                            value={this.state.manufacture}
                          ></Select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>{this.props.t("CLASSIFY")}</label>
                      <div className="form-group">
                        <Radio.Group
                          onChange={this.onChangeUsingType}
                          value={this.state.usingType}
                          validations={[required]}
                        >
                          <div className="usingType__Radio">
                            <Radio
                              style={{ display: "block", marginBottom: "5px" }}
                              value="00"
                              onChange={this.onChangeUsingType}
                            >
                              Cố định
                            </Radio>
                            <Radio
                              style={{ display: "block" }}
                              value="01"
                              onChange={this.onChangeUsingType}
                            >
                              Cho thuê
                              {/* <Select2 className="form-control"
                                                            id="rentalPartner" 
                                                            name="rentalPartner" 
                                                            //style={{display: "block"}}
                                                            onChange={this.onChangeRadioUsingType}>
                                                            <option value="">-- Chọn --</option>
                                                            {this.state.optionUsingType.map((item, index) => 
                                                            <option
                                                                value={item.value} key={index}>{item.label}
                                                            </option>)}
                                                         </Select2> */}
                            </Radio>
                            {this.state.statusHideSelect && (
                              <Select
                                styles={{ marginTop: "10px" }}
                                placeholder={this.props.t("CHOOSE")}
                                onChange={this.onChangeRadioUsingType.bind(
                                  this
                                )}
                                options={this.state.optionUsingType}
                                value={this.state.rentalPartner}
                              />
                            )}
                          </div>
                        </Radio.Group>
                      </div>
                    </div>
                  </div>

                  {this.state.messageErr !== "" ? (
                    <div className="row">
                      <label
                        style={{
                          color: "#f96868",
                          fontSize: 12,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {this.state.messageErr}
                      </label>
                    </div>
                  ) : null}
                  {this.state.message !== "" ? (
                    <div className="row">
                      <label
                        style={{
                          color: "#15c377",
                          fontSize: 12,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {this.state.message}
                      </label>
                    </div>
                  ) : null}
                </div>

                <footer className="card-footer text-center">
                  <Button className="btn btn-primary" type="submit">
                    OK
                  </Button>
                  <button
                    className="btn btn-secondary"
                    type="reset"
                    data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
                    onClick={this.onreload}
                  >
                    Đóng
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

export default withNamespaces()(connect()(AddProductExcelWarehousePopup));
