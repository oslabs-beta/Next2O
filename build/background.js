/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
//import {v4 as uuidv4} from 'uuid';

//fetch if user sync is not enabled by adding "accountStatus" param
//may need to be inside try block for legacy chrome users - otherwise it returns empy object for non-synced accounts
let email;
chrome.runtime.onInstalled.addListener(function () {
  chrome.identity.getProfileUserInfo({'accountStatus': 'ANY'}, function(info) {
    email = info.email;
    let information = {};
    console.log(info);
    information=JSON.stringify(info);
    console.log(information);
  });
});
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

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBLFVBQVUsY0FBYzs7QUFFeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsdUJBQXVCO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLGtDQUFrQztBQUNoRTtBQUNBO0FBQ0EsNkJBQTZCLG9DQUFvQztBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RUFBeUUsSUFBSTtBQUM3RTtBQUNBO0FBQ0EsZUFBZTtBQUNmLHVEQUF1RCxJQUFJO0FBQzNELDZCQUE2QixtQkFBbUI7QUFDaEQ7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBOztBQUVBLGlDQUFpQyx5QkFBeUI7QUFDMUQ7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0EsaUNBQWlDLHdDQUF3QztBQUN6RTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEIsY0FBYztBQUNkLFlBQVk7QUFDWixXQUFXO0FBQ1gsbURBQW1ELE1BQU07QUFDekQseUJBQXlCLHFCQUFxQjtBQUM5QztBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLE1BQU0iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaHJvbWUtZXh0Ly4vc3JjL2JhY2tncm91bmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy9pbXBvcnQge3Y0IGFzIHV1aWR2NH0gZnJvbSAndXVpZCc7XG5cbi8vZmV0Y2ggaWYgdXNlciBzeW5jIGlzIG5vdCBlbmFibGVkIGJ5IGFkZGluZyBcImFjY291bnRTdGF0dXNcIiBwYXJhbVxuLy9tYXkgbmVlZCB0byBiZSBpbnNpZGUgdHJ5IGJsb2NrIGZvciBsZWdhY3kgY2hyb21lIHVzZXJzIC0gb3RoZXJ3aXNlIGl0IHJldHVybnMgZW1weSBvYmplY3QgZm9yIG5vbi1zeW5jZWQgYWNjb3VudHNcbmxldCBlbWFpbDtcbmNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKGZ1bmN0aW9uICgpIHtcbiAgY2hyb21lLmlkZW50aXR5LmdldFByb2ZpbGVVc2VySW5mbyh7J2FjY291bnRTdGF0dXMnOiAnQU5ZJ30sIGZ1bmN0aW9uKGluZm8pIHtcbiAgICBlbWFpbCA9IGluZm8uZW1haWw7XG4gICAgbGV0IGluZm9ybWF0aW9uID0ge307XG4gICAgY29uc29sZS5sb2coaW5mbyk7XG4gICAgaW5mb3JtYXRpb249SlNPTi5zdHJpbmdpZnkoaW5mbyk7XG4gICAgY29uc29sZS5sb2coaW5mb3JtYXRpb24pO1xuICB9KTtcbn0pO1xuLy8gY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKFxuLy8gICAocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbi8vICAgICBpZiAocmVxdWVzdC5tZXNzYWdlID09PSBcImdldF9jdXJyZW50X3RhYl91cmxcIikge1xuLy8gICAgICAgdHJ5IHtcbi8vICAgICAgICAgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0sICh0YWJzKSA9PiB7XG4vLyAgICAgICAgICAgaWYgKCF0YWJzIHx8ICF0YWJzLmxlbmd0aCkge1xuLy8gICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogTm8gYWN0aXZlIHRhYiBmb3VuZFwiKTtcbi8vICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7ZXJyb3I6IFwiRXJyb3I6IE5vIGFjdGl2ZSB0YWIgZm91bmRcIn0pO1xuLy8gICAgICAgICAgICAgcmV0dXJuO1xuLy8gICAgICAgICAgIH1cbi8vICAgICAgICAgICBjb25zdCB1cmwgPSB0YWJzWzBdLnVybDtcbi8vICAgICAgICAgICBpZighdXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJ0YWJzWzBdLnVybCBpcyB1bmRlZmluZWRcIik7XG4vLyAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIFVSTCBpcyB2YWxpZFxuLy8gICAgICAgICAgIGNvbnN0IHBhcnNlZFVybCA9IG5ldyBVUkwodXJsKTtcbi8vICAgICAgICAgICB0cnkge1xuLy8gICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBVUkwgaXMgYW4gaW50ZXJuYWwgcGFnZVxuLy8gICAgICAgICAgICAgaWYgKHBhcnNlZFVybC5wcm90b2NvbCAhPT0gXCJodHRwczpcIiAmJiBwYXJzZWRVcmwucHJvdG9jb2wgIT09IFwiaHR0cDpcIikge1xuLy8gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBzZXQgY29va2llIGZvciBpbnRlcm5hbCBwYWdlOiAke3VybH1gKTtcbi8vICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICBcbi8vICAgICAgICAgICB9IGNhdGNoKGVycikge1xuLy8gICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIGhhbmRsaW5nIHJlc3BvbnNlOiAke2Vycn1gKTtcbi8vICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7ZXJyb3I6IGVyci5tZXNzYWdlfSk7XG4vLyAgICAgICAgICAgICByZXR1cm47XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICAgIGxldCByZXNwb25zZURhdGEgPSB7dXJsLCBkb21haW46IHBhcnNlZFVybC5ob3N0bmFtZX07XG4vLyAgICAgICAgICAgY29uc3Qgc2l4TW9udGhzSW5NaWxsaXNlY29uZHMgPSAxNTc3ODQ3NjAwMDtcbi8vICAgICAgICAgICBjb25zdCBleHBpcmF0aW9uRGF0ZSA9IG5ldyBEYXRlKERhdGUubm93KCkgKyBzaXhNb250aHNJbk1pbGxpc2Vjb25kcyk7XG5cbi8vICAgICAgICAgICBjaHJvbWUuY29va2llcy5nZXQoe3VybDogdXJsLCBuYW1lOiBcInVzZXJJZFwifSwgKGNvb2tpZSkgPT4ge1xuLy8gICAgICAgICAgICAgbGV0IHVzZXJJZDtcbi8vICAgICAgICAgICAgIGlmIChjb29raWUpIHtcbi8vICAgICAgICAgICAgICAgdXNlcklkID0gY29va2llLnZhbHVlO1xuLy8gICAgICAgICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgICAgICAgdXNlcklkID0gdXVpZHY0KCk7XG4vLyAgICAgICAgICAgICAgIC8vIGdlbmVyYXRlIGEgbmV3IHVuaXF1ZSB2YWx1ZSBoZXJlXG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICByZXNwb25zZURhdGEudXNlcklkID0gdXNlcklkO1xuLy8gICAgICAgICAgICAgY29uc29sZS5sb2coY29va2llKTtcbi8vICAgICAgICAgICAgIC8vIFNldCB0aGUgY29va2llIGhlcmVcbi8vICAgICAgICAgICAgIGNocm9tZS5jb29raWVzLnNldCh7XG4vLyAgICAgICAgICAgICAgIHVybDogdXJsLFxuLy8gICAgICAgICAgICAgICBuYW1lOiBcInVzZXJJZFwiLFxuLy8gICAgICAgICAgICAgICB2YWx1ZTogdXNlcklkLFxuLy8gICAgICAgICAgICAgICBodHRwT25seTogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgZXhwaXJhdGlvbkRhdGU6IE1hdGguZmxvb3IoZXhwaXJhdGlvbkRhdGUuZ2V0VGltZSgpLzEwMDApLFxuLy8gICAgICAgICAgICAgICBkb21haW46IHBhcnNlZFVybC5ob3N0bmFtZVxuLy8gICAgICAgICAgICAgfSwgYXN5bmMgKGNvb2tpZSk9Pntcbi8vICAgICAgICAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuLy8gICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7ZXJyb3I6IGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlfSk7XG4vLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpXG4vLyAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHJlc3BvbnNlRGF0YSk7XG4vLyAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICB9KTtcbi8vICAgICAgICAgfSk7XG4vLyAgICAgICB9IGNhdGNoIChlcnJvcikge1xuLy8gICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgaGFuZGxpbmcgcmVzcG9uc2U6ICR7ZXJyb3J9YCk7XG4vLyAgICAgICAgIHNlbmRSZXNwb25zZSh7ZXJyb3I6IGVycm9yLm1lc3NhZ2V9KTtcbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgICAgcmV0dXJuIHRydWU7IC8vIFJlcXVpcmVkIGZvciBhc3luYyBtZXNzYWdlIHNlbmRpbmcgdG8gY2xvc2UgdGhlIG1lc3NhZ2Ugc2VuZGluZ1xuLy8gICB9KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==