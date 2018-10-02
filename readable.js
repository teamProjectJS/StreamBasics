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
      this.line = this.headers.reduce((str, currentValue) => {
        str += `${currentValue} ${i},`;
        return str;
      }, this.line);
      this.line = this.line.slice(0, this.line.length - 1).concat('\n');
      this.push(this.line);
      this.line = '';
    }
  }
};
