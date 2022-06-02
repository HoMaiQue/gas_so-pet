import axios from 'axios';
import { ADDNEWAGENCY } from 'config';
import getUserCookies from 'getUserCookies';
import openNotificationWithIcon from "../js/helpers/notification";

async function addNewAgencyAPI(customerId, agencyCode, agencyName, address, email) {
    let result = {
        status: false,
        data: {},
        message: '',
    };
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            "userId": user_cookies.user.id,
            "customerId": customerId,
            "agencyCode": agencyCode,
            "agencyName": agencyName,
            "address": address,
            "email": email,
        };

        await axios.post(
            ADDNEWAGENCY, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token,
                "Content-Type": "application/json"
            }
            // , responseType: 'blob'
        })
            .then( response => {
                // console.log(response); 
                if (response.data.resCode === "SUCCESS-00006") {
                    openNotificationWithIcon("success","Thêm chi nhánh thành công")
                    result.status = true
                    result.data = response.data.data
                    // return result
                }
                else {
                    openNotificationWithIcon("error","Thêm chi nhánh thất bại")
                    // result.status = false
                    result.message = response.data.message
                    // return result
                }
            })
            .catch( error => {
                console.log('error: ', error);
                // result.status = false
                result.message = error
                // return result
                openNotificationWithIcon("error", "Đã có lỗi xảy ra")
            });
        return result
    }
    else {
        // return "Expired Token API";
        // result.status = false
        result.message = "Expired Token API"
        return result
    }
}

export default addNewAgencyAPI;