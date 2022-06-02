import React from "react";
import { withNamespaces } from "react-i18next";
//Change language
import i18n from "../../../helpers/i18n";
import FormContainer from "./FormContainer.js";
import "./main.scss";

class Main extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const changeLanguage = (lng) => {
			i18n.changeLanguage(lng);
		};

		return (
			<main className="main-login-container">
				<div className="main-logo-login">
					<img style={{width: "60%"}}src="assets/img/sopet-logo.jpg" alt="LOGO" />
				</div>

				<div className="form-login">
					<div className="login">
						<h2 style={{ fontWeight: "bold" }}> {this.props.t("LOGIN")} </h2>
						<p>
							<small> {this.props.t("LOGIN_INTO_SYSTEM")} </small>
						</p>

						<FormContainer />
					</div>
				</div>
				<div className="language">
					<img
						onClick={() => changeLanguage("en")}
						style={{ height: 20, width: 30, margin: 5 }}
						src="https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/Us_flag_large_38_stars.png/1200px-Us_flag_large_38_stars.png"
						alt="English"
					/>
					<img
						onClick={() => changeLanguage("vi")}
						style={{ height: 20, width: 30, margin: 5 }}
						src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1280px-Flag_of_Vietnam.svg.png"
						alt="Vietnamese"
					/>
				</div>
			</main>
		);
	}
}

export default withNamespaces()(Main);
