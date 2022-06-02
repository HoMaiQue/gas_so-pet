import axios from 'axios';
import { IMPORTCYLINDERBYEXCEL } from 'config';
import getUserCookies from "getUserCookies";

async function sendReqCreFromExcelAPI(upload_file, id_ReqTo, cylinderType, manufacture, assetType, rentalPartner) {
    const user_cookies = await getUserCookies();
    let data = new FormData();

    // console.log("some info", id_ReqTo, upload_file, cylinderType, manufacture, assetType, rentalPartner);
    
    data.append('id_ReqTo', id_ReqTo);
    data.append('cylinderType', cylinderType);
    data.append('manufacture', manufacture);
    data.append('assetType', assetType);
    data.append('rentalPartner', rentalPartner);
    data.append('upload_file', upload_file);

    // console.log("import excelelel", data);
    if (user_cookies) {
        await axios.post(
            IMPORTCYLINDERBYEXCEL, data,
            {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token,
                    //"Content-Type": "multipart/form-data"
                }
            }
        ).then(function (response) {

            data = response;
        }).catch(function (err) {
            console.log("tester", err);
            data = err.response;
        });
        return data;
    }
    else {
        return "Expired Token API";
    }
}

export default sendReqCreFromExcelAPI;


