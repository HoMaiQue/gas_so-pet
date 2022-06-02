import axios from 'axios';
import {GETSALEBYITSELF} from 'config';
import getUserCookies from 'getUserCookies'
import Constants from "Constants";
async function getSaleByItSelf( userId = "",startDate="",endDate="",type = 0) {
    var user_cookies = await getUserCookies();
    if( userId=="" ){
    userId=user_cookies.user.id;
    }
    
    // userId=user_cookies.user.id;
    startDate=(new Date(startDate)).toISOString();
    endDate=(new Date(endDate)).toISOString();

    // console.log("user_cookies", user_cookies.user.parentRoot);
    let data;
    if (user_cookies) {
        let url = GETSALEBYITSELF + `?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
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

export default getSaleByItSelf;