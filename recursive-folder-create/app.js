#!/usr/bin/env node

const yargs = require('yargs');
const { DateTime } = require('luxon');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
let details = [];

function makeDayFolders(start, end) {
  const dt = DateTime.fromISO(start);

  const day = padDate(dt.day);
  const month = padDate(dt.month);
  const year = dt.year;
  const diffInDays = getDaysInbetween(start, end);
  if (diffInDays !== 0) {
    downloadFolder =
      (process.env.DOWNLOAD_FOLDER || 'download') +
      '/' +
      year +
      '/' +
      month +
      '/' +
      day;
    makeDir(downloadFolder);
    let newStart = dt.plus({ days: '1' }).toISO();

    details.push({
      downloadFolder: downloadFolder,
      start: dt.toISO(),
      end: newStart,
    });

    makeDayFolders(newStart, end); //recursive function baaaybeeeee
  }
  return details;
}

function getValidDates(args_start, args_end) {
  let start = DateTime.now().toUTC().startOf('day');
  let end = DateTime.now().toUTC().endOf('day');

  if (args_start && args_end) {
    let check_start = DateTime.fromISO(args_start);
    let check_end = DateTime.fromISO(args_end);

    if (check_start.isValid && check_end.isValid) {
      start = check_start.startOf('day');
      end = check_end.endOf('day');
    }
    if (!check_start.isValid) {
      process.exit(1);
    }
    if (!check_end.isValid) {
      process.exit();
    }
    if (check_start > check_end) {
      start = check_end.endOf('day');
      end = check_start.startOf('day');
    }
  }
  return { start, end };
}

function getDaysInbetween(start, end) {
  var start = DateTime.fromISO(start);
  var end = DateTime.fromISO(end);
  var diffInDays = end.diff(start, 'days');
  return Math.floor(diffInDays.days);
}

function padDate(date) {
  if (parseInt(date) < 9) {
    return '0' + date;
  }
  return date;
}

function makeDir(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
}

const argv = yargs
  .usage(
    '$0 [-s start-date] [-e end-date]',
    'Starts process of downloading content for all interactions found between specified dates or listed in file'
  )
  .options({
    start: {
      description: 'Search from date in ISO8601 format',
      alias: 's',
      type: 'string',
    },
    end: {
      alias: 'e',
      description: 'Search until date in ISO8601 format',
      type: 'string',
    },
  })
  .check((argv) => {
    if (!argv.start && !argv.end) {
      argv.start = DateTime.now()
        .minus({ days: 1 })
        .startOf('day')
        .toISO()
        .toString();
      argv.end = DateTime.now()
        .minus({ days: 1 })
        .endOf('day')
        .plus({ second: 1 })
        .toUTC()
        .toString();
    } else if (
      (argv['file-path'] && (argv.start || argv.end)) ||
      (argv.start && !argv.end) ||
      (argv.end && !argv.start)
    ) {
      throw new Error(" 'start' and 'end' dates");
    }
    return true;
  })
  .version(false)
  .help()
  .alias('help', 'h').argv;
console.log(process.env.DOWNLOAD_FOLDER);
let { start, end } = getValidDates(argv.start, argv.end);

makeDayFolders(start, end);

//run with node app.js -s 2022-04-27T00:00:00.000Z -e 2022-06-20T23:59:59.295Z
// or node app.js
