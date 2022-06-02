//Nhập hồi lưu - nhập hồi lưu - Bước 1
import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import required from "required";
import showToast from "showToast";
import getInfoFromCylinders from "getInfoFromCylinders";
//import Constant from "Constants";
import Constants from "Constants";
import { withNamespaces } from "react-i18next";
import ReactCustomLoading from "ReactCustomLoading";
//import getDestinationUserAPI from 'getDestinationUserAPI';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

var fileReader;

class ExportFactoryStationPopup extends React.Component {
	constructor(props) {
		super(props);
		this.form = null;
		this.state = {
			content: "",
			listProducts: [],
			listErrorProducts:{errCyl_notCreated: [],errCyl_delivering:[], errCyl_current: [], errCyl_inFixer: [], errCyl_inWarehouse: [], errCurCyl_inWarehouse: []},
			error: "",
			loading: false,
			//listFactoryImport: []
		};
	}

	/*async getDesImport(user_type, action_type) {

    // Call api
    const dataDes = await getDestinationUserAPI(user_type, action_type);
    console.log("getdesimport", dataDes);
    if (dataDes) {
      if (dataDes.status === Constants.HTTP_SUCCESS_BODY) {

        let listFactoryImport = [];
        for (let i = 0; i < dataDes.data.length; i++) {
          listFactoryImport.push({
                value: dataDes.data[i].id,
                label: dataDes.data[i].name, ...dataDes.data[i]
            })
        }

        this.setState({ listFactoryImport: listFactoryImport });
      } 
      else {
        showToast(dataDes.data.message ? dataDes.data.message : dataDes.data.err_msg, 2000);
      }

    //this.setState({image_link: profile.data.company_logo});
    }
    else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
}

  async componentDidMount() {
    await this.getDesImport("", "IMPORT");
  }*/

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

	handleFileUpload(event) {
		let that = this;
		let file = event.target.files[0];
		that.setState({ loading: true });

		fileReader = new FileReader();
		fileReader.onload = async function (event) {
			// The file's text will be printed here
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
			let resultSearch = await getInfoFromCylinders(
				cylinders_list,
				Constants.TURN_BACK_TYPE
			);
			cylinders_list = resultSearch.data;
			if (cylinders_list.length === 0) {
				that.setState({
					loading: false,
				});
			} else {
				if (resultSearch.status === 200) {
					if (resultSearch.data.hasOwnProperty("err_msg")) {

						const listErrorProducts = {};
						listErrorProducts.errCyl_notCreated = resultSearch.data.errCyl_notCreated;
						listErrorProducts.errCyl_delivering = resultSearch.data.errCyl_delivering;
						listErrorProducts.errCyl_current = resultSearch.data.errCyl_current;
						listErrorProducts.errCyl_inFixer = resultSearch.data.errCyl_inFixer;
						listErrorProducts.errCyl_inWarehouse = resultSearch.data.errCyl_inWarehouse;
						listErrorProducts.errCurCyl_inWarehouse = resultSearch.data.errCurCyl_inWarehouse;

						showToast(resultSearch.data.err_msg);
						that.setState({
							loading: false,
							error: resultSearch.data.err_msg,
							listProducts: resultSearch.data.success_cylinders,
							listErrorProducts
						});
						that.props.getListProducts(resultSearch.data.success_cylinders);
						return;
					}
					that.setState({
						loading: false,
						listProducts: cylinders_list,
						error: "",
					});
					that.props.getListProducts(cylinders_list);
				}
			}
		};
		fileReader.readAsText(file);
	}

	renderErrorCylindersTable = (label,data) => {
		return (
		<div>
			<h3>{label}</h3>
			<table
				className="table table-striped table-bordered seednet-table-keep-column-width"
				cellSpacing="0"
			>
				<thead className="table__head">
					<tr>
						<th className="text-center w-70px align-middle">
							{this.props.t("ID_NUMBER")}
						</th>
						<th className="w-120px text-center align-middle">
							{this.props.t("CYLINDER_CODE")}
						</th>
					</tr>
				</thead>
				<tbody>
					{data.map((store, index) => {
						return (
							<tr>
								<td scope="row" className="text-center">
									{index + 1}
								</td>
								<td scope="row" className="text-center">
									{store}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
		);
	}
	renderErrorCylindersTableGroupByWarehouse = (data) => {
		return (
		<div>
			{data.map(warehouse => {
			return ( 
				<div key={warehouse.name}>
				<h3>Bình đang ở kho {warehouse.name}</h3>
				<table
					className="table table-striped table-bordered seednet-table-keep-column-width"
					cellSpacing="0"
				>
					<thead className="table__head">
						<tr>
							<th className="text-center w-70px align-middle">
								{this.props.t("ID_NUMBER")}
							</th>
							<th className="w-120px text-center align-middle">
								{this.props.t("CYLINDER_CODE")}
							</th>
						</tr>
					</thead>
					<tbody>
						{warehouse.serials&&warehouse.serials.map((store, index) => {
							return (
								<tr>
									<td scope="row" className="text-center">
										{index + 1}
									</td>
									<td scope="row" className="text-center">
										{store}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			)
			})}
		</div>
		);
	}

	// downloadInnerHtml = (filename, elId, mimeType) => { 
	// 	let elHtml = document.getElementById(elId).innerHTML;
	// 	let link = document.createElement('a');
	// 	mimeType = mimeType || 'text/plain';
	// 	link.setAttribute('download', filename);
	// 	link.setAttribute('href', 'data:' + mimeType  +  ';charset=utf-8,' + encodeURIComponent(elHtml));
	// 	link.click(); 
	// }

	handleDownload = () => {
		  const errCurCyl_inWarehouse = [];
		  for(let i = 0; i < this.state.listErrorProducts.errCurCyl_inWarehouse.length; i++){
			errCurCyl_inWarehouse.push('--Bình đang ở kho: ' + this.state.listErrorProducts.errCurCyl_inWarehouse[i].name);
			errCurCyl_inWarehouse.push(this.state.listErrorProducts.errCurCyl_inWarehouse[i].serials.join("\r\n"));
			if(i !== (this.state.listErrorProducts.errCurCyl_inWarehouse.length - 1 ))
				errCurCyl_inWarehouse.push("\r\n");
		  } 
		  const element = document.createElement("a");
		  const file = new Blob(
			[
			  "--Bình đã hồi lưu--: ",
			  "\r\n",
			  this.state.listErrorProducts.errCyl_current,
			  "\r\n\r\n",
			  "--Bình đang vận chuyển--: ",
			  "\r\n",
			  this.state.listErrorProducts.errCyl_delivering,
			  "\r\n\r\n",
			  "--Bình đang ở kho khác--: ",
			  "\r\n",
			  this.state.listErrorProducts.errCyl_inWarehouse.join("\r\n"),
			  "\r\n\r\n",
			  errCurCyl_inWarehouse.join("\r\n"),
			  "\r\n\r\n",
			  "--Bình đang ở nhà máy khác--: ",
			  "\r\n",
			  this.state.listErrorProducts.errCyl_inFixer,
			  "\r\n\r\n",
			  "--Bình chưa khai báo--: ",
			  "\r\n",
			  this.state.listErrorProducts.errCyl_notCreated,
			],
			{ type: "text/plain;charset=utf-8" }
		  );
		  element.href = URL.createObjectURL(file);
		  element.download = "binhkhongdat.txt";
		  document.body.appendChild(element);
		  element.click();
	  };
	
	render() {
		return (
			<div className="modal fade" id="export-cylinder-type-new" tabIndex="-1">
				<ReactCustomLoading isLoading={this.state.loading} />

				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">{this.props.t("IMPORT_STEP1")}</h5>
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
													<input
														type="reset"
														onClick={() => {
															this.setState({ error: "" });
														}}
													/>
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
										</div>
										<div>
										<div>
											<Tabs defaultActiveKey="1" >
												<TabPane tab="Bình đạt" key="1">
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
																<tr>
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
												</TabPane>
												<TabPane tab="Bình không đạt" key="2">
													<button className="btn btn-success" onClick={() => this.handleDownload()}>Tải file</button>
														<div id="error-tables">
															{this.renderErrorCylindersTable('Bình chưa khai báo',this.state.listErrorProducts.errCyl_notCreated)}
															{this.renderErrorCylindersTable('Bình đang vận chuyển',this.state.listErrorProducts.errCyl_delivering)}
															{this.renderErrorCylindersTable('Bình đã hồi lưu',this.state.listErrorProducts.errCyl_current)}
															{this.renderErrorCylindersTable('Bình ở nhà máy khác',this.state.listErrorProducts.errCyl_inFixer)}
															{this.renderErrorCylindersTable('Bình ở kho khác',this.state.listErrorProducts.errCyl_inWarehouse)}
															{this.renderErrorCylindersTableGroupByWarehouse(this.state.listErrorProducts.errCurCyl_inWarehouse)}																														
														</div>
												</TabPane>
											</Tabs>
										</div>
									</div>
								</div>

								<footer className="card-footer text-center">
									<button
										disabled={
											typeof this.state.listProducts === "undefined" ||
											this.state.listProducts.length === 0
										}
										className="btn btn-primary"
										//disabled={(typeof this.state.listProducts === "undefined" || this.state.listProducts.length === 0)}
										onClick={() => {
											const modal = $("#export-cylinder-type-new");
											modal.modal("hide");
										}}
										type="submit"
										data-toggle="modal"
										data-target="#turn-back-driver"
									>
										{this.props.t("NEXT")}
									</button>
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

export default withNamespaces()(ExportFactoryStationPopup);
