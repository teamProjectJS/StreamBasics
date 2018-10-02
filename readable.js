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
      this.line = this.headers.reduce((acomulator, currentValue, currentIndex) => {
        acomulator += `${currentValue} ${i}`;
        if (currentIndex === this.headers.length - 1) {
          acomulator += '\n';
          return acomulator;
        }
        acomulator += ',';
        return acomulator;
      }, this.line);
      // for (let j = 0; j < this.headers.length; j += 1) {
      //   this.line += `${this.headers[j]} ${i}`;
      //   if (j === this.headers.length -1) {
      //     this.line += '\n';
      //   } else {
      //     this.line += ', ';
      //   }
      // }
      this.push(this.line);
      this.line = '';
    }
  }
};
