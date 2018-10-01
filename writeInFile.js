module.exports = function writeInFile(writer, lengthF, headers) {
  let l = 0;
  function write() {
    let ok = true;
    do {
      l += 1;
      if (l > lengthF) {
        return writer.end();
      }
      if (headers.length === 2) {
        ok = writer.write(`${headers[0]} ${l},${headers[1]} ${l}\n`);
      } else {
        ok = writer.write(`${headers[0]} ${l},${headers[1]} ${l},${headers[2]} ${l}\n`);
      }
    }
    while (l <= lengthF && ok);
    if (l < lengthF) {
      writer.once('drain', write);
    }
  }
  write();
};
