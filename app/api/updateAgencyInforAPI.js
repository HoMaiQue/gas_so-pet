import axios from 'axios';
import { UPDATEAGENCYINFOR } from 'config';
import getUserCookies from 'getUserCookies';
import openNotificationWithIcon from "../js/helpers/notification";
import "../assets/css/notification.css"

async function updateAgencyInforAPI(agencyId, agencyCode, agencyName, address, email) {
    // console.log('agencyId, agencyCode, agencyName, address, email', agencyId, agencyCode, agencyName, address, email)
    let result = {
        status: false,
        data: {},
        message: '',
    };
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            "userId": user_cookies.user.id,
            "agencyId": agencyId,
            "agencyCode": agencyCode,
            "agencyName": agencyName,
            "address": address,
            "email": email,
        };

        await axios.post(
            UPDATEAGENCYINFOR, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token,
                "Content-Type": "application/json"
            }
            // , responseType: 'blob'
        })
            .then( response => {
                // console.log(response); 
                if (response.data.resCode === "SUCCESS-00004") {
                    openNotificationWithIcon("success", "Sửa thông tin chi nhánh thành công")
                    result.status = true
                    result.data = response.data.data
                }
                else {
                    openNotificationWithIcon("error", "Sửa thông tin chi nhánh thất bại")
                    result.message = response.data.message
                }
            })
            .catch( error => {
                console.log('error: ', error);                
                openNotificationWithIcon("error", "Đã có lỗi xảy ra")
                result.message = error
            });
        return result;
    }
    else {
        // return "Expired Token API";
        result.message = "Expired Token API";
        return result
    }
}

export default updateAgencyInforAPI;