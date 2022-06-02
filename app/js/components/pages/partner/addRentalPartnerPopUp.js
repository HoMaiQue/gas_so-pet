import React from 'react';
import PropType from 'prop-types';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import Button from 'react-validation/build/button';
import required from 'required';
import isUppercase from 'isUppercase';

import getUserCookies from "./../../../helpers/getUserCookies";
import callApi from './../../../util/apiCaller';
import { ADDRENTALPARTNER, UPDATEUSERURL } from './../../../config/config';
import rentalPartnersUpdateRentalPartners from './../../../../api/rentalPartnersUpdateRentalPartners'
import getAllUserApi from "getAllUserApi";
import Constants from "Constants";
import showToast from "showToast";
import {withNamespaces} from 'react-i18next';
import { result } from 'lodash';
// import axios from './axios'

class AddRentalPartner extends React.Component {

    constructor(props) {
        super(props);

        this.form = null;
        this.state = {
            email: "",
            name: "",
            code: "",
            address: "",
            phone: "",
            userId: "",

            listUsers: [],
            value: {
                password: "",
                email: ""
            },
            errors: {
                password: "",
                email: ""
            },
            formValid: false,
            newpassword: false,
            newemail: false,
        };
    }

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
        let { email, name, address, phone, code, userId } = this.state;

        //  Chi so sanh email trong tai khoan hien tai
        //  Can kiem tra email thanh tra so voi tat ca tai khoan user
        /*if (email != getalluser.email) {
            let index = this.state.listUsers.findIndex((l) => l.email === email);
        }*/

       
        var lsur = this.state.listUsers;
        if (this.props.isCreateMode===true) {

                userId = user_cookies.user.id;
                let params = {
                    name: name,
                    email: email,
                    phone: phone,
                    address: address,
                    rentalPartnerCode: code,
                    userId: userId
                };
                await callApi("POST", ADDRENTALPARTNER, params, token).then((res) => {
                    if (res.data.message === "Email da ton tai") {
                        alert("Email này đã tạo tài khoản rồi. Mời bạn nhập lại");
                    } 
                    else {
                        alert("Tạo thành công");
                        // window.location.reload(false);
                        this.props.refresh();
                        console.log("listUsers",this.props.listUsers);
                        const modal = $("#create-user");
                        modal.modal("hide");
                      }
                });
            

        }else {
            let data = this.form.getValues();
            let targetId = this.props.userEdit.id;
             console.log("dataNha",this.props.userEdit)
            // console.log("dataNha",data);
            let result=false; 
            result= await rentalPartnersUpdateRentalPartners(
                targetId,
                data.name,
                data.phone,
                data.address,
                data.code,
                // data.newPassword
            );
            if (result) {
                this.props.refresh();
                const modal = $("#create-user");
                modal.modal("hide");
         }
        } 
        // else {
        //     //  Update thong tin thanh tra
        //     let params1 = {};
        //     if (password === "") {
        //         params1 = {
        //             target_id: id,
        //             name: name,
        //             address: address,
        //             code: code
        //         };
        //     } else {
        //         params1 = {
        //             target_id: id,
        //             name: name,
        //             new_password: password,
        //             address: address,
        //             code: code
        //         };
        //     }
        //     await callApi("POST", UPDATEUSERURL, params1, token).then((res) => {
        //         window.location.reload(false);
        //     });
        // }
        //console.log(user_cookies);
    }
    componentDidMount() {
        // console.log(this.props.check, 'fgdf')
    }
    componentWillReceiveProps(nextProps) {
        // console.log(this.props.check)
        if (nextProps && nextProps.userEdit && nextProps.listUsers && nextProps.check==true) {
            this.setState({
                email: nextProps.userEdit.email,
                name: nextProps.userEdit.name,
                address: nextProps.userEdit.address,
                code: nextProps.userEdit.rentalPartnerCode,
                id: nextProps.userEdit.id,
                phone: nextProps.userEdit.phone
            })
        }
        else {
            this.setState({
                email: "",
                name: "",
                address: "",
                code: "",
                phone: ""
                // check: true,
            })
        }

    }

    handleErrorEmail = e => {
        let { name, value } = e.target;
        let { newemail } = this.state;
        let message = value === "" ? "Xin Vui lòng nhập vô đây" : "";
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        newemail = message === "" ? true : false;
        if (value === "") {
            message = '';
        }
        else if (!filter.test(email.value)) {
            message = ('định dạng email không đúng và yêu cầu nhập lại.');
            // email.focus;
            document.getElementById("button").disabled = true;
            newemail = false
        }
        else {
            message = ('');
            document.getElementById("button").disabled = false,
                newemail = true;
        }
        this.setState({
            errors: { ...this.state.errors, [name]: message },
            newemail,
        }, () => {
            // this.FormValidation();
        })
    }
    handleErrors = e => {
        let { name, value } = e.target;
        let message = value === "" ? "Xin vui lòng nhập vô đây" : "";
        let { newpassword } = this.state;
        var pattern = new RegExp(
            "^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" +
            "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" +
            "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$"
        );
        var number = /^[0-9]+$/;

        newpassword = message === "" ? true : false;
        if (value && (value.length < 6 && value.match(pattern) && value.match(number))) {
            message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt"
            newpassword = false;

        } else if (value && value.match(number)) {

            message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt"

            newpassword = true;

        } else if (value && value.match(pattern)) {
            message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt"

            newpassword = true;
        } else if (value && value.length < 6) {
            message = "mật khẩu phải có ít nhất 6 kí tự bao gồm cả chữ và số hoặc kí tự đặc biệt"

            newpassword = true;
        }

        this.setState({
            errors: { ...this.state.errors, [name]: message },
            newpassword,

        }, () => {
            this.FormValidation();

        })
    }

    FormValidation = () => {
        this.setState({
            formValid: this.state.newpassword
        })
    }
    render() {
        //console.log(this.props.userEdit);
        let { email, name, address, code, phone } = this.state;
        return (
            <div className="modal fade" id="create-user" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {this.props.isCreateMode ? this.props.t('CREATE_NEW_RENTAL_PARTNER') : this.props.t('EDIT_INFO_RENTAL_PARTNER')}
                            </h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <Form ref={c => {
                                this.form = c
                            }}
                                className="card" onSubmit={(event) => this.submit(event)}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">

                                            <div className="form-group">
                                                <label>{this.props.t('EMAIL_ADDRESS')}</label>
                                                <Input className="form-control"
                                                    disabled={this.props.check}
                                                    type="text" name="email" id="email" onChange={this.onChange}
                                                    value={email} validations={[required, isUppercase]}
                                                    onBlur={this.handleErrorEmail}
                                                    onKeyUp={this.handleErrorEmail}
                                                />
                                                {this.state.errors.email === "" ? "" : (<div className="alert alert-danger">{this.state.errors.email}</div>)}

                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>{this.props.t('NAME_HIRING')}</label>
                                                <Input className="form-control" type="text" name="name" id="name" onChange={this.onChange}
                                                    value={name} validations={[required]} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>{this.props.t('HIRING_CODE')}</label>
                                                <Input className="form-control" type="text" name="code" id="code" onChange={this.onChange}
                                                    value={code} validations={[required]} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>{this.props.t('ADDRESS')}</label>
                                                <Input className="form-control" type="text" name="address" id="address" onChange={this.onChange}
                                                    value={address} validations={[required]} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>{this.props.t('PHONE')}</label>
                                                <Input className="form-control" type="number" name="phone" id="phone" onChange={this.onChange}
                                                    value={phone} validations={[required]} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <footer className="card-footer text-center">
                                    <Button className="btn btn-primary" id="button">{this.props.t('SAVE')}</Button>
                                    <button className="btn btn-secondary" type="reset" data-dismiss="modal"
                                        style={{ marginLeft: "10px" }}>{this.props.t('CLOSE')}
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

export default withNamespaces()(AddRentalPartner) ;
