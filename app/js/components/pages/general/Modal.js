import React, { Component } from 'react';
// import updateBranch from "./updateBranch";
import getAllUserApi from "getAllUserApi";
import AddUserPopupContainer from "../user/AddUserPopupContainer";
// import Input from 'react-validation/build/input';
import updateUserAPI from "updateUserAPI";
// import Form from 'react-validation/build/form';
// import Button from 'react-validation/build/button';
import getUserCookies from "getUserCookies";
// import Input from 'react-validation/build/input';
import Constants from "Constants";
import showToast from "showToast";
import isUppercase from "isUppercase";
import required from "required";
import email from "email";
import callApi from '../../../util/apiCaller';
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';
import './Modal.css';
import updateAgencyInforAPI from '../../../../api/updateAgencyInforAPI';
import addNewAgencyAPI from '../../../../api/addNewAgencyAPI';
import removeAgencyAPI from '../../../../api/removeAgencyAPI';
import {withNamespaces} from 'react-i18next';
const ButtonGroup = Button.Group;
const { TextArea } = Input;

const defaultPageSize = {
    defaultPageSize: 10
}

// const columns = [
//     // {
//     //     title: "Số thứ tự",
//     //     dataIndex: "status",
//     //     key: "status",
//     //     // ...this.getColumnSearchProps("status"),
//     // },
//     {
//         title: "Mã chi nhánh",
//         dataIndex: "agencyCode",
//         key: "agencyCode",
//         editable: true,
//         // ...this.getColumnSearchProps("agencyCode"),
//     },
//     {
//         title: "Tên chi nhánh",
//         dataIndex: "name",
//         key: "name",
//         editable: true,
//         // ...this.getColumnSearchProps("name"),
//     },
//     {
//         title: "Email",
//         dataIndex: "email",
//         key: "email",
//         editable: true,
//         // ...this.getColumnSearchProps("email"),
//     },    
//     {
//         title: "Địa chỉ",
//         dataIndex: "address",
//         key: "address",
//         editable: true,
//         // ...this.getColumnSearchProps("address"),
//     },
//     {
//         title: 'Thao tác',
//         key: 'operation',
//         render: () => (
//             <div>
//                 <Button
//                     type="primary"
//                     style={{ marginLeft: 5 }}                            
//                     // data-toggle="modal"
//                     // data-target="#view-order-histories-modal"
//                     onClick={() => console.log('Ấn nút sửa')}
//                     // shape="circle"
//                     icon="edit"
//                 >
//                     Sửa
//                 </Button>
//             </div>
//         )
//     },
// ];

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

const EditableContext = React.createContext();

class EditableCell extends React.Component {
    getInput = () => {
        // console.log('getInput this.props', this.props)
        if (this.props.inputType === 'number') {
            return <InputNumber />;
        }
        if (this.props.dataIndex === 'address') {
            return <TextArea rows={4} />;
        }
        return <Input />;
    };

    renderCell = ({ getFieldDecorator }) => {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            children,
            ...restProps
        } = this.props;
        // console.log('this.props', this.props)
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                        {getFieldDecorator(dataIndex, {
                            rules: [
                                {
                                    required: true,
                                    message: `Please Input ${title}!`,
                                },
                            ],
                            initialValue: record[dataIndex],
                        })(this.getInput())}
                    </Form.Item>
                ) : (
                        children
                    )}
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}

class EditableTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userEdit: {},
            isCreateMode: true,
            name: "",
            agencyCode: '',
            address: '',
            id: '',
            email: "",
            agency: [
                {
                    agencyCode: "",
                    name: "",
                    address: ""
                }
            ],
            isLoading: false,

            //
            data, editingKey: '',
            
            // Update agency
            udtAddress: '',
            udtAgencyId: '',
            udtAgencyCode: '',
            udtAgencyName: '',
            udtEmail: '',

            //
            listAgency: [],
            customerId: '',

            // Add new agency
            newAgencyCode: '',
            newAgencyName: '',
            newAddress: '',            
            newEmail: '',
        };

        this.columns = [
            // {
            //     title: "Số thứ tự",
            //     dataIndex: "status",
            //     key: "status",
            //     // ...this.getColumnSearchProps("status"),
            // },
            {
                title: this.props.t('AGENCY_ID'),
                dataIndex: "agencyCode",
                key: "agencyCode",
                editable: true,
                width: 125,
                // ...this.getColumnSearchProps("agencyCode"),
            },
            {
                title: this.props.t('AGENCY_NAME'),
                dataIndex: "agencyName",
                key: "agencyName",
                editable: true,
                // ...this.getColumnSearchProps("agencyName"),
            },
            {
                title: this.props.t('EMAIL'),
                dataIndex: "email",
                key: "email",
                editable: true,
                // ...this.getColumnSearchProps("email"),
            },    
            {
                title: this.props.t('ADDRESS'),
                dataIndex: "address",
                key: "address",
                editable: true,
                // width: '30%',
                // ...this.getColumnSearchProps("address"),
            },
            {
                title: this.props.t('ACTION'),
                key: 'operation',
                width: 110,
                align: 'center',
                render: (record) => {
                    const { editingKey } = this.state;
                    const editable = this.isEditing(record);
                    return (
                        <div>
                            {!record.add && !editable ?
                                <div>
                                    <Button
                                        type="primary"
                                        style={{ marginRight: 2 }}
                                        // data-toggle="modal"
                                        // data-target="#view-order-histories-modal"
                                        // onClick={() => console.log('Ấn nút sửa')}
                                        onClick={() => this.edit(record.key)}
                                        // shape="circle"
                                        icon="edit"
                                    >
                                    </Button>
                                    <Popconfirm
                                        title={this.props.t('CHECK_DELETE')}
                                        onConfirm={() => this.removeAgency(record.key, record.agencyId)}
                                        okText="Có"
                                        cancelText="Không"
                                    >

                                        <Button
                                            type="danger"
                                            // onClick={() => this.removeAgency(record.key, record.agencyId)}
                                            icon="delete"
                                        >
                                        </Button>

                                    </Popconfirm>
                                    
                                </div>
                                : ""
                            }                            

                            {!record.add && editable ?
                                (<div>
                                    <EditableContext.Consumer>
                                        {form => (
                                            <Popconfirm
                                                title={this.props.t('CHECK_EDIT')}
                                                onConfirm={() => this.save(form, record)}
                                                // onCancel={() => this.cancel(record.key)}
                                                // onCancel={() => console.log('id', this.props.customerId)}
                                                okText="Yes"
                                                cancelText="No"
                                            >

                                                <Button
                                                    type="primary"
                                                    style={{ marginRight: 2 }}                                                    
                                                    onClick={() => this.edit(record.key)}
                                                    icon="check"
                                                />

                                            </Popconfirm>
                                        )}
                                    </EditableContext.Consumer>
                                    {/* <Button type="primary" icon="check" style={{ marginRight: 2 }} /> */}
                                    <Button type="danger" icon="close" style={{ marginLeft: 2 }}
                                        onClick={() => this.cancel(record.key)}
                                    />
                                    </div>
                                )
                                : ( ""
                                    // <Button
                                    //     type="primary"
                                    //     style={{ marginLeft: 5 }}
                                    //     // data-toggle="modal"
                                    //     // data-target="#view-order-histories-modal"
                                    //     // onClick={() => console.log('Ấn nút sửa')}

                                    //     onClick={() => this.edit(record.key)}
                                    //     // onClick={() => this.cancel(record.key)}
                                    //     // onClick={()=>this.callAPI()}


                                    //     // shape="circle"
                                    //     icon="close-circle"
                                    //     theme="filled"
                                    // >
                                    //     API
                                    // </Button>
                                )
                            }

                            {record.add ?
                                // (<div>
                                    <EditableContext.Consumer>
                                        {form => (
                                            <Popconfirm
                                                title="Bạn có chắc muốn thêm chi nhánh?"
                                                onConfirm={() => this.addAgency(form, record)}
                                                // onCancel={() => this.cancel(record.key)}
                                                // onCancel={()=>console.log('this.props.id',this.props.id)}
                                                okText="Yes"
                                                cancelText="No"
                                            >

                                                <Button
                                                    // type="dashed"
                                                    // style={{ marginRight: 2 }}
                                                    // onClick={() => this.edit(record.key)}
                                                    icon="save"
                                                >
                                                    Lưu
                                                </Button>

                                            </Popconfirm>
                                        )}
                                    </EditableContext.Consumer>
                                //     {/* <Button type="primary" icon="check" style={{ marginRight: 2 }} /> */}
                                //     <Button type="danger" icon="close" style={{ marginLeft: 2 }}
                                //         onClick={() => this.cancel(record.key)}
                                //     />
                                // </div>
                                // )
                                // : ( ""                                    
                                // )
                                // <Button icon='save'>Lưu</Button>
                                 : ""
                            }
                        </div>
                    )
                }
            },
            // {
            //     title: 'operation',
            //     dataIndex: 'operation',
            //     render: (text, record) => {
            //       const { editingKey } = this.state;
            //       const editable = this.isEditing(record);
            //       return editable ? (
            //         <span>
            //           <EditableContext.Consumer>
            //             {form => (
            //               <a
            //                 onClick={() => this.save(form, record.key)}
            //                 style={{ marginRight: 8 }}
            //               >
            //                 Save
            //               </a>
            //             )}
            //           </EditableContext.Consumer>
            //           <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}
            //               onCancel={()=>console.log('onCancle')}
            //               okText="Yes"
            //               cancelText="No"
            //           >
            //              <a href="#">Hủy</a>
            //           </Popconfirm>                         
            //         </span>
            //       ) : (
            //         <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
            //           Edit
            //         </a>
            //       );
            //     },
            //   }
        ];


        // this.columns = [
        //     {
        //       title: 'name',
        //       dataIndex: 'name',
        //       width: '25%',
        //       editable: true,
        //     },
        //     {
        //       title: 'age',
        //       dataIndex: 'age',
        //       width: '15%',
        //       editable: true,
        //     },
        //     {
        //       title: 'address',
        //       dataIndex: 'address',
        //       width: '40%',
        //       editable: true,
        //     },
        //     {
        //       title: 'operation',
        //       dataIndex: 'operation',
        //       render: (text, record) => {
        //         const { editingKey } = this.state;
        //         const editable = this.isEditing(record);
        //         return editable ? (
        //           <span>
        //             <EditableContext.Consumer>
        //               {form => (
        //                 <a
        //                   onClick={() => this.save(form, record.key)}
        //                   style={{ marginRight: 8 }}
        //                 >
        //                   Save
        //                 </a>
        //               )}
        //             </EditableContext.Consumer>
        //             <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}
        //                 onCancel={()=>console.log('onCancle')}
        //                 okText="Yes"
        //                 cancelText="No"
        //             >
        //                <a href="#">Hủy</a>
        //             </Popconfirm>
        //                 {/* <Popconfirm
        //                     title="Are you sure delete this task?"
        //                     onConfirm={()=>console.log('onCaonConfirmncle')}
        //                     onCancel={()=>console.log('onCancle')}
        //                     okText="Yes"
        //                     cancelText="No"
        //                 >
        //                     <a href="#">Delete</a>
        //                 </Popconfirm> */}
        //           </span>
        //         ) : (
        //           <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
        //             Edit
        //           </a>
        //         );
        //       },
        //     },
        //   ];

    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.listBrand !== prevProps.listBrand) {
            this.setState({ listAgency: this.props.listBrand })
        }
        if (this.props.customerId !== prevProps.customerId) {
            this.setState({ customerId: this.props.customerId })
        }
        if (this.props.isLoading !== prevProps.isLoading) {
            this.setState({ isLoading: this.props.isLoading })
        }
    }

    refresh() {
        this.forceUpdate(async () => {
            await this.getAllUser();
        });
    }



    onChange = (e) => {
        // console.log(e.target.value)
        let target = e.target;
        let name = target.name;
        let value = target.value;
        this.setState({
            [name]: value
        })
    }
 

 
    async updateUser(target_id, id, name, address, agencyCode) {
        alert('sdsd')
        var user_cookies = await getUserCookies();

        // Call api
        // Update user
        this.setState({ isLoading: true });
        const user = await updateUserAPI(target_id, id, name, address, agencyCode);
        this.setState({ isLoading: false });
        //console.log('register',user);
        if (user) {
            // console.log("update user", user);
            if (user.status === Constants.HTTP_SUCCESS_BODY) {
                if (!!user.data.err_msg) {
                    showToast(user.data.message ? user.data.message : user.data.err_msg, 2000);
                    return false;

                }
                else {
                    showToast('Cập nhật thành công!', 3000);
                    // this.props.refresh();
                    // window.location.reload();
                    return true;
                }
            } else {
                showToast(user.data.message ? user.data.message : user.data.err_msg, 2000);
                return false;
            }
        } else {
            showToast("Xảy ra lỗi trong quá trình tạo mới người dùng ");
            return false;
        }

        this.setState({ registerSuccessful: false });
    }
    renderlistBrand = (arr) => {
        // console.log('renderlistBrand', arr)
  
        return arr.map((brand, index) => {
            return (
                <tr key={index}>
                    <td style={{ padding: '5px' }}>{index + 1}</td>

                    <td>
                        <Input style={{ padding: "8px 0 0 0", width: "100%" }}
                            // defaultValue={brand.agencyCode}
                            value={brand.agencyCode}
                            name="agencyCode"
                        // onChange={this.onChange}
                        />
                    </td>
                    <td>
                        {brand.email}

                    </td>
                    <td>
                        <Input
                            style={{ width: "200px", padding: "8px 0 0 0", width: "100%"}}
                            value={brand.name}
                            name="name"
                        // onChange={this.onChange}
                        />
                    </td>
                    <td>
                        <Input
                            style={{ width: "200px", padding: "8px 0 0 0", width: "100%"}}
                            value={brand.address}
                            // name={`address[${index}]`}
                            name="address"
                        // onChange={this.onChange}
                        />
                    </td>
                  

                </tr>


            )


        }

        )
    }


    async submit(event) {
        event.preventDefault();
        // if (this.props.isCreateMode) {
        var user_cookies = await getUserCookies();
        let isChildOf = "";
        if (user_cookies) {
            isChildOf = user_cookies.user.id;
        }

        let data = this.form.getValues();
        let result = false;

        var user_cookies = await getUserCookies();
        result = await updateUserAPI(
            // this.props.isEditForm,
            data.target_id,
            data.name,
            // data.password,
            data.address,
            data.agencyCode,

           
        );
        // console.log('sds', result)
        if (result) {
            const modal = $("#create-user");
            modal.modal("hide");
        }
        // }
        //window.location.reload();
        return;
    }

    // --- BEGIN --- Function of Edit Row
    isEditing = record => record.key === this.state.editingKey;

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    save(form, record) {
        // console.log('form, key', form, key, record)
        form.validateFields(async (error, row) => {
            // console.log('error, row', error, row)
            if (error) {
                return;
            }
            // const newData = [...this.state.data];
            // const index = newData.findIndex(item => key === item.key);
            // if (index > -1) {
            //     const item = newData[index];
            //     newData.splice(index, 1, {
            //         ...item,
            //         ...row,
            //     });
            //     this.setState({ data: newData, editingKey: '' });
            // } else {
            //     newData.push(row);
            //     this.setState({ data: newData, editingKey: '' });
            // }

            // Call API sửa thông tin chi nhánh
            // this.callAPI()
            this.setState({
                editingKey: '',
                //
                udtAddress: row.address,
                udtAgencyId: record.agencyId,
                udtAgencyCode: row.agencyCode,
                udtAgencyName: row.agencyName,
                udtEmail: row.email,
            }, ()=> this.callAPI(record.key))

            // this.callAPI(udtAgencyId)
        });
    }

    addAgency(form, record) {
        const {
            customerId
        } = this.state
        // console.log('form, key', form, key, record)
        form.validateFields(async (error, row) => {
            // console.log('error, row', error, row)
            if (error) {
                return;
            }            
            this.setState({
                editingKey: '',                
                //
                customerId: customerId,
                newAgencyCode: row.agencyCode,
                newAgencyName: row.agencyName,
                newAddress: row.address,
                newEmail: row.email,
            }, ()=> this.callAddAgencyAPI())

        });
    }
    
    removeAgency(key, agencyId) {
        // this.setState({
        //     editingKey: '',
        //     //
        //     customerId: customerId,
        //     newAgencyCode: row.agencyCode,
        //     newAgencyName: row.agencyName,
        //     newAddress: row.address,
        //     newEmail: row.email,
        // }, () => this.callAddAgencyAPI())
        this.callRemoveAgencyAPI(key, agencyId)
    }

    callAPI = async (key) => {
        const {
            udtAgencyId, udtAgencyCode, udtAgencyName, udtAddress, udtEmail, listAgency
        } = this.state
        const result = await updateAgencyInforAPI(udtAgencyId, udtAgencyCode, udtAgencyName, udtAddress, udtEmail)
        // console.log('resultUpdateAgency', resultUpdateAgency)
        if (result.status===true) {
            const newAgency = {
                key: key,
                agencyId: result.data.id,
                agencyCode: result.data.agencyCode,
                agencyName: result.data.name,
                email: result.data.email,
                address: result.data.address,
            }
            listAgency.splice(key, 1, newAgency)
            console.log('newAgency', newAgency)
            this.setState({listAgency: listAgency})
        }
    }

    callAddAgencyAPI = async () => {
        const {
            customerId, newAgencyCode, newAgencyName, newAddress, newEmail,
            listAgency,
        } = this.state
        const result = await addNewAgencyAPI(customerId, newAgencyCode, newAgencyName, newAddress, newEmail)
        if (result.status===true) {
            const newAgency = {
                key: listAgency.length-1,
                agencyId: result.data.id,
                agencyCode: result.data.agencyCode,
                agencyName: result.data.name,
                email: result.data.email,
                address: result.data.address,
            }
            listAgency.splice(listAgency.length-1, 1, newAgency)
            this.setState({listAgency: listAgency})
        }
    }

    callRemoveAgencyAPI = async (key, agencyId) => {
        const {
            listAgency
        } = this.state

        const result = await removeAgencyAPI(agencyId)
        if (result.status===true) {
            listAgency.splice(key, 1)
            this.setState({listAgency: listAgency})
        }
    }

    edit(key) {
        // console.log('key', key)
        this.setState({ editingKey: key });
    }
    // --- END --- Function of Edit Row

    handleAddAgency = () => {
        const { listAgency } = this.state;
        const newData = {
            key: listAgency.length,
            agencyId: 'agencyId',
            agencyCode: 'agencyCode',
            agencyName: 'agencyName',
            email: 'email',
            address: 'address',
            add: true,
        };
        
        this.setState({
            listAgency: [...listAgency, newData],
            editingKey: newData.key
        })
    };

    render() {

        const {
            listAgency,
            isLoading
        } = this.state

        console.log('listAgency', listAgency)

        const components = {
            body: {
                cell: EditableCell,
            },
        };

        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'age' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        return (
            // <div className="modal fade" id={`${this.props.id}`} tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal fade" id="list_branch_modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.t('AGENCY_TITLE_LIST')}</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <Button onClick={this.handleAddAgency} type="primary" style={{ marginBottom: 16 }}>
                                {this.props.t('ADD_AGENCY')}
                            </Button>
                            <EditableContext.Provider value={this.props.form}>
                                <Table
                                    loading={isLoading}
                                    bordered
                                    columns={columns}
                                    dataSource={listAgency}
                                    // dataSource={this.state.data}                                
                                    pagination={defaultPageSize}
                                    components={components}
                                />
                            </EditableContext.Provider>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
let  Modal = Form.create()(EditableTable);

export default withNamespaces()(Modal);
