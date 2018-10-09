const { Readable } = require('stream');

module.exports = class Source extends Readable {
  constructor(length, headers) {
    super();
    this.length = length;
    this.headers = headers;
    this.index = 1;
    this.push(`${this.headers.join()} \n`);
  }

  _read() {
    let line;
    const i = this.index++;
    if (i > this.length) {
      this.push(null);
    } else {
      line = this.headers.reduce((str, currentValue) => {
        str += `${currentValue} ${i},`;
        return str;
      }, '');
      line = `${line.slice(0, -1)}\n`;
      this.push(line);
      line = '';
    }
  }
};
