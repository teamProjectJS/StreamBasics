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

const writableStream = fs.createWriteStream(booksToAuthors);
let authors = [];
let book = {};

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

function process(booksStream, authorsStream) {
  if (booksStream.isPaused() && authorsStream.isPaused()) {
    writableStream.write(
      `${JSON.stringify({ ...book, authors })}\n`,
    );
    book = undefined;
    booksStream.resume();
    authorsStream.resume();
  }
}

function generateBooksToAuthors(booksFile, authorsFile) {
  return new Promise((resolve, reject) => {
    const timeInstance = timer(limit, interval);
    let transformStream = new Transform();
    let booksStreamEnd = false;
    const readBooksStream = csv().fromFile(booksFile);

    let readAuthorsStream = csv()
      .fromFile(authorsFile)
      .pipe(transformStream);

    readBooksStream.on('data', (chunk) => {
      readBooksStream.pause();
      book = JSON.parse(chunk.toString());
      process(readBooksStream, readAuthorsStream);
    });

    transformStream.on('data', (chunk) => {
      transformStream.pause();
      authors = chunk;
      process(readBooksStream, transformStream);
    });

    readAuthorsStream.on('error', (error) => {
      clearInterval(timeInstance);
      reject(error);
    });

    readBooksStream
      .on('end', () => {
        booksStreamEnd = true;
        writableStream.end();
      })
      .on('error', (error) => {
        clearInterval(timeInstance);
        reject(error);
      });

    transformStream
      .on('end', () => {
        if (!booksStreamEnd) {
          transformStream = new Transform();
          readAuthorsStream = csv()
            .fromFile(authorsFile)
            .pipe(transformStream);
        }
        transformStream.on('data', (chunk) => {
          transformStream.pause();
          authors = chunk;
          process(readBooksStream, transformStream);
        });
      });

    transformStream.on('error', (error) => {
      clearInterval(timeInstance);
      reject(error);
    });

    writableStream
      .on('close', () => {
        clearInterval(timeInstance);
        resolve();
      })
      .on('error', (error) => {
        clearInterval(timeInstance);
        reject(error);
      });
  });
}

Promise.all([
  parse(booksCsv, booksJson),
  parse(authorsCsv, authorsJson),
  generateBooksToAuthors(booksCsv, authorsCsv),
])
  .then(() => console.log('finished'))
  .catch((err) => {
    console.error('ERR: ', err);
    process.exit(1);
  });
