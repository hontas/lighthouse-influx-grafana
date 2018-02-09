const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const perfConfig = require('lighthouse/lighthouse-core/config/perf.json');
const log = require('lighthouse-logger');

function launchChromeAndRunLighthouse(url, opts = {}) {
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, perfConfig).then(results =>
      chrome.kill().then(() => results));
  });
}

const opts = {
  logLevel: 'info',
  chromeFlags: ['--headless']
};
log.setLevel(opts.logLevel);

// Usage:
launchChromeAndRunLighthouse('https://hontas.github.io/tajmr/', opts).then(results => {
  delete results.artifacts;
  delete results.runtimeConfig;
  delete results.reportCategories;
  delete results.reportGroups;

  const { audits } = results;
  results.audits = Object.keys(audits).reduce((res, key) => {
    const { score, displayValue, error } = audits[key];
    res[key] = { score, displayValue, error };
    return res;
  }, {});
  console.log(results);
});;
