const nodeMailer = require("../config/nodemailer");

exports.resetPassword = (accessToken) => {
    let htmlString = nodeMailer.renderTemplate({accessToken: accessToken}, "/reset_password/reset_password.ejs");

// module.exports.resetPassword = function(accessToken){

//     let htmlString = nodeMailer.renderTemplate({accessToken:accessToken} , "/reset_password/reset_password.ejs");

    nodeMailer.transporter.sendMail({
        from: 'nsurajrajan@gmail.com', // sender address
        to: accessToken.user.email, // list of receivers
        subject: "FriendME : Reset Password", // Subject line
        html: htmlString // html body
      } , function(err , info){
          if(err){console.log("Error in sending mail",err);return;}
          console.log("Message Sent" , info);
          return;
      });
}