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
    // if (this.index === 1) {
    //   this.push(`${this.headers.join()} \n`);
    // }
    const i = this.index++;
    if (i > this.length) {
      this.push(null);
    } else {
      // let line = '';
      for (let j = 0; j < this.headers.length; j += 1) {
        this.line += `${this.headers[j]} ${i}`;
        if (j === this.headers.length -1) {
          this.line += '\n';
        } else {
          this.line += ', ';
        }
      }
      this.push(this.line);
      this.line = '';
    }
  }
};
