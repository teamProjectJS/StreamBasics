const { Transform } = require('stream');

module.exports = class MyTransform extends Transform {
  constructor(options) {
    super(options);
    this.authorsArray = [];
    this.authorsAmount = MyTransform.getRandomNumber(1, 3);
  }

  static getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  _transform(data, encoding, done) {
    if (this.authorsArray.length < this.authorsAmount) {
      this.authorsArray.push(data.toString());
      done();
    } else {
      const res = `${this.authorsArray.join(', ')}\n`;

      this.authorsArray = [];
      this.authorsAmount = MyTransform.getRandomNumber(1, 3);

      done(null, res);
    }
  }
};
