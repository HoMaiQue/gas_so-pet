import React, { Component } from 'react';
import PropType from 'prop-types';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import Button from 'react-validation/build/button';
import required from 'required';
import isUppercase from 'isUppercase';
import {withNamespaces}from 'react-i18next';
// import getUserCookies from 'getUserCookies';

// import getUserCookies from "./../../../helpers/getUserCookies";
import getUserCookies from "./../../../helpers/getUserCookies";
import callApi from "./../../../util/apiCaller";
import { ADDTRUCK, UPDATETRUCK } from './../../../config/config'
// import { ADDTRUCK, UPDATETRUCK } from './../../../config/config';
import getAllUserApi from "getAllUserApi";
import Constants from "Constants";
import showToast from "showToast";
import { forEach } from 'lodash';




const USERTYPE_ENUM = [
    // {
    //     key: 'SuperAdmin',
    //     value: 'Quản trị viên'
    // },
    // {
    //     key: 'Staff',
    //     value: 'Nhân viên'
    // },
]
class AddCar extends React.Component {

    constructor(props) {
        super(props);
        this.form = null;
        this.state = {
            visible: false,
            license_plate: "",
            load_capacity: "",
            // password: "Abc123",
            // userType: "Deliver",
            id: '',
            userId: "",
            listUsers: [],
            listTruck: [],
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    };
    onChange = (e) => {
        let target = e.target;
        let name = target.name;
        let value = target.value;
        this.setState({
            [name]: value
        })
    }

    async submit(event) {
        event.preventDefault();
        var user_cookies = await getUserCookies();

        let token = "Bearer " + user_cookies.token;
        // console.log('tokem', token)
        let { license_plate, load_capacity, userId, userType, id } = this.state;
        if (this.props.isCreateMode) {
            if (this.state.listTruck.includes(license_plate) === false) {
              let isChildOf = user_cookies.user.id;
              let userTypeAsRoleType = user_cookies.user.userId;

              let params = {
                  userId: isChildOf,
                  license_plate: license_plate,
                  load_capacity: load_capacity,
              };

              await callApi("POST", ADDTRUCK, params, token).then((res) => {
                  alert("Tạo thành công");
                //   window.location.reload(false);
                  const modal = $("#create-user");
                  modal.modal("hide");
              })} else alert("Trùng biển số xe");
        } else {               
            let params1 = {};
            params1 = {
                truckId: id,
                license_plate: license_plate,
                load_capacity: load_capacity
            };
            // console.log("goi update truck", params1);
            await callApi("POST", UPDATETRUCK, params1, token).then((res) => {
                // console.log('res update xe', res)
                // window.location.reload(false);
            })
        }

    }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
        // console.log(this.props.check)
        if (nextProps && nextProps.userEdit && nextProps.listUsers) {
            this.setState({
                license_plate: nextProps.userEdit.license_plate,
                load_capacity: nextProps.userEdit.load_capacity,
                id: nextProps.userEdit.id,
            })
        }
        else {
            this.setState({
                license_plate: "",
                load_capacity: "",
            })
        }
    }

    componentDidUpdate(prevProps) {
      if (this.props.listUsers !== prevProps.listUsers) {
        this.setState({
          listTruck: this.props.listUsers.map(x => x.license_plate)
        })
      }
    }

    render() {
        let { load_capacity, license_plate, addressHD, addressGH, idName, idBranch, nameBranch, lat, lng } = this.state;
        return (
            <div className="modal fade" id="create-user" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {this.props.isCreateMode ? this.props.t('CREATE_CAR'): "Chỉnh sửa thông tin xe"}
                            </h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body">
                            <Form ref={c => {
                                this.form = c
                            }}
                                className="card" onSubmit={(event) => { this.submit(event) }} >
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>{this.props.t('LICENSE')}</label>
                                                <Input className="form-control"
                                                    // disabled={this.props.check}
                                                    type="text" name="license_plate" id="license_plate"
                                                    onChange={this.onChange}
                                                    value={license_plate}
                                                    validations={[required, isUppercase]}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>{this.props.t('VEHICLE')}</label>
                                                <Input className="form-control" type="text" name="load_capacity"
                                                    id="load_capacity" onChange={this.onChange} value={load_capacity} validations={[required, isUppercase]} />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <footer className="card-footer text-center">
                                    <Button className="btn btn-primary" id="button">
                                        {this.props.t('SAVE')}
                  </Button>
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
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withNamespaces()(AddCar) ;