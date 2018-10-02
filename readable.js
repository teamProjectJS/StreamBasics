const { Readable } = require('stream');

module.exports = class Source extends Readable {
  constructor(length, headers) {
    super();
    this.length = length;
    this.headers = headers;
    this.index = 1;
    this.line = `${this.headers.join()} \n`;
  }

  _read() {
    const i = this.index++;
    if (i > this.length) {
      this.push(null);
    } else {
      this.line = this.headers.reduce((accumulator, currentValue, currentIndex) => {
        accumulator += `${currentValue} ${i}`;
        if (currentIndex === this.headers.length - 1) {
          accumulator += '\n';
          return accumulator;
        }
        accumulator += ',';
        return accumulator;
      }, this.line);
      this.push(this.line);
      this.line = '';
    }
  }
};
