// Them thuong hieu
import React from "react";
import PropType from "prop-types";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Textarea from "react-validation/build/textarea";
import Select from "react-validation/build/select";
import Button from "react-validation/build/button";
import required from "required";
import showToast from "showToast";
import Constant from "Constants";
import { withNamespaces } from 'react-i18next';

class AddManufacturerPopup extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      color: "",
      weight: "",
      checkedDate: "",
      status: "",
      emptyOrFull: "",
      currentImportPrice: 0,
      idCardBase64: "",
      option: "",
    };
  }


  componentDidMount() { }

  componentDidUpdate(prevProps) { }

  getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      // console.log("Error: ", error);
    };
  }

  fileChangedHandler = (event) => {
    this.setState({ selectedFile: event.target.files[0] });

    let idCardBase64 = "";
    this.getBase64(event.target.files[0], (result) => {
      idCardBase64 = result;
      this.setState({ idCardBase64 });
    });
  };

  selectOptionHandler = (event) => {
    this.setState({ option: event.target.value });
  };

  async submit(event) {
    event.preventDefault();
    // console.log("abe1tete", this.state.idCardBase64);

    let data = this.form.getValues();

    let res = await this.props.addManufacturer(
      data.name,
      data.phone,
      data.address,
      this.state.idCardBase64,
      data.origin,
      data.mass,
      data.ingredient,
      data.preservation,
      data.appliedStandard,
      data.optionSafetyInstructions,
      data.safetyInstructions
    );

    if (res) {
      const modal = $("#create-manufacturer");
      modal.modal("hide");
    }
    // window.location.reload();
  }

  render() {
    return (
      <div className="modal fade" id="create-manufacturer" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{this.props.t("CREATE_MANUFACTURER_TITLE")}</h5>
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
                onSubmit={(event) => this.submit(event)}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{this.props.t("NAME")}</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="name"
                          validations={[required]}
                        />
                      </div>
                      <div className="form-group">
                        <label>{this.props.t("PHONE")}</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="phone"
                          validations={[required]}
                        />
                      </div>
                      <div className="form-group">
                        <label>{this.props.t("AREA")}</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="address"
                        />
                      </div>
                      <div className="form-group">
                        <label>{this.props.t("ORIGIN")}</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="origin"
                        />
                      </div>
                      <div className="form-group">
                        <label>{this.props.t("WEIGHT_BAG")}</label>
                        <Input
                          className="form-control"
                          name="mass"
                          type="text"
                        />
                      </div>
                      <div className="form-group">
                        <label>{this.props.t("ELEMENT")}</label>
                        <Textarea
                          className="form-control"
                          name="ingredient"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{this.props.t("PRESERVATION")}</label>
                        <Textarea
                          className="form-control"
                          name="preservation"
                        />
                      </div>
                      <div className="form-group">
                        <label>{this.props.t("STANDARD")}</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="appliedStandard"
                        />
                      </div>
                      <div className="form-group">
                        <label>{this.props.t("SAFE")}</label>
                        <Select
                          className="form-control"
                          style={{ marginBottom: "15px" }}
                          value={this.state.option}
                          name="optionSafetyInstructions"
                          onChange={this.selectOptionHandler}>
                          <option value=''>{this.props.t("CHOOSE")}</option>
                          <option value="Yes">{this.props.t("YES")}</option>
                          <option value="No">{this.props.t("NO")}</option>
                        </Select>
                        <Textarea
                          className="form-control"
                          name="safetyInstructions"
                          disabled={((this.state.option === "No") || (this.state.option === ""))}
                        />
                      </div>
                      <div>{this.props.t("IMAGE")}</div>
                      <Input
                        type="file"
                        name="logo"
                        data-provide="dropify"
                        onChange={(event) => this.fileChangedHandler(event)}
                        validations={[required]}
                      />
                    </div>
                  </div>
                </div>

                <footer className="card-footer text-center">
                  <Button className="btn btn-primary">{this.props.t("SAVE")}</Button>
                  <button
                    className="btn btn-secondary"
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

export default withNamespaces()(AddManufacturerPopup);
