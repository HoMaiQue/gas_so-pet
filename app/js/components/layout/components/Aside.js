import React from "react";
import { Link } from 'react-router';
import SimpleBarReact from "simplebar-react";
import { withNamespaces } from 'react-i18next';
import Constant from 'Constants';
import Menu from './Menu';

export default withNamespaces()(({ t }) => (
    <div className="sidebar">
        <div className="sidebar-background" />
        <div className="sidebar-wrapper">
            <div className="sidebar-content">
                <SimpleBarReact style={{ maxHeight: "calc(100vh - 75px - 50px)" }}>
                    <ul className="nav">
                        <li className="nav-item">
                            <Link to="/dashboard">
                                <i className="nav-item-icon fa fa-bar-chart" />
                                <p>{t(Constant.DASHBOARD_TITLE)}</p>
                            </Link>
                        </li>
                        <li className="nav-section">
                            <span className="sidebar-mini-icon">
                                <i className="fa fa-ellipsis-h" />
                            </span>
                            <h4 className="text-section">Danh sách các Menu</h4>
                        </li>
                        <Menu />
                    </ul>
                </SimpleBarReact>
            </div>
        </div>
    </div>
));