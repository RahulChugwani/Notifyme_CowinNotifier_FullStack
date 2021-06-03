const express = require('express');
const axios = require('axios');
let User = require('./models/user.model');
const moment = require('moment');
const cron = require('node-cron');

const emailNotifier = require('./emailNotifier');

exports.main = async function(){

    try {
        cron.schedule('50 20 * * *', async () => {
            console.log("checking availablity");
            getUserDetails();

        });
    } catch (e) {
        console.log('an error occured: ' + JSON.stringify(e, null, 2));
        throw e;
    }
}

const getUserDetails = async function() {

    var userDetails = [];

    User.find()
        .then( (users) => {
            console.log("USERS: ***************");
            console.log(users);
            userDetails = users;
            userDetails.map( user => {
                getVaccineSlotDetails(user, 0);  //flag =0, as this daily notifier 
            })

        })
        .catch( err => console.log("hello in err" + err));
}

exports.getVaccineAvailablityForUser = async function(user, flag) {

    
    try{
        console.log("after adding user in db now in getvaccinecheck for new user ***************");
        getVaccineSlotDetails(user, flag);
    }
    catch(e){
        console.log('an error occured for user vaccine: ' + JSON.stringify(e, null, 2));
        throw e;
    }
}

const getVaccineSlotDetails = async function(user, flag) {

    console.log("IN GET VACCINE SLOT FOR USER " + user.email);

    let today = moment().format('DD-MM-YYYY');
    let after7days = moment().add(7, 'day').format('DD-MM-YYYY');

    await getSlotsForDate(user, today, after7days, flag);

}

async function getSlotsForDate(user, today, after7days, flag) {

    let config = {
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'hi_IN',
            'X-Requested-With': 'XMLHttpRequest',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods' : '*'
        }
    };

    console.log("in getslots for date, where we will call cowin api");

    var headers1 = {
        'accept': 'application/json',
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : '*'
    }
    

    /*
    var trialurl = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=' +user.pincode+ '&date='+today;

    axios.get(trialurl)
        .then( res => res.json())
        .then( (data) => {
            console.log("in trial get req *******************");
            console.log(data);
        })
        .catch( err => {
            console.log("in errr trialget ****************");
            console.log(err);
        })
    */
    /*
    axios({
        method: 'get',
        url: "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=110001&date=05-05-2021",
        headers: headers1,
        withCredentials: true
    })
    .then( (res) => {
        console.log("got check");
        console.log(res);
    })
    .catch( (err)=>{
        console.log("erro got here in dummy api");
        console.log(err);
    })

    */
    
    var url1 = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode='+user.pincode+'&date='+today;
    var url2 = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode='+user.pincode+'&date='+after7days;
    axios.all(
        [
            axios.get(url1, config, {'withCredentials': true}),
            axios.get(url2 ,config, {'withCredentials': true})
        ]
    )
    .then( axios.spread( (res1, res2) => {

        var centers_data1 = res1.data.centers;
        var centers_data2 = res2.data.centers;

        var result = {};
        for(x in centers_data1){
            var eachCenter = centers_data1[x];

            var resEachCenter = {
                id: eachCenter.center_id,
                name: eachCenter.name,
                state: eachCenter.state_name,
                district: eachCenter.district_name,
                pincode: eachCenter.pincode,
                sessions: eachCenter.sessions.filter( session => session.min_age_limit <= user.age && session.available_capacity > 0)
            };

            if( resEachCenter.sessions.length){

                if( result[resEachCenter.id] ==  undefined)
                    result[resEachCenter.id] = resEachCenter;
                else{
                    for( x in resEachCenter.sessions){
                        result[resEachCenter.id].sessions.push( resEachCenter.sessions[x]);
                    }
                }
            }
        }
        
        
        for(x in centers_data2){
            var eachCenter = centers_data2[x];
            var resEachCenter = {
                id: eachCenter.center_id,
                name: eachCenter.name,
                state: eachCenter.state_name,
                district: eachCenter.district_name,
                pincode: eachCenter.pincode,
                sessions: eachCenter.sessions.filter( session => session.min_age_limit <= user.age && session.available_capacity > 0)
            };

            if( resEachCenter.sessions.length){
               
                if( result[resEachCenter.id] ==  undefined)
                    result[resEachCenter.id] = resEachCenter;
                else{
                    for( x in resEachCenter.sessions){
                        //console.log("check for");
                        //console.log(result[resEachCenter.id].sessions);
                        result[resEachCenter.id].sessions.push( resEachCenter.sessions[x]);
                    }
                }
                
            }

        }
        
        return result;
    })
    )
    .then( (result) => {
        notifyMe(result, today, user, flag);
    })
    .catch((err)=> {
        console.log("error while fetching from axios xowin data");
        console.log(err);
        notifyMeforError(err, user);
    })


}

async function notifyMeforError(err, user){

    User.deleteOne({ email: user.email, pincode: user.pincode, age: user.age  }, function (err) {
        if(err) console.log(err);
         console.log("Successful deletion for incorect pincode");
    });

    emailNotifier.sendEmailForError(user, (err, result) => {
        if(err) {
            console.log(err);
        }
    })
}

async function notifyMe(validCenters, date, user, flag){

    console.log("in notify me for user: " + user.email + " " + user.pincode + " " + user.age);
    console.log("*****************************");
    for(x in validCenters){
        console.log("############  " + x);
        console.log(validCenters[x]);
    }

    
        emailNotifier.sendEmail(user, flag, validCenters, date, (err, result) => {
            if(err) {
                console.error({err});
            }
        })

};
