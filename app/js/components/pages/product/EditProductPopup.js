import React from 'react';
import PropType from 'prop-types';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import Button from 'react-validation/build/button';
import required from 'required';
import Constant from "Constants";
import {withNamespaces} from 'react-i18next';

var fileReader;

class EditProductPopup extends React.Component {

    constructor(props) {
        super(props);
        this.form = null;
        this.state = {
            color: '',
            weight: 0,
            checkedDate: '',
            status: '',
            emptyOrFull: '',
            currentImportPrice: 0,
            store: "",
            image: ""
        };

    }

    fileChangedHandler = (event) => {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({image: e.target.result});
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };


    async submit(event) {

        event.preventDefault();
        // if (this.state.position.length === 0) {
        //     showToast('Chưa chọn vị trí!', 3000);
        //     return;
        // }
        let data = this.form.getValues();
        // let updateGeneral=null,updateAgency=null;
        // if(data.general===null||data.general==="")
        // {
        //     updateGeneral=null;
        // }
        // else
        // {
        //     updateGeneral=this.props.listGeneralUser[parseInt(data.general)].id;
        // }
        // if(data.agency===null||data.agency==="")
        // {
        //     updateAgency=null;
        // }
        // else
        // {
        //     updateAgency=this.props.listAgencyUser[parseInt(data.agency)].id;
        // }
        // console.log('data', data)

        await this.props.editProduct(data.serial, data.color, data.checkedDate, parseFloat(data.weight), Constant.PLACESTATUS_ENUM[parseInt(data.status)].key, Constant.STATUS_ENUM[parseInt(data.emptyOrFull)].key
            , parseInt(data.currentImportPrice[0]), this.state.store.manufacture.id, this.state.image, data.cylinderType, data.valve);
        const modal = $("#edit-product");
        modal.modal('hide');
        return;
    }

    componentWillReceiveProps(nextprops) {
        if (nextprops.store !== this.props.store && nextprops.store !== "") {
            this.setState({store: nextprops.store})
        }
    }

    componentWillMount() {
        this.props.store
    }

    render() {
        return (
            <div className="modal fade" id="edit-product" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.t('UPDATE_PRODUCT')}</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <Form ref={c => {
                                this.form = c
                            }} className="card" onSubmit={(event) => this.submit(event)}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>{this.props.t('CYLINDER_CODE')}</label>
                                                <Input disabled={true} className="form-control"
                                                       value={this.props.productDetail.serial}
                                                       type="text" name="serial"
                                                       validations={this.state.store.factory !== this.props.parentRoot ? "" : [required]}/>
                                            </div>
                                            <div className="form-group">
                                                <label>{this.props.t('CYLINDER_TYPE')}</label>
                                                {/* <Input className="form-control" type="text" name="cylinderType" id="cylinderType"
                                                       disabled={this.state.store.factory !== this.props.parentRoot}
                                                       value={this.props.productDetail.cylinderType}
                                                       validations={this.state.store.factory !== this.props.parentRoot ? "" : [required]}/> */}
                                                <Select className="form-control"
                                                    name="cylinderType"
                                                    id="cylinderType"
                                                    value={this.props.productDetail.cylinderType}
                                                    onChange={this.selectOptionHandler}
                                                    validations={this.state.store.factory !== this.props.parentRoot ? "" : [required]}>
                                                    <option value="CYL12KG">CYL12KG</option>
                                                    <option value="CYL12KGCO">CYL12KGCO</option>
                                                    <option value="CYL45KG">CYL45KG</option>
                                                    <option value="CYL50KG">CYL50KG</option>
                                                </Select>
                                            </div>
                                            <div className="form-group">
                                                <label>{this.props.t('COLOR')}</label>
                                                {/* <Input className="form-control" type="text" name="color" id="color"
                                                       disabled={this.state.store.factory !== this.props.parentRoot}
                                                       value={this.props.productDetail.color}
                                                       validations={this.state.store.factory !== this.props.parentRoot ? "" : [required]}/> */}
                                                <Select className="form-control"
                                                    name="color"
                                                    id="color"
                                                    value={this.props.productDetail.color}
                                                    onChange={this.selectOptionHandler}
                                                    validations={this.state.store.factory !== this.props.parentRoot ? "" : [required]}>
                                                    <option value="Xám">{this.props.t('GRAY')}</option>
                                                    <option value="Đỏ">{this.props.t('RED')}</option>
                                                    <option value="Vàng">{this.props.t('YELLOW')}</option>
                                                    <option value="Shell">Shell</option>
                                                    <option value="VT">VT</option>
                                                    <option value="Petro">Petro</option>
                                                    <option value="Cam">{this.props.t('ORANGE')}</option>
                                                </Select>
                                            </div>
                                            <div className="form-group">
                                                <label>{this.props.t('TYPE_VALVE')}</label>
                                                {/* <Input className="form-control" type="text" name="color" id="color"
                                                       disabled={this.state.store.factory !== this.props.parentRoot}
                                                       value={this.props.productDetail.color}
                                                       validations={this.state.store.factory !== this.props.parentRoot ? "" : [required]}/> */}
                                                <Select className="form-control"
                                                    name="valve"
                                                    id="valve"
                                                    value={this.props.productDetail.valve}
                                                    onChange={this.selectOptionHandler}
                                                    validations={this.state.store.factory !== this.props.parentRoot ? "" : [required]}>
                                                    <option value="POL">{this.props.t('POL')}</option>
                                                    <option value="COMPACT">{this.props.t('COMPACT')}</option>
                                                    {/* <option value="1 VAN">{this.props.t('1_VALVE')}</option> */}
                                                    <option value="2 VAN">{this.props.t('2_VALVE')}</option>
                                                </Select>
                                            </div>
                                            <div className="form-group">
                                                <label>{this.props.t('WEIGHT')}</label>
                                                <Input className="form-control" type="number" name="weight" id="weight"
                                                       value={this.props.productDetail.weight}
                                                       disabled={this.state.store.factory !== this.props.parentRoot}
                                                       onKeyDown={ e => (e.keyCode === 69 || e.keyCode === 107 || e.keyCode === 109 || e.keyCode === 190) && e.preventDefault() }
                                                       validations={this.state.store.factory !== this.props.parentRoot ? "" : [required]}/>
                                            </div>
                                            {/*<div className="form-group">
                                                <label>Giá bán</label>
                                                <Input className="form-control" type="number" name="currentImportPrice"
                                                       id="currentImportPrice"
                                                       disabled={this.state.store.factory !== this.props.parentRoot}
                                                       value={this.props.productDetail.currentSalePrice}
                                                       validations={this.state.store.factory !== this.props.parentRoot ? "" : [required]}/>
                                            </div>*/}
                                        </div>
                                        {/*<div className="col-md-6">
                                            <div>Hình ảnh</div>
                                            <input type="file" name="logo" data-provide="dropify"
                                                   disabled={this.state.store.factory !== this.props.parentRoot}
                                                   onChange={(event) => this.fileChangedHandler(event)}
                                                   validations={this.state.store.factory !== this.props.parentRoot ? "" : [required]}/>
                                        </div>*/}
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">

                                            <div className="form-group">
                                                <label>{this.props.t('VERIFY_DATE')}</label>
                                                <div className="input-group"
                                                    style={{display:"flex", flexWrap: "nowrap"}}
                                                >
                                                    <Input ref={this.expiration_dateRef} type="text"
                                                           className="form-control"
                                                           value={this.props.productDetail.checkedDate}
                                                           name="checkedDate" id="checkedDate"
                                                           data-date-format="dd/mm/yyyy"
                                                           disabled={this.state.store.factory !== this.props.parentRoot}
                                                           data-provide="datepicker"/>
                                                    <div className="input-group-append">
                                                                        <span className="input-group-text"><i
                                                                            className="fa fa-calendar"></i></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>{this.props.t('BRANCH')}</label>
                                                <Input className="form-control" type="text" name="currentImportPrice"
                                                       disabled={true} id="currentImportPrice"
                                                       value={this.state.store.hasOwnProperty("manufacture") ? this.state.store.manufacture.name : ""}/>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>{this.props.t('NOW_PLACE')}</label>
                                                <Select className="form-control"
                                                        name="status"
                                                        value=
                                                            {Constant.PLACESTATUS_ENUM.find(o => o.key === this.props.productDetail.placeStatus) !== undefined
                                                                ? Constant.PLACESTATUS_ENUM.findIndex(o => o.key === this.props.productDetail.placeStatus)
                                                                : ""}
                                                        disabled={true}>
                                                    <option value="">{this.props.t('CHOOSE')}</option>
                                                    {Constant.PLACESTATUS_ENUM.map((item, index) => <option
                                                        value={index} key={index}>{item.value}</option>)}
                                                </Select>
                                            </div>
                                            <div className="form-group">
                                                <label>{this.props.t('STATUS')}</label>
                                                <Select className="form-control"
                                                        name="emptyOrFull"
                                                        value=
                                                            {Constant.STATUS_ENUM.find(o => o.key === this.props.productDetail.status) !== undefined
                                                                ? Constant.STATUS_ENUM.findIndex(o => o.key === this.props.productDetail.status)
                                                                : ""}
                                                        disabled={true}>
                                                    <option value="">{this.props.t('CHOOSE')}</option>
                                                    {Constant.STATUS_ENUM.map((item, index) => <option value={index}
                                                                                                       key={index}>{item.value}</option>)}
                                                </Select>
                                            </div>
                                        </div>

                                        {/*<div className="col-md-6">*/}
                                        {/*</div>*/}
                                    </div>
                                </div>

                                <footer className="card-footer text-center">
                                    <Button type="submit" className="btn btn-primary">{this.props.t('SAVE')}</Button>
                                    <button className="btn btn-secondary" type="reset" data-dismiss="modal"
                                            style={{marginLeft: "10px"}}>{this.props.t('CLOSE')}
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

EditProductPopup.propType = {
    addStore: PropType.func.isRequired,
    jobMetaData: PropType.object.isRequired,
    updateStoreImage: PropType.func.isRequired
};

export default withNamespaces()(EditProductPopup) ;
