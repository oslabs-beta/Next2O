// require('dotenv').config();
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// module.exports = {

//     sendMail(req, res, next) {
//         const { to, message } = req.body
//         const htmlBody = `
//         <h1>Next2O</h1>
        
//         `
//         const msg = {
//             to: to,
//             from: process.env.EMAIL, // Use the email address or domain you verified above
//             subject: 'SEO Score',
//             // text: 'and easy to do anywhere, even with Node.js',
//             html: htmlBody,
//         };
//         //ES6
//         sgMail
//             .send(msg)
//             .then(() => {
//                 res.json({
//                     message: 'email sent successfully'
//                 })
//              })
//             .catch(error => {
//                 console.error(error);
//                 if (error.response) {
//                     console.error(error.response.body)
//                 }
//                 res.status(500).json({
//                     message: 'Oops, something went wrong'
//                 })
//             })
//     }
// }





