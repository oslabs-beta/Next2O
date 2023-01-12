const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
//const fs = require('fs');

const lighthouseController = {};

// async function launchChromeAndRunLighthouse(url, opts) {
//   console.log('launchchromerunlighthouse')
//   const chrome = await chromeLauncher.launch({ chromeFlags: ['--disable-gpu', '--headless',
//    '--remote-debugging-port=9222', '--ignore-certificate-errors'] });
//   opts.port = chrome.port;
//   const lhr = await lighthouse(url, opts);

//   await chrome.kill();
//   return lhr;
// };
async function launchChromeAndRunLighthouse(url) {
  const chrome = await chromeLauncher.launch({startingUrl: url, chromeFlags: ['--headless', '--disable-gpu']})
    // '--remote-debugging-port=9222', '--ignore-certificate-errors']});
  const opts = {logLevel: 'info', output: 'json', onlyCategories: ['seo']};
  opts.port = chrome.port
  const runnerResult = await lighthouse(url, opts);
  console.log('runner result')
  console.log(runnerResult)
  await chrome.kill();
  return runnerResult.report

  // `.report` is the HTML report as a string
  // const reportHtml = runnerResult.report;
  // fs.writeFileSync('lhreport.html', reportHtml);

  // // `.lhr` is the Lighthouse Result as a JS object
  // console.log('Report is done for', runnerResult.lhr.finalDisplayedUrl);
  // console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);

};

lighthouseController.generateReport = async (req, res, next) => {
  //console.log(req.body)
  const {url} = req.body;
  
  try {
    const report = await launchChromeAndRunLighthouse(url);
    res.locals.report = report
    return next();
  } catch (err){
    return next({
      log: 'Express error handler caught error in lighthouseController.generateReport',
      message: { err: 'lighthouseController.generateReport: check server log for details' } 
    });
  } 
};

module.exports = lighthouseController;