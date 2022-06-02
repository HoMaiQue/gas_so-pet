import React from "react";
import PropType from "prop-types";
import Constants from "Constants";
import showToast from "showToast";
import getAllUserApi from "getAllUserApi";
import AddUserPopupContainer from "../user/AddUserPopupContainer";
import deleteUserAPI from "./../../../../api/userRemoveUser";
import getUserCookies from "getUserCookies";
import getListBranchAPI from "./../../../../api/getListBranchAPI";
import getListCustomerExcelAPI from "./../../../../api/getListCustomerExcelAPI";
import Modal from "./Modal";
import callApi from '../../../util/apiCaller';
import { GETTYPECUSTOMER } from '../../../config/config';
import  "./Industry.css";
import {withNamespaces} from 'react-i18next';
import { Tooltip } from "antd";
class Industry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listUsers: [],
            listBrand: [],
            listUsersBackUp: [],
            user_type: "",
            userEdit: {},
            isCreateMode: true,
            isCreateThanhtra: true,
            customerId: '',
            isLoading: false,
        };
    }

    refresh() {
        this.forceUpdate(async () => {
            // await this.getAllUser();
            //this.setState({userEdit:{}});
            let user_cookies = await getUserCookies();
            let token = "Bearer " + user_cookies.token;
            let id = user_cookies.user.id;
            this.setState({ user_type: user_cookies.user.userType });
            //this.getAllUser();
            await this.getIndustryCustomer(id, token);
        });
    }

    Xoa_Dau_VN(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        return str;
      }
    
    onSubmit = (e) => {
        // console.log("vao onSubmit");
        e.preventDefault();
        //console.log(e.target);
        var input = document.getElementById("inputText").value;
        var select = document.getElementById("inlineSelect").value;
        if (input.length == 0)
            alert("Vui lòng nhập vào ?");
        else if (select == 0)
            alert("vui lòng chọn loại tìm kiếm!")
        else {

            //email name customerCode 
            if (select == 1) {
            // console.log(" vao email");
            const temp = this.state.listUsersBackUp.filter(item => {
                var index = item.email.indexOf("@");
                var name = item.email.substring(0, index);
                // console.log(name);
                return name.includes(input)
            });
            // console.log("temp ", temp);
            if (temp.length === 0)
                alert(`Khong tim thay email: ${input} `)
            else {
                this.setState({ listUsers: temp })
            }
            }
            else if (select == 2) {
                // console.log(" vao name");
                const temp = this.state.listUsersBackUp.filter(item => {
                    var nameFix = this.Xoa_Dau_VN(item.name).toLowerCase();
                    var inputfix = this.Xoa_Dau_VN(input).toLowerCase();
                    //console.log("nameFix",nameFix);
                    return nameFix.includes(inputfix);
                })

            if (temp.length == 0)
                alert(`Khong tim thay ten  : ${input} `)
            else {
                this.setState({ listUsers: temp })
            }
            }
            else if (select == 3) {
            // console.log(" vao customerCode");
            const temp = this.state.listUsersBackUp.filter(item => {
                if(item.hasOwnProperty('customerCode'))
                {
                    var inputfix = this.Xoa_Dau_VN(input).toLowerCase();
                    var customerCodeFix = this.Xoa_Dau_VN(item.customerCode).toLowerCase();;
                    return  customerCodeFix.includes(inputfix);
                }
            });
            //console.log("index ", index);
            if (temp.length == 0)
                alert(`Khong tim thay ma : ${input} `)
            else {
                this.setState({ listUsers: temp })
            }
            }
        }
        }
    
    onChange = (e) => {
        // console.log("vao onchange");
        // console.log(this.state.listUsersBackUp);
        // console.log(e.target.value.length);
        if (e.target.value.length === 0) {
            this.setState({ listUsers: this.state.listUsersBackUp })
        }
    }
    
    getListBr = async (id) => {
        // console.log(" vao getlistbr");
        // console.log("id ", id);
        this.setState({ isLoading: true })
        const dataApi = await getListBranchAPI(id);
        // console.log("data", dataApi.data.data);
        

        if (dataApi.data.success) {
            let temp = [];
            let i = 0;
            for (let item of dataApi.data.data) {
                temp.push({
                    key: i,
                    agencyId: item.id ? item.id : '',
                    agencyCode: item.agencyCode ? item.agencyCode : '',
                    agencyName: item.name ? item.name : '',
                    email: item.email ? item.email : '',
                    address: item.address ? item.address : '',
                });
                i++;
            }

            // this.setState({ listBrand: dataApi.data.data })
            this.setState({
                listBrand: temp,
                isLoading: false
            })
        }
        else {
            this.setState({
                listBrand: [],
                isLoading: false
            })
        }
        
    }

    async deleteUser(id) {
        var answer = window.confirm("Bạn có chắc chắn muốn xóa");
        if (answer) {
            const user = await deleteUserAPI(id);

            //console.log('register',user);
            if (user) {
                if (user.status === Constants.HTTP_SUCCESS_BODY) {
                    showToast("Xóa Thành Công!", 3000);
                    this.refresh();
                    return true;
                } else {
                    showToast(
                        user.data.message ? user.data.message : user.data.err_msg,
                        2000
                    );
                    return false;
                }
            } else {
                showToast("Xảy ra lỗi trong quá trình xóa người dùng ");
                return false;
            }
        }
    }

    async editUser(userEdit) {
        await this.setState({ userEdit }),
            await this.setState({
                isCreateMode: false
            })
    }

    async componentDidMount() {
        let user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;
        let id = user_cookies.user.id;
        this.setState({ user_type: user_cookies.user.userType });
        //this.getAllUser();
        await this.getIndustryCustomer(id, token);
    }

    async getIndustryCustomer(id, token) {
        let reqListCustomer = {
            isChildOf: id,
            customerType: "Industry"
        };
        let params = {
            reqListCustomer
        };
        await callApi("POST", GETTYPECUSTOMER, params, token).then(res => {
            // console.log("khach hang cong nghiep", res.data);
            if (res.data) {
                if (res.data.success === true) {
                    this.setState({
                        listUsers: res.data.data,
                        listUsersBackUp: res.data.data
                    });
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
        });
    }

    // async getAllUser() {
    //     //const jobMetaData = await this.getJobMetaData();
    //     // Sửa lại API get lấy đúng
    //     const dataUsers = await getAllUserApi(Constants.GENERAL);
    //     if (dataUsers) {
    //         if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
    //             this.setState({ listUsers: dataUsers.data });
    //         } else {
    //             showToast(
    //                 dataUsers.data.message
    //                     ? dataUsers.data.message
    //                     : dataUsers.data.err_msg,
    //                 2000
    //             );
    //         }
    //         //this.setState({image_link: profile.data.company_logo});
    //     } else {
    //         showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    //     }
    // }

    handleButtonListExcel = async () => {
        let user_cookies = await getUserCookies();
        let id = user_cookies.user.id;
        let customerType = "Industry";
        await getListCustomerExcelAPI(id, customerType);
      }

    newTable = async () => {
        await this.setState({
            userEdit: null,
            isCreateMode: true
        });
    }

    render() {
        return (
            <div className="main-content">
                <div className="card">
                    <div className="card-title">                        
                        <div className="flexbox">
                            <h4>{this.props.t('INDUSTRIAL_CUSTOMERS')}</h4>
                            <form className="form-inline" onSubmit={e => this.onSubmit(e)}>
                                <div className="form-group mb-2">
                                <select className="custom-select mr-sm-2" id="inlineSelect">
                                    <option selected value={0}>{this.props.t('PLZ_CHOOSE')}</option>
                                    <option value={1}>{this.props.t('EMAIL')}</option>
                                    <option value={2}>{this.props.t('CUSTOMER')}</option>
                                    <option value={3}>{this.props.t('CUSTOMER_ID')}</option>
                                </select>

                                </div>
                                <div className="form-group mx-sm-3 mb-2">
                                <input type="text" className="form-control" id="inputText" placeholder={this.props.t('INPUT_VALUE')}
                                    onChange={e => { this.onChange(e) }}
                                />
                                </div>
                                <button
                                    type="submit" 
                                    className="btn btn-primary mb-2"
                                >
                                    {this.props.t('SEARCH')}
                                </button>
                            </form>
                            <div className="row">
                                <button
                                    style={{ marginLeft: "20px", height: "40px" }}
                                    className="btn btn-sm btn-success"
                                    data-toggle="modal"
                                    onClick={() => this.handleButtonListExcel()}
                                >
                                    {this.props.t('EXCEL')}
                                </button>
                                <button
                                    onClick={
                                        // this.setState({ userEdit: {}, isCreateMode: true })
                                        this.newTable
                                    }
                                    style={{ marginLeft: "5px", height: "40px" }}
                                    className="btn btn-sm btn-create"
                                    data-toggle="modal"
                                    data-target="#create-user"
                                >
                                    {this.props.t('CREATE_INDUSTRIAL_CUSTOMERS')}
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
                                            cellSpacing="0"
                                        >
                                            <thead className="table__head">
                                                <tr>
                                                    <th className="text-center w-60px align-middle">{this.props.t('ID_NUMBER')}</th>
                                                    <th className="w-150px text-center align-middle">{this.props.t('CUSTOMER_ID')}</th>
                                                    <th className="w-150px text-center align-middle">{this.props.t('EMAIL')}</th>
                                                    <th className="w-120px text-center align-middle">{this.props.t('INDUSTRIAL_CUSTOMERS_NAME')}</th>
                                                    <th className="w-200px text-center align-middle">{this.props.t('ADDRESS_EXPORT_ORDER')}</th>
                                                    <th className="w-120px text-center align-middle">{this.props.t('CUSTOMER_GROUP')}</th>
                                                    <th className="w-100px text-center align-middle">{this.props.t('ACTION')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.listUsers.map((store, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td scope="row" className="text-center">
                                                                {index + 1}
                                                            </td>

                                                            {/*<td scope="row" className="text-center">{store.id}</td>*/}
                                                            <td scope="row" className="text-center">
                                                                {store.customerCode}
                                                            </td>
                                                            <td scope="row" className="text-center">
                                                                {store.email}
                                                            </td>
                                                            <td scope="row" className="text-center">
                                                                {store.name}
                                                            </td>
                                                            <td scope="row" className="text-center">
                                                                {store.invoiceAddress}
                                                            </td>
                                                            <td scope="row" className="text-center">
                                                                {
                                                                    store.groupCustomer === '01'
                                                                        ? 'Nhóm 1.5'
                                                                        : store.groupCustomer === '02'
                                                                            ? 'Nhóm thực tế'
                                                                            : store.groupCustomer === '03'
                                                                                ? 'Nhóm 0.6'
                                                                                : store.groupCustomer === '04'
                                                                                    ? 'Nhóm 1.5 thực tế'
                                                                                    : store.groupCustomer === '05'
                                                                                        ? 'Nhóm 0.2'
                                                                                        : store.groupCustomer === '06'
                                                                                            ? 'Nhóm không tính'
                                                                                            : store.groupCustomer === '07'
                                                                                                ? 'Nhóm 0.4'
                                                                                                : store.groupCustomer
                                                                }
                                                            </td>
                                                            <td className="text-center table-actions">
                                                                {/* {this.state.user_type === "Factory" && (
                                                                    <Tooltip title={this.props.t("DELETE")}>
                                                                      <a
                                                                          className="table-action hover-primary"
                                                                          data-toggle="modal"
                                                                          data-target="#view-report"
                                                                          onClick={() => {
                                                                              this.deleteUser(store.id);
                                                                          }}
                                                                      >
                                                                          <i className="ti-trash"></i>
                                                                      </a>
                                                                    </Tooltip>
                                                                )} */}
                                                                <Tooltip title={this.props.t("EDIT_INFO")}>
                                                                <a
                                                                    className="table-action hover-primary"
                                                                    data-toggle="modal"
                                                                    data-target="#create-user"
                                                                    onClick={() => {
                                                                        this.editUser(store);
                                                                    }}
                                                                >
                                                                    <i className="ti-pencil"></i>
                                                                </a>
                                                                </Tooltip>
                                                                <Tooltip title={this.props.t("SHOW_INFO")}>
                                                                <a className="table-action hover-primary"
                                                                    data-toggle="modal"
                                                                    // data-target={`#${store.id}`}
                                                                    data-target="#list_branch_modal"
                                                                    onClick={() => {
                                                                        this.setState({ customerId: store.id })
                                                                        this.getListBr(store.id)
                                                                    }}
                                                                >
                                                                    <i className="ti-info-alt"></i>
                                                                </a>
                                                                </Tooltip>
                                                                <Modal
                                                                    // id={store.id}
                                                                    customerId={this.state.customerId}
                                                                    listBrand={this.state.listBrand}
                                                                    isLoading={this.state.isLoading}
                                                                />
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
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <AddUserPopupContainer
                    isCreateMode={this.state.isCreateMode}
                    isEditForm={this.state.userEdit}
                    isIndustryPage={true}
                    refresh={this.refresh.bind(this)}
                />
            </div>
        );
    }
}

export default withNamespaces()(Industry) ;