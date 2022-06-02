import axios from 'axios';
import {GETLISTCUSTOMEREXCEL} from 'config';
import getUserCookies from 'getUserCookies'

async function getListCustomerExcelAPI(id, customerType) {
    // console.log("vao get list excel customer");
    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            "id": id,
            "customerType": customerType
        };
    
        await axios.post(
            GETLISTCUSTOMEREXCEL, params, {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token,
                    //"Content-Type": "application/json"
                }
                , responseType: 'blob'
            })
                .then(function(response) {
                    //console.log(response);
                    data = response.data;
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    //let disposition = response.headers['content-disposition']
                    let filename = `Danh_sach_${customerType}_.xlsx`;
                    link.setAttribute('download', filename); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                })
                .catch(function(err) {console.log(err);
                    data = err.response;
                });
            return data;
    }
    else {
        return "Expired Token API";
    }
}

export default getListCustomerExcelAPI;