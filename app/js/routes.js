import Constant from 'Constants';

export default [
    {
        "uuid": 20,
        "name": "BUSINESS",
        "icon": "fa fa-plus",
        "children": [
            {
                "uuid": 9,
                "name": Constant.MANUFACTURER_TITLE,
                "path": "/manufacturer",
                "icon": "fa fa-diamond",
            },
            {
                "uuid": 13,
                "name": Constant.FACTORY_CHILD,
                "path": "/factory-child",
                "icon": "fa fa-building",
            },
            {
                "uuid": 11,
                "name": Constant.PARTNER,
                "path": "/partner",
                "icon": "fa fa-handshake-o",
            },
            {
                "uuid": 24,
                "name": Constant.RENTALPARTNER,
                "path": "/rentPartner",
                "icon": "fa fa-handshake-o",
            },
            {
                "uuid": 12,
                "name": Constant.FIX_TITLE,
                "path": "/fixer",
                "icon": "fa fa-cogs",
            },
            {
                "uuid": 1,
                "name": Constant.FACTORY_TITLE,
                "path": "/factory",
                "icon": "fa fa-user-plus",
            },
            {
                "uuid": 4,
                "name": Constant.GENERAL_TITLE,
                "icon": "fa fa-users",
                "children": [
                    {
                        "uuid": 21,
                        "name": "DISTRIBUTOR",
                        "path": "/distributionAgency",
                        "icon": "fa fa-truck",
                    },
                    {
                        "uuid": 22,
                        "name": "INDUSTRIAL",
                        "path": "/industry",
                        "icon": "fa fa-industry",
                    },
                    {
                        "uuid": 23,
                        "name": "RESTAURANT",
                        "path": "/restaurant",
                        "icon": "fa fa-cutlery",
                    },
                ]
            },
            {
                "uuid": 4,
                "name": Constant.AGENCY_TITLE,
                "path": "/agency",
                "icon": "fa fa-cart-plus",
            },
        ]
    },
    {
        "uuid": 3,
        "name": Constant.PRODUCT_TITLE,
        "path": "/product",
        "icon": "fa fa-free-code-camp",
    },
    {
        "uuid": 14,
        "name": "MAP",
        "path": "/googlemap",
        "icon": "fa fa-globe",
    },
    {
        "uuid": 28,
        "name": "ORDER",
        "icon": "fa fa-suitcase",
        "children": [
            {
                "uuid": 18,
                "name": "CREATE_ORDER",
                "path": "/createOrder",
                "icon": "fa fa-shopping-cart",
            },
            {
                "uuid": 27,
                "name": "MENU_ORDER",
                "path": "/menuCreateOrder",
                "icon": "fa fa-bars",
            },
            {
                "uuid": 30,
                "name": "MENU_ORDER",
                "path": "/listReturn",
                "icon": "fa fa-bars",
            },
        ]
    },
    {
        "uuid": 10,
        "name": Constant.CUSTOMER_TITLE,
        "path": "/customer",
        "icon": "fa fa-address-book",
    },
    {
        "uuid": 19,
        "name": "VIEW_ORDER",
        "path": "/updateOrder",
        "icon": "fa fa-shopping-cart",
    },
    {
        "uuid": 26,
        "name": "MANAGEMENT",
        "icon": "fa fa-plus",
        "children": [
            {
                "uuid": 15,
                "name": "DRIVER",
                "path": "/driver",
                "icon": "fa fa-id-card",
            },
            {
                "uuid": 25,
                "name": "CAR",
                "path": "/car",
                "icon": "fa fa-car",
            },
            {
                "uuid": 30,
                "name": "CHECK_MAINTAIN",
                "path": "/thanh-tra",
                "icon": "fa fa-bug",
            },
            {
                "uuid": 17,
                "name": "MAINTENANCE_SCHEDULE",
                "path": "/createCalenderInspector",
                "icon": "fa fa-calendar",
            },
            {
                "uuid": 5,
                "name": Constant.REPORT_TITLE,
                "path": "/report",
                "icon": "fa fa-comments",
            },
        ]
    },
];