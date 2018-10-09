const { Transform } = require('stream');
const { maxAuthors } = require('./config');

module.exports = class MyTransform extends Transform {
  constructor() {
    super({ objectMode: true });
    this.authorsArray = [];
    this.setAuthorsAmount();
  }

  setAuthorsAmount() {
    this.authorsAmount = Math.floor(Math.random() * (maxAuthors - 1)) + 1;
  }

  _transform(data, encoding, done) {
    try {
      const author = JSON.parse(data.toString());
      this.authorsArray.push(author);
    } catch (error) {
      console.error(error);
      done(error);
      return;
    }

    if (this.authorsArray.length < this.authorsAmount) {
      done();
    } else {
      const res = [...this.authorsArray];
      this.authorsArray = [];
      this.setAuthorsAmount();

      done(null, res);
    }
  }
};
