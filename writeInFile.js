module.exports = function writeInFile(writer, lengthOfFile, headers) {
  let l = 0;
  function write() {
    let ok = true;
    do {
      l += 1;
      if (l > lengthOfFile) {
        return writer.end();
      }
      if (headers.length === 2) {
        ok = writer.write(`${headers[0]} ${l},${headers[1]} ${l}\n`);
      } else {
        ok = writer.write(`${headers[0]} ${l},${headers[1]} ${l},${headers[2]} ${l}\n`);
      }
    }
    while (l <= lengthOfFile && ok);
    if (l < lengthOfFile) {
      writer.once('drain', write);
    }
  }
  write();
};
