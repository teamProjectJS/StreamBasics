const { Readable } = require('stream');

module.exports = class Source extends Readable {
  constructor(length, headers) {
    super();
    this.length = length;
    this.headers = headers;
    this.index = 1;
  }

  _read() {
    const i = this.index++;
    if (i > this.length) {
      this.push(null);
    } else {
      let line = '';
      for (let j = 0; j < this.headers.length; j += 1) {
        line += `${this.headers[j]} ${i}`;
        if (j === this.headers.length -1) {
          line += '\n';
        } else {
          line += ', ';
        }
      }
      this.push(line);
      line = '';
    }
  }
};
