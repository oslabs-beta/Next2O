//const uuid = require('uuid');

chrome.runtime.onInstalled.addListener(async() => {
  const currentTab = await chrome.tabs.query({active: true, currentWindow: true});
  console.log('heloo')
  chrome.cookies.set({
    url: currentTab[0].url,  
    name: "userId",
    value: '1234567',
    // secure: true,
    // httpOnly: true,
    expirationDate: (new Date().getTime()/1000) + 3600
  });
  chrome.cookies.get({url: currentTab[0].url, name: "userId"}, (cookie) => {
  console.log(cookie);
});
});