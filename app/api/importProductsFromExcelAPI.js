import axios from 'axios';
import { IMPORTPRODUCT } from 'config';
import getUserCookies from "getUserCookies";

async function importProductsFromExcelAPI(upload_file, fixerID, ListChildCompany, cylinderType, manufacture, assetType, rentalPartner) {
    const user_cookies = await getUserCookies();
    let data = new FormData();
    
    data.append('fixerId', fixerID);
    data.append('companyId', ListChildCompany);
    data.append('cylinderType', cylinderType);
    data.append('manufacture', manufacture);
    data.append('assetType', assetType);
    data.append('rentalPartner', rentalPartner);
    data.append('upload_file', upload_file);

    // console.log(data);
    if (user_cookies) {
        await axios.post(
            IMPORTPRODUCT, data,
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

export default importProductsFromExcelAPI;


