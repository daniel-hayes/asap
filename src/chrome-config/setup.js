const AWS = require('aws-sdk');
// const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const path = require('path');
const fs = require('fs');
const tar = require('tar');
const puppeteer = require('puppeteer');

// const isLocal = process.env.IS_LOCAL;
const localChromePath = path.join('headless_shell.tar.gz');
// const remoteChromeS3Bucket = process.env.CHROME_BUCKET;
// const remoteChromeS3Key = process.env.CHROME_KEY || 'headless_shell.tar.gz';
const setupChromePath = path.join(path.sep, 'tmp');
const executablePath = path.join(setupChromePath, 'headless_shell');
const DEBUG = process.env.DEBUG;

exports.getBrowser = (() => {
  let browser;
  return async () => {
    if (typeof browser === 'undefined' || !(await isBrowserAvailable(browser))) {
      await setupChrome();
      browser = await puppeteer.launch({
        headless: true,
        executablePath,
        args: [
          // error when launch(); No usable sandbox! Update your kernel
          '--no-sandbox',
          // error when launch(); Failed to load libosmesa.so
          '--disable-gpu',
          // freeze when newPage()
          '--single-process'
        ],
        dumpio: !!exports.DEBUG
      });
      debugLog(async () => `launch done: ${await browser.version()}`);
    }
    return browser;
  };
})();

const isBrowserAvailable = async browser => {
  try {
    await browser.version();
  } catch (e) {
    debugLog(e); // not opened etc.
    return false;
  }
  return true;
};

const setupChrome = async () => {
  if (!(await existsExecutableChrome())) {
    if (await existsLocalChrome()) {
      debugLog('setup local chrome');
      await setupLocalChrome();
    } else {
      debugLog('setup s3 chrome');
      // await setupS3Chrome();
    }
    debugLog('setup done');
  }
};

const existsLocalChrome = () => {
  return new Promise(resolve => {
    fs.exists(localChromePath, exists => {
      resolve(exists);
    });
  });
};

const existsExecutableChrome = () => {
  return new Promise(resolve => {
    fs.exists(executablePath, exists => {
      resolve(exists);
    });
  });
};

const setupLocalChrome = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(localChromePath)
      .on('error', err => reject(err))
      .pipe(
        tar.x({
          C: setupChromePath
        })
      )
      .on('error', err => reject(err))
      .on('end', () => resolve());
  });
};

// const setupS3Chrome = () => {
//   return new Promise((resolve, reject) => {
//     const params = {
//       Bucket: remoteChromeS3Bucket,
//       Key: remoteChromeS3Key
//     };
//     s3.getObject(params)
//       .createReadStream()
//       .on('error', err => reject(err))
//       .pipe(
//         tar.x({
//           C: setupChromePath
//         })
//       )
//       .on('error', err => reject(err))
//       .on('end', () => resolve());
//   });
// };

const debugLog = log => {
  if (DEBUG) {
    let message = log;
    if (typeof log === 'function') message = log();
    Promise.resolve(message).then(message => console.log(message));
  }
};
