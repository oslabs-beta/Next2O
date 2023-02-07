//import {v4 as uuidv4} from 'uuid';

//fetch if user sync is not enabled by adding "accountStatus" param
//may need to be inside try block for legacy chrome users - otherwise it returns empy object for non-synced accounts
// let email;
// chrome.runtime.onInstalled.addListener(function () {
//   chrome.identity.getProfileUserInfo({'accountStatus': 'ANY'}, function(info) {
//     email = info.email;
//     let information = {};
//     console.log(info);
//     information=JSON.stringify(info);
//     console.log(information);
//   });
// });
// chrome.runtime.onMessage.addListener(
//   (request, sender, sendResponse) => {
//     if (request.message === "get_current_tab_url") {
//       try {
//         chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
//           if (!tabs || !tabs.length) {
//             console.log("Error: No active tab found");
//             sendResponse({error: "Error: No active tab found"});
//             return;
//           }
//           const url = tabs[0].url;
//           if(!url) throw new Error("tabs[0].url is undefined");
//           // Check if the URL is valid
//           const parsedUrl = new URL(url);
//           try {
//           // Check if the URL is an internal page
//             if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
//               throw new Error(`Cannot set cookie for internal page: ${url}`);
//             } 
            
//           } catch(err) {
//             console.log(`Error handling response: ${err}`);
//             sendResponse({error: err.message});
//             return;
//           }
//           let responseData = {url, domain: parsedUrl.hostname};
//           const sixMonthsInMilliseconds = 15778476000;
//           const expirationDate = new Date(Date.now() + sixMonthsInMilliseconds);

//           chrome.cookies.get({url: url, name: "userId"}, (cookie) => {
//             let userId;
//             if (cookie) {
//               userId = cookie.value;
//             } else {
//               userId = uuidv4();
//               // generate a new unique value here
//             }
//             responseData.userId = userId;
//             console.log(cookie);
//             // Set the cookie here
//             chrome.cookies.set({
//               url: url,
//               name: "userId",
//               value: userId,
//               httpOnly: true,
//               expirationDate: Math.floor(expirationDate.getTime()/1000),
//               domain: parsedUrl.hostname
//             }, async (cookie)=>{
//               if (chrome.runtime.lastError) {
//                 sendResponse({error: chrome.runtime.lastError.message});
//                 console.log(chrome.runtime.lastError.message)
//               }
//               sendResponse(responseData);
//             });
//           });
//         });
//       } catch (error) {
//         console.log(`Error handling response: ${error}`);
//         sendResponse({error: error.message});
//       }
//     }
//     return true; // Required for async message sending to close the message sending
//   });
