import axios from 'axios';
import { GETALLFIXEREXPORTCELL } from 'config';
import getUserCookies from 'getUserCookies';
import openNotificationWithIcon from "../js/helpers/notification";

async function getAllFixer_ExportCellAPI() {
    let result = {
        status: false,
        data: [],
        message: '',
    };
    var user_cookies = await getUserCookies();
    console.log('user_cookies', user_cookies)
    if (user_cookies) {
        let params = {
            "userId": user_cookies.user.id           
        };

        await axios.post(
            GETALLFIXEREXPORTCELL, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token,
                "Content-Type": "application/json"
            }
            // , responseType: 'blob'
        })
            .then( response => {
                console.log('GETALLFIXEREXPORTCELL', response.data); 
                if (response.data.resCode === "SUCCESS-00009") {
                    // openNotificationWithIcon("success","Lấy thông tin xuất hàng để in thành công")
                    result.status = true
                    result.data = response.data.data
                    // return result
                }
                else {
                    // openNotificationWithIcon("error","Lấy thông tin xuất hàng để in thất bại")
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
                // openNotificationWithIcon("error", "Đã có lỗi xảy ra")
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

export default getAllFixer_ExportCellAPI;