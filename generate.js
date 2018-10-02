const fs = require('fs');

const timer = require('./timer');
const { limit, interval } = require('./config');
const writeInFile = require('./writeInFile');

function generateFile(fileName, lengthFile, headers) {
  return new Promise((resolve, reject) => {
    const write = fs.createWriteStream(fileName);

    const t = timer(limit, interval);
    writeInFile(write, lengthFile, headers);

    write.on('close', () => {
      clearInterval(t);
      return resolve();
    });

    write.on('error', error => reject(error));
  });
}

generateFile('books.csv', 1e+6, ['id', 'title'])
  .then(() => console.log('finished'))
  .catch((err) => {
    console.error('ERR: ', err);
    process.exit(1);
  });
