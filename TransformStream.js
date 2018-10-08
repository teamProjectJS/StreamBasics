const { Transform } = require('stream');

module.exports = class MyTransform extends Transform {
  constructor(options) {
    super(options);
    this.authorsArray = [];
    this.authorsAmount = MyTransform.getRandomNumber(1, 4);
  }

  static getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  _transform(data, encoding, done) {
    this.authorsArray.push(data.toString());
    if (this.authorsArray.length < this.authorsAmount) {
      done();
    } else {
      const res = `${this.authorsArray.join(', ')}\n`;

      this.authorsArray = [];
      this.authorsAmount = MyTransform.getRandomNumber(1, 4);

      done(null, res);
    }
  }
};
