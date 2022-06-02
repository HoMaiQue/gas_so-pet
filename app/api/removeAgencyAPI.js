import axios from 'axios';
import { REMOVEAGENCY } from 'config';
import getUserCookies from 'getUserCookies';
import openNotificationWithIcon from "../js/helpers/notification";

async function removeAgencyAPI(agencyId) {
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
        };

        await axios.post(
            REMOVEAGENCY, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token,
                //"Content-Type": "application/json"
            }
            // , responseType: 'blob'
        })
            .then( response => {
                // console.log(response); 
                if (response.data.resCode === "SUCCESS-00007") {
                    openNotificationWithIcon("success","Xóa chi nhánh thành công")
                    result.status = true
                    result.data = response.data.data
                    // return result
                }
                else {
                    openNotificationWithIcon("error","Xóa chi nhánh thất bại")
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

export default removeAgencyAPI;