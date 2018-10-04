const csv = require('csvtojson');
const fs = require('fs');

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
    let authorsArray = [];
    let book;

    function process(booksStream, authorsStream) {
      if (booksStream.isPaused() && authorsStream.isPaused()) {
        Object.assign(book, { authors: authorsArray });
        writableStream.write(`${JSON.stringify(book)}\n`);
        authorsArray = [];
        booksStream.resume();
        authorsStream.resume();
      }
    }

    const readBooksStream = csv()
      .fromFile(books);
    const readAuthorsStream = csv()
      .fromFile(authors);

    readBooksStream.on('data', (chunk) => {
      readBooksStream.pause();
      book = JSON.parse(chunk.toString());
      process(readBooksStream, readAuthorsStream);
    });

    readAuthorsStream.on('data', (chunk) => {
      readAuthorsStream.pause();
      authorsArray.push(JSON.parse(chunk.toString()));
      process(readBooksStream, readAuthorsStream);
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
