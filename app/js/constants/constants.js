const HTTP_SUCCESS_NOBODY = 204;
const HTTP_SUCCESS_CREATED = 201;
const HTTP_SUCCESS_BODY = 200;

const FACTORY_TITLE = "Thương Nhân Sở Hữu";
const GENERAL_TITLE = "GENERAL_TITLE";
const PARTNER = "Đối tác";
const RENTALPARTNER = "RENTAL_PARTNER"
const AGENCY_TITLE = "AGENCY_TITLE";
const STATION_TITLE = "Trạm Chiết Nạp";
const PRODUCT_TITLE = "PRODUCT_TITLE";
const DASHBOARD_TITLE = "DASHBOARD_TITLE";
// const DASHBOARD = "DashBoard"
const REPORT_TITLE = "REPORT_TITLE";
const CUSTOMER_TITLE = "Khách hàng"
const STAFF_TITLE = "Nhân Viên";
const USER_TITLE = "Người Dùng";
const DRIVER_TITLE = "Tài xế";
const MANUFACTURER_TITLE = "MANUFACTURER_TITLE";
const FIX_TITLE = "FIX_TITLE"
const FACTORY_CHILD = "FACTORY_CHILD";
const GENERAL_CHILD = "GENERAL_CHILD";
const SUPERADMIN = "SuperAdmin";
const GOVERMENT = "Government";
const FACTORY = "Factory";
const STATION = "Station";
const GENERAL = "General";
const AGENCY = "Agency";
const NORMAL = "Normal";
const DRIVER = "Driver";
const GENERALWAREHOUSE = "General_Warehouse";

const THANHTRA_TITLE = "thanh tra";
const THANHTRA = "ThanhTra";
const CAR_TITLE = 'car';
const CAR = "Car";
const PLACESTATUS_ENUM = [
    {
        value: 'Tại thương nhân sở hữu',
        key: 'IN_FACTORY'
    },
    {
        value: 'Tại trạm chiết xuất',
        key: 'IN_STATION'
    },
    {
        value: 'Tại khách hàng',
        key: 'IN_GENERAL'
    },
    {
        value: 'Đang vận chuyển',
        key: 'DELIVERING'
    },
    {
        value: 'Tại chi nhánh',
        key: 'IN_AGENCY'
    },
    {
        value: 'Tại người dân',
        key: 'IN_CUSTOMER'
    },
    {
        value: 'Nhà máy sửa chữa',
        key: 'IN_REPAIR'
    }
]

const COLOR_ENUM = [
    {
        value: 'Đỏ',
        key: 'Red'
    },
    {
        value: 'Xanh lá',
        key: 'Green'
    },
    {
        value: 'Xanh dương',
        key: 'Blue'
    },
    {
        value: 'Xám',
        key: 'Grey'
    },
    {
        value: 'Hồng',
        key: 'Pink'
    },
    {
        value: '6 Màu',
        key: '6 Colors'
    }
]


const STATUS_ENUM = [
    {
        value: 'Hết hạn sử dụng',
        key: 'DISABLED'
    },
    {
        value: 'Đủ gas',
        key: 'FULL'
    },
    {
        value: 'Hết gas',
        key: 'EMPTY'
    }]

const IMPORT_FACTORY = "IMPORT_FACTORY";
const EXPORT_FACTORY = "EXPORT_FACTORY";
const EXPORT_BACK_FACTORY = "EXPORT_BACK_FACTORY";

const IMPORT_STATION = "IMPORT_STATION";
const EXPORT_STATION = "EXPORT_STATION";
const OWNER = "Owner"
const EXPORT_TYPE = "EXPORT";
const TURN_BACK_TYPE = "TURN_BACK";
const IMPORT_TYPE = "IMPORT";
const SALE_TYPE = "SALE";
const GIVE_BACK_TYPE = "GIVE_BACK";
const FIXER = "Fixer";
const TURN_BACK_NOT_IN_SYSTEM = "TURN_BACK_NOT_IN_SYSTEM";
const MOVE = "MOVE";
const BUY = "BUY";
const RENT = "RENT";
const TO_FIX = "TO_FIX";
const RETURN_CYLINDER = "RETURN_CYLINDER";
const CHANGE_DATE = "CHANGE_DATE";
export default {
    // DASHBOARD,
    CAR_TITLE,
    CAR,
    THANHTRA_TITLE,
    THANHTRA,
    DRIVER_TITLE,
    DRIVER,
    EXPORT_TYPE,
    EXPORT_BACK_FACTORY,
    TURN_BACK_TYPE,
    IMPORT_TYPE,
    SALE_TYPE,
    GIVE_BACK_TYPE,
    HTTP_SUCCESS_BODY,
    HTTP_SUCCESS_CREATED,
    HTTP_SUCCESS_NOBODY,
    FACTORY_TITLE,
    GENERAL_TITLE,
    PARTNER,
    RENTALPARTNER,
    AGENCY_TITLE,
    STATION_TITLE,
    PRODUCT_TITLE,
    DASHBOARD_TITLE,

    REPORT_TITLE,
    USER_TITLE,
    SUPERADMIN,
    GOVERMENT,
    FACTORY,
    STATION,
    GENERAL,
    AGENCY,
    NORMAL,
    COLOR_ENUM,
    PLACESTATUS_ENUM,
    STATUS_ENUM,
    STAFF_TITLE,
    CUSTOMER_TITLE,
    IMPORT_FACTORY,
    EXPORT_FACTORY,
    IMPORT_STATION,
    EXPORT_STATION,
    MANUFACTURER_TITLE,
    FIXER,
    TURN_BACK_NOT_IN_SYSTEM,
    MOVE,
    BUY,
    RENT,
    TO_FIX,
    FIX_TITLE,
    RETURN_CYLINDER,
    CHANGE_DATE,
    FACTORY_CHILD,
    GENERAL_CHILD,
    OWNER,
    GENERALWAREHOUSE
}
