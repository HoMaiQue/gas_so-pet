import axios from 'axios';
import {GETEXPORTBYITSELF} from 'config';
import getUserCookies from 'getUserCookies'
import Constants from "Constants";
async function getExportByItSelf( userId = "",startDate="",endDate="",type = 0) {
    var user_cookies = await getUserCookies();
    if(startDate=="" && endDate=="" && userId=="" ){
    userId=user_cookies.user.id;
    startDate=new Date(0).toISOString();
    endDate=new Date().toISOString();
    }
    if(user_cookies.user.userRole==="Owner" && user_cookies.user.userType==="Factory"){
        userId=user_cookies.user.id;
        startDate=(new Date(startDate)).toISOString();
        endDate=(new Date(endDate)).toISOString(); 
    }
    if(user_cookies.user.userRole==="SuperAdmin" && user_cookies.user.userType==="General"){
        userId=user_cookies.user.id;
        startDate=(new Date(startDate)).toISOString();
        endDate=(new Date(endDate)).toISOString(); 
    }
    // userId=user_cookies.user.id;
    startDate=(new Date(startDate)).toISOString();
    endDate=(new Date(endDate)).toISOString();

    // console.log("user_cookies", user_cookies.user.parentRoot);
    let data;
    if (user_cookies) {
        let url = GETEXPORTBYITSELF + `?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
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

export default getExportByItSelf;