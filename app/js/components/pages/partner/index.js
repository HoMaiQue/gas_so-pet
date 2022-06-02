import React from 'react';
import PropType from "prop-types";
import Constants from "Constants";
import showToast from "showToast";
import getAllUserApi from "getAllUserApi";
import AddRentalPartner from "./addRentalPartnerPopUp"
import deleteUserAPI from 'deleteUserAPI';
import getUserCookies from 'getUserCookies';
import { GETRENTALPARTNER } from './../../../config/config';
import callApi from './../../../util/apiCaller';
import getListRentalPartnerExcelAPI from "./../../../../api/getListRentalPartnerExcelAPI";
import { withNamespaces } from 'react-i18next';

class RentalPartner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listUsers: [],
            user_type: '',

            userEdit: {
                email: "",
                name: "",
                address: "",
                phone: "",
                code: ""
            },
            isCreateMode: true,
            check: false,
        };
    }

    refresh() {
        this.forceUpdate(async () => {
        let user_cookies = await getUserCookies();
        //console.log(user_cookies.user.id);
        let token = "Bearer " + user_cookies.token;
        let id = user_cookies.user.id;
        this.getAllRentalPartner(id, token);
        });
    };

    handleButtonListExcel = async () => {
        let user_cookies = await getUserCookies();
        let id = user_cookies.user.id;
        await getListRentalPartnerExcelAPI(id);
    }

    async deleteUser(id) {
        const user = await deleteUserAPI(id);

        //console.log('register',user);
        if (user) {
            if (user.status === Constants.HTTP_SUCCESS_BODY) {
                showToast('Xóa Thành Công!', 3000);
                this.refresh();
                return true;
            }
            else {
                showToast(user.data.message ? user.data.message : user.data.err_msg, 2000);
                return false;
            }
        }
        else {
            showToast("Xảy ra lỗi trong quá trình xóa người dùng ");
            return false;
        }
    }
    async editUser(userEdit) {
        await this.setState({ userEdit, isCreateMode: false, check: true });

    }

    async componentDidMount() {
        let user_cookies = await getUserCookies();
        //console.log(user_cookies.user.id);
        let token = "Bearer " + user_cookies.token;
        let id = user_cookies.user.id;
        this.setState({ user_type: user_cookies.user.userType });
        this.getAllRentalPartner(id, token);
    }

    async getAllRentalPartner(id, token) {
        //const jobMetaData = await this.getJobMetaData();
        let params = {
            "id": id
        };

        await callApi("POST", GETRENTALPARTNER, params, token).then(res => {
             //console.log("rent partner", res.data); 
            if (res.data) {
                if (res.data.status === true) {
                  this.setState({ listUsers: res.data.data });
                } 
                else {
                  showToast(
                    res.data.message
                      ? res.data.message
                      : res.data.err_msg,
                    2000
                  );
                  return false;
                }
            } 
            else {
                showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
            }    
        })
    }
    
    addUser = async () => {
        await this.setState({
            // editUser:{
            //     email:"",
            //     name:"",
            //     address:""
            // },
            isCreateMode: true
        })
        await this.setState({
            userEdit: null,
            check: false,
        })

    }
    render() {

        return (
            <div className="main-content">
                <div className="card">
                    <div className="card-title">
                        <div className="flexbox">
                            <h4> {this.props.t('PARTNER_HIRE')} </h4>
                            <div className="row">
                                <button
                                    style={{ marginLeft: "20px" }}
                                    className="btn btn-sm btn-success"
                                    data-toggle="modal"
                                    onClick={() => this.handleButtonListExcel()}
                                >
                                    {this.props.t('EXPORT_EXCEL')}
                                </button>
                                <button onClick={this.addUser} style={{ marginLeft: '20px' }} className="btn btn-sm btn-create" data-toggle="modal"
                                    data-target="#create-user"> {this.props.t('CREATE_PARTNER_HIRE')}
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
                                            cellSpacing="0">
                                            <thead className="table__head">
                                                <tr>
                                                    <th className="text-center w-50px align-middle">{this.props.t('ID_NUMBER')}</th>
                                                    {/*<th className="w-120px text-center align-middle">Mã </th>*/}
                                                    <th className="w-120px text-center align-middle">{this.props.t('EMAIL')}</th>
                                                    <th className="w-120px text-center align-middle">{this.props.t('NAME_HIRING')}</th>
                                                    <th className="w-150px text-center align-middle">{this.props.t('ADDRESS')}</th>
                                                    <th className="w-70px text-center align-middle"> {this.props.t('PHONE')} </th>
                                                    <th className="w-60px text-center align-middle">{this.props.t('HIRING_CODE')}</th>
                                                    <th className="w-100px text-center align-middle">{this.props.t('ACTION')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.listUsers.map((store, index) => {
                                                    return (<tr key={index}>
                                                        <td scope="row" className="text-center">{index + 1}</td>

                                                        {/*<td scope="row" className="text-center">{store.id}</td>*/}
                                                        <td scope="row" className="text-center">{store.email}</td>
                                                        <td scope="row" className="text-center">{store.name}</td>
                                                        <td scope="row" className="text-center">{store.address}</td>
                                                        <td scope="row" className="text-center">{store.phone}</td>
                                                        <td scope="row" className="text-center">{store.rentalPartnerCode}</td>
                                                        <td className="text-center table-actions">
                                                            {this.state.user_type === 'SuperAdmin' && (

                                                                <a className="table-action hover-primary" data-toggle="modal" data-target="#view-report"
                                                                    onClick={() => { this.deleteUser(store.id) }}>
                                                                    <i className="ti-trash"></i></a>

                                                            )
                                                            }
                                                            <a className="table-action hover-primary" data-toggle="modal" data-target="#create-user"
                                                                onClick={() => { this.editUser(store) }}>
                                                                <i className="ti-pencil"></i></a>
                                                        </td>

                                                        {/*<td>{this.props.itemStore.name}</td>
                                                    <td>{this.props.itemStore.address}</td>
                                                    <td>{this.props.itemStore.address}, {this.props.itemStore.ward_name}, {this.props.itemStore.district_name}, {this.props.city_name} </td>
                                                    <td>{this.props.itemStore.job_title_names.map((title) => {
                                                    return title + " ";
                                                    })}</td>*/}
                                                        {/*     <td className="text-center table-actions">

                                                        <a className="table-action hover-primary" data-toggle="modal" data-target="#view-report"
                                                           onClick={()=>{this.setState({content:store.description,user:store.user?store.user.name:'',cylinder:store.cylinder?store.cylinder.serial:''})}}>
                                                            <i className="ti-eye"></i></a>

                                                    </td>*/}
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
                <AddRentalPartner
                    isCreateMode={this.state.isCreateMode}
                    userEdit={this.state.userEdit}
                    listUsers={this.state.listUsers}
                    check={this.state.check}
                    refresh={()=>this.refresh()}
                />

            </div>
        );
    }
}

export default withNamespaces()(RentalPartner);
