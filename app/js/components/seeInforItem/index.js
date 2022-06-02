// Thay doi thong tin thuong hieu
import React, { Component } from "react";
import "./index.scss";
import { Row, Col, Icon } from "antd";
import getUserCookies from "./../../helpers/getUserCookies";
import callApi from "./../../util/apiCaller";
import { UPDATEBRANDINFORMATION } from "./../../config/config";
import getAllUserApi from "./../../../api/getAllUserAPI";
import Form from "react-validation/build/form";
import Button from "react-validation/build/button";
import Select from "react-validation/build/select";
import { withNamespaces } from 'react-i18next';

class SeeInforItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      logo: "",
      address: "",
      phone: "",
      origin: "",
      mass: "",
      ingredient: "",
      preservation: "",
      appliedStandard: "",
      optionSafetyInstructions: "",
      safetyInstructions: "",
      //idCardBase64:'',
    };
  }

  onChange = (e) => {
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]: value
    });
  };

  getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }

  fileChangedHandler = (event) => {
    //this.setState({selectedFile: event.target.files[0]})

    let idCardBase64 = "";
    this.getBase64(event.target.files[0], (result) => {
      idCardBase64 = result;
      this.setState({ logo: idCardBase64 });
    });
  };

  selectOptionHandler = (event) => {
    this.setState({ option: event.target.value });
  };

  onSubmit = async (e) => {
    let {
      id,
      name,
      logo,
      address,
      phone,
      origin,
      mass,
      ingredient,
      preservation,
      appliedStandard,
      optionSafetyInstructions,
      safetyInstructions
    } = this.state;
    e.preventDefault();
    var user_cookie = await getUserCookies();
    if (user_cookie) {
      let params = {
        id: id,
        name: name,
        logo: logo,
        address: address,
        phone: phone,
        origin: origin,
        mass: mass,
        ingredient: ingredient,
        preservation: preservation,
        appliedStandard: appliedStandard,
        optionSafetyInstructions: optionSafetyInstructions,
        safetyInstructions: safetyInstructions
      };
      let token = "Bearer " + user_cookie.token;
      await callApi("POST", UPDATEBRANDINFORMATION, params, token)
        .then((res) => {
          // console.log(res);
          // window.location.reload(false);
          const modal = $("#see-information");
          modal.modal("hide");
        })
        .then(async () => {
          const dataUsers = await getAllUserApi("Factory");
          this.props.onGetAllUserAgain(dataUsers.data);
        });
    }
  };

  componentWillMount() { }
  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.itemGas) {
      this.setState({
        id: nextProps.itemGas.id,
        name: nextProps.itemGas.name ? nextProps.itemGas.name : '',
        logo: nextProps.itemGas.logo ? nextProps.itemGas.logo : '',
        phone: nextProps.itemGas.phone ? nextProps.itemGas.phone : '',
        address: nextProps.itemGas.address ? nextProps.itemGas.address : '',
        origin: nextProps.itemGas.origin ? nextProps.itemGas.origin : '',
        mass: nextProps.itemGas.mass ? nextProps.itemGas.mass : '',
        ingredient: nextProps.itemGas.ingredient ? nextProps.itemGas.ingredient : '',
        preservation: nextProps.itemGas.preservation ? nextProps.itemGas.preservation : '',
        appliedStandard: nextProps.itemGas.appliedStandard ? nextProps.itemGas.appliedStandard : '',
        optionSafetyInstructions: nextProps.itemGas.optionSafetyInstructions ? nextProps.itemGas.optionSafetyInstructions : '',
        safetyInstructions: nextProps.itemGas.safetyInstructions ? nextProps.itemGas.safetyInstructions : ''
      })
    }
  }

  render() {
    let {
      name,
      logo,
      address,
      phone,
      origin,
      mass,
      ingredient,
      preservation,
      appliedStandard,
      optionSafetyInstructions,
      safetyInstructions,
    } = this.state;
    return (
      <Col className="container">
        <Col className="modal fade" id="see-information" tabIndex="-1">
          <Col className="modal-dialog modal-lg" style={{height:"600px"}}>
            <Col className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{this.props.t('VIEW_INFO_GAS')}</h5>
                <button type="button" className="close" data-dismiss="modal">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <Col className="modal-body">
                <Form
                  ref={(c) => {
                    this.form = c;
                  }}
                  onSubmit={this.onSubmit}
                >
                  <Row>
                    <Col md={1}></Col>
                    <Col xs={24} md={22}>
                      <div class="form-group">
                        <label for="">{this.props.t('BRANCH')}</label>
                        <div className="div-image">
                          <img src={logo}></img>
                          <div className="button-input">
                            <button type="button" class="btn btn-primary">
                              <Icon type="edit" />
                              {this.props.t('CHANGE')}
                            </button>
                            <input
                              type="file"
                              className="input-file-image"
                              name="logo"
                              onChange={(event) =>
                                this.fileChangedHandler(event)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={1}></Col>
                  </Row>
                  <Row>
                    <Col md={1}></Col>
                    <Col xs={24} md={10}>
                      <div className="form-group">
                        <label for="">{this.props.t('NAME')}</label>
                        <input
                          type="text"
                          className="form-control"
                          id=""
                          name="name"
                          value={name}
                          onChange={this.onChange}
                        />
                      </div>
                    </Col>
                    <Col md={2}></Col>
                    <Col xs={24} md={10}>
                      <div className="form-group">
                        <label for="">{this.props.t('PHONE')}</label>
                        <input
                          type="number"
                          className="form-control"
                          id=""
                          name="phone"
                          value={phone}
                          onChange={this.onChange}
                        />
                      </div>
                    </Col>

                    <Col md={1}></Col>
                  </Row>
                  <Row>
                    <Col md={1}></Col>
                    <Col xs={24} md={10}>
                      <div className="form-group">
                        <label for="">{this.props.t('STANDARD')}</label>
                        <input
                          type="text"
                          className="form-control"
                          id=""
                          name="appliedStandard"
                          value={appliedStandard}
                          onChange={this.onChange}
                        />
                      </div>
                    </Col>
                    <Col md={2}></Col>
                    <Col xs={24} md={10}>
                      <div className="form-group">
                        <label for="">{this.props.t('ORIGIN')}</label>
                        <input
                          type="text"
                          className="form-control"
                          id=""
                          name="origin"
                          value={origin}
                          onChange={this.onChange}
                        />
                      </div>
                    </Col>
                    <Col md={1}></Col>
                  </Row>
                  <Row>
                    <Col md={1}></Col>
                    <Col xs={24} md={22}>
                      <div className="form-group">
                        <label for="">{this.props.t('AREA')}</label>
                        <input
                          type="text"
                          className="form-control"
                          id=""
                          name="address"
                          value={address}
                          onChange={this.onChange}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={1}></Col>


                    <Col xs={24} md={10}>
                      <div className="form-group">
                        <label for="">{this.props.t('WEIGHT_BAG')}</label>
                        <textarea class="form-control"
                          id="mass"
                          rows="3"
                          name="mass"
                          value={mass}
                          onChange={this.onChange}
                        />
                        {/*<input
                          type="number"
                          className="form-control"
                          id=""
                          name="mass"
                          value={mass}
                          onChange={this.onChange}
                        />*/}
                      </div>
                    </Col>
                    <Col md={2}></Col>
                    <Col xs={24} md={10}>
                      <div className="form-group">
                        <label for="">{this.props.t('ELEMENT')}</label>
                        <textarea class="form-control"
                          id="ingredient"
                          rows="3"
                          name="ingredient"
                          value={ingredient}
                          onChange={this.onChange}
                        />
                        {/*<input
                          type="text"
                          className="form-control"
                          id=""
                          name="ingredient"
                          value={ingredient}
                          onChange={this.onChange}
                        />*/}
                      </div>
                    </Col>
                    <Col md={1}></Col>
                  </Row>
                  <Row>
                    <Col md={1}></Col>
                    <Col xs={24} md={10}>
                      <div className="form-group">
                        <label for="">{this.props.t('PRESERVATION')}</label>
                        <textarea class="form-control"
                          id="preservation"
                          rows="3"
                          name="preservation"
                          value={preservation}
                          onChange={this.onChange}
                        />
                        {/*<input
                          type="text"
                          className="form-control"
                          id=""
                          name="preservation"
                          value={preservation}
                          onChange={this.onChange}
                        />*/}
                      </div>
                    </Col>
                    <Col md={2}></Col>
                    <Col xs={24} md={10}>
                      <div className="form-group">
                        <label for="">{this.props.t('SAFE')}</label>
                        <br></br>
                        <select
                          class="form-control"
                          id="optionSafetyInstructions"
                          name="optionSafetyInstructions"
                          style={{ marginBottom: "15px" }}
                          value={optionSafetyInstructions}
                          onChange={this.onChange}>
                          <option value="Yes">{this.props.t('YES')}</option>
                          <option value="No">{this.props.t('NO')}</option>
                        </select>

                        <textarea class="form-control"
                          id="safetyInstructions"
                          rows="3"
                          name="safetyInstructions"
                          value={safetyInstructions}
                          onChange={this.onChange}
                          disabled={optionSafetyInstructions === "No"}
                        />
                      </div>
                    </Col>
                    <Col md={1}></Col>
                  </Row>

                  <footer className="card-footer text-center">
                    <Button className="btn btn-primary">{this.props.t('SAVE')}</Button>
                    <button
                      className="btn btn-secondary"
                      type="reset"
                      data-dismiss="modal"
                      style={{ marginLeft: "10px" }}
                    >
                      {this.props.t('CLOSE')}
                    </button>
                  </footer>
                </Form>
              </Col>
            </Col>
          </Col>
        </Col>
      </Col>
    );
  }
}

export default withNamespaces()(SeeInforItem);
