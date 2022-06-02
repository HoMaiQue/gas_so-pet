import React, { Component } from 'react';
import PropType from "prop-types";
import Constants from "Constants";
import showToast from "showToast";
import getAllUserApi from "getAllUserApi";
import AddCar from "./FormCar"
import deleteUserAPI from 'deleteUserAPI';
import getUserCookies from 'getUserCookies';
import { GETTRUCK } from './../../../config/config';
import callApi from './../../../util/apiCaller';
import getListTruckExcelAPI from "./../../../../api/getListTruckExcelAPI";
import { withNamespaces } from 'react-i18next';

class Car extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listUsers: [],
            user_type: '',
            userId: '',
            userEdit: {
                license_plate: "",
                load_capacity: "",
               
            },
            isCreateMode: true,
            check: false,
        };
    }

    refresh() {
        this.forceUpdate(async () => {
            await this.getAllUser();
            //this.setState({userEdit:{}});
        });
    };

    handleButtonListExcel = async () => {
        let user_cookies = await getUserCookies();
        let id = user_cookies.user.id;
        await getListTruckExcelAPI(id);
    }

    async deleteUser(id) {
        const user = await deleteUserAPI(id);
        if (user) {
            if (user.status === Constants.HTTP_SUCCESS_BODY) {
                showToast(this.props.t('DELETE_SUCCESS'), 3000);
                return true;
            } else {
                showToast(user.data.message ? user.data.message : user.data.err_msg, 2000);
                return false;
            }
        } else {
            showToast(this.props.t('ERROR_DELETE_CAR'));
            return false;
        }
    }

    async editUser(userEdit) {
        await this.setState({ userEdit, isCreateMode: false }, () => {
            this.setState({
                check: true,
            })
        });
    }

    async componentDidMount() {
        let user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;
        let id = user_cookies.user.id;
        await this.setState({ userId: user_cookies.user.userId, user_type: user_cookies.user.userType });
        await this.getAllCar(id, token);
    }

    // addUser = async () => {
    //     await this.setState({
    //         isCreateMode: true
    //     })
    //     await this.setState({
    //         userEdit: null,
    //         check: false,
    //     })
    // }

    async getAllCar(id, token) {
        console.log('id', id)
        let param = {
            "id": id
        };
        await callApi("POST", GETTRUCK, param, token).then(res => {
            if (res.data) {
                if (res.data.success === true) {
                    this.setState({
                        listUsers: res.data.data
                    })
                }
                else {
                    showToast(
                        res.data.message
                        ? res.data.message
                        : "Lỗi sai dữ liệu",
                        2000
                    )
                }
            }
            else {
                showToast("Xảy ra lỗi trong quá trình lấy dữ liệu", 1000);
            }
             console.log("response car", res.data)
        })
    }

    addUser = async () => {
        await this.setState({
            isCreateMode: true,
            check: false
        })
        await this.setState({
            userEdit: null
        })
    }

    render() {
        let {listUsers} = this.state;
        return (
            <div className="main-content">
                <div className="card">
                    <div className="card-title">
                        <div className="flexbox">
                            <h4>{this.props.t('CAR')}</h4>
                            <div className="row">
                                <button
                                    style={{ marginLeft: "20px" }}
                                    className="btn btn-sm btn-success"
                                    data-toggle="modal"
                                    onClick={() => this.handleButtonListExcel()}
                                >
                                    {this.props.t('EXPORT_EXCEL')}
                                </button>
                                <button onClick={this.addUser} style={{ marginLeft: '20px' }}
                                    className="btn btn-sm btn-create" data-toggle="modal"
                                    data-target="#create-user">{this.props.t('CREATE_CAR')}</button>
                            </div>
                        </div>
                    </div>

                    <div className="card-body">
                        <div className="table-responsive-xl">
                            <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <table className="table table-striped table-bordered seednet-table-keep-column-width"
                                            cellSpacing="0" >
                                            <thead className="table__head">
                                                <tr>
                                                    <th className="text-center w-70px">{this.props.t('ID_NUMBER')}</th>
                                                    <th className="w-120px text-center">{this.props.t('LICENSE_PLATE')}</th>
                                                    <th className="w-120px text-center">{this.props.t('CAR_WEIGHT')}</th>
                                                    <th className="w-100px text-center">{this.props.t('ACTION')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {listUsers.map((store, index) => {
                                                    return (<tr key={index}>
                                                        <td scope="row" className="text-center">{index + 1}</td>
                                                        <td scope="row" className="text-center">{store.license_plate}</td>
                                                        <td scope="row" className="text-center">{store.load_capacity}</td>

                                                        <td className="text-center table-actions">
                                                            {this.state.user_type === 'Factory' && (
                                                                <a className="table-action hover-primary" data-toggle="modal" data-target="#view-report"
                                                                    onClick={() => { this.deleteUser(store.id) }}>
                                                                    <i className="ti-trash"></i> </a>
                                                            )}
                                                            <a className="table-action hover-primary" data-toggle="modal" data-target="#create-user"
                                                                onClick={() => { this.editUser(store) }}
                                                            ><i className="ti-pencil"></i></a>
                                                        </td>
                                                    </tr>)
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <AddCar
                 isCreateMode={this.state.isCreateMode}
                    userEdit={this.state.userEdit}
                    listUsers={this.state.listUsers}
                    check={this.state.check}
                />
            </div>
        );
    }
}

export default withNamespaces()(Car);

