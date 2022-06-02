import axios from 'axios';
import {UPDATEUSERURL} from 'config';
import getUserCookies from "getUserCookies";

async function updateUserAPI(target_id, name, new_password="", address, warehouseCode, customerCode, invoiceAddress, groupCustomer, LAT, LNG, agencyCode,invoiceName) {

    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {};
        if (new_password === "") {
            params = {
                "target_id": target_id,
                "name": name,
                "address": address,
                "warehouseCode": warehouseCode,
                "customerCode": customerCode,
                "invoiceAddress": invoiceAddress,
                "invoiceName":invoiceName,
                "groupCustomer": groupCustomer,
                "LAT": LAT,
                "LNG": LNG,
                "agencyCode": agencyCode,
                
            };
        }
        else {
            params = {
                "target_id": target_id,
                "name": name,
                "new_password": new_password,
                "address": address,
                "warehouseCode": warehouseCode,
                "customerCode": customerCode,
                "invoiceAddress": invoiceAddress,
                "invoiceName":invoiceName,
                "groupCustomer": groupCustomer,
                "LAT": LAT,
                "LNG": LNG,
                "agencyCode": agencyCode,
                
            };
        }
        
        // console.log(params);
        await axios.post(
            UPDATEUSERURL, params, {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token
                    /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
                }
            })
            .then(function (response) {
                //console.log(response);
                data = response;
            })
            .catch(function (err) {
                console.log(err);
                data = err.response;
            });


        return data;
    } 
    else {
        return "Expired Token API";
    }
}

export default updateUserAPI;


