const { Transform } = require('stream');

module.exports = class MyTransform extends Transform {
  constructor(options) {
    super(options);
    this.data = [];
    this.authorsAmount = MyTransform.getRandomNumber(1, 3);
  }

  static getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  _transform(data, encoding, done) {
    if (this.data.length < this.authorsAmount) {
      this.data.push(data.toString());
      done();
    } else {
      this.data.push(data.toString());
      const res = `${this.data.join(',')}\n`;

      this.data = [];
      this.authorsAmount = MyTransform.getRandomNumber(1, 3);

      done(null, res);
    }
  }
};
