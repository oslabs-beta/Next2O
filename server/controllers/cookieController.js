// const uuid = require('uuid');
// const cookieController = {};

// cookieController.setCookies = (req, res, next) => {
//   const userId= req.body.userId || uuid.v4();
//   res.cookie('userId',userId, {
//     maxAge: 30* 24 * 60 * 60 * 1000,
//     //httpOnly: true,
//     // secure: true,
//     //expirationDate: (new Date().getTime()/1000) + 3600
//   });
//   return next();
// };

// cookieController.getCookies = (req, res, next) =>{
//   const {userId, maxAge} = req.body;
//   const currentTime = new Date().getTime();
//   const createdTime = req.signedCookie.created_at;
// }

//module.exports = cookieController;