import axios from 'axios';
import {GETPRINTGETTURNBACKTDATAPRINT} from 'config';
import getUserCookies from 'getUserCookies'
import Constants from "Constants";
async function getTurnbackDataPrint( idTurnback = "5f60da0b5cc87f2c5c6e22b0,5f509d742e0fa9f5c1060098") {
    var user_cookies = await getUserCookies();
    // console.log("user_cookies", user_cookies.user.parentRoot);
    let data;
    if (user_cookies) {
        let url = GETPRINTGETTURNBACKTDATAPRINT + `?idTurnback=${idTurnback}`
        //console.log("user_cookies",user_cookies);
        await axios.get(
            url,
            {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token
                    /*"Authorization": "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
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
    } else {
        return "Expired Token API";
    }
}

export default getTurnbackDataPrint;