const fs = require('fs');
const Source = require('./readable');

const timer = require('./timer');
const { limit, interval } = require('./config');


const books = {
  fileName: 'books.csv',
  fileLength: 10,
  headers: ['id', 'title'],
};
const authors = {
  fileName: 'authors.csv',
  fileLength: 12,
  headers: ['id', 'firstName', 'lastName'],
};

function generateFile({ fileName, fileLength, headers }) {
  return new Promise((resolve, reject) => {
    const write = fs.createWriteStream(fileName);

    const timeInstance = timer(limit, interval);
    const readableStream = new Source(fileLength, headers);

    readableStream.pipe(write);
    write.on('close', () => {
      clearInterval(timeInstance);
      resolve();
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
