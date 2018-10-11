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

const timeInstance = timer(limit, interval);

function parse(csvFile, jsonFile) {
  return new Promise((resolve, reject) => {
    const write = fs.createWriteStream(jsonFile);

    csv()
      .fromFile(csvFile)
      .pipe(write);

    write
      .on('close', () => {
        resolve();
      })
      .on('error', error => reject(error));
  });
}

function generateBooksToAuthors(booksFile, authorsFile, resultFile) {
  return new Promise((resolve, reject) => {
    const writableStream = fs.createWriteStream(resultFile);
    let authors = [];
    let book = {};
    let booksStreamEnd = false;

    const readBooksStream = createBookStream();
    let readAuthorsStream = createAuthorsStream();

    function createBookStream() {
      const BooksStream = csv().fromFile(booksFile);

      BooksStream
        .on('data', (chunk) => {
          BooksStream.pause();
          book = JSON.parse(chunk.toString());
          process(BooksStream, readAuthorsStream);
        })
        .on('end', () => {
          booksStreamEnd = true;
        })
        .on('error', error => reject(error));

      return BooksStream;
    }

    function createAuthorsStream() {
      const authorsStream = csv().fromFile(authorsFile).pipe(new Transform());

      authorsStream
        .on('data', (chunk) => {
          authorsStream.pause();
          authors = chunk;
          process(readBooksStream, authorsStream);
        })
        .on('error', error => reject(error))
        .on('end', () => {
          if (book === undefined) {
            writableStream.end();
          } else {
            readAuthorsStream = createAuthorsStream();
          }
        });

      return authorsStream;
    }

    function process(booksStream, authorsStream) {
      if (booksStream.isPaused() && authorsStream.isPaused()) {
        writableStream.write(
          `${JSON.stringify({ ...book, authors })}\n`,
        );
        book = undefined;
        if (booksStreamEnd) {
          writableStream.end();
        }
        authorsStream.resume();
        booksStream.resume();
      }
    }

    writableStream
      .on('close', () => resolve())
      .on('error', error => reject(error));
  });
}

Promise.all([
  parse(booksCsv, booksJson),
  parse(authorsCsv, authorsJson),
  generateBooksToAuthors(booksCsv, authorsCsv, booksToAuthors),
])
  .then(() => {
    clearInterval(timeInstance);
    console.log('finished');
  })
  .catch((err) => {
    console.error('ERR: ', err);
    clearInterval(timeInstance);
    process.exit(1);
  });
