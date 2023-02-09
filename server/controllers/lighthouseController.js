const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const lighthouseController = {};

async function launchChromeAndRunLighthouse(url) {
  const chrome = await chromeLauncher.launch({startingUrl: url, chromeFlags: ['--headless',
  '--enable-logging', '--disable-gpu','--disable-dev-shm-usage']})
    // '--remote-debugging-port=9222', '--ignore-certificate-errors']});
  const opts = {logLevel: 'info', output: 'json', onlyCategories: ['seo', 'performance', 'accessibility']};
  opts.port = chrome.port
  const runnerResult = await lighthouse(url, opts);
  await chrome.kill();
  return runnerResult.report
};

lighthouseController.generateReport = async (req, res, next) => {
  //console.log(req.body)
  const {url} = req.body;
  console.log('url> '+url);
  // const {cookies} = req.headers;
  //console.log(req.headers);
  try {
    const report = await launchChromeAndRunLighthouse(url);
    res.locals.report = report
    return next();
  } catch (err){
    console.log(err)
      return next({
        log: 'Express error handler caught error in lighthouseController.generateReport',
        message: { err: 'lighthouseController.generateReport: check server log for details' } 
      });
  } 
};

module.exports = lighthouseController;