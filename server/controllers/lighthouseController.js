const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
//const fs = require('fs');

const lighthouseController = {};

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

};

lighthouseController.generateReport = async (req, res, next) => {
  //console.log(req.body)
  const {url, cookies} = req.body;
  // const {cookies} = req.headers;
  console.log(req.headers);
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