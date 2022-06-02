import axios from 'axios';
import {GETLISTGENERALWAREHOUSE} from 'config';
import getUserCookies from 'getUserCookies';

async function getListGeneralWarehouse(id) {

    let data;
    let url=GETLISTGENERALWAREHOUSE;
    var user_cookies = await getUserCookies();
    
    if (user_cookies) {
        await axios.post(
            url,
            {id: id},
            {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token
                }
            }
        )
            .then(function (response) {
                data = response;
            })
            .catch(function (err) {
                data = err.response;
            });

        return data;
    }
    else {
        return "Expired Token API";
    }


}

export default getListGeneralWarehouse;


