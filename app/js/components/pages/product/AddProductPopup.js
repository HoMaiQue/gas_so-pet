import React from 'react';
import PropType from 'prop-types';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import Select2 from 'react-select';
import Button from 'react-validation/build/button';
import required from 'required';
import showToast from "showToast";
import getUserCookies from "getUserCookies";
import { Radio } from 'antd';
import getDestinationUserAPI from 'getDestinationUserAPI';
import getListFixerPartnerApi from "getListFixerPartner";
import Constants from "Constants";
// import getAllUserApi from "getAllUserApi";
import getAllPartnerAPI from "getPartnerAPI";
import getAllFactoryAPI from "getAllFactoryAPI";
import { GETRENTALPARTNER } from './../../../config/config';
import { GETLISTMANUFACTURE } from './../../../config/config';
import callApi from './../../../util/apiCaller';
import './product.scss'
import {withNamespaces} from 'react-i18next';
import moment from "moment";

class AddProductPopup extends React.Component {

    constructor(props) {
        super(props);
        this.form = null;
        this.options = [];
        this.state = {
            cylinderType: '',
            color: '',
            valve: '',
            weight: '',
            checkedDate: '',
            status: '',
            emptyOrFull: '',
            currentImportPrice: '',
            usingType: '00',
            optionUsingType: [],
            user_type: '',
            user_role: '',
            checkCongtyCon: 1,
            value: 1,
            listconttycon: '',
            activePage: 1,
            options: [],
            options2: [],
            doitac: '',
            factoryy: '',
            listUserFixer: [],
            listPartner: [],
            rentalPartner: '',
            manufacture: "",
            listManufacturers: [],
            statusHideSelect: false
        };
    }

    /*handleCharacter = (e) => {
        if (e.keyCode === 69 || e.keyCode === 107 || e.keyCode === 109) {
            e.preventDefault();
        }
        let target = e.target;
        let name = target.name;
        let value = target.value;
        this.setState({
            [name]: value
        });
    }*/

    handleChangeManufacture = (langValue) => {
        this.setState({
            manufacture: langValue
        })
    }

    onradioChange = e => {
        e.preventDefault();
        this.setState({
            factoryy: e.target.value,
            listconttycon: e.target.value,
            doitac: e.target.value
        })
    }

    // Hàm radio cho thương nhân sở hữu
    onChangeRadioUsingType = e => {
        e.preventDefault();
        this.setState({
            rentalPartner: e.target.value
        })
    }

    // Hàm radio cho kho trực thuộc
    onChangeRadioUsingType1 = langValue => {
        this.setState({
            rentalPartner: langValue
        })
    }

    // Hàm select cho thương nhân sở hữu
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

    // Hàm select cho kho trực thuộc
    onChangeUsingType1 = async e => {
        e.preventDefault();
        await this.setState({
            usingType: e.target.value,
        });
        if (e.target.value === "00") {
            this.setState({statusHideSelect:false})
        }
        else {
            this.setState({statusHideSelect:true})
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
            // console.log("thue vo CTC ne", res.data);
        })
        
        // console.log("thue vo CTC ne1", this.state.listPartner);
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
                showToast(
                    this.state.listPartner.data.message 
                    ? this.state.listPartner.data.message 
                    : this.state.listPartner.data.err_msg, 2000
                );
            }
        } 
        else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }
    }

    onChangeCurrent = async e => {
        // console.log('radio checked', e.target.value);
        e.preventDefault();
        await this.setState({
            value: e.target.value,
        }, () => {
            // console.log('duc', this.state.value)
        });

        if (e.target.value === 2) {
            document.getElementById('listconttycon').style.display = "block";
            document.getElementById('doitac').style.display = "none";
            document.getElementById('factoryy').style.display = "none";

        }
        else if (e.target.value === 3) {
            document.getElementById('doitac').style.display = "block";
            document.getElementById('listconttycon').style.display = "none";
            document.getElementById('factoryy').style.display = "none"
        } else if (e.target.value === 1) {
            document.getElementById('factoryy').style.display = "block"

            document.getElementById('listconttycon').style.display = "none"
            document.getElementById('doitac').style.display = "none"
            await this.setState({
                listconttycon: '',
                doitac: '',
            })
        }
    };

    async getListFixer() {
        // console.log('luc', dataUsers)
        const dataUsers = await getDestinationUserAPI(Constants.FACTORY, '', Constants.OWNER);
        // console.log('dataUser', dataUsers)
        if (dataUsers) {
            // console.log('status', dataUsers.status);
            if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
                // console.log('status OK');
                // var select = $('<select id="duy">')
                // this.setState({
                this.options = dataUsers.data.map((user) => {
                    return {
                        value: user.id,
                        label: user.name
                    }
                })
                // })

            } else {
                showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
            }

        } else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }
    }


    // async getAllPartner() {
    //     const arr = []
    //     const dataUserRelation = await getAllPartnerAPI();
    //     // console.log("ducvidai", dataUserRelation)
    //     if (dataUserRelation) {

    //         if (dataUserRelation.status === Constants.HTTP_SUCCESS_BODY) {
    //             dataUserRelation.data.map(item => {
    //                 arr.push(item.id)
    //             })

    //         } else {
    //             showToast(dataUserRelation.data.message ? dataUserRelation.data.message : dataUserRelation.data.err_msg, 2000);
    //         }

    //     } else {
    //         showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    //     }

    // }

    // async getAllFactory(page = this.state.activePage) {
    //     //const jobMetaData = await this.getJobMetaData();
    //     const arr = []
    //     const dataUsers = await getAllFactoryAPI(page);
    //     console.log('doi tac', dataUsers)
    //     if (dataUsers) {
    //         if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
    //             // dataUsers.data.data.map(async item => {
    //             //     arr.push({ item, checked: false })
    //             // })

    //             this.setState({
    //                 options2: dataUsers.data.data.map((user) => {
    //                     return {
    //                         value: user.id,
    //                         label: user.name
    //                     }
    //                 })
    //             })
    //         } else {
    //             showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
    //         }


    //     } else {
    //         showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    //     }
    // }
    async getList() {
        // console.log('duc vi dai', dataUsers)
        const dataUsers = await getDestinationUserAPI(Constants.FIXER);
        if (dataUsers) {
            // console.log('duc vi dai', dataUsers)
            if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
                let listFactoryBacks = [];
                // console.log("dataUsers.data", dataUsers.data);
                // for (let i = 0; i < dataUsers.data.length; i++) {
                //     listFactoryBacks.push({
                //         value: dataUsers.data[i].id,
                //         label: dataUsers.data[i].name,
                //         ...dataUsers.data[i],
                //     });
                // }
                this.setState({
                    options2: dataUsers.data.map((user) => {
                        return {
                            value: user.id,
                            label: user.name
                        }
                    })
                })

                // this.setState({ listUserFixer: listFactoryBacks }, () =>
                //     console.log("DUC VIDAI", this.state.listUserFixer)
                // );
            } else {
                // showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
            }

            //this.setState({image_link: profile.data.company_logo});
        } else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }
    }
    // async getFixer() {
    //     const dataUsers = await getDestinationUserAPI(Constants.FIXER);
    //     if (dataUsers) {
    //         if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
    //             console.log('ducvidai', dataUsers);
    //             // let listFactoryBacks = [];
    //             this.setState({
    //                 options2: dataUsers.data.map((user) => {
    //                     return {
    //                         value: user.id,
    //                         label: user.name
    //                     }
    //                 })
    //             })

    //             // this.setState({ listUserFixer: listFactoryBacks });
    //         } else {
    //             showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
    //         }

    //         //this.setState({image_link: profile.data.company_logo});
    //     } else {
    //         showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    //     }
    // }

    async componentDidMount() {
        let user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;
        let token1 = "Bearer " + user_cookies.token;
        let id = user_cookies.user.id;
        let isChildOf = user_cookies.user.isChildOf;
        let param = {
            isChildOf: user_cookies.user.isChildOf
        }
        await callApi("POST", GETLISTMANUFACTURE, param, token).then(res => {
            // console.log("ressss", res.data);
            if (res.data) {
              if (res.data.status === true) {
                // console.log("Lay thuong hieu thanh cong2!");
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
        this.setState({ 
            user_type: user_cookies.user.userType, 
            user_role: user_cookies.user.userRole }, () => {
        })
        // console.log('sdsds')
        await this.getListFixer();
        // await this.getAllPartner();
        // await this.getAllFactory();
        await this.getList();
        if (this.state.user_type === "Factory" && this.state.user_role === "SuperAdmin")
            await this.getListRentalPartner(id, token);
        else if (this.state.user_type === "Factory" && this.state.user_role === "Owner")
            await this.getListRentalPartner(isChildOf, token);
    }

    componentDidUpdate(prevProps) {

    }

    fileChangedHandler = (event) => {
        this.setState({ selectedFile: event.target.files[0] })
    };

    selectOptionHandler = (e) => {
        let target = e.target;
        let name = target.name;
        let value = target.value;
        this.setState({
            [name]: value
        });
    };

    async submit(event) {

        event.preventDefault();
        let data = this.form.getValues();

        // console.log(Constants.PLACESTATUS_ENUM[0].key);
        if (this.state.user_type === "Factory" && this.state.user_role === "SuperAdmin") {
            await this.props.addProduct(
                data.serial,
                data.color,
                // Đổi định dạng ngày về ISODate
                moment(data.checkedDate, "DD/MM/YYYY"),
                data.weight,
                (this.state.user_type === "Factory") 
                    ? Constants.PLACESTATUS_ENUM[0].key 
                    : Constants.PLACESTATUS_ENUM[6].key,
                "EMPTY",
                //data.currentImportPrice,
                data.cylinderType,
                this.props.listManufacturers[parseInt(data.manufacture)].id,
                data.valve,
                this.state.listconttycon,
                this.state.usingType,
                this.state.rentalPartner,
                //this.state.doitac,
            );
        }
        else if (this.state.user_type === "Factory" && this.state.user_role === "Owner") {
            await this.props.addProduct(
                data.serial,
                data.color,
                data.checkedDate,
                data.weight,
                (this.state.user_type === "Factory") 
                    ? Constants.PLACESTATUS_ENUM[0].key 
                    : Constants.PLACESTATUS_ENUM[6].key,
                "EMPTY",
                //data.currentImportPrice,
                data.cylinderType,
                this.state.manufacture.id,
                data.valve,
                "",
                this.state.usingType,
                this.state.rentalPartner.value,
            );
        }
        

        const modal = $("#create-product");
        modal.modal('hide');
        // window.location.reload();
        return;

    }

    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        const { value } = this.state;
        return (

            <div className="modal fade" id="create-product" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content myModal">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.t('CREATE_NEW_PRODUCT')}</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <Form ref={c => {
                                this.form = c
                            }} className="card" onSubmit={(event) => this.submit(event)}>
                                <div className="card-body ">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label>{this.props.t('CYLINDER_CODE')}</label>
                                                <Input className="form-control" type="text" name="serial"
                                                    validations={[required]} />
                                            </div>
                                            <div className="form-group">
                                                <label>{this.props.t('TYPE_VALVE')}</label>
                                                <Select className="form-control"
                                                    name="valve"
                                                    id="valve"
                                                    value={this.state.valve}
                                                    onChange={this.selectOptionHandler}
                                                    validations={[required]}>
                                                    <option value=''>{this.props.t('CHOOSE')}</option>
                                                    <option value="POL">{this.props.t('POL')}</option>
                                                    <option value="COMPACT">{this.props.t('COMPACT')}</option>
                                                    {/* <option value="1 VAN">{this.props.t('1_VALVE')}</option> */}
                                                    <option value="2 VAN">{this.props.t('2_VALVE')}</option>
                                                </Select>
                                                {/* <Select className="form-control"
                                                        name="color"
                                                        validations={[required]}>
                                                    <option value="">-- Chọn --</option>
                                                    {Constants.COLOR_ENUM.map((item, index) => <option value={index}
                                                    key={index}>{item.value}</option>)}
                                                </Select> */}
                                                {/* <Input className="form-control" type="text" name="valve" id="color" value={this.state.valve} validations={[required]} /> */}
                                            </div>
                                            {this.state.user_type === "Factory" && this.state.user_role === "SuperAdmin" && (
                                            <div className="form-group">
                                                <label>{this.props.t('MANUFACTURER_TITLE')}</label>
                                                    <Select className="form-control"
                                                        name="manufacture"
                                                        validations={[required]}>
                                                        <option value="">{this.props.t('CHOOSE')}</option>
                                                        {this.props.listManufacturers.map((item, index) => 
                                                        <option value={index} key={index}>{item.name}</option>)}
                                                    </Select>
                                            </div>)}
                                            {this.state.user_type === "Factory" && this.state.user_role === "Owner" && (
                                            <div className="form-group">
                                                <label>{this.props.t('MANUFACTURER_TITLE')}</label>
                                                    <Select2
                                                        onChange={this.handleChangeManufacture.bind(this)}
                                                        placeholder="..."
                                                        options={this.state.listManufacturers}
                                                        value={this.state.manufacture}>
                                                    </Select2>
                                            </div>)}
                                        </div>
                                        <div className="col-md-4">
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
                                            <div className="form-group">
                                                <label>{this.props.t('WEIGHT_GAS')}</label>
                                                <Input className="form-control"
                                                    type="number"
                                                    name="weight"
                                                    id="weight"
                                                    value={this.state.weight}  
                                                    validations={[required]} />
                                            </div>
                                            <div className="form-group">
                                                <labe>{this.props.t('CLASSIFY')}</labe>
                                                <div className="form-group">
                                                    {this.state.user_type === "Factory" && this.state.user_role === "SuperAdmin" && 
                                                    (<Radio.Group
                                                        onChange={this.onChangeUsingType} 
                                                        value={this.state.usingType}
                                                        validations={[required]}
                                                    >
                                                        <div className="usingType__Radio">
                                                            <Radio style = {{display: "block", marginBottom: "5px"}}
                                                                value="00" 
                                                                onChange={this.onChangeUsingType}
                                                            >{this.props.t('PERMANENT')}
                                                            </Radio>
                                                            <Radio style = {{display: "block"}}
                                                                value="01" 
                                                                onChange={this.onChangeUsingType}
                                                            >{this.props.t('LEASE')}
                                                                <Select className="form-control"
                                                                    id="rentalPartner" 
                                                                    name="rentalPartner" 
                                                                    style={{display: "none"}}
                                                                    onChange={this.onChangeRadioUsingType}>
                                                                    <option value="">-- Chọn --</option>
                                                                    {this.state.optionUsingType.map((item, index) => 
                                                                    <option
                                                                        value={item.value} key={index}>{item.label}
                                                                    </option>)}
                                                                </Select>
                                                            </Radio>
                                                        </div>
                                                    </Radio.Group>)}
                                                    {this.state.user_type === "Factory" && this.state.user_role === "Owner" &&
                                                    (<Radio.Group
                                                        onChange={this.onChangeUsingType1} 
                                                        value={this.state.usingType}
                                                        validations={[required]}
                                                    >
                                                        <div className="usingType__Radio">
                                                            <Radio style = {{display: "block", marginBottom: "5px"}}
                                                                value="00" 
                                                                onChange={this.onChangeUsingType1}
                                                            >Cố định
                                                            </Radio>
                                                            <Radio style = {{display: "block"}}
                                                                value="01" 
                                                                onChange={this.onChangeUsingType1}
                                                            >Cho thuê
                                                            </Radio>
                                                            {this.state.statusHideSelect && 
                                                            <Select2
                                                                styles={{ marginTop: "10px" }}
                                                                placeholder={this.props.t('CHOOSE')}
                                                                onChange={this.onChangeRadioUsingType1.bind(this)}
                                                                options={this.state.optionUsingType}
                                                                value={this.state.rentalPartner}
                                                            />}
                                                        </div>
                                                    </Radio.Group>)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">    
                                            <div className="form-group">
                                                <label>{this.props.t('COLOR')}</label>
                                                <Select className="form-control"
                                                    name="color"
                                                    id="color"
                                                    value={this.state.color}
                                                    onChange={this.selectOptionHandler}
                                                    validations={[required]}>
                                                    <option value=''>{this.props.t('CHOOSE')}</option>
                                                    <option value="Xám">{this.props.t('GRAY')}</option>
                                                    <option value="Đỏ">{this.props.t('RED')}</option>
                                                    <option value="Vàng">{this.props.t('YELLOW')}</option>
                                                    <option value="Shell">Shell</option>
                                                    <option value="VT">VT</option>
                                                    <option value="Petro">Petro</option>
                                                    <option value="Cam">{this.props.t('ORANGE')}</option>
                                                </Select>
                                                {/* <Select className="form-control"
                                                        name="color"
                                                        validations={[required]}>
                                                    <option value="">-- Chọn --</option>
                                                    {Constants.COLOR_ENUM.map((item, index) => 
                                                        <option value={index} key={index}>{item.value}
                                                        </option>)}
                                                </Select> */}
                                                {/*<Input className="form-control" type="text" name="color" id="color" value={this.state.color} validations={[required]} /> */}
                                            </div>
                                            <div className="form-group">
                                                <label>{this.props.t('VERIFY_DATE')}</label>
                                                <div className="input-group"
                                                    style={{display:"flex", flexWrap: "nowrap"}}
                                                >
                                                    <Input ref={this.expiration_dateRef} type="text"
                                                        className="form-control"
                                                        value={this.state.checkedDate} 
                                                        autocomplete="off"
                                                        validations={[required]}
                                                        name="checkedDate" id="checkedDate"
                                                        data-date-format="dd/mm/yyyy"
                                                        data-provide="datepicker" />
                                                    <div className="input-group-append">
                                                        <span className="input-group-text">
                                                            <i className="fa fa-calendar"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* <Input className="form-control" type="datetime" name="checkedDate" id="checkedDate" value={this.state.checkedDate} validations={[required]} />*/}
                                            </div>
                                            <div className="form-group group">
                                                {/* <label>{this.state.user_type === "Factory" ? "Vị trí hiện tại: Tại thương nhân sở hữu" : "Vị trí hiện tại: Tại cửa hàng bán lẻ"} </label> */}
                                                {this.state.user_type === "Factory" && this.state.user_role === "SuperAdmin" &&
                                                (<Radio.Group onChange={this.onChangeCurrent} value={value} className="">
                                                    <Radio
                                                        onChange={this.onChangeCurrent}
                                                        style={radioStyle}
                                                        value={1}
                                                        id="factoryy"
                                                        name="factoryy">
                                                        <label
                                                            onChange={this.onChangeCurrent}
                                                            id="factoryy"
                                                            name="factoryy"
                                                        >
                                                            {this.state.user_type === "Factory" ? this.props.t('IN_COMPANY_NOW') : this.props.t('IN_CHILD_NOW') }
                                                        </label>
                                                    </Radio>
                                                    <Radio
                                                        style={radioStyle}
                                                        value={2}
                                                        id="group1"
                                                        onChange={this.onChangeCurrent}
                                                    >
                                                        <label className="group1">{this.state.user_role === "cylinderAt_childFactory" ? this.props.t('IN_COMPANY_NOW') : this.props.t('IN_SOPET_NOW')}</label>
                                                        <Select className="form-control control1"
                                                            id="listconttycon"
                                                            name="listconttycon"
                                                            style={{ display: 'none', position: 'relative', top: '50px' }}
                                                            onChange={this.onradioChange}
                                                        >
                                                            <option value="">{this.props.t('CHOOSE')}</option>
                                                            {this.options.map((item, index) => <option
                                                                value={item.value} key={index}>{item.label}</option>)}
                                                        </Select>

                                                    </Radio>
                                                    <Radio style={radioStyle} value={3} className="value3" onChange={this.onChangeCurrent}>
                                                        <label className="value3">
                                                           {this.props.t('IN_FIXER_NOW')}
                                                        </label>
                                                        <Select className="form-control"
                                                            onChange={this.onradioChange}
                                                            id="doitac"
                                                            name="doitac"
                                                            style={{ display: 'none', position: 'absolute', top: '60px' }}
                                                        >
                                                            <option value="">{this.props.t('CHOOSE')}</option>
                                                            {this.state.options2.map((item, index) => 
                                                            <option value={item.value} key={index}>
                                                                {item.label}
                                                            </option>)}
                                                        </Select>
                                                    </Radio>
                                                </Radio.Group>)}


                                                {/* <Select className="form-control"
                                                    id="doitac"
                                                    name="doitac"
                                                    style={{ display: 'none' }}
                                                    onChange={this.onChange}
                                                >
                                                    <option value="">--  --</option>
                                                    {this.state.options2.map((item, index) => <option
                                                        value={item.value} key={index}>{item.label}</option>)}
                                                </Select> */}
                                                {/* <label>{this.state.user_type === "Factory" ? "Vị trí hiện tại: Tại thương nhân sở hữu" : "Vị trí hiện tại: Tại cửa hàng bán lẻ"} </label> */}
                                            </div>
                                        </div>
                                            
                                            {/*<div className="form-group">
                                                <label>Giá tham khảo </label>
                                                <Input className="form-control"
                                                    type="number"
                                                    name="currentImportPrice"
                                                    id="currentImportPrice"
                                                    value={this.state.currentImportPrice} />
                                            </div>*/}
                                        {/*<div className="col-md-6">
                                            <div>Hình ảnh</div>
                                            <input type="file" name="logo" data-provide="dropify"
                                                onChange={(event) => this.fileChangedHandler(event)} />
                                        </div>*/}
                                            
                                            
                                            
                                            {/* <div className="form-group">
                                                <label>Thương nhân sở hữu</label>
                                                <Select className="form-control"
                                                        name="factory"
                                                        validations={[required]}>
                                                    <option value="">-- Chọn --</option>
                                                    {this.props.listFactory.map((item, index) => <option value={index}>{item.name}</option>)}
                                                </Select>
                                            </div> */}
                                            {/* <div className="form-group">
                                                <label>Cửa hàng bán lẻ</label>
                                                <Select className="form-control"
                                                        name="agency"
                                                        >
                                                    <option value="">-- Chọn --</option>
                                                    {this.props.listAgency.map((item, index) => <option value={index}>{item.name}</option>)}
                                                </Select>
                                            </div> */}
                                    {/*<div className="form-group">*/}
                                    {/*<label>Các vị trí</label>*/}
                                    {/*<TagAutoComplete getPosition={this.getPosition.bind(this)}*/}
                                    {/*data={this.state.job_titles}/>*/}
                                    {/*</div>*/}
                                    </div>
                                </div>

                                <footer className="card-footer text-center">
                                    <Button className="btn btn-primary"> {this.props.t('SAVE')} </Button>
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

AddProductPopup.propType = {
    addStore: PropType.func.isRequired,
    jobMetaData: PropType.object.isRequired,
    updateStoreImage: PropType.func.isRequired
};

export default withNamespaces()(AddProductPopup) ;