const fs = require('fs');
const csv = require('csv');
const timer = require('./timer');
const {limit, interval: intervalValue} = require('./config');

function generateBooks (lengthFile){
    return new Promise((resolve, reject) => {
    const interval = timer(limit, intervalValue);
    const file = fs.createWriteStream('books.csv');
    
    const generator = csv.generate({ columns: ['int', 'ascii'], length: lengthFile});
    file.on('close', () => {
        clearInterval(interval);
        return resolve();
    })
    file.on('error', (error) => reject(error));
    generator.pipe(file);
    generator.on('error', (error) => reject(error));
});
}
generateBooks(1e+6)
  .then(() => console.log('finished'))
  .catch(err => {
    console.error('ERR: ', err); 
    process.exit(1);
  })

