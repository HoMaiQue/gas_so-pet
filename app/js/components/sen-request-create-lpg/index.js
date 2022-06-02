import React from "react";
import PropType from "prop-types";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import Button from "react-validation/build/button";
import required from "required";
import isUppercase from "isUppercase";
import showToast from "showToast";
import getUserCookies from "./../../helpers/getUserCookies";
import { IMPORTCYLINDERBYEXCEL } from './../../config/config';
import sendReqCreFromExcelAPI from "./../../../api/sendRequestCreateCylinder";
import { Radio } from 'antd';
import { GETRENTALPARTNER } from './../../config/config';
import { GETLISTMANUFACTURE } from './../../config/config';
import callApi from './../../util/apiCaller';
import Constants from "Constants";
import getAllManufacturer from "getAllManufacturer";
import { withNamespaces } from 'react-i18next';

let file = null;
class RequestExcel extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      usingType: "00",
      optionUsingType: [],
      listPartner: [],
      rentalPartner: "",
      manufacture: "",
      listManufacturers: [],
      message: "",
      messageErr: "",
      cylinderType: ""
    };
  }

  // componentDidUpdate = async (prevProps) => {
  //   // Typical usage (don't forget to compare props):
  //   if (this.props._togglePopup !== prevProps._togglePopup) {
  //     console.log("componentDidUpdate");
  //     await callApi("POST", GETLISTMANUFACTURE, param, token).then(res => {
  //       // console.log("ressss", res.data);
  //       if (res.data) {
  //         if (res.data.status === true) {
  //           console.log("Lay thuong hieu thanh cong3!");
  //           let listArrManufacture = [];
  //           for (let i = 0; i < res.data.data.length; i++) {
  //             listArrManufacture.push({
  //               value: res.data.data[i].id,
  //               label: res.data.data[i].name,
  //               ...res.data.data[i],
  //             })
  //           }
  //           this.setState({
  //             listManufacturers: listArrManufacture
  //           })
  //         }
  //         else {
  //           showToast(res.data.data.message ? res.data.data.message : res.data.data.err_msg, 2000);
  //         }
  //         //this.setState({image_link: profile.data.company_logo});
  //       }
  //       else {
  //         showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
  //       }
  //     })
  //   }
  // };

  async componentDidMount() {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.isChildOf;
    let param = {
      isChildOf: user_cookies.user.isChildOf
    }
    // console.log('this.props._togglePopup RequestExcel', this.props._togglePopup)
    // if (this.props._togglePopup) {
      // console.log('this.props.togglePopup', this.props._togglePopup)
      await callApi("POST", GETLISTMANUFACTURE, param, token).then(res => {
        // console.log("ressss", res.data);
        if (res.data) {
          if (res.data.status === true) {
            // console.log("Lay thuong hieu thanh cong3!");
            let listArrManufacture = [];
            for (let i = 0; i < res.data.data.length; i++) {
              listArrManufacture.push({
                value: res.data.data[i].id,
                label: res.data.data[i].name,
                ...res.data.data[i],
              })
            }
            this.setState({
              listManufacturers: listArrManufacture
            })
          }
          else {
            showToast(res.data.data.message ? res.data.data.message : res.data.data.err_msg, 2000);
          }
          //this.setState({image_link: profile.data.company_logo});
        }
        else {
          showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }
      })
    // }
    
    await this.getListRentalPartner(id, token);
  }


  handleFileUpload(event) {
    file = event.target.files[0];
  }

  onChangeRadioUsingType = e => {
    e.preventDefault();
    this.setState({
      rentalPartner: e.target.value
    })
  }

  onChangeManufacture = e => {
    e.preventDefault();
    this.setState({
      manufacture: e.target.value
    })
  }

  onChangeUsingType = async e => {
    e.preventDefault();
    await this.setState({
      usingType: e.target.value,
    });
    if (e.target.value === "00") {
      document.getElementById('rentalPartner').style.display = "none";
    }
    else {
      document.getElementById('rentalPartner').style.display = "block";
    }
  }

  async getListRentalPartner(id, token) {
    let params = {
      "id": id
    };
    await callApi("POST", GETRENTALPARTNER, params, token).then(res => {
      this.setState({
        listPartner: res.data
      });
       // console.log("thue vo excel", res.data);
    })

     // console.log("thue vo excel1", this.state.listPartner);
    if (this.state.listPartner) {
      if (this.state.listPartner.status === true) {
        this.setState({
          optionUsingType: this.state.listPartner.data.map((user) => {
            return {
              value: user.id,
              label: user.name
            }
          })
        })
      }
      else {
        showToast(this.state.listPartner.data.message 
          ? this.state.listPartner.data.message 
          : this.state.listPartner.data.err_msg, 2000);
      }
    }
    else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  }

  selectOptionHandler = (e) => {
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]: value
    });
  };

  //cmt
  async submit(event) {
    event.preventDefault();
    if (!file)
      showToast("Vui lòng chọn file!", 3000);
    else {
      const user_cookies = await getUserCookies();
      //   let data = new FormData();
      //   data.append('upload_file', file);
      //   data.append('id_ReqTo',user_cookies.user.owner);
      //   let token = "Bearer " + user_cookies.token;
      //   await callApi("POST", IMPORTCYLINDERBYEXCEL, data, token).then(res=>{
      //     //console.log(user_cookies.user.owner);
      //       console.log(res.data);

      //       if(res.data.err)
      //       {
      //         alert(res.data.err);
      //       }
      //       else if(!res.data.err){
      //         alert("Tạo thành công");
      //       };
      //       if (res) {
      //         const modal = $("#create-request-excel");
      //         modal.modal("hide");
      //       }
      //       window.location.reload();
      //   })
      // }
      //console.log(user_cookies);
      const result = await sendReqCreFromExcelAPI(file, user_cookies.user.isChildOf, this.state.cylinderType, this.state.manufacture, this.state.usingType, this.state.rentalPartner);
      // console.log('result', result);
      if (result && result.status === 200) {
        if (result.data.status === false && result.data.err !== "") {
          const dataErr = result.data.err.replace(/;/g, "\n");
          this.setState({ messageErr: dataErr });
          //showToast(dataErr, 3000);
        }
        else {
          this.setState({ message: 'Tất cả mã nhập vào hệ thống để gửi yêu cầu đều thành công' })
          //showToast('Tất cả mã nhập vào hệ thống đều thành công', 3000);
          // console.log('result', result);
        }
        // window.location.reload();
        return;
      }
      else {
        showToast("Xảy ra lỗi trong quá trình gửi request. Vui lòng kiểm tra lại dữ liệu", 2000);
      }
      $("#create-request-excel").modal('hide');
      return;
    }
  }

  render() {
    // const {
    //   togglePopup
    // } = this.props
    return (
      <div className="modal fade" id="create-request-excel" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{this.props.t('CREATE_CYL')}</h5>
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
                        <label>{this.props.t('CHOOSE_EXCEL')}</label>
                        <div style={{ display: "flex" }}>
                          <Input
                            //  disabled={this.props.isEditForm}
                            className="form-control"
                            type="file"
                            name="fileexcel"
                            id="fileexcel"
                            onChange={this.handleFileUpload}
                            validations={[required]}
                          />
                          <input type="reset" style={{ height: "100%", padding: "6px" }} />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{this.props.t('CLASSIFY')}</label>
                        <div className="form-group">
                          <Radio.Group
                            onChange={this.onChangeUsingType}
                            value={this.state.usingType}
                            validations={[required]}
                          >
                            <div className="usingType__Radio">
                              <Radio style={{ display: "block", marginBottom: "5px" }}
                                value="00"
                                onChange={this.onChangeUsingType}
                              >{this.props.t('PERMANENT')}
                                </Radio>
                              <Radio style={{ display: "block" }}
                                value="01"
                                onChange={this.onChangeUsingType}
                              >{this.props.t('LEASE')}
                                    <Select className="form-control"
                                  id="rentalPartner"
                                  name="rentalPartner"
                                  style={{ display: "block" }}
                                  onChange={this.onChangeRadioUsingType}>
                                  <option value="">{this.props.t('CHOOSE')}</option>
                                  {this.state.optionUsingType.map((item, index) =>
                                    <option
                                      value={item.value} key={index}>{item.label}
                                    </option>)}
                                </Select>
                              </Radio>
                            </div>
                          </Radio.Group>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{this.props.t('BRANCH')}</label>
                        <div className="form-group">
                          <Select className="form-control"
                            name="manufacture"
                            validations={[required]}
                            onChange={this.onChangeManufacture}>
                            <option value="">{this.props.t('CHOOSE')}</option>
                            {this.state.listManufacturers.map((item, index) =>
                              <option value={item.value} key={index}>{item.name}</option>)}
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{this.props.t('CYLINDER_TYPE')}</label>
                        <Select className="form-control"
                          name="cylinderType"
                          id="cylinderType"
                          value={this.state.cylinderType}
                          onChange={this.selectOptionHandler}
                          validations={[required]}>
                          <option value=''>{this.props.t('CHOOSE')}</option>
                          <option value="CYL12KG">{this.props.t('12_NORMAL')}</option>
                          <option value="CYL12KGCO">{this.props.t('12_COMPACT')}</option>
                          <option value="CYL45KG">{this.props.t('45_NORMAL')}</option>
                          <option value="CYL50KG">{this.props.t('50_NORMAL')}</option>
                        </Select>
                      </div>
                    </div>
                  </div>
                  {this.state.messageErr !== ""
                    ? (<div className="row">
                      <label style={{
                        color: "#f96868",
                        fontSize: 12,
                        whiteSpace: "pre-line"
                      }}>{this.state.messageErr}</label>
                    </div>)
                    : null}
                  {this.state.message !== "" ? (<div className="row">
                    <label style={{
                      color: "#15c377",
                      fontSize: 12,
                      whiteSpace: "pre-line"
                    }}>{this.state.message}</label>
                  </div>) : null}
                </div>

                <footer className="card-footer text-center">
                  <Button className="btn btn-primary">{this.props.t('SAVE')}</Button>
                  <button
                    className="btn btn-secondary"
                    type="reset"
                    data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
                    // onClick={togglePopup}
                  >
                    {this.props.t('CLOSE')}
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

export default withNamespaces()(RequestExcel);
