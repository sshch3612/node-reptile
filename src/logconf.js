const log4js = require("log4js");

const logOption = {
  appenders: {logFile: {
      type: "file",
      filename: "./logs/file.log"
      // maxLogSize: 104800,
      // backups: 100
    },
    // logDate: {
    //   type: "dateFile",
    //   filename: "./logs/log_date/date",
    //   alwaysIncludePattern: true,
    //   pattern: "-yyyy-MM-dd.log"
    // }
  },
  // replaceConsole: true,
  categories: { default: { appenders: ["logFile"], level: "ALL" } }
};

log4js.configure(logOption);
const Logger = log4js.getLogger('logFile');

module.exports = Logger;

// const log4js = require('log4js');
// log4js.configure({
//   appenders: { cheese: { type: 'file', filename: './logs/cheese.log' } },
//   categories: { default: { appenders: ['cheese'], level: 'ALL' } }
// });
 
// const logger = log4js.getLogger('cheese');
// logger.trace('Entering cheese testing');
// logger.debug('Got cheese.');
// logger.info('Cheese is Comté.');
// logger.warn('Cheese is quite smelly.');
// logger.error('Cheese is too ripe!');
// logger.fatal('Cheese was breeding ground for listeria.');