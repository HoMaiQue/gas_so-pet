import axios from 'axios';
import {INSPECTOR} from 'config';
import getUserCookies from 'getUserCookies'
import Constants from "Constants";
async function getInspectorCheckList( idSchedule ) {
    var user_cookies = await getUserCookies();

    // console.log("user_cookies", user_cookies.user.parentRoot);
    let data;
    if (user_cookies) {
        let url = INSPECTOR + `?idSchedule=${idSchedule}`
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
        console.log("99999999999999999999999999999",data)
    } else {
        return "Expired Token API";
    }
}

export default getInspectorCheckList;