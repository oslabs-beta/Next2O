// import {v4 as uuidv4} from 'uuid';
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const currentTab = await chrome.tabs.get(activeInfo.tabId);
  let currentTabURL;
  // if (!/^https?:\/\//i.test(currentTab.url)) {
  //   currentTab.url = `https://${currentTab.url}`;
  //   console.log('currentTab.url>>'+ currentTab.url);
  // }
  if (!/^(https?|chrome):\/\//i.test(currentTab.url)) {
    currentTab.url = `https://${currentTab.url}`;
    console.log('currentTab.url>>'+ currentTab.url);
  }
  if(!/^(http:\/\/|https:\/\/|chrome:\/\/|about:|data:|javascript:|chrome-extension:|chrome-devtools:|moz-extension:|moz-extension:|ms-browser-extension:).*$/.test(currentTab.url)){
    console.log("this is an internal page")
    return;
  }
  try {
    currentTabURL = new URL(currentTab.url);
    console.log('currentTabURL>>'+ currentTabURL);
  } catch (error) {
    console.log(`Failed to construct URL: ${error}`);
    console.log(currentTab.url)
    return;
  }
  const cookieUrl = currentTabURL.href;
  
  chrome.cookies.get({url: cookieUrl, name: "userId"}, (cookie) => {
    let userId;
    if (cookie) {
      userId = cookie.value;
    } else {
      userId = Math.floor(Math.random() * 1000000).toString();
       // generate a new unique value here
    }
    const sixMonthsInMilliseconds = 15778476000;
    const expirationDate = new Date(Date.now() + sixMonthsInMilliseconds);

    chrome.cookies.set({
      url: cookieUrl,  
      name: "userId",
      value: userId,
      httpOnly: true,
      expirationDate: expirationDate.getTime()/1000
    });
  });
  chrome.cookies.get({url: cookieUrl, name: "userId"}, (cookie) => {
   console.log(cookie);
  });
});
