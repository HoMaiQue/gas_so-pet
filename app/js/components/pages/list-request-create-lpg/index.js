import React from "react";
import PropType from "prop-types";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import required from "required";
import isUppercase from "isUppercase";
import showToast from "showToast";
import getUserCookies from "./../../../helpers/getUserCookies";
import callApi from "./../../../util/apiCaller";
import { Table, Icon, Button } from "antd";
import { GETREQIMPORT, ACCEPTREQUEST, DELETEREQUEST } from "../../../config/config";
import {withNamespaces} from 'react-i18next';
class ListRequest extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      listRequest: [],
      tempListRequest: []
    };
  }

  //cmt
  async submit(event) {
    event.preventDefault();

    //console.log(user_cookies);
  }

  async componentDidMount() {
    const user_cookies = await getUserCookies();
    let params = {
      id: user_cookies.user.id,
    };
    let token = "Bearer " + user_cookies.token;
    await callApi("POST", GETREQIMPORT, params, token).then((res) => {
      this.setState({
        tempListRequest: res.data.data,
      });
      // Đảo mảng lại cho mới nhất lên cùng
      let resLength = res.data.data.length;
      for (let i = 0; i < resLength; i++)
      {
        this.state.listRequest[i] = this.state.tempListRequest[resLength - 1 - i];
      }
      // console.log("data list request: ", res.data.data);
    });
  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
      listCylinde: [],
      displayTable: false,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  onGiveListCylinde = (tags) => {
    this.setState({
      listCylinde: tags,
      displayTable: true,
    });
  };

  onAcceptRequest = async (idRequest) => {
    const user_cookies = await getUserCookies();
    let params = {
      idUser: user_cookies.user.id,
      idReq: idRequest,
    };
    let token = "Bearer " + user_cookies.token;
    var answer = window.confirm("Bạn có chắc chắn xác nhận đơn hàng này ?");
    if (answer) {
      await callApi("POST", ACCEPTREQUEST, params, token).then((res) => {
        // console.log(res.data.status);
        // console.log(res.data.message);
        // console.log(res.data);
        if(res.data.message==="Co loi khi tao binh")
        {
          alert("Có bình đã bị trùng")
        }
        else
        {
          alert("Duyệt đơn hàng thành công");
          const modal = $("#list-request");
          modal.modal('hide');
        }
        
      });
    }
  };

  // Hàm xóa
  onDeleteRequest = async (idRequest) => {
    const user_cookies = await getUserCookies();
    let params = {
      idReq: idRequest,
    };
    let token = "Bearer " + user_cookies.token;
    var answer = window.confirm("Bạn có chắc chắn xóa đơn hàng này ?");
    if (answer) {
      await callApi("POST", DELETEREQUEST, params, token).then((res) => {
        // console.log("111",res.data.status);
        // console.log("112",res.data.message);
        // console.log("113",res.data);
        if (res.data.message==="Co loi khi tao binh")
        {
          alert("Không xóa được.")
        }
        else
        {
          alert("Xóa yêu cầu thành công!");
          const modal = $("#list-request");
          modal.modal('hide');
          // window.location.reload();
        }
        
      });
    }
  };

  render() {
    const columns = [
      
      {
        title: this.props.t('NAME_COMPANY'),
        dataIndex: "id_ReqFrom.name",
        key: "id_ReqFrom.name",
      },
      {
        title: this.props.t('LIST_CYLINDER'),
        dataIndex: "detail_Req",
        render: (tags) => (
          <Button
            style={{ background: "#2E64FE", color: "white" }}
            onClick={() => this.onGiveListCylinde(tags)}
          >
            {this.props.t('VIEW')}
          </Button>
        ),
      },
      {
        title: this.props.t('TODO'),
        dataIndex: "id",
        key: "id",
        render: (id) => (
          <React.Fragment>
          <Button
            style={{ background: "#01DF74", color: "#fff" }}
            onClick={() => this.onAcceptRequest(id)}
          >
            {this.props.t('ACCEPT')}
          </Button>
          <Button
          style={{ background: "#e50000", color: "#fff" }}
          onClick={() => this.onDeleteRequest(id)}
          >
            {this.props.t('DELETE')}
          </Button>
          </React.Fragment>
        ),
      },
    ];
    const columnsCylinder = [
      {
        title: this.props.t('CYLINDER_CODE'),
        dataIndex: "serial",
        key: "serial",
      },
      
      {
        title: this.props.t('COLOR'),
        dataIndex: "color",
        key: "color",
      },
      {
        title: this.props.t('VERIFY_DATE'),
        dataIndex: "checkedDate",
        key: "checkedDate",
      },
      {
        title: this.props.t('WEIGHT'),
        dataIndex: "weight",
        key: "weight",
      },
      {
        title: this.props.t('BRANCH'),
        dataIndex: "manufacture",
        key: "manufacture",
      },
    ];
    return (
      <div>
        <div className="modal fade" id="list-request" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{this.props.t('IMPORT_LIST_CREATE')}</h5>
                <button type="button" className="close" data-dismiss="modal">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <Form className="card">
                  <div className="card-body">
                    <div className="row">
                      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <Table
                          columns={columns}
                          dataSource={this.state.listRequest}
                        />
                        {this.state.displayTable && (
                          <Table
                            columns={columnsCylinder}
                            dataSource={this.state.listCylinde}
                            scroll={{ x: 1300 }}
                            pagination={{ defaultPageSize: 5 }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(ListRequest) ;
