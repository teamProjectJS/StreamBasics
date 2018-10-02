const csv = require('csvtojson');
const fs = require('fs');

const timer = require('./timer');
const { limit, interval } = require('./config');

const booksCsv = 'books.csv';
const authorsCsv = 'authors.csv';
const booksJson = 'books.json';
const authorsJson = 'authors.json';

function parse(csvFile, jsonFile) {
  return new Promise((resolve, reject) => {
    const write = fs.createWriteStream(jsonFile);
    const t = timer(limit, interval);

    csv()
      .fromFile(csvFile)
      .pipe(write);

    write.on('close', () => {
      clearInterval(t);
      return resolve();
    });

    write.on('error', error => reject(error));
  });
}

parse(booksCsv, booksJson)
  .then(() => console.log('finished'))
  .catch((err) => {
    console.error('ERR: ', err);
    process.exit(1);
  });

parse(authorsCsv, authorsJson)
  .then(() => console.log('finished'))
  .catch((err) => {
    console.error('ERR: ', err);
    process.exit(1);
  });
