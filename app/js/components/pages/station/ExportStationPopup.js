import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Button from "react-validation/build/button";
import required from "required";
import showToast from "showToast";
import getInformationFromCylinders from "getInformationFromCylinders";
import Constant from "Constants";
import { withNamespaces } from "react-i18next";
import ReactCustomLoading from "ReactCustomLoading";
var fileReader;

class ExportStationPopup extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      content: "",
      listProducts: [],
      error: "",
      loading: false,
    };
  }

  async submit(event) {
    /*   event.preventDefault();
           // if (this.state.position.length === 0) {
           //     showToast('Chưa chọn vị trí!', 3000);
           //     return;
           // }
           let data= this.form.getValues();
           let result= await this.props.addUser(data.email,data.name,data.address,"",USERROLE_ENUM[parseInt(data.userRole)].key);
           if(result)
           {
               const modal = $("#create-staff");
               modal.modal('hide');

           }

           return;*/
  }

  async submitTextFile(event) {
    event.preventDefault();
    //await this.getAllCylenders();
    /* if (!file) showToast('Vui lòng chọn file!', 3000);
         this.setState({isLoading: true});
         const result = await importProductsFromExcelAPI(file);
         this.setState({isLoading: false});
         console.log(result);
         if (result && result.status === 200) {
             if (typeof (result) !== 'undefined') {
                 showToast('Đưa vào thành công!', 3000);
                 this.props.refresh();
             }
             else {
                 //showToast("Xảy ra lỗi trong quá trình đăng ký",2000);
             }
             return;
         } else {
             showToast("Xảy ra lỗi trong quá trình import. Vui lòng kiểm tra lại dữ liệu", 2000);
         }
         return;
         $("#import-product").modal('hide');
         return;*/
  }

  handleFileUpload(event, isCheck) {
    this.setState({ loading: true });

    let that = this;
    let file = null;
    event.preventDefault();
    console.log(isCheck);
    if (isCheck) {
      //event.target.value = null
      this.fileInput.value = null;
      this.setState({
        file,
        error: "",
        listProducts: [],
        loading: false,
      });
    } else {
      file = event.target.files[0];
      fileReader = new FileReader();
      fileReader.onload = async function (event) {
        // The file's text will be printed here
        console.log("event.target.result;", event.target.result);
        let result = event.target.result;

        let array_id = result.split("\n");
        let cylinders_list = [];

        for (let i = 0; i < array_id.length; i++) {
          if (array_id[i].trim() !== "") {
            array_id[i].replace("\r", "").replace("\n", "");
            cylinders_list.push(array_id[i].trim());
          }
        }

        // for (let i = 0; i < that.props.listProductsAll.length; i++) {
        //     for(let j=0;j<array_id.length;j++)
        //     {
        //         if (array_id[j].trim()===that.props.listProductsAll[i].serial.trim()) {
        //             cylinders_list.push(that.props.listProductsAll[i]);
        //         }
        //     }

        // }
        let resultSearch = await getInformationFromCylinders(
          cylinders_list,
          Constant.EXPORT_TYPE
        );
        cylinders_list = resultSearch.data;
        console.log(resultSearch);
        if (resultSearch.status === 200) {
          if (resultSearch.data.hasOwnProperty("err_msg")) {
            showToast(resultSearch.data.err_msg);
            that.setState({
              loading: false,
              error: resultSearch.data.err_msg,
              listProducts: [],
            });
            return;
          }
          showToast("Lấy dữ liệu thành công", 3000);
          that.setState({
            loading: false,
            listProducts: cylinders_list,
            error: "",
          });
          that.props.getListProducts(cylinders_list);
        }
      };
      fileReader.readAsText(file);
    }
  }

  reloadPopup() {
    //this.setState({listProducts:[]})
  }

  render() {
    return (
      <div className="modal fade" id="export-modal" tabIndex="-1">
        <ReactCustomLoading isLoading={this.state.loading} />
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{this.props.t("EXPORT_STEP1")}</h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form
                ref={(c) => {
                  this.form = c;
                }}
                className="card"
                onSubmit={(event) => this.submitTextFile(event)}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{this.props.t("INPUT_INF")}</label>
                        <div style={{ display: "flex" }}>
                          <Input
                            accept=".txt"
                            className="form-control"
                            type="file"
                            name="upload_file"
                            onChange={(event) => this.handleFileUpload(event)}
                            validations={[required]}
                          />
                          <input type="reset" />
                        </div>
                      </div>
                      {this.state.error !== "" ? (
                        <div>
                          <label style={{ color: "red" }}>
                            {this.state.error}
                          </label>
                        </div>
                      ) : null}
                    </div>

                    <table
                      className="table table-striped table-bordered seednet-table-keep-column-width"
                      cellSpacing="0"
                    >
                      <thead className="table__head">
                        <tr>
                          <th className="text-center w-70px align-middle">
                            {this.props.t("ID_NUMBER")}
                          </th>
                          {/*<th className="w-120px text-center align-middle">Id</th>*/}
                          <th className="w-120px text-center align-middle">
                            {this.props.t("CYLINDER_CODE")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.listProducts.map((store, index) => {
                          return (
                            <tr key={index}>
                              <td scope="row" className="text-center">
                                {index + 1}
                              </td>

                              {/*<td scope="row" className="text-center">{store.id}</td>*/}
                              <td scope="row" className="text-center">
                                {store.serial}
                              </td>

                              {/*<td>{this.props.itemStore.name}</td>
                                                    <td>{this.props.itemStore.address}</td>
                                                    <td>{this.props.itemStore.address}, {this.props.itemStore.ward_name}, {this.props.itemStore.district_name}, {this.props.city_name} </td>
                                                    <td>{this.props.itemStore.job_title_names.map((title) => {
                                                    return title + " ";
                                                    })}</td>*/}
                              {/* <td className="text-center table-actions">

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

                <footer className="card-footer text-center">
                  <button
                    className="btn btn-primary"
                    disabled={
                      typeof this.state.listProducts === "undefined" ||
                      this.state.listProducts.length === 0
                    }
                    onClick={() => {
                      const modal = $("#export-modal");
                      modal.modal("hide");
                    }}
                    type="submit"
                    data-toggle="modal"
                    data-target="#export-driver"
                  >
                    {this.props.t("NEXT")}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => this.reloadPopup()}
                    type="reset"
                    data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
                  >
                    {this.props.t("CLOSE")}
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

export default withNamespaces()(ExportStationPopup);
