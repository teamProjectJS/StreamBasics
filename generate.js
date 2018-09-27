const fs = require('fs');
const csv = require('csv');

const file = fs.createWriteStream('books.csv');

const generator = csv.generate({ columns: ['int', 'ascii'], length: 1e+6});
generator.pipe(file);
