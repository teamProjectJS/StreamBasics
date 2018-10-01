const fs = require('fs');
const Source = require('./readable');

const timer = require('./timer');
const { limit, interval } = require('./config');


const books = {
  fileName: 'books.csv',
  fileLenght: 1e+6,
  headers: ['id', 'title'],
};
const authors = {
  fileName: 'authors.csv',
  fileLenght: 2e+6,
  headers: ['id', 'firstName', 'lastName'],
};

function generateFile(obj) {
  return new Promise((resolve, reject) => {
    const { fileName, fileLenght, headers } = obj;
    const write = fs.createWriteStream(fileName);

    const t = timer(limit, interval);
    const r = new Source(fileLenght, headers);

    r.pipe(write);
    write.on('close', () => {
      clearInterval(t);
      return resolve();
    });

    write.on('error', error => reject(error));
  });
}
Promise.all(
  [generateFile(books), generateFile(authors)],
)
  .then(() => console.log('finished'))
  .catch((err) => {
    console.error('ERR: ', err);
    process.exit(1);
  });

// generateFile(books)
//   .then(() => console.log('finished'))
//   .catch((err) => {
//     console.error('ERR: ', err);
//     process.exit(1);
//   });

// generateFile(authors)
//   .then(() => console.log('finished'))
//   .catch((err) => {
//     console.error('ERR: ', err);
//     process.exit(1);
//   });
