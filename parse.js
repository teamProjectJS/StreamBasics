const csv = require('csvtojson');
const fs = require('fs');

const Transform = require('./TransformStream');

const timer = require('./timer');
const { limit, interval } = require('./config');

const booksCsv = 'books.csv';
const authorsCsv = 'authors.csv';
const booksJson = 'books.json';
const authorsJson = 'authors.json';
const booksToAuthors = 'books-to-authors.json';


function parse(csvFile, jsonFile) {
  return new Promise((resolve, reject) => {
    const write = fs.createWriteStream(jsonFile);
    const timeInstance = timer(limit, interval);

    csv()
      .fromFile(csvFile)
      .pipe(write);

    write
      .on('close', () => {
        clearInterval(timeInstance);
        resolve();
      })
      .on('error', error => reject(error));
  });
}

function generateBooksToAuthors(books, authors, resultFile) {
  return new Promise((resolve, reject) => {
    const timeInstance = timer(limit, interval);
    const writableStream = fs.createWriteStream(resultFile);
    const transformStream = new Transform();
    const transform2 = new Transform();
    let authorsArray = [];
    let book = {};
    let authorsStreamEnd = false;

    const readBooksStream = csv()
      .fromFile(books);

    let readAuthorsStream = csv()
      .fromFile(authors)
      .pipe(transformStream);

    function process(booksStream, authorsStream) {
      if (booksStream.isPaused() && authorsStream.isPaused()) {
        Object.assign(book, { authors: authorsArray });
        writableStream.write(`${JSON.stringify(book)}\n`);
        authorsArray = [];
        book = undefined;
        booksStream.resume();
        authorsStream.resume();
      }

      if (book !== undefined && authorsStreamEnd) {
        readAuthorsStream = csv()
          .fromFile(authors)
          .pipe(transform2);
      }
    }

    readBooksStream.on('data', (chunk) => {
      readBooksStream.pause();
      book = JSON.parse(chunk.toString());
      process(readBooksStream, readAuthorsStream);
    });

    readBooksStream.on('end', () => {
      writableStream.end();
    });

    transformStream.on('end', () => {
      authorsStreamEnd = true;
      process(readBooksStream, transformStream);
    });

    transform2.on('end', () => {
      writableStream.end();
    });

    transformStream.on('data', (chunk) => {
      transformStream.pause();
      authorsArray = chunk.toString().split(', ');
      authorsArray = authorsArray.map(element => JSON.parse(element));
      process(readBooksStream, transformStream);
    });

    transform2.on('data', (chunk) => {
      transform2.pause();
      authorsArray = chunk.toString().split(', ');
      authorsArray = authorsArray.map(element => JSON.parse(element));
      process(readBooksStream, transform2);
    });

    writableStream
      .on('close', () => {
        clearInterval(timeInstance);
        resolve();
      })
      .on('error', error => reject(error));
  });
}

Promise.all([
  parse(booksCsv, booksJson), parse(authorsCsv, authorsJson),
  generateBooksToAuthors(booksCsv, authorsCsv, booksToAuthors),
])
  .then(() => console.log('finished'))
  .catch((err) => {
    console.error('ERR: ', err);
    process.exit(1);
  });
