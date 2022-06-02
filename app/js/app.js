// import scss
import '../scss/styles.scss';

// React Dom
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

//Change language
import './helpers/i18n';

// Redux
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import store from 'store';
const history = syncHistoryWithStore(hashHistory, store);
// Components
import Main from 'Main';
import Main2 from 'Main2';
import Login from 'Login';
import Register from 'Register';
import RegisterSuccess from 'RegisterSuccess';
import DashBoard from "DashBoard";
import requireLogin from 'requireLogin';
import Product from 'Product';
import General from 'General';
import Agency from 'Agency';
import Factory from 'Factory';
import FactoryChild from 'FactoryChild';
import Report from 'Report';
import User from 'User';
import Station from 'Station';
import Staff from 'Staff';
import Manufacturer from 'Manufacturer';
import Customer from 'Customer';
import Partner from 'Partner';
import Fixer from 'Fixer';
import ChangePassword from './components/changePassword/index';
import ChangeInformationUser from './components/changeInforUser/index';
import Driver from './../js/components/pages/driver/index';
import ThanhTra from './components/pages/thanh-tra/index';
import RentalPartner from './components/pages/partner/index';
import Industry from './components/pages/general/Industry';
import MenuCreateOrder from './components/pages/create-order/menuCreateOrder'
import Restaurant from './components/pages/general/RestaurantApartment';
// import Thanhtra from './../js/components/Thanhtra/index';
import CreateOrderAgent from "./components/pages/general/create-order-general/index"
import GoogleMapContainer from './components/googlemap/index';
import DetailDataExport from './components/pages/seeDetailDataExport/index';
import DatailHistoryDataImport from './components/pages/seeDatailDataImport/index';
import CreateCalenderInspector from './components/pages/create-calender-inspector/index';
import CreateOrder from './components/pages/create-order/index';
import UpdateOrder from './components/pages/updateOrder/index';
import StaffCreate from './components/pages/create-staff/index';
import formListReturn from './components/pages/createListReturn/FormListReturn';
import formListReturnAgent from './components/pages/general/createListReturn/FormListReturn';
import Turnback6Month from './components/pages/turnback6month/index';
import MenuCreateOrderAgent from "./components/pages/general/create-order-general/menuCreateOrder"
//import * as firebase from 'firebase';
import Car from './components/pages/Car/car'
import ShippingManager from './components/pages/shippingmanager';
import GeneralStaff from './components/pages/generalWarehousePages/factoryChild/factoryChild';

ReactDOM.render(
        <Provider store={store}>
            <Router history={history}>
                <Route path="/" component={Main}>
                    <IndexRoute component={Login} />
                    <Route path="login" component={Login} />

                    {/*Register*/}
                    <Route path="register" component={Register} />
                    <Route path="register-success" component={RegisterSuccess} />

                    {/*Dashboard*/}
                    {/* <Route path="/dashboard" component={DashBoard} onEnter={requireLogin} /> */}

                </Route>
                <Route component={Main2}>
                    <Route path="/dashboard" component={DashBoard} onEnter={requireLogin} />
                    <Route path="/product" component={Product} onEnter={requireLogin} />
                    <Route path="/factory" component={Factory} onEnter={requireLogin} />
                    <Route path="/general" component={General} onEnter={requireLogin} />
                    <Route path="/distributionAgency" component={General} onEnter={requireLogin} />
                    <Route path="/industry" component={Industry} onEnter={requireLogin} />
                    <Route path="/restaurant" component={Restaurant} onEnter={requireLogin} />
                    <Route path="/menuCreateOrder" component={MenuCreateOrder} onEnter={requireLogin} />
                    <Route path="/agency" component={Agency} onEnter={requireLogin} />
                    <Route path="/report" component={Report} onEnter={requireLogin} />
                    <Route path="/user" component={User} onEnter={requireLogin} />
                    <Route path="/station" component={Station} onEnter={requireLogin} />
                    <Route path="/staff" component={Staff} onEnter={requireLogin} />
                    <Route path="/manufacturer" component={Manufacturer} onEnter={requireLogin} />
                    <Route path="/customer" component={Customer} onEnter={requireLogin} />
                    <Route path="/partner" component={Partner} onEnter={requireLogin} />
                    <Route path="/rentPartner" component={RentalPartner} onEnter={requireLogin} />
                    <Route path="/factory-child" component={FactoryChild} onEnter={requireLogin} />
                    <Route path="/general-factory-child" component={GeneralStaff} onEnter={requireLogin} />
                    <Route path="/fixer" component={Fixer} onEnter={requireLogin} />
                    <Route path="/changepassword" component={ChangePassword} onEnter={requireLogin} />
                    <Route path="/changeinforuser" component={ChangeInformationUser} onEnter={requireLogin} />
                    <Route path="/driver" component={Driver} onEnter={requireLogin} />
                    <Route path='/listReturn' component={formListReturn} onEnter={requireLogin}/>
                    {/* <Route path="/driver" component={Thanhtra} onEnter={requireLogin} /> */}
                    <Route path="/car" component={Car} onEnter={requireLogin} />

                    <Route path="/googlemap" component={GoogleMapContainer} onEnter={requireLogin} />
                    <Route path="/seetailddataexport" component={DetailDataExport} onEnter={requireLogin} />
                    <Route path="/seetailddataSaler/:id" component={DetailDataExport} onEnter={requireLogin} />
                    <Route path="/seetailhistoryImport" component={DatailHistoryDataImport} onEnter={requireLogin} />
                    <Route path="/thanh-tra" component={ThanhTra} onEnter={requireLogin} />
                    <Route path="/createCalenderInspector" component={CreateCalenderInspector} onEnter={requireLogin} />
                    <Route path="/createOrder" component={CreateOrder} onEnter={requireLogin} />
                    <Route path="/updateOrder" component={UpdateOrder} onEnter={requireLogin} />
                    <Route path="/create-staff" component={StaffCreate} onEnter={requireLogin} />
                    <Route path="/shippingmanager" component={ShippingManager} onEnter={requireLogin} />
                    <Route path="/turnback6month" component={Turnback6Month} onEnter={requireLogin} />
                    {/* <Route path="/car" component={Car} onEnter={requireLogin} /> */}
                    <Route path="/createOrderAgent" component={CreateOrderAgent} onEnter={requireLogin} />
                    <Route path="/menuCreateOrderAgent" component={MenuCreateOrderAgent} onEnter={requireLogin} />
                    <Route path='/listReturnAgent' component={formListReturnAgent} onEnter={requireLogin}/>


                </Route>

            </Router>
        </Provider>,
    document.getElementById('root')
);
