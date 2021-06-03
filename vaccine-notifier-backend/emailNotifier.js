let nodemailer = require('nodemailer');

let nodemailerTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
      }
});


function createTemplate(message, centerDetails, date, user){

    let extendedMessage = message;
    console.log("in creating template email: slotdetails: ");
    extendedMessage += 'Vaccine availability for next 14days from <strong>' +date+ '</strong> for you registered pincode <strong>' +user.pincode+ ' </strong>in the following centers: '+
    '<br/><br/><div style="margin: 10px;">';


    for(x in centerDetails){
        var eachMsg = '<hr color="black"><h3 style="color:red">Center Name: ' + centerDetails[x].id + ' - ' +  centerDetails[x].name+ ', ' + centerDetails[x].district +'<h3><hr color="black">' +
                      '<table style="border: 1px solid black; text-align: center; padding:3%;"><tr style="color:grey"><td>Sr No.</td><td>Date</td><td>Avail. Units</td><td>Min Age.</td><td>Vaccine Name</td></tr>';

        for( s in centerDetails[x].sessions){
            session = centerDetails[x].sessions[s];
            var number = Number(s)+Number(1);
            eachMsg += ('<tr><td><p style="color: black"><i>'+ number +'</i></td><td><strong>' + session.date+ '</strong></td><td>'+ session.available_capacity+ '</td>'+
                '<td>'+ session.min_age_limit+ '+</td><td>'+ session.vaccine+ '</td></tr>' );
            
        }

        eachMsg += '</table>';
        extendedMessage += eachMsg;
    }

    extendedMessage += "</div>";
    let infodata = '<div><h6>To unsubscribe from getting notifications click, <a href="">Unsubscribe</a> </h6><p><i>We treat all your personal data with care and only uses it for sending email notifications.</i><br/>'+ 
    '<i>(Trying my best to provide accurate informations, as this is not official intiative, the data might not be exact.'+
    'Please keep checking your COWIN website and Aarogya Setu application.)</i></p>'+
    '<p>Made with &#128151; by Rahul.</p></div>';

    extendedMessage += infodata;

    return extendedMessage;
}
exports.sendEmailForError = function(user) {

    var subjectline = '';
    var message = '';

    subjectLine = 'Incorrect pincode registered with NotifyMe(A CoWIN-Notifier)';
    message = 'Hi there, <br/> Thanks for registering with us. <br/> But you have given the wrong Pincode which does not exist.<br/>'+
            'Please register again by filling out the form with right details on our website <a href="" > NotifyMe (CoWIN-Notifier)</a>'+
            '<div><p><i>We treat all your personal data with care and only uses it for sending email notifications.</i><br/>'+ 
        '<i>(Trying my best to provide accurate informations, as this is not official intiative, the data might not be exact.'+
        'Please keep checking your COWIN website and Aarogya Setu application.)</i></p>'+
        '<p>Made with &#128151; by Rahul.</p></div>';

    let options = {
        from: String('NotifyMe (A Vaccine-Notifier)' + process.env.MAIL_USERNAME),
        to: user.email,
        subject: subjectLine,
        html: message
    };

    nodemailerTransporter.sendMail(options, (error, info) => {
        if (error) {
            return callback(error);
        }
        callback(error, info);
    });

}
exports.sendEmail = function (user, flag, centerDetails, date, callback) {

    var subjectLine = '';
    var message = '';
    if( flag == 1){
        subjectLine = 'Thanks for registering with NotifyMe(A CoWIN-Notifier)';
        message = 'Hi there, <br/> Thanks for registering with us. We will notify you daily with vaccine-availablity at you registered pincode. <br/>';
    }
    else{
        subjectLine = 'Vaccine Availability Update by NotifyMe';
        message = 'Hi there, <br/>';
    }
    console.log("in send email: slotdetails: ");

    
    if( !Object.keys(centerDetails).length ){
        message += '<div><p>Vaccine is currently not available for 14days from <strong>' +date+ '</strong> in your registered pincode area :<strong>'+ user.pincode + ' </strong>'+
        '<br/>Will update you soon as soon as vaccine gets available.</p>'+
        '<h6>To unsubscribe from getting notifications click, <a href="" style="color:blue">Unsubscribe</a> </h6></div>'+
        '<p>If you have any suggestion or want to collaboarate in this intiative, please reach out to me at  </p>'+
        '<div><p><i>We treat all your personal data with care and only uses it for sending email notifications.</i><br/>'+ 
        '<i>(Trying my best to provide accurate informations, as this is not official intiative, the data might not be exact.'+
        'Please keep checking your COWIN website and Aarogya Setu application.)</i></p>'+
        '<p>Made with &#128151; by Rahul.</p></div>' ;
    }
    else{
        //let validCentersDetails = JSON.stringify(centerDetails, null, '\t');
        message = createTemplate(message, centerDetails, date, user);
    }

    console.log("message: ");
        console.log(message);

    let options = {
        from: String('NotifyMe (A Vaccine-Notifier)' + process.env.MAIL_USERNAME),
        to: user.email,
        subject: subjectLine,
        html: message
    };
    nodemailerTransporter.sendMail(options, (error, info) => {
        if (error) {
            return callback(error);
        }
        callback(error, info);
    });
};