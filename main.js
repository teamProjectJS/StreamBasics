const timer = require('./timer.js');
const fs = require('fs');

timer();
console.log(interval);
setTimeout(() => {
  clearInterval(interval);
},
1000);
