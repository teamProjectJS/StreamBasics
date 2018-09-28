
module.exports = function timer(limit, interval) {
  return setInterval(() => {
    const usedMemory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100;
    if (usedMemory <= limit) {
      return console.log(usedMemory);
    }
    throw new Error(`Memory usage > ${limit} Mb`);
  },
  interval);
};
